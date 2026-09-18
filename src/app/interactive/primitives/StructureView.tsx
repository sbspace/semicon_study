import { useId, type ReactNode } from 'react';

/** Shared accessible canvas only; geometry and educational meaning stay in each diagram. */
export function StructureView({ title, description, children, height = 300 }: {
  title: string; description: string; children: ReactNode; height?: number;
}) {
  const id = useId();
  return <svg className="structure-view" viewBox={`0 0 360 ${height}`} role="img" aria-labelledby={`${id}-title`} aria-describedby={`${id}-desc`}>
    <title id={`${id}-title`}>{title}</title><desc id={`${id}-desc`}>{description}</desc>{children}
  </svg>;
}

export function StructureChoices<T extends string>({ label, value, options, onChange }: {
  label: string; value: T; options: readonly { value: T; label: string }[]; onChange: (value: T) => void;
}) {
  const id = useId();
  return <fieldset className="structure-choices"><legend>{label}</legend><div>
    {options.map(option => <label key={option.value}>
      <input type="radio" name={id} value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} />
      <span>{option.label}</span>
    </label>)}
  </div></fieldset>;
}

export function StructureBlock({ x, y, width, height, label, selected = false }: {
  x: number; y: number; width: number; height: number; label: string; selected?: boolean;
}) {
  return <g className={selected ? 'structure-block selected' : 'structure-block'}>
    <rect x={x} y={y} width={width} height={height} rx="6" />
    <text x={x + width / 2} y={y + height / 2 + 6} textAnchor="middle">{label}</text>
  </g>;
}
