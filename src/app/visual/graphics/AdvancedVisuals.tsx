import type { ReactNode } from 'react';

import type { VisualGraphicProps } from '../types.js';
import { GraphicSvg } from './GraphicSvg.js';

function Panel({ title, description, className, children, viewBox = '0 0 320 300', width = 320, height = 300 }: {
  title: string;
  description: string;
  className: string;
  children: ReactNode;
  viewBox?: string;
  width?: number;
  height?: number;
}) {
  return (
    <GraphicSvg title={title} description={description} className={className} viewBox={viewBox}>
      <rect className="advanced-panel" x="3" y="3" width={width - 6} height={height - 6} rx="16" />
      <text className="visual-panel-title" x={width / 2} y="30" textAnchor="middle">{title}</text>
      {children}
    </GraphicSvg>
  );
}

function MiniMos({ x, y, label, kind }: { x: number; y: number; label: string; kind: 'pull' | 'access' }) {
  return (
    <g className={`memory-mos ${kind}`} data-memory-transistor={label}>
      <rect x={x - 24} y={y - 16} width="48" height="32" rx="7" />
      <text x={x} y={y + 4} textAnchor="middle">{label}</text>
    </g>
  );
}

export function MemoryStructure(_props: VisualGraphicProps) {
  return (
    <div className="visual-panel-grid visual-panel-grid-three memory-structure" role="group" aria-label="SRAM, DRAM, NAND 저장 구조 비교">
      <Panel title="SRAM · 6T" description="교차 연결된 inverter 네 transistor와 두 access transistor로 구성된 6T SRAM cell 개념도" className="memory-panel sram-memory-panel">
        <text className="visual-callout" x="160" y="53" textAnchor="middle">회로 상태로 1 bit 유지</text>
        <MiniMos x={104} y={96} label="P1" kind="pull" /><MiniMos x={104} y={168} label="N1" kind="pull" />
        <MiniMos x={216} y={96} label="P2" kind="pull" /><MiniMos x={216} y={168} label="N2" kind="pull" />
        <MiniMos x={45} y={132} label="A1" kind="access" /><MiniMos x={275} y={132} label="A2" kind="access" />
        <path className="memory-wire" d="M69 132 H104 M216 132 H251 M104 112 V152 M216 112 V152" />
        <path className="memory-feedback" d="M104 132 C135 132 137 78 192 78 V96 M216 132 C185 132 183 186 128 186 V168" />
        <text x="160" y="215" textAnchor="middle">교차 연결 inverter</text>
        <text x="160" y="240" textAnchor="middle">4 pull transistor + 2 access</text>
        <text className="visual-callout" x="160" y="273" textAnchor="middle">전원 유지 중 · 주기적 refresh 없음</text>
      </Panel>
      <Panel title="DRAM · 대표 1T1C" description="Word Line이 access transistor를 열어 Bit Line과 저장 capacitor를 연결하는 대표 DRAM cell 개념도" className="memory-panel dram-memory-panel">
        <text className="visual-callout" x="160" y="53" textAnchor="middle">capacitor 전하로 1 bit 저장</text>
        <line className="memory-wire" x1="50" y1="124" x2="112" y2="124" />
        <text x="48" y="106">Bit Line</text>
        <rect className="dram-access" x="112" y="101" width="74" height="46" rx="8" />
        <text x="149" y="129" textAnchor="middle">Access T</text>
        <line className="memory-wire" x1="149" y1="73" x2="149" y2="101" />
        <text x="149" y="65" textAnchor="middle">Word Line</text>
        <line className="memory-wire" x1="186" y1="124" x2="235" y2="124" />
        <line className="capacitor-plate" x1="235" y1="88" x2="235" y2="160" />
        <line className="capacitor-plate" x1="253" y1="88" x2="253" y2="160" />
        <text className="charge negative" x="270" y="132">−</text>
        <text x="244" y="186" textAnchor="middle">Capacitor</text>
        <text x="160" y="220" textAnchor="middle">1 Transistor + 1 Capacitor</text>
        <text className="visual-callout" x="160" y="251" textAnchor="middle">전하가 줄 수 있어 refresh 필요</text>
      </Panel>
      <Panel title="NAND · 전하 저장 영역" description="Word Line gate 아래 절연된 전하 저장 영역과 channel의 관계를 나타낸 NAND flash cell 개념도" className="memory-panel nand-memory-panel">
        <text className="visual-callout" x="160" y="53" textAnchor="middle">절연된 영역의 전하 상태 이용</text>
        <rect className="nand-channel" x="55" y="208" width="210" height="30" rx="8" />
        <text x="160" y="258" textAnchor="middle">Channel · cell들이 연속 연결</text>
        {[75, 135, 195].map((x, index) => (
          <g key={x}>
            <rect className="nand-oxide" x={x} y="150" width="50" height="48" rx="8" />
            <rect className="nand-charge-store" x={x + 8} y="164" width="34" height="20" rx="5" />
            <text x={x + 25} y="179" textAnchor="middle">−</text>
            <line className="nand-wordline" x1={x - 5} y1="132" x2={x + 55} y2="132" />
            <text className="visual-callout" x={x + 25} y="119" textAnchor="middle">WL{index + 1}</text>
          </g>
        ))}
        <text x="160" y="82" textAnchor="middle">Word Line / Gate</text>
        <text x="160" y="100" textAnchor="middle">↓ oxide ↓ charge storage ↓ oxide</text>
      </Panel>
      <p className="visual-scale-disclaimer">서로 다른 축척의 개념도 · 셀 구조와 메모리 제품 전체는 다릅니다.</p>
    </div>
  );
}

