import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

import { toString as mdastToString } from 'mdast-util-to-string';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { parseDocument } from 'yaml';

import type { Root } from 'mdast';
import type {
  ContentCatalog,
  ContentDocument,
  ContentOrigin,
  ContentPath,
  Diagnostic,
  DocumentBody,
  Heading,
  JsonValue,
  Lesson,
  Module,
  ParseResult,
  Review,
  SupportingDocument,
  Supplement,
} from './types.js';
import { blocksFromDirectives, extractDirectiveOccurrences } from './directives.js';
import { sourceSpan } from './locations.js';
import { parseQuizzes } from './quiz.js';
import {
  diagnostic,
  isISODate,
  isJsonValue,
  isRecord,
  normalizeContentPath,
  validateCrossReferences,
  type CurriculumLessonEntry,
  type CurriculumManifest,
  type CurriculumModuleEntry,
  type CurriculumReviewEntry,
  type CurriculumSupplementEntry,
} from './validate.js';

export const PARSER_VERSION = '0.3.1';
const MODEL_VERSION = '1' as const;
const CURRICULUM_PATH = 'curriculum.yaml';
const SUPPORTING_PATHS = [
  'README.md',
  'visual_map.md',
  'source_map.md',
  'quality_review.md',
] as const;

const markdownParser = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMath)
  .freeze();

export interface SourceInput {
  path: ContentPath;
  text: string;
  revision: string;
}

export interface ParsedMarkdownSource {
  path: ContentPath;
  revision: string;
  frontmatter: Record<string, unknown> | null;
  normalizedText: string;
  body: string;
  bodyStart: number;
  bodyStartLine: number;
  firstHeading: string | null;
  tree: Root;
}

interface ParsedCurriculum {
  manifest?: CurriculumManifest;
  diagnostics: Diagnostic[];
}

interface ParsedMarkdown {
  source?: ParsedMarkdownSource;
  diagnostics: Diagnostic[];
}

type ExpectedKind = 'module' | 'lesson' | 'review' | 'supplement';

function sha256(value: Uint8Array | string): string {
  return createHash('sha256').update(value).digest('hex');
}

function normalizeText(text: string): string {
  const withoutBom = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  return withoutBom.replace(/\r\n?/g, '\n');
}

function parseYaml(
  yaml: string,
  filePath: ContentPath,
  diagnostics: Diagnostic[],
): unknown | undefined {
  const document = parseDocument(yaml, {
    schema: 'core',
    strict: true,
    stringKeys: true,
    uniqueKeys: true,
    prettyErrors: true,
  });

  for (const error of document.errors) {
    diagnostic(
      diagnostics,
      'error',
      `YAML_${error.code ?? 'PARSE_ERROR'}`,
      error.message,
      filePath,
    );
  }
  for (const warning of document.warnings) {
    diagnostic(
      diagnostics,
      'warning',
      `YAML_${warning.code ?? 'WARNING'}`,
      warning.message,
      filePath,
    );
  }
  if (document.errors.length > 0) return undefined;

  try {
    return document.toJS({ maxAliasCount: 0, mapAsMap: false });
  } catch (error) {
    diagnostic(
      diagnostics,
      'error',
      'YAML_UNSAFE_OR_INVALID_VALUE',
      error instanceof Error ? error.message : String(error),
      filePath,
    );
    return undefined;
  }
}

function requireRecord(
  value: unknown,
  diagnostics: Diagnostic[],
  filePath: ContentPath,
  field = 'document',
): Record<string, unknown> | undefined {
  if (!isRecord(value)) {
    diagnostic(
      diagnostics,
      'error',
      'INVALID_OBJECT',
      `${field} must be a mapping`,
      filePath,
    );
    return undefined;
  }
  return value;
}

function requireString(
  record: Record<string, unknown>,
  field: string,
  diagnostics: Diagnostic[],
  filePath: ContentPath,
): string | undefined {
  const value = record[field];
  if (typeof value !== 'string' || value.length === 0) {
    diagnostic(
      diagnostics,
      'error',
      'INVALID_METADATA_TYPE',
      `${field} must be a non-empty string`,
      filePath,
    );
    return undefined;
  }
  return value;
}

