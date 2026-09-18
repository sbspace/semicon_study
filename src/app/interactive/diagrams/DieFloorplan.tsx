import { useState } from 'react';
import { DiagramFrame } from '../DiagramFrame.js';
import { StructureBlock, StructureChoices, StructureView } from '../primitives/StructureView.js';
import type { InteractiveProps } from '../types.js';

const blocks = [
  { value: 'core', label: 'Core', role: '명령을 해석하고 계산하는 회로 영역입니다.', neighbor: 'Core ↔ Cache: 계산에 필요한 명령과 데이터를 주고받습니다.' },
  { value: 'cache', label: 'Cache', role: '자주 쓰는 명령과 데이터를 가까이 저장합니다.', neighbor: 'Cache ↔ Core · 메모리 제어: 계산 회로와 메모리 쪽을 연결합니다.' },
  { value: 'io', label: 'I/O', role: '칩 안과 밖 사이의 신호를 주고받습니다.', neighbor: 'I/O ↔ 제어 블록: 외부 장치와 내부 기능 사이에 데이터를 전달합니다.' },
  { value: 'control', label: '제어 블록', role: '메모리 접근과 블록 사이의 동작을 조정하는 기능의 예입니다.', neighbor: '제어 블록 ↔ Cache · I/O: 메모리와 외부 연결을 조정합니다.' },
] as const;
type Selection = typeof blocks[number]['value'];
export default function DieFloorplan(_props: InteractiveProps) {
  const [selected, setSelected] = useState<Selection>('core');
  const [connections, setConnections] = useState(false);
  const block = blocks.find(item => item.value === selected)!;
  return <DiagramFrame title="Die Floorplan" objective="기능별 영역을 선택하며 칩의 평면 배치와 연결을 살펴보세요."
    controls={<div className="structure-controls"><StructureChoices label="기능 블록" value={selected} options={blocks} onChange={setSelected}/>
      <button className="structure-toggle" type="button" aria-pressed={connections} onClick={() => setConnections(!connections)}>연결 보기</button></div>}
    feedback={`${block.label}: ${block.role} ${connections ? block.neighbor : '연결 보기를 켜면 대표적인 이웃 경로를 확인할 수 있습니다.'}`}
    takeaway="Die 안에서는 기능별 회로가 영역을 이루고 서로 연결된다."
    onReset={() => { setSelected('core'); setConnections(false); }}>
    <div className="structure-layout"><StructureView title={`${block.label} 선택된 Die 평면도`} description={`${block.role} ${connections ? block.neighbor : '연결 경로 숨김'}`}>
      <rect className="structure-outline" x="12" y="12" width="336" height="276" rx="16"/>
      <text x="28" y="40">Die · 위에서 본 배치</text>
      {connections && <g className="structure-path"><path d="M155 90 H205 M265 120 V188 M145 219 H215"/><text x="180" y="79" textAnchor="middle">↔</text></g>}
      <StructureBlock x={35} y={60} width={120} height={60} label="Core" selected={selected === 'core'}/>
      <StructureBlock x={205} y={60} width={120} height={60} label="Cache" selected={selected === 'cache'}/>
      <StructureBlock x={35} y={188} width={110} height={65} label="I/O" selected={selected === 'io'}/>
      <StructureBlock x={215} y={188} width={110} height={65} label="제어" selected={selected === 'control'}/>
    </StructureView><div className="structure-explanation"><strong>선택 영역 · {block.label}</strong><p>{block.role}</p><p>{block.neighbor}</p><p>Floorplan은 물리적 배치 관점입니다. 블록 안에 더 작은 회로가 있으며 긴 배선은 이동 지연과 설계 부담에 영향을 줍니다.</p></div></div>
    <p className="structure-note">기능과 연결 관계를 위한 개념도입니다. 실제 제품의 배치·면적 비율을 나타내지 않습니다.</p>
  </DiagramFrame>;
}
