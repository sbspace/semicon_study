import path from 'node:path';

import type {
  ContentDocument,
  ContentPath,
  Diagnostic,
  JsonValue,
} from './types.js';

export interface CurriculumLessonEntry {
  id: string;
  lessonNumber: number;
  title: string;
  file: ContentPath;
  estimatedMinutes: number;
  extensionMinutes?: number;
}

export interface CurriculumReviewEntry {
  id: string;
  title: string;
  file: ContentPath;
  estimatedMinutes: number;
}

export interface CurriculumSupplementEntry
  extends CurriculumReviewEntry {}

export interface CurriculumModuleEntry {
  id: string;
  number: number;
  title: string;
  description: string;
  file: ContentPath;
  lessons: CurriculumLessonEntry[];
  review: CurriculumReviewEntry;
  supplements: CurriculumSupplementEntry[];
}

export interface CurriculumManifest {
  schemaVersion: string;
  contentVersion: string;
  language: string;
  title: string;
  description: string;
  lastUpdated: string;
  modules: CurriculumModuleEntry[];
  extra: Record<string, JsonValue>;
}

export function diagnostic(
  diagnostics: Diagnostic[],
  severity: Diagnostic['severity'],
  code: string,
  message: string,
  filePath: ContentPath,
): void {
  diagnostics.push({ severity, code, message, path: filePath });
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

export function isJsonValue(value: unknown): value is JsonValue {
  if (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'boolean' ||
    (typeof value === 'number' && Number.isFinite(value))
  ) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every(isJsonValue);
  }

  return isRecord(value) && Object.values(value).every(isJsonValue);
}

export function isISODate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (match === null) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function normalizeContentPath(
  value: string,
  diagnostics: Diagnostic[],
  ownerPath: ContentPath,
  field: string,
): ContentPath | undefined {
  if (
    value.length === 0 ||
    value.includes('\\') ||
    path.posix.isAbsolute(value) ||
    /^[A-Za-z]:/.test(value)
  ) {
    diagnostic(
      diagnostics,
      'error',
      'INVALID_CONTENT_PATH',
      `${field} must be a non-empty POSIX path relative to content/: ${value}`,
      ownerPath,
    );
    return undefined;
  }

  const normalized = path.posix.normalize(value);
  if (
    normalized !== value ||
    normalized === '..' ||
    normalized.startsWith('../')
  ) {
    diagnostic(
      diagnostics,
      'error',
      'INVALID_CONTENT_PATH',
      `${field} escapes content/ or is not normalized: ${value}`,
      ownerPath,
    );
    return undefined;
  }

  return normalized;
}

