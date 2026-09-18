import { useId, useState } from 'react';
import { DiagramFrame } from '../DiagramFrame.js';
import type { InteractiveProps } from '../types.js';

type Doping = 'pure' | 'n' | 'p';
const INFO = { pure: { title: 'Pure Silicon', dopant: 'Dopant 없음', carrier: '자유 carrier가 매우 적음' }, n: { title: 'N-type', dopant: 'Donor', carrier: '다수 carrier · Electron' }, p: { title: 'P-type', dopant: 'Acceptor', carrier: '다수 carrier · Hole' } } as const;

export default function NpDoping(_props: InteractiveProps) {
  const [kind, setKind] = useState<Doping>('pure'); const titleId = useId(); const descId = useId(); const info = INFO[kind];
  const feedback = kind === 'pure' ? '순수 Silicon은 결합에 참여할 자유 carrier가 상대적으로 적습니다.' : kind === 'n' ? 'Donor가 사용 가능한 전자를 늘려 Electron이 다수 carrier가 됩니다.' : 'Acceptor가 전자가 비어 있는 자리인 Hole을 만들어 Hole이 다수 carrier가 됩니다.';
  return <DiagramFrame title="Silicon Doping" objective="순수 Silicon과 N형·P형에서 dopant와 다수 carrier가 어떻게 달라지는지 비교하세요." controls={<div className="segmented-control" role="group" aria-label="도핑 종류">{(['pure','n','p'] as const).map(value => <button key={value} type="button" aria-pressed={kind === value} onClick={() => setKind(value)}>{INFO[value].title}</button>)}</div>} feedback={feedback} takeaway="도핑은 실리콘 전체를 대전시키는 것이 아니라 사용 가능한 carrier의 종류와 수를 바꾼다." onReset={() => setKind('pure')}>
    <div className="doping-layout"><svg viewBox="0 0 560 330" role="img" aria-labelledby={`${titleId} ${descId}`}><title id={titleId}>{info.title} 개념도</title><desc id={descId}>{feedback} 원자 배치를 실제 결정 구조의 정밀 모형으로 표현한 것은 아닙니다.</desc>{Array.from({length:12},(_,i) => { const x=90+(i%4)*125,y=75+Math.floor(i/4)*90; const dopant = kind !== 'pure' && i===5; return <g key={i}><circle className={dopant ? `lattice-atom dopant ${kind}` : 'lattice-atom'} cx={x} cy={y} r="26"/><text x={x} y={y+6} textAnchor="middle">{dopant ? (kind==='n'?'D':'A') : 'Si'}</text></g>;})}{kind === 'n' && <g className="free-carrier"><circle cx="320" cy="38" r="13"/><text x="320" y="43" textAnchor="middle">e⁻</text></g>}{kind === 'p' && <g className="hole-carrier"><circle cx="320" cy="38" r="15"/><text x="320" y="43" textAnchor="middle">h⁺</text></g>}</svg><div className="concept-results"><strong>{info.title}</strong><span>{info.dopant}</span><span>{info.carrier}</span><p>전체 물질은 전기적으로 거의 중성입니다. N/P는 물질 전체 전하의 부호가 아닙니다.</p></div></div>
  </DiagramFrame>;
}
