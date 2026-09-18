import { useState } from 'react';
import { DiagramFrame } from '../DiagramFrame.js';
import { StructureChoices } from '../primitives/StructureView.js';
import type { InteractiveProps } from '../types.js';

type Role = 'fabless' | 'foundry' | 'idm' | 'osat' | 'support';
const roles = [
  { value: 'fabless', label: 'Fabless' }, { value: 'foundry', label: 'Foundry' },
  { value: 'idm', label: 'IDM' }, { value: 'osat', label: 'OSAT' },
  { value: 'support', label: 'IP / EDA' },
] as const;
const facts: Record<Role, { work: string; partners: string; stages: number[] }> = {
  fabless: { work: '제품과 칩을 설계하고 제조를 외부 파트너에 맡깁니다.', partners: 'Foundry와 OSAT, IP·EDA 생태계와 연결됩니다.', stages: [0] },
  foundry: { work: '설계 데이터를 받아 웨이퍼 공정으로 칩을 제조합니다.', partners: 'Fabless·IDM의 설계와 OSAT의 후공정 사이를 잇습니다.', stages: [1] },
  idm: { work: '설계와 제조를 한 조직 안에서 함께 수행할 수 있습니다.', partners: '제품에 따라 외부 Foundry나 OSAT와도 협업할 수 있습니다.', stages: [0, 1] },
  osat: { work: '웨이퍼·다이를 검사하고 패키징과 최종 시험을 수행합니다.', partners: 'Foundry나 IDM에서 나온 다이를 제품 단계로 연결합니다.', stages: [2] },
  support: { work: '재사용 설계 자산과 설계·검증 도구를 제공합니다.', partners: '설계와 제조 준비 전반을 지원하지만 제품을 한 단계만으로 완성하지는 않습니다.', stages: [0, 1] },
};
const stages = ['Design', 'Manufacturing', 'Packaging / Test', 'Product'];

export default function SemiconductorEcosystem(_props: InteractiveProps) {
  const [role, setRole] = useState<Role>('fabless');
  const fact = facts[role];
  return <DiagramFrame title="반도체 생태계 역할" objective="역할을 선택해 제품 흐름에서 맡는 일과 협업 지점을 확인하세요."
    controls={<StructureChoices label="역할 선택" value={role} options={roles} onChange={setRole} />}
    feedback={<><strong>{roles.find(item => item.value === role)!.label}</strong><p>{fact.work} {fact.partners}</p></>}
    takeaway="반도체 생태계에서는 설계·제조·패키징·검사 역할이 여러 조직을 거쳐 연결되며, 한 기업이 여러 역할을 겸할 수도 있습니다.">
    <ol className="value-chain" aria-label="반도체 제품 흐름">
      {stages.map((stage, index) => <li key={stage} className={fact.stages.includes(index) ? 'selected' : ''}>
        <span aria-hidden="true">{fact.stages.includes(index) ? '●' : '○'}</span><strong>{stage}</strong>
      </li>)}
    </ol>
    <p className="model-note">역할은 고정된 회사 분류가 아니라 이 제품 흐름에서 수행하는 일입니다.</p>
  </DiagramFrame>;
}
