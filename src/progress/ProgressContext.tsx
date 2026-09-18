import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';

import { useAuth } from '../auth/AuthContext.js';
import type { ContentId } from '../content/types.js';
import { completeDocument, createProgress, recordLastVisited, uncompleteDocument } from './progress.js';
import { progressRepository, type ProgressRepository } from './repository.js';
import type { LearningProgress } from './types.js';

interface ProgressContextValue {
  progress: LearningProgress;
  loading: boolean;
  notice: string | null;
  savingIds: ReadonlySet<ContentId>;
  complete(id: ContentId, revision: string): void;
  uncomplete(id: ContentId): void;
  visit(id: ContentId): void;
  clearNotice(): void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

function message(error: unknown): string {
  return error instanceof Error ? error.message : '진도를 저장하지 못했습니다.';
}

export function ProgressProvider({
  repository = progressRepository,
  now = () => new Date().toISOString(),
  children,
}: PropsWithChildren<{
  repository?: ProgressRepository | null;
  now?: () => string;
}>) {
  const { user, initializing } = useAuth();
  const [progress, setProgress] = useState<LearningProgress>(() => createProgress());
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [savingIds, setSavingIds] = useState<Set<ContentId>>(() => new Set());
  const loadVersion = useRef(0);
  const mutationVersions = useRef(new Map<ContentId, number>());

  useEffect(() => {
    const version = ++loadVersion.current;
    mutationVersions.current.clear();
    setProgress(createProgress());
    setSavingIds(new Set());
    setNotice(null);
    if (initializing) {
      setLoading(true);
      return;
    }
    if (user === null) {
      setLoading(false);
      return;
    }
    if (repository === null) {
      setLoading(false);
      setNotice('진도 저장 설정을 불러오지 못했습니다.');
      return;
    }
    setLoading(true);
    void repository.list(user.id).then(rows => {
      if (loadVersion.current !== version) return;
      const restored = createProgress();
      for (const row of rows) {
        if (row.completed) {
          restored.completedById[row.lesson_id] = { completedAt: row.completed_at };
        }
      }
      setProgress(restored);
    }).catch(caught => {
      if (loadVersion.current === version) setNotice(`진도를 불러오지 못했습니다: ${message(caught)}`);
    }).finally(() => {
      if (loadVersion.current === version) setLoading(false);
    });
  }, [initializing, repository, user]);

  const save = useCallback((id: ContentId, revision: string | null, completed: boolean) => {
    if (user === null) {
      setNotice('진도를 저장하려면 먼저 로그인해 주세요.');
      return;
    }
    if (loading) {
      setNotice('저장된 진도를 불러오는 중입니다. 잠시 후 다시 시도해 주세요.');
      return;
    }
    if (repository === null) {
      setNotice('진도 저장 설정을 불러오지 못했습니다.');
      return;
    }
    setNotice(null);
    const completedAt = completed ? now() : null;
    const mutationVersion = (mutationVersions.current.get(id) ?? 0) + 1;
    mutationVersions.current.set(id, mutationVersion);
    const previous = progress;
    setProgress(current => completed
      ? completeDocument(current, id, revision ?? '', completedAt ?? undefined)
      : uncompleteDocument(current, id));
    setSavingIds(current => new Set(current).add(id));
    void repository.upsert(user.id, id, completed, completedAt).catch(caught => {
      if (mutationVersions.current.get(id) !== mutationVersion) return;
      setProgress(previous);
      setNotice(`진도를 저장하지 못했습니다: ${message(caught)}`);
    }).finally(() => {
      if (mutationVersions.current.get(id) !== mutationVersion) return;
      setSavingIds(current => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
    });
  }, [loading, now, progress, repository, user]);

  const complete = useCallback((id: ContentId, revision: string) => {
    save(id, revision, true);
  }, [save]);
  const uncomplete = useCallback((id: ContentId) => {
    save(id, null, false);
  }, [save]);
  const visit = useCallback((id: ContentId) => {
    setProgress(current => recordLastVisited(current, id));
  }, []);
  const clearNotice = useCallback(() => setNotice(null), []);
  const value = useMemo(() => ({
    progress,
    loading,
    notice,
    savingIds,
    complete,
    uncomplete,
    visit,
    clearNotice,
  }), [progress, loading, notice, savingIds, complete, uncomplete, visit, clearNotice]);
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const value = useContext(ProgressContext);
  if (value === null) throw new Error('ProgressProvider is missing');
  return value;
}