function requireInteger(
  record: Record<string, unknown>,
  field: string,
  diagnostics: Diagnostic[],
  filePath: ContentPath,
  minimum: number,
): number | undefined {
  const value = record[field];
  if (!Number.isInteger(value) || (value as number) < minimum) {
    diagnostic(
      diagnostics,
      'error',
      'INVALID_METADATA_TYPE',
      `${field} must be an integer greater than or equal to ${minimum}`,
      filePath,
    );
    return undefined;
  }
  return value as number;
}

function optionalInteger(
  record: Record<string, unknown>,
  field: string,
  diagnostics: Diagnostic[],
  filePath: ContentPath,
  minimum: number,
): number | undefined {
  if (!(field in record)) return undefined;
  return requireInteger(record, field, diagnostics, filePath, minimum);
}

function requireDate(
  record: Record<string, unknown>,
  field: string,
  diagnostics: Diagnostic[],
  filePath: ContentPath,
): string | undefined {
  const value = requireString(record, field, diagnostics, filePath);
  if (value !== undefined && !isISODate(value)) {
    diagnostic(
      diagnostics,
      'error',
      'INVALID_DATE',
      `${field} must be a valid YYYY-MM-DD date`,
      filePath,
    );
    return undefined;
  }
  return value;
}

function optionalDate(
  record: Record<string, unknown>,
  field: string,
  diagnostics: Diagnostic[],
  filePath: ContentPath,
): string | undefined {
  if (!(field in record)) return undefined;
  return requireDate(record, field, diagnostics, filePath);
}

function optionalString(
  record: Record<string, unknown>,
  field: string,
  diagnostics: Diagnostic[],
  filePath: ContentPath,
): string | undefined {
  if (!(field in record)) return undefined;
  return requireString(record, field, diagnostics, filePath);
}

function optionalBoolean(
  record: Record<string, unknown>,
  field: string,
  diagnostics: Diagnostic[],
  filePath: ContentPath,
): boolean | undefined {
  if (!(field in record)) return undefined;
  const value = record[field];
  if (typeof value !== 'boolean') {
    diagnostic(
      diagnostics,
      'error',
      'INVALID_METADATA_TYPE',
      `${field} must be a boolean`,
      filePath,
    );
    return undefined;
  }
  return value;
}

function optionalStringArray(
  record: Record<string, unknown>,
  field: string,
  diagnostics: Diagnostic[],
  filePath: ContentPath,
): string[] {
  if (!(field in record)) return [];
  const value = record[field];
  if (
    !Array.isArray(value) ||
    value.some((item) => typeof item !== 'string' || item.length === 0)
  ) {
    diagnostic(
      diagnostics,
      'error',
      'INVALID_METADATA_TYPE',
      `${field} must be an array of non-empty strings`,
      filePath,
    );
    return [];
  }
  return value as string[];
}

function collectExtra(
  record: Record<string, unknown>,
  knownFields: ReadonlySet<string>,
  diagnostics: Diagnostic[],
  filePath: ContentPath,
): Record<string, JsonValue> {
  const extra: Record<string, JsonValue> = {};
  for (const [field, value] of Object.entries(record)) {
    if (knownFields.has(field)) continue;
    if (!isJsonValue(value)) {
      diagnostic(
        diagnostics,
        'error',
        'INVALID_EXTRA_METADATA',
        `Unknown metadata ${field} is not JSON-compatible`,
        filePath,
      );
      continue;
    }
    extra[field] = value;
    // Editorial style annotations stay in extra; they do not affect routing or progress.
    if (field === 'style_revision' && typeof value === 'string') continue;
    diagnostic(
      diagnostics,
      'warning',
      'UNKNOWN_METADATA',
      `Unknown metadata field is preserved in extra: ${field}`,
      filePath,
    );
  }
  return extra;
}

