import { useState } from 'react';
import { DiagramFrame } from '../DiagramFrame.js';
import { ProcessStepControls, type ProcessStep } from '../primitives/ProcessView.js';
import { StatusBadge } from '../primitives/StatusBadge.js';
import type { InteractiveProps } from '../types.js';

const steps = [
  { label: 'Announcement', detail: '계획이나 연구 결과가 발표된 단계입니다.' },
  { label: 'Demonstration', detail: 'prototype 또는 demo로 동작 가능성을 보인 단계입니다.' },
  { label: 'Sampling', detail: '평가용 sample을 제한된 고객에게 제공하는 단계입니다.' },
  { label: 'Qualification', detail: '고객과 제품 조건에서 신뢰성·적합성을 확인하는 단계입니다.' },
  { label: 'Production', detail: '반복 생산 체계와 품질 조건을 갖춘 단계입니다.' },
  { label: 'Shipment', detail: '완성 제품이 실제 출하된 증거가 있는 단계입니다.' },
] satisfies readonly ProcessStep[];

export default function TechnologyMaturityMap(_props: InteractiveProps) {
  const [index, setIndex] = useState(0);
  const current = steps[index]!;
  const next = steps[index + 1];
  return <DiagramFrame title="기술 성숙도와 증거" objective="가상의 증거 카드를 이동하며 현재 주장할 수 있는 단계와 아직 필요한 증거를 구분하세요."
    controls={<ProcessStepControls steps={steps} index={index} onChange={setIndex} />}
    feedback={<><StatusBadge tone="confirmed">현재 증거: {current.label}</StatusBadge><p>{current.detail}</p>{next && <p><StatusBadge tone="pending">아직 {next.label} 증거 필요</StatusBadge></p>}</>}
    takeaway="새 기술은 발표·시연·샘플·검증·양산·출하처럼 서로 다른 성숙 단계를 구분해서 읽어야 합니다.">
    <div className="maturity-track" aria-label="가상 기술 성숙도 단계">{steps.map((step, stepIndex) => <div key={step.label} className={stepIndex <= index ? 'reached' : ''}><span aria-hidden="true">{stepIndex < index ? '✓' : stepIndex === index ? '●' : '○'}</span><strong>{step.label}</strong></div>)}</div>
    <p className="model-note">교재 기준 시점의 개념 예시입니다. 실시간 업계 현황이나 특정 회사의 최신 상태를 뜻하지 않습니다.</p>
  </DiagramFrame>;
}
