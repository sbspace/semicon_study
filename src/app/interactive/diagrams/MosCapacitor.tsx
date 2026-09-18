import { useId, useState } from 'react';
import { DiagramFrame } from '../DiagramFrame.js';
import type { InteractiveProps } from '../types.js';

type Voltage = 'low' | 'high';
type Phase = 'just-changed' | 'steady';

export default function MosCapacitor(_props: InteractiveProps) {
  const [voltage, setVoltage] = useState<Voltage>('low');
  const [phase, setPhase] = useState<Phase>('steady');
  const titleId = useId(); const descId = useId();
  const charge = voltage === 'low' ? '거의 없음' : phase === 'just-changed' ? '이동 중' : '서로 반대 전하가 모임';
  const feedback = voltage === 'low' ? 'Gate와 semiconductor 사이 전압 차이가 작아 뚜렷한 전하 분리가 없습니다.' : phase === 'just-changed' ? '전압을 바꾼 직후 양쪽 표면의 전하가 재배치되고 있습니다.' : 'Gate와 semiconductor 표면에 반대 전하가 모이고 Oxide 사이에 전기장이 형성됩니다.';
  const chooseVoltage = (next: Voltage) => { setVoltage(next); setPhase(next === voltage ? phase : 'just-changed'); };
  return <DiagramFrame title="MOS Capacitor" objective="Gate–Oxide–Semiconductor 구조에서 전하와 전기장이 어떻게 형성되는지 확인하세요." controls={<div className="batch-controls"><div className="segmented-control" role="group" aria-label="Gate 상태"><button type="button" aria-pressed={voltage === 'low'} onClick={() => chooseVoltage('low')}>LOW</button><button type="button" aria-pressed={voltage === 'high'} onClick={() => chooseVoltage('high')}>HIGH</button></div><div className="segmented-control" role="group" aria-label="시간 상태"><button type="button" aria-pressed={phase === 'just-changed'} onClick={() => setPhase('just-changed')}>전압 변경 직후</button><button type="button" aria-pressed={phase === 'steady'} onClick={() => setPhase('steady')}>정상 상태</button></div></div>} feedback={feedback} takeaway="Gate와 semiconductor는 절연막을 사이에 둔 용량성 구조다." onReset={() => { setVoltage('low'); setPhase('steady'); }}>
    <div className="concept-panel mos-capacitor-panel"><svg viewBox="0 0 600 330" role="img" aria-labelledby={`${titleId} ${descId}`}><title id={titleId}>MOS capacitor {voltage.toUpperCase()}, {phase === 'steady' ? '정상 상태' : '변경 직후'}</title><desc id={descId}>{feedback} Oxide를 가로지르는 DC 전류는 표시하지 않습니다.</desc><rect className="mos-cap-gate" x="120" y="35" width="360" height="70" rx="12"/><text x="300" y="66" textAnchor="middle">Gate · {voltage.toUpperCase()}</text><text className="charge-text positive" x="300" y="94" textAnchor="middle">{voltage === 'high' ? '+ + + + +' : '전하 분리 거의 없음'}</text><rect className="mos-cap-oxide" x="100" y="130" width="400" height="50" rx="8"/><text x="300" y="162" textAnchor="middle">Oxide · 절연막</text>{voltage === 'high' && <path className={`mos-cap-field ${phase}`} d="M175 112 V198 M250 112 V198 M325 112 V198 M400 112 V198"/>}<rect className="mos-cap-semiconductor" x="70" y="205" width="460" height="90" rx="12"/><text x="300" y="270" textAnchor="middle">Semiconductor</text><text className="charge-text negative" x="300" y="235" textAnchor="middle">{voltage === 'high' ? '− − − − −' : '전하 분리 거의 없음'}</text></svg><div className="result-strip"><strong>전하 상태: {charge}</strong><span>Oxide는 Gate와 semiconductor를 전기적으로 절연합니다.</span></div></div>
  </DiagramFrame>;
}
