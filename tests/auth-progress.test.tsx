// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';

import type { AuthChangeEvent, Session, SupabaseClient } from '@supabase/supabase-js';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AuthForm, AuthProvider, type AuthClient } from '../src/auth/AuthContext.js';
import { ProgressProvider, useProgress } from '../src/progress/ProgressContext.js';
import {
  createSupabaseProgressRepository,
  type LessonProgressRow,
  type ProgressRepository,
} from '../src/progress/repository.js';

afterEach(cleanup);

function session(id: string, email: string): Session {
  return { user: { id, email } } as unknown as Session;
}

class FakeAuth {
  current: Session | null;
  callback: ((event: AuthChangeEvent, session: Session | null) => void) | null = null;

  constructor(initial: Session | null = null) {
    this.current = initial;
  }

  readonly client = {
    getSession: vi.fn(async () => ({ data: { session: this.current }, error: null })),
    onAuthStateChange: vi.fn((callback: (event: AuthChangeEvent, session: Session | null) => void) => {
      this.callback = callback;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    }),
    signUp: vi.fn(async () => ({ data: { user: { id: 'pending-user' }, session: null }, error: null })),
    signInWithPassword: vi.fn(async ({ email }: { email: string; password: string }) => {
      this.current = session('signed-in-user', email);
      this.callback?.('SIGNED_IN', this.current);
      return { data: { user: this.current.user, session: this.current }, error: null };
    }),
    signOut: vi.fn(async () => {
      this.current = null;
      this.callback?.('SIGNED_OUT', null);
      return { error: null };
    }),
  } as unknown as AuthClient;

  emit(next: Session | null) {
    this.current = next;
    this.callback?.(next === null ? 'SIGNED_OUT' : 'SIGNED_IN', next);
  }
}

class MemoryProgressRepository implements ProgressRepository {
  readonly rows = new Map<string, LessonProgressRow[]>();
  async list(userId: string) { return this.rows.get(userId)?.map(row => ({ ...row })) ?? []; }
  async upsert(userId: string, lessonId: string, completed: boolean, completedAt: string | null) {
    const current = this.rows.get(userId) ?? [];
    this.rows.set(userId, [
      ...current.filter(row => row.lesson_id !== lessonId),
      { lesson_id: lessonId, completed, completed_at: completedAt },
    ]);
  }
}

function ProgressProbe() {
  const { progress, complete, notice } = useProgress();
  return (
    <div>
      <output aria-label="완료 목록">{Object.keys(progress.completedById).sort().join(',')}</output>
      <button type="button" onClick={() => complete('m00-l01', 'revision')}>완료 변경</button>
      {notice && <p role="status">{notice}</p>}
    </div>
  );
}

describe('Supabase authentication UI', () => {
  it('restores a session, shows the email, and signs out', async () => {
    const auth = new FakeAuth(session('user-a', 'a@example.com'));
    render(<AuthProvider client={auth.client}><AuthForm /></AuthProvider>);
    expect(await screen.findByText('a@example.com')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '로그아웃' }));
    expect((await screen.findAllByText('로그인')).length).toBeGreaterThan(0);
    expect(auth.client.signOut).toHaveBeenCalledOnce();
  });

  it('shows the email confirmation instruction when sign-up returns no session', async () => {
    const auth = new FakeAuth();
    render(<AuthProvider client={auth.client}><AuthForm /></AuthProvider>);
    fireEvent.change(await screen.findByLabelText('이메일'), { target: { value: 'new@example.com' } });
    fireEvent.change(screen.getByLabelText('비밀번호'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: '회원가입' }));
    expect(await screen.findByRole('status')).toHaveTextContent('인증 이메일을 확인해 주세요');
  });

  it('signs in with email and password and displays the current email', async () => {
    const auth = new FakeAuth();
    render(<AuthProvider client={auth.client}><AuthForm /></AuthProvider>);
    fireEvent.change(await screen.findByLabelText('이메일'), { target: { value: 'learner@example.com' } });
    fireEvent.change(screen.getByLabelText('비밀번호'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: '로그인' }));
    expect(await screen.findByText('learner@example.com')).toBeInTheDocument();
    expect(auth.client.signInWithPassword).toHaveBeenCalledWith({
      email: 'learner@example.com',
      password: 'password123',
    });
  });
});

describe('Supabase progress boundary', () => {
  it('keeps guest content available but asks for login before changing progress', async () => {
    render(
      <AuthProvider client={null}>
        <ProgressProvider repository={null}><ProgressProbe /></ProgressProvider>
      </AuthProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: '완료 변경' }));
    expect(await screen.findByText(/먼저 로그인/)).toBeInTheDocument();
    expect(screen.getByLabelText('완료 목록')).toHaveTextContent('');
  });

  it('clears progress before loading another user so accounts never share state', async () => {
    const auth = new FakeAuth(session('user-a', 'a@example.com'));
    const repository = new MemoryProgressRepository();
    repository.rows.set('user-a', [{ lesson_id: 'm00-l01', completed: true, completed_at: '2026-09-18T00:00:00.000Z' }]);
    repository.rows.set('user-b', [{ lesson_id: 'm01-l01', completed: true, completed_at: '2026-09-18T01:00:00.000Z' }]);
    render(
      <AuthProvider client={auth.client}>
        <ProgressProvider repository={repository}><ProgressProbe /></ProgressProvider>
      </AuthProvider>,
    );
    await waitFor(() => expect(screen.getByLabelText('완료 목록')).toHaveTextContent('m00-l01'));
    act(() => auth.emit(session('user-b', 'b@example.com')));
    await waitFor(() => expect(screen.getByLabelText('완료 목록')).toHaveTextContent('m01-l01'));
    expect(screen.getByLabelText('완료 목록')).not.toHaveTextContent('m00-l01');
  });

  it('uses the required select filter and four-column upsert payload', async () => {
    const eq = vi.fn(async () => ({
      data: [{ lesson_id: 'm00-l01', completed: true, completed_at: '2026-09-18T00:00:00.000Z' }],
      error: null,
    }));
    const select = vi.fn(() => ({ eq }));
    const upsert = vi.fn(async () => ({ error: null }));
    const from = vi.fn(() => ({ select, upsert }));
    const repository = createSupabaseProgressRepository({ from } as unknown as SupabaseClient);
    await expect(repository.list('user-a')).resolves.toHaveLength(1);
    expect(from).toHaveBeenCalledWith('lesson_progress');
    expect(select).toHaveBeenCalledWith('lesson_id, completed, completed_at');
    expect(eq).toHaveBeenCalledWith('user_id', 'user-a');
    await repository.upsert('user-a', 'm00-l01', false, null);
    expect(upsert).toHaveBeenCalledWith({
      user_id: 'user-a',
      lesson_id: 'm00-l01',
      completed: false,
      completed_at: null,
    }, { onConflict: 'user_id,lesson_id' });
  });
});
