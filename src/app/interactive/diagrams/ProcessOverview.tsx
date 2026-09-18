import { useState } from 'react';
import { DiagramFrame } from '../DiagramFrame.js';
import { StructureChoices } from '../primitives/StructureView.js';
import { ProcessExplanation, ProcessView } from '../primitives/ProcessView.js';
import type { InteractiveProps } from '../types.js';

const goals = [
  {value:'pattern',label:'위치 정하기',work:'Photo',change:'PR에 선택 영역을 드러내는 패턴을 만듭니다.'},
  {value:'remove',label:'재료 제거',work:'Etch',change:'마스크가 열어 둔 곳의 목표 재료를 선택적으로 제거합니다.'},
  {value:'add',label:'막 쌓기',work:'Deposition',change:'필요한 절연막·도전막 등 Film을 표면에 형성합니다.'},
  {value:'dope',label:'전기 성질 바꾸기',work:'Implant + 열처리',change:'도펀트를 넣고 회복·활성화 조건을 관리합니다.'},
  {value:'flat',label:'평탄화',work:'CMP + Clean',change:'튀어나온 재료를 평탄화하고 잔류물을 제거합니다.'},
] as const;
export default function ProcessOverview(_props: InteractiveProps) {
  const [goal,setGoal]=useState<typeof goals[number]['value']>('pattern'); const item=goals.find(x=>x.value===goal)!;
  return <DiagramFrame title="반도체 공정 전체 지도" objective="만들 구조의 목표를 고르고 필요한 작업과 구조 변화를 연결해보세요."
    controls={<StructureChoices label="구조 목표" value={goal} options={goals} onChange={setGoal}/>} feedback={`${item.work}: ${item.change}`}
    takeaway="공정은 구조와 층의 요구에 따라 선택·조합·반복되며, 여덟 공정을 한 번씩 지나는 고정 순서가 아니다." onReset={()=>setGoal('pattern')}>
    <div className="process-layout"><ProcessView title={`${item.label} 공정 지도`} description={`${item.work}. ${item.change}`}>
      <path className="process-loop" d="M50 140 C50 55 155 35 210 80 C270 28 370 60 370 140 C370 225 270 245 210 200 C145 246 50 220 50 140 Z"/>
      {goals.map((x,i)=><g key={x.value} className={`process-node ${x.value===goal?'selected':''}`} transform={`translate(${75+(i%3)*130} ${85+Math.floor(i/3)*100})`}><circle r="35"/><text textAnchor="middle" y="5">{x.work.split(' ')[0]}</text></g>)}
    </ProcessView><ProcessExplanation heading={item.label}><p>{item.change}</p><p>소자(FEOL), 접점(MOL), 배선(BEOL)의 여러 층에서 이런 작업이 필요에 따라 다시 등장합니다.</p></ProcessExplanation></div>
  </DiagramFrame>;
}
