import { useId, type ReactNode } from 'react';

import type { VisualGraphicProps } from '../types.js';

function Mos({ x, y, label, kind, children }: {
  x: number;
  y: number;
  label: string;
  kind: 'PMOS' | 'NMOS' | 'ACCESS';
  children?: ReactNode;
}) {
  return (
    <g className={`sram-mos ${kind.toLowerCase()}`} data-mos-transistor={label}>
      <rect x={x - 34} y={y - 25} width="68" height="50" rx="8" />
      <line x1={x} y1={y - 42} x2={x} y2={y - 25} />
      <line x1={x} y1={y + 25} x2={x} y2={y + 42} />
      <text x={x} y={y - 3} textAnchor="middle">{label}</text>
      <text x={x} y={y + 15} textAnchor="middle">{kind}</text>
      {children}
    </g>
  );
}

export default function SramSixTransistors(_props: VisualGraphicProps) {
  const titleId = useId();
  const descriptionId = useId();
  return (
    <svg
      className="visual-svg sram-six-graphic"
      viewBox="0 0 760 430"
      role="img"
      aria-labelledby={`${titleId} ${descriptionId}`}
    >
      <title id={titleId}>여섯 transistor로 구성된 6T SRAM cell 회로</title>
      <desc id={descriptionId}>
        P1, N1과 P2, N2가 교차 연결된 inverter 두 개를 만들고, Access L과 Access R이 Word Line으로 제어되어 Q와 Q bar를 Bit Line BL과 BLB에 연결한다.
      </desc>

      <line className="sram-rail supply" x1="205" y1="40" x2="555" y2="40" />
      <text x="380" y="27" textAnchor="middle">VDD</text>
      <line className="sram-rail ground" x1="205" y1="385" x2="555" y2="385" />
      <text x="380" y="414" textAnchor="middle">GND</text>

      <line className="bit-line" x1="72" y1="65" x2="72" y2="345" />
      <text x="72" y="48" textAnchor="middle">BL</text>
      <line className="bit-line" x1="688" y1="65" x2="688" y2="345" />
      <text x="688" y="48" textAnchor="middle">BLB</text>

      <Mos x={260} y={105} label="P1" kind="PMOS" />
      <Mos x={260} y={315} label="N1" kind="NMOS" />
      <Mos x={500} y={105} label="P2" kind="PMOS" />
      <Mos x={500} y={315} label="N2" kind="NMOS" />
      <Mos x={142} y={210} label="Access L" kind="ACCESS" />
      <Mos x={618} y={210} label="Access R" kind="ACCESS" />

      <path className="sram-node-wire" d="M260 40 V63 M260 147 V315 M260 357 V385" />
      <path className="sram-node-wire" d="M500 40 V63 M500 147 V315 M500 357 V385" />
      <path className="sram-node-wire" d="M72 210 H108 M176 210 H260" />
      <path className="sram-node-wire" d="M500 210 H584 M652 210 H688" />

      <circle className="storage-node" cx="260" cy="210" r="8" />
      <text className="storage-label" x="278" y="198">Q</text>
      <circle className="storage-node" cx="500" cy="210" r="8" />
      <text className="storage-label" x="518" y="198">Q̅ (Q bar)</text>

      <path className="feedback-wire" d="M260 210 C310 210 315 175 350 175 H440 V105 H466" />
      <path className="feedback-wire" d="M260 210 C310 210 315 245 350 245 H440 V315 H466" />
      <path className="feedback-wire" d="M500 210 C450 210 445 160 410 160 H320 V105 H294" />
      <path className="feedback-wire" d="M500 210 C450 210 445 260 410 260 H320 V315 H294" />
      <text className="feedback-label" x="380" y="146" textAnchor="middle">교차 feedback</text>

      <line className="word-line" x1="95" y1="275" x2="665" y2="275" />
      <line className="word-gate" x1="142" y1="252" x2="142" y2="275" />
      <line className="word-gate" x1="618" y1="252" x2="618" y2="275" />
      <text x="380" y="298" textAnchor="middle">WL (Word Line)</text>

      <g className="sram-legend" aria-label="Transistor 구성">
        <text x="80" y="405">Inverter 1: P1 + N1</text>
        <text x="287" y="405">Inverter 2: P2 + N2</text>
        <text x="515" y="405">Access: L + R</text>
      </g>
    </svg>
  );
}
