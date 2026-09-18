import { useId, type ReactNode } from 'react';

export interface ProcessStep { label: string; detail: string }

export function ProcessView({ title, description, children, height = 280 }: {
  title: string; description: string; children: ReactNode; height?: number;
}) {
  const id = useId();
  return <svg className="process-view" viewBox={`0 0 420 ${height}`} role="img" aria-labelledby={`${id}-title`} aria-describedby={`${id}-desc`}>
    <title id={`${id}-title`}>{title}</title><desc id={`${id}-desc`}>{description}</desc>{children}
  </svg>;
}

export function ProcessStepControls({ steps, index, onChange }: {
  steps: readonly ProcessStep[]; index: number; onChange: (index: number) => void;
}) {
  return <div className="process-step-controls">
    <div className="process-step-buttons">
      <button type="button" disabled={index === 0} onClick={() => onChange(0)}>처음으로</button>
      <button type="button" disabled={index === 0} onClick={() => onChange(index - 1)}>이전 단계</button>
      <strong aria-live="polite">{index + 1} / {steps.length} · {steps[index]!.label}</strong>
      <button type="button" disabled={index === steps.length - 1} onClick={() => onChange(index + 1)}>다음 단계</button>
    </div>
    <ol aria-label="공정 단계">
      {steps.map((step, stepIndex) => <li key={step.label} className={stepIndex === index ? 'current' : ''}>
        <button type="button" aria-current={stepIndex === index ? 'step' : undefined} onClick={() => onChange(stepIndex)}>{step.label}</button>
      </li>)}
    </ol>
  </div>;
}

export function MaterialLayer({ x, y, width, height, label, kind = 'film' }: {
  x: number; y: number; width: number; height: number; label: string; kind?: 'wafer'|'film'|'pr'|'metal'|'oxide';
}) {
  return <g className={`process-layer ${kind}`}><rect x={x} y={y} width={width} height={height} rx="3"/><text x={x + width / 2} y={y + height / 2 + 5} textAnchor="middle">{label}</text></g>;
}

export function ProcessExplanation({ heading, children }: { heading: string; children: ReactNode }) {
  return <div className="process-explanation"><strong>{heading}</strong>{children}</div>;
}
