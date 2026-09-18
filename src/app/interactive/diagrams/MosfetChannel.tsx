import { useId, useState } from 'react';

import { DiagramFrame } from '../DiagramFrame.js';
import { MosCrossSection } from '../primitives/MosCrossSection.js';
import type { InteractiveProps } from '../types.js';

const EDUCATIONAL_THRESHOLD = 60;

export default function MosfetChannel(_props: InteractiveProps) {
  const [gateLevel, setGateLevel] = useState(0);
  const inputId = useId();
  const on = gateLevel >= EDUCATIONAL_THRESHOLD;
  const feedback = on
    ? 'Gate 전기장에 의해 channel이 형성되어 Source와 Drain 사이가 도통합니다. Gate 전극은 Oxide로 절연되어 있습니다.'
    : 'Gate 수준이 낮아 channel이 형성되지 않았습니다. Gate는 Oxide를 통과하는 전류가 아니라 전기장으로 channel을 제어합니다.';

  const controls = (
    <div className="gate-level-control">
      <div className="gate-level-heading">
        <label htmlFor={inputId}>교육용 Gate 수준</label>
        <output htmlFor={inputId}>{gateLevel}%</output>
      </div>
      <input
        id={inputId}
        type="range"
        min="0"
        max="100"
        step="10"
        value={gateLevel}
        aria-valuetext={`교육용 Gate 수준 ${gateLevel}%`}
        onChange={event => setGateLevel(Number(event.currentTarget.value))}
      />
      <div className="gate-level-scale"><span>낮음 · OFF</span><span>교육용 ON 기준 {EDUCATIONAL_THRESHOLD}%</span><span>높음 · ON</span></div>
    </div>
  );

  return (
    <DiagramFrame
      title="MOSFET Channel"
      objective="Gate 수준을 바꾸며 channel이 어떻게 형성되는지 확인해보세요."
      controls={controls}
      feedback={feedback}
      feedbackLive={false}
      takeaway="Gate는 절연막을 사이에 둔 전기장으로 Source–Drain channel을 제어한다."
      onReset={() => setGateLevel(0)}
    >
      <div className="mosfet-channel-layout">
        <MosCrossSection
          kind="nmos"
          on={on}
          gateState={`정규화 수준 ${gateLevel}%`}
          sourceContext="전류 경로의 한쪽 단자"
          description={`${gateLevel}%의 교육용 Gate 수준입니다. Channel은 ${on ? '형성되어 Source와 Drain 사이가 ON' : '형성되지 않아 Source와 Drain 사이가 OFF'} 상태입니다.`}
        />
        <div className="mosfet-channel-result" aria-label="MOSFET 현재 상태">
          <span>Gate → 전기장 → Channel → Source–Drain</span>
          <strong>{on ? 'Channel 형성 · ON' : 'Channel 없음 · OFF'}</strong>
          <small>교육용 정규화 Gate 수준이며 실제 MOSFET의 Vth 값이 아닙니다.</small>
        </div>
      </div>
    </DiagramFrame>
  );
}
