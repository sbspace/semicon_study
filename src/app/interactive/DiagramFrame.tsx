import type { ReactNode } from 'react';

export function DiagramFrame({ title, objective, controls, children, feedback, feedbackLive = true, takeaway, onReset }: {
  title: string;
  objective: string;
  controls?: ReactNode;
  children: ReactNode;
  feedback?: ReactNode;
  feedbackLive?: boolean;
  takeaway?: ReactNode;
  onReset?: () => void;
}) {
  return (
    <section className="interactive-diagram" aria-label={title}>
      <header className="interactive-diagram-header">
        <div>
          <span className="placeholder-kicker">Interactive diagram</span>
          <h2>{title}</h2>
          <p>{objective}</p>
        </div>
        {onReset !== undefined && <button className="interactive-reset" type="button" onClick={onReset}>초기화</button>}
      </header>
      {controls !== undefined && <div className="interactive-controls">{controls}</div>}
      <div className="interactive-result">{children}</div>
      {feedback !== undefined && <div className="interactive-feedback" aria-live={feedbackLive ? 'polite' : undefined}>{feedback}</div>}
      {takeaway !== undefined && <p className="interactive-takeaway"><strong>핵심</strong>{takeaway}</p>}
    </section>
  );
}
