import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import {
  parseContentDirectory,
  parseCurriculumSource,
  parseDocumentBody,
  parseMarkdownSource,
  type SourceInput,
} from '../src/content/parse.js';
import type {
  ContentBlock,
  ContentDocument,
  Diagnostic,
  Lesson,
  Module,
} from '../src/content/types.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentRoot = path.join(projectRoot, 'content');
const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) =>
      fs.rm(directory, { recursive: true, force: true }),
    ),
  );
});

function source(pathname: string, text: string): SourceInput {
  return {
    path: pathname,
    text,
    revision: createHash('sha256').update(text).digest('hex'),
  };
}

async function copyContent(): Promise<string> {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'content-parser-'));
  temporaryDirectories.push(directory);
  const copiedContent = path.join(directory, 'content');
  await fs.cp(contentRoot, copiedContent, { recursive: true });
  return copiedContent;
}

function countKinds(documents: ContentDocument[]): Record<string, number> {
  return documents.reduce<Record<string, number>>((counts, document) => {
    counts[document.kind] = (counts[document.kind] ?? 0) + 1;
    return counts;
  }, {});
}

function blockMarkdown(block: ContentBlock): string {
  if (block.kind === 'markdown') return block.content.markdown;
  if (block.kind === 'interactive' || block.kind === 'visual') {
    return block.value.original.markdown;
  }
  return block.original.markdown;
}

function expectedDocumentOrder(): string[] {
  const lessonCounts = [5, 7, 6, 9, 6, 4, 4, 4, 4, 4];
  const supplements: Record<number, string[]> = {
    1: ['m01-s-half-adder', 'm01-s-sram'],
    2: ['m02-s-feol-beol', 'm02-s-floorplan', 'm02-s-wafer-shot'],
  };
  const ids: string[] = [];
  lessonCounts.forEach((lessonCount, moduleNumber) => {
    const moduleId = `m${String(moduleNumber).padStart(2, '0')}`;
    ids.push(moduleId);
    for (let lessonNumber = 1; lessonNumber <= lessonCount; lessonNumber += 1) {
      ids.push(`${moduleId}-l${String(lessonNumber).padStart(2, '0')}`);
    }
    ids.push(`${moduleId}-review`);
    ids.push(...(supplements[moduleNumber] ?? []));
  });
  ids.push(
    'doc:README',
    'doc:visual_map',
    'doc:source_map',
    'doc:quality_review',
  );
  return ids;
}