function arrayField(
  record: Record<string, unknown>,
  field: string,
  diagnostics: Diagnostic[],
  filePath: ContentPath,
  required: boolean,
): unknown[] | undefined {
  const value = record[field];
  if (value === undefined && !required) return [];
  if (!Array.isArray(value)) {
    diagnostic(
      diagnostics,
      'error',
      'INVALID_METADATA_TYPE',
      `${field} must be an array`,
      filePath,
    );
    return undefined;
  }
  return value;
}

function parseCurriculumLesson(
  value: unknown,
  moduleId: string,
  lessonNumber: number,
  diagnostics: Diagnostic[],
): CurriculumLessonEntry | undefined {
  const record = requireRecord(value, diagnostics, CURRICULUM_PATH, `lesson in ${moduleId}`);
  if (record === undefined) return undefined;
  const id = requireString(record, 'id', diagnostics, CURRICULUM_PATH);
  const title = requireString(record, 'title', diagnostics, CURRICULUM_PATH);
  const fileValue = requireString(record, 'file', diagnostics, CURRICULUM_PATH);
  const estimatedMinutes = requireInteger(
    record,
    'estimated_minutes',
    diagnostics,
    CURRICULUM_PATH,
    1,
  );
  const extensionMinutes = optionalInteger(
    record,
    'extension_minutes',
    diagnostics,
    CURRICULUM_PATH,
    0,
  );
  const file =
    fileValue === undefined
      ? undefined
      : normalizeContentPath(
          fileValue,
          diagnostics,
          CURRICULUM_PATH,
          'lesson.file',
        );

  if (
    id === undefined ||
    title === undefined ||
    file === undefined ||
    estimatedMinutes === undefined
  ) {
    return undefined;
  }
  return {
    id,
    lessonNumber,
    title,
    file,
    estimatedMinutes,
    ...(extensionMinutes === undefined ? {} : { extensionMinutes }),
  };
}

function parseCurriculumReview(
  value: unknown,
  label: string,
  diagnostics: Diagnostic[],
): CurriculumReviewEntry | undefined {
  const record = requireRecord(value, diagnostics, CURRICULUM_PATH, label);
  if (record === undefined) return undefined;
  const id = requireString(record, 'id', diagnostics, CURRICULUM_PATH);
  const title = requireString(record, 'title', diagnostics, CURRICULUM_PATH);
  const fileValue = requireString(record, 'file', diagnostics, CURRICULUM_PATH);
  const estimatedMinutes = requireInteger(
    record,
    'estimated_minutes',
    diagnostics,
    CURRICULUM_PATH,
    1,
  );
  const file =
    fileValue === undefined
      ? undefined
      : normalizeContentPath(fileValue, diagnostics, CURRICULUM_PATH, `${label}.file`);
  if (
    id === undefined ||
    title === undefined ||
    file === undefined ||
    estimatedMinutes === undefined
  ) {
    return undefined;
  }
  return { id, title, file, estimatedMinutes };
}

function parseCurriculumModule(
  value: unknown,
  diagnostics: Diagnostic[],
): CurriculumModuleEntry | undefined {
  const record = requireRecord(value, diagnostics, CURRICULUM_PATH, 'module');
  if (record === undefined) return undefined;
  const id = requireString(record, 'id', diagnostics, CURRICULUM_PATH);
  const number = requireInteger(record, 'number', diagnostics, CURRICULUM_PATH, 0);
  const title = requireString(record, 'title', diagnostics, CURRICULUM_PATH);
  const description = requireString(record, 'description', diagnostics, CURRICULUM_PATH);
  const fileValue = requireString(record, 'file', diagnostics, CURRICULUM_PATH);
  const lessonsValue = arrayField(record, 'lessons', diagnostics, CURRICULUM_PATH, true);
  const file =
    fileValue === undefined
      ? undefined
      : normalizeContentPath(fileValue, diagnostics, CURRICULUM_PATH, 'module.file');

  if (
    id === undefined ||
    number === undefined ||
    title === undefined ||
    description === undefined ||
    file === undefined ||
    lessonsValue === undefined
  ) {
    return undefined;
  }

  const lessons = lessonsValue
    .map((lesson, index) => parseCurriculumLesson(lesson, id, index + 1, diagnostics))
    .filter((lesson): lesson is CurriculumLessonEntry => lesson !== undefined);
  const review = parseCurriculumReview(record.review, `review in ${id}`, diagnostics);
  const supplementsValue = arrayField(
    record,
    'supplements',
    diagnostics,
    CURRICULUM_PATH,
    false,
  );
  const supplements = (supplementsValue ?? [])
    .map((supplement) =>
      parseCurriculumReview(supplement, `supplement in ${id}`, diagnostics),
    )
    .filter(
      (supplement): supplement is CurriculumSupplementEntry =>
        supplement !== undefined,
    );

  if (review === undefined || lessons.length !== lessonsValue.length) return undefined;
  if (supplementsValue !== undefined && supplements.length !== supplementsValue.length) {
    return undefined;
  }
  return { id, number, title, description, file, lessons, review, supplements };
}

