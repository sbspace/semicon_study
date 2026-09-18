// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';

import { lazy } from 'react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { ContentRenderer } from '../src/app/ContentRenderer.js';
import { visualBindingKey, visualBindings, visualImageAssets } from '../src/app/visual/registry.js';
import { VisualSlot } from '../src/app/visual/VisualSlot.js';
import type { InteractiveTarget, VisualBindingRegistry } from '../src/app/visual/types.js';
import { parseContentDirectory } from '../src/content/parse.js';
import type { ContentCatalog, ContentIndex, VisualPlaceholder } from '../src/content/types.js';
import { createContentIndex } from '../src/content/write.js';

let catalog: ContentCatalog;
let index: ContentIndex;

afterEach(cleanup);

beforeAll(async () => {
  const parsed = await parseContentDirectory('content');
  if (!parsed.ok) throw new Error(JSON.stringify(parsed.diagnostics));
  catalog = parsed.data;
  index = createContentIndex(catalog);
});

function visualFrom(documentId: string, sourceId: string) {
  const document = catalog.documentsById[documentId]!;
  const block = document.body.blocks.find(
    item => item.kind === 'visual' && item.value.sourceId === sourceId,
  );
  if (block?.kind !== 'visual') throw new Error(`Missing ${documentId}:${sourceId}`);
  return { declaration: block.value, revision: document.revision };
}

function visualByInstance(documentId: string, instanceId: string) {
  const document = catalog.documentsById[documentId]!;
  const block = document.body.blocks.find(
    item => item.kind === 'visual' && item.value.instanceId === instanceId,
  );
  if (block?.kind !== 'visual') throw new Error(`Missing ${instanceId}`);
  return { declaration: block.value, revision: document.revision };
}

function fixtureVisual(overrides: Partial<VisualPlaceholder> = {}): VisualPlaceholder {
  return {
    instanceId: 'fixture:visual:1',
    documentId: 'fixture',
    sourceId: 'visual-fixture',
    type: 'reference-structure',
    description: '원래 Visual 설명',
    attributes: {},
    original: {
      markdown: '<visual-needed />',
      source: { path: 'fixture.md', start: 0, end: 1, startLine: 1, endLine: 1 },
    },
    ...overrides,
  };
}

const noTargets = new Map<string, InteractiveTarget>();

