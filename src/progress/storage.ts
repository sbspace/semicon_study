import {
  PROGRESS_STORAGE_KEY,
  PROGRESS_VERSION,
  type CompletionRecord,
  type LearningProgress,
  type ProgressStorage,
} from './types.js';

export function emptyProgress(): LearningProgress {
  return { version: PROGRESS_VERSION, completedById: {} };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function completionRecord(value: unknown): value is CompletionRecord {
  return isRecord(value) && typeof value.completedAt === 'string' &&
    !Number.isNaN(Date.parse(value.completedAt)) && typeof value.contentRevision === 'string';
}

export function parseProgress(value: string): LearningProgress {
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    return emptyProgress();
  }
  if (!isRecord(parsed) || parsed.version !== PROGRESS_VERSION ||
    !isRecord(parsed.completedById)) return emptyProgress();

  const completedById: Record<string, CompletionRecord> = {};
  for (const [id, record] of Object.entries(parsed.completedById)) {
    if (id.length === 0 || !completionRecord(record)) return emptyProgress();
    completedById[id] = {
      completedAt: record.completedAt,
      contentRevision: record.contentRevision,
    };
  }
  const lastVisitedId = parsed.lastVisitedId;
  if (lastVisitedId !== undefined && typeof lastVisitedId !== 'string') return emptyProgress();
  return {
    version: PROGRESS_VERSION,
    completedById,
    ...(lastVisitedId === undefined ? {} : { lastVisitedId }),
  };
}

export function loadProgress(storage: ProgressStorage | null): LearningProgress {
  if (storage === null) return emptyProgress();
  try {
    const saved = storage.getItem(PROGRESS_STORAGE_KEY);
    return saved === null ? emptyProgress() : parseProgress(saved);
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(
  storage: ProgressStorage | null,
  progress: LearningProgress,
): boolean {
  if (storage === null) return false;
  try {
    storage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}
