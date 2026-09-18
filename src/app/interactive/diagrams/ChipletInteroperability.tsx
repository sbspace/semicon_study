import { useState } from 'react';
import { DiagramFrame } from '../DiagramFrame.js';
import { StatusBadge, type StatusTone } from '../primitives/StatusBadge.js';
import { StructureChoices } from '../primitives/StructureView.js';
import type { InteractiveProps } from '../types.js';

type Layer = 'physical' | 'electrical' | 'protocol' | 'functional' | 'packaging' | 'thermal' | 'validation';
const options = [{ value: 'physical', label: 'Physical' }, { value: 'electrical', label: 'Electrical' }, { value: 'protocol', label: 'Protocol' }, { value: 'functional', label: 'Functional' }, { value: 'packaging', label: 'Packaging' }, { value: 'thermal', label: 'Thermal' }, { value: 'validation', label: 'Validation / Test' }] as const;
const checks: Record<Layer, { tone: StatusTone; label: string; detail: string }> = {
  physical: { tone: 'confirmed', label: '확인됨', detail: '가상 A/B chiplet의 bump pitch와 외형 조건이 일치합니다.' },
  electrical: { tone: 'confirmed', label: '확인됨', detail: '전압과 신호 전기 조건이 명시된 범위에서 일치합니다.' },
  protocol: { tone: 'mismatch', label: '불일치', detail: '지원하는 protocol version과 필수 option이 서로 다릅니다.' },
  functional: { tone: 'pending', label: '검증 필요', detail: '같은 protocol을 쓰더라도 기능 option의 상호 동작은 아직 확인하지 않았습니다.' },
  packaging: { tone: 'confirmed', label: '확인됨', detail: '가상 substrate와 조립 공정의 치수 조건은 맞습니다.' },
  thermal: { tone: 'pending', label: '검증 필요', detail: '함께 동작할 때의 열 밀도와 냉각 경로는 아직 확인하지 않았습니다.' },
  validation: { tone: 'pending', label: '검증 필요', detail: '조립 후 test coverage와 실제 workload 검증이 남아 있습니다.' },
};
export default function ChipletInteroperability(_props: InteractiveProps) {
  const [layer, setLayer] = useState<Layer>('physical'); const item = checks[layer];
  return <DiagramFrame title="Chiplet 상호운용성" objective="가상 Chiplet A와 B의 호환 조건을 층별로 확인하세요."
    controls={<StructureChoices label="호환성 계층" value={layer} options={options} onChange={setLayer} />}
    feedback={<><StatusBadge tone={item.tone}>{item.label}</StatusBadge><p>{item.detail}</p></>}
    takeaway="Chiplet interoperability는 물리 연결뿐 아니라 전기·프로토콜·기능·패키징·열·검증까지 여러 층을 함께 확인해야 합니다.">
    <div className="compatibility-list" aria-label="가상 Chiplet A와 B 호환 조건">{options.map(option => { const check = checks[option.value]; return <button type="button" key={option.value} aria-pressed={layer === option.value} onClick={() => setLayer(option.value)}><strong>{option.label}</strong><StatusBadge tone={check.tone}>{check.label}</StatusBadge></button>; })}</div>
    <p className="model-note">층별 상태를 단순 합산한 호환 점수는 제공하지 않습니다. 확인된 항목 하나가 전체 제품의 동작을 보증하지 않습니다.</p>
  </DiagramFrame>;
}
