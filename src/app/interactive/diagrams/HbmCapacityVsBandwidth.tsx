import { useState } from 'react';
import { DiagramFrame } from '../DiagramFrame.js';
import { RelativeBars } from '../primitives/ConceptView.js';
import { StructureChoices } from '../primitives/StructureView.js';
import type { InteractiveProps } from '../types.js';

const heights = [{ value: '8', label: '8H' }, { value: '12', label: '12H' }, { value: '16', label: '16H' }] as const;
const densities = [{ value: '16', label: '16 Gb/Die' }, { value: '24', label: '24 Gb/Die' }] as const;
const widths = [{ value: '512', label: '512 bit' }, { value: '1024', label: '1,024 bit' }] as const;
const rates = [{ value: '4', label: '4 Gb/s' }, { value: '8', label: '8 Gb/s' }] as const;

export default function HbmCapacityVsBandwidth(_props: InteractiveProps) {
  const [height, setHeight] = useState<'8' | '12' | '16'>('8');
  const [density, setDensity] = useState<'16' | '24'>('24');
  const [width, setWidth] = useState<'512' | '1024'>('1024');
  const [rate, setRate] = useState<'4' | '8'>('4');
  const capacity = Number(height) * Number(density) / 8;
  const bandwidth = Number(width) * Number(rate) / 8;
  const feedback = `${height}H의 DRAM 용량은 ${density} Gb × ${height} ÷ 8 = ${capacity} GB입니다. 외부 대역폭은 별도로 ${width} × ${rate} ÷ 8 = ${bandwidth.toLocaleString()} GB/s입니다.`;
  return <DiagramFrame title="HBM 용량과 대역폭" objective="DRAM 적층 수와 외부 데이터 통로를 서로 다른 식으로 계산하세요." controls={<div className="concept-controls"><StructureChoices label="DRAM stack" value={height} options={heights} onChange={setHeight} /><StructureChoices label="Die density" value={density} options={densities} onChange={setDensity} /><StructureChoices label="Data width" value={width} options={widths} onChange={setWidth} /><StructureChoices label="Per-pin rate" value={rate} options={rates} onChange={setRate} /></div>} feedback={feedback} takeaway="HBM의 용량과 대역폭은 관련은 있지만 같은 값이 아니며 서로 다른 변수로 결정된다." onReset={() => { setHeight('8'); setDensity('24'); setWidth('1024'); setRate('4'); }}>
    <div className="concept-layout"><RelativeBars items={[{ label: 'Capacity', value: Math.min(100, capacity * 2), detail: `${capacity} GB` }, { label: 'Bandwidth', value: Math.min(100, bandwidth / 10), detail: `${bandwidth.toLocaleString()} GB/s` }]} /><div className="concept-explanation"><strong>두 개의 독립 계산</strong><p>{feedback}</p><p>Base Die는 DRAM 데이터 용량에 포함하지 않습니다. 적층 수를 외부 대역폭 식에 다시 곱하지 않습니다.</p></div></div>
  </DiagramFrame>;
}
