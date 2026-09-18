import { useState } from 'react'; import { DiagramFrame } from '../DiagramFrame.js'; import { StructureChoices } from '../primitives/StructureView.js'; import { ProcessExplanation, ProcessView } from '../primitives/ProcessView.js'; import type { InteractiveProps } from '../types.js';
const levels=[{value:'under',label:'연마 부족'},{value:'proper',label:'적정 평탄화'},{value:'over',label:'과도 연마'}] as const;
export default function Cmp(_props:InteractiveProps){const [level,setLevel]=useState<'under'|'proper'|'over'>('proper');const feedback=level==='under'?'표면의 돌출 금속이 남아 다음 층 형성에 불리합니다.':level==='proper'?'화학 작용과 기계적 연마를 함께 이용해 목표 높이까지 평탄화했습니다.':'지나친 제거로 금속 중앙의 Dishing과 주변 절연막의 Erosion이 생길 수 있습니다.';
return <DiagramFrame title="CMP 평탄화" objective="연마 정도를 바꾸며 잔류 돌출과 적정 평탄화, 과도 제거를 비교하세요." controls={<StructureChoices label="연마 정도" value={level} options={levels} onChange={setLevel}/>} feedback={feedback} takeaway="CMP는 화학·기계 작용으로 표면을 평탄화하며, 부족하거나 과도한 제거도 결함 원인이 된다." onReset={()=>setLevel('proper')}>
<div className="process-layout"><ProcessView title="CMP 후 단면" description={feedback}>
 <rect className="cmp-oxide" x="35" y="130" width="350" height="115"/>
 <path className={`cmp-metal ${level}`} d={level==='under'?'M105 90 H315 V205 H105 Z':level==='proper'?'M105 130 H315 V205 H105 Z':'M105 130 Q210 170 315 130 V205 H105 Z'}/>
 {level==='under'&&<text x="210" y="72" textAnchor="middle">남은 돌출</text>}{level==='over'&&<><text x="210" y="112" textAnchor="middle">Dishing</text><path className="cmp-erosion" d="M35 130 Q70 148 105 130 M315 130 Q350 148 385 130"/></>}
 <g className="cmp-actions"><text x="65" y="35">화학 작용</text><text x="280" y="35">기계적 연마</text><path d="M130 30 H260"/></g>
</ProcessView><ProcessExplanation heading={levels.find(x=>x.value===level)!.label}><p>{feedback}</p><p>평탄화 뒤에도 Slurry·Particle 잔류물을 없애기 위한 Clean이 이어질 수 있습니다.</p></ProcessExplanation></div>
</DiagramFrame>}