export function parseCurriculumSource(source: SourceInput): ParsedCurriculum {
  const diagnostics: Diagnostic[] = [];
  const parsed = parseYaml(source.text, source.path, diagnostics);
  if (parsed === undefined) return { diagnostics };
  const record = requireRecord(parsed, diagnostics, source.path, 'curriculum');
  if (record === undefined) return { diagnostics };

  const schemaVersion = requireString(record, 'schema_version', diagnostics, source.path);
  const contentVersion = requireString(record, 'content_version', diagnostics, source.path);
  const language = requireString(record, 'language', diagnostics, source.path);
  const title = requireString(record, 'title', diagnostics, source.path);
  const description = requireString(record, 'description', diagnostics, source.path);
  const lastUpdated = requireDate(record, 'last_updated', diagnostics, source.path);
  const modulesValue = arrayField(record, 'modules', diagnostics, source.path, true);
  const extra = collectExtra(
    record,
    new Set([
      'schema_version',
      'content_version',
      'language',
      'title',
      'description',
      'last_updated',
      'modules',
    ]),
    diagnostics,
    source.path,
  );

  if (schemaVersion !== undefined && schemaVersion !== '1.0') {
    diagnostic(
      diagnostics,
      'error',
      'UNSUPPORTED_SCHEMA_VERSION',
      `Expected schema_version "1.0", received ${JSON.stringify(schemaVersion)}`,
      source.path,
    );
  }
  if (
    schemaVersion === undefined ||
    contentVersion === undefined ||
    language === undefined ||
    title === undefined ||
    description === undefined ||
    lastUpdated === undefined ||
    modulesValue === undefined
  ) {
    return { diagnostics };
  }

  const modules = modulesValue
    .map((module) => parseCurriculumModule(module, diagnostics))
    .filter((module): module is CurriculumModuleEntry => module !== undefined);
  if (modules.length !== modulesValue.length) return { diagnostics };

  return {
    manifest: {
      schemaVersion,
      contentVersion,
      language,
      title,
      description,
      lastUpdated,
      modules,
      extra,
    },
    diagnostics,
  };
}

export function parseMarkdownSource(source: SourceInput): ParsedMarkdown {
  const diagnostics: Diagnostic[] = [];
  const normalized = normalizeText(source.text);
  let frontmatter: Record<string, unknown> | null = null;
  let body = normalized;
  let bodyStart = 0;

  if (normalized.startsWith('---\n')) {
    const match = /^---\n([\s\S]*?)\n---(?:\n|$)/.exec(normalized);
    if (match === null) {
      diagnostic(
        diagnostics,
        'error',
        'UNCLOSED_FRONTMATTER',
        'Opening frontmatter delimiter has no closing delimiter',
        source.path,
      );
      return { diagnostics };
    }
    const parsed = parseYaml(match[1] ?? '', source.path, diagnostics);
    if (parsed === undefined) return { diagnostics };
    const record = requireRecord(parsed, diagnostics, source.path, 'frontmatter');
    if (record === undefined) return { diagnostics };
    frontmatter = record;
    bodyStart = match[0].length;
    body = normalized.slice(bodyStart);
  }

  let tree: Root;
  try {
    tree = markdownParser.parse(body);
  } catch (error) {
    diagnostic(
      diagnostics,
      'error',
      'MARKDOWN_PARSE_ERROR',
      error instanceof Error ? error.message : String(error),
      source.path,
    );
    return { diagnostics };
  }
  const firstHeadingNode = tree.children.find(
    (node) => node.type === 'heading' && node.depth === 1,
  );
  const firstHeading =
    firstHeadingNode === undefined ? null : mdastToString(firstHeadingNode);

  return {
    source: {
      path: source.path,
      revision: source.revision,
      frontmatter,
      normalizedText: normalized,
      body,
      bodyStart,
      bodyStartLine: 1 + (normalized.slice(0, bodyStart).match(/\n/g)?.length ?? 0),
      firstHeading,
      tree,
    },
    diagnostics,
  };
}

