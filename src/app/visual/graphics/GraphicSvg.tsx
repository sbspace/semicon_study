import { useId, type ReactNode } from 'react';

export function GraphicSvg({ title, description, className, viewBox = '0 0 760 420', children }: {
  title: string;
  description: string;
  className: string;
  viewBox?: string;
  children: ReactNode;
}) {
  const titleId = useId();
  const descriptionId = useId();
  return (
    <svg className={`visual-svg ${className}`} viewBox={viewBox} role="img" aria-labelledby={`${titleId} ${descriptionId}`}>
      <title id={titleId}>{title}</title>
      <desc id={descriptionId}>{description}</desc>
      {children}
    </svg>
  );
}

export function PanelTitle({ x, children }: { x: number; children: ReactNode }) {
  return <text className="visual-panel-title" x={x} y="30" textAnchor="middle">{children}</text>;
}
