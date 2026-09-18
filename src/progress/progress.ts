import type { ContentId, ContentIndex, ModuleSummary } from '../content/types.js';
import { PROGRESS_VERSION, type LearningProgress, type ProgressMetrics } from './types.js';

export function completeDocument(
  progress: LearningProgress,
  id: ContentId,
  contentRevision: string,
  completedAt = new Date().toISOString(),
): LearningProgress {
  return {
    ...progress,
    completedById: {
      ...progress.completedById,
      [id]: { completedAt, contentRevision },
    },
  };
}

export function uncompleteDocument(progress: LearningProgress, id: ContentId): LearningProgress {
  if (progress.completedById[id] === undefined) return progress;
  const completedById = { ...progress.completedById };
  delete completedById[id];
  return { ...progress, completedById };
}

export function recordLastVisited(progress: LearningProgress, id: ContentId): LearningProgress {
  if (progress.lastVisitedId === id) return progress;
  return { ...progress, lastVisitedId: id };
}

export function isCompleted(progress: LearningProgress, id: ContentId): boolean {
  return progress.completedById[id] !== undefined;
}

export function isCompletionOutdated(
  progress: LearningProgress,
  id: ContentId,
  currentRevision: string,
): boolean {
  const record = progress.completedById[id];
  return record !== undefined && record.contentRevision !== currentRevision;
}

function metrics(ids: ContentId[], progress: LearningProgress): ProgressMetrics {
  const completed = ids.reduce(
    (count, id) => count + (isCompleted(progress, id) ? 1 : 0),
    0,
  );
  const total = ids.length;
  return {
    completed,
    total,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
    isComplete: total > 0 && completed === total,
  };
}

export function regularLessonIds(index: ContentIndex): ContentId[] {
  return index.moduleIds.flatMap(id => {
    const module = index.documentsById[id];
    return module?.kind === 'module' ? module.lessonIds : [];
  });
}

export function overallProgress(
  index: ContentIndex,
  progress: LearningProgress,
): ProgressMetrics {
  return metrics(regularLessonIds(index), progress);
}

export function moduleProgress(
  module: ModuleSummary,
  progress: LearningProgress,
): ProgressMetrics {
  return metrics(module.lessonIds, progress);
}

export function continueLearningId(
  index: ContentIndex,
  progress: LearningProgress,
): ContentId | undefined {
  if (progress.lastVisitedId !== undefined &&
    index.documentsById[progress.lastVisitedId]?.kind === 'lesson') {
    return progress.lastVisitedId;
  }
  return regularLessonIds(index)[0];
}

export function createProgress(): LearningProgress {
  return { version: PROGRESS_VERSION, completedById: {} };
}
