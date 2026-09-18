import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type PropsWithChildren,
} from 'react';

import { supabase } from '../lib/supabase.js';

export type AuthClient = Pick<
  SupabaseClient['auth'],
  'getSession' | 'onAuthStateChange' | 'signInWithPassword' | 'signOut' | 'signUp'
>;

interface AuthContextValue {
  user: User | null;
  initializing: boolean;
  busy: boolean;
  message: string | null;
  error: string | null;
  configured: boolean;
  signIn(email: string, password: string): Promise<void>;
  signUp(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
  clearFeedback(): void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function userFromSession(session: Session | null): User | null {
  return session?.user ?? null;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '인증 요청을 처리하지 못했습니다.';
}

export function AuthProvider({
  client = supabase?.auth ?? null,
  children,
}: PropsWithChildren<{ client?: AuthClient | null }>) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(client !== null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (client === null) {
      setUser(null);
      setInitializing(false);
      return;
    }
    let active = true;
    void client.getSession().then(({ data, error: sessionError }) => {
      if (!active) return;
      if (sessionError) setError(sessionError.message);
      setUser(userFromSession(data.session));
    }).catch(caught => {
      if (active) setError(errorMessage(caught));
    }).finally(() => {
      if (active) setInitializing(false);
    });
    const { data: { subscription } } = client.onAuthStateChange((_event, session) => {
      if (!active) return;
      setUser(userFromSession(session));
      setInitializing(false);
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [client]);

  const clearFeedback = useCallback(() => {
    setMessage(null);
    setError(null);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    clearFeedback();
    if (client === null) {
      setError('Supabase 환경변수가 설정되지 않았습니다.');
      return;
    }
    setBusy(true);
    try {
      const { error: signInError } = await client.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      setMessage('로그인했습니다.');
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  }, [clearFeedback, client]);

  const signUp = useCallback(async (email: string, password: string) => {
    clearFeedback();
    if (client === null) {
      setError('Supabase 환경변수가 설정되지 않았습니다.');
      return;
    }
    setBusy(true);
    try {
      const emailRedirectTo = typeof window === 'undefined' ? undefined : window.location.origin;
      const { data, error: signUpError } = await client.signUp({
        email,
        password,
        ...(emailRedirectTo === undefined ? {} : { options: { emailRedirectTo } }),
      });
      if (signUpError) throw signUpError;
      setMessage(data.session === null
        ? '가입 요청이 완료되었습니다. 인증 이메일을 확인해 주세요.'
        : '회원가입과 로그인이 완료되었습니다.');
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  }, [clearFeedback, client]);

  const signOut = useCallback(async () => {
    clearFeedback();
    if (client === null) return;
    setBusy(true);
    try {
      const { error: signOutError } = await client.signOut();
      if (signOutError) throw signOutError;
      setUser(null);
      setMessage('로그아웃했습니다.');
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  }, [clearFeedback, client]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    initializing,
    busy,
    message,
    error,
    configured: client !== null,
    signIn,
    signUp,
    signOut,
    clearFeedback,
  }), [user, initializing, busy, message, error, client, signIn, signUp, signOut, clearFeedback]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (value === null) throw new Error('AuthProvider is missing');
  return value;
}

export function AuthForm() {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void auth.signIn(email, password);
  };
  const credentialsValid = email.trim().length > 0 && password.length >= 6;

  if (auth.initializing) return <span className="auth-loading">로그인 확인 중…</span>;
  if (auth.user !== null) {
    return (
      <div className="auth-user">
        <span title={auth.user.email}>{auth.user.email ?? '로그인 사용자'}</span>
        <button type="button" disabled={auth.busy} onClick={() => void auth.signOut()}>로그아웃</button>
      </div>
    );
  }
  return (
    <details className="auth-menu" onToggle={() => auth.clearFeedback()}>
      <summary>로그인</summary>
      <form onSubmit={submit}>
        <label>이메일<input type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} /></label>
        <label>비밀번호<input type="password" autoComplete="current-password" minLength={6} required value={password} onChange={event => setPassword(event.target.value)} /></label>
        <div className="auth-actions">
          <button type="submit" disabled={auth.busy || !auth.configured || !credentialsValid}>로그인</button>
          <button type="button" disabled={auth.busy || !auth.configured || !credentialsValid} onClick={() => void auth.signUp(email, password)}>회원가입</button>
        </div>
        {!auth.configured && <p role="alert">로그인 설정을 불러오지 못했습니다.</p>}
        {auth.error && <p role="alert">{auth.error}</p>}
        {auth.message && <p role="status">{auth.message}</p>}
      </form>
    </details>
  );
}
