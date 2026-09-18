import { useState } from 'react';
import { DiagramFrame } from '../DiagramFrame.js';
import { ProcessStepControls, type ProcessStep } from '../primitives/ProcessView.js';
import type { InteractiveProps } from '../types.js';

const steps = [
  { label: 'Architecture / Design', detail: '요구사항과 구조, RTL·회로 설계를 만듭니다.', output: '설계 명세와 설계 데이터', role: '설계팀' },
  { label: 'Implementation', detail: '논리 합성, 배치·배선으로 제조 가능한 레이아웃을 만듭니다.', output: '구현된 레이아웃', role: '구현팀·EDA' },
  { label: 'Verification', detail: '기능과 규칙, 연결, 타이밍 등을 반복 확인합니다.', output: '검증 결과와 수정 사항', role: '설계·검증팀' },
  { label: 'Tape-out', detail: '검증한 설계 데이터를 마스크 제작 단계로 넘깁니다.', output: '제조용 설계 데이터', role: '설계사와 제조 파트너' },
  { label: 'Mask / Manufacturing', detail: '마스크와 웨이퍼 공정으로 다이를 제조합니다.', output: '가공된 웨이퍼', role: 'Foundry·IDM' },
  { label: 'Wafer Test', detail: '웨이퍼 상태에서 전기적 동작과 결함을 선별합니다.', output: '검사된 다이 정보', role: '시험 조직' },
  { label: 'Packaging / Final Test', detail: '다이를 조립하고 패키지 상태에서 최종 검증합니다.', output: '검사된 패키지 제품', role: 'OSAT·제품 조직' },
] satisfies readonly (ProcessStep & { output: string; role: string })[];

export default function DesignToSilicon(_props: InteractiveProps) {
  const [index, setIndex] = useState(0);
  const step = steps[index]!;
  return <DiagramFrame title="설계에서 실리콘까지" objective="단계를 이동하며 산출물과 담당 역할, 다음 전달 지점을 확인하세요."
    controls={<ProcessStepControls steps={steps} index={index} onChange={setIndex} />}
    feedback={<><strong>{step.label}</strong><p>{step.detail}</p></>}
    takeaway="Tape-out은 설계 데이터를 제조로 넘기는 중요한 경계이며, 이후에도 제조·검사·패키징 단계가 이어집니다.">
    <div className="workflow-detail"><div><span>주요 산출물</span><strong>{step.output}</strong></div><div><span>주요 역할</span><strong>{step.role}</strong></div><div><span>다음 단계</span><strong>{steps[index + 1]?.label ?? '제품 검증과 피드백'}</strong></div></div>
    <p className="model-note">MPW도 비용을 나눌 수 있는 제조 방식일 뿐, 설계와 제조 후 검증이 생략되지는 않습니다.</p>
  </DiagramFrame>;
}
