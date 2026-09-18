import { useState } from 'react';

import { DiagramFrame } from '../DiagramFrame.js';
import { MosCrossSection } from '../primitives/MosCrossSection.js';
import type { InteractiveProps } from '../types.js';

type Bit = 0 | 1;

export default function NmosPmosChannel(_props: InteractiveProps) {
  const [input, setInput] = useState<Bit>(0);
  const nmosOn = input === 1;
  const pmosOn = input === 0;
  const inputLabel = input === 0 ? 'LOW (0)' : 'HIGH (1)';

  const controls = (
    <div className="complementary-input" role="group" aria-label="공통 INPUT 선택">
      <span>두 Gate에 같은 INPUT</span>
      <div>
        <button type="button" aria-pressed={input === 0} onClick={() => setInput(0)}>0 · LOW</button>
        <button type="button" aria-pressed={input === 1} onClick={() => setInput(1)}>1 · HIGH</button>
      </div>
    </div>
  );

  return (
    <DiagramFrame
      title="NMOS vs PMOS"
      objective="같은 입력에서 NMOS와 PMOS가 어떻게 반대로 동작하는지 확인해보세요."
      controls={controls}
      feedback={input === 0
        ? 'INPUT LOW: NMOS는 OFF이고 PMOS는 ON입니다. PMOS는 VDD 쪽 Source보다 Gate가 낮을 때 켜집니다.'
        : 'INPUT HIGH: NMOS는 ON이고 PMOS는 OFF입니다. NMOS는 GND 쪽 Source보다 Gate가 높을 때 켜집니다.'}
      takeaway="NMOS와 PMOS는 같은 입력에 상보적으로 켜지고 꺼진다."
      onReset={() => setInput(0)}
    >
      <div className="nmos-pmos-layout">
        <p className="shared-input-note">같은 INPUT: <strong>{inputLabel}</strong></p>
        <div className="mos-device-comparison">
          <MosCrossSection
            kind="nmos"
            on={nmosOn}
            gateState={`INPUT ${inputLabel}`}
            sourceContext="GND 쪽 Source"
            description={`NMOS는 공통 INPUT ${inputLabel}에서 ${nmosOn ? 'ON' : 'OFF'}입니다. Source는 GND 쪽 기준입니다.`}
          />
          <MosCrossSection
            kind="pmos"
            on={pmosOn}
            gateState={`INPUT ${inputLabel}`}
            sourceContext="VDD 쪽 Source"
            description={`PMOS는 공통 INPUT ${inputLabel}에서 ${pmosOn ? 'ON' : 'OFF'}입니다. Source는 VDD 쪽 기준입니다.`}
          />
        </div>
        <p className="source-reference-note">일반적인 CMOS 연결 기준: PMOS Source → VDD · NMOS Source → GND</p>
      </div>
    </DiagramFrame>
  );
}