function headingAnchor(text: string): string {
  const anchor = text
    .normalize('NFKC')
    .toLocaleLowerCase('en-US')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
  return anchor.length === 0 ? 'section' : anchor;
}

function extractHeadings(source: ParsedMarkdownSource): Heading[] {
  const headings: Heading[] = [];
  const counts = new Map<string, number>();
  const used = new Set<string>();
  const visit = (node: Root | Root['children'][number]): void => {
    if (
      node.type === 'heading' &&
      node.position?.start.offset !== undefined &&
      node.position.end.offset !== undefined
    ) {
      const text = mdastToString(node);
      const base = headingAnchor(text);
      let ordinal = (counts.get(base) ?? 0) + 1;
      let id = ordinal === 1 ? base : `${base}-${ordinal}`;
      while (used.has(id)) {
        ordinal += 1;
        id = `${base}-${ordinal}`;
      }
      counts.set(base, ordinal);
      used.add(id);
      headings.push({
        id,
        depth: node.depth,
        text,
        source: sourceSpan(source, node.position.start.offset, node.position.end.offset),
      });
    }
    if ('children' in node) {
      for (const child of node.children) visit(child as Root['children'][number]);
    }
  };
  visit(source.tree);
  return headings;
}

export function parseDocumentBody(
  source: ParsedMarkdownSource,
  documentId: string,
  diagnostics: Diagnostic[],
): DocumentBody {
  const directives = extractDirectiveOccurrences(
    documentId,
    source,
    source.tree,
    diagnostics,
  );
  const parsedQuizzes = parseQuizzes(documentId, source, source.tree,
    blocksFromDirectives(source, directives), diagnostics,
    typeof source.frontmatter?.kind === 'string' ? source.frontmatter.kind : undefined);
  return {
    markdown: source.body,
    blocks: parsedQuizzes.blocks,
    quizzes: parsedQuizzes.quizzes,
    headings: extractHeadings(source),
  };
}