describe('Visual Pilot registry safety', () => {
  it('registers all 58 reviewed slots and shares the SRAM asset', () => {
    expect(visualBindings.size).toBe(58);
    const main = visualBindings.get(JSON.stringify(['source', 'm01-l07', 'visual-019']));
    const supplement = visualBindings.get(JSON.stringify(['source', 'm01-s-sram', 'visual-043']));
    expect(main?.handling).toMatchObject({ kind: 'static-svg', assetId: 'sram-six-transistors' });
    expect(supplement?.handling).toMatchObject({ kind: 'static-svg', assetId: 'sram-six-transistors' });
  });

  it('uses scoped source and source-less instance keys without prototype lookup', () => {
    expect(visualBindingKey(fixtureVisual({ documentId: 'a', sourceId: 'same' })))
      .not.toBe(visualBindingKey(fixtureVisual({ documentId: 'b', sourceId: 'same' })));
    const { sourceId: _sourceId, ...sourceLess } = fixtureVisual();
    expect(visualBindingKey(sourceLess))
      .toBe(JSON.stringify(['instance', 'fixture', 'fixture:visual:1']));
    render(
      <VisualSlot
        declaration={fixtureVisual({ sourceId: 'toString' })}
        documentRevision="r1"
        interactiveTargets={noTargets}
      />,
    );
    expect(screen.getByText('원래 Visual 설명')).toBeInTheDocument();
  });

  it('falls back when revision or reviewed metadata no longer matches', () => {
    const item = visualFrom('m01-l06', 'visual-017');
    const view = render(
      <VisualSlot
        declaration={item.declaration}
        documentRevision="changed-revision"
        interactiveTargets={noTargets}
      />,
    );
    expect(screen.getByText(item.declaration.description)).toBeInTheDocument();
    expect(view.container.querySelector('.visual-asset')).toBeNull();

    const changed = { ...item.declaration, description: '개정된 설명' };
    view.rerender(
      <VisualSlot declaration={changed} documentRevision={item.revision} interactiveTargets={noTargets} />,
    );
    expect(screen.getByText('개정된 설명')).toBeInTheDocument();
    expect(view.container.querySelector('.visual-asset')).toBeNull();
  });

  it('falls back when an Interactive target is absent or has the wrong type', () => {
    const item = visualFrom('m00-l02', 'visual-005');
    const wrongTargets = new Map<string, InteractiveTarget>([[
      'm00-l02:interactive:1',
      { instanceId: 'm00-l02:interactive:1', type: 'wrong-type', anchorId: 'safe-target' },
    ]]);
    render(
      <VisualSlot
        declaration={item.declaration}
        documentRevision={item.revision}
        interactiveTargets={wrongTargets}
      />,
    );
    expect(screen.getByText(item.declaration.description)).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: '연결된 도식으로 이동' })).not.toBeInTheDocument();
  });

  it('contains a static asset render failure inside its Visual slot', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const declaration = fixtureVisual();
    const key = visualBindingKey(declaration);
    const bindings: VisualBindingRegistry = new Map([[
      key,
      {
        documentId: declaration.documentId,
        instanceId: declaration.instanceId,
        sourceId: 'visual-fixture',
        documentRevision: 'r1',
        expectedType: declaration.type,
        expectedDescription: declaration.description,
        handling: { kind: 'static-svg', assetId: 'broken', title: 'broken', caption: 'broken' },
        rationale: 'test',
      },
    ]]);
    const Broken = lazy(async () => ({ default: () => { throw new Error('asset failure'); } }));
    render(
      <VisualSlot
        declaration={declaration}
        documentRevision="r1"
        interactiveTargets={noTargets}
        bindingRegistry={bindings}
        assetRegistry={new Map([['broken', Broken]])}
      />,
    );
    expect(await screen.findByRole('alert')).toHaveTextContent('원래 Visual 설명');
    expect(screen.getByRole('alert')).toHaveTextContent('시각 자료를 표시하지 못했습니다');
    log.mockRestore();
  });
});

describe('Pilot static assets', () => {
  it('shows D, CLK and Q on one time axis with rising-edge sampling and Q hold', async () => {
    const item = visualFrom('m01-l06', 'visual-017');
    const view = render(
      <VisualSlot declaration={item.declaration} documentRevision={item.revision} interactiveTargets={noTargets} />,
    );
    const graphic = await screen.findByRole('img', { name: /D Flip-Flop의 D, Clock, Q timing diagram/ });
    expect(within(graphic).getByText('D')).toBeInTheDocument();
    expect(within(graphic).getByText('CLK')).toBeInTheDocument();
    expect(within(graphic).getByText('Q')).toBeInTheDocument();
    expect(within(graphic).getAllByText(/상승 edge:/)).toHaveLength(2);
    expect(within(graphic).getByText('D가 바뀌어도 Q=1 유지')).toBeInTheDocument();
    expect(view.container).toHaveTextContent('다음 상승 edge 전까지 그 값을 유지');
    expect(view.container).toHaveTextContent('setup time, hold time을 수치로 나타내지 않습니다');
  });

  it.each([
    ['m01-l07', 'visual-019'],
    ['m01-s-sram', 'visual-043'],
  ])('renders the shared six-transistor schematic at %s', async (documentId, sourceId) => {
    const item = visualFrom(documentId, sourceId);
    const view = render(
      <VisualSlot declaration={item.declaration} documentRevision={item.revision} interactiveTargets={noTargets} />,
    );
    const graphic = await screen.findByRole('img', { name: /여섯 transistor로 구성된 6T SRAM cell 회로/ });
    expect(graphic.querySelectorAll('[data-mos-transistor]')).toHaveLength(6);
    for (const label of ['P1', 'P2', 'N1', 'N2', 'Access L', 'Access R', 'Q', 'Q̅ (Q bar)', 'WL (Word Line)', 'BL', 'BLB']) {
      expect(within(graphic).getByText(label)).toBeInTheDocument();
    }
    expect(within(graphic).getByText('교차 feedback')).toBeInTheDocument();
    expect(view.container).toHaveTextContent('회로 개념도');
  });
});

