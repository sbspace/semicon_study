import type { ContentId } from '../content/types.js';

export const PROGRESS_VERSION = 1 as const;
export const PROGRESS_STORAGE_KEY = 'semi-learning-progress';

export interface CompletionRecord {
  completedAt: string;
  contentRevision: string;
}

export interface LearningProgress {
  version: typeof PROGRESS_VERSION;
  completedById: Record<ContentId, CompletionRecord>;
  lastVisitedId?: ContentId;
}

export interface ProgressStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface ProgressMetrics {
  completed: number;
  total: number;
  percent: number;
  isComplete: boolean;
}
