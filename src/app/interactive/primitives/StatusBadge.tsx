import type { ReactNode } from 'react';

export type StatusTone = 'confirmed' | 'mismatch' | 'pending';

const symbols: Record<StatusTone, string> = {
  confirmed: '✓',
  mismatch: '!',
  pending: '?',
};

export function StatusBadge({ tone, children }: { tone: StatusTone; children: ReactNode }) {
  return <span className={`status-badge ${tone}`}><span aria-hidden="true">{symbols[tone]}</span>{children}</span>;
}
