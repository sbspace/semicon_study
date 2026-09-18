// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';

import { lazy } from 'react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { AppRoutes } from '../src/app/App.js';
import { ContentProvider } from '../src/app/ContentContext.js';
import { ContentRenderer } from '../src/app/ContentRenderer.js';
import { InteractiveSlot } from '../src/app/interactive/InteractiveSlot.js';
import { interactiveRegistry, registeredInteractive } from '../src/app/interactive/registry.js';
import type { InteractiveRegistry } from '../src/app/interactive/types.js';
import { ContentLoader, type ContentTransport } from '../src/content/load.js';
import { parseContentDirectory } from '../src/content/parse.js';
import type { ContentCatalog, ContentIndex, InteractiveDeclaration } from '../src/content/types.js';
import { createContentIndex } from '../src/content/write.js';
import { ProgressProvider } from '../src/progress/ProgressContext.js';
import { PROGRESS_STORAGE_KEY, type ProgressStorage } from '../src/progress/types.js';

let catalog: ContentCatalog;
let index: ContentIndex;

afterEach(cleanup);

beforeAll(async () => {
  const parsed = await parseContentDirectory('content');
  if (!parsed.ok) throw new Error(JSON.stringify(parsed.diagnostics));
  catalog = parsed.data;
  index = createContentIndex(catalog);
});

function declaration(instanceId = 'fixture:interactive:1', type = 'cmos-inverter'): InteractiveDeclaration {
  return {
    instanceId,
    documentId: 'fixture',
    type,
    attributes: { type },
    original: {
      markdown: `<interactive type="${type}" />`,
      source: { path: 'fixture.md', start: 0, end: 1, startLine: 1, endLine: 1 },
    },
  };
}

function renderSlot(instanceId = 'fixture:interactive:1', revision = 'r1') {
  return render(<InteractiveSlot declaration={declaration(instanceId)} documentRevision={revision} />);
}

function inverter(container: HTMLElement, position = 0) {
  const diagrams = container.querySelectorAll<HTMLElement>('.interactive-diagram');
  const diagram = diagrams[position];
  if (diagram === undefined) throw new Error(`Missing diagram ${position}`);
  return within(diagram);
}

describe('Interactive registry and slot', () => {
  it('registers all thirteen Module 0–1 interactive types', () => {
    expect(registeredInteractive(interactiveRegistry, 'cmos-inverter')).toBeDefined();
    expect(registeredInteractive(interactiveRegistry, 'wafer-die-transistor')).toBeDefined();
    expect(registeredInteractive(interactiveRegistry, 'voltage-current')).toBeDefined();
    expect(registeredInteractive(interactiveRegistry, 'mosfet-channel')).toBeDefined();
    expect(registeredInteractive(interactiveRegistry, 'nmos-pmos-channel')).toBeDefined();
    for (const type of ['rc-coupling', 'mos-capacitor', 'np-doping', 'nand-nor', 'half-adder', 'full-adder', 'flipflop-register', 'sram-cell']) {
      expect(registeredInteractive(interactiveRegistry, type)).toBeDefined();
    }
  });

  it.each(['unknown-type', 'toString', 'constructor'])('uses the safe fallback for %s', type => {
    render(<InteractiveSlot declaration={declaration('x', type)} documentRevision="r1" />);
    expect(screen.getByText('인터랙티브 도식은 준비 중입니다.')).toBeInTheDocument();
  });

  it('shows a bounded loading fallback', () => {
    const Pending = lazy(() => new Promise<never>(() => undefined));
    const registry: InteractiveRegistry = Object.freeze({ pending: Pending });
    render(<InteractiveSlot declaration={declaration('x', 'pending')} documentRevision="r1" registry={registry} />);
    expect(screen.getByText('인터랙티브 도식을 불러오고 있습니다.').closest('aside')).toHaveAttribute('aria-busy', 'true');
  });

  it('contains a render failure inside one slot', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const Broken = lazy(async () => ({ default: () => { throw new Error('test failure'); } }));
    const registry: InteractiveRegistry = Object.freeze({ broken: Broken });
    render(
      <div>
        <InteractiveSlot declaration={declaration('x', 'broken')} documentRevision="r1" registry={registry} />
        <p>수업의 다음 내용</p>
      </div>,
    );
    expect(await screen.findByRole('alert')).toHaveTextContent('인터랙티브 도식을 표시하지 못했습니다.');
    expect(screen.getByText('수업의 다음 내용')).toBeInTheDocument();
    log.mockRestore();
  });
});

