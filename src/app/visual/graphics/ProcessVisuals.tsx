import type { VisualGraphicProps } from '../types.js';
import { GraphicSvg, PanelTitle } from './GraphicSvg.js';

function BaseStack({ x, patterned=false }: { x:number; patterned?:boolean }) {
  return <g transform={`translate(${x} 0)`}><rect className="material wafer" x="20" y="270" width="280" height="75"/><text x="160" y="316" textAnchor="middle">Wafer / 하부 구조</text><rect className="material film" x="20" y="220" width="280" height="50"/><text x="160" y="252" textAnchor="middle">Film</text>{patterned?<><rect className="material pr" x="20" y="170" width="75" height="50"/><rect className="material pr" x="225" y="170" width="75" height="50"/></>:<rect className="material pr" x="20" y="170" width="280" height="50"/>}</g>;
}

export function DepositionBasics(_props: VisualGraphicProps) {
  return <GraphicSvg className="process-basics-graphic" title="Deposition 전과 후의 wafer 단면" description="막이 없던 wafer 위에 얇은 Film이 전체적으로 형성되는 전후를 비교한다.">
    <PanelTitle x={190}>Before</PanelTitle><PanelTitle x={570}>After · Deposition</PanelTitle>
    <rect className="material wafer" x="55" y="250" width="270" height="90"/><text x="190" y="303" textAnchor="middle">Wafer</text>
    <path className="process-arrow" d="M340 290 H420"/>
    <rect className="material film" data-added-film x="435" y="205" width="270" height="45"/><text x="570" y="234" textAnchor="middle">Thin Film</text><rect className="material wafer" x="435" y="250" width="270" height="90"/><text x="570" y="303" textAnchor="middle">Wafer</text>
    <text className="visual-callout" x="380" y="390" textAnchor="middle">Deposition은 필요한 물질의 막을 표면에 형성합니다.</text>
  </GraphicSvg>;
}

export function PhotoBasics(_props: VisualGraphicProps) {
  return <GraphicSvg className="process-basics-graphic" title="Mask와 빛으로 PR에 위치를 정하는 Photo 개념도" description="위에서부터 Mask, 빛, PR, 가공 대상 Film, Wafer 순서를 보여주며 Film 층을 생략하지 않는다.">
    <rect className="mask" x="180" y="45" width="400" height="40"/><rect className="mask-opening" x="340" y="45" width="80" height="40"/><text x="120" y="71">Mask</text>
    {[360,380,400].map(x=><path key={x} className="light-ray" d={`M${x} 90 V155`}/>)}<text x="450" y="128">Light</text>
    <BaseStack x={220}/><text x="185" y="202" textAnchor="end">PR</text>
    <text className="visual-callout" x="380" y="390" textAnchor="middle">Photo는 아래 Film을 바로 깎는 단계가 아니라 PR 패턴으로 가공 위치를 정합니다.</text>
  </GraphicSvg>;
}

export function EtchBasics(_props: VisualGraphicProps) {
  return <GraphicSvg className="process-basics-graphic" title="PR이 보호한 Film과 열린 영역의 식각 결과" description="PR 아래 Film은 남고 PR이 열린 가운데 영역의 Film이 제거되어 Wafer가 드러난다.">
    <PanelTitle x={200}>Etch 전</PanelTitle><PanelTitle x={570}>Etch 후</PanelTitle>
    <g transform="translate(40 0)"><BaseStack x={0} patterned/></g><path className="process-arrow" d="M350 255 H420"/>
    <g transform="translate(410 0)"><rect className="material wafer" x="20" y="270" width="280" height="75"/><text x="160" y="316" textAnchor="middle">Wafer</text><rect className="material film" x="20" y="220" width="75" height="50"/><rect className="material film" x="225" y="220" width="75" height="50"/><rect className="material pr" x="20" y="170" width="75" height="50"/><rect className="material pr" x="225" y="170" width="75" height="50"/><text x="160" y="206" textAnchor="middle">열린 영역</text></g>
    <text className="visual-callout" x="380" y="390" textAnchor="middle">PR 보호 영역 아래의 Film은 남고, 열린 영역의 Film이 제거됩니다.</text>
  </GraphicSvg>;
}

export function ScannerPath(_props: VisualGraphicProps) {
  const blocks=[['Light source',70],['Reticle / Mask',235],['Optical system',400],['PR',565]];
  return <GraphicSvg className="scanner-path-graphic" title="Scanner의 일반적인 노광 기능 경로" description="광원에서 Reticle 또는 Mask, 광학계, PR로 패턴 정보가 전달되고 그 아래에 Film과 Wafer가 놓인다.">
    {blocks.map(([label,x])=><g key={label as string} data-scanner-stage={label}><rect x={Number(x)} y="90" width="130" height="75" rx="12"/><text x={Number(x)+65} y="133" textAnchor="middle">{label}</text></g>)}
    <path className="process-arrow" d="M200 127 H230 M365 127 H395 M530 127 H560"/>
    <rect className="material film" x="565" y="205" width="130" height="48"/><text x="630" y="235" textAnchor="middle">Film</text><rect className="material wafer" x="565" y="253" width="130" height="60"/><text x="630" y="290" textAnchor="middle">Wafer</text>
    <path className="light-ray" d="M630 165 V205"/><text className="visual-callout" x="380" y="375" textAnchor="middle">일반 기능 블록도이며 DUV와 EUV의 실제 광학 경로를 섞어 그린 장비 단면이 아닙니다.</text>
  </GraphicSvg>;
}

