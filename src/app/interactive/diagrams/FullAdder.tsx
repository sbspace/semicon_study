import { useId, useState } from 'react';
import { DiagramFrame } from '../DiagramFrame.js';
import { fullAdd } from '../logic.js';
import { BinaryToggle, type Bit } from '../primitives/BinaryToggle.js';
import type { InteractiveProps } from '../types.js';

export default function FullAdder(_props: InteractiveProps) {
  const [a,setA]=useState<Bit>(0),[b,setB]=useState<Bit>(0),[cin,setCin]=useState<Bit>(0); const result=fullAdd(a,b,cin); const titleId=useId(),descId=useId();
  const rows=([0,1] as const).flatMap(x=>([0,1] as const).flatMap(y=>([0,1] as const).map(c=>({a:x,b:y,cin:c,...fullAdd(x,y,c)}))));
  const feedback=`A ${a} + B ${b} + Cin ${cin} → Sum ${result.sum}, Cout ${result.carryOut}`;
  return <DiagramFrame title="Full Adder" objective="이전 자리의 Carry-in까지 받아 Sum과 Carry-out을 만드는 흐름을 확인하세요." controls={<div className="batch-controls"><BinaryToggle label="A" value={a} onChange={setA}/><BinaryToggle label="B" value={b} onChange={setB}/><BinaryToggle label="Cin" value={cin} onChange={setCin}/></div>} feedback={feedback} takeaway="Full Adder는 Carry-in을 받아 여러 bit 덧셈을 이어갈 수 있다." onReset={()=>{setA(0);setB(0);setCin(0);}}>
    <div className="adder-layout"><svg viewBox="0 0 700 300" role="img" aria-labelledby={`${titleId} ${descId}`}><title id={titleId}>Full Adder A {a}, B {b}, Cin {cin}</title><desc id={descId}>{feedback}</desc><text x="35" y="80">A {a}</text><text x="35" y="120">B {b}</text><text x="35" y="235">Cin {cin}</text><rect className="logic-gate" x="120" y="55" width="170" height="100" rx="18"/><text x="205" y="92" textAnchor="middle">Half Adder 1</text><text x="205" y="122" textAnchor="middle">중간 Sum {result.first.sum}</text><text x="205" y="145" textAnchor="middle">Carry {result.first.carry}</text><path className="concept-wire active" d="M290 105 H360"/><rect className="logic-gate" x="360" y="90" width="170" height="100" rx="18"/><text x="445" y="127" textAnchor="middle">Half Adder 2</text><text x="445" y="157" textAnchor="middle">Sum {result.sum}</text><path className="concept-wire" d="M80 230 H330 V160 H360"/><path className="concept-wire active" d="M530 140 H650"/><text className="output-bit" x="565" y="125">Sum {result.sum}</text><path className="concept-wire active" d="M205 155 V245 H570 M445 190 V245 H570"/><circle className="output-node" cx="570" cy="245" r="8"/><text className="output-bit" x="590" y="252">Cout {result.carryOut}</text></svg><table className="logic-truth-table compact"><caption>Full Adder 진리표</caption><thead><tr><th>A</th><th>B</th><th>Cin</th><th>Sum</th><th>Cout</th></tr></thead><tbody>{rows.map((r,i)=><tr key={i} aria-current={r.a===a&&r.b===b&&r.cin===cin?'true':undefined}><td>{r.a}</td><td>{r.b}</td><td>{r.cin}</td><td>{r.sum}</td><td>{r.carryOut}</td></tr>)}</tbody></table></div>
  </DiagramFrame>;
}