function parseLearningDocument(
  source: ParsedMarkdownSource,
  expectedKind: ExpectedKind,
  curriculumEntry?: CurriculumModuleEntry,
  curriculumModule?: CurriculumModuleEntry,
  diagnostics: Diagnostic[] = [],
): ContentDocument | undefined {
  const metadata = source.frontmatter;
  if (metadata === null) {
    diagnostic(
      diagnostics,
      'error',
      'MISSING_FRONTMATTER',
      `Registered ${expectedKind} requires frontmatter`,
      source.path,
    );
    return undefined;
  }

  const id = requireString(metadata, 'id', diagnostics, source.path);
  const title = requireString(metadata, 'title', diagnostics, source.path);
  const kind = requireString(metadata, 'kind', diagnostics, source.path);
  const lastUpdated = requireDate(metadata, 'last_updated', diagnostics, source.path);

  if (kind !== undefined && kind !== expectedKind) {
    diagnostic(
      diagnostics,
      'error',
      'INVALID_DOCUMENT_KIND',
      `Expected kind ${expectedKind}, received ${kind}`,
      source.path,
    );
  }

  if (
    id === undefined ||
    title === undefined ||
    kind !== expectedKind ||
    lastUpdated === undefined
  ) {
    return undefined;
  }

  if (expectedKind === 'module') {
    const number = requireInteger(metadata, 'number', diagnostics, source.path, 0);
    const description = requireString(metadata, 'description', diagnostics, source.path);
    const extra = collectExtra(
      metadata,
      new Set(['id', 'number', 'title', 'description', 'kind', 'last_updated']),
      diagnostics,
      source.path,
    );
    if (number === undefined || description === undefined || curriculumEntry === undefined) {
      return undefined;
    }
    const document: Module = {
      kind: 'module',
      id,
      title,
      path: source.path,
      revision: source.revision,
      lastUpdated,
      extra,
      body: parseDocumentBody(source, id, diagnostics),
      number,
      description,
      lessonIds: curriculumEntry.lessons.map((lesson) => lesson.id),
      reviewId: curriculumEntry.review.id,
      supplementIds: curriculumEntry.supplements.map((supplement) => supplement.id),
    };
    return document;
  }

  const moduleId = requireString(metadata, 'module_id', diagnostics, source.path);
  const estimatedMinutes = requireInteger(
    metadata,
    'estimated_minutes',
    diagnostics,
    source.path,
    1,
  );
  const originValue = requireString(metadata, 'content_origin', diagnostics, source.path);
  const origins = new Set<ContentOrigin>([
    'adapted_original',
    'new',
    'new_supplement',
  ]);
  const contentOrigin =
    originValue !== undefined && origins.has(originValue as ContentOrigin)
      ? (originValue as ContentOrigin)
      : undefined;
  if (originValue !== undefined && contentOrigin === undefined) {
    diagnostic(
      diagnostics,
      'error',
      'INVALID_CONTENT_ORIGIN',
      `Unsupported content_origin: ${originValue}`,
      source.path,
    );
  }
  const extensionMinutes = optionalInteger(
    metadata,
    'extension_minutes',
    diagnostics,
    source.path,
    0,
  );
  const sourceUrl = optionalString(metadata, 'source_url', diagnostics, source.path);
  const sourceMessageIds = optionalStringArray(
    metadata,
    'source_message_ids',
    diagnostics,
    source.path,
  );
  const asOf = optionalDate(metadata, 'as_of', diagnostics, source.path);
  const timeSensitive = optionalBoolean(
    metadata,
    'time_sensitive',
    diagnostics,
    source.path,
  );
  const updateReviewAfter = optionalDate(
    metadata,
    'update_review_after',
    diagnostics,
    source.path,
  );
  const originalLabel = optionalString(
    metadata,
    'original_label',
    diagnostics,
    source.path,
  );
  const commonKnown = new Set([
    'id',
    'module_id',
    'title',
    'estimated_minutes',
    'extension_minutes',
    'content_origin',
    'source_url',
    'source_message_ids',
    'last_updated',
    'as_of',
    'time_sensitive',
    'update_review_after',
    'kind',
  ]);
  if (expectedKind === 'lesson') commonKnown.add('lesson_number');
  if (expectedKind === 'supplement') commonKnown.add('original_label');
  const extra = collectExtra(metadata, commonKnown, diagnostics, source.path);

  if (
    moduleId === undefined ||
    estimatedMinutes === undefined ||
    contentOrigin === undefined ||
    curriculumModule === undefined
  ) {
    return undefined;
  }

  const common = {
    id,
    title,
    path: source.path,
    revision: source.revision,
    lastUpdated,
    extra,
    body: parseDocumentBody(source, id, diagnostics),
    moduleId,
    estimatedMinutes,
    contentOrigin,
    sourceMessageIds,
    ...(extensionMinutes === undefined ? {} : { extensionMinutes }),
    ...(sourceUrl === undefined ? {} : { sourceUrl }),
    ...(asOf === undefined ? {} : { asOf }),
    ...(timeSensitive === undefined ? {} : { timeSensitive }),
    ...(updateReviewAfter === undefined ? {} : { updateReviewAfter }),
  };

  if (expectedKind === 'lesson') {
    const lessonNumber = requireInteger(
      metadata,
      'lesson_number',
      diagnostics,
      source.path,
      1,
    );
    if (lessonNumber === undefined) return undefined;
    const document: Lesson = { kind: 'lesson', ...common, lessonNumber };
    return document;
  }
  if (expectedKind === 'review') {
    const document: Review = { kind: 'review', ...common };
    return document;
  }
  const document: Supplement = {
    kind: 'supplement',
    ...common,
    ...(originalLabel === undefined ? {} : { originalLabel }),
  };
  return document;
}