function DirectionArrow() {
  return <g><line className="sd-arrow" x1="52" y1="246" x2="268" y2="246" /><path className="sd-arrow-head" d="M268 246 L252 237 L252 255 Z" /><text x="52" y="272">Source</text><text x="268" y="272" textAnchor="end">Drain</text></g>;
}

export function TransistorCompare(_props: VisualGraphicProps) {
  return (
    <div className="visual-panel-grid visual-panel-grid-three transistor-compare" role="group" aria-label="Planar MOSFET, FinFET, nanosheet GAA 비교">
      <Panel title="Planar MOSFET" description="평면 channel 위를 gate oxide와 gate가 덮어 주로 위쪽에서 제어하는 개념 단면" className="transistor-panel planar-panel">
        <rect className="device-body" x="45" y="178" width="230" height="54" rx="7" />
        <rect className="source-drain" x="48" y="185" width="54" height="40" rx="5" /><rect className="source-drain" x="218" y="185" width="54" height="40" rx="5" />
        <rect className="channel" x="102" y="185" width="116" height="16" />
        <rect className="gate-oxide" x="102" y="160" width="116" height="14" /><rect className="gate" x="112" y="95" width="96" height="65" rx="9" />
        <text x="160" y="82" textAnchor="middle">Gate</text><text x="160" y="156" textAnchor="middle">Gate oxide</text><text x="160" y="219" textAnchor="middle">Channel</text>
        <path className="control-arrow" d="M160 64 V92" /><text className="visual-callout" x="160" y="52" textAnchor="middle">주로 위쪽 제어</text><DirectionArrow />
      </Panel>
      <Panel title="FinFET" description="솟은 fin channel을 oxide와 gate가 위와 양옆 세 면에서 감싸는 개념 단면" className="transistor-panel finfet-panel">
        <rect className="device-body" x="45" y="205" width="230" height="28" rx="7" />
        <rect className="channel fin" x="136" y="104" width="48" height="105" rx="7" />
        <path className="gate-oxide-outline" d="M126 205 V94 H194 V205" /><path className="gate-outline" d="M108 205 V76 H212 V205" />
        <text x="160" y="62" textAnchor="middle">Gate · 위 + 양옆</text><text x="214" y="95">Gate oxide</text><text x="160" y="156" textAnchor="middle">Fin Channel</text>
        <DirectionArrow />
      </Panel>
      <Panel title="Nanosheet GAA" description="여러 nanosheet channel 각각을 oxide와 gate가 둘레에서 감싸는 개념 단면" className="transistor-panel gaa-panel">
        <rect className="gate" x="75" y="76" width="170" height="148" rx="24" />
        {[105, 145, 185].map(y => <g key={y}><rect className="gate-oxide sheet" x="105" y={y - 10} width="110" height="30" rx="12" /><rect className="channel sheet" x="116" y={y - 2} width="88" height="14" rx="7" /></g>)}
        <text x="160" y="62" textAnchor="middle">Gate가 각 sheet 둘레 제어</text><text x="160" y="121" textAnchor="middle">Channel</text><text x="160" y="161" textAnchor="middle">Channel</text><text x="160" y="201" textAnchor="middle">Channel</text>
        <text className="visual-callout" x="160" y="232" textAnchor="middle">oxide가 Gate와 Channel을 절연</text><DirectionArrow />
      </Panel>
      <p className="visual-scale-disclaimer">같은 관점의 정성 비교 · 실제 치수, 공정 node, 제조사 구조를 뜻하지 않습니다. 나노시트는 package die 적층이 아닙니다.</p>
    </div>
  );
}