describe('the current content tree', () => {
  it('parses the complete catalog with the expected kinds and no diagnostics', async () => {
    const result = await parseContentDirectory(contentRoot);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.diagnostics).toEqual([]);
    expect(countKinds(Object.values(result.data.documentsById))).toEqual({
      module: 10,
      lesson: 53,
      review: 10,
      supplement: 5,
      supporting: 4,
    });
    expect(result.data.curriculum.schemaVersion).toBe('1.0');
    expect(result.data.curriculum.contentVersion).toBe('2026.09.16');
    expect(result.data.curriculum.moduleIds).toEqual(
      Array.from({ length: 10 }, (_, index) => `m${String(index).padStart(2, '0')}`),
    );
  });

  it('keeps curriculum order in the catalog and module relationships', async () => {
    const result = await parseContentDirectory(contentRoot);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(Object.keys(result.data.documentsById)).toEqual(expectedDocumentOrder());

    const moduleOne = result.data.documentsById.m01 as Module;
    expect(moduleOne.lessonIds).toEqual([
      'm01-l01',
      'm01-l02',
      'm01-l03',
      'm01-l04',
      'm01-l05',
      'm01-l06',
      'm01-l07',
    ]);
    expect(moduleOne.reviewId).toBe('m01-review');
    expect(moduleOne.supplementIds).toEqual([
      'm01-s-half-adder',
      'm01-s-sram',
    ]);
  });

  it('preserves normalized Markdown and hashes the original file bytes', async () => {
    const result = await parseContentDirectory(contentRoot);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const lesson = result.data.documentsById['m00-l01'] as Lesson;
    const bytes = await fs.readFile(path.join(contentRoot, 'module-00-basics', 'lesson-01.md'));
    expect(lesson.revision).toBe(createHash('sha256').update(bytes).digest('hex'));
    expect(lesson.body.markdown).toContain('# Module 0 / Lesson 1');
    expect(lesson.body.markdown).not.toContain('\r');
    expect(lesson.body.markdown).not.toMatch(/^---\n/);
    expect(lesson.body.blocks.length).toBeGreaterThan(1);
    expect(lesson.body.quizzes).toHaveLength(1);
    expect(lesson.body.quizzes[0]?.status).toBe('structured');
    expect(lesson.body.headings[0]).toEqual(
      expect.objectContaining({ depth: 1, text: expect.stringContaining('Module 0') }),
    );
  });

  it('keeps supporting documents outside every module learning count', async () => {
    const result = await parseContentDirectory(contentRoot);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const supportingIds = Object.values(result.data.documentsById)
      .filter((document) => document.kind === 'supporting')
      .map((document) => document.id);
    expect(supportingIds).toEqual([
      'doc:README',
      'doc:visual_map',
      'doc:source_map',
      'doc:quality_review',
    ]);
    const referencedIds = Object.values(result.data.documentsById)
      .filter((document): document is Module => document.kind === 'module')
      .flatMap((module) => [
        ...module.lessonIds,
        module.reviewId,
        ...module.supplementIds,
      ]);
    expect(referencedIds).not.toContain('doc:README');
  });

  it('extracts the current directive inventory and every heading', async () => {
    const result = await parseContentDirectory(contentRoot);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const documents = Object.values(result.data.documentsById);
    const interactive = documents.flatMap((document) =>
      document.body.blocks.filter((block) => block.kind === 'interactive'),
    );
    const visuals = documents.flatMap((document) =>
      document.body.blocks.filter((block) => block.kind === 'visual'),
    );

    expect(interactive).toHaveLength(60);
    expect(new Set(interactive.map((block) => block.value.type))).toHaveLength(53);
    expect(visuals).toHaveLength(58);
    expect(
      new Set(
        visuals
          .map((block) => block.value.sourceId)
          .filter((sourceId): sourceId is string => sourceId !== undefined),
      ),
    ).toHaveLength(47);
    expect(documents.reduce((total, document) => total + document.body.headings.length, 0)).toBe(
      1449,
    );
  });

  it('reconstructs every document body exactly and keeps source spans on normalized input', async () => {
    const result = await parseContentDirectory(contentRoot);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    for (const document of Object.values(result.data.documentsById)) {
      expect(document.body.blocks.map(blockMarkdown).join('')).toBe(document.body.markdown);
      const original = (await fs.readFile(path.join(contentRoot, ...document.path.split('/')), 'utf8'))
        .replace(/^\ufeff/, '')
        .replace(/\r\n?/g, '\n');
      for (const heading of document.body.headings) {
        expect(original.slice(heading.source.start, heading.source.end)).toContain('#');
        expect(heading.source.startLine).toBeGreaterThanOrEqual(1);
        expect(heading.source.endLine).toBeGreaterThanOrEqual(heading.source.startLine);
      }
      for (const block of document.body.blocks) {
        const fragment =
          block.kind === 'markdown'
            ? block.content
            : block.kind === 'interactive' || block.kind === 'visual'
              ? block.value.original
              : block.original;
        expect(original.slice(fragment.source.start, fragment.source.end)).toBe(fragment.markdown);
      }
    }
  });

  it('keeps directive instance order, id-less visuals, and legacy visual links', async () => {
    const result = await parseContentDirectory(contentRoot);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const lessonFour = result.data.documentsById['m00-l04'] as Lesson;
    const interactive = lessonFour.body.blocks.filter((block) => block.kind === 'interactive');
    expect(interactive.map((block) => [block.value.instanceId, block.value.type])).toEqual([
      ['m00-l04:interactive:1', 'mosfet-channel'],
      ['m00-l04:interactive:2', 'mos-capacitor'],
    ]);
    expect(interactive[0]?.value.original.source.start).toBeLessThan(
      interactive[1]?.value.original.source.start ?? 0,
    );

    const lessonThree = result.data.documentsById['m00-l03'] as Lesson;
    const idlessVisuals = lessonThree.body.blocks.filter((block) => block.kind === 'visual');
    expect(idlessVisuals.map((block) => block.value.sourceId)).toEqual([undefined, undefined]);

    const legacy = result.data.documentsById['m01-l05'] as Lesson;
    expect(legacy.body.markdown).toContain('[<visual_element id="e1">](');
    expect(legacy.body.blocks.some((block) => block.kind === 'unsupported-directive')).toBe(false);
  });

  it('does not structure quizzes or directive examples in supporting documents', async () => {
    const result = await parseContentDirectory(contentRoot);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const documents = Object.values(result.data.documentsById).filter(document => document.kind === 'supporting');
    expect(documents.every((document) => document.body.quizzes.length === 0)).toBe(true);
    expect(
      documents.every((document) =>
        document.body.blocks.every(
          (block) => block.kind !== 'quiz-question' && block.kind !== 'quiz-answer',
        ),
      ),
    ).toBe(true);
    const readme = result.data.documentsById['doc:README'];
    expect(readme?.body.blocks.every((block) => block.kind === 'markdown')).toBe(true);
  });
});