function parseSupportingDocument(
  source: ParsedMarkdownSource,
  diagnostics: Diagnostic[],
): SupportingDocument | undefined {
  if (source.frontmatter !== null) {
    diagnostic(
      diagnostics,
      'warning',
      'UNEXPECTED_SUPPORTING_FRONTMATTER',
      'Supporting document frontmatter is currently ignored',
      source.path,
    );
  }
  if (source.firstHeading === null || source.firstHeading.length === 0) {
    diagnostic(
      diagnostics,
      'error',
      'MISSING_SUPPORTING_TITLE',
      'Supporting document requires a level-1 heading',
      source.path,
    );
    return undefined;
  }
  const basename = path.posix.basename(source.path, '.md');
  const id = `doc:${basename}`;
  return {
    kind: 'supporting',
    id,
    path: source.path,
    title: source.firstHeading,
    revision: source.revision,
    body: parseDocumentBody(source, id, diagnostics),
  };
}

async function readSourceFile(
  contentRoot: string,
  contentPath: ContentPath,
): Promise<SourceInput> {
  const absolutePath = path.join(contentRoot, ...contentPath.split('/'));
  const bytes = await fs.readFile(absolutePath);
  const decoder = new TextDecoder('utf-8', { fatal: true });
  const text = normalizeText(decoder.decode(bytes));
  return { path: contentPath, text, revision: sha256(bytes) };
}

async function inventory(contentRoot: string): Promise<ContentPath[]> {
  const paths: ContentPath[] = [];
  const walk = async (directory: string, prefix: string): Promise<void> => {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    entries.sort((left, right) => left.name.localeCompare(right.name, 'en'));
    for (const entry of entries) {
      const contentPath = prefix === '' ? entry.name : `${prefix}/${entry.name}`;
      const absolutePath = path.join(directory, entry.name);
      if (entry.isDirectory()) await walk(absolutePath, contentPath);
      else if (entry.isFile()) paths.push(contentPath);
    }
  };
  await walk(contentRoot, '');
  return paths;
}

function expectedEntries(manifest: CurriculumManifest): Array<{
  file: ContentPath;
  kind: ExpectedKind;
  module: CurriculumModuleEntry;
}> {
  const entries: Array<{
    file: ContentPath;
    kind: ExpectedKind;
    module: CurriculumModuleEntry;
  }> = [];
  for (const module of manifest.modules) {
    entries.push({ file: module.file, kind: 'module', module });
    entries.push(
      ...module.lessons.map((lesson) => ({
        file: lesson.file,
        kind: 'lesson' as const,
        module,
      })),
    );
    entries.push({ file: module.review.file, kind: 'review', module });
    entries.push(
      ...module.supplements.map((supplement) => ({
        file: supplement.file,
        kind: 'supplement' as const,
        module,
      })),
    );
  }
  return entries;
}

