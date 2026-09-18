import { useState } from 'react';
import { DiagramFrame } from '../DiagramFrame.js';
import { StructureChoices } from '../primitives/StructureView.js';
import { BondingInterface, StackDie, StackView, VerticalVia } from '../primitives/StackView.js';
import type { InteractiveProps } from '../types.js';

const parts = [
  { value: 'dram', label: 'DRAM Die' }, { value: 'tsv', label: 'TSV' }, { value: 'base', label: 'Base Die' },
  { value: 'interposer', label: 'Interposer' }, { value: 'gpu', label: 'GPU side' },
] as const;
const descriptions = {
  dram: 'DRAM Die는 데이터를 저장하며 여러 장이 수직으로 쌓입니다.',
  tsv: 'TSV는 스택 내부 Silicon을 관통해 위아래 Die 사이의 수직 경로를 만듭니다.',
  base: 'Base Die는 스택 아래에서 외부 연결과 인터페이스 등의 기능을 담당합니다.',
  interposer: 'Interposer 등의 패키지 배선은 HBM 스택 밖에서 옆의 GPU로 연결합니다.',
  gpu: '대표적인 2.5D 구성에서 GPU는 HBM 아래가 아니라 옆에 놓입니다.',
} as const;

export default function HbmStack(_props: InteractiveProps) {
  const [part, setPart] = useState<keyof typeof descriptions>('dram');
  const detail = descriptions[part];
  return <DiagramFrame title="HBM Stack 단면" objective="스택 내부 수직 연결과 스택 밖 GPU 연결을 구분하세요." controls={<StructureChoices label="구조 선택" value={part} options={parts} onChange={setPart} />} feedback={detail} takeaway="HBM은 DRAM Die를 적층하고 TSV·Base Die·패키지 연결을 통해 옆의 연산 칩과 연결한다." onReset={() => setPart('dram')}>
    <div className="concept-layout">
      <StackView title="HBM과 GPU 대표 단면" description={detail} height={360}>
        {[35, 87, 139].map((y, index) => <StackDie key={y} y={y} label={`DRAM Die ${3 - index}`} selected={part === 'dram'} />)}
        <BondingInterface y={83} /><BondingInterface y={135} /><BondingInterface y={187} />
        <StackDie y={194} label="Base Die" kind="base" selected={part === 'base'} />
        <VerticalVia x={130} y={35} height={205} selected={part === 'tsv'} />
        <rect className={`stack-interposer${part === 'interposer' ? ' selected' : ''}`} x="45" y="260" width="350" height="45" rx="6" />
        <text x="220" y="288" textAnchor="middle">Interposer / package connection</text>
        <rect className={`stack-gpu${part === 'gpu' ? ' selected' : ''}`} x="325" y="150" width="90" height="92" rx="8" />
        <text x="370" y="190" textAnchor="middle">GPU</text><text x="370" y="212" textAnchor="middle">side</text>
        <path className="stack-data-path" d="M130 30 V220 Q130 282 205 282 H370 V242" />
      </StackView>
      <div className="concept-explanation"><strong>{parts.find(item => item.value === part)!.label}</strong><p>{detail}</p><p>Base Die를 GPU의 전체 memory controller와 동일시하지 않으며 실제 Die 두께와 bump pitch는 표현하지 않습니다.</p></div>
    </div>
  </DiagramFrame>;
}