describe('source parsing and diagnostics', () => {
  it('allows a BOM and normalizes CRLF without requiring frontmatter', () => {
    const parsed = parseMarkdownSource(
      source('README.md', '\ufeff# 안내\r\n\r\n본문\r\n'),
    );

    expect(parsed.diagnostics).toEqual([]);
    expect(parsed.source?.frontmatter).toBeNull();
    expect(parsed.source?.body).toBe('# 안내\n\n본문\n');
    expect(parsed.source?.firstHeading).toBe('안내');
  });

  it('tracks exact UTF-16 spans and duplicate anchors across BOM, CRLF, and frontmatter', () => {
    const input = '\ufeff---\r\nid: test\r\n---\r\n# 제목 😀\r\n\r\n## 반복\r\n## 반복\r\n';
    const parsed = parseMarkdownSource(source('test.md', input));
    expect(parsed.diagnostics).toEqual([]);
    expect(parsed.source).toBeDefined();
    if (parsed.source === undefined) return;
    const diagnostics: Diagnostic[] = [];
    const body = parseDocumentBody(parsed.source, 'doc:test', diagnostics);
    const normalized = input.slice(1).replace(/\r\n?/g, '\n');

    expect(diagnostics).toEqual([]);
    expect(parsed.source.bodyStart).toBe(normalized.indexOf('# 제목'));
    expect(parsed.source.bodyStartLine).toBe(4);
    expect(body.headings.map((heading) => heading.id)).toEqual(['제목', '반복', '반복-2']);
    expect(body.headings[0]?.source).toEqual({
      path: 'test.md',
      start: normalized.indexOf('# 제목'),
      end: normalized.indexOf('# 제목') + '# 제목 😀'.length,
      startLine: 4,
      endLine: 4,
    });
    for (const heading of body.headings) {
      expect(normalized.slice(heading.source.start, heading.source.end)).toContain(heading.text);
    }
  });

  it('extracts only standalone directives and preserves fenced, inline, and unknown syntax', () => {
    const markdown = [
      '# Test',
      '',
      '```text',
      '<interactive type="inside-fence" />',
      '```',
      '',
      'Inline `<interactive type="inline-code" />` example.',
      '',
      '<interactive type="real-slot" />',
      '<visual-needed type="cross-section" description="A &amp; B" />',
      '<future-widget mode="safe" />',
      '',
      '<div>',
      '<interactive type="nested-raw-html" />',
      '</div>',
      '',
    ].join('\n');
    const parsed = parseMarkdownSource(source('test.md', markdown));
    expect(parsed.source).toBeDefined();
    if (parsed.source === undefined) return;
    const diagnostics: Diagnostic[] = [];
    const body = parseDocumentBody(parsed.source, 'doc:test', diagnostics);

    expect(body.blocks.filter((block) => block.kind === 'interactive')).toHaveLength(1);
    const visual = body.blocks.find((block) => block.kind === 'visual');
    expect(visual?.kind === 'visual' ? visual.value.description : undefined).toBe('A & B');
    expect(body.blocks.filter((block) => block.kind === 'unsupported-directive')).toHaveLength(1);
    expect(diagnostics).toEqual([
      expect.objectContaining({ severity: 'warning', code: 'UNSUPPORTED_DIRECTIVE' }),
    ]);
    expect(body.blocks.map(blockMarkdown).join('')).toBe(markdown);
  });

  it('diagnoses malformed known directives without losing their source', () => {
    const markdown = [
      '<interactive />',
      '<interactive type="ok" type="duplicate" />',
      '<visual-needed type="bad Type" description="x" />',
      '<visual-needed type="cross-section" />',
    ].join('\n');
    const parsed = parseMarkdownSource(source('test.md', markdown));
    expect(parsed.source).toBeDefined();
    if (parsed.source === undefined) return;
    const diagnostics: Diagnostic[] = [];
    const body = parseDocumentBody(parsed.source, 'doc:test', diagnostics);

    expect(diagnostics.filter((item) => item.severity === 'error')).toHaveLength(4);
    expect(body.blocks.filter((block) => block.kind === 'unsupported-directive')).toHaveLength(4);
    expect(body.blocks.map(blockMarkdown).join('')).toBe(markdown);
  });

  it('preserves string versions and rejects duplicate YAML keys', () => {
    const valid = parseCurriculumSource(
      source(
        'curriculum.yaml',
        [
          "schema_version: '1.0'",
          'content_version: 2026.09.12',
          'language: ko',
          'title: test',
          'description: test',
          "last_updated: '2026-09-13'",
          'modules: []',
        ].join('\n'),
      ),
    );
    expect(valid.manifest?.schemaVersion).toBe('1.0');
    expect(valid.manifest?.contentVersion).toBe('2026.09.12');

    const duplicate = parseCurriculumSource(
      source(
        'curriculum.yaml',
        [
          "schema_version: '1.0'",
          "schema_version: '1.0'",
          'content_version: value',
          'language: ko',
          'title: test',
          'description: test',
          "last_updated: '2026-09-13'",
          'modules: []',
        ].join('\n'),
      ),
    );
    expect(duplicate.manifest).toBeUndefined();
    expect(duplicate.diagnostics.some((item) => item.code === 'YAML_DUPLICATE_KEY')).toBe(true);
  });

  it('preserves unknown frontmatter metadata and reports a warning', async () => {
    const copiedContent = await copyContent();
    const lessonPath = path.join(copiedContent, 'module-00-basics', 'lesson-01.md');
    const text = await fs.readFile(lessonPath, 'utf8');
    await fs.writeFile(
      lessonPath,
      text.replace('kind: lesson', 'kind: lesson\nfuture_metadata: kept'),
      'utf8',
    );

    const result = await parseContentDirectory(copiedContent);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.diagnostics).toEqual([
      expect.objectContaining({
        severity: 'warning',
        code: 'UNKNOWN_METADATA',
        path: 'module-00-basics/lesson-01.md',
      }),
    ]);
    const lesson = result.data.documentsById['m00-l01'] as Lesson;
    expect(lesson.extra).toEqual({ future_metadata: 'kept' });
  });

  it('rejects known metadata with the wrong type', async () => {
    const copiedContent = await copyContent();
    const lessonPath = path.join(copiedContent, 'module-00-basics', 'lesson-01.md');
    const text = await fs.readFile(lessonPath, 'utf8');
    await fs.writeFile(
      lessonPath,
      text.replace('estimated_minutes: 15', "estimated_minutes: '15'"),
      'utf8',
    );

    const result = await parseContentDirectory(copiedContent);
    expect(result.ok).toBe(false);
    expect(
      result.diagnostics.some(
        (item) =>
          item.code === 'INVALID_METADATA_TYPE' &&
          item.path === 'module-00-basics/lesson-01.md',
      ),
    ).toBe(true);
  });

  it('detects learning Markdown that is not in curriculum.yaml', async () => {
    const copiedContent = await copyContent();
    await fs.writeFile(
      path.join(copiedContent, 'module-00-basics', 'lesson-99.md'),
      [
        '---',
        'id: m00-l99',
        'module_id: m00',
        'lesson_number: 99',
        'title: unregistered',
        'estimated_minutes: 1',
        'content_origin: new',
        "last_updated: '2026-09-13'",
        'kind: lesson',
        '---',
        '# unregistered',
      ].join('\n'),
      'utf8',
    );

    const result = await parseContentDirectory(copiedContent);
    expect(result.ok).toBe(false);
    expect(
      result.diagnostics.some(
        (item) =>
          item.code === 'UNREGISTERED_LEARNING_MARKDOWN' &&
          item.path === 'module-00-basics/lesson-99.md',
      ),
    ).toBe(true);
  });
});
