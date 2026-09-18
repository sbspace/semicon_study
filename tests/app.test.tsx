// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';

import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { AppRoutes } from '../src/app/App.js';
import { BrowserContentTransport, contentBaseUrl } from '../src/app/content.js';
import { ContentProvider } from '../src/app/ContentContext.js';
import { ContentRenderer } from '../src/app/ContentRenderer.js';
import { ContentLoader, type ContentTransport } from '../src/content/load.js';
import { parseContentDirectory } from '../src/content/parse.js';
import type {
  ContentCatalog,
  ContentDocument,
  ContentIndex,
  ContentBlock,
  SourceSpan,
} from '../src/content/types.js';
import { createContentIndex } from '../src/content/write.js';
import { ProgressProvider } from '../src/progress/ProgressContext.js';
import { PROGRESS_STORAGE_KEY, type ProgressStorage } from '../src/progress/types.js';

let catalog: ContentCatalog;
let index: ContentIndex;

afterEach(cleanup);

class MemoryTransport implements ContentTransport {
  constructor(private readonly values: Map<string, unknown>) {}
  async loadJson(file: string): Promise<unknown> {
    if (!this.values.has(file)) throw new Error(`Missing ${file}`);
    return this.values.get(file);
  }
}

class MemoryProgressStorage implements ProgressStorage {
  readonly values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

beforeAll(async () => {
  const parsed = await parseContentDirectory('content');
  if (!parsed.ok) throw new Error(JSON.stringify(parsed.diagnostics));
  catalog = parsed.data;
  index = createContentIndex(catalog);
});

function loader(): ContentLoader {
  const values = new Map<string, unknown>([['index.json', structuredClone(index)]]);
  for (const id of index.documentIds) {
    values.set(index.documentsById[id]!.documentFile, structuredClone(catalog.documentsById[id]));
  }
  return new ContentLoader(new MemoryTransport(values));
}

function renderRoute(route: string, storage: ProgressStorage | null = null) {
  return render(
    <ContentProvider loader={loader()}>
      <ProgressProvider storage={storage} now={() => '2026-09-13T00:00:00.000Z'}>
        <MemoryRouter initialEntries={[route]}>
          <AppRoutes />
        </MemoryRouter>
      </ProgressProvider>
    </ContentProvider>,
  );
}

describe('browser content transport', () => {
  it('respects root and nested Vite base URLs', async () => {
    expect(contentBaseUrl('/')).toBe('/content/');
    expect(contentBaseUrl('/academy')).toBe('/academy/content/');
    const fetchJson = vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ modelVersion: '1' }),
    }) as Response);
    const transport = new BrowserContentTransport('/academy/', fetchJson);
    await expect(transport.loadJson('documents/m00.json')).resolves.toEqual({ modelVersion: '1' });
    expect(fetchJson).toHaveBeenCalledWith('/academy/content/documents/m00.json', {
      cache: 'no-cache',
      headers: { Accept: 'application/json' },
    });
  });

  it('rejects HTTP failures', async () => {
    const transport = new BrowserContentTransport('/', async () => ({
      ok: false,
      status: 404,
    }) as Response);
    await expect(transport.loadJson('missing.json')).rejects.toThrow('HTTP 404');
  });
});

