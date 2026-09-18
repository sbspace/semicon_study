import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeAll, describe, expect, it } from 'vitest';

import { ContentLoadError, ContentLoader, type ContentTransport } from '../src/content/load.js';
import { parseContentDirectory } from '../src/content/parse.js';
import type { ContentCatalog, ContentIndex, Lesson } from '../src/content/types.js';
import {
  ContentBuildError,
  createContentIndex,
  documentFilename,
  writeContentCatalog,
} from '../src/content/write.js';

const contentRoot = path.resolve('content');
const temporaryDirectories: string[] = [];
let catalog: ContentCatalog;

beforeAll(async () => {
  const parsed = await parseContentDirectory(contentRoot);
  if (!parsed.ok) throw new Error(JSON.stringify(parsed.diagnostics));
  catalog = parsed.data;
});

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map(directory =>
      fs.rm(directory, { recursive: true, force: true }),
    ),
  );
});

async function temporaryDirectory(): Promise<string> {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'content-io-'));
  temporaryDirectories.push(directory);
  return directory;
}

async function generatedFiles(root: string): Promise<Map<string, string>> {
  const files = new Map<string, string>();
  const walk = async (directory: string, prefix = ''): Promise<void> => {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    entries.sort((left, right) => left.name.localeCompare(right.name, 'en'));
    for (const entry of entries) {
      const relative = prefix === '' ? entry.name : `${prefix}/${entry.name}`;
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) await walk(absolute, relative);
      else files.set(relative, await fs.readFile(absolute, 'utf8'));
    }
  };
  await walk(root);
  return files;
}

class MemoryTransport implements ContentTransport {
  readonly calls = new Map<string, number>();

  constructor(readonly values: Map<string, unknown>) {}

  async loadJson(file: string): Promise<unknown> {
    this.calls.set(file, (this.calls.get(file) ?? 0) + 1);
    if (!this.values.has(file)) throw new Error(`Missing ${file}`);
    return this.values.get(file);
  }
}

function indexValues(index = createContentIndex(catalog)): Map<string, unknown> {
  const values = new Map<string, unknown>([['index.json', structuredClone(index)]]);
  for (const id of index.documentIds) {
    const entry = index.documentsById[id]!;
    values.set(entry.documentFile, structuredClone(catalog.documentsById[id]));
  }
  return values;
}

describe('static content writer', () => {
  it('writes a compact index and one complete JSON file for every document', async () => {
    const parent = await temporaryDirectory();
    const output = path.join(parent, 'content');
    const result = await writeContentCatalog(catalog, output);
    const indexText = await fs.readFile(path.join(output, 'index.json'), 'utf8');
    const index = JSON.parse(indexText) as ContentIndex;
    const generationDirectory = path.join(output, 'documents', catalog.sourceDigest);
    const documentFiles = await fs.readdir(generationDirectory);

    expect(result.documentCount).toBe(82);
    expect(index.documentIds).toEqual(Object.keys(catalog.documentsById));
    expect(index.moduleIds).toEqual(catalog.curriculum.moduleIds);
    expect(index.sourceDigest).toBe(catalog.sourceDigest);
    expect(indexText).not.toContain('"body"');
    expect(indexText).not.toContain('"blocks"');
    expect(indexText).not.toContain('"quizzes"');
    expect(documentFiles).toHaveLength(82);
    expect(new Set(documentFiles.map(file => file.toLowerCase()))).toHaveLength(82);
    expect(index.documentsById['doc:README']!.documentFile).toBe(
      `documents/${catalog.sourceDigest}/doc-README.json`,
    );

    const supporting = JSON.parse(
      await fs.readFile(path.join(generationDirectory, 'doc-README.json'), 'utf8'),
    );
    expect(supporting).toEqual(catalog.documentsById['doc:README']);
  });

  it('produces byte-identical JSON from the same catalog', async () => {
    const parent = await temporaryDirectory();
    const first = path.join(parent, 'first');
    const second = path.join(parent, 'second');
    await writeContentCatalog(catalog, first);
    await writeContentCatalog(catalog, second);
    expect(await generatedFiles(first)).toEqual(await generatedFiles(second));
  });

  it('publishes again while the output directory is open', async () => {
    const parent = await temporaryDirectory();
    const output = path.join(parent, 'content');
    await writeContentCatalog(catalog, output);
    const handle = await fs.opendir(output);
    try {
      await expect(writeContentCatalog(catalog, output)).resolves.toMatchObject({
        documentCount: 82,
      });
    } finally {
      await handle.close();
    }
  });

  it('keeps the previous published directory when generation fails partway through', async () => {
    const parent = await temporaryDirectory();
    const output = path.join(parent, 'content');
    await fs.mkdir(output);
    await fs.writeFile(path.join(output, 'previous.txt'), 'previous build', 'utf8');
    const broken = structuredClone(catalog) as ContentCatalog & { bad?: unknown };
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    (broken.documentsById.m00 as unknown as Record<string, unknown>).unserializable = circular;

    await expect(writeContentCatalog(broken, output)).rejects.toThrow();
    expect(await fs.readFile(path.join(output, 'previous.txt'), 'utf8')).toBe('previous build');
    expect(await fs.readdir(parent)).toEqual(['content']);
  });

  it('uses deterministic safe filenames and rejects case-insensitive collisions', () => {
    expect(documentFilename('m01-l03')).toBe('m01-l03.json');
    expect(documentFilename('doc:README')).toBe('doc-README.json');
    const colliding = structuredClone(catalog);
    colliding.documentsById['m00:l01'] = {
      ...structuredClone(colliding.documentsById['m00-l01'] as Lesson),
      id: 'm00:l01',
    };
    expect(() => createContentIndex(colliding)).toThrow(ContentBuildError);
  });
});

