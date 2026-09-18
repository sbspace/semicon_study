// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import { ContentRenderer } from '../src/app/ContentRenderer.js';
import { VisualSlot } from '../src/app/visual/VisualSlot.js';
import { visualBindingKey, visualBindings } from '../src/app/visual/registry.js';
import type { InteractiveTarget } from '../src/app/visual/types.js';
import { parseContentDirectory } from '../src/content/parse.js';
import type { ContentCatalog, ContentIndex } from '../src/content/types.js';
import { createContentIndex } from '../src/content/write.js';

let catalog: ContentCatalog;
let index: ContentIndex;
const noTargets = new Map<string, InteractiveTarget>();

afterEach(cleanup);

beforeAll(async () => {
  const parsed = await parseContentDirectory('content');
  if (!parsed.ok) throw new Error(JSON.stringify(parsed.diagnostics));
  catalog = parsed.data;
  index = createContentIndex(catalog);
});

function visual(documentId: string) {
  const document = catalog.documentsById[documentId]!;
  const block = document.body.blocks.find(item => item.kind === 'visual');
  if (block?.kind !== 'visual') throw new Error(`Missing visual in ${documentId}`);
  return { declaration: block.value, revision: document.revision };
}

describe('Module 4-9 static Visual assets', () => {
  it('compares SRAM, 1T1C DRAM, and NAND while stating the scale boundary', async () => {
    const item = visual('m04-l05');
    const view = render(<VisualSlot {...item} documentRevision={item.revision} interactiveTargets={noTargets} />);
    const group = await screen.findByRole('group', { name: 'SRAM, DRAM, NAND 저장 구조 비교' });
    for (const label of ['SRAM · 6T', 'DRAM · 대표 1T1C', 'NAND · 전하 저장 영역', '교차 연결 inverter', 'Access T', 'Capacitor', 'Word Line / Gate', 'Channel · cell들이 연속 연결']) {
      expect(within(group).getAllByText(label).length).toBeGreaterThan(0);
    }
    expect(group.querySelectorAll('[data-memory-transistor]')).toHaveLength(6);
    expect(view.container).toHaveTextContent('서로 다른 축척');
    expect(view.container).toHaveTextContent('셀 하나가 메모리 제품 전체');
  });

  it('shows Planar, FinFET, and GAA with oxide, current direction, and control surfaces', async () => {
    const item = visual('m05-l02');
    render(<VisualSlot {...item} documentRevision={item.revision} interactiveTargets={noTargets} />);
    const group = await screen.findByRole('group', { name: 'Planar MOSFET, FinFET, nanosheet GAA 비교' });
    for (const label of ['Planar MOSFET', 'FinFET', 'Nanosheet GAA', 'Gate oxide', 'Source', 'Drain', '주로 위쪽 제어', 'Gate · 위 + 양옆', 'Gate가 각 sheet 둘레 제어']) {
      expect(within(group).getAllByText(label).length).toBeGreaterThan(0);
    }
    expect(group).toHaveTextContent('package die 적층이 아닙니다');
  });

  it('separates reflective EUV optics from PR development and Film etch', async () => {
    const item = visual('m05-l03');
    render(<VisualSlot {...item} documentRevision={item.revision} interactiveTargets={noTargets} />);
    const group = await screen.findByRole('group', { name: 'EUV 반사 광학과 PR 현상 및 식각 패턴 전달' });
    for (const label of ['A · EUV optical path', 'Reflective mask', 'Reflective optics', 'PR', 'Film', 'Wafer', 'B · Pattern transfer', '2 · Develop', '3 · Etch']) {
      expect(within(group).getAllByText(label).length).toBeGreaterThan(0);
    }
    expect(group).toHaveTextContent('빛은 PR에 기록하고, Etch가 아래 Film을 가공');
  });

  it('distinguishes frontside signal wiring and separate backside VDD/GND paths', async () => {
    const item = visual('m05-l04');
    render(<VisualSlot {...item} documentRevision={item.revision} interactiveTargets={noTargets} />);
    const group = await screen.findByRole('group', { name: '전면 전력 공급과 후면 전력 공급 비교' });
    for (const label of ['Conventional / frontside', 'Backside power', 'Signal', 'VDD', 'GND', 'Device layer', 'Backside connection']) {
      expect(within(group).getAllByText(label).length).toBeGreaterThan(0);
    }
  });

  it('compares the same target through optical, PR, and etch stages with caveats', async () => {
    const item = visual('m09-l02');
    const view = render(<VisualSlot {...item} documentRevision={item.revision} interactiveTargets={noTargets} />);
    const group = await screen.findByRole('group', { name: 'Conventional EUV와 High-NA EUV의 패턴 형성 정성 비교' });
    for (const label of ['Conventional EUV', 'High-NA EUV', '같은 EUV wavelength 계열 · NA 차이', '1 · Optical tendency', '2 · PR develop', '3 · Etch result']) {
      expect(within(group).getAllByText(label).length).toBeGreaterThan(0);
    }
    expect(view.container).toHaveTextContent('High-NA는 더 짧은 파장을 뜻하지 않습니다');
    expect(view.container).toHaveTextContent('process window');
    expect(view.container).toHaveTextContent('결과를 보증하지 않습니다');
  });
});

