// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ContentRenderer } from '../src/app/ContentRenderer.js';
import SemiconductorEcosystem from '../src/app/interactive/diagrams/SemiconductorEcosystem.js';
import PdkEdaIp from '../src/app/interactive/diagrams/PdkEdaIp.js';
import DesignToSilicon from '../src/app/interactive/diagrams/DesignToSilicon.js';
import YieldCapacityCost from '../src/app/interactive/diagrams/YieldCapacityCost.js';
import TechnologyMaturityMap from '../src/app/interactive/diagrams/TechnologyMaturityMap.js';
import HighNaProcessWindow from '../src/app/interactive/diagrams/HighNaProcessWindow.js';
import HbmSpecReader from '../src/app/interactive/diagrams/HbmSpecReader.js';
import ChipletInteroperability from '../src/app/interactive/diagrams/ChipletInteroperability.js';
import { interactiveRegistry, registeredInteractive } from '../src/app/interactive/registry.js';
import { parseContentDirectory } from '../src/content/parse.js';
import { createContentIndex } from '../src/content/write.js';
import type { ContentCatalog, ContentIndex, InteractiveDeclaration } from '../src/content/types.js';

const declaration: InteractiveDeclaration = { instanceId: 'm89:1', documentId: 'm08-l01', type: 'semiconductor-ecosystem', attributes: { type: 'semiconductor-ecosystem' }, original: { markdown: '', source: { path: 'fixture.md', start: 0, end: 0, startLine: 1, endLine: 1 } } };
const props = { declaration, documentRevision: 'r1' };
const feedback = () => document.querySelector('.interactive-feedback')!;
const choose = (name: string) => fireEvent.click(screen.getByRole('radio', { name }));
afterEach(cleanup);

describe('Module 8 and 9 educational interactions', () => {
  it('places ecosystem roles in the value chain and explains overlap', () => {
    render(<SemiconductorEcosystem {...props} />); choose('IDM');
    expect(feedback()).toHaveTextContent('설계와 제조');
    expect(screen.getByText(/여러 역할을 겸할 수도/)).toBeInTheDocument();
  });
  it('distinguishes PDK, EDA, IP, DRC and LVS', () => {
    render(<PdkEdaIp {...props} />); choose('연결 불일치');
    expect(feedback()).toHaveTextContent('LVS'); expect(feedback()).toHaveTextContent('layout과 schematic');
    expect(screen.getByText(/모든 제품 검증이 끝난 것은 아닙니다/)).toBeInTheDocument();
  });
  it('continues beyond tape-out to manufacturing and final test', () => {
    render(<DesignToSilicon {...props} />); fireEvent.click(screen.getByRole('button', { name: 'Tape-out' }));
    expect(feedback()).toHaveTextContent('마스크 제작');
    expect(screen.getAllByText('Mask / Manufacturing')).toHaveLength(2);
    expect(screen.getByText(/이후에도 제조·검사·패키징/)).toBeInTheDocument();
  });
  it('calculates final good units and keeps capacity separate', () => {
    render(<YieldCapacityCost {...props} />); expect(feedback()).toHaveTextContent('380개');
    choose('90%'); expect(feedback()).toHaveTextContent('428개');
    choose('여유 있음'); expect(feedback()).toHaveTextContent('별도 조건');
  });
  it('prevents maturity stages from collapsing into announcement', () => {
    render(<TechnologyMaturityMap {...props} />); fireEvent.click(screen.getByRole('button', { name: 'Sampling' }));
    expect(feedback()).toHaveTextContent('현재 증거: Sampling');
    expect(feedback()).toHaveTextContent('Qualification 증거 필요');
    expect(screen.getByText(/실시간 업계 현황/)).toBeInTheDocument();
  });
  it('compares NA and focus without pretending to calculate resolution', () => {
    render(<HighNaProcessWindow {...props} />); choose('더 높은 NA'); choose('더 벗어남');
    expect(feedback()).toHaveTextContent('초점 허용 범위는 더 좁습니다');
    expect(screen.getByText(/두 사례가 같음/)).toBeInTheDocument();
    expect(screen.getByText(/실제 nm 해상도/)).toBeInTheDocument();
  });
  it('reads H, GB, data rate, bandwidth and status as separate fields', () => {
    render(<HbmSpecReader {...props} />); choose('36 GB'); expect(feedback()).toHaveTextContent('저장 가능한 byte');
    choose('8 Gb/s'); expect(feedback()).toHaveTextContent('pin 하나');
    choose('Sampling'); expect(feedback()).toHaveTextContent('대량 출하와 같은 뜻이 아닙니다');
  });
  it('reports chiplet mismatch and unchecked layers without a score', () => {
    render(<ChipletInteroperability {...props} />); choose('Protocol'); expect(feedback()).toHaveTextContent('불일치');
    choose('Thermal'); expect(feedback()).toHaveTextContent('검증 필요');
    expect(screen.getByText(/호환 점수는 제공하지 않습니다/)).toBeInTheDocument();
  });
});

describe('complete interactive registry and real Module 8 and 9 slots', () => {
  let catalog: ContentCatalog; let index: ContentIndex;
  beforeAll(async () => { const parsed = await parseContentDirectory('content'); if (!parsed.ok) throw new Error(JSON.stringify(parsed.diagnostics)); catalog = parsed.data; index = createContentIndex(catalog); });
  it.each(['m08-l01', 'm08-l02', 'm08-l03', 'm08-l04', 'm09-l01', 'm09-l02', 'm09-l03', 'm09-l04'])('renders the registered slot in %s', async id => {
    const document = catalog.documentsById[id]!; const blocks = document.body.blocks.filter(block => block.kind === 'interactive');
    expect(blocks).toHaveLength(1); expect(registeredInteractive(interactiveRegistry, blocks[0]!.value.type)).toBeDefined();
    const view = render(<MemoryRouter><ContentRenderer document={document} index={index} /></MemoryRouter>);
    await waitFor(() => expect(view.container.querySelectorAll('.interactive-diagram')).toHaveLength(1));
    expect(view.container.querySelector('.interactive-placeholder')).toBeNull();
  });
  it('registers all 53 declared types and resolves all 60 real instances', () => {
    const declaredTypes = new Set<string>(); let instances = 0;
    for (const document of Object.values(catalog.documentsById)) {
      if (document.kind === 'module' || document.kind === 'supporting') continue;
      for (const block of document.body.blocks) if (block.kind === 'interactive') { instances += 1; declaredTypes.add(block.value.type); expect(registeredInteractive(interactiveRegistry, block.value.type)).toBeDefined(); }
    }
    expect(instances).toBe(60); expect(declaredTypes.size).toBe(53);
    expect(new Set(Object.keys(interactiveRegistry))).toEqual(declaredTypes);
    expect(registeredInteractive(interactiveRegistry, 'future-unknown-type')).toBeUndefined();
  });
});
