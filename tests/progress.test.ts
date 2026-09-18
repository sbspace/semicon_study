import { beforeAll, describe, expect, it } from 'vitest';

import { parseContentDirectory } from '../src/content/parse.js';
import type { ContentIndex, ModuleSummary } from '../src/content/types.js';
import { createContentIndex } from '../src/content/write.js';
import {
  completeDocument,
  continueLearningId,
  isCompleted,
  isCompletionOutdated,
  moduleProgress,
  overallProgress,
  recordLastVisited,
  regularLessonIds,
  uncompleteDocument,
} from '../src/progress/progress.js';
import { emptyProgress, loadProgress, saveProgress } from '../src/progress/storage.js';
import { PROGRESS_STORAGE_KEY, type ProgressStorage } from '../src/progress/types.js';

class MemoryStorage implements ProgressStorage {
  readonly values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

let index: ContentIndex;

beforeAll(async () => {
  const parsed = await parseContentDirectory('content');
  if (!parsed.ok) throw new Error(JSON.stringify(parsed.diagnostics));
  index = createContentIndex(parsed.data);
});

describe('progress storage', () => {
  it('starts empty when local storage has no value', () => {
    expect(loadProgress(new MemoryStorage())).toEqual({ version: 1, completedById: {} });
  });

  it('saves state and restores it in a new load', () => {
    const storage = new MemoryStorage();
    const progress = completeDocument(emptyProgress(), 'm00-l01', 'revision', '2026-09-13T00:00:00.000Z');
    expect(saveProgress(storage, progress)).toBe(true);
    expect(loadProgress(storage)).toEqual(progress);
  });

  it('falls back safely for malformed JSON and unsupported versions', () => {
    const storage = new MemoryStorage();
    storage.setItem(PROGRESS_STORAGE_KEY, '{broken');
    expect(loadProgress(storage)).toEqual(emptyProgress());
    storage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({ version: 2, completedById: {} }));
    expect(loadProgress(storage)).toEqual(emptyProgress());
  });

  it('keeps content usable when storage reads or writes fail', () => {
    const failing: ProgressStorage = {
      getItem() { throw new Error('blocked'); },
      setItem() { throw new Error('full'); },
    };
    expect(loadProgress(failing)).toEqual(emptyProgress());
    expect(saveProgress(failing, emptyProgress())).toBe(false);
  });
});

describe('progress updates and selectors', () => {
  it('completes and then uncompletes a document explicitly', () => {
    const completed = completeDocument(emptyProgress(), 'm00-l01', 'r1', '2026-09-13T00:00:00.000Z');
    expect(isCompleted(completed, 'm00-l01')).toBe(true);
    expect(completed.completedById['m00-l01']).toEqual({
      completedAt: '2026-09-13T00:00:00.000Z', contentRevision: 'r1',
    });
    expect(isCompleted(uncompleteDocument(completed, 'm00-l01'), 'm00-l01')).toBe(false);
  });

  it('records last visited separately from completion', () => {
    const visited = recordLastVisited(emptyProgress(), 'm00-review');
    expect(visited.lastVisitedId).toBe('m00-review');
    expect(visited.completedById).toEqual({});
  });

  it('calculates overall progress from the current 53 regular lessons', () => {
    const ids = regularLessonIds(index);
    expect(ids).toHaveLength(53);
    const progress = completeDocument(
      completeDocument(emptyProgress(), ids[0]!, 'r1'),
      ids[1]!,
      'r2',
    );
    expect(overallProgress(index, progress)).toEqual({
      completed: 2, total: 53, percent: 4, isComplete: false,
    });
  });

  it('excludes review and supplements from module and overall denominators', () => {
    const module = index.documentsById.m01 as ModuleSummary;
    let progress = completeDocument(emptyProgress(), module.reviewId, 'review');
    progress = completeDocument(progress, module.supplementIds[0]!, 'supplement');
    expect(moduleProgress(module, progress)).toEqual({
      completed: 0, total: 7, percent: 0, isComplete: false,
    });
    expect(overallProgress(index, progress).completed).toBe(0);
  });

  it('derives module completion only when every regular lesson is complete', () => {
    const module = index.documentsById.m01 as ModuleSummary;
    const progress = module.lessonIds.reduce(
      (current, id) => completeDocument(current, id, index.documentsById[id]!.revision),
      emptyProgress(),
    );
    expect(moduleProgress(module, progress)).toEqual({
      completed: 7, total: 7, percent: 100, isComplete: true,
    });
  });

  it('uses a valid last visited lesson and otherwise falls back to the first lesson', () => {
    expect(continueLearningId(index, emptyProgress())).toBe('m00-l01');
    expect(continueLearningId(index, recordLastVisited(emptyProgress(), 'm03-l04'))).toBe('m03-l04');
    expect(continueLearningId(index, recordLastVisited(emptyProgress(), 'm03-review'))).toBe('m00-l01');
    expect(continueLearningId(index, recordLastVisited(emptyProgress(), 'missing'))).toBe('m00-l01');
  });

  it('keeps completion when content revision changes and exposes the mismatch', () => {
    const progress = completeDocument(emptyProgress(), 'm00-l01', 'old-revision');
    expect(isCompleted(progress, 'm00-l01')).toBe(true);
    expect(isCompletionOutdated(progress, 'm00-l01', 'new-revision')).toBe(true);
  });
});