export function validateCrossReferences(
  manifest: CurriculumManifest,
  documentsByPath: ReadonlyMap<ContentPath, ContentDocument>,
  inventoryPaths: readonly ContentPath[],
  diagnostics: Diagnostic[],
): void {
  const registeredPaths = new Map<ContentPath, string>();
  const curriculumIds = new Map<string, ContentPath>();

  const register = (id: string, file: ContentPath): void => {
    const priorPath = registeredPaths.get(file);
    if (priorPath !== undefined) {
      diagnostic(
        diagnostics,
        'error',
        'DUPLICATE_CURRICULUM_PATH',
        `${file} is registered by both ${priorPath} and ${id}`,
        'curriculum.yaml',
      );
    } else {
      registeredPaths.set(file, id);
    }

    const priorIdPath = curriculumIds.get(id);
    if (priorIdPath !== undefined) {
      diagnostic(
        diagnostics,
        'error',
        'DUPLICATE_CONTENT_ID',
        `${id} is registered by both ${priorIdPath} and ${file}`,
        'curriculum.yaml',
      );
    } else {
      curriculumIds.set(id, file);
    }
  };

  const compare = (
    file: ContentPath,
    field: string,
    expected: unknown,
    actual: unknown,
  ): void => {
    if (expected !== actual) {
      diagnostic(
        diagnostics,
        'error',
        'CURRICULUM_FRONTMATTER_MISMATCH',
        `${field} differs: curriculum=${JSON.stringify(expected)}, frontmatter=${JSON.stringify(actual)}`,
        file,
      );
    }
  };

  for (const moduleEntry of manifest.modules) {
    register(moduleEntry.id, moduleEntry.file);
    const moduleDocument = documentsByPath.get(moduleEntry.file);
    if (moduleDocument === undefined) {
      diagnostic(
        diagnostics,
        'error',
        'MISSING_REGISTERED_FILE',
        `Registered module file does not exist or could not be parsed: ${moduleEntry.file}`,
        'curriculum.yaml',
      );
    } else {
      compare(moduleEntry.file, 'id', moduleEntry.id, moduleDocument.id);
      compare(moduleEntry.file, 'kind', 'module', moduleDocument.kind);
      compare(moduleEntry.file, 'title', moduleEntry.title, moduleDocument.title);
      if (moduleDocument.kind === 'module') {
        compare(moduleEntry.file, 'number', moduleEntry.number, moduleDocument.number);
        compare(
          moduleEntry.file,
          'description',
          moduleEntry.description,
          moduleDocument.description,
        );
      }
    }

    const lessonNumbers = new Set<number>();
    for (const lessonEntry of moduleEntry.lessons) {
      register(lessonEntry.id, lessonEntry.file);
      const lessonDocument = documentsByPath.get(lessonEntry.file);
      if (lessonDocument === undefined) {
        diagnostic(
          diagnostics,
          'error',
          'MISSING_REGISTERED_FILE',
          `Registered lesson file does not exist or could not be parsed: ${lessonEntry.file}`,
          'curriculum.yaml',
        );
        continue;
      }

      compare(lessonEntry.file, 'id', lessonEntry.id, lessonDocument.id);
      compare(lessonEntry.file, 'kind', 'lesson', lessonDocument.kind);
      compare(lessonEntry.file, 'title', lessonEntry.title, lessonDocument.title);
      if (lessonDocument.kind === 'lesson') {
        compare(
          lessonEntry.file,
          'module_id',
          moduleEntry.id,
          lessonDocument.moduleId,
        );
        compare(
          lessonEntry.file,
          'estimated_minutes',
          lessonEntry.estimatedMinutes,
          lessonDocument.estimatedMinutes,
        );
        compare(
          lessonEntry.file,
          'lesson_number',
          lessonEntry.lessonNumber,
          lessonDocument.lessonNumber,
        );
        compare(
          lessonEntry.file,
          'extension_minutes',
          lessonEntry.extensionMinutes,
          lessonDocument.extensionMinutes,
        );
        if (lessonNumbers.has(lessonDocument.lessonNumber)) {
          diagnostic(
            diagnostics,
            'error',
            'DUPLICATE_LESSON_NUMBER',
            `Module ${moduleEntry.id} contains lesson number ${lessonDocument.lessonNumber} more than once`,
            lessonEntry.file,
          );
        }
        lessonNumbers.add(lessonDocument.lessonNumber);
      }
    }

    const reviewEntry = moduleEntry.review;
    register(reviewEntry.id, reviewEntry.file);
    const reviewDocument = documentsByPath.get(reviewEntry.file);
    if (reviewDocument === undefined) {
      diagnostic(
        diagnostics,
        'error',
        'MISSING_REGISTERED_FILE',
        `Registered review file does not exist or could not be parsed: ${reviewEntry.file}`,
        'curriculum.yaml',
      );
    } else {
      compare(reviewEntry.file, 'id', reviewEntry.id, reviewDocument.id);
      compare(reviewEntry.file, 'kind', 'review', reviewDocument.kind);
      compare(reviewEntry.file, 'title', reviewEntry.title, reviewDocument.title);
      if (reviewDocument.kind === 'review') {
        compare(
          reviewEntry.file,
          'module_id',
          moduleEntry.id,
          reviewDocument.moduleId,
        );
        compare(
          reviewEntry.file,
          'estimated_minutes',
          reviewEntry.estimatedMinutes,
          reviewDocument.estimatedMinutes,
        );
      }
    }

    for (const supplementEntry of moduleEntry.supplements) {
      register(supplementEntry.id, supplementEntry.file);
      const supplementDocument = documentsByPath.get(supplementEntry.file);
      if (supplementDocument === undefined) {
        diagnostic(
          diagnostics,
          'error',
          'MISSING_REGISTERED_FILE',
          `Registered supplement file does not exist or could not be parsed: ${supplementEntry.file}`,
          'curriculum.yaml',
        );
        continue;
      }

      compare(supplementEntry.file, 'id', supplementEntry.id, supplementDocument.id);
      compare(supplementEntry.file, 'kind', 'supplement', supplementDocument.kind);
      compare(supplementEntry.file, 'title', supplementEntry.title, supplementDocument.title);
      if (supplementDocument.kind === 'supplement') {
        compare(
          supplementEntry.file,
          'module_id',
          moduleEntry.id,
          supplementDocument.moduleId,
        );
        compare(
          supplementEntry.file,
          'estimated_minutes',
          supplementEntry.estimatedMinutes,
          supplementDocument.estimatedMinutes,
        );
      }
    }
  }

  const seenCaseInsensitive = new Map<string, ContentPath>();
  for (const inventoryPath of inventoryPaths) {
    const folded = inventoryPath.toLocaleLowerCase('en-US');
    const prior = seenCaseInsensitive.get(folded);
    if (prior !== undefined && prior !== inventoryPath) {
      diagnostic(
        diagnostics,
        'error',
        'CASE_COLLIDING_PATH',
        `${prior} and ${inventoryPath} differ only by case`,
        inventoryPath,
      );
    } else {
      seenCaseInsensitive.set(folded, inventoryPath);
    }

    if (
      inventoryPath.startsWith('module-') &&
      inventoryPath.endsWith('.md') &&
      !registeredPaths.has(inventoryPath)
    ) {
      diagnostic(
        diagnostics,
        'error',
        'UNREGISTERED_LEARNING_MARKDOWN',
        `Learning Markdown is not registered in curriculum.yaml: ${inventoryPath}`,
        inventoryPath,
      );
    }
  }
}
