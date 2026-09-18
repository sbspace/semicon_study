import { useId, useState } from 'react';
import { DiagramFrame } from '../DiagramFrame.js';
import { BinaryToggle, type Bit } from '../primitives/BinaryToggle.js';
import type { InteractiveProps } from '../types.js';

type Level = 'low' | 'high';
type Mode = 'delay' | 'coupling';

export default function RcCoupling(_props: InteractiveProps) {
  const [mode, setMode] = useState<Mode>('delay');
  const [resistance, setResistance] = useState<Level>('low');
  const [capacitance, setCapacitance] = useState<Level>('low');
  const [input, setInput] = useState<Bit>(0);
  const [time, setTime] = useState(2);
  const [neighborChanges, setNeighborChanges] = useState(false);
  const titleId = useId();
  const descId = useId();
  const delayRank = (resistance === 'high' ? 1 : 0) + (capacitance === 'high' ? 1 : 0);
  const response = delayRank === 0 ? '빠른 응답' : delayRank === 1 ? '보통 응답' : '느린 응답';
  const curves = [[0, 75, 100], [0, 45, 80], [0, 25, 55]] as const;
  const charged =
    input === 1
      ? curves[delayRank]![time]!
      : time === 0
        ? 100
        : time === 1
          ? ([25, 55, 75] as const)[delayRank]
          : 0;
  const selectInput = (value: Bit) => { setInput(value); setTime(0); };
  const reset = () => { setMode('delay'); setResistance('low'); setCapacitance('low'); setInput(0); setTime(2); setNeighborChanges(false); };
  const controls = <div className="batch-controls">
    <div className="segmented-control" role="group" aria-label="현상 선택">
      <button type="button" aria-pressed={mode === 'delay'} onClick={() => setMode('delay')}>RC Delay</button>
      <button type="button" aria-pressed={mode === 'coupling'} onClick={() => setMode('coupling')}>배선 Coupling</button>
    </div>
    {mode === 'delay' ? <>
      {([['R · 저항', resistance, setResistance], ['C · 커패시턴스', capacitance, setCapacitance]] as const).map(([label, value, setter]) => <div className="parameter-choice" role="group" aria-label={label} key={label}><span>{label}</span><div><button type="button" aria-pressed={value === 'low'} onClick={() => setter('low')}>낮음</button><button type="button" aria-pressed={value === 'high'} onClick={() => setter('high')}>높음</button></div></div>)}
      <BinaryToggle label="INPUT" value={input} onChange={selectInput} />
      <button className="step-button" type="button" disabled={time === 2} onClick={() => setTime(value => Math.min(2, value + 1))}>다음 시간 단계</button>
    </> : <div className="segmented-control" role="group" aria-label="인접 배선 상태"><button type="button" aria-pressed={!neighborChanges} onClick={() => setNeighborChanges(false)}>변화 없음</button><button type="button" aria-pressed={neighborChanges} onClick={() => setNeighborChanges(true)}>0 → 1 변화</button></div>}
  </div>;
  const feedback = mode === 'delay'
    ? `${response}: R과 C가 함께 클수록 capacitor 충전·방전이 천천히 진행됩니다. 현재 상대 충전 상태는 ${charged}%입니다.`
    : neighborChanges ? '인접 배선의 변화가 전기장으로 victim 배선에 순간적인 영향을 줄 수 있습니다. 이것은 RC 충전 지연과 구분되는 capacitive coupling입니다.' : '인접 배선에 변화가 없어 victim 배선에 순간적인 coupling 영향이 없습니다.';
  return <DiagramFrame title="RC Delay와 배선 Coupling" objective="저항·커패시턴스의 신호 지연과 인접 배선 간섭을 구분해보세요." controls={controls} feedback={feedback} takeaway="저항과 커패시턴스가 함께 있으면 신호 변화에 시간이 걸릴 수 있다." onReset={reset}>
    <div className="concept-panel">
      <svg viewBox="0 0 640 250" role="img" aria-labelledby={`${titleId} ${descId}`}><title id={titleId}>{mode === 'delay' ? `RC ${response}` : '인접 배선 coupling'}</title><desc id={descId}>{feedback}</desc>
        {mode === 'delay' ? <><path className="concept-wire" d="M40 110 H140"/><rect className="concept-node" x="140" y="75" width="110" height="70" rx="12"/><text x="195" y="105" textAnchor="middle">R · {resistance === 'high' ? '높음' : '낮음'}</text><text x="195" y="128" textAnchor="middle">전류 제한</text><path className="concept-wire" d="M250 110 H365"/><line className="capacitor-plate" x1="365" y1="60" x2="365" y2="160"/><line className="capacitor-plate" x1="395" y1="60" x2="395" y2="160"/><path className="concept-wire" d="M395 110 H590"/><text x="380" y="190" textAnchor="middle">C · {capacitance === 'high' ? '높음' : '낮음'}</text><text className="concept-value" x="520" y="80">충전 {charged}%</text></> : <><path className={`coupling-wire ${neighborChanges ? 'active' : ''}`} d="M60 75 H580"/><text x="70" y="55">Aggressor · {neighborChanges ? '0 → 1' : '변화 없음'}</text><path className="coupling-field" d="M180 95 V155 M280 95 V155 M380 95 V155 M480 95 V155"/><path className={`coupling-wire victim ${neighborChanges ? 'affected' : ''}`} d="M60 175 H580"/><text x="70" y="215">Victim · {neighborChanges ? '순간적 영향' : '안정'}</text></>}
      </svg>
      <p className="model-note">상대 수준만 표현한 교육용 정성 모델이며 실제 Ω, F, 시간값이 아닙니다.</p>
    </div>
  </DiagramFrame>;
}