export async function parseContentDirectory(contentRoot: string): Promise<ParseResult> {
  const diagnostics: Diagnostic[] = [];
  let inventoryPaths: ContentPath[];
  try {
    inventoryPaths = await inventory(contentRoot);
  } catch (error) {
    diagnostic(
      diagnostics,
      'error',
      'CONTENT_DIRECTORY_READ_ERROR',
      error instanceof Error ? error.message : String(error),
      '.',
    );
    return { ok: false, diagnostics };
  }

  if (!inventoryPaths.includes(CURRICULUM_PATH)) {
    diagnostic(
      diagnostics,
      'error',
      'MISSING_CURRICULUM',
      'content/curriculum.yaml does not exist',
      CURRICULUM_PATH,
    );
    return { ok: false, diagnostics };
  }

  let curriculumSource: SourceInput;
  try {
    curriculumSource = await readSourceFile(contentRoot, CURRICULUM_PATH);
  } catch (error) {
    diagnostic(
      diagnostics,
      'error',
      'SOURCE_READ_ERROR',
      error instanceof Error ? error.message : String(error),
      CURRICULUM_PATH,
    );
    return { ok: false, diagnostics };
  }
  const curriculumResult = parseCurriculumSource(curriculumSource);
  diagnostics.push(...curriculumResult.diagnostics);
  const manifest = curriculumResult.manifest;
  if (manifest === undefined) return { ok: false, diagnostics };

  const markdownPaths = inventoryPaths.filter((file) => file.endsWith('.md'));
  const parsedByPath = new Map<ContentPath, ParsedMarkdownSource>();
  const revisions = new Map<ContentPath, string>([
    [curriculumSource.path, curriculumSource.revision],
  ]);

  for (const markdownPath of markdownPaths) {
    try {
      const source = await readSourceFile(contentRoot, markdownPath);
      revisions.set(source.path, source.revision);
      const result = parseMarkdownSource(source);
      diagnostics.push(...result.diagnostics);
      if (result.source !== undefined) parsedByPath.set(markdownPath, result.source);
    } catch (error) {
      diagnostic(
        diagnostics,
        'error',
        'SOURCE_READ_ERROR',
        error instanceof Error ? error.message : String(error),
        markdownPath,
      );
    }
  }

  const documentsByPath = new Map<ContentPath, ContentDocument>();
  for (const entry of expectedEntries(manifest)) {
    const parsed = parsedByPath.get(entry.file);
    if (parsed === undefined) continue;
    const document = parseLearningDocument(
      parsed,
      entry.kind,
      entry.kind === 'module' ? entry.module : undefined,
      entry.module,
      diagnostics,
    );
    if (document !== undefined) documentsByPath.set(entry.file, document);
  }

  for (const supportingPath of SUPPORTING_PATHS) {
    const parsed = parsedByPath.get(supportingPath);
    if (parsed === undefined) {
      diagnostic(
        diagnostics,
        'error',
        'MISSING_SUPPORTING_DOCUMENT',
        `Expected supporting document is missing: ${supportingPath}`,
        supportingPath,
      );
      continue;
    }
    const document = parseSupportingDocument(parsed, diagnostics);
    if (document !== undefined) documentsByPath.set(supportingPath, document);
  }

  validateCrossReferences(manifest, documentsByPath, inventoryPaths, diagnostics);

  const documentsById: Record<string, ContentDocument> = {};
  const idByPath: Record<string, string> = {};
  const orderedPaths = [
    ...expectedEntries(manifest).map((entry) => entry.file),
    ...SUPPORTING_PATHS,
  ];
  for (const contentPath of orderedPaths) {
    const document = documentsByPath.get(contentPath);
    if (document === undefined) continue;
    if (documentsById[document.id] !== undefined) {
      diagnostic(
        diagnostics,
        'error',
        'DUPLICATE_CONTENT_ID',
        `Parsed document ID is already in use: ${document.id}`,
        contentPath,
      );
      continue;
    }
    documentsById[document.id] = document;
    idByPath[contentPath] = document.id;
  }

  if (diagnostics.some((item) => item.severity === 'error')) {
    return { ok: false, diagnostics };
  }

  const digestInput = [
    `model:${MODEL_VERSION}`,
    `parser:${PARSER_VERSION}`,
    ...[...revisions]
      .sort(([left], [right]) => left.localeCompare(right, 'en'))
      .map(([contentPath, revision]) => `${contentPath}\0${revision}`),
  ].join('\n');

  const catalog: ContentCatalog = {
    modelVersion: MODEL_VERSION,
    parserVersion: PARSER_VERSION,
    sourceDigest: sha256(digestInput),
    curriculum: {
      schemaVersion: manifest.schemaVersion,
      contentVersion: manifest.contentVersion,
      language: manifest.language,
      title: manifest.title,
      description: manifest.description,
      lastUpdated: manifest.lastUpdated,
      moduleIds: manifest.modules.map((module) => module.id),
      extra: manifest.extra,
    },
    documentsById,
    idByPath,
  };
  return { ok: true, data: catalog, diagnostics };
}
