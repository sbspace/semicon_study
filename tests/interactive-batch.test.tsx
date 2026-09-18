// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ContentRenderer } from '../src/app/ContentRenderer.js';
import FullAdder from '../src/app/interactive/diagrams/FullAdder.js';
import HalfAdder from '../src/app/interactive/diagrams/HalfAdder.js';
import FlipflopRegister from '../src/app/interactive/diagrams/FlipflopRegister.js';
import MosCapacitor from '../src/app/interactive/diagrams/MosCapacitor.js';
import NandNor from '../src/app/interactive/diagrams/NandNor.js';
import NpDoping from '../src/app/interactive/diagrams/NpDoping.js';
import RcCoupling from '../src/app/interactive/diagrams/RcCoupling.js';
import SramCell from '../src/app/interactive/diagrams/SramCell.js';
import { registeredInteractive, interactiveRegistry } from '../src/app/interactive/registry.js';
import { parseContentDirectory } from '../src/content/parse.js';
import type { ContentCatalog, ContentIndex, InteractiveDeclaration } from '../src/content/types.js';
import { createContentIndex } from '../src/content/write.js';

const declaration: InteractiveDeclaration = { instanceId:'fixture:1', documentId:'fixture', type:'fixture', attributes:{type:'fixture'}, original:{markdown:'',source:{path:'fixture.md',start:0,end:0,startLine:1,endLine:1}} };
const props={declaration,documentRevision:'r1'};
let catalog:ContentCatalog; let index:ContentIndex;
afterEach(cleanup);
beforeAll(async()=>{const parsed=await parseContentDirectory('content');if(!parsed.ok)throw new Error(JSON.stringify(parsed.diagnostics));catalog=parsed.data;index=createContentIndex(catalog);});
const group=(name:string)=>within(screen.getByRole('group',{name}));
const feedback=()=>document.querySelector<HTMLElement>('.interactive-feedback')!;

describe('RC and material concepts',()=>{
  it('separates RC response from coupling and makes larger R/C slower',()=>{render(<RcCoupling {...props}/>);expect(feedback()).toHaveTextContent('빠른 응답');fireEvent.click(group('R · 저항').getByRole('button',{name:'높음'}));fireEvent.click(group('C · 커패시턴스').getByRole('button',{name:'높음'}));expect(feedback()).toHaveTextContent('느린 응답');fireEvent.click(screen.getByRole('button',{name:'배선 Coupling'}));fireEvent.click(screen.getByRole('button',{name:'0 → 1 변화'}));expect(feedback()).toHaveTextContent('RC 충전 지연과 구분되는 capacitive coupling');});
  it('shows MOS capacitor charge, field, oxide insulation and time state',()=>{render(<MosCapacitor {...props}/>);fireEvent.click(screen.getByRole('button',{name:'HIGH'}));expect(feedback()).toHaveTextContent('전하가 재배치');fireEvent.click(screen.getByRole('button',{name:'정상 상태'}));expect(feedback()).toHaveTextContent('반대 전하가 모이고 Oxide 사이에 전기장');expect(screen.getByText(/전기적으로 절연/)).toBeInTheDocument();});
  it('compares pure, N-type and P-type while preserving neutrality',()=>{render(<NpDoping {...props}/>);expect(screen.getByText('자유 carrier가 매우 적음')).toBeInTheDocument();fireEvent.click(screen.getByRole('button',{name:'N-type'}));expect(screen.getByText('다수 carrier · Electron')).toBeInTheDocument();fireEvent.click(screen.getByRole('button',{name:'P-type'}));expect(screen.getByText('다수 carrier · Hole')).toBeInTheDocument();expect(screen.getByText(/전체 물질은 전기적으로 거의 중성/)).toBeInTheDocument();});
});