describe('Module 6-7 Interactive resolutions', () => {
  it.each([
    ['m06-l01', 'pad-bump-package-pcb', 'Flip Chip의 Die·Bump·Package·PCB 연결은 아래 패키지 단면 도식에서 확인할 수 있습니다.'],
    ['m06-l02', 'chiplet-package', '2.5D와 3D의 배치 차이는 아래 Chiplet 도식에서 비교할 수 있습니다.'],
    ['m06-l03', 'tsv-bonding', 'TSV와 Die 접합부의 위치는 아래 수직 연결 도식에서 확인할 수 있습니다.'],
    ['m07-l02', 'hbm-stack', 'DRAM Stack·TSV·Base Die·GPU 연결은 아래 HBM 단면 도식에서 확인할 수 있습니다.'],
  ])('links %s to its existing %s anchor', async (documentId, expectedType, guidance) => {
    const document = catalog.documentsById[documentId]!;
    const target = document.body.blocks.find(block => block.kind === 'interactive');
    expect(target?.kind).toBe('interactive');
    if (target?.kind === 'interactive') expect(target.value.type).toBe(expectedType);
    const view = render(<MemoryRouter><ContentRenderer document={document} index={index} /></MemoryRouter>);
    expect(await screen.findByText(guidance)).toBeInTheDocument();
    const link = screen.getByRole('link', { name: '연결된 도식으로 이동' });
    const anchor = view.container.querySelector<HTMLElement>(link.getAttribute('href')!);
    expect(anchor).not.toBeNull();
    expect(anchor).toHaveAttribute('tabindex', '-1');
  });

  it('keeps the fallback when a reviewed source-less binding revision is stale', () => {
    const item = visual('m06-l01');
    const view = render(<VisualSlot {...item} documentRevision="stale" interactiveTargets={noTargets} />);
    expect(view.container.querySelector('.visual-placeholder')).not.toBeNull();
    expect(screen.queryByRole('link', { name: '연결된 도식으로 이동' })).not.toBeInTheDocument();
  });
});

describe('Visual completion inventory', () => {
  const referenceOnly: Array<[string, string]> = [
    ['m00-l01','visual-002'],['m00-l04','visual-009'],['m02-l01','visual-020'],
    ['m02-l02','visual-021'],['m02-l03','visual-022'],['m02-l06','visual-024'],
    ['m03-l01','visual-025'],['m03-l02','visual-030'],['m02-s-feol-beol','visual-045'],
    ['m02-s-floorplan','visual-046'],
  ];

  it('has explicit handling for all 58 Visual slots', () => {
    const allVisuals = Object.values(catalog.documentsById).flatMap(document =>
      document.body.blocks.flatMap(block => block.kind === 'visual' ? [block.value] : []),
    );
    expect(allVisuals).toHaveLength(58);
    expect(visualBindings.size).toBe(58);
    const unbound = allVisuals.filter(item => !visualBindings.has(visualBindingKey(item)));
    expect(unbound).toHaveLength(0);
    for (const declaration of allVisuals) {
      const document = catalog.documentsById[declaration.documentId]!;
      const binding = visualBindings.get(visualBindingKey(declaration));
      expect(binding, declaration.instanceId).toMatchObject({
        documentId: declaration.documentId,
        instanceId: declaration.instanceId,
        documentRevision: document.revision,
        expectedType: declaration.type,
        expectedDescription: declaration.description,
      });
      expect(binding?.sourceId, declaration.instanceId).toBe(declaration.sourceId);
    }
    for (const [documentId, sourceId] of referenceOnly) {
      const document = catalog.documentsById[documentId]!;
      const block = document.body.blocks.find(item => item.kind === 'visual' && item.value.sourceId === sourceId);
      expect(block?.kind).toBe('visual');
      if (block?.kind === 'visual') expect(visualBindings.has(visualBindingKey(block.value))).toBe(true);
    }
  });

  it('renders all nine new slots without a generic fallback', async () => {
    const ids = ['m04-l05','m05-l02','m05-l03','m05-l04','m06-l01','m06-l02','m06-l03','m07-l02','m09-l02'];
    for (const documentId of ids) {
      const document = catalog.documentsById[documentId]!;
      const view = render(<MemoryRouter><ContentRenderer document={document} index={index} /></MemoryRouter>);
      await waitFor(() => expect(view.container.querySelector('.visual-placeholder')).toBeNull());
      cleanup();
    }
  });
});