describe('learning application routes', () => {
  it('shows a stable route loading state while a lazy page module opens', () => {
    renderRoute('/');
    expect(screen.getByText('페이지를 여는 중입니다.')).toBeInTheDocument();
  });

  it('renders Home statistics and module roadmap from the content index', async () => {
    renderRoute('/');
    expect(await screen.findByRole('heading', { name: /작은 소자에서/ })).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('53')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /첫 수업 시작하기/ })).toHaveAttribute('href', '/learn/m00-l01');
    expect(screen.getByRole('link', { name: /최신 트렌드/ })).toHaveAttribute('href', '/modules/m09');
  });

  it('shows all ten modules and their lessons in Curriculum', async () => {
    renderRoute('/curriculum');
    await screen.findByRole('heading', { name: index.curriculum.title });
    for (const id of index.moduleIds) {
      expect(screen.getByRole('heading', { name: index.documentsById[id]!.title })).toBeInTheDocument();
    }
    expect(document.querySelectorAll('.curriculum-module')).toHaveLength(10);
  });

  it('shows all seven Module 1 lessons with review and supplements', async () => {
    const view = renderRoute('/modules/m01');
    expect((await screen.findAllByRole('heading', { name: '트랜지스터와 CMOS' })).length).toBeGreaterThan(0);
    const panel = view.container.querySelector('.module-lessons');
    expect(panel).not.toBeNull();
    expect(panel!.querySelectorAll('.kind-mark.lesson')).toHaveLength(7);
    expect(panel!.querySelectorAll('.kind-mark.review')).toHaveLength(1);
    expect(panel!.querySelectorAll('.kind-mark.supplement')).toHaveLength(2);
    expect(screen.getAllByText('NMOS와 PMOS — 왜 트랜지스터가 두 종류나 필요할까?').length).toBeGreaterThan(0);
  });

  it('renders a real lesson with Markdown and visual declarations in source order', async () => {
    const view = renderRoute('/learn/m00-l01');
    expect(await screen.findByRole('heading', {
      name: '반도체·소자·웨이퍼·다이·칩 — 일단 이것부터 구분하자',
      level: 1,
    })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.queryByRole('heading', {
      name: '반도체·소자·웨이퍼·다이·칩 — 일단 이것부터 구분하자',
      level: 2,
    })).not.toBeInTheDocument();
    expect(screen.getByLabelText('현재 학습 상태: 미완료')).toHaveTextContent('미완료');
    expect(await screen.findByRole('region', { name: 'Wafer → Die → Transistor' })).toBeInTheDocument();
    expect(screen.getAllByText('Visual').length).toBeGreaterThan(0);
    expect(view.container.querySelector('table')).toBeInTheDocument();
    expect(view.container.querySelector('pre')).toBeInTheDocument();
    const visual = view.container.querySelector('.visual-interactive-guide');
    const interactive = view.container.querySelector('.interactive-diagram');
    expect(visual).not.toBeNull();
    expect(visual).toHaveTextContent('실제 트랜지스터는 대략 이런 구조다');
    expect(interactive).not.toBeNull();
    expect(visual!.compareDocumentPosition(interactive!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('shows a friendly error for an unknown document', async () => {
    renderRoute('/learn/not-a-document');
    expect(await screen.findByRole('alert')).toHaveTextContent('수업을 찾을 수 없습니다.');
    expect(screen.queryByText(/ContentLoadError/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Missing documents/)).not.toBeInTheDocument();
  });

  it('records a visit and lets a learner complete and uncomplete a lesson', async () => {
    const storage = new MemoryProgressStorage();
    renderRoute('/learn/m00-l01', storage);
    const completeButton = await screen.findByRole('button', { name: '학습 완료' });
    await waitFor(() => expect(JSON.parse(storage.values.get(PROGRESS_STORAGE_KEY)!).lastVisitedId).toBe('m00-l01'));
    fireEvent.click(completeButton);
    expect(await screen.findByText('학습 완료됨')).toBeInTheDocument();
    expect(screen.getByLabelText('현재 학습 상태: 완료')).toHaveTextContent('완료');
    expect(JSON.parse(storage.values.get(PROGRESS_STORAGE_KEY)!).completedById['m00-l01'].contentRevision)
      .toBe(index.documentsById['m00-l01']!.revision);
    fireEvent.click(screen.getByRole('button', { name: '완료 취소' }));
    expect(await screen.findByRole('button', { name: '학습 완료' })).toBeInTheDocument();
    expect(screen.getByLabelText('현재 학습 상태: 미완료')).toHaveTextContent('미완료');
    expect(JSON.parse(storage.values.get(PROGRESS_STORAGE_KEY)!).completedById['m00-l01']).toBeUndefined();
  });

  it('keeps manual Lesson completion independent from an incorrect Quiz result', async () => {
    const storage = new MemoryProgressStorage();
    const view = renderRoute('/learn/m00-l01', storage);
    const completeButton = await screen.findByRole('button', { name: '학습 완료' });
    const card = view.container.querySelector<HTMLElement>('.quiz-question-card');
    expect(card).not.toBeNull();
    fireEvent.click(within(card!).getByRole('radio', { name: /A\. Gate/ }));
    fireEvent.click(within(card!).getByRole('button', { name: '정답 확인' }));
    expect(within(card!).getByText(/정답은 B입니다/)).toBeInTheDocument();
    fireEvent.click(completeButton);
    expect(await screen.findByText('학습 완료됨')).toBeInTheDocument();
  });

  it('shows restored progress on Home and keeps the completed lesson accessible', async () => {
    const storage = new MemoryProgressStorage();
    storage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({
      version: 1,
      completedById: {
        'm00-l01': { completedAt: '2026-09-12T00:00:00.000Z', contentRevision: 'older-revision' },
      },
      lastVisitedId: 'm00-l01',
    }));
    const view = renderRoute('/', storage);
    expect(await screen.findByText('1 / 53')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /이어서 학습/ })).toHaveAttribute('href', '/learn/m00-l01');
    cleanup();
    renderRoute('/learn/m00-l01', storage);
    expect(await screen.findByText('학습 완료됨')).toBeInTheDocument();
    expect(screen.getByText('완료 후 내용이 업데이트됨')).toBeInTheDocument();
    expect(view.baseElement).toBeDefined();
  });

  it('shows completion state and module progress in Curriculum', async () => {
    const storage = new MemoryProgressStorage();
    storage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({
      version: 1,
      completedById: {
        'm01-l01': { completedAt: '2026-09-12T00:00:00.000Z', contentRevision: index.documentsById['m01-l01']!.revision },
        'm01-review': { completedAt: '2026-09-12T00:00:00.000Z', contentRevision: index.documentsById['m01-review']!.revision },
      },
    }));
    renderRoute('/curriculum', storage);
    await screen.findByRole('heading', { name: index.curriculum.title });
    expect(screen.getAllByText('1 / 7 완료 · 14%').length).toBeGreaterThan(0);
    expect(screen.getByLabelText('Lesson 완료')).toBeInTheDocument();
    expect(screen.getByLabelText('Review 완료')).toBeInTheDocument();
  });
});

