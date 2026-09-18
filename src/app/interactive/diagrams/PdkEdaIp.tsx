import { useState } from 'react';
import { DiagramFrame } from '../DiagramFrame.js';
import { StatusBadge } from '../primitives/StatusBadge.js';
import { StructureChoices } from '../primitives/StructureView.js';
import type { InteractiveProps } from '../types.js';

type Case = 'spacing' | 'connectivity' | 'reuse';
const options = [{ value: 'spacing', label: '간격·형상 오류' }, { value: 'connectivity', label: '연결 불일치' }, { value: 'reuse', label: '기능 블록 재사용' }] as const;
const cases: Record<Case, { check: string; pdk: string; eda: string; ip: string }> = {
  spacing: { check: 'DRC', pdk: '공정이 허용하는 간격과 형상 규칙을 제공합니다.', eda: 'DRC 도구가 레이아웃을 규칙과 비교합니다.', ip: '직접 원인은 아니지만 사용한 IP도 대상 공정 규칙에 맞아야 합니다.' },
  connectivity: { check: 'LVS', pdk: '소자 모델과 레이어 정의가 비교의 기반이 됩니다.', eda: 'LVS 도구가 레이아웃과 회로도의 연결 관계를 비교합니다.', ip: '재사용 블록의 핀과 연결 계약도 검증 대상입니다.' },
  reuse: { check: 'IP 적용', pdk: '대상 공정에서 지원되는지 확인합니다.', eda: '통합·검증·구현에 도구를 사용합니다.', ip: '검증된 기능 블록을 설계 자산으로 재사용합니다.' },
};

export default function PdkEdaIp(_props: InteractiveProps) {
  const [selected, setSelected] = useState<Case>('spacing');
  const item = cases[selected];
  return <DiagramFrame title="PDK · EDA · IP" objective="설계 사례마다 규칙, 도구, 재사용 자산이 맡는 역할을 구분하세요."
    controls={<StructureChoices label="사례 선택" value={selected} options={options} onChange={setSelected} />}
    feedback={<><StatusBadge tone="confirmed">{item.check}</StatusBadge><p>{selected === 'spacing' ? 'DRC는 형상과 규칙을 검사합니다.' : selected === 'connectivity' ? 'LVS는 layout과 schematic의 연결 관계를 비교합니다.' : 'IP는 재사용 가능한 설계 블록입니다.'}</p></>}
    takeaway="PDK는 공정과 설계의 규칙, EDA는 설계·검증 도구, IP는 재사용 가능한 설계 자산입니다.">
    <div className="role-card-grid">
      <article><strong>PDK</strong><p>{item.pdk}</p></article><article><strong>EDA</strong><p>{item.eda}</p></article><article><strong>IP</strong><p>{item.ip}</p></article>
    </div>
    <p className="model-note">DRC와 LVS를 통과해도 기능, 타이밍, 전력, 신뢰성 등 모든 제품 검증이 끝난 것은 아닙니다.</p>
  </DiagramFrame>;
}
