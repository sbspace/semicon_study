import type { VisualGraphicProps } from '../types.js';
import { GraphicSvg, PanelTitle } from './GraphicSvg.js';

export function PackageIntro(_props: VisualGraphicProps) {
  return <GraphicSvg className="package-intro-graphic" title="다이에서 PCB까지 이어지는 대표 패키지 개념 구조" description="다이 아래의 연결 범프, 패키지 기판, 외부 접점과 PCB 방향을 층별로 보여준다.">
    <g className="visual-layer-stack">
      <rect x="250" y="45" width="260" height="66" rx="10" data-part="die" /><text x="380" y="83" textAnchor="middle">Die · 얇은 silicon 조각</text>
      <text x="380" y="137" textAnchor="middle">전기 연결 / bump</text>{[290,350,410,470].map(x=><circle key={x} cx={x} cy="155" r="15" data-part="bump" />)}
      <rect x="155" y="185" width="450" height="82" rx="12" data-part="substrate" /><text x="380" y="231" textAnchor="middle">Package substrate · 연결과 보호</text>
      <text x="380" y="294" textAnchor="middle">외부 접점</text>{[210,290,370,450,530].map(x=><circle key={x} cx={x} cy="315" r="17" data-part="contact" />)}
      <rect x="90" y="350" width="580" height="45" rx="10" data-part="pcb" /><text x="380" y="379" textAnchor="middle">PCB 방향</text>
    </g>
  </GraphicSvg>;
}

export function RcLoop(_props: VisualGraphicProps) {
  return <GraphicSvg className="rc-loop-graphic" title="전원, 스위치, 저항, 커패시터가 연결된 RC 폐회로" description="전압원에서 스위치와 저항, 커패시터를 지나 다시 전압원으로 돌아오는 닫힌 경로를 보여준다.">
    <path className="visual-wire" data-closed-loop d="M135 110 H260 M315 110 H430 M520 110 H625 V325 H135 V110" />
    <line className="visual-switch" x1="260" y1="110" x2="305" y2="82" /><circle cx="260" cy="110" r="6"/><circle cx="315" cy="110" r="6"/><text x="288" y="61" textAnchor="middle">Switch</text>
    <path className="visual-resistor" d="M430 110 l14 -18 18 36 18 -36 18 36 22 -18"/><text x="475" y="65" textAnchor="middle">Resistor R</text>
    <line className="visual-capacitor" x1="590" y1="205" x2="660" y2="205"/><line className="visual-capacitor" x1="590" y1="235" x2="660" y2="235"/><text x="555" y="225" textAnchor="end">Capacitor C</text>
    <line className="visual-battery" x1="100" y1="185" x2="170" y2="185"/><line className="visual-battery" x1="112" y1="225" x2="158" y2="225"/><text x="185" y="211">Voltage source</text>
    <path className="visual-arrow" d="M350 325 H470"/><text x="410" y="353" textAnchor="middle">return path</text>
  </GraphicSvg>;
}

export function MosCapacitance(_props: VisualGraphicProps) {
  return <GraphicSvg className="mos-capacitance-graphic" title="Gate, oxide, semiconductor의 MOS 용량 구조" description="절연막 양쪽의 반대 전하와 산화막을 가로지르는 전기장을 보여주며 직류 전류 경로는 그리지 않는다.">
    <rect x="150" y="55" width="460" height="75" rx="8" data-layer="gate"/><text x="380" y="99" textAnchor="middle">Gate</text>
    <rect x="150" y="185" width="460" height="65" rx="5" data-layer="oxide"/><text x="380" y="224" textAnchor="middle">Oxide · 절연층</text>
    <rect x="150" y="315" width="460" height="75" rx="8" data-layer="semiconductor"/><text x="380" y="359" textAnchor="middle">Semiconductor</text>
    {[220,300,380,460,540].map(x=><text key={`p${x}`} className="charge positive" x={x} y="164" textAnchor="middle">+</text>)}
    {[220,300,380,460,540].map(x=><text key={`n${x}`} className="charge negative" x={x} y="292" textAnchor="middle">−</text>)}
    {[260,380,500].map(x=><path key={x} className="field-arrow" d={`M${x} 172 V285`}/>)}
    <text x="655" y="223">Electric field</text><text className="visual-callout" x="380" y="415" textAnchor="middle">Oxide를 관통하는 DC 전류가 아니라 전기장으로 반대 전하가 유도됩니다.</text>
  </GraphicSvg>;
}

export function FinPerspective(_props: VisualGraphicProps) {
  return <GraphicSvg className="fin-perspective-graphic" title="Gate가 회색 Fin 채널의 세 면을 감싸는 FinFET 개념도" description="솟은 회색 Fin의 위와 양옆을 Gate가 감싸며 Source에서 Drain 방향으로 채널이 이어진다.">
    <polygon className="fin-base" points="105,330 515,330 650,260 240,260"/><text x="115" y="368">Silicon base</text>
    <polygon className="fin-channel" points="265,270 475,270 535,236 325,236 325,105 265,139" data-part="fin"/>
    <text x="392" y="216" textAnchor="middle">회색 Fin = Channel</text>
    <path className="fin-gate" d="M330 98 L485 98 L550 63 L395 63 M330 98 V252 M485 98 V252" data-wrap-faces="3"/>
    <text x="470" y="48" textAnchor="middle">Gate: 위 + 양옆 3면</text>
    <rect x="115" y="235" width="125" height="65" rx="8"/><text x="177" y="273" textAnchor="middle">Source</text>
    <rect x="535" y="205" width="125" height="65" rx="8"/><text x="598" y="243" textAnchor="middle">Drain</text>
    <path className="visual-arrow" d="M225 225 L555 175"/><text x="380" y="161" textAnchor="middle">Source → Drain 방향</text>
  </GraphicSvg>;
}

