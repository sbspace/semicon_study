import type { ContentId } from '../content/types.js';

export const PROGRESS_VERSION = 1 as const;

export interface CompletionRecord {
  completedAt: string | null;
  contentRevision?: string;
}

export interface LearningProgress {
  version: typeof PROGRESS_VERSION;
  completedById: Record<ContentId, CompletionRecord>;
  lastVisitedId?: ContentId;
}

export interface ProgressMetrics {
  completed: number;
  total: number;
  percent: number;
  isComplete: boolean;
}
