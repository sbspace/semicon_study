// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ContentRenderer } from '../src/app/ContentRenderer.js';
import TsvBonding from '../src/app/interactive/diagrams/TsvBonding.js';
import PackageYieldPath from '../src/app/interactive/diagrams/PackageYieldPath.js';
import HbmBandwidth from '../src/app/interactive/diagrams/HbmBandwidth.js';
import HbmStack from '../src/app/interactive/diagrams/HbmStack.js';
import HbmCapacityVsBandwidth from '../src/app/interactive/diagrams/HbmCapacityVsBandwidth.js';
import HbmTestThermal from '../src/app/interactive/diagrams/HbmTestThermal.js';
import { interactiveRegistry, registeredInteractive } from '../src/app/interactive/registry.js';
import { parseContentDirectory } from '../src/content/parse.js';
import { createContentIndex } from '../src/content/write.js';
import type { ContentCatalog, ContentIndex, InteractiveDeclaration } from '../src/content/types.js';

const declaration: InteractiveDeclaration = { instanceId: 'm67:1', documentId: 'm06-l03', type: 'tsv-bonding', attributes: { type: 'tsv-bonding' }, original: { markdown: '', source: { path: 'fixture.md', start: 0, end: 0, startLine: 1, endLine: 1 } } };
const props = { declaration, documentRevision: 'r1' };
const feedback = () => document.querySelector('.interactive-feedback')!;
const choose = (name: string) => fireEvent.click(screen.getByRole('radio', { name }));
afterEach(cleanup);

describe('Module 6 and 7 educational interactions', () => {
  it('distinguishes TSV, bonding and BEOL via locations', () => {
    render(<TsvBonding {...props} />);
    expect(feedback()).toHaveTextContent('Silicon Die');
    choose('Die-to-Die 접합');
    expect(feedback()).toHaveTextContent('서로 다른 Die의 경계');
    choose('BEOL Via');
    expect(feedback()).toHaveTextContent('금속 배선층');
  });

  it('calculates an explicitly simplified package yield path', () => {
    render(<PackageYieldPath {...props} />);
    expect(feedback()).toHaveTextContent('96.05%');
    choose('95%');
    expect(feedback()).toHaveTextContent('88.45%');
    choose('열 문제 있음');
    expect(feedback()).toHaveTextContent('별도로 확인');
    expect(screen.getByText(/Package 성공을 보장하지 않습니다/)).toBeInTheDocument();
  });

  it('changes theoretical bandwidth and keeps bit, byte and latency separate', () => {
    render(<HbmBandwidth {...props} />);
    expect(feedback()).toHaveTextContent('256 GB/s');
    choose('1,024 bit');
    choose('8 Gb/s');
    expect(feedback()).toHaveTextContent('1,024 GB/s');
    expect(screen.getByText(/latency와는 다른 기준/)).toBeInTheDocument();
  });

  it('explains each HBM stack part without putting the GPU below it', () => {
    render(<HbmStack {...props} />);
    choose('TSV');
    expect(feedback()).toHaveTextContent('수직 경로');
    choose('Base Die');
    expect(feedback()).toHaveTextContent('인터페이스');
    choose('GPU side');
    expect(feedback()).toHaveTextContent('아래가 아니라 옆');
  });

  it('calculates capacity separately from bandwidth and excludes the base die', () => {
    render(<HbmCapacityVsBandwidth {...props} />);
    expect(feedback()).toHaveTextContent('24 GB');
    choose('12H');
    expect(feedback()).toHaveTextContent('36 GB');
    choose('8 Gb/s');
    expect(feedback()).toHaveTextContent('1,024 GB/s');
    expect(screen.getByText(/Base Die는 DRAM 데이터 용량에 포함하지 않습니다/)).toBeInTheDocument();
  });

  it('moves from test defects to the stacked thermal path', () => {
    render(<HbmTestThermal {...props} />);
    choose('Bonding defect');
    expect(feedback()).toHaveTextContent('적층·접합 뒤');
    choose('Thermal path');
    choose('아래 Die');
    expect(feedback()).toHaveTextContent('냉각 구조');
    expect(screen.getByText(/KGD도 박막화/)).toBeInTheDocument();
  });
});

describe('real Module 6 and 7 slots', () => {
  let catalog: ContentCatalog;
  let index: ContentIndex;
  beforeAll(async () => {
    const parsed = await parseContentDirectory('content');
    if (!parsed.ok) throw new Error(JSON.stringify(parsed.diagnostics));
    catalog = parsed.data;
    index = createContentIndex(catalog);
  });

  it.each(['m06-l01', 'm06-l02', 'm06-l03', 'm06-l04', 'm07-l01', 'm07-l02', 'm07-l03', 'm07-l04'])('renders the registered slot in %s', async id => {
    const document = catalog.documentsById[id]!;
    const blocks = document.body.blocks.filter(block => block.kind === 'interactive');
    expect(blocks).toHaveLength(1);
    expect(registeredInteractive(interactiveRegistry, blocks[0]!.value.type)).toBeDefined();
    const view = render(<MemoryRouter><ContentRenderer document={document} index={index} /></MemoryRouter>);
    await waitFor(() => expect(view.container.querySelectorAll('.interactive-diagram')).toHaveLength(1));
    expect(view.container.querySelector('.interactive-placeholder')).toBeNull();
  });
});
