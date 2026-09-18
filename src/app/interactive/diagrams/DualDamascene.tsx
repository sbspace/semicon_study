import { useState } from 'react'; import { DiagramFrame } from '../DiagramFrame.js'; import { ProcessExplanation, ProcessStepControls, ProcessView, type ProcessStep } from '../primitives/ProcessView.js'; import type { InteractiveProps } from '../types.js';
const steps:readonly ProcessStep[]=[{label:'아래 배선',detail:'아래 금속 배선 위에 다음 연결을 준비합니다.'},{label:'절연막',detail:'배선을 둘러쌀 절연막을 형성합니다.'},{label:'Trench · Via 식각',detail:'절연막에 윗선 홈과 아래선까지 닿는 Via 공간을 만듭니다.'},{label:'Barrier / Seed',detail:'구리 확산을 막고 채움이 시작될 얇은 층을 개념적으로 표시합니다.'},{label:'Cu 채움',detail:'Trench와 Via를 구리로 채우며 표면 위에도 과잉 금속이 남습니다.'},{label:'CMP',detail:'표면의 불필요한 Cu를 제거해 절연막 속 Line과 Via만 남깁니다.'}];
export default function DualDamascene(_props:InteractiveProps){const [step,setStep]=useState(0);const s=steps[step]!;return <DiagramFrame title="Dual Damascene" objective="절연막의 Line과 Via 공간을 만들고 Cu를 채운 뒤 평탄화하는 흐름을 따라가세요." controls={<ProcessStepControls steps={steps} index={step} onChange={setStep}/>} feedback={s.detail} takeaway="구리 다마신은 절연막에 배선 공간을 먼저 만들고 Cu를 채운 뒤 표면의 과잉 금속을 CMP로 제거한다." onReset={()=>setStep(0)}>
<div className="process-layout"><ProcessView title={s.label} description={s.detail}>
 <rect className="damascene-dielectric" x="35" y="65" width="350" height="180"/><rect className="damascene-metal" x="145" y="215" width="130" height="30"/>
 {step>=2&&<path className="damascene-opening" d="M90 65 H330 V120 H235 V215 H185 V120 H90 Z"/>}
 {step===3&&<path className="damascene-barrier" d="M90 65 V120 H185 V215 H235 V120 H330 V65"/>}
 {step>=4&&<><path className="damascene-copper" d="M90 65 H330 V120 H235 V215 H185 V120 H90 Z"/>{step===4&&<rect className="damascene-copper" x="35" y="35" width="350" height="35"/>}</>}
 <text x="210" y="270" textAnchor="middle">절연막 속 Line + Via</text>
</ProcessView><ProcessExplanation heading={`${step+1}. ${s.label}`}><p>{s.detail}</p><p>{step<5?'다음 단계에서 구조가 이어집니다.':'표면은 평탄해지고 절연막 속 연결만 남습니다.'}</p></ProcessExplanation></div><p className="process-note">실제 재료와 세부 순서를 단순화한 개념 단면입니다.</p>
</DiagramFrame>}
