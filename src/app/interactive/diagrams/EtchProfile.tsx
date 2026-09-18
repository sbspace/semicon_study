import { useState } from 'react';
import { DiagramFrame } from '../DiagramFrame.js'; import { StructureChoices } from '../primitives/StructureView.js';
import { ProcessExplanation, ProcessView } from '../primitives/ProcessView.js'; import type { InteractiveProps } from '../types.js';
const profiles=[{value:'isotropic',label:'등방성 대표 사례'},{value:'directional',label:'방향성 대표 사례'}] as const;
const selectivities=[{value:'high',label:'선택비 높음'},{value:'low',label:'선택비 낮음'}] as const;
export default function EtchProfile(_props:InteractiveProps){const [profile,setProfile]=useState<'isotropic'|'directional'>('directional');const [selectivity,setSelectivity]=useState<'high'|'low'>('high');
 const undercut=profile==='isotropic'; const feedback=`${undercut?'옆 방향 제거와 마스크 아래 Undercut이 보이는':'아래 방향 제거가 두드러지는'} 정성 사례입니다. ${selectivity==='high'?'보호할 Mask 손실은 상대적으로 작습니다.':'목표 Film과 함께 Mask 손실도 커질 수 있습니다.'}`;
 return <DiagramFrame title="식각 형상과 선택비" objective="대표 형상과 선택비를 바꾸며 목표 재료와 마스크의 변화를 비교하세요."
 controls={<div className="process-controls"><StructureChoices label="식각 형상" value={profile} options={profiles} onChange={setProfile}/><StructureChoices label="선택비" value={selectivity} options={selectivities} onChange={setSelectivity}/></div>} feedback={feedback} takeaway="방향성과 선택비는 원하는 곳을 원하는 형상으로 제거하면서 보호할 재료를 남기는 핵심 조건이다." onReset={()=>{setProfile('directional');setSelectivity('high')}}>
 <div className="process-layout"><ProcessView title="식각 후 단면" description={feedback}>
  <rect className="process-film" x="35" y="125" width="350" height="105"/><path className="process-opening" d={undercut?'M165 125 Q135 170 155 230 H265 Q285 170 255 125 Z':'M165 125 V230 H255 V125 Z'}/>
  <rect className={`process-mask-piece ${selectivity==='low'?'worn':''}`} x="35" y={selectivity==='low'?105:90} width="130" height={selectivity==='low'?20:35}/><rect className={`process-mask-piece ${selectivity==='low'?'worn':''}`} x="255" y={selectivity==='low'?105:90} width="130" height={selectivity==='low'?20:35}/>
  <text x="210" y="255" textAnchor="middle">Film의 제거 단면</text>
 </ProcessView><ProcessExplanation heading={profile==='isotropic'?'옆과 아래로 제거':'아래 방향 제거 강조'}><p>{feedback}</p><p>Wet/Dry라는 이름만으로 실제 형상을 절대적으로 단정하지 않습니다.</p></ProcessExplanation></div>
 </DiagramFrame>}