describe('Module 0-3 Visual completion batch', () => {
  it('records the reviewed handling for all ten external reference-image slots', () => {
    const expected = [
      ['m00-l01','visual-002','image'],['m03-l01','visual-025','image'],
      ['m00-l04','visual-009','link-only'],['m02-l06','visual-024','link-only'],['m03-l02','visual-030','link-only'],
      ['m02-l01','visual-020','pending'],['m02-l02','visual-021','pending'],['m02-s-floorplan','visual-046','pending'],
      ['m02-l03','visual-022','pending'],['m02-s-feol-beol','visual-045','pending'],
    ];
    for (const [documentId, sourceId, kind] of expected) {
      const item = visualFrom(documentId!, sourceId!);
      expect(visualBindings.get(visualBindingKey(item.declaration))?.handling.kind).toBe(kind);
    }
  });

  it('records 21 Interactive resolutions, 25 B slots, one D illustration, and one omit', () => {
    const kinds = [...visualBindings.values()].map(item => item.handling.kind);
    expect(kinds.filter(kind => kind === 'resolvedByInteractive')).toHaveLength(21);
    expect(kinds.filter(kind => kind === 'static-svg')).toHaveLength(25);
    expect(kinds.filter(kind => kind === 'illustration')).toHaveLength(1);
    expect(kinds.filter(kind => kind === 'omit')).toHaveLength(1);
    expect(kinds.filter(kind => kind === 'image')).toHaveLength(2);
    expect(kinds.filter(kind => kind === 'link-only')).toHaveLength(3);
    expect(kinds.filter(kind => kind === 'pending')).toHaveLength(5);
  });

  it('shares one approved local wafer asset while keeping slot-specific captions', () => {
    const basics = visualBindings.get(JSON.stringify(['source','m00-l01','visual-002']));
    const process = visualBindings.get(JSON.stringify(['source','m03-l01','visual-025']));
    expect(basics?.handling).toMatchObject({ kind: 'image', assetId: 'patterned-silicon-wafer' });
    expect(process?.handling).toMatchObject({ kind: 'image', assetId: 'patterned-silicon-wafer' });
    expect(basics?.handling).not.toEqual(process?.handling);
    const asset = visualImageAssets.get('patterned-silicon-wafer');
    expect(asset?.src).not.toMatch(/^https?:/);
    expect(asset).toMatchObject({
      rightsStatus: 'approved',
      width: 1732,
      height: 1750,
      byteSize: 1012206,
      sha256: '384d68bbd3e0e8acecd21d5b92f9a465633e4ec6fc9f3824455e3ad10e39224d',
    });
  });

  it.each([
    ['m00-l01','visual-002','실제 patterned silicon wafer'],
    ['m03-l01','visual-025','공정의 출발점인 Wafer'],
  ])('renders the approved wafer image for %s with source metadata', (documentId, sourceId, caption) => {
    const item = visualFrom(documentId, sourceId);
    const view = render(<VisualSlot declaration={item.declaration} documentRevision={item.revision} interactiveTargets={noTargets} />);
    const image = screen.getByRole('img', { name: /원형 실리콘 웨이퍼/ });
    expect(image).toHaveAttribute('src', expect.not.stringMatching(/^https?:/));
    expect(image).toHaveAttribute('width', '1732');
    expect(image).toHaveAttribute('height', '1750');
    expect(image).toHaveAttribute('loading', 'lazy');
    expect(image).toHaveAttribute('decoding', 'async');
    expect(view.container).toHaveTextContent(caption);
    expect(screen.getByRole('link', { name: 'Wikimedia Commons' })).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it.each([
    ['m00-l04','visual-009',/Samsung Newsroom 공식 자료에서 보기/,'https://news.samsung.com/'],
    ['m02-l06','visual-024',/AMD Threadripper PRO white paper 공식 자료에서 보기/,'https://www.amd.com/'],
    ['m03-l02','visual-030',/ASML TWINSCAN NXE:3600D 공식 자료에서 보기/,'https://www.asml.com/'],
  ])('renders %s %s as a safe official link without an image', (documentId, sourceId, accessibleName, prefix) => {
    const item = visualFrom(documentId, sourceId);
    const view = render(<VisualSlot declaration={item.declaration} documentRevision={item.revision} interactiveTargets={noTargets} />);
    const link = screen.getByRole('link', { name: accessibleName });
    expect(link).toHaveAttribute('href', expect.stringMatching(`^${prefix}`));
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(view.container.querySelector('img')).toBeNull();
  });

  it.each([
    ['m02-l01','visual-020'],['m02-l02','visual-021'],['m02-s-floorplan','visual-046'],
    ['m02-l03','visual-022'],['m02-s-feol-beol','visual-045'],
  ])('renders %s %s as an explicit pending reference without an image', (documentId, sourceId) => {
    const item = visualFrom(documentId, sourceId);
    const view = render(<VisualSlot declaration={item.declaration} documentRevision={item.revision} interactiveTargets={noTargets} />);
    expect(screen.getByText(item.declaration.description)).toBeInTheDocument();
    expect(screen.getByText('검토된 참고 이미지를 준비 중입니다.')).toBeInTheDocument();
    expect(view.container.querySelector('.visual-reference-pending')).not.toBeNull();
    expect(view.container.querySelector('img')).toBeNull();
  });

  it('points every resolved binding at an existing Interactive instance with the reviewed type', () => {
    for (const item of visualBindings.values()) {
      const handling = item.handling;
      if (handling.kind !== 'resolvedByInteractive') continue;
      const document = catalog.documentsById[item.documentId]!;
      const target = document.body.blocks.find(block => block.kind === 'interactive'
        && block.value.instanceId === handling.targetInstanceId);
      expect(target?.kind, item.instanceId).toBe('interactive');
      if (target?.kind === 'interactive') expect(target.value.type, item.instanceId).toBe(handling.targetType);
    }
  });

  it.each([
    ['m00-l01','visual-004','Die에서 PCB까지의 패키지 개념 구조',['Die · 얇은 silicon 조각','Package substrate · 연결과 보호','PCB 방향']],
    ['m00-l04','visual-008','FinFET의 3면 Gate 개념도',['회색 Fin = Channel','Gate: 위 + 양옆 3면']],
    ['m01-l01','visual-010','CMOS inverter의 연결과 물리 단면',['PMOS','NMOS','VDD','OUT','GND','Gate / Input']],
    ['m01-l03','visual-012','CMOS NAND transistor topology',['PMOS 병렬','NMOS 직렬']],
    ['m01-l03','visual-013','CMOS NOR transistor topology',['PMOS 직렬','NMOS 병렬']],
    ['m01-l05','visual-015','1-bit Full Adder와 4-bit carry chain',['FA0','FA1','FA2','FA3','Cout0 → Cin1']],
    ['m01-l06','visual-018','8-bit Register · 10110100',['D7=1','D0=0','공통 CLK']],
    ['m01-s-sram','visual-044','SRAM cell array의 행과 열',['WL1','BL1 / BLB1','6T cell']],
    ['m03-l01','visual-026','Deposition 전과 후',['Before','After · Deposition','Thin Film']],
    ['m03-l01','visual-027','Photo의 Mask–PR–Film 관계',['Mask','PR','Film','Wafer / 하부 구조']],
    ['m03-l01','visual-028','PR 보호와 Film 식각',['Etch 전','Etch 후','열린 영역']],
    ['m03-l02','visual-031','Scanner 노광 기능 경로',['Light source','Reticle / Mask','Optical system','PR','Film','Wafer']],
    ['m03-l04','visual-033','서로 다른 역할의 여러 Film',['Conductive film / 전기 연결','Dielectric / 절연','Barrier class / 확산 억제 예']],
    ['m03-l08','visual-039','Thermal Oxidation과 Deposition',['기존 Si가 반응','외부 precursor / source','추가된 Film']],
    ['m03-l09','visual-041','Particle이 배선에 줄 수 있는 영향의 예',['정상 배선','Open 가능 사례','Bridge / Short 가능 사례']],
  ])('renders the reviewed relationships for %s %s', async (documentId, sourceId, title, labels) => {
    const item = visualFrom(documentId as string, sourceId as string);
    const view = render(<VisualSlot declaration={item.declaration} documentRevision={item.revision} interactiveTargets={noTargets} />);
    expect((await screen.findAllByText(title as string)).length).toBeGreaterThan(0);
    for (const label of labels as string[]) expect(view.container).toHaveTextContent(label);
  });

  it.each([
    ['m00-l03:visual:1','전원–스위치–저항–커패시터 폐회로',['Voltage source','Switch','Resistor R','Capacitor C','return path']],
    ['m00-l03:visual:2','MOS의 용량성 구조',['Gate','Oxide · 절연층','Semiconductor','Electric field']],
  ])('supports source-less reviewed keys for %s', async (instanceId, title, labels) => {
    const item = visualByInstance('m00-l03', instanceId as string);
    const view = render(<VisualSlot declaration={item.declaration} documentRevision={item.revision} interactiveTargets={noTargets} />);
    expect(await screen.findByText(title as string)).toBeInTheDocument();
    for (const label of labels as string[]) expect(view.container).toHaveTextContent(label);
  });

  it('shares the CMOS physical asset and the process family while keeping per-slot captions', () => {
    const cmos1 = visualBindings.get(JSON.stringify(['source','m01-l01','visual-010']));
    const cmos2 = visualBindings.get(JSON.stringify(['source','m01-l02','visual-011']));
    expect(cmos1?.handling).toMatchObject({kind:'static-svg',assetId:'cmos-physical'});
    expect(cmos2?.handling).toMatchObject({kind:'static-svg',assetId:'cmos-physical'});
    expect(cmos1?.handling).not.toEqual(cmos2?.handling);
  });
});

describe('Pilot integration in real lessons', () => {
  it('links visual-005 to a safe anchor without resetting Interactive state', async () => {
    const document = catalog.documentsById['m00-l02']!;
    const view = render(
      <MemoryRouter><ContentRenderer document={document} index={index} /></MemoryRouter>,
    );
    const high = await screen.findByRole('button', { name: '높은 전압' });
    fireEvent.click(high);
    expect(high).toHaveAttribute('aria-pressed', 'true');
    const link = screen.getByRole('link', { name: '연결된 도식으로 이동' });
    expect(link).toHaveAttribute('href', expect.stringMatching(/^#interactive-slot-\d+$/));
    fireEvent.click(link);
    const anchor = view.container.querySelector<HTMLElement>(link.getAttribute('href')!);
    expect(anchor).toHaveFocus();
    expect(high).toHaveAttribute('aria-pressed', 'true');
  });

  it('connects the two reviewed m00-l04 guides, renders FinFET, and links the official C reference', async () => {
    const document = catalog.documentsById['m00-l04']!;
    const view = render(
      <MemoryRouter><ContentRenderer document={document} index={index} /></MemoryRouter>,
    );
    expect(screen.getAllByRole('link', { name: '연결된 도식으로 이동' })).toHaveLength(2);
    await screen.findByRole('heading', { name: 'MOSFET Channel' });
    await screen.findByText('FinFET의 3면 Gate 개념도');
    expect(view.container.querySelectorAll('.visual-placeholder')).toHaveLength(0);
    expect(screen.getByRole('link', { name: /Samsung Newsroom 공식 자료에서 보기/ })).toBeInTheDocument();
  });

  it('omits visual-040 and renders visual-041 as the D comparison graphic', async () => {
    const document = catalog.documentsById['m03-l09']!;
    const view = render(
      <MemoryRouter><ContentRenderer document={document} index={index} /></MemoryRouter>,
    );
    expect(view.container.querySelectorAll('.visual-placeholder')).toHaveLength(0);
    expect(screen.queryByText('반도체 공정: Clean — 왜 웨이퍼를 공정 중간중간 계속 씻을까? — 원수업 이미지 위치와 주변 설명을 함께 참고')).not.toBeInTheDocument();
    expect(await screen.findByText('Particle이 배선에 줄 수 있는 영향의 예')).toBeInTheDocument();
  });

  it.each([
    ['m01-l06', 'D Flip-Flop timing diagram'],
    ['m01-l07', '6T SRAM cell schematic'],
    ['m01-s-sram', '6T SRAM cell schematic'],
  ])('renders the reviewed asset in source order for %s', async (documentId, title) => {
    const document = catalog.documentsById[documentId]!;
    const view = render(
      <MemoryRouter><ContentRenderer document={document} index={index} /></MemoryRouter>,
    );
    await screen.findByText(title);
    await waitFor(() => expect(view.container.querySelector('.visual-asset')).not.toBeNull());
    const visual = view.container.querySelector('.visual-asset')!;
    const blocks = [...view.container.querySelector('.lesson-content')!.children];
    expect(blocks.indexOf(visual)).toBeGreaterThan(0);
  });
});
