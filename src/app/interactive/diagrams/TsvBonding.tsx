import { useState } from 'react';
import { DiagramFrame } from '../DiagramFrame.js';
import { StructureChoices } from '../primitives/StructureView.js';
import { BondingInterface, StackDie, StackView, VerticalVia } from '../primitives/StackView.js';
import type { InteractiveProps } from '../types.js';

const options = [
  { value: 'tsv', label: 'TSV' },
  { value: 'bonding', label: 'Die-to-Die 접합' },
  { value: 'beol', label: 'BEOL Via' },
] as const;

const details = {
  tsv: 'TSV는 Silicon Die의 두께 방향을 관통해 앞뒤를 잇는 전기 통로입니다.',
  bonding: '접합면의 Microbump 또는 직접 접점은 서로 다른 Die의 경계를 연결합니다.',
  beol: 'BEOL Via는 한 Die 안의 금속 배선층 사이를 잇고 Silicon 전체를 관통하지 않습니다.',
} as const;

export default function TsvBonding(_props: InteractiveProps) {
  const [part, setPart] = useState<keyof typeof details>('tsv');
  return <DiagramFrame
    title="TSV와 Die 접합"
    objective="수직 연결의 위치를 골라 TSV·BEOL Via·Die 접합면을 구분하세요."
    controls={<StructureChoices label="연결 요소" value={part} options={options} onChange={setPart} />}
    feedback={details[part]}
    takeaway="3D 적층에서는 Die 내부를 관통하는 TSV와 Die 사이의 접합 구조를 함께 연결해야 한다."
    onReset={() => setPart('tsv')}
  >
    <div className="concept-layout">
      <StackView title="적층 Die 연결 단면" description={details[part]}>
        <text x="24" y="40">Top</text>
        <StackDie y={48} label="Top Die · Silicon" kind="silicon" selected={part === 'tsv'} />
        <BondingInterface y={110} selected={part === 'bonding'} />
        <StackDie y={126} label="Bottom Die · Silicon" kind="silicon" selected={part === 'tsv'} />
        <rect className={`beol-layer${part === 'beol' ? ' selected' : ''}`} x="92" y="188" width="220" height="55" rx="5" />
        <text x="202" y="220" textAnchor="middle">BEOL metal layers</text>
        <VerticalVia x={140} y={48} height={124} selected={part === 'tsv'} />
        <VerticalVia x={260} y={194} height={38} selected={part === 'beol'} label="Via" />
        <path className="stack-data-path" d="M140 35 V172 H202 V267 H370" />
        <text x="320" y="290">연결 경로</text>
      </StackView>
      <div className="concept-explanation">
        <strong>{options.find(option => option.value === part)!.label}</strong>
        <p>{details[part]}</p>
        <p>TSV pitch, Die 두께, 정렬 오차는 실제 수치로 모델링하지 않은 개념 단면입니다.</p>
      </div>
    </div>
  </DiagramFrame>;
}