export function EuvTransfer(_props: VisualGraphicProps) {
  return (
    <div className="visual-panel-grid visual-panel-grid-two euv-transfer" role="group" aria-label="EUV 반사 광학과 PR 현상 및 식각 패턴 전달">
      <Panel title="A · EUV optical path" description="EUV가 반사 mask와 반사 optics를 거쳐 wafer 위 PR에 패턴 정보를 기록하는 기능 경로" className="euv-optical-panel" viewBox="0 0 360 310" width={360} height={310}>
        <text x="52" y="70">EUV source</text><circle className="euv-source" cx="80" cy="92" r="15" />
        <rect className="reflective-mask" x="218" y="65" width="108" height="24" rx="5" /><text x="272" y="56" textAnchor="middle">Reflective mask</text>
        <ellipse className="reflective-optic" cx="244" cy="142" rx="55" ry="14" transform="rotate(-18 244 142)" /><text x="276" y="169">Reflective optics</text>
        <path className="euv-ray" d="M95 92 L218 78 L205 128 L244 142 L170 218" />
        <rect className="material pr" x="82" y="220" width="176" height="22" /><rect className="material film" x="82" y="242" width="176" height="24" /><rect className="material wafer" x="82" y="266" width="176" height="25" />
        <text x="268" y="237">PR</text><text x="268" y="260">Film</text><text x="268" y="285">Wafer</text>
        <text className="visual-callout" x="180" y="306" textAnchor="middle">반사 경로 · 실제 장비 축척/거울 수와 다름</text>
      </Panel>
      <Panel title="B · Pattern transfer" description="노광 뒤 PR 현상으로 열린 부분을 만들고 식각으로 아래 Film에 패턴을 전달하는 단계" className="euv-pattern-panel" viewBox="0 0 360 310" width={360} height={310}>
        {[
          { x: 18, label: '1 · PR 기록', pr: 'full', film: 'full' },
          { x: 132, label: '2 · Develop', pr: 'split', film: 'full' },
          { x: 246, label: '3 · Etch', pr: 'split', film: 'split' },
        ].map(stage => <g key={stage.label} data-transfer-stage={stage.label}>
          <text x={stage.x + 48} y="68" textAnchor="middle">{stage.label}</text>
          {stage.pr === 'full' ? <rect className="material pr" x={stage.x} y="116" width="96" height="32" /> : <><rect className="material pr" x={stage.x} y="116" width="31" height="32" /><rect className="material pr" x={stage.x + 65} y="116" width="31" height="32" /></>}
          {stage.film === 'full' ? <rect className="material film" x={stage.x} y="148" width="96" height="48" /> : <><rect className="material film" x={stage.x} y="148" width="31" height="48" /><rect className="material film" x={stage.x + 65} y="148" width="31" height="48" /></>}
          <rect className="material wafer" x={stage.x} y="196" width="96" height="42" />
          <text className="visual-callout" x={stage.x + 48} y="260" textAnchor="middle">{stage.film === 'split' ? 'Film 형상' : stage.pr === 'split' ? 'PR opening' : '노광 반응 차이'}</text>
        </g>)}
        <path className="process-arrow" d="M111 94 H128 M225 94 H242" />
        <text className="visual-callout" x="180" y="292" textAnchor="middle">빛은 PR에 기록하고, Etch가 아래 Film을 가공</text>
      </Panel>
    </div>
  );
}

