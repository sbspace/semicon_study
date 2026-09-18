import { useState } from 'react';
import { DiagramFrame } from '../DiagramFrame.js';
import { StructureBlock, StructureChoices, StructureView } from '../primitives/StructureView.js';
import type { InteractiveProps } from '../types.js';
const modes = [
  { value: 'signal', label: 'Signal', detail: 'Signal은 블록 사이에 데이터와 제어 정보를 전달합니다. 예: Core ↔ Cache, I/O ↔ 제어 블록.' },
  { value: 'clock', label: 'Clock', detail: 'Clock은 여러 저장 회로에 타이밍 기준을 분기해 전달합니다. 명령 하나의 완료가 아니라 상태를 저장할 시점의 기준입니다.' },
  { value: 'power', label: 'Power', detail: 'PDN은 VDD와 GND를 넓게 분배해 여러 블록에 전원을 공급합니다. 서로 분리된 두 전원망이며 데이터 전달선과 역할이 다릅니다.' },
] as const;
export default function SignalClockPdn(_props: InteractiveProps) {
  const [mode, setMode] = useState<typeof modes[number]['value']>('signal');
  const current = modes.find(item => item.value === mode)!;
  return <DiagramFrame title="Signal · Clock · Power" objective="같은 배치 위에서 세 종류 배선의 역할과 분포를 비교하세요."
    controls={<StructureChoices label="배선 역할" value={mode} options={modes} onChange={setMode}/>}
    feedback={current.detail} takeaway="칩 안의 배선은 데이터, 시간 기준, 전원 공급처럼 서로 다른 역할을 한다." onReset={() => setMode('signal')}>
    <div className="structure-layout"><StructureView title={`${current.label} 배선 개념도`} description={current.detail} height={330}>
      <rect className="structure-outline" x="12" y="12" width="336" height="306" rx="16"/>
      <text x="180" y="42" textAnchor="middle">{mode === 'signal' ? '데이터 / 제어 ↔' : mode === 'clock' ? 'Clock ↓ 타이밍 분배' : 'VDD 실선 / GND 점선'}</text>
      <StructureBlock x={45} y={90} width={105} height={58} label="Core"/><StructureBlock x={210} y={90} width={105} height={58} label="Cache"/>
      <StructureBlock x={45} y={220} width={105} height={58} label="I/O"/><StructureBlock x={210} y={220} width={105} height={58} label="제어"/>
      {mode === 'signal' && <g className="structure-path"><path d="M150 120 H210 M150 250 H210"/><text x="180" y="108" textAnchor="middle">↔</text><text x="180" y="240" textAnchor="middle">↔</text></g>}
      {mode === 'clock' && <g className="structure-clock"><path d="M180 53 V183 M98 70 H263 M98 70 V90 M263 70 V90 M98 183 H263 M98 183 V220 M263 183 V220"/><circle cx="180" cy="70" r="5"/><circle cx="180" cy="183" r="5"/></g>}
      {mode === 'power' && <g><path className="structure-path" d="M29 63 H330 M29 63 V296 H330 V63 M29 170 H330 M29 110 H45 M330 110 H315 M29 240 H45 M330 240 H315"/>
        <path className="structure-ground" d="M37 79 H323 M37 79 V306 H323 V79 M37 198 H323 M37 136 H45 M323 136 H315 M37 265 H45 M323 265 H315"/></g>}
    </StructureView><div className="structure-explanation"><strong>{current.label} 선택</strong><p>{current.detail}</p><p>{mode === 'signal' ? '정보의 출발점과 도착점을 연결합니다.' : mode === 'clock' ? '하나의 기준이 가지를 나누어 여러 목적지에 도달합니다.' : 'VDD 공급과 GND 기준/귀환을 함께 봅니다. 두 망은 서로 단락되지 않습니다.'}</p></div></div>
    <p className="structure-note">역할을 보여주는 개념 배치입니다. 실제 routing·clock tree·전원 mesh와 층 간 교차는 단순화했습니다.</p>
  </DiagramFrame>;
}
