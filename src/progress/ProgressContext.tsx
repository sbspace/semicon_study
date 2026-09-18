import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import type { ContentId } from '../content/types.js';
import { completeDocument, recordLastVisited, uncompleteDocument } from './progress.js';
import { loadProgress, saveProgress } from './storage.js';
import type { LearningProgress, ProgressStorage } from './types.js';

interface ProgressContextValue {
  progress: LearningProgress;
  complete(id: ContentId, revision: string): void;
  uncomplete(id: ContentId): void;
  visit(id: ContentId): void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

function browserStorage(): ProgressStorage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function ProgressProvider({
  storage = browserStorage(),
  now = () => new Date().toISOString(),
  children,
}: PropsWithChildren<{
  storage?: ProgressStorage | null;
  now?: () => string;
}>) {
  const [progress, setProgress] = useState(() => loadProgress(storage));
  const update = useCallback((change: (current: LearningProgress) => LearningProgress) => {
    setProgress(current => {
      const next = change(current);
      if (next !== current) saveProgress(storage, next);
      return next;
    });
  }, [storage]);
  const complete = useCallback((id: ContentId, revision: string) => {
    update(current => completeDocument(current, id, revision, now()));
  }, [now, update]);
  const uncomplete = useCallback((id: ContentId) => {
    update(current => uncompleteDocument(current, id));
  }, [update]);
  const visit = useCallback((id: ContentId) => {
    update(current => recordLastVisited(current, id));
  }, [update]);
  const value = useMemo(
    () => ({ progress, complete, uncomplete, visit }),
    [progress, complete, uncomplete, visit],
  );
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const value = useContext(ProgressContext);
  if (value === null) throw new Error('ProgressProvider is missing');
  return value;
}
