import { useId } from 'react';

export function MosCrossSection({ kind, on, gateState, sourceContext, description }: {
  kind: 'nmos' | 'pmos';
  on: boolean;
  gateState: string;
  sourceContext: string;
  description: string;
}) {
  const titleId = useId();
  const descriptionId = useId();
  const device = kind.toUpperCase();
  const terminalType = kind === 'nmos' ? 'N+' : 'P+';
  const bodyType = kind === 'nmos' ? 'P-type Body' : 'N-type Body';
  const channelType = kind === 'nmos' ? 'N-channel' : 'P-channel';

  return (
    <figure className={`mos-cross-section ${kind} ${on ? 'on' : 'off'}`}>
      <svg viewBox="0 0 440 310" role="img" aria-labelledby={`${titleId} ${descriptionId}`}>
        <title id={titleId}>{device} 단면, {on ? 'ON' : 'OFF'}</title>
        <desc id={descriptionId}>{description}</desc>

        <rect className="mos-body" x="28" y="132" width="384" height="148" rx="10" />
        <text className="mos-body-label" x="220" y="263" textAnchor="middle">{bodyType}</text>

        <rect className="mos-terminal" x="52" y="145" width="92" height="76" rx="8" />
        <rect className="mos-terminal" x="296" y="145" width="92" height="76" rx="8" />
        <text x="98" y="178" textAnchor="middle">Source</text>
        <text className="mos-doping-label" x="98" y="202" textAnchor="middle">{terminalType}</text>
        <text x="342" y="178" textAnchor="middle">Drain</text>
        <text className="mos-doping-label" x="342" y="202" textAnchor="middle">{terminalType}</text>

        <rect className="mos-gate" x="153" y="39" width="134" height="54" rx="8" />
        <text x="220" y="64" textAnchor="middle">Gate</text>
        <text className="mos-gate-state" x="220" y="84" textAnchor="middle">{gateState}</text>
        <rect className="mos-oxide" x="143" y="112" width="154" height="20" rx="5" />
        <text className="mos-oxide-label" x="220" y="127" textAnchor="middle">Oxide · 절연막</text>

        <g className="mos-electric-field" aria-hidden="true">
          <line x1="180" y1="96" x2="180" y2="108" />
          <line x1="220" y1="96" x2="220" y2="108" />
          <line x1="260" y1="96" x2="260" y2="108" />
        </g>
        <text className="mos-field-label" x="318" y="105">전기장</text>

        <line className="mos-channel" x1="139" y1="151" x2="301" y2="151" />
        <text className="mos-channel-label" x="220" y="170" textAnchor="middle">
          {on ? `${channelType} 형성` : 'Channel 없음'}
        </text>
        <text className="mos-device-state" x="382" y="32" textAnchor="end">{on ? 'ON · 도통' : 'OFF · 단절'}</text>
      </svg>
      <figcaption><strong>{device} · {on ? 'ON' : 'OFF'}</strong><span>{on ? 'Source–Drain channel이 연결됨' : 'Source–Drain channel이 끊어짐'}</span></figcaption>
      <p className="mos-source-context">Source: <span>{sourceContext}</span></p>
    </figure>
  );
}