export function MultiMaterial(_props: VisualGraphicProps) {
  const layers=[['Passivation / 보호',80,'protective'],['Conductive film / 전기 연결',140,'conductive'],['Dielectric / 절연',200,'dielectric'],['Barrier class / 확산 억제 예',260,'barrier'],['Silicon base',320,'silicon']];
  return <GraphicSvg className="multi-material-graphic" title="서로 다른 역할을 가진 여러 박막의 개념 stack" description="보호막, 도전막, 절연막, 확산 억제층의 예와 실리콘 바닥을 층별 역할과 함께 보여준다.">
    {layers.map(([label,y,kind])=><g key={kind} data-material-role={kind}><rect className={`material ${kind}`} x="175" y={Number(y)} width="410" height="52" rx="5"/><text x="380" y={Number(y)+32} textAnchor="middle">{label}</text></g>)}
    <text className="visual-callout" x="380" y="404" textAnchor="middle">역할을 구분하기 위한 개념 예이며 실제 공정의 재료 순서나 recipe가 아닙니다.</text>
  </GraphicSvg>;
}

export function OxidationVsDeposition(_props: VisualGraphicProps) {
  return <GraphicSvg className="oxidation-comparison-graphic" title="Thermal oxidation과 deposition의 막 형성 차이" description="왼쪽은 기존 silicon 표면이 반응해 SiO2가 형성되고, 오른쪽은 외부 precursor가 표면에 도달해 Film을 추가하는 개념이다.">
    <PanelTitle x={190}>Thermal Oxidation</PanelTitle><PanelTitle x={570}>Deposition</PanelTitle>
    <text x="190" y="72" textAnchor="middle">O₂ / H₂O + 열</text><path className="field-arrow" d="M190 82 V145"/>
    <rect className="material oxide" data-origin="reacted-silicon" x="65" y="150" width="250" height="70"/><text x="190" y="191" textAnchor="middle">SiO₂ · 기존 Si가 반응</text><rect className="material silicon" x="65" y="220" width="250" height="115"/><text x="190" y="282" textAnchor="middle">Silicon</text>
    <text x="570" y="72" textAnchor="middle">외부 precursor / source</text>{[520,570,620].map(x=><path key={x} className="field-arrow" d={`M${x} 82 V145`}/>)}
    <rect className="material film" data-origin="external-source" x="445" y="150" width="250" height="70"/><text x="570" y="191" textAnchor="middle">추가된 Film</text><rect className="material silicon" x="445" y="220" width="250" height="115"/><text x="570" y="282" textAnchor="middle">기존 표면</text>
    <text className="visual-callout" x="380" y="390" textAnchor="middle">정확한 성장 비율과 부피 변화는 나타내지 않은 개념 비교입니다.</text>
  </GraphicSvg>;
}

export function DefectComparison(_props: VisualGraphicProps) {
  const panels=[['정상 배선','normal'],['Open 가능 사례','open'],['Bridge / Short 가능 사례','bridge']];
  return <GraphicSvg className="defect-comparison-graphic" title="오염 위치에 따라 생길 수 있는 배선 영향 비교" description="정상 배선, 입자가 패턴 형성을 방해해 끊길 수 있는 사례, 두 선을 이어 short가 생길 수 있는 사례를 비교한다.">
    {panels.map(([label,kind],i)=><g key={kind} data-defect-case={kind} transform={`translate(${25+i*245} 0)`}><rect className="comparison-panel" x="0" y="55" width="220" height="285" rx="14"/><text className="visual-panel-title" x="110" y="88" textAnchor="middle">{label}</text><line className="metal-line" x1="30" y1="155" x2={kind==='open'?95:190} y2="155"/>{kind==='open'&&<><line className="metal-line" x1="135" y1="155" x2="190" y2="155"/><circle className="particle" cx="115" cy="155" r="20"/><text x="110" y="215" textAnchor="middle">형성 방해 가능</text></>}{kind==='normal'&&<text x="110" y="215" textAnchor="middle">연속 경로</text>}{kind==='bridge'&&<><line className="metal-line secondary" x1="30" y1="235" x2="190" y2="235"/><path className="particle-bridge" d="M105 155 V235"/><text x="110" y="275" textAnchor="middle">두 선 연결 가능</text></>}</g>)}
    <text className="visual-callout" x="380" y="390" textAnchor="middle">오염 위치와 크기에 따라 발생할 수 있는 영향의 예입니다.</text>
  </GraphicSvg>;
}
