import { useState } from 'react';
import { DiagramFrame } from '../DiagramFrame.js';
import { StructureChoices } from '../primitives/StructureView.js';
import type { InteractiveProps } from '../types.js';

type Field = 'height' | 'capacity' | 'rate' | 'bandwidth' | 'status';
const options = [{ value: 'height', label: '12H' }, { value: 'capacity', label: '36 GB' }, { value: 'rate', label: '8 Gb/s' }, { value: 'bandwidth', label: '1 TB/s' }, { value: 'status', label: 'Sampling' }] as const;
const facts: Record<Field, { meaning: string; contrast: string; verify: string }> = {
  height: { meaning: 'H는 적층 높이 또는 DRAM die 수 맥락을 나타냅니다.', contrast: 'GB 용량과 같은 단위가 아닙니다.', verify: 'base die 포함 여부와 제품의 표기 정의' },
  capacity: { meaning: 'GB는 저장 가능한 byte 단위 용량입니다.', contrast: '전송 속도나 대역폭이 아닙니다.', verify: '스택당인지 시스템 합계인지' },
  rate: { meaning: 'Gb/s는 보통 pin 하나의 초당 bit 전송률 맥락입니다.', contrast: 'GB/s 또는 TB/s 전체 대역폭과 구분합니다.', verify: 'pin 기준과 신호 조건' },
  bandwidth: { meaning: 'TB/s는 폭과 pin 속도를 함께 반영한 이론 대역폭 항목입니다.', contrast: '용량이나 지연 시간을 뜻하지 않습니다.', verify: '이론값인지 실효값인지와 적용 범위' },
  status: { meaning: 'Sampling은 평가용 제품을 제공하는 성숙도 상태입니다.', contrast: '양산 또는 대량 출하와 같은 뜻이 아닙니다.', verify: 'qualification, production, shipment 증거' },
};
export default function HbmSpecReader(_props: InteractiveProps) {
  const [field, setField] = useState<Field>('height'); const fact = facts[field];
  return <DiagramFrame title="HBM 사양 읽기" objective="가상의 사양 카드에서 단위와 상태 필드를 골라 서로 다른 의미를 구분하세요."
    controls={<StructureChoices label="사양 필드 선택" value={field} options={options} onChange={setField} />}
    feedback={<><strong>{options.find(item => item.value === field)!.label}</strong><p>{fact.meaning} {fact.contrast}</p></>}
    takeaway="HBM 사양은 층수·용량·pin 속도·대역폭·출하 상태를 서로 다른 항목으로 읽어야 합니다.">
    <div className="spec-card" aria-label="교재 기준 가상 HBM 사양 예시">{options.map(item => <button key={item.value} type="button" aria-pressed={field === item.value} onClick={() => setField(item.value)}><span>{item.value}</span><strong>{item.label}</strong></button>)}</div>
    <p className="model-note">추가 확인 조건: {fact.verify}. 이 카드는 특정 vendor의 최신 제품 사양이 아닙니다.</p>
  </DiagramFrame>;
}
