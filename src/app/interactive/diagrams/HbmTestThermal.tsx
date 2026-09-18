import { useState } from 'react';
import { DiagramFrame } from '../DiagramFrame.js';
import { StructureChoices } from '../primitives/StructureView.js';
import { BondingInterface, StackDie, StackView, VerticalVia } from '../primitives/StackView.js';
import type { InteractiveProps } from '../types.js';

const modes = [{ value: 'test', label: 'Test path' }, { value: 'thermal', label: 'Thermal path' }] as const;
const defects = [{ value: 'die', label: 'Die defect' }, { value: 'bond', label: 'Bonding defect' }, { value: 'package', label: 'Package issue' }] as const;
const heatSources = [{ value: 'top', label: '위 Die' }, { value: 'middle', label: '중간 Die' }, { value: 'bottom', label: '아래 Die' }] as const;
const detection = {
  die: '개별 Die Test에서 발견할 수 있지만 검사 범위 밖 결함은 남을 수 있습니다.',
  bond: '적층·접합 뒤의 중간 검사 또는 Package Test에서 연결 문제를 확인합니다.',
  package: '외부 연결과 통합 동작은 조립 뒤 Package·Final Test에서 확인합니다.',
} as const;

export default function HbmTestThermal(_props: InteractiveProps) {
  const [mode, setMode] = useState<'test' | 'thermal'>('test');
  const [defect, setDefect] = useState<keyof typeof detection>('die');
  const [heat, setHeat] = useState<'top' | 'middle' | 'bottom'>('middle');
  const feedback = mode === 'test' ? detection[defect] : `${heatSources.find(item => item.value === heat)!.label}에서 생긴 열도 여러 Die와 접합층을 지나 냉각 구조로 빠져나가야 합니다.`;
  const heatY = heat === 'top' ? 55 : heat === 'middle' ? 115 : 175;
  return <DiagramFrame title="HBM Test · Thermal 경로" objective="적층 전후 검사와 스택 내부 열 배출 경로를 나누어 살펴보세요." controls={<div className="concept-controls"><StructureChoices label="보기" value={mode} options={modes} onChange={setMode} />{mode === 'test' ? <StructureChoices label="결함 위치" value={defect} options={defects} onChange={setDefect} /> : <StructureChoices label="열 발생 위치" value={heat} options={heatSources} onChange={setHeat} />}</div>} feedback={feedback} takeaway="HBM의 품질은 개별 Die뿐 아니라 적층·접합·최종 검사와 열 관리까지 함께 봐야 한다." onReset={() => { setMode('test'); setDefect('die'); setHeat('middle'); }}>
    <div className="concept-layout">
      {mode === 'test' ? <div className="yield-path" aria-label="HBM 검사 경로">{['Die Test · KGD', 'Stacking / Bonding', 'Intermediate Test', 'Package Test', 'Final Test'].map((step, index) => <div key={step} className={(defect === 'die' && index === 0) || (defect === 'bond' && index === 2) || (defect === 'package' && index === 3) ? 'issue' : ''}><strong>{index + 1}</strong><span>{step}</span></div>)}</div> : <StackView title="HBM 적층 열 경로" description={feedback} height={330}><StackDie y={35} label="Top DRAM Die" selected={heat === 'top'} /><BondingInterface y={91} /><StackDie y={100} label="Middle DRAM Die" selected={heat === 'middle'} /><BondingInterface y={156} /><StackDie y={165} label="Bottom DRAM Die" selected={heat === 'bottom'} /><StackDie y={225} label="Base Die" kind="base" /><VerticalVia x={130} y={35} height={236} /><circle className="heat-source" cx="342" cy={heatY} r="16" /><path className="thermal-path" d={`M342 ${heatY} C390 ${heatY} 390 245 408 285`} /><text x="330" y="310">냉각 방향</text></StackView>}
      <div className="concept-explanation"><strong>{mode === 'test' ? '검사 단계' : '열 배출 경로'}</strong><p>{feedback}</p><p>KGD도 박막화·적층·접합 뒤의 새 결함이나 열 문제를 보장하지 않습니다. 실제 fault coverage, 온도, 열저항 수치는 계산하지 않습니다.</p></div>
    </div>
  </DiagramFrame>;
}
