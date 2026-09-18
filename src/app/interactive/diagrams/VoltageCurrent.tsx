import { useId, useState } from 'react';

import { DiagramFrame } from '../DiagramFrame.js';
import type { InteractiveProps } from '../types.js';

type VoltageLevel = 0 | 1 | 2;

const voltageLabels: Readonly<Record<VoltageLevel, string>> = {
  0: '0 · 전압 없음',
  1: '낮은 전압',
  2: '높은 전압',
};

function stateFeedback(voltageLevel: VoltageLevel, closed: boolean) {
  if (voltageLevel === 0) {
    return closed
      ? '전압차가 없으므로 회로가 닫혀 있어도 전류는 흐르지 않습니다.'
      : '전압차가 없고 경로도 열려 있어 전류는 흐르지 않습니다.';
  }
  if (!closed) return '전압차는 있지만 경로가 끊어져 있어 전류는 흐르지 않습니다.';
  return voltageLevel === 1
    ? '경로가 닫혀 작은 상대 전류가 흐릅니다. 같은 저항 조건에서는 전압이 커질수록 전류도 커집니다.'
    : '경로가 닫혀 더 큰 상대 전류가 흐릅니다. 같은 저항 조건에서 낮은 전압일 때보다 큽니다.';
}

export default function VoltageCurrent(_props: InteractiveProps) {
  const [voltageLevel, setVoltageLevel] = useState<VoltageLevel>(1);
  const [closed, setClosed] = useState(false);
  const titleId = useId();
  const descriptionId = useId();
  const arrowId = useId();
  const currentFlows = closed && voltageLevel > 0;
  const relativeCurrent = currentFlows ? (voltageLevel === 1 ? '작음' : '큼') : '없음';
  const feedback = stateFeedback(voltageLevel, closed);

  const reset = () => {
    setVoltageLevel(1);
    setClosed(false);
  };

  const controls = (
    <div className="voltage-current-controls">
      <div className="parameter-choice" role="group" aria-label="전압 수준">
        <span>전압 수준</span>
        <div>
          {([0, 1, 2] as const).map(value => (
            <button
              key={value}
              type="button"
              aria-pressed={voltageLevel === value}
              onClick={() => setVoltageLevel(value)}
            >
              {voltageLabels[value]}
            </button>
          ))}
        </div>
      </div>
      <div className="parameter-choice" role="group" aria-label="회로 상태">
        <span>회로 상태</span>
        <div>
          <button type="button" aria-pressed={!closed} onClick={() => setClosed(false)}>회로 열림</button>
          <button type="button" aria-pressed={closed} onClick={() => setClosed(true)}>회로 닫힘</button>
        </div>
      </div>
    </div>
  );

  return (
    <DiagramFrame
      title="전압과 전류"
      objective="전압차와 닫힌 경로가 어떻게 전류 흐름을 만드는지 확인해보세요."
      controls={controls}
      feedback={feedback}
      takeaway="전압은 전류를 흐르게 할 수 있는 두 점 사이의 차이이고, 전류는 닫힌 경로에서 실제로 흐르는 전하의 흐름이다."
      onReset={reset}
    >
      <div className="voltage-current-layout">
        <svg className="voltage-current-svg" viewBox="0 0 620 350" role="img" aria-labelledby={`${titleId} ${descriptionId}`}>
          <title id={titleId}>{voltageLabels[voltageLevel]}, {closed ? '회로 닫힘' : '회로 열림'}</title>
          <desc id={descriptionId}>{feedback} 전압은 전원 양단의 차이로, 전류는 경로를 따르는 관습적 방향으로 표시합니다.</desc>
          <defs>
            <marker id={arrowId} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" />
            </marker>
          </defs>

          <path className={`vc-wire ${currentFlows ? 'active' : ''}`} d="M105 139 V75 H245" />
          <path className={`vc-wire ${currentFlows ? 'active' : ''}`} d="M315 75 H500 V275 H105 V199" />

          <g className="vc-source">
            <line x1="80" y1="139" x2="130" y2="139" />
            <line x1="91" y1="199" x2="119" y2="199" />
            <text x="54" y="145">+</text>
            <text x="55" y="205">−</text>
            <text x="105" y="235" textAnchor="middle">전압원</text>
          </g>

          <g className={`vc-switch ${closed ? 'closed' : 'open'}`}>
            <circle cx="255" cy="75" r="7" />
            <circle cx="305" cy="75" r="7" />
            <line x1="255" y1="75" x2="303" y2={closed ? 75 : 47} />
            <text x="280" y="34" textAnchor="middle">{closed ? '닫힘' : '열림'}</text>
          </g>

          <g className="vc-load">
            <path d="M500 112 l-18 12 36 20-36 20 36 20-36 20 18 12" />
            <text x="535" y="169">부하</text>
            <text x="535" y="190">저항 일정</text>
          </g>

          <g className="vc-voltage-span">
            <path d="M152 129 H183 M152 129 V211 M152 211 H183" />
            <text x="192" y="163">Voltage</text>
            <text x="192" y="184">두 점 사이의 차이</text>
            <text x="192" y="205">수준 {voltageLevel}</text>
          </g>

          {currentFlows ? (
            <g className="vc-current-direction">
              <path d="M350 75 H448" markerEnd={`url(#${arrowId})`} />
              <text x="399" y="58" textAnchor="middle">전류 흐름</text>
              <text x="399" y="316" textAnchor="middle">관습적 전류 방향: + → −</text>
            </g>
          ) : (
            <text className="vc-no-current" x="400" y="58" textAnchor="middle">전류 없음</text>
          )}
        </svg>

        <div className="voltage-current-results" aria-label="현재 회로 결과">
          <div><span>Voltage · 전압</span><strong>{voltageLevel === 0 ? '전압차 없음' : `${voltageLabels[voltageLevel]} 있음`}</strong><small>전원 양단 두 점 사이</small></div>
          <div><span>Circuit · 경로</span><strong>{closed ? '회로 닫힘' : '회로 열림'}</strong><small>{closed ? '연속된 경로' : '스위치에서 끊김'}</small></div>
          <div><span>Current · 전류</span><strong>{currentFlows ? '전류 흐름' : '전류 없음'}</strong><small>상대 전류: {relativeCurrent}</small></div>
        </div>
        <p className="voltage-current-model-note">교육용 정성 모델 · 저항이 일정할 때 I ∝ V</p>
      </div>
    </DiagramFrame>
  );
}