function PowerPanel({ backside }: { backside: boolean }) {
  return (
    <Panel title={backside ? 'Backside power' : 'Conventional / frontside'} description={backside ? '전면에는 신호 배선을 두고 후면의 VDD와 GND 경로를 backside connection으로 device layer에 연결한 개념 단면' : '전면 배선 공간에 signal, VDD, GND 경로가 함께 배치된 개념 단면'} className={`power-panel ${backside ? 'backside-panel' : 'frontside-panel'}`}>
      <text className="visual-callout" x="160" y="54" textAnchor="middle">Frontside wiring</text>
      <line className="signal-path" x1="45" y1="78" x2="275" y2="78" /><text x="160" y="70" textAnchor="middle">Signal</text>
      {!backside && <><line className="vdd-path" x1="45" y1="105" x2="275" y2="105" /><text x="80" y="99">VDD</text><line className="gnd-path" x1="45" y1="132" x2="275" y2="132" /><text x="80" y="126">GND</text></>}
      <rect className="device-layer" x="45" y="150" width="230" height="50" rx="8" /><text x="160" y="180" textAnchor="middle">Device layer</text>
      <rect className="silicon-layer" x="45" y="200" width="230" height="42" /><text x="160" y="226" textAnchor="middle">Silicon</text>
      {backside && <><line className="backside-contact vdd" x1="102" y1="152" x2="102" y2="267" /><line className="backside-contact gnd" x1="218" y1="152" x2="218" y2="267" /><line className="vdd-path" x1="45" y1="267" x2="150" y2="267" /><line className="gnd-path" x1="170" y1="267" x2="275" y2="267" /><text x="66" y="288">VDD</text><text x="232" y="288">GND</text><text className="visual-callout" x="160" y="255" textAnchor="middle">Backside connection</text></>}
      {!backside && <text className="visual-callout" x="160" y="275" textAnchor="middle">전면 공간에 신호·전력 경로 공존</text>}
    </Panel>
  );
}

export function BacksideRails(_props: VisualGraphicProps) {
  return <div className="visual-panel-grid visual-panel-grid-two backside-rails" role="group" aria-label="전면 전력 공급과 후면 전력 공급 비교"><PowerPanel backside={false} /><PowerPanel backside /></div>;
}

function PatternColumn({ highNa }: { highNa: boolean }) {
  const label = highNa ? 'High-NA EUV' : 'Conventional EUV';
  return (
    <Panel title={label} description={`${label}에서 같은 목표 두 선의 광학 경향, PR 현상 결과, 식각 전달 결과를 정성 비교한 개념도`} className={`high-na-panel ${highNa ? 'high-na' : 'conventional-na'}`} viewBox="0 0 340 360" width={340} height={360}>
      <text className="visual-callout" x="170" y="54" textAnchor="middle">같은 EUV wavelength 계열 · NA 차이</text>
      <text x="28" y="91">1 · Optical tendency</text>
      <path className="target-line" d="M72 112 V146 M112 112 V146" />
      <path className="aerial-line" d={highNa ? 'M206 112 V146 M246 112 V146' : 'M202 112 Q226 129 250 112 M202 146 Q226 129 250 146'} />
      <text className="visual-callout" x="92" y="164" textAnchor="middle">목표 두 선</text><text className="visual-callout" x="226" y="164" textAnchor="middle">표현 경향</text>
      <text x="28" y="198">2 · PR develop</text>
      <rect className="material pr" x="72" y="211" width="44" height="36" /><rect className="material pr" x={highNa ? 154 : 137} y="211" width={highNa ? 44 : 78} height="36" /><rect className="material pr" x="254" y="211" width="24" height="36" />
      <text x="28" y="279">3 · Etch result</text>
      <rect className="material film" x="72" y="290" width="44" height="38" /><rect className="material film" x={highNa ? 154 : 137} y="290" width={highNa ? 44 : 78} height="38" /><rect className="material film" x="254" y="290" width="24" height="38" />
      <text className="visual-callout" x="170" y="350" textAnchor="middle">정성 예시 · 결과 보증 아님</text>
    </Panel>
  );
}

export function HighNaPattern(_props: VisualGraphicProps) {
  return (
    <div className="visual-panel-grid visual-panel-grid-two high-na-pattern" role="group" aria-label="Conventional EUV와 High-NA EUV의 패턴 형성 정성 비교">
      <PatternColumn highNa={false} /><PatternColumn highNa />
      <p className="visual-scale-disclaimer">High-NA는 더 짧은 파장을 뜻하지 않습니다. 최종 결과에는 focus, process window, resist, etch와 다른 공정 조건도 함께 영향을 줍니다.</p>
    </div>
  );
}