describe('combinational logic',()=>{
  it.each([
    ['NAND',0,0,1],['NAND',0,1,1],['NAND',1,0,1],['NAND',1,1,0],
    ['NOR',0,0,1],['NOR',0,1,0],['NOR',1,0,0],['NOR',1,1,0],
  ] as const)('%s %i%i gives %i and highlights its row',(mode,a,b,y)=>{render(<NandNor {...props}/>);if(mode==='NOR')fireEvent.click(screen.getByRole('button',{name:'NOR'}));if(a)fireEvent.click(group('A 선택').getByRole('button',{name:'1'}));if(b)fireEvent.click(group('B 선택').getByRole('button',{name:'1'}));expect(feedback()).toHaveTextContent(`Y=${y}`);expect(document.querySelector('tr[aria-current="true"]')).toHaveTextContent(`${a}${b}${y}`);});
  it.each([[0,0,0,0],[0,1,1,0],[1,0,1,0],[1,1,0,1]] as const)('half adder %i + %i',(a,b,sum,carry)=>{render(<HalfAdder {...props}/>);if(a)fireEvent.click(group('A 선택').getByRole('button',{name:'1'}));if(b)fireEvent.click(group('B 선택').getByRole('button',{name:'1'}));expect(feedback()).toHaveTextContent(`Carry ${carry}, Sum ${sum}`);expect(document.querySelector('tr[aria-current="true"]')).toHaveTextContent(`${a}${b}${sum}${carry}`);});
  it.each([
    [0,0,0,0,0],[0,0,1,1,0],[0,1,0,1,0],[0,1,1,0,1],
    [1,0,0,1,0],[1,0,1,0,1],[1,1,0,0,1],[1,1,1,1,1],
  ] as const)('full adder %i%i%i',(a,b,cin,sum,cout)=>{render(<FullAdder {...props}/>);if(a)fireEvent.click(group('A 선택').getByRole('button',{name:'1'}));if(b)fireEvent.click(group('B 선택').getByRole('button',{name:'1'}));if(cin)fireEvent.click(group('Cin 선택').getByRole('button',{name:'1'}));expect(feedback()).toHaveTextContent(`Sum ${sum}, Cout ${cout}`);expect(document.querySelector('tr[aria-current="true"]')).toHaveTextContent(`${a}${b}${cin}${sum}${cout}`);});
});

describe('clocked storage',()=>{
  it('keeps Q while D changes and captures D only at the clock edge',()=>{render(<FlipflopRegister {...props}/>);fireEvent.click(group('D 선택').getByRole('button',{name:'1'}));expect(feedback()).toHaveTextContent('D는 1로 바뀌었지만 Q 값 0을 유지');fireEvent.click(screen.getByRole('button',{name:'Clock ↑'}));expect(feedback()).toHaveTextContent('D=1, Q=1');});
  it('holds, writes both bits and reads without changing Q',()=>{render(<SramCell {...props}/>);expect(feedback()).toHaveTextContent('Hold: WL이 꺼져 Q=0, Q̅=1');fireEvent.click(screen.getByRole('button',{name:'Write 1'}));fireEvent.click(screen.getByRole('button',{name:'다음 단계'}));fireEvent.click(screen.getByRole('button',{name:'다음 단계'}));expect(feedback()).toHaveTextContent('Q=1, Q̅=0');fireEvent.click(screen.getByRole('button',{name:'Read'}));for(let i=0;i<4;i++)fireEvent.click(screen.getByRole('button',{name:'다음 단계'}));expect(feedback()).toHaveTextContent('Q=1, Q̅=0');expect(feedback()).toHaveTextContent('읽기는 저장 bit를 바꾸지 않습니다');fireEvent.click(screen.getByRole('button',{name:'Write 0'}));fireEvent.click(screen.getByRole('button',{name:'다음 단계'}));fireEvent.click(screen.getByRole('button',{name:'다음 단계'}));expect(feedback()).toHaveTextContent('Q=0, Q̅=1');expect(screen.getByText(/4T 유지 \+ 2T 접근 = 6T/)).toBeInTheDocument();});
});

describe('real Module 0–1 declarations',()=>{
  const docs=['m00-l01','m00-l02','m00-l03','m00-l04','m00-l05','m01-l01','m01-l02','m01-l03','m01-l04','m01-l05','m01-l06','m01-l07','m01-s-half-adder','m01-s-sram'];
  it('registers every interactive declaration in lessons and supplements',()=>{for(const id of docs){const document=catalog.documentsById[id]!;for(const block of document.body.blocks){if(block.kind==='interactive')expect(registeredInteractive(interactiveRegistry,block.value.type),`${id}:${block.value.type}`).toBeDefined();}}});
  it.each(['m00-l03','m00-l04','m00-l05','m01-l03','m01-l04','m01-l05','m01-l06','m01-l07','m01-s-half-adder','m01-s-sram'])('renders %s without an interactive fallback',async id=>{render(<MemoryRouter><ContentRenderer document={catalog.documentsById[id]!} index={index}/></MemoryRouter>);expect((await screen.findAllByText('Interactive diagram',{selector:'.placeholder-kicker'})).length).toBeGreaterThan(0);expect(screen.queryByText('인터랙티브 도식은 준비 중입니다.')).not.toBeInTheDocument();});
});
