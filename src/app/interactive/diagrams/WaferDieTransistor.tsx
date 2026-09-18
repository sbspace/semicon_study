import { useId, useState } from 'react';

import { DiagramFrame } from '../DiagramFrame.js';
import type { InteractiveProps } from '../types.js';

const levels = ['wafer', 'die', 'transistor'] as const;
type Level = typeof levels[number];

const labels: Record<Level, string> = {
  wafer: 'Wafer',
  die: 'Die',
  transistor: 'Transistor',
};

const feedback: Record<Level, string> = {
  wafer: '한 장의 Wafer 위에 같은 설계의 Die가 여러 개 반복되어 있습니다.',
  die: 'Die 하나에는 기능 Block과 Cell이 모여 있고, 그 안에 매우 많은 Transistor가 있습니다.',
  transistor: 'Die 안을 계속 확대하면 Gate, Source, Drain을 가진 Transistor 같은 소자에 도달합니다.',
};

function WaferView({ clipId }: { clipId: string }) {
  const dies = Array.from({ length: 49 }, (_, index) => ({
    index,
    x: 91 + (index % 7) * 48,
    y: 46 + Math.floor(index / 7) * 43,
  }));
  return (
    <g>
      <circle className="hierarchy-wafer" cx="260" cy="190" r="166" />
      <g clipPath={`url(#${clipId})`}>
        {dies.map(die => (
          <rect
            key={die.index}
            className={`hierarchy-die-tile ${die.index === 24 ? 'selected' : ''}`}
            x={die.x} y={die.y} width="38" height="33" rx="3"
          />
        ))}
      </g>
      <path className="hierarchy-notch" d="M246 355 L260 341 L274 355" />
      <line className="hierarchy-callout" x1="279" y1="206" x2="414" y2="122" />
      <text className="hierarchy-svg-label" x="421" y="115">대표 Die</text>
      <text className="hierarchy-svg-note" x="421" y="137">확대할 영역</text>
      <text className="hierarchy-view-name" x="260" y="387" textAnchor="middle">Wafer top view</text>
    </g>
  );
}

function DieView() {
  const cells = Array.from({ length: 30 }, (_, index) => ({
    index,
    x: 327 + (index % 6) * 21,
    y: 226 + Math.floor(index / 6) * 18,
  }));
  return (
    <g>
      <rect className="hierarchy-die-outline" x="68" y="40" width="384" height="310" rx="12" />
      <rect className="hierarchy-block block-a" x="92" y="70" width="145" height="110" rx="8" />
      <rect className="hierarchy-block block-b" x="253" y="70" width="175" height="75" rx="8" />
      <rect className="hierarchy-block block-c" x="92" y="198" width="198" height="125" rx="8" />
      <rect className="hierarchy-block selected" x="310" y="180" width="118" height="143" rx="8" />
      <text className="hierarchy-svg-label" x="164" y="128" textAnchor="middle">Functional Block</text>
      <text className="hierarchy-svg-label" x="340" y="113" textAnchor="middle">Block</text>
      <text className="hierarchy-svg-label" x="191" y="264" textAnchor="middle">많은 회로 영역</text>
      {cells.map(cell => <rect key={cell.index} className="hierarchy-cell" x={cell.x} y={cell.y} width="14" height="10" rx="1" />)}
      <text className="hierarchy-svg-note" x="369" y="210" textAnchor="middle">Cell 영역</text>
      <text className="hierarchy-view-name" x="260" y="387" textAnchor="middle">하나의 Die를 확대한 개념도</text>
    </g>
  );
}

function TransistorView() {
  return (
    <g>
      <rect className="hierarchy-silicon" x="58" y="245" width="404" height="108" rx="8" />
      <rect className="hierarchy-source-drain" x="85" y="229" width="105" height="75" rx="7" />
      <rect className="hierarchy-source-drain" x="330" y="229" width="105" height="75" rx="7" />
      <rect className="hierarchy-oxide" x="211" y="205" width="98" height="19" rx="4" />
      <rect className="hierarchy-gate" x="224" y="92" width="72" height="113" rx="8" />
      <path className="hierarchy-channel" d="M190 270 H330" />
      <text className="hierarchy-svg-label" x="260" y="74" textAnchor="middle">Gate</text>
      <text className="hierarchy-svg-label" x="137" y="334" textAnchor="middle">Source</text>
      <text className="hierarchy-svg-label" x="383" y="334" textAnchor="middle">Drain</text>
      <text className="hierarchy-svg-note" x="260" y="291" textAnchor="middle">Channel 위치</text>
      <text className="hierarchy-svg-note" x="260" y="218" textAnchor="middle">Oxide</text>
      <text className="hierarchy-view-name" x="260" y="387" textAnchor="middle">한 개의 MOSFET 개념도</text>
    </g>
  );
}

export default function WaferDieTransistor(_props: InteractiveProps) {
  const [level, setLevel] = useState<Level>('wafer');
  const titleId = useId();
  const descriptionId = useId();
  const clipId = useId();
  const position = levels.indexOf(level);

  const controls = (
    <div className="hierarchy-controls">
      <nav className="hierarchy-breadcrumb" aria-label="확대 단계">
        {levels.map((item, index) => (
          <span key={item}>
            {index > 0 && <span className="hierarchy-separator" aria-hidden="true">›</span>}
            <button type="button" aria-current={level === item ? 'step' : undefined} onClick={() => setLevel(item)}>
              {labels[item]}
            </button>
          </span>
        ))}
      </nav>
      <span className="hierarchy-current">현재: <strong>{labels[level]}</strong></span>
    </div>
  );

  return (
    <DiagramFrame
      title="Wafer → Die → Transistor"
      objective="웨이퍼 전체에서 한 개의 다이, 그리고 그 안의 소자까지 확대해보세요."
      controls={controls}
      feedback={feedback[level]}
      takeaway="하나의 Wafer에는 여러 Die가 있고, 하나의 Die 안에는 매우 많은 Transistor가 있다."
      onReset={() => setLevel('wafer')}
    >
      <div className="hierarchy-view">
        <svg
          className="hierarchy-svg"
          viewBox="0 0 520 410"
          role="img"
          aria-labelledby={`${titleId} ${descriptionId}`}
        >
          <title id={titleId}>{labels[level]} 단계의 반도체 계층</title>
          <desc id={descriptionId}>{feedback[level]} 개념적 확대도이며 실제 크기 비율과 다릅니다.</desc>
          <defs><clipPath id={clipId}><circle cx="260" cy="190" r="163" /></clipPath></defs>
          {level === 'wafer' && <WaferView clipId={clipId} />}
          {level === 'die' && <DieView />}
          {level === 'transistor' && <TransistorView />}
        </svg>

        <p className="hierarchy-scale-note">개념적 확대도이며 실제 크기 비율과 다릅니다.</p>
        <div className="hierarchy-actions">
          <button type="button" onClick={() => setLevel(levels[position - 1] ?? 'wafer')} disabled={position === 0}>이전 단계</button>
          {position < levels.length - 1 && (
            <button className="primary" type="button" onClick={() => setLevel(levels[position + 1] ?? level)}>
              {level === 'wafer' ? '대표 Die 확대' : 'Transistor까지 확대'}
            </button>
          )}
          {position > 0 && <button type="button" onClick={() => setLevel('wafer')}>처음으로</button>}
        </div>
      </div>
    </DiagramFrame>
  );
}
