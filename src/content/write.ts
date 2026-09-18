import { randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

import { parseContentDirectory } from './parse.js';
import type {
  ContentCatalog,
  ContentDocument,
  ContentDocumentSummary,
  ContentIndex,
  Diagnostic,
} from './types.js';

export interface ContentBuildResult {
  index: ContentIndex;
  documentCount: number;
  outputDirectory: string;
}

export class ContentBuildError extends Error {
  constructor(message: string, readonly diagnostics: Diagnostic[] = []) {
    super(message);
    this.name = 'ContentBuildError';
  }
}

function json(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

export function documentFilename(id: string): string {
  let stem = id.replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^[. ]+|[. ]+$/g, '');
  if (stem.length === 0) stem = 'document';
  if (/^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(stem)) stem = `_${stem}`;
  return `${stem}.json`;
}

function summary(document: ContentDocument, documentFile: string): ContentDocumentSummary {
  const base = {
    id: document.id,
    kind: document.kind,
    title: document.title,
    path: document.path,
    revision: document.revision,
    documentFile,
  };
  if (document.kind === 'module') {
    return {
      ...base,
      kind: 'module',
      number: document.number,
      description: document.description,
      lessonIds: document.lessonIds,
      reviewId: document.reviewId,
      supplementIds: document.supplementIds,
    };
  }
  if (document.kind === 'supporting') return { ...base, kind: 'supporting' };
  return {
    ...base,
    kind: document.kind,
    moduleId: document.moduleId,
    estimatedMinutes: document.estimatedMinutes,
    contentOrigin: document.contentOrigin,
    ...(document.extensionMinutes === undefined
      ? {}
      : { extensionMinutes: document.extensionMinutes }),
    ...(document.kind === 'lesson' ? { lessonNumber: document.lessonNumber } : {}),
    ...(document.kind === 'supplement' && document.originalLabel !== undefined
      ? { originalLabel: document.originalLabel }
      : {}),
  };
}

export function createContentIndex(catalog: ContentCatalog): ContentIndex {
  const documentsById: Record<string, ContentDocumentSummary> = {};
  const filenames = new Map<string, string>();
  const documentIds = Object.keys(catalog.documentsById);
  for (const id of documentIds) {
    const document = catalog.documentsById[id];
    if (document === undefined) throw new ContentBuildError(`Missing document for ID ${id}`);
    const filename = documentFilename(id);
    const folded = filename.toLocaleLowerCase('en-US');
    const previous = filenames.get(folded);
    if (previous !== undefined) {
      throw new ContentBuildError(
        `Output filename collision: ${previous} and ${id} both map to ${filename}`,
      );
    }
    filenames.set(folded, id);
    documentsById[id] = summary(
      document,
      `documents/${catalog.sourceDigest}/${filename}`,
    );
  }
  return {
    modelVersion: catalog.modelVersion,
    parserVersion: catalog.parserVersion,
    sourceDigest: catalog.sourceDigest,
    curriculum: catalog.curriculum,
    moduleIds: [...catalog.curriculum.moduleIds],
    documentIds,
    documentsById,
    idByPath: catalog.idByPath,
  };
}

async function writePreparedDirectory(
  catalog: ContentCatalog,
  index: ContentIndex,
  directory: string,
): Promise<void> {
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(path.join(directory, 'index.json'), json(index), 'utf8');
  for (const id of index.documentIds) {
    const document = catalog.documentsById[id];
    const entry = index.documentsById[id];
    if (document === undefined || entry === undefined) {
      throw new ContentBuildError(`Catalog changed while writing ${id}`);
    }
    const documentPath = path.join(directory, ...entry.documentFile.split('/'));
    await fs.mkdir(path.dirname(documentPath), { recursive: true });
    await fs.writeFile(documentPath, json(document), 'utf8');
  }
}

function isRetryableWindowsError(error: unknown): boolean {
  const code = (error as NodeJS.ErrnoException).code;
  return code === 'EPERM' || code === 'EACCES' || code === 'EBUSY';
}

async function renameWithRetry(source: string, destination: string): Promise<void> {
  for (let attempt = 0; ; attempt += 1) {
    try {
      await fs.rename(source, destination);
      return;
    } catch (error) {
      if (!isRetryableWindowsError(error) || attempt >= 7) throw error;
      await new Promise(resolve => setTimeout(resolve, 25 * 2 ** attempt));
    }
  }
}

async function exists(file: string): Promise<boolean> {
  try {
    await fs.access(file);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return false;
    throw error;
  }
}

async function assertSameDirectory(left: string, right: string): Promise<void> {
  const compare = async (leftDirectory: string, rightDirectory: string): Promise<void> => {
    const [leftEntries, rightEntries] = await Promise.all([
      fs.readdir(leftDirectory, { withFileTypes: true }),
      fs.readdir(rightDirectory, { withFileTypes: true }),
    ]);
    const sort = (entries: typeof leftEntries) => entries.sort((a, b) => a.name.localeCompare(b.name, 'en'));
    sort(leftEntries);
    sort(rightEntries);
    if (leftEntries.length !== rightEntries.length) {
      throw new ContentBuildError('Existing generated content does not match its source digest');
    }
    for (let index = 0; index < leftEntries.length; index += 1) {
      const leftEntry = leftEntries[index]!;
      const rightEntry = rightEntries[index]!;
      if (leftEntry.name !== rightEntry.name || leftEntry.isDirectory() !== rightEntry.isDirectory()) {
        throw new ContentBuildError('Existing generated content does not match its source digest');
      }
      const leftPath = path.join(leftDirectory, leftEntry.name);
      const rightPath = path.join(rightDirectory, rightEntry.name);
      if (leftEntry.isDirectory()) await compare(leftPath, rightPath);
      else if (!(await fs.readFile(leftPath)).equals(await fs.readFile(rightPath))) {
        throw new ContentBuildError('Existing generated content does not match its source digest');
      }
    }
  };
  await compare(left, right);
}

async function commitIndex(preparedIndex: string, target: string, nonce: string): Promise<void> {
  const indexPath = path.join(target, 'index.json');
  const staged = path.join(target, `.index.tmp-${nonce}`);
  const backup = path.join(target, `.index.backup-${nonce}`);
  await fs.copyFile(preparedIndex, staged);
  let hadPrevious = false;
  try {
    try {
      await renameWithRetry(indexPath, backup);
      hadPrevious = true;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }
    try {
      await renameWithRetry(staged, indexPath);
    } catch (error) {
      if (hadPrevious) await renameWithRetry(backup, indexPath);
      throw error;
    }
    if (hadPrevious) await fs.rm(backup, { force: true });
  } finally {
    await fs.rm(staged, { force: true });
  }
}

async function cleanupOldGenerations(target: string, currentDigest: string): Promise<void> {
  const documents = path.join(target, 'documents');
  try {
    const entries = await fs.readdir(documents, { withFileTypes: true });
    await Promise.all(entries.map(entry => {
      if (entry.name === currentDigest) return Promise.resolve();
      return fs.rm(path.join(documents, entry.name), { recursive: true, force: true });
    }));
  } catch {
    // Cleanup is best-effort: the committed index already points at a complete generation.
  }
}

export async function writeContentCatalog(
  catalog: ContentCatalog,
  outputDirectory: string,
): Promise<ContentBuildResult> {
  const index = createContentIndex(catalog);
  const target = path.resolve(outputDirectory);
  const parent = path.dirname(target);
  const name = path.basename(target);
  const nonce = `${process.pid}-${randomUUID()}`;
  const temporary = path.join(parent, `.${name}.tmp-${nonce}`);
  await fs.mkdir(parent, { recursive: true });
  try {
    await writePreparedDirectory(catalog, index, temporary);
    await fs.mkdir(target, { recursive: true });
    const relativeGeneration = path.join('documents', catalog.sourceDigest);
    const preparedGeneration = path.join(temporary, relativeGeneration);
    const publishedGeneration = path.join(target, relativeGeneration);
    await fs.mkdir(path.dirname(publishedGeneration), { recursive: true });
    if (await exists(publishedGeneration)) {
      await assertSameDirectory(preparedGeneration, publishedGeneration);
    } else {
      await renameWithRetry(preparedGeneration, publishedGeneration);
    }
    await commitIndex(path.join(temporary, 'index.json'), target, nonce);
    await cleanupOldGenerations(target, catalog.sourceDigest);
  } finally {
    await fs.rm(temporary, { recursive: true, force: true });
  }
  return { index, documentCount: index.documentIds.length, outputDirectory: target };
}

export async function buildContent(
  contentDirectory: string,
  outputDirectory: string,
): Promise<ContentBuildResult> {
  const parsed = await parseContentDirectory(contentDirectory);
  if (!parsed.ok) {
    throw new ContentBuildError('Content validation failed; generated output was not published', parsed.diagnostics);
  }
  return writeContentCatalog(parsed.data, outputDirectory);
}