describe('CMOS inverter', () => {
  it('starts at input 0 and shows the pull-up result and selected truth-table row', async () => {
    const view = renderSlot();
    await screen.findByRole('heading', { name: 'CMOS Inverter' });
    const diagram = inverter(view.container);
    await waitFor(() => expect(diagram.getByRole('button', { name: '0' })).toHaveAttribute('aria-pressed', 'true'));
    expect(diagram.getByText('PMOS').closest('g')).toHaveClass('on');
    expect(diagram.getByText('NMOS').closest('g')).toHaveClass('off');
    expect(diagram.getByText('1 · HIGH')).toBeInTheDocument();
    expect(diagram.getByText('VDD → PMOS → Y')).toBeInTheDocument();
    const rows = diagram.getAllByRole('row');
    expect(rows[1]).toHaveAttribute('aria-current', 'true');
    expect(rows[1]).toHaveTextContent('01');
    expect(rows[2]).toHaveTextContent('10');
  });

  it('switches to input 1 and reset returns to input 0', async () => {
    const view = renderSlot();
    await screen.findByRole('heading', { name: 'CMOS Inverter' });
    const diagram = inverter(view.container);
    fireEvent.click(diagram.getByRole('button', { name: '1' }));
    expect(diagram.getByText('PMOS').closest('g')).toHaveClass('off');
    expect(diagram.getByText('NMOS').closest('g')).toHaveClass('on');
    expect(diagram.getByText('0 · LOW')).toBeInTheDocument();
    expect(diagram.getByText('Y → NMOS → GND')).toBeInTheDocument();
    expect(diagram.getAllByRole('row')[2]).toHaveAttribute('aria-current', 'true');
    fireEvent.click(diagram.getByRole('button', { name: '초기화' }));
    expect(diagram.getByRole('button', { name: '0' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('keeps two instances independent and resets an instance on revision change', async () => {
    const view = render(
      <>
        <InteractiveSlot declaration={declaration('first')} documentRevision="r1" />
        <InteractiveSlot declaration={declaration('second')} documentRevision="r1" />
      </>,
    );
    await waitFor(() => expect(view.container.querySelectorAll('.interactive-diagram')).toHaveLength(2));
    fireEvent.click(inverter(view.container, 0).getByRole('button', { name: '1' }));
    expect(inverter(view.container, 0).getByRole('button', { name: '1' })).toHaveAttribute('aria-pressed', 'true');
    expect(inverter(view.container, 1).getByRole('button', { name: '0' })).toHaveAttribute('aria-pressed', 'true');

    view.rerender(<InteractiveSlot declaration={declaration('first')} documentRevision="r2" />);
    expect(inverter(view.container).getByRole('button', { name: '0' })).toHaveAttribute('aria-pressed', 'true');
  });
});

describe('Voltage and current', () => {
  function renderVoltage(instanceId = 'voltage:1') {
    return render(
      <InteractiveSlot declaration={declaration(instanceId, 'voltage-current')} documentRevision="r1" />,
    );
  }

  function result(container: HTMLElement) {
    const element = container.querySelector<HTMLElement>('.voltage-current-results');
    if (element === null) throw new Error('Missing voltage/current result');
    return within(element);
  }

  it('starts with low voltage, an open circuit, and no current', async () => {
    const view = renderVoltage();
    const diagram = within(await screen.findByRole('region', { name: '전압과 전류' }));
    expect(diagram.getByRole('button', { name: '낮은 전압' })).toHaveAttribute('aria-pressed', 'true');
    expect(diagram.getByRole('button', { name: '회로 열림' })).toHaveAttribute('aria-pressed', 'true');
    expect(result(view.container).getByText('전류 없음')).toBeInTheDocument();
    expect(result(view.container).getByText('상대 전류: 없음')).toBeInTheDocument();
    expect(view.container.querySelector('.interactive-feedback')).toHaveTextContent('전압차는 있지만 경로가 끊어져');
  });

  it('shows a small relative current only after the low-voltage circuit closes', async () => {
    const view = renderVoltage();
    const diagram = within(await screen.findByRole('region', { name: '전압과 전류' }));
    fireEvent.click(diagram.getByRole('button', { name: '회로 닫힘' }));
    expect(result(view.container).getByText('전류 흐름')).toBeInTheDocument();
    expect(result(view.container).getByText('상대 전류: 작음')).toBeInTheDocument();
    expect(view.container.querySelector('.vc-wire.active')).toBeInTheDocument();
    expect(view.container.querySelector('.interactive-feedback')).toHaveTextContent('같은 저항 조건에서는 전압이 커질수록');
  });

  it('shows a larger relative current at high voltage with the same closed path', async () => {
    const view = renderVoltage();
    const diagram = within(await screen.findByRole('region', { name: '전압과 전류' }));
    fireEvent.click(diagram.getByRole('button', { name: '회로 닫힘' }));
    fireEvent.click(diagram.getByRole('button', { name: '높은 전압' }));
    expect(result(view.container).getByText('상대 전류: 큼')).toBeInTheDocument();
    expect(view.container.querySelector('.interactive-feedback')).toHaveTextContent('낮은 전압일 때보다 큽니다');
  });

  it('shows no current at zero voltage even when closed, then resets', async () => {
    const view = renderVoltage();
    const diagram = within(await screen.findByRole('region', { name: '전압과 전류' }));
    fireEvent.click(diagram.getByRole('button', { name: '회로 닫힘' }));
    fireEvent.click(diagram.getByRole('button', { name: '0 · 전압 없음' }));
    expect(result(view.container).getByText('전류 없음')).toBeInTheDocument();
    expect(view.container.querySelector('.vc-wire.active')).not.toBeInTheDocument();
    expect(view.container.querySelector('.interactive-feedback')).toHaveTextContent('닫혀 있어도 전류는 흐르지 않습니다');
    fireEvent.click(diagram.getByRole('button', { name: '초기화' }));
    expect(diagram.getByRole('button', { name: '낮은 전압' })).toHaveAttribute('aria-pressed', 'true');
    expect(diagram.getByRole('button', { name: '회로 열림' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('presents voltage as a two-point difference and current as path flow', async () => {
    const view = renderVoltage();
    const diagram = within(await screen.findByRole('region', { name: '전압과 전류' }));
    expect(result(view.container).getByText('Voltage · 전압')).toBeInTheDocument();
    expect(result(view.container).getByText('전원 양단 두 점 사이')).toBeInTheDocument();
    expect(result(view.container).getByText('Current · 전류')).toBeInTheDocument();
    expect(diagram.getByText('교육용 정성 모델 · 저항이 일정할 때 I ∝ V')).toBeInTheDocument();
    expect(diagram.getByRole('img')).toHaveAccessibleName(/낮은 전압, 회로 열림/);
  });

  it('keeps two voltage/current instances independent', async () => {
    const view = render(
      <>
        <InteractiveSlot declaration={declaration('voltage:first', 'voltage-current')} documentRevision="r1" />
        <InteractiveSlot declaration={declaration('voltage:second', 'voltage-current')} documentRevision="r1" />
      </>,
    );
    await waitFor(() => expect(view.container.querySelectorAll('.voltage-current-layout')).toHaveLength(2));
    const diagrams = screen.getAllByRole('region', { name: '전압과 전류' });
    fireEvent.click(within(diagrams[0]!).getByRole('button', { name: '회로 닫힘' }));
    fireEvent.click(within(diagrams[0]!).getByRole('button', { name: '높은 전압' }));
    expect(within(diagrams[0]!).getByRole('button', { name: '높은 전압' })).toHaveAttribute('aria-pressed', 'true');
    expect(within(diagrams[1]!).getByRole('button', { name: '낮은 전압' })).toHaveAttribute('aria-pressed', 'true');
    expect(within(diagrams[1]!).getByRole('button', { name: '회로 열림' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('renders from the real m00-l02 content declaration', async () => {
    const document = catalog.documentsById['m00-l02']!;
    render(<MemoryRouter><ContentRenderer document={document} index={index} /></MemoryRouter>);
    expect(await screen.findByRole('region', { name: '전압과 전류' })).toBeInTheDocument();
  });
});

describe('MOS channel diagrams', () => {
  function renderMosfet(instanceId = 'mosfet:1') {
    return render(<InteractiveSlot declaration={declaration(instanceId, 'mosfet-channel')} documentRevision="r1" />);
  }

  function renderComplementary(instanceId = 'complementary:1') {
    return render(<InteractiveSlot declaration={declaration(instanceId, 'nmos-pmos-channel')} documentRevision="r1" />);
  }

  it('starts the MOSFET at normalized Gate level 0 with no channel and OFF', async () => {
    const view = renderMosfet();
    const diagram = within(await screen.findByRole('region', { name: 'MOSFET Channel' }));
    const slider = diagram.getByRole('slider', { name: '교육용 Gate 수준' });
    expect(slider).toHaveValue('0');
    expect(slider).toHaveAttribute('min', '0');
    expect(slider).toHaveAttribute('max', '100');
    expect(slider).toHaveAttribute('step', '10');
    expect(slider).toHaveAttribute('aria-valuetext', '교육용 Gate 수준 0%');
    expect(diagram.getByText('Channel 없음 · OFF')).toBeInTheDocument();
    expect(view.container.querySelector('.mos-cross-section')).toHaveClass('off');
  });

  it('stays OFF below the educational threshold and turns ON at it', async () => {
    const view = renderMosfet();
    const diagram = within(await screen.findByRole('region', { name: 'MOSFET Channel' }));
    const slider = diagram.getByRole('slider', { name: '교육용 Gate 수준' });
    fireEvent.change(slider, { target: { value: '50' } });
    expect(diagram.getByText('Channel 없음 · OFF')).toBeInTheDocument();
    expect(view.container.querySelector('.mos-cross-section')).toHaveClass('off');
    fireEvent.change(slider, { target: { value: '60' } });
    expect(diagram.getByText('Channel 형성 · ON')).toBeInTheDocument();
    expect(view.container.querySelector('.mos-cross-section')).toHaveClass('on');
    expect(view.container.querySelector('.interactive-feedback')).toHaveTextContent('Gate 전기장에 의해 channel이 형성');
  });

  it('labels the insulated structure, explains normalization, and resets without live slider announcements', async () => {
    const view = renderMosfet();
    const diagram = within(await screen.findByRole('region', { name: 'MOSFET Channel' }));
    expect(diagram.getByText('Gate')).toBeInTheDocument();
    expect(diagram.getByText('Oxide · 절연막')).toBeInTheDocument();
    expect(diagram.getByText('Source')).toBeInTheDocument();
    expect(diagram.getByText('Drain')).toBeInTheDocument();
    expect(diagram.getByText(/실제 MOSFET의 Vth 값이 아닙니다/)).toBeInTheDocument();
    expect(view.container.querySelector('.interactive-feedback')).not.toHaveAttribute('aria-live');
    fireEvent.change(diagram.getByRole('slider'), { target: { value: '80' } });
    fireEvent.click(diagram.getByRole('button', { name: '초기화' }));
    expect(diagram.getByRole('slider')).toHaveValue('0');
    expect(diagram.getByText('Channel 없음 · OFF')).toBeInTheDocument();
  });

  it('shows NMOS OFF and PMOS ON for shared LOW input', async () => {
    const view = renderComplementary();
    const diagram = within(await screen.findByRole('region', { name: 'NMOS vs PMOS' }));
    expect(diagram.getByRole('button', { name: '0 · LOW' })).toHaveAttribute('aria-pressed', 'true');
    expect(within(view.container.querySelector<HTMLElement>('.mos-cross-section.nmos')!).getByText('NMOS · OFF')).toBeInTheDocument();
    expect(within(view.container.querySelector<HTMLElement>('.mos-cross-section.pmos')!).getByText('PMOS · ON')).toBeInTheDocument();
    expect(diagram.getByText('VDD 쪽 Source')).toBeInTheDocument();
    expect(diagram.getByText('GND 쪽 Source')).toBeInTheDocument();
  });

  it('reverses both devices for HIGH input and reset restores LOW', async () => {
    const view = renderComplementary();
    const diagram = within(await screen.findByRole('region', { name: 'NMOS vs PMOS' }));
    fireEvent.click(diagram.getByRole('button', { name: '1 · HIGH' }));
    expect(within(view.container.querySelector<HTMLElement>('.mos-cross-section.nmos')!).getByText('NMOS · ON')).toBeInTheDocument();
    expect(within(view.container.querySelector<HTMLElement>('.mos-cross-section.pmos')!).getByText('PMOS · OFF')).toBeInTheDocument();
    expect(view.container.querySelector('.interactive-feedback')).toHaveTextContent('INPUT HIGH: NMOS는 ON이고 PMOS는 OFF');
    fireEvent.click(diagram.getByRole('button', { name: '초기화' }));
    expect(diagram.getByRole('button', { name: '0 · LOW' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('keeps two complementary instances independent', async () => {
    const view = render(
      <>
        <InteractiveSlot declaration={declaration('complementary:first', 'nmos-pmos-channel')} documentRevision="r1" />
        <InteractiveSlot declaration={declaration('complementary:second', 'nmos-pmos-channel')} documentRevision="r1" />
      </>,
    );
    await waitFor(() => expect(view.container.querySelectorAll('.nmos-pmos-layout')).toHaveLength(2));
    const diagrams = screen.getAllByRole('region', { name: 'NMOS vs PMOS' });
    fireEvent.click(within(diagrams[0]!).getByRole('button', { name: '1 · HIGH' }));
    expect(within(diagrams[0]!).getByRole('button', { name: '1 · HIGH' })).toHaveAttribute('aria-pressed', 'true');
    expect(within(diagrams[1]!).getByRole('button', { name: '0 · LOW' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('renders both MOSFET and MOS capacitor in m00-l04', async () => {
    const document = catalog.documentsById['m00-l04']!;
    render(<MemoryRouter><ContentRenderer document={document} index={index} /></MemoryRouter>);
    expect(await screen.findByRole('region', { name: 'MOSFET Channel' })).toBeInTheDocument();
    expect(await screen.findByRole('region', { name: 'MOS Capacitor' })).toBeInTheDocument();
    expect(screen.queryByText('인터랙티브 도식은 준비 중입니다.')).not.toBeInTheDocument();
  });

  it('renders NMOS vs PMOS from the real m01-l01 declaration', async () => {
    const document = catalog.documentsById['m01-l01']!;
    render(<MemoryRouter><ContentRenderer document={document} index={index} /></MemoryRouter>);
    expect(await screen.findByRole('region', { name: 'NMOS vs PMOS' })).toBeInTheDocument();
  });
});

describe('Wafer → Die → Transistor hierarchy', () => {
  function renderHierarchy(instanceId = 'hierarchy:1') {
    return render(
      <InteractiveSlot
        declaration={declaration(instanceId, 'wafer-die-transistor')}
        documentRevision="r1"
      />,
    );
  }

  it('starts at Wafer with repeated Die and explains the conceptual scale', async () => {
    const view = renderHierarchy();
    const diagram = within(await screen.findByRole('region', { name: 'Wafer → Die → Transistor' }));
    expect(diagram.getByText('현재:')).toHaveTextContent('현재: Wafer');
    expect(diagram.getByRole('button', { name: 'Wafer' })).toHaveAttribute('aria-current', 'step');
    expect(view.container.querySelectorAll('.hierarchy-die-tile').length).toBeGreaterThan(20);
    expect(view.container.querySelector('.hierarchy-die-tile.selected')).toBeInTheDocument();
    expect(diagram.getByText('개념적 확대도이며 실제 크기 비율과 다릅니다.')).toBeInTheDocument();
    expect(diagram.getByText(/하나의 Wafer에는 여러 Die가 있고/)).toBeInTheDocument();
  });

  it('moves through Die and Transistor, then supports previous and reset navigation', async () => {
    const view = renderHierarchy();
    const diagram = within(await screen.findByRole('region', { name: 'Wafer → Die → Transistor' }));
    fireEvent.click(diagram.getByRole('button', { name: '대표 Die 확대' }));
    expect(diagram.getByText('현재:')).toHaveTextContent('현재: Die');
    expect(view.container.querySelectorAll('.hierarchy-cell')).toHaveLength(30);
    expect(view.container.querySelector('.interactive-feedback')).toHaveTextContent('기능 Block과 Cell');

    fireEvent.click(diagram.getByRole('button', { name: 'Transistor까지 확대' }));
    expect(diagram.getByText('현재:')).toHaveTextContent('현재: Transistor');
    expect(diagram.getByRole('img')).toHaveAccessibleName(/Transistor 단계/);
    expect(view.container.querySelector('.interactive-feedback')).toHaveTextContent('Gate, Source, Drain');

    fireEvent.click(diagram.getByRole('button', { name: '이전 단계' }));
    expect(diagram.getByText('현재:')).toHaveTextContent('현재: Die');
    fireEvent.click(diagram.getByRole('button', { name: '처음으로' }));
    expect(diagram.getByText('현재:')).toHaveTextContent('현재: Wafer');
    fireEvent.click(diagram.getByRole('button', { name: 'Transistor' }));
    fireEvent.click(diagram.getByRole('button', { name: '초기화' }));
    expect(diagram.getByText('현재:')).toHaveTextContent('현재: Wafer');
  });

  it('keeps two hierarchy instances independent', async () => {
    const view = render(
      <>
        <InteractiveSlot declaration={declaration('hierarchy:first', 'wafer-die-transistor')} documentRevision="r1" />
        <InteractiveSlot declaration={declaration('hierarchy:second', 'wafer-die-transistor')} documentRevision="r1" />
      </>,
    );
    await waitFor(() => expect(view.container.querySelectorAll('.hierarchy-view')).toHaveLength(2));
    const diagrams = screen.getAllByRole('region', { name: 'Wafer → Die → Transistor' });
    fireEvent.click(within(diagrams[0]!).getByRole('button', { name: 'Transistor' }));
    expect(within(diagrams[0]!).getByText('현재:')).toHaveTextContent('현재: Transistor');
    expect(within(diagrams[1]!).getByText('현재:')).toHaveTextContent('현재: Wafer');
  });

  it.each(['m00-l01', 'm02-l01'])('renders from the real %s content declaration', async documentId => {
    const document = catalog.documentsById[documentId]!;
    render(<MemoryRouter><ContentRenderer document={document} index={index} /></MemoryRouter>);
    expect(await screen.findByRole('region', { name: 'Wafer → Die → Transistor' })).toBeInTheDocument();
  });
});

class MemoryTransport implements ContentTransport {
  constructor(private readonly values: Map<string, unknown>) {}
  async loadJson(file: string) {
    const value = this.values.get(file);
    if (value === undefined) throw new Error(`Missing ${file}`);
    return value;
  }
}

class MemoryProgressStorage implements ProgressStorage {
  values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

it('does not change progress or Quiz responses when the inverter is used', async () => {
  const values = new Map<string, unknown>([['index.json', structuredClone(index)]]);
  for (const id of index.documentIds) {
    values.set(index.documentsById[id]!.documentFile, structuredClone(catalog.documentsById[id]));
  }
  const storage = new MemoryProgressStorage();
  render(
    <ContentProvider loader={new ContentLoader(new MemoryTransport(values))}>
      <ProgressProvider storage={storage} now={() => '2026-09-14T00:00:00.000Z'}>
        <MemoryRouter initialEntries={['/learn/m01-l02']}><AppRoutes /></MemoryRouter>
      </ProgressProvider>
    </ContentProvider>,
  );
  const diagram = within(await screen.findByRole('region', { name: 'CMOS Inverter' }));
  await waitFor(() => expect(storage.values.has(PROGRESS_STORAGE_KEY)).toBe(true));
  const progressBefore = storage.values.get(PROGRESS_STORAGE_KEY);
  expect(screen.getAllByRole('radio').every(input => !(input as HTMLInputElement).checked)).toBe(true);
  fireEvent.click(diagram.getByRole('button', { name: '1' }));
  expect(storage.values.get(PROGRESS_STORAGE_KEY)).toBe(progressBefore);
  expect(screen.getAllByRole('radio').every(input => !(input as HTMLInputElement).checked)).toBe(true);
  expect(screen.getByRole('button', { name: '학습 완료' })).toBeInTheDocument();
});
