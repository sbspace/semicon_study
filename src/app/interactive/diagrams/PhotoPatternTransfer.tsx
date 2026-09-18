import { useState } from 'react';
import { DiagramFrame } from '../DiagramFrame.js';
import { MaterialLayer, ProcessExplanation, ProcessStepControls, ProcessView, type ProcessStep } from '../primitives/ProcessView.js';
import type { InteractiveProps } from '../types.js';

const steps: readonly ProcessStep[]=[
  {label:'Film 준비',detail:'가공할 Film이 Wafer 위에 먼저 존재합니다.'},{label:'PR 도포',detail:'Film 위에 빛에 반응하는 PR을 고르게 바릅니다.'},
  {label:'노광',detail:'Mask/Reticle 패턴에 따라 PR의 선택 영역을 빛에 노출합니다.'},{label:'현상',detail:'PR의 선택 영역을 제거해 아래 Film을 드러냅니다.'},
  {label:'Film 식각',detail:'PR 패턴을 마스크로 사용해 드러난 Film을 제거합니다.'},{label:'PR 제거',detail:'역할을 마친 PR을 제거하면 Film에 전달된 패턴이 남습니다.'},
];
export default function PhotoPatternTransfer(_props: InteractiveProps){const [step,setStep]=useState(0);const s=steps[step]!;
 const patterned=step>=3, etched=step>=4, pr=step>=1&&step<5;
 return <DiagramFrame title="Photo와 패턴 전사" objective="PR 패턴을 만든 뒤 Etch가 그 모양을 Film에 전달하는 과정을 따라가세요."
 controls={<ProcessStepControls steps={steps} index={step} onChange={setStep}/>} feedback={s.detail} takeaway="Photo는 PR에 위치를 정하고, Etch는 그 패턴을 아래 Film에 실제로 전달한다." onReset={()=>setStep(0)}>
 <div className="process-layout"><ProcessView title={s.label} description={s.detail}>
  <MaterialLayer x={35} y={205} width={350} height={52} label="Wafer / 하부 구조" kind="wafer"/>
  {!etched?<MaterialLayer x={35} y={155} width={350} height={50} label="가공 대상 Film"/>:<><MaterialLayer x={35} y={155} width={125} height={50} label="Film"/><MaterialLayer x={260} y={155} width={125} height={50} label="Film"/></>}
  {pr&&(!patterned?<MaterialLayer x={35} y={115} width={350} height={40} label="Photoresist (PR)" kind="pr"/>:<><MaterialLayer x={35} y={115} width={125} height={40} label="PR" kind="pr"/><MaterialLayer x={260} y={115} width={125} height={40} label="PR" kind="pr"/></>)}
  {step===2&&<><path className="process-rays" d="M170 28 V98 M210 28 V98 M250 28 V98"/><text x="210" y="20" textAnchor="middle">노광</text><rect className="process-mask" x="125" y="58" width="170" height="18"/></>}
  {patterned&&step<4&&<text x="210" y="100" textAnchor="middle">열린 PR 영역</text>}
 </ProcessView><ProcessExplanation heading={`${step+1}. ${s.label}`}><p>{s.detail}</p><p>층 순서: PR → Film → Wafer/하부 구조</p></ProcessExplanation></div><p className="process-note">단면을 단순화한 개념도입니다. 노광은 Film을 직접 깎지 않습니다.</p>
 </DiagramFrame>}
