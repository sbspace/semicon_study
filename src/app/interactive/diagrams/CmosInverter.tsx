import { useId, useState } from 'react';

import { DiagramFrame } from '../DiagramFrame.js';
import type { InteractiveProps } from '../types.js';

type Bit = 0 | 1;

export default function CmosInverter(_props: InteractiveProps) {
  const [input, setInput] = useState<Bit>(0);
  const titleId = useId();
  const descriptionId = useId();
  const output: Bit = input === 0 ? 1 : 0;
  const pmosOn = input === 0;
  const nmosOn = input === 1;

  const controls = (
    <div className="logic-input" role="group" aria-label="입력값 선택">
      <span>INPUT</span>
      {([0, 1] as const).map(value => (
        <button key={value} type="button" aria-pressed={input === value} onClick={() => setInput(value)}>
          {value}
        </button>
      ))}
    </div>
  );
  const feedback = input === 0
    ? <>입력 0: PMOS가 켜지고 VDD가 출력에 연결됩니다. 따라서 <strong>Y = 1</strong>입니다.</>
    : <>입력 1: NMOS가 켜지고 출력이 GND에 연결됩니다. 따라서 <strong>Y = 0</strong>입니다.</>;

  return (
    <DiagramFrame
      title="CMOS Inverter"
      objective="입력에 따라 어느 트랜지스터가 켜지고 출력이 어느 rail에 연결되는지 확인하세요."
      controls={controls}
      feedback={feedback}
      takeaway="CMOS Inverter는 입력을 반전한다."
      onReset={() => setInput(0)}
    >
      <div className="inverter-layout">
        <div className="inverter-svg-wrap">
          <svg className="inverter-svg" viewBox="0 0 520 430" role="img" aria-labelledby={`${titleId} ${descriptionId}`}>
            <title id={titleId}>입력 {input}일 때 CMOS inverter 회로</title>
            <desc id={descriptionId}>PMOS는 {pmosOn ? '켜짐' : '꺼짐'}, NMOS는 {nmosOn ? '켜짐' : '꺼짐'} 상태이며 출력 Y는 {output}입니다.</desc>
            <text className="rail-label" x="260" y="30" textAnchor="middle">VDD · HIGH (1)</text>
            <line className="rail" x1="155" y1="50" x2="365" y2="50" />
            <line className={`circuit-path ${pmosOn ? 'active' : 'inactive'}`} x1="260" y1="50" x2="260" y2="108" />

            <g className={`transistor ${pmosOn ? 'on' : 'off'}`}>
              <rect x="205" y="108" width="110" height="82" rx="14" />
              <text x="260" y="140" textAnchor="middle">PMOS</text>
              <text className="state-label" x="260" y="170" textAnchor="middle">{pmosOn ? 'ON' : 'OFF'}</text>
            </g>
            <line className={`circuit-path ${pmosOn ? 'active' : 'inactive'}`} x1="260" y1="190" x2="260" y2="240" />
            <circle className="output-node" cx="260" cy="240" r="8" />
            <line className="output-wire" x1="260" y1="240" x2="420" y2="240" />
            <text className="output-label" x="430" y="231">OUTPUT Y</text>
            <text className="output-value" x="430" y="263">{output} · {output === 1 ? 'HIGH' : 'LOW'}</text>

            <line className={`circuit-path ${nmosOn ? 'active' : 'inactive'}`} x1="260" y1="240" x2="260" y2="288" />
            <g className={`transistor ${nmosOn ? 'on' : 'off'}`}>
              <rect x="205" y="288" width="110" height="82" rx="14" />
              <text x="260" y="320" textAnchor="middle">NMOS</text>
              <text className="state-label" x="260" y="350" textAnchor="middle">{nmosOn ? 'ON' : 'OFF'}</text>
            </g>
            <line className={`circuit-path ${nmosOn ? 'active' : 'inactive'}`} x1="260" y1="370" x2="260" y2="397" />
            <line className="rail" x1="220" y1="397" x2="300" y2="397" />
            <line className="rail" x1="231" y1="407" x2="289" y2="407" />
            <line className="rail" x1="244" y1="417" x2="276" y2="417" />
            <text className="rail-label" x="333" y="409">GND · LOW (0)</text>

            <line className="input-wire" x1="55" y1="149" x2="195" y2="149" />
            <line className="input-wire" x1="100" y1="149" x2="100" y2="329" />
            <line className="input-wire" x1="100" y1="329" x2="195" y2="329" />
            <text className="input-label" x="55" y="132">INPUT {input}</text>
          </svg>
          <div className="path-summary"><span>활성 도통 경로</span><strong>{input === 0 ? 'VDD → PMOS → Y' : 'Y → NMOS → GND'}</strong></div>
        </div>

        <table className="inverter-truth-table">
          <caption>Inverter 진리표</caption>
          <thead><tr><th scope="col">INPUT</th><th scope="col">OUTPUT</th></tr></thead>
          <tbody>
            {([0, 1] as const).map(value => (
              <tr key={value} aria-current={input === value ? 'true' : undefined}>
                <td>{value}</td><td>{value === 0 ? 1 : 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DiagramFrame>
  );
}
