import { useState } from 'react';
import { DiagramFrame } from '../DiagramFrame.js';
import { StructureChoices } from '../primitives/StructureView.js';
import { ConceptView } from '../primitives/ConceptView.js';
import type { InteractiveProps } from '../types.js';

const widths = [{ value: '512', label: '512 bit' }, { value: '1024', label: '1,024 bit' }] as const;
const rates = [{ value: '4', label: '4 Gb/s' }, { value: '8', label: '8 Gb/s' }] as const;

export default function HbmBandwidth(_props: InteractiveProps) {
  const [width, setWidth] = useState<'512' | '1024'>('512');
  const [rate, setRate] = useState<'4' | '8'>('4');
  const bandwidth = Number(width) * Number(rate) / 8;
  const feedback = `${width} bit × ${rate} Gb/s ÷ 8 = 이론 ${bandwidth.toLocaleString()} GB/s입니다. 8 bit를 1 byte로 바꾸기 위해 8로 나눕니다.`;
  return <DiagramFrame
    title="HBM 이론 대역폭"
    objective="데이터 폭과 연결당 전송률을 바꾸며 bit/s를 byte/s로 환산하세요."
    controls={<div className="concept-controls"><StructureChoices label="Data width" value={width} options={widths} onChange={setWidth} /><StructureChoices label="Per-pin rate" value={rate} options={rates} onChange={setRate} /></div>}
    feedback={feedback}
    takeaway="HBM은 많은 데이터 연결을 병렬로 사용해 넓은 데이터 통로를 만든다."
    onReset={() => { setWidth('512'); setRate('4'); }}
  >
    <div className="concept-layout">
      <ConceptView title="HBM 병렬 데이터 선" description={feedback} height={250}>
        {Array.from({ length: width === '512' ? 8 : 14 }, (_, index) => <line className="hbm-data-line" key={index} x1="45" y1={35 + index * 12} x2="395" y2={35 + index * 12} />)}
        <text x="220" y="225" textAnchor="middle">{width}개의 데이터 연결을 간략화한 선</text>
      </ConceptView>
      <div className="concept-explanation"><strong>이론 최대 {bandwidth.toLocaleString()} GB/s</strong><p>{feedback}</p><p>대역폭은 시간당 이동량이며 첫 데이터가 도착하기까지의 latency와는 다른 기준입니다. 특정 HBM 제품 사양이 아닌 교육용 예제입니다.</p></div>
    </div>
  </DiagramFrame>;
}
