import { useId } from 'react';

import type { VisualGraphicProps } from '../types.js';

export default function DffTiming(_props: VisualGraphicProps) {
  const titleId = useId();
  const descriptionId = useId();
  return (
    <svg
      className="visual-svg dff-timing-graphic"
      viewBox="0 0 760 350"
      role="img"
      aria-labelledby={`${titleId} ${descriptionId}`}
    >
      <title id={titleId}>D Flip-Flop의 D, Clock, Q timing diagram</title>
      <desc id={descriptionId}>
        Clock 상승 edge 두 곳에서 D가 각각 1과 0으로 sampling된다. 첫 edge 뒤 D가 중간에 0으로 바뀌어도 Q는 다음 상승 edge까지 1을 유지한다.
      </desc>

      <g className="visual-grid" aria-hidden="true">
        {[130, 230, 330, 430, 530, 630].map(x => <line key={x} x1={x} y1="42" x2={x} y2="300" />)}
        <line x1="105" y1="94" x2="700" y2="94" />
        <line x1="105" y1="184" x2="700" y2="184" />
        <line x1="105" y1="274" x2="700" y2="274" />
      </g>

      <g className="wave-labels">
        <text x="42" y="80">D</text>
        <text x="28" y="170">CLK</text>
        <text x="42" y="260">Q</text>
      </g>
      <g className="logic-level-labels" aria-hidden="true">
        <text x="82" y="61">1</text><text x="82" y="101">0</text>
        <text x="82" y="151">1</text><text x="82" y="191">0</text>
        <text x="82" y="241">1</text><text x="82" y="281">0</text>
      </g>

      <path className="timing-wave data-wave" d="M105 94 H110 V54 H250 V94 H490 V54 H700" />
      <path className="timing-wave clock-wave" d="M105 184 H130 V144 H180 V184 H330 V144 H380 V184 H700" />
      <path className="timing-wave output-wave" d="M105 274 H130 V234 H330 V274 H700" />

      <g className="sampling-edge">
        <line x1="130" y1="35" x2="130" y2="300" />
        <path d="M121 48 L130 36 L139 48" />
        <text x="145" y="33">상승 edge: D=1 저장</text>
      </g>
      <g className="sampling-edge">
        <line x1="330" y1="35" x2="330" y2="300" />
        <path d="M321 48 L330 36 L339 48" />
        <text x="345" y="33">상승 edge: D=0 저장</text>
      </g>

      <path className="hold-bracket" d="M205 310 V322 H305 V310" />
      <text className="hold-label" x="255" y="342" textAnchor="middle">D가 바뀌어도 Q=1 유지</text>
      <text className="time-label" x="700" y="320" textAnchor="end">시간 →</text>
    </svg>
  );
}
