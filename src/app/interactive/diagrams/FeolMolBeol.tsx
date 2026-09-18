import { useState } from 'react';
import { DiagramFrame } from '../DiagramFrame.js';
import { StructureChoices, StructureView } from '../primitives/StructureView.js';
import type { InteractiveProps } from '../types.js';

const layers = [
  { value: 'all', label: '전체 보기', detail: '아래 FEOL의 소자에서 MOL의 Contact를 거쳐 위 BEOL의 Metal과 Via로 이어지는 한 칩의 단면입니다.' },
  { value: 'feol', label: 'FEOL', detail: '실리콘 표면에 Transistor를 만듭니다. Gate는 Oxide로 절연되어 있고 Source와 Drain 사이 Channel을 제어합니다.' },
  { value: 'mol', label: 'MOL', detail: 'Contact와 국소 연결이 아래 Transistor 단자를 위쪽 첫 금속 배선과 잇습니다. BEOL 층 사이 Via와 역할·위치가 다릅니다.' },
  { value: 'beol', label: 'BEOL', detail: '위쪽 여러 Metal 배선층이 회로를 연결합니다. Via는 절연막 사이를 지나 서로 다른 Metal 높이를 연결합니다.' },
] as const;
export default function FeolMolBeol(_props: InteractiveProps) {
  const [selected, setSelected] = useState<typeof layers[number]['value']>('all');
  const layer = layers.find(item => item.value === selected)!;
  const cls = (name: string) => `structure-layer ${selected === 'all' || selected === name ? 'selected' : ''}`;
  return <DiagramFrame title="FEOL · MOL · BEOL" objective="층을 선택해 소자·접점·배선의 위치와 역할을 연결해보세요."
    controls={<StructureChoices label="단면 영역" value={selected} options={layers} onChange={setSelected}/>}
    feedback={layer.detail} takeaway="Transistor를 만든 뒤 접점을 거쳐 여러 금속 배선층으로 회로를 연결한다." onReset={() => setSelected('all')}>
    <div className="structure-layout"><StructureView title={`${layer.label} 칩 단면`} description={layer.detail} height={390}>
      <g className={cls('beol')}><rect x="12" y="12" width="336" height="136" rx="8"/><text x="26" y="38">BEOL · Metal / Via</text>
        <path className="structure-metal" d="M220 64 H312 M38 128 H110 M145 128 H215 M250 128 H312"/><path className="structure-via" d="M280 64 V128"/><text x="220" y="101">Via</text></g>
      <g className={cls('mol')}><rect x="12" y="153" width="336" height="85" rx="8"/></g>
      <g className={cls('feol')}><rect x="12" y="243" width="336" height="134" rx="8"/><path className="structure-substrate" d="M28 300 H332 V356 H28 Z"/>
        <rect className="structure-device" x="45" y="299" width="70" height="26"/><rect className="structure-device" x="245" y="299" width="70" height="26"/>
        <rect className="structure-oxide" x="136" y="293" width="88" height="7"/><rect className="structure-device" x="136" y="265" width="88" height="28"/>
        <text x="80" y="319" textAnchor="middle">Source</text><text x="180" y="284" textAnchor="middle">Gate</text><text x="280" y="319" textAnchor="middle">Drain</text><text x="180" y="349" textAnchor="middle">FEOL · Silicon / Transistor</text></g>
      <path className="structure-contact" d="M80 128 V299 M180 128 V265 M280 128 V299"/>
      <rect x="90" y="181" width="180" height="34" rx="6" fill="#f8fbfa"/>
      <text x="180" y="205" textAnchor="middle">MOL · Contact</text>
    </StructureView><div className="structure-explanation"><strong>{layer.label}</strong><p>{layer.detail}</p><ul><li>FEOL: Gate / Source / Drain과 Channel</li><li>MOL: 단자와 배선을 잇는 Contact</li><li>BEOL: Metal 사이를 잇는 Via</li></ul><p>Gate 아래 얇게 표시한 부분은 Oxide 절연막입니다. 단자별 독립 연결을 예시하며 배선은 일부 생략했습니다.</p></div></div>
    <p className="structure-note">층수·두께·공정 경계를 단순화한 개념도입니다. 실제 제품의 배선층 수를 뜻하지 않습니다.</p>
  </DiagramFrame>;
}
