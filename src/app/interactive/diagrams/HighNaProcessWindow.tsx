import { useState } from 'react';
import { DiagramFrame } from '../DiagramFrame.js';
import { RelativeBars } from '../primitives/ConceptView.js';
import { StructureChoices } from '../primitives/StructureView.js';
import type { InteractiveProps } from '../types.js';

type Na = 'standard' | 'higher'; type Focus = 'center' | 'slight' | 'offset';
const focusPenalty: Record<Focus, number> = { center: 0, slight: 18, offset: 42 };
export default function HighNaProcessWindow(_props: InteractiveProps) {
  const [na, setNa] = useState<Na>('standard');
  const [focus, setFocus] = useState<Focus>('center');
  const clarity = Math.max(12, (na === 'higher' ? 92 : 68) - focusPenalty[focus] * (na === 'higher' ? 1.25 : .75));
  const window = Math.max(12, (na === 'higher' ? 48 : 82) - focusPenalty[focus] * .55);
  return <DiagramFrame title="High-NA와 공정 창" objective="같은 EUV 파장에서 NA와 초점 위치가 정성적 패턴 선명도와 공정 창에 주는 영향을 비교하세요."
    controls={<div className="concept-controls"><StructureChoices label="NA 사례" value={na} options={[{ value: 'standard', label: '표준 NA' }, { value: 'higher', label: '더 높은 NA' }]} onChange={setNa} /><StructureChoices label="초점 위치" value={focus} options={[{ value: 'center', label: '중심' }, { value: 'slight', label: '약간 벗어남' }, { value: 'offset', label: '더 벗어남' }]} onChange={setFocus} /></div>}
    feedback={<><strong>{na === 'higher' ? '더 높은 NA' : '표준 NA'} · {focus === 'center' ? '초점 중심' : focus === 'slight' ? '약간의 초점 오차' : '큰 초점 오차'}</strong><p>{na === 'higher' ? '미세 패턴을 더 선명하게 구분할 가능성이 크지만 초점 허용 범위는 더 좁습니다.' : '선명도 이득은 작지만 상대적으로 넓은 초점 허용 범위를 갖는 사례입니다.'}</p></>}
    takeaway="High-NA는 미세 패턴 형성 능력을 높이는 접근이지만, 공정 창과 생산성 등 다른 조건을 함께 고려해야 합니다.">
    <RelativeBars items={[{ label: '패턴 선명도', value: clarity, detail: '정성 비교' }, { label: '초점 허용 범위', value: window, detail: '정성 비교' }, { label: 'EUV 파장', value: 70, detail: '두 사례가 같음' }]} />
    <p className="model-note">교육용 정성 모델이며 실제 nm 해상도, 장비 성능, 생산량을 계산하지 않습니다.</p>
  </DiagramFrame>;
}
