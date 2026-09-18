// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ContentRenderer } from '../src/app/ContentRenderer.js';
import { InteractiveSlot } from '../src/app/interactive/InteractiveSlot.js';
import { interactiveRegistry, registeredInteractive } from '../src/app/interactive/registry.js';
import DieFloorplan from '../src/app/interactive/diagrams/DieFloorplan.js';
import FeolMolBeol from '../src/app/interactive/diagrams/FeolMolBeol.js';
import SignalClockPdn from '../src/app/interactive/diagrams/SignalClockPdn.js';
import PadBumpPackagePcb from '../src/app/interactive/diagrams/PadBumpPackagePcb.js';
import ChipletPackage from '../src/app/interactive/diagrams/ChipletPackage.js';
import WaferShotReticle from '../src/app/interactive/diagrams/WaferShotReticle.js';
import { parseContentDirectory } from '../src/content/parse.js';
import { createContentIndex } from '../src/content/write.js';
import type { ContentCatalog, ContentIndex, InteractiveDeclaration } from '../src/content/types.js';

const declaration: InteractiveDeclaration = { instanceId:'fixture:1', documentId:'fixture', type:'die-floorplan', attributes:{type:'die-floorplan'}, original:{markdown:'',source:{path:'fixture.md',start:0,end:0,startLine:1,endLine:1}} };
const props = { declaration, documentRevision:'r1' };
const feedback = () => document.querySelector('.interactive-feedback')!;
const choose = (name: string) => fireEvent.click(screen.getByRole('radio', { name }));
afterEach(cleanup);

describe('Module 2 educational interactions', () => {
  it('connects each floorplan block to its function and neighbors, and resets', () => {
    render(<DieFloorplan {...props}/>);
    expect(feedback()).toHaveTextContent('명령을 해석');
    choose('Cache'); expect(feedback()).toHaveTextContent('가까이 저장');
    choose('I/O'); expect(feedback()).toHaveTextContent('칩 안과 밖');
    choose('제어 블록'); expect(feedback()).toHaveTextContent('메모리 접근');
    fireEvent.click(screen.getByRole('button', {name:'연결 보기'}));
    expect(feedback()).toHaveTextContent('Cache · I/O');
    expect(screen.getByRole('button', {name:'연결 보기'})).toHaveAttribute('aria-pressed','true');
    fireEvent.click(screen.getByRole('button', {name:'초기화'}));
    expect(screen.getByRole('radio', {name:'Core'})).toBeChecked();
    expect(screen.getByRole('button', {name:'연결 보기'})).toHaveAttribute('aria-pressed','false');
  });
  it('distinguishes transistor, contact and metal/via positions', () => {
    render(<FeolMolBeol {...props}/>);
    choose('FEOL'); expect(feedback()).toHaveTextContent('Gate는 Oxide로 절연');
    choose('MOL'); expect(feedback()).toHaveTextContent('첫 금속 배선');
    expect(feedback()).toHaveTextContent('Via와 역할·위치가 다릅니다');
    choose('BEOL'); expect(feedback()).toHaveTextContent('서로 다른 Metal 높이');
    choose('전체 보기'); expect(feedback()).toHaveTextContent('한 칩의 단면');
  });
  it('separates information flow, timing fan-out and power distribution', () => {
    render(<SignalClockPdn {...props}/>);
    expect(feedback()).toHaveTextContent('데이터와 제어');
    choose('Clock'); expect(feedback()).toHaveTextContent('타이밍 기준을 분기');
    choose('Power'); expect(feedback()).toHaveTextContent('서로 분리된 두 전원망');
    choose('Signal'); expect(feedback()).toHaveTextContent('Core ↔ Cache');
  });
  it('locates every electrical connection and separates backside heat flow', () => {
    render(<PadBumpPackagePcb {...props}/>);
    for (const [name,detail] of [['Die / Pad','아래쪽 회로면'],['Bump','Die의 Pad'],['Package','펼쳐 연결'],['Ball','PCB 사이의 접점'],['PCB','다른 부품']]) {
      choose(name!); expect(feedback()).toHaveTextContent(detail!);
    }
    expect(feedback()).toHaveTextContent('Die → Pad → Bump → Substrate → Ball → PCB');
    choose('열 경로'); expect(feedback()).toHaveTextContent('Die 뒷면 → 상부 방열 구조');
    expect(feedback()).toHaveTextContent('PCB로만 나가는 것은 아닙니다');
    expect(screen.queryByRole('group',{name:'연결 구간'})).not.toBeInTheDocument();
    choose('전기 연결'); expect(feedback()).toHaveTextContent('PCB 배선');
  });
  it('keeps functional splitting separate from placement and omits meaningless combinations', () => {
    render(<ChipletPackage {...props}/>);
    expect(feedback()).toHaveTextContent('하나의 Die');
    expect(screen.queryByRole('group',{name:'배치 사례'})).not.toBeInTheDocument();
    choose('Chiplet'); expect(feedback()).toHaveTextContent('반드시 3D 적층인 것은 아닙니다');
    choose('적층 · 3D 예'); expect(feedback()).toHaveTextContent('수직 접합');
    choose('나란히 · 2.5D 예'); expect(feedback()).toHaveTextContent('Interposer');
    choose('Monolithic'); expect(screen.queryByRole('radio',{name:'적층 · 3D 예'})).not.toBeInTheDocument();
  });
  it('distinguishes wafer, shot, die, scribe space and reticle, and moves the selected exposure', () => {
    render(<WaferShotReticle {...props}/>);
    expect(feedback()).toHaveTextContent('실리콘 판');
    choose('Shot'); expect(feedback()).toHaveTextContent('같은 개념이 아닙니다');
    choose('Die'); expect(feedback()).toHaveTextContent('제품 단위');
    choose('Scribe Line'); expect(feedback()).toHaveTextContent('절단 여유');
    choose('Reticle'); expect(feedback()).toHaveTextContent('Photoresist에 패턴을 전사');
    expect(screen.getByRole('button',{name:'이전 Shot'})).toBeDisabled();
    fireEvent.click(screen.getByRole('button',{name:'다음 Shot'}));
    expect(screen.getByRole('img',{name:'Wafer의 선택 Shot 2'})).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:'초기화'}));
    expect(screen.getByRole('radio',{name:'Wafer'})).toBeChecked();
    expect(screen.getByRole('button',{name:'이전 Shot'})).toBeDisabled();
  });
  it('isolates repeated instances, uses unique SVG/radio IDs and resets on revision/document change', async () => {
    const second = {...declaration, instanceId:'fixture:2'};
    const view = render(<><InteractiveSlot {...props}/><InteractiveSlot declaration={second} documentRevision="r1"/></>);
    await screen.findAllByRole('region',{name:'Die Floorplan'});
    const regions = screen.getAllByRole('region',{name:'Die Floorplan'});
    fireEvent.click(within(regions[0]!).getByRole('radio',{name:'Cache'}));
    expect(within(regions[1]!).getByRole('radio',{name:'Core'})).toBeChecked();
    const ids = Array.from(document.querySelectorAll('svg [id]')).map(el=>el.id);
    expect(new Set(ids).size).toBe(ids.length);
    const names = regions.map(el=>el.querySelector('input')!.name); expect(names[0]).not.toBe(names[1]);
    view.rerender(<InteractiveSlot {...props} documentRevision="r2"/>);
    expect(screen.getByRole('radio',{name:'Core'})).toBeChecked();
    choose('I/O');
    view.rerender(<InteractiveSlot declaration={{...declaration,documentId:'other'}} documentRevision="r2"/>);
    expect(screen.getByRole('radio',{name:'Core'})).toBeChecked();
  });
});

