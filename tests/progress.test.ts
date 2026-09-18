import { beforeAll, describe, expect, it } from 'vitest';

import { parseContentDirectory } from '../src/content/parse.js';
import type { ContentIndex, ModuleSummary } from '../src/content/types.js';
import { createContentIndex } from '../src/content/write.js';
import {
  completeDocument,
  continueLearningId,
  createProgress,
  isCompleted,
  isCompletionOutdated,
  moduleProgress,
  overallProgress,
  recordLastVisited,
  regularLessonIds,
  uncompleteDocument,
} from '../src/progress/progress.js';

let index: ContentIndex;

beforeAll(async () => {
  const parsed = await parseContentDirectory('content');
  if (!parsed.ok) throw new Error(JSON.stringify(parsed.diagnostics));
  index = createContentIndex(parsed.data);
});

describe('progress updates and selectors', () => {
  it('completes and then uncompletes a document explicitly', () => {
    const completed = completeDocument(createProgress(), 'm00-l01', 'r1', '2026-09-13T00:00:00.000Z');
    expect(isCompleted(completed, 'm00-l01')).toBe(true);
    expect(completed.completedById['m00-l01']).toEqual({
      completedAt: '2026-09-13T00:00:00.000Z', contentRevision: 'r1',
    });
    expect(isCompleted(uncompleteDocument(completed, 'm00-l01'), 'm00-l01')).toBe(false);
  });

  it('records last visited separately from completion', () => {
    const visited = recordLastVisited(createProgress(), 'm00-review');
    expect(visited.lastVisitedId).toBe('m00-review');
    expect(visited.completedById).toEqual({});
  });

  it('calculates overall progress from the current 53 regular lessons', () => {
    const ids = regularLessonIds(index);
    expect(ids).toHaveLength(53);
    const progress = completeDocument(
      completeDocument(createProgress(), ids[0]!, 'r1'),
      ids[1]!,
      'r2',
    );
    expect(overallProgress(index, progress)).toEqual({
      completed: 2, total: 53, percent: 4, isComplete: false,
    });
  });

  it('excludes review and supplements from module and overall denominators', () => {
    const module = index.documentsById.m01 as ModuleSummary;
    let progress = completeDocument(createProgress(), module.reviewId, 'review');
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
      createProgress(),
    );
    expect(moduleProgress(module, progress)).toEqual({
      completed: 7, total: 7, percent: 100, isComplete: true,
    });
  });

  it('uses a valid last visited lesson and otherwise falls back to the first lesson', () => {
    expect(continueLearningId(index, createProgress())).toBe('m00-l01');
    expect(continueLearningId(index, recordLastVisited(createProgress(), 'm03-l04'))).toBe('m03-l04');
    expect(continueLearningId(index, recordLastVisited(createProgress(), 'm03-review'))).toBe('m00-l01');
    expect(continueLearningId(index, recordLastVisited(createProgress(), 'missing'))).toBe('m00-l01');
  });

  it('keeps completion when content revision changes and exposes the mismatch', () => {
    const progress = completeDocument(createProgress(), 'm00-l01', 'old-revision');
    expect(isCompleted(progress, 'm00-l01')).toBe(true);
    expect(isCompletionOutdated(progress, 'm00-l01', 'new-revision')).toBe(true);
  });
});
