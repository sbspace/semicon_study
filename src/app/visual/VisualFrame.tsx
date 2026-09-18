import type { ReactNode } from 'react';

export function VisualFrame({
  title,
  caption,
  note,
  source,
  children,
}: {
  title: string;
  caption: string;
  note?: string | undefined;
  source?: { name: string; url: string; attribution: string } | undefined;
  children: ReactNode;
}) {
  return (
    <figure className="visual-asset">
      <div className="visual-asset-heading">
        <span className="placeholder-kicker">Visual</span>
        <strong>{title}</strong>
      </div>
      <div
        className="visual-asset-canvas"
        role="region"
        aria-label="시각 자료 도식 영역"
        tabIndex={0}
      >
        {children}
      </div>
      <figcaption>
        <strong>{caption}</strong>
        {note !== undefined && <span className="visual-asset-note">{note}</span>}
        {source !== undefined && (
          <span className="visual-asset-source">
            출처: <a href={source.url} target="_blank" rel="noopener noreferrer">{source.name}</a>
            <span>{source.attribution}</span>
          </span>
        )}
      </figcaption>
    </figure>
  );
}
