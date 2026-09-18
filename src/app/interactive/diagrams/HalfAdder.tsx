import { useId, useState } from 'react';
import { DiagramFrame } from '../DiagramFrame.js';
import { halfAdd } from '../logic.js';
import { BinaryToggle, type Bit } from '../primitives/BinaryToggle.js';
import type { InteractiveProps } from '../types.js';

export default function HalfAdder(_props: InteractiveProps) {
  const [a,setA]=useState<Bit>(0),[b,setB]=useState<Bit>(0); const {sum,carry}=halfAdd(a,b); const titleId=useId(),descId=useId();
  const rows=([0,1] as const).flatMap(x=>([0,1] as const).map(y=>({a:x,b:y,...halfAdd(x,y)})));
  const feedback=`${a} + ${b} → Carry ${carry}, Sum ${sum} → 이진 결과 ${carry}${sum}`;
  return <DiagramFrame title="Half Adder" objective="두 bit가 XOR와 AND를 거쳐 Sum과 Carry가 되는 과정을 확인하세요." controls={<div className="batch-controls"><BinaryToggle label="A" value={a} onChange={setA}/><BinaryToggle label="B" value={b} onChange={setB}/></div>} feedback={feedback} takeaway="Half Adder는 두 bit를 더해 Sum과 Carry를 만든다." onReset={()=>{setA(0);setB(0);}}>
    <div className="adder-layout"><svg viewBox="0 0 620 300" role="img" aria-labelledby={`${titleId} ${descId}`}><title id={titleId}>Half Adder {a} 더하기 {b}</title><desc id={descId}>XOR 출력 Sum은 {sum}, AND 출력 Carry는 {carry}, 이진 결과는 {carry}{sum}입니다.</desc><text className="input-bit" x="60" y="100">A {a}</text><text className="input-bit" x="60" y="220">B {b}</text><path className="concept-wire" d="M100 92 H220 M100 212 H180 V92 H220 M100 92 H180 V212 H220 M100 212 H220"/><rect className="logic-gate" x="220" y="55" width="150" height="75" rx="18"/><text x="295" y="99" textAnchor="middle">XOR</text><rect className="logic-gate" x="220" y="175" width="150" height="75" rx="18"/><text x="295" y="219" textAnchor="middle">AND</text><path className="concept-wire active" d="M370 92 H530 M370 212 H530"/><text className="output-bit" x="545" y="100">Sum {sum}</text><text className="output-bit" x="545" y="220">Carry {carry}</text></svg><div className="binary-result"><span>Carry Sum</span><strong>{carry}{sum}</strong></div><table className="logic-truth-table"><caption>Half Adder 진리표</caption><thead><tr><th>A</th><th>B</th><th>Sum</th><th>Carry</th></tr></thead><tbody>{rows.map((r,i)=><tr key={i} aria-current={r.a===a&&r.b===b?'true':undefined}><td>{r.a}</td><td>{r.b}</td><td>{r.sum}</td><td>{r.carry}</td></tr>)}</tbody></table></div>
  </DiagramFrame>;
}
