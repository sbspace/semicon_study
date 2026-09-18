import { useState } from 'react';
import { DiagramFrame } from '../DiagramFrame.js';
import { StructureBlock, StructureChoices, StructureView } from '../primitives/StructureView.js';
import type { InteractiveProps } from '../types.js';
const parts = [
  { value: 'pad', label: 'Die / Pad', detail: 'Die의 아래쪽 회로면에 있는 Pad가 내부 배선을 외부 접점으로 이어줍니다.' },
  { value: 'bump', label: 'Bump', detail: 'Bump는 Die의 Pad와 Package 기판의 접점을 전기적·기계적으로 연결합니다.' },
  { value: 'package', label: 'Package', detail: 'Package의 Substrate 배선은 촘촘한 Die 접점을 보드 쪽 접점으로 펼쳐 연결합니다.' },
  { value: 'ball', label: 'Ball', detail: '아래쪽 Ball은 Package 기판과 PCB 사이의 접점입니다. Die 쪽 Bump와 위치가 다릅니다.' },
  { value: 'pcb', label: 'PCB', detail: 'PCB 배선은 Package를 다른 부품과 연결하고 전원을 전달합니다.' },
] as const;
export default function PadBumpPackagePcb(_props: InteractiveProps) {
  const [part, setPart] = useState<typeof parts[number]['value']>('pad');
  const [mode, setMode] = useState<'electric' | 'thermal'>('electric');
  const selected = parts.find(item => item.value === part)!;
  const feedback = mode === 'electric' ? `${selected.detail} 전기 연결: Die → Pad → Bump → Substrate → Ball → PCB. 신호는 양방향으로 오갈 수 있습니다.` : '열 경로 예: Die 뒷면 → 상부 방열 구조 → 주변. 열이 모두 Bump를 따라 PCB로만 나가는 것은 아닙니다.';
  return <DiagramFrame title="Die에서 PCB까지" objective="Flip Chip 예시에서 접점의 위치와 전기·열 경로를 구분해보세요."
    controls={<div className="structure-controls"><StructureChoices label="경로 종류" value={mode} options={[{value:'electric',label:'전기 연결'},{value:'thermal',label:'열 경로'}]} onChange={setMode}/>
      {mode === 'electric' && <StructureChoices label="연결 구간" value={part} options={parts} onChange={setPart}/>}</div>}
    feedback={feedback} takeaway="Die는 Pad와 Bump, Package를 거쳐 PCB와 전기적으로 연결된다."
    onReset={() => {setPart('pad');setMode('electric');}}>
    <div className="structure-layout"><StructureView title={mode === 'electric' ? `${selected.label} 전기 연결 단면` : 'Die 뒷면의 열 배출 예'} description={feedback} height={420}>
      <StructureBlock x={40} y={18} width={280} height={40} label="상부 방열 구조" selected={mode === 'thermal'}/>
      <StructureBlock x={65} y={110} width={230} height={60} label="Die · 뒷면은 위" selected={mode === 'electric' && part === 'pad'}/>
      <path className="structure-metal" d="M83 174 H107 M168 174 H192 M253 174 H277"/><text x="180" y="198" textAnchor="middle">회로면 / Pad ↓</text>
      {[95,180,265].map(x => <circle key={x} className={`structure-joint ${part === 'bump' && mode === 'electric' ? 'selected' : ''}`} cx={x} cy="218" r="9"/>)}
      <StructureBlock x={27} y={238} width={306} height={58} label="Package / Substrate" selected={part === 'package' && mode === 'electric'}/>
      {[60,140,220,300].map(x => <circle key={x} className={`structure-joint ${part === 'ball' && mode === 'electric' ? 'selected' : ''}`} cx={x} cy="322" r="13"/>)}
      <StructureBlock x={15} y={352} width={330} height={48} label="PCB" selected={part === 'pcb' && mode === 'electric'}/>
      {mode === 'electric' ? <path className="structure-path" d="M95 175 V250 H60 V352"/> : <g className="structure-heat"><path d="M180 110 V65 M167 80 L180 64 L193 80"/><text x="221" y="92">열 ↑</text></g>}
    </StructureView><div className="structure-explanation"><strong>{mode === 'electric' ? `선택 · ${selected.label}` : '전기 경로와 다른 열 경로'}</strong><p>{feedback}</p><ul><li>Pad: Die의 접점</li><li>Bump: Die ↔ Substrate</li><li>Ball: Substrate ↔ PCB</li></ul><p>Package는 전기 연결, 기계적 보호, 열 배출을 함께 담당합니다.</p></div></div>
    <p className="structure-note">회로면이 아래를 향한 Flip Chip 개념도입니다. 접점 수·크기·간격과 열 경로는 제품마다 다릅니다.</p>
  </DiagramFrame>;
}
