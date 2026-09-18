import { useId, useState } from 'react';
import { DiagramFrame } from '../DiagramFrame.js';
import { BinaryToggle, type Bit } from '../primitives/BinaryToggle.js';
import type { InteractiveProps } from '../types.js';

export default function FlipflopRegister(_props: InteractiveProps) {
  const [d,setD]=useState<Bit>(0),[q,setQ]=useState<Bit>(0),[history,setHistory]=useState<Bit[]>([0]); const titleId=useId(),descId=useId();
  const clock=()=>{setQ(d);setHistory(values=>[...values.slice(-3),d]);};
  return <DiagramFrame title="D Flip-Flop과 Register" objective="D를 바꾼 뒤 Clock 상승 edge에서만 Q가 저장되는지 확인하세요." controls={<div className="batch-controls"><BinaryToggle label="D" value={d} onChange={setD}/><button className="clock-button" type="button" onClick={clock}>Clock ↑</button></div>} feedback={d===q?`D=${d}, Q=${q}. 다음 Clock edge에서도 같은 값을 저장합니다.`:`D는 ${d}로 바뀌었지만 Q 값 ${q}을 유지합니다. Clock ↑에서만 Q가 갱신됩니다.`} takeaway="Flip-Flop은 clock edge에서 1 bit를 저장하고, 여러 개를 모으면 register가 된다." onReset={()=>{setD(0);setQ(0);setHistory([0]);}}>
    <div className="flipflop-layout"><svg viewBox="0 0 600 260" role="img" aria-labelledby={`${titleId} ${descId}`}><title id={titleId}>D Flip-Flop D {d}, 저장된 Q {q}</title><desc id={descId}>D 입력은 {d}, 저장된 Q는 {q}이며 Q는 Clock 상승 edge에서만 바뀝니다.</desc><text className="input-bit" x="55" y="115">D {d}</text><path className="concept-wire" d="M95 105 H205"/><rect className="logic-gate memory" x="205" y="45" width="190" height="155" rx="18"/><text x="300" y="95" textAnchor="middle">D Flip-Flop</text><text className="concept-value" x="300" y="140" textAnchor="middle">저장 Q = {q}</text><path className="clock-edge" d="M230 178 h25 l18 -25 l18 25 h55"/><path className="concept-wire active" d="M395 105 H520"/><text className="output-bit" x="530" y="115">Q {q}</text></svg><div className="timeline" aria-label="최근 Clock 저장 기록"><span>최근 Clock edge</span>{history.map((value,i)=><strong key={i}>{value}</strong>)}</div><div className="register-concept"><strong>4-bit Register</strong><span>[ Flip-Flop ][ Flip-Flop ][ Flip-Flop ][ Flip-Flop ]</span><small>여러 bit를 같은 clock에서 병렬로 저장하는 개념</small></div></div>
  </DiagramFrame>;
}
