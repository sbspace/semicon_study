export type Bit = 0 | 1;

export function BinaryToggle({ label, value, onChange }: {
  label: string;
  value: Bit;
  onChange: (value: Bit) => void;
}) {
  return (
    <div className="logic-input" role="group" aria-label={`${label} 선택`}>
      <span>{label}</span>
      {([0, 1] as const).map(bit => (
        <button key={bit} type="button" aria-pressed={value === bit} onClick={() => onChange(bit)}>{bit}</button>
      ))}
    </div>
  );
}