describe('ContentRenderer', () => {
  it('keeps every ContentBlock in source order and renders safe fallbacks', () => {
    const span = (start: number, end: number): SourceSpan => ({
      path: 'fixture.md', start, end, startLine: 1, endLine: 1,
    });
    const blocks: ContentBlock[] = [
      { kind: 'markdown', content: { markdown: 'FIRST', source: span(0, 5) } },
      { kind: 'interactive', value: { instanceId: 'x:interactive:1', documentId: 'x', type: 'signal-path', attributes: { type: 'signal-path' }, original: { markdown: '<interactive />', source: span(5, 20) } } },
      { kind: 'markdown', content: { markdown: 'SECOND', source: span(20, 26) } },
      { kind: 'visual', value: { instanceId: 'x:visual:1', documentId: 'x', type: 'diagram', description: 'THIRD VISUAL', attributes: {}, original: { markdown: '<visual />', source: span(26, 36) } } },
      { kind: 'unsupported-directive', tagName: 'future-box', original: { markdown: '<future-box />', source: span(36, 50) } },
    ];
    const fixture: ContentDocument = {
      kind: 'supporting', id: 'x', title: 'Fixture', path: 'fixture.md', revision: 'revision',
      body: { markdown: '', blocks, quizzes: [], headings: [] },
    };
    const view = render(
      <MemoryRouter><ContentRenderer document={fixture} index={index} /></MemoryRouter>,
    );
    const text = view.container.textContent ?? '';
    expect(text.indexOf('FIRST')).toBeLessThan(text.indexOf('Signal Path'));
    expect(text.indexOf('Signal Path')).toBeLessThan(text.indexOf('SECOND'));
    expect(text.indexOf('SECOND')).toBeLessThan(text.indexOf('THIRD VISUAL'));
    expect(text.indexOf('THIRD VISUAL')).toBeLessThan(text.indexOf('<future-box />'));
  });

  it('rewrites known Markdown links to application routes', async () => {
    const document = catalog.documentsById.m00!;
    const view = render(<MemoryRouter><ContentRenderer document={document} index={index} /></MemoryRouter>);
    await waitFor(() => expect(view.container.querySelector('a[href="/learn/m00-l01"]')).toBeInTheDocument());
  });

  it('renders math while keeping raw HTML and unsafe links inert', () => {
    const source: SourceSpan = {
      path: 'safe-fixture.md', start: 0, end: 80, startLine: 1, endLine: 5,
    };
    const fixture: ContentDocument = {
      kind: 'supporting', id: 'safe-fixture', title: 'Safe fixture', path: source.path,
      revision: 'revision',
      body: {
        markdown: '', quizzes: [], headings: [],
        blocks: [{
          kind: 'markdown',
          content: {
            markdown: '[unsafe](javascript:alert(1))\n\n$E=mc^2$\n\n<img src=x onerror="alert(1)">',
            source,
          },
        }],
      },
    };
    const view = render(
      <MemoryRouter><ContentRenderer document={fixture} index={index} /></MemoryRouter>,
    );
    expect(screen.getByText('unsafe').closest('a')).toHaveAttribute('href', '');
    expect(view.container.querySelector('.katex')).toBeInTheDocument();
    expect(view.container.querySelector('img')).not.toBeInTheDocument();
    expect(view.container).toHaveTextContent('<img src=x onerror="alert(1)">');
  });
});