describe('real Module 2 and Module 6 reuse', () => {
  let catalog: ContentCatalog; let index: ContentIndex;
  beforeAll(async()=>{const parsed=await parseContentDirectory('content'); if(!parsed.ok)throw new Error(JSON.stringify(parsed.diagnostics)); catalog=parsed.data;index=createContentIndex(catalog);});
  it.each(['m02-l01','m02-l02','m02-l03','m02-l04','m02-l05','m02-l06','m02-s-feol-beol','m02-s-floorplan','m02-s-wafer-shot','m06-l01','m06-l02'])('renders every real slot in %s', async id => {
    const document = catalog.documentsById[id]!;
    const blocks = document.body.blocks.filter(block=>block.kind==='interactive');
    expect(blocks).toHaveLength(1);
    for(const block of blocks) expect(registeredInteractive(interactiveRegistry,block.value.type)).toBeDefined();
    const view=render(<MemoryRouter><ContentRenderer document={document} index={index}/></MemoryRouter>);
    await waitFor(()=>expect(view.container.querySelectorAll('.interactive-diagram')).toHaveLength(blocks.length));
    expect(view.container.querySelector('.interactive-placeholder')).toBeNull();
  });
  it('registers 53 types and retains the prototype-safe fallback',()=>{
    expect(Object.keys(interactiveRegistry)).toHaveLength(53);
    expect(registeredInteractive(interactiveRegistry,'toString')).toBeUndefined();
    render(<InteractiveSlot declaration={{...declaration,type:'unknown'}} documentRevision="r1"/>);
    expect(screen.getByText('인터랙티브 도식은 준비 중입니다.')).toBeInTheDocument();
  });
});
