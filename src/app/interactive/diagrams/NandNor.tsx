import { useId, useState } from 'react';
import { DiagramFrame } from '../DiagramFrame.js';
import { BinaryToggle, type Bit } from '../primitives/BinaryToggle.js';
import type { InteractiveProps } from '../types.js';

type Gate = 'nand' | 'nor';

export default function NandNor(_props: InteractiveProps) {
  const [gate, setGate] = useState<Gate>('nand'); const [a,setA]=useState<Bit>(0); const [b,setB]=useState<Bit>(0); const titleId=useId(); const descId=useId();
  const pullDown = gate === 'nand' ? a===1&&b===1 : a===1||b===1; const y:Bit=pullDown?0:1;
  const nmosTopology=gate==='nand'?'직렬':'병렬'; const pmosTopology=gate==='nand'?'병렬':'직렬';
  const rows:[[Bit,Bit],Bit][]=[[[0,0],1],[[0,1],gate==='nand'?1:0],[[1,0],gate==='nand'?1:0],[[1,1],0]];
  const feedback=`${gate.toUpperCase()} · A=${a}, B=${b}: NMOS ${nmosTopology}망이 ${pullDown?'GND 경로를 열어':'GND 경로를 열지 못해'} Y=${y}입니다.`;
  return <DiagramFrame title="NAND / NOR Network" objective="직렬·병렬 pull-up/pull-down 경로가 출력 논리를 만드는 과정을 확인하세요." controls={<div className="batch-controls"><div className="segmented-control" role="group" aria-label="Gate 종류"><button type="button" aria-pressed={gate==='nand'} onClick={()=>setGate('nand')}>NAND</button><button type="button" aria-pressed={gate==='nor'} onClick={()=>setGate('nor')}>NOR</button></div><BinaryToggle label="A" value={a} onChange={setA}/><BinaryToggle label="B" value={b} onChange={setB}/></div>} feedback={feedback} takeaway="NAND는 NMOS 직렬·PMOS 병렬, NOR는 NMOS 병렬·PMOS 직렬 구조로 출력을 만든다." onReset={()=>{setGate('nand');setA(0);setB(0);}}>
    <div className="logic-network-layout"><svg viewBox="0 0 600 360" role="img" aria-labelledby={`${titleId} ${descId}`}><title id={titleId}>{gate.toUpperCase()} A {a}, B {b}, Y {y}</title><desc id={descId}>{feedback}</desc><text className="rail-label" x="300" y="28" textAnchor="middle">VDD · Pull-up</text><line className="rail" x1="150" y1="45" x2="450" y2="45"/><g className={`network-block ${y===1?'active':''}`}><rect x="160" y="70" width="280" height="80" rx="14"/><text x="300" y="103" textAnchor="middle">PMOS {pmosTopology}</text><text x="300" y="130" textAnchor="middle">{y===1?'VDD 경로 ON':'VDD 경로 OFF'}</text></g><path className={`circuit-path ${y===1?'active':'inactive'}`} d="M300 45 V70 M300 150 V185"/><circle className="output-node" cx="300" cy="185" r="9"/><text className="concept-value" x="330" y="194">Y = {y}</text><path className={`circuit-path ${pullDown?'active':'inactive'}`} d="M300 185 V220"/><g className={`network-block ${pullDown?'active':''}`}><rect x="160" y="220" width="280" height="80" rx="14"/><text x="300" y="253" textAnchor="middle">NMOS {nmosTopology}</text><text x="300" y="280" textAnchor="middle">{pullDown?'GND 경로 ON':'GND 경로 OFF'}</text></g><text className="rail-label" x="300" y="335" textAnchor="middle">GND · Pull-down</text></svg><table className="logic-truth-table"><caption>{gate.toUpperCase()} 진리표</caption><thead><tr><th>A</th><th>B</th><th>Y</th></tr></thead><tbody>{rows.map((row,i)=><tr key={i} aria-current={row[0][0]===a&&row[0][1]===b?'true':undefined}><td>{row[0][0]}</td><td>{row[0][1]}</td><td>{row[1]}</td></tr>)}</tbody></table></div>
  </DiagramFrame>;
}