describe('framework-independent content loader', () => {
  it('loads the index and every supported document kind through explicit mappings', async () => {
    const loader = new ContentLoader(new MemoryTransport(indexValues()));
    expect((await loader.loadIndex()).documentIds).toHaveLength(82);
    expect((await loader.getModule('m00')).kind).toBe('module');
    expect((await loader.getLesson('m01-l01')).kind).toBe('lesson');
    expect((await loader.getReview('m03-review')).kind).toBe('review');
    expect((await loader.getSupplement('m01-s-sram')).kind).toBe('supplement');
    expect((await loader.getSupportingDocument('doc:README')).kind).toBe('supporting');
  });

  it('preserves complete structured lesson data', async () => {
    const lesson = await new ContentLoader(new MemoryTransport(indexValues())).getLesson('m00-l01');
    expect(lesson.body.markdown.length).toBeGreaterThan(0);
    expect(lesson.body.quizzes).toHaveLength(1);
    expect(lesson.body.headings.length).toBeGreaterThan(0);
    expect(lesson.body.blocks.some(block => block.kind === 'interactive')).toBe(true);
    expect(lesson.body.blocks.some(block => block.kind === 'visual')).toBe(true);
    expect(lesson.body.quizzes[0]!.questions[0]!.source.start).toBeGreaterThan(0);
  });

  it('reports unknown IDs, transport failures, malformed indexes, and kind mismatches', async () => {
    const loader = new ContentLoader(new MemoryTransport(indexValues()));
    await expect(loader.getDocument('missing')).rejects.toMatchObject({ code: 'UNKNOWN_DOCUMENT' });
    await expect(loader.getLesson('m00')).rejects.toMatchObject({ code: 'KIND_MISMATCH' });
    await expect(
      new ContentLoader(new MemoryTransport(new Map())).loadIndex(),
    ).rejects.toMatchObject({ code: 'TRANSPORT_ERROR' });
    await expect(
      new ContentLoader({
        async loadJson() { return JSON.parse('{invalid json'); },
      }).loadIndex(),
    ).rejects.toMatchObject({ code: 'TRANSPORT_ERROR' });
    await expect(
      new ContentLoader(new MemoryTransport(new Map([['index.json', { modelVersion: '2' }]]))).loadIndex(),
    ).rejects.toMatchObject({ code: 'INVALID_INDEX' });
  });

  it.each(['id', 'revision'])('rejects document %s mismatches against the index', async field => {
    const index = createContentIndex(catalog);
    const values = indexValues(index);
    const entry = index.documentsById['m01-l01']!;
    const document = structuredClone(values.get(entry.documentFile)) as Record<string, unknown>;
    document[field] = 'mismatch';
    values.set(entry.documentFile, document);
    await expect(new ContentLoader(new MemoryTransport(values)).getLesson('m01-l01')).rejects
      .toMatchObject({ code: 'DOCUMENT_MISMATCH' });
  });

  it('reuses the same document promise and object for an ID plus revision', async () => {
    const transport = new MemoryTransport(indexValues());
    const loader = new ContentLoader(transport);
    const [first, second] = await Promise.all([
      loader.getDocument('m01-l01'),
      loader.getDocument('m01-l01'),
    ]);
    expect(first).toBe(second);
    const file = (await loader.loadIndex()).documentsById['m01-l01']!.documentFile;
    expect(transport.calls.get(file)).toBe(1);
    expect(transport.calls.get('index.json')).toBe(1);
  });

  it('does not retain failed document loads in the memory cache', async () => {
    const index = createContentIndex(catalog);
    const values = indexValues(index);
    const entry = index.documentsById['m01-l01']!;
    values.delete(entry.documentFile);
    const transport = new MemoryTransport(values);
    const loader = new ContentLoader(transport);
    await expect(loader.getDocument('m01-l01')).rejects.toBeInstanceOf(ContentLoadError);
    values.set(entry.documentFile, structuredClone(catalog.documentsById['m01-l01']));
    await expect(loader.getDocument('m01-l01')).resolves.toMatchObject({ id: 'm01-l01' });
    expect(transport.calls.get(entry.documentFile)).toBe(2);
  });
});
