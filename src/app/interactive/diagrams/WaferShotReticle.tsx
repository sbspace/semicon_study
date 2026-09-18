import { useState } from 'react';
import { DiagramFrame } from '../DiagramFrame.js';
import { StructureChoices, StructureView } from '../primitives/StructureView.js';
import type { InteractiveProps } from '../types.js';
const views = [
  { value:'wafer', label:'Wafer', detail:'Wafer는 여러 Shot을 반복 노광하는 실리콘 판입니다. 테두리의 실제 패턴과 수율은 이 개념도에서 다루지 않습니다.' },
  { value:'shot', label:'Shot', detail:'Shot은 노광 공정의 한 영역입니다. 예시의 한 Shot 안에는 여러 Die가 있습니다. Shot과 Die는 같은 개념이 아닙니다.' },
  { value:'die', label:'Die', detail:'Die는 나중에 개별 칩이 되는 제품 단위입니다. 한 Shot 안에 하나 이상의 Die 패턴을 배치할 수 있습니다.' },
  { value:'scribe', label:'Scribe Line', detail:'Scribe Line은 Die 사이의 절단 여유 영역입니다. 테스트 구조나 정렬 표식을 포함할 수도 있습니다.' },
  { value:'reticle', label:'Reticle', detail:'Reticle은 노광 패턴 원본입니다. 광학계를 통해 Photoresist에 패턴을 전사하며 Wafer에서 Shot 단위로 반복합니다.' },
] as const;
const shots = [{x:110,y:58},{x:190,y:58},{x:70,y:124},{x:150,y:124},{x:230,y:124},{x:110,y:190},{x:190,y:190}];
export default function WaferShotReticle(_props: InteractiveProps) {
  const [view,setView] = useState<typeof views[number]['value']>('wafer');
  const [shot,setShot] = useState(0);
  const current = views.find(item=>item.value===view)!;
  return <DiagramFrame title="Wafer · Shot · Reticle" objective="노광 공정 단위와 개별 칩 단위를 비교하고 패턴이 반복되는 관계를 확인하세요."
    controls={<div className="structure-controls"><StructureChoices label="관찰 대상" value={view} options={views} onChange={setView}/>
      <div className="structure-step"><button type="button" disabled={shot===0} onClick={()=>setShot(shot-1)}>이전 Shot</button><span>선택 Shot {shot+1}</span><button type="button" disabled={shot===shots.length-1} onClick={()=>setShot(shot+1)}>다음 Shot</button></div></div>}
    feedback={current.detail} takeaway="Reticle의 패턴은 Shot 단위로 Wafer에 반복되고, Shot과 Die는 같은 개념이 아니다."
    onReset={()=>{setView('wafer');setShot(0);}}>
    <div className="structure-layout"><div><StructureView title={`Wafer의 선택 Shot ${shot+1}`} description="Wafer에 반복된 노광 영역 중 굵은 테두리와 별표가 현재 선택 Shot을 나타냅니다.">
      <circle className="structure-outline" cx="180" cy="150" r="142"/>
      {shots.map((s,i)=><g key={i} className={`structure-shot ${i===shot?'selected':''}`}><rect x={s.x} y={s.y} width="64" height="52"/><text x={s.x+32} y={s.y+33} textAnchor="middle">{i===shot?'★':'·'}</text></g>)}
    </StructureView><p className="structure-note">선택 Shot의 위치를 옮겨 반복 노광을 관찰하세요.</p></div>
      <div><StructureView title={`${current.label} 확대 관계`} description={current.detail} height={310}>
        <text x="180" y="29" textAnchor="middle">{view==='reticle'?'Reticle 패턴 → 노광':'선택 Shot 확대'}</text>
        <rect className="structure-outline" x="20" y="56" width="320" height="220" rx="4"/>
        {view==='scribe' && <path className="structure-scribe" d="M180 60 V272 M24 166 H336"/>}
        {[{x:34,y:70},{x:194,y:70},{x:34,y:180},{x:194,y:180}].map((p,i)=><g key={i} className={`structure-block ${view==='die'?'selected':''}`}><rect x={p.x} y={p.y} width="132" height="82" rx="3"/><text x={p.x+66} y={p.y+48} textAnchor="middle">Die</text></g>)}
        <text x="180" y="300" textAnchor="middle">{view==='scribe'?'Die 사이 여유 영역':view==='reticle'?'광학계 → Wafer의 PR':'Shot ≠ Die'}</text>
      </StructureView><p className="structure-note">Die 수와 Shot 수는 관계 설명용 예시이며 장비 규격이나 실제 생산 수량이 아닙니다.</p></div></div>
    <div className="structure-explanation"><strong>{current.label}</strong><p>{current.detail}</p><p>Shot 경계는 노광 영역, Die 경계는 제품 영역, Scribe Line은 Die 사이 여유 공간입니다. Reticle 자체를 Wafer에 붙이는 과정은 아닙니다.</p></div>
  </DiagramFrame>;
}