function PhysicalPanel({ offset = 0 }: { offset?: number }) {
  return <g transform={`translate(${offset} 0)`}>
    <rect className="well pwell" x="25" y="235" width="260" height="135" rx="10"/><text x="155" y="354" textAnchor="middle">Silicon / well · body context</text>
    <rect className="diffusion pmos" x="42" y="260" width="90" height="55" rx="8"/><text x="87" y="293" textAnchor="middle">PMOS</text>
    <rect className="diffusion nmos" x="178" y="260" width="90" height="55" rx="8"/><text x="223" y="293" textAnchor="middle">NMOS</text>
    <line className="visual-wire power" x1="87" y1="70" x2="87" y2="260"/><text x="87" y="55" textAnchor="middle">VDD</text>
    <line className="visual-wire ground" x1="223" y1="315" x2="223" y2="400"/><text x="223" y="419" textAnchor="middle">GND</text>
    <path className="visual-wire output" d="M132 285 H155 V180 H178"/><text x="155" y="163" textAnchor="middle">OUT</text>
    <path className="visual-wire input" d="M25 210 H64 M64 210 V245 M64 210 H200 V245"/><text x="25" y="195">Gate / Input</text>
  </g>;
}

export function CmosPhysical(_props: VisualGraphicProps) {
  return <GraphicSvg className="cmos-physical-graphic" title="CMOS inverter 회로와 물리 단면의 대응" description="왼쪽의 PMOS와 NMOS 회로 연결을 오른쪽의 VDD, 공통 OUT, GND가 표시된 실리콘 개념 단면과 대응시킨다.">
    <PanelTitle x={150}>회로 연결</PanelTitle><PanelTitle x={565}>물리 단면</PanelTitle>
    <g className="circuit-panel"><text x="150" y="70" textAnchor="middle">VDD</text><rect x="105" y="95" width="90" height="60" rx="10"/><text x="150" y="131" textAnchor="middle">PMOS</text><line className="visual-wire" x1="150" y1="70" x2="150" y2="95"/><line className="visual-wire" x1="150" y1="155" x2="150" y2="235"/><text x="173" y="214">OUT</text><rect x="105" y="235" width="90" height="60" rx="10"/><text x="150" y="271" textAnchor="middle">NMOS</text><line className="visual-wire" x1="150" y1="295" x2="150" y2="365"/><text x="150" y="390" textAnchor="middle">GND</text><line className="visual-wire input" x1="35" y1="195" x2="105" y2="195"/><line className="visual-wire input" x1="105" y1="125" x2="105" y2="265"/><text x="35" y="180">Input</text></g>
    <path className="correspondence-arrow" d="M275 205 H355"/><text x="315" y="187" textAnchor="middle">같은 연결</text><PhysicalPanel offset={410}/>
  </GraphicSvg>;
}

export function SramArray(_props: VisualGraphicProps) {
  const rows=[0,1,2], cols=[0,1,2];
  return <GraphicSvg className="sram-array-graphic" title="Word Line 행과 BL, BLB 열로 연결된 SRAM cell 배열" description="3행 3열의 개념 셀 배열에서 하나의 Word Line 행과 하나의 Bit Line 쌍을 강조한다.">
    {cols.map(c=><g key={c}><line className={`array-bitline ${c===1?'selected':''}`} x1={230+c*150} y1="45" x2={230+c*150} y2="385"/><line className={`array-bitline complement ${c===1?'selected':''}`} x1={260+c*150} y1="45" x2={260+c*150} y2="385"/><text x={245+c*150} y="28" textAnchor="middle">BL{c} / BLB{c}</text></g>)}
    {rows.map(r=><g key={r}><line className={`array-wordline ${r===1?'selected':''}`} x1="65" y1={115+r*110} x2="700" y2={115+r*110}/><text x="25" y={120+r*110}>WL{r}</text>{cols.map(c=><g key={c} data-sram-cell={`${r}-${c}`}><rect className={r===1&&c===1?'selected-cell':''} x={190+c*150} y={75+r*110} width="110" height="78" rx="10"/><text x={245+c*150} y={110+r*110} textAnchor="middle">6T cell</text><text x={245+c*150} y={132+r*110} textAnchor="middle">Q / Q̅</text></g>)}</g>)}
    <text className="visual-callout" x="380" y="414" textAnchor="middle">개념 배열: 실제 SRAM의 행·열 개수나 축척을 나타내지 않습니다.</text>
  </GraphicSvg>;
}
