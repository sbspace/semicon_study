import { useId, type ReactNode } from 'react';

export function StackView({ title, description, children, height = 330 }: {
  title: string;
  description: string;
  children: ReactNode;
  height?: number;
}) {
  const id = useId();
  return <svg className="stack-view" viewBox={`0 0 440 ${height}`} role="img" aria-labelledby={`${id}-title`} aria-describedby={`${id}-desc`}>
    <title id={`${id}-title`}>{title}</title>
    <desc id={`${id}-desc`}>{description}</desc>
    {children}
  </svg>;
}

export function StackDie({ y, label, kind = 'dram', selected = false }: {
  y: number;
  label: string;
  kind?: 'dram' | 'base' | 'silicon';
  selected?: boolean;
}) {
  return <g className={`stack-die ${kind}${selected ? ' selected' : ''}`}>
    <rect x="92" y={y} width="220" height="46" rx="5" />
    <text x="202" y={y + 28} textAnchor="middle">{label}</text>
  </g>;
}

export function VerticalVia({ x, y, height, selected = false, label = 'TSV' }: {
  x: number;
  y: number;
  height: number;
  selected?: boolean;
  label?: string;
}) {
  return <g className={`stack-via${selected ? ' selected' : ''}`}>
    <line x1={x} y1={y} x2={x} y2={y + height} />
    <text x={x + 10} y={y + height / 2}>{label}</text>
  </g>;
}

export function BondingInterface({ y, selected = false }: { y: number; selected?: boolean }) {
  return <g className={`stack-bond${selected ? ' selected' : ''}`}>
    <line x1="102" y1={y} x2="302" y2={y} />
    {[125, 175, 225, 275].map(x => <circle key={x} cx={x} cy={y} r="5" />)}
  </g>;
}
