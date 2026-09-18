import { useState } from 'react';
import { DiagramFrame } from '../DiagramFrame.js';
import { StructureBlock, StructureChoices, StructureView } from '../primitives/StructureView.js';
import type { InteractiveProps } from '../types.js';
export default function ChipletPackage(_props: InteractiveProps) {
  const [integration, setIntegration] = useState<'mono' | 'chiplet'>('mono');
  const [placement, setPlacement] = useState<'side' | 'stack'>('side');
  const mono = integration === 'mono';
  const feedback = mono ? 'Monolithic: 계산·저장·I/O 기능을 하나의 Die 안에 넣습니다. 내부 배선으로 기능을 연결합니다.' : placement === 'side'
    ? 'Chiplet을 나란히 배치한 2.5D 계열 예입니다. Interposer의 고밀도 배선이 Die 사이를 연결합니다. Chiplet이 반드시 3D 적층인 것은 아닙니다.'
    : 'Chiplet을 위아래로 쌓은 3D 계열 예입니다. 수직 접합과 연결이 필요합니다. 기능을 나누는 것과 배치 방식은 별개의 선택입니다.';
  return <DiagramFrame title="Monolithic · Chiplet" objective="기능을 나누는 방식과 Die의 배치를 두 축으로 살펴보세요."
    controls={<div className="structure-controls"><StructureChoices label="기능 통합" value={integration} options={[{value:'mono',label:'Monolithic'},{value:'chiplet',label:'Chiplet'}]} onChange={setIntegration}/>
      {!mono && <StructureChoices label="배치 사례" value={placement} options={[{value:'side',label:'나란히 · 2.5D 예'},{value:'stack',label:'적층 · 3D 예'}]} onChange={setPlacement}/>}</div>}
    feedback={feedback} takeaway="Chiplet은 기능을 여러 Die로 나누는 개념이고, 그 Die들을 어떻게 배치하는지는 또 다른 문제다."
    onReset={() => {setIntegration('mono');setPlacement('side');}}>
    <div className="structure-layout"><StructureView title={mono ? '하나의 Monolithic Die' : placement === 'side' ? 'Chiplet 나란히 배치' : 'Chiplet 수직 적층'} description={feedback} height={340}>
      {mono ? <g><rect className="structure-outline" x="25" y="45" width="310" height="165" rx="12"/><text x="180" y="76" textAnchor="middle">하나의 Die</text>
        <StructureBlock x={40} y={100} width={80} height={60} label="계산"/><StructureBlock x={140} y={100} width={80} height={60} label="저장"/><StructureBlock x={240} y={100} width={80} height={60} label="I/O"/><path className="structure-path" d="M120 130 H140 M220 130 H240 M180 210 V282"/></g>
        : placement === 'side' ? <g><StructureBlock x={25} y={100} width={140} height={90} label="계산 Die" selected/><StructureBlock x={195} y={100} width={140} height={90} label="I/O Die" selected/>
          <StructureBlock x={15} y={223} width={330} height={44} label="Interposer"/><path className="structure-path" d="M95 190 V233 H265 V190 M95 267 V282 M265 267 V282"/><text x="180" y="70" textAnchor="middle">별도 Die · 나란히</text></g>
        : <g><StructureBlock x={65} y={30} width={230} height={65} label="계산 Die" selected/><StructureBlock x={65} y={143} width={230} height={65} label="I/O Die" selected/>
          <path className="structure-path" d="M110 95 V143 M250 95 V143 M180 208 V282"/><text x="180" y="125" textAnchor="middle">수직 연결</text></g>}
      <StructureBlock x={12} y={282} width={336} height={45} label="Package 기판"/>
    </StructureView><div className="structure-explanation"><strong>{mono ? '기능 통합: 하나의 Die' : '기능 분할: 여러 Die'}</strong><p>{feedback}</p><p>나란히 놓는 모든 구조가 2.5D인 것은 아닙니다. 이 예시는 Interposer를 이용한 고밀도 연결을 보여줍니다.</p><p>Die 사이의 통신·열·조립 검증도 필요하며 분할이 모든 지표의 개선을 보장하지 않습니다.</p></div></div>
    <p className="structure-note">기능과 배치만 비교하는 개념도입니다. 특정 제품·면적 비율·실제 접합 구조를 재현하지 않습니다.</p>
  </DiagramFrame>;
}
