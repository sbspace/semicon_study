import { useState } from 'react';
import { DiagramFrame } from '../DiagramFrame.js';
import { RelativeBars } from '../primitives/ConceptView.js';
import { StructureChoices } from '../primitives/StructureView.js';
import type { InteractiveProps } from '../types.js';

const rates = [{ value: '99', label: '99%' }, { value: '95', label: '95%' }] as const;
const assemblyRates = [{ value: '98', label: '98%' }, { value: '90', label: '90%' }] as const;
const thermalOptions = [{ value: 'normal', label: '열 조건 정상' }, { value: 'issue', label: '열 문제 있음' }] as const;

export default function PackageYieldPath(_props: InteractiveProps) {
  const [dieRate, setDieRate] = useState<'99' | '95'>('99');
  const [assemblyRate, setAssemblyRate] = useState<'98' | '90'>('98');
  const [thermal, setThermal] = useState<'normal' | 'issue'>('normal');
  const diePair = (Number(dieRate) / 100) ** 2;
  const finalRate = diePair * Number(assemblyRate) / 100;
  const diePairPercent = (Math.round((diePair * 100 + 1e-9) * 100) / 100).toFixed(2);
  const finalPercent = (Math.round((finalRate * 100 + 1e-9) * 100) / 100).toFixed(2);
  const feedback = `두 Die가 모두 정상이고 조립도 성공할 교육용 독립 가정 결과는 ${finalPercent}%입니다. ${thermal === 'issue' ? '전기 검사 통과 뒤에도 열 문제를 별도로 확인해야 합니다.' : '최종 Package Test로 조립 후 동작을 다시 확인합니다.'}`;
  return <DiagramFrame
    title="Package 수율 경로"
    objective="Die 선별부터 조립·최종 검사·열 조건까지 손실이 생길 수 있는 단계를 확인하세요."
    controls={<div className="concept-controls">
      <StructureChoices label="Die 한 개의 양품 가정" value={dieRate} options={rates} onChange={setDieRate} />
      <StructureChoices label="Assembly 성공 가정" value={assemblyRate} options={assemblyRates} onChange={setAssemblyRate} />
      <StructureChoices label="사용 조건" value={thermal} options={thermalOptions} onChange={setThermal} />
    </div>}
    feedback={feedback}
    takeaway="Package 수율은 Die 선별뿐 아니라 적층·접합·검사·열의 여러 단계에 함께 영향을 받는다."
    onReset={() => { setDieRate('99'); setAssemblyRate('98'); setThermal('normal'); }}
  >
    <div className="concept-layout">
      <div className="yield-path" aria-label="Package 검사 단계">
        {['Wafer Test', 'Known Good Die', 'Assembly', 'Package Test', 'Final Good Package'].map((step, index) => <div key={step} className={thermal === 'issue' && index === 4 ? 'issue' : ''}>
          <strong>{index + 1}</strong><span>{step}</span>
        </div>)}
      </div>
      <div className="concept-explanation">
        <strong>독립 가정 계산</strong>
        <p>{dieRate}% × {dieRate}% × {assemblyRate}% = <b>{finalPercent}%</b></p>
        <p>KGD는 조립 전 검사 범위에서 양품이라는 뜻이며 Package 성공을 보장하지 않습니다.</p>
        <RelativeBars items={[{ label: 'Die pair', value: diePair * 100, detail: `${diePairPercent}%` }, { label: 'Assembly 포함', value: finalRate * 100, detail: `${finalPercent}%` }]} />
      </div>
    </div>
  </DiagramFrame>;
}
