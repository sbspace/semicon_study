import { useState } from 'react';
import { DiagramFrame } from '../DiagramFrame.js';
import { RelativeBars } from '../primitives/ConceptView.js';
import { StructureChoices } from '../primitives/StructureView.js';
import type { InteractiveProps } from '../types.js';

export default function YieldCapacityCost(_props: InteractiveProps) {
  const [gross, setGross] = useState<'500' | '800'>('500');
  const [dieYield, setDieYield] = useState<'80' | '90'>('80');
  const [assemblyYield, setAssemblyYield] = useState<'95' | '85'>('95');
  const [capacity, setCapacity] = useState<'low' | 'high'>('low');
  const finalUnits = Math.round(Number(gross) * Number(dieYield) / 100 * Number(assemblyYield) / 100);
  return <DiagramFrame title="수율 · 생산능력 · 비용" objective="단순화한 독립 수율 예제로 최종 양품 수를 계산하고 다른 사업 조건과 구분하세요."
    controls={<div className="concept-controls"><StructureChoices label="Gross dies" value={gross} options={[{ value: '500', label: '500개' }, { value: '800', label: '800개' }]} onChange={setGross} /><StructureChoices label="Die yield" value={dieYield} options={[{ value: '80', label: '80%' }, { value: '90', label: '90%' }]} onChange={setDieYield} /><StructureChoices label="Assembly yield" value={assemblyYield} options={[{ value: '95', label: '95%' }, { value: '85', label: '85%' }]} onChange={setAssemblyYield} /><StructureChoices label="Capacity 사례" value={capacity} options={[{ value: 'low', label: '제약 있음' }, { value: 'high', label: '여유 있음' }]} onChange={setCapacity} /></div>}
    feedback={<><strong>최종 양품: {finalUnits}개</strong><p>{gross} × {dieYield}% × {assemblyYield}% = {finalUnits}. Capacity는 현재 {capacity === 'low' ? '제약이 있는' : '여유가 있는'} 별도 조건입니다.</p></>}
    takeaway="제품의 의사결정은 수율뿐 아니라 생산능력과 비용 등 여러 조건을 함께 봐야 합니다.">
    <RelativeBars items={[{ label: 'Die yield', value: Number(dieYield), detail: `${dieYield}%` }, { label: 'Assembly yield', value: Number(assemblyYield), detail: `${assemblyYield}%` }, { label: 'Capacity', value: capacity === 'high' ? 85 : 35, detail: capacity === 'high' ? '상대적으로 여유' : '상대적으로 제약' }]} />
    <p className="model-note">교육용 계산은 두 수율이 독립이라는 단순 가정입니다. 높은 수율만으로 공급량이나 비용 문제가 자동 해결되지는 않습니다.</p>
  </DiagramFrame>;
}
