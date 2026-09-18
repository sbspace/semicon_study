// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ContentRenderer } from '../src/app/ContentRenderer.js';
import ProcessOverview from '../src/app/interactive/diagrams/ProcessOverview.js';
import PhotoPatternTransfer from '../src/app/interactive/diagrams/PhotoPatternTransfer.js';
import EtchProfile from '../src/app/interactive/diagrams/EtchProfile.js';
import DepositionConformality from '../src/app/interactive/diagrams/DepositionConformality.js';
import DualDamascene from '../src/app/interactive/diagrams/DualDamascene.js';
import Cmp from '../src/app/interactive/diagrams/Cmp.js';
import ImplantProfile from '../src/app/interactive/diagrams/ImplantProfile.js';
import ThermalProcess from '../src/app/interactive/diagrams/ThermalProcess.js';
import Clean from '../src/app/interactive/diagrams/Clean.js';
import ProcessIntegrationReview from '../src/app/interactive/diagrams/ProcessIntegrationReview.js';
import { interactiveRegistry, registeredInteractive } from '../src/app/interactive/registry.js';
import { parseContentDirectory } from '../src/content/parse.js'; import { createContentIndex } from '../src/content/write.js';
import type { ContentCatalog, ContentIndex, InteractiveDeclaration } from '../src/content/types.js';

const declaration:InteractiveDeclaration={instanceId:'m3:1',documentId:'m03-l01',type:'process-overview',attributes:{type:'process-overview'},original:{markdown:'',source:{path:'fixture.md',start:0,end:0,startLine:1,endLine:1}}};
const props={declaration,documentRevision:'r1'}; const feedback=()=>document.querySelector('.interactive-feedback')!;
const choose=(name:string)=>fireEvent.click(screen.getByRole('radio',{name})); afterEach(cleanup);

describe('Module 3 process interactions',()=>{
 it('maps structural goals to repeatable process work',()=>{render(<ProcessOverview {...props}/>);choose('막 쌓기');expect(feedback()).toHaveTextContent('Deposition');choose('전기 성질 바꾸기');expect(feedback()).toHaveTextContent('활성화');});
 it('separates PR patterning from Film transfer across every photo step',()=>{render(<PhotoPatternTransfer {...props}/>);expect(feedback()).toHaveTextContent('Film이 Wafer 위');for(let i=0;i<3;i++)fireEvent.click(screen.getByRole('button',{name:'다음 단계'}));expect(feedback()).toHaveTextContent('Film을 드러냅니다');fireEvent.click(screen.getByRole('button',{name:'Film 식각'}));expect(feedback()).toHaveTextContent('Film을 제거');fireEvent.click(screen.getByRole('button',{name:'초기화'}));expect(screen.getByText(/1 \/ 6/)).toBeInTheDocument();});
 it('compares directional removal and mask selectivity without wet/dry absolutes',()=>{render(<EtchProfile {...props}/>);choose('등방성 대표 사례');expect(feedback()).toHaveTextContent('Undercut');choose('선택비 낮음');expect(feedback()).toHaveTextContent('Mask 손실');expect(screen.getByText(/Wet\/Dry/)).toBeInTheDocument();});
 it('compares qualitative conformality and states the ALD cycle boundary',()=>{render(<DepositionConformality {...props}/>);choose('ALD');expect(feedback()).toHaveTextContent('높은 Conformality');expect(screen.getByText(/정확히 원자 한 층/)).toBeInTheDocument();choose('평탄면');expect(feedback()).toHaveTextContent('평탄면');});
 it('builds line and via spaces, fills copper and finishes with CMP',()=>{render(<DualDamascene {...props}/>);fireEvent.click(screen.getByRole('button',{name:'Trench · Via 식각'}));expect(feedback()).toHaveTextContent('Via 공간');fireEvent.click(screen.getByRole('button',{name:'Cu 채움'}));expect(feedback()).toHaveTextContent('과잉 금속');fireEvent.click(screen.getByRole('button',{name:'CMP'}));expect(feedback()).toHaveTextContent('Line과 Via');});
 it('shows under, proper and over CMP outcomes',()=>{render(<Cmp {...props}/>);choose('연마 부족');expect(feedback()).toHaveTextContent('돌출 금속');choose('과도 연마');expect(feedback()).toHaveTextContent('Dishing');expect(feedback()).toHaveTextContent('Erosion');});
 it('keeps implant energy, dose, mask and activation conceptually separate',()=>{render(<ImplantProfile {...props}/>);const high=screen.getAllByRole('radio',{name:'높음'});fireEvent.click(high[0]!);expect(feedback()).toHaveTextContent('깊은 쪽');fireEvent.click(high[1]!);expect(feedback()).toHaveTextContent('상대적으로 많음');choose('전체 노출');expect(feedback()).toHaveTextContent('전체가 노출');expect(screen.getByText(/별도 Anneal/)).toBeInTheDocument();});
 it('distinguishes thermal purposes and warns against always-more heat',()=>{render(<ThermalProcess {...props}/>);choose('확산');choose('높은 열 이력 사례');expect(feedback()).toHaveTextContent('더 넓게 퍼진');choose('산화막 성장');expect(feedback()).toHaveTextContent('산화막');expect(screen.getByText(/언제나 더 좋은/)).toBeInTheDocument();});
 it('balances contaminant removal with structure preservation',()=>{render(<Clean {...props}/>);choose('Metal contamination');choose('부족');expect(feedback()).toHaveTextContent('일부가 남아');choose('과도');expect(feedback()).toHaveTextContent('표면까지 손상');expect(screen.getByText(/Etch는 구조/)).toBeInTheDocument();});
 it('changes the integration sequence with each structure goal',()=>{render(<ProcessIntegrationReview {...props}/>);choose('선택 도핑 영역');expect(feedback()).toHaveTextContent('Photo');fireEvent.click(screen.getByRole('button',{name:'도펀트 주입'}));expect(feedback()).toHaveTextContent('Energy와 Dose');choose('금속 배선 · Via');fireEvent.click(screen.getByRole('button',{name:'CMP · Clean'}));expect(feedback()).toHaveTextContent('잔류물');});
});

describe('real Module 3 slots',()=>{let catalog:ContentCatalog;let index:ContentIndex;beforeAll(async()=>{const parsed=await parseContentDirectory('content');if(!parsed.ok)throw new Error(JSON.stringify(parsed.diagnostics));catalog=parsed.data;index=createContentIndex(catalog)});
 it.each(['m03-l01','m03-l02','m03-l03','m03-l04','m03-l05','m03-l06','m03-l07','m03-l08','m03-l09','m03-review'])('renders the registered slot in %s',async id=>{const document=catalog.documentsById[id]!;const blocks=document.body.blocks.filter(b=>b.kind==='interactive');expect(blocks).toHaveLength(1);expect(registeredInteractive(interactiveRegistry,blocks[0]!.value.type)).toBeDefined();const view=render(<MemoryRouter><ContentRenderer document={document} index={index}/></MemoryRouter>);await waitFor(()=>expect(view.container.querySelectorAll('.interactive-diagram')).toHaveLength(1));expect(view.container.querySelector('.interactive-placeholder')).toBeNull();});
});
