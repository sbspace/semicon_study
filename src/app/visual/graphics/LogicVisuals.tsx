import type { VisualGraphicProps } from '../types.js';
import { GraphicSvg, PanelTitle } from './GraphicSvg.js';

function Mos({ x, y, label, kind }: { x:number; y:number; label:string; kind:'PMOS'|'NMOS' }) {
  return <g className={`logic-mos ${kind.toLowerCase()}`} data-mos-transistor={label}><rect x={x-38} y={y-24} width="76" height="48" rx="8"/><text x={x} y={y-4} textAnchor="middle">{label}</text><text x={x} y={y+15} textAnchor="middle">{kind}</text></g>;
}

export function NandTopology(_props: VisualGraphicProps) {
  return <GraphicSvg className="logic-topology-graphic" title="4-transistor CMOS NAND topology" description="VDD와 출력 사이에 PMOS A와 B가 병렬이고, 출력과 GND 사이에 NMOS A와 B가 직렬로 연결된다.">
    <text x="380" y="32" textAnchor="middle">VDD</text><line className="visual-wire" x1="200" y1="50" x2="560" y2="50"/>
    <Mos x={270} y={115} label="A" kind="PMOS"/><Mos x={490} y={115} label="B" kind="PMOS"/>
    <path className="visual-wire" data-topology="parallel" d="M270 50 V91 M490 50 V91 M270 139 V175 H490 V139"/><text x="380" y="88" textAnchor="middle">PMOS 병렬</text>
    <line className="visual-wire output" x1="380" y1="175" x2="650" y2="175"/><text x="668" y="181">Y</text>
    <Mos x={380} y={245} label="A" kind="NMOS"/><Mos x={380} y={325} label="B" kind="NMOS"/>
    <path className="visual-wire" data-topology="series" d="M380 175 V221 M380 269 V301 M380 349 V385"/><text x="455" y="290">NMOS 직렬</text><text x="380" y="412" textAnchor="middle">GND</text>
  </GraphicSvg>;
}

export function NorTopology(_props: VisualGraphicProps) {
  return <GraphicSvg className="logic-topology-graphic" title="4-transistor CMOS NOR topology" description="VDD와 출력 사이에 PMOS A와 B가 직렬이고, 출력과 GND 사이에 NMOS A와 B가 병렬로 연결된다.">
    <text x="380" y="32" textAnchor="middle">VDD</text><Mos x={380} y={90} label="A" kind="PMOS"/><Mos x={380} y={170} label="B" kind="PMOS"/>
    <path className="visual-wire" data-topology="series" d="M380 45 V66 M380 114 V146 M380 194 V225"/><text x="455" y="135">PMOS 직렬</text>
    <line className="visual-wire output" x1="380" y1="225" x2="650" y2="225"/><text x="668" y="231">Y</text>
    <Mos x={270} y={305} label="A" kind="NMOS"/><Mos x={490} y={305} label="B" kind="NMOS"/>
    <path className="visual-wire" data-topology="parallel" d="M380 225 H270 V281 M380 225 H490 V281 M270 329 V370 H490 V329 M380 370 V395"/><text x="380" y="350" textAnchor="middle">NMOS 병렬</text><text x="380" y="418" textAnchor="middle">GND</text>
  </GraphicSvg>;
}

export function AdderChain(_props: VisualGraphicProps) {
  const blocks=[0,1,2,3];
  return <GraphicSvg className="adder-chain-graphic" title="1-bit Full Adder 네 개의 4-bit carry chain" description="각 자리의 Cout이 다음 높은 자리 Full Adder의 Cin으로 연결되고 각 자리에서 Sum이 나온다.">
    <PanelTitle x={380}>1-bit Full Adder × 4</PanelTitle>
    {blocks.map((i)=><g key={i} data-full-adder={`FA${i}`} transform={`translate(${75+i*170} 0)`}><text x="65" y="75" textAnchor="middle">A{i}   B{i}</text><path className="visual-wire" d="M35 85 V120 M95 85 V120"/><rect x="10" y="120" width="110" height="105" rx="12"/><text x="65" y="165" textAnchor="middle">FA{i}</text><text x="65" y="190" textAnchor="middle">Full Adder</text><path className="visual-wire" d="M65 225 V285"/><text x="65" y="308" textAnchor="middle">Sum{i}</text></g>)}
    <path className="carry-wire" data-carry-chain d="M25 200 H85 M195 200 H255 M365 200 H425 M535 200 H595 M705 200 H745"/>
    <text x="25" y="185">Cin</text><text x="715" y="185">Cout</text>
    {[0,1,2].map(i=><text key={i} x={220+i*170} y="244" textAnchor="middle">Cout{i} → Cin{i+1}</text>)}
    <text className="visual-callout" x="380" y="375" textAnchor="middle">Carry가 다음 자리로 전달되어 여러 bit 덧셈으로 이어집니다.</text>
  </GraphicSvg>;
}

export function RegisterEight(_props: VisualGraphicProps) {
  const bits='10110100'.split('');
  return <GraphicSvg className="register-eight-graphic" title="10110100을 저장하는 여덟 D Flip-Flop register" description="D7부터 D0까지 여덟 입력이 각각 한 DFF에 저장되어 Q7부터 Q0에 나오며 하나의 공통 Clock 선을 공유한다.">
    <PanelTitle x={380}>8-bit Register · 10110100</PanelTitle>
    {bits.map((bit,i)=><g key={i} data-dff-bit={7-i} transform={`translate(${35+i*88} 0)`}><text x="42" y="75" textAnchor="middle">D{7-i}={bit}</text><line className="visual-wire" x1="42" y1="84" x2="42" y2="112"/><rect x="8" y="112" width="68" height="105" rx="10"/><text x="42" y="150" textAnchor="middle">DFF</text><text x="42" y="177" textAnchor="middle">bit {7-i}</text><line className="visual-wire" x1="42" y1="217" x2="42" y2="260"/><text x="42" y="285" textAnchor="middle">Q{7-i}={bit}</text><line className="clock-tap" x1="42" y1="217" x2="42" y2="340"/></g>)}
    <line className="common-clock" data-common-clock x1="35" y1="340" x2="725" y2="340"/><text x="380" y="372" textAnchor="middle">공통 CLK</text><text className="visual-callout" x="380" y="405" textAnchor="middle">DFF 하나가 bit 하나를 저장합니다.</text>
  </GraphicSvg>;
}
