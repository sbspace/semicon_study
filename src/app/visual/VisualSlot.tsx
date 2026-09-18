import { Component, Suspense, type ErrorInfo, type MouseEvent, type ReactNode } from 'react';

import type { VisualPlaceholder } from '../../content/types.js';
import {
  registeredVisualBinding,
  visualAssetRegistry,
  visualBindings,
  visualImageAssets,
} from './registry.js';
import type {
  InteractiveTarget,
  VisualAssetRegistry,
  VisualBinding,
  VisualBindingRegistry,
  VisualImageAssetRegistry,
} from './types.js';
import { VisualFrame } from './VisualFrame.js';

function VisualFallback({ declaration, mode = 'unregistered' }: {
  declaration: Readonly<VisualPlaceholder>;
  mode?: 'unregistered' | 'loading' | 'error';
}) {
  return (
    <figure
      className={`content-placeholder visual-placeholder visual-${mode}`}
      role={mode === 'error' ? 'alert' : undefined}
      aria-busy={mode === 'loading' ? true : undefined}
    >
      <span className="placeholder-kicker">Visual</span>
      <figcaption>{declaration.description}</figcaption>
      {mode === 'loading' && <p>시각 자료를 불러오고 있습니다.</p>}
      {mode === 'error' && <p>시각 자료를 표시하지 못했습니다. 설명은 그대로 제공합니다.</p>}
    </figure>
  );
}

function matchesBinding(
  binding: VisualBinding,
  declaration: Readonly<VisualPlaceholder>,
  documentRevision: string,
): boolean {
  return binding.documentId === declaration.documentId
    && binding.instanceId === declaration.instanceId
    && binding.sourceId === declaration.sourceId
    && binding.documentRevision === documentRevision
    && binding.expectedType === declaration.type
    && binding.expectedDescription === declaration.description;
}

class VisualErrorBoundary extends Component<
  { identity: string; declaration: Readonly<VisualPlaceholder>; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // Keep implementation details out of the learner-facing fallback.
  }
  componentDidUpdate(previous: Readonly<{ identity: string }>) {
    if (this.state.failed && previous.identity !== this.props.identity) this.setState({ failed: false });
  }
  render() {
    return this.state.failed
      ? <VisualFallback declaration={this.props.declaration} mode="error" />
      : this.props.children;
  }
}

function InteractiveGuide({
  declaration,
  target,
  guidance,
}: {
  declaration: Readonly<VisualPlaceholder>;
  target: InteractiveTarget;
  guidance: string;
}) {
  function focusTarget(event: MouseEvent<HTMLAnchorElement>) {
    const element = document.getElementById(target.anchorId);
    if (element === null) return;
    event.preventDefault();
    element.scrollIntoView?.({ block: 'center' });
    element.focus({ preventScroll: true });
    window.history.replaceState(null, '', `#${target.anchorId}`);
  }

  return (
    <aside className="visual-interactive-guide" aria-label="연결된 인터랙티브 도식 안내">
      <span className="placeholder-kicker">Interactive 연결</span>
      <p>{guidance}</p>
      <a href={`#${target.anchorId}`} onClick={focusTarget}>연결된 도식으로 이동</a>
      <span className="visual-guide-context">{declaration.description}</span>
    </aside>
  );
}

function ReferenceLinkCard({
  declaration,
  title,
  guidance,
  sourceName,
  sourceUrl,
}: {
  declaration: Readonly<VisualPlaceholder>;
  title: string;
  guidance: string;
  sourceName: string;
  sourceUrl: string;
}) {
  return (
    <aside className="visual-reference-card" aria-label="공식 참고 자료">
      <span className="placeholder-kicker">Reference material</span>
      <strong>{title}</strong>
      <p>{guidance}</p>
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${sourceName} 공식 자료에서 보기 (새 탭)`}
      >
        공식 자료에서 보기 <span aria-hidden="true">↗</span>
      </a>
      <span className="visual-guide-context">이미지는 공식 원문에서 확인할 수 있습니다. {declaration.description}</span>
    </aside>
  );
}

function PendingReference({ declaration, guidance }: {
  declaration: Readonly<VisualPlaceholder>;
  guidance: string;
}) {
  return (
    <figure className="visual-reference-pending">
      <span className="placeholder-kicker">Reference visual</span>
      <figcaption>{declaration.description}</figcaption>
      <p>{guidance}</p>
    </figure>
  );
}

export function VisualSlot({
  declaration,
  documentRevision,
  interactiveTargets,
  bindingRegistry = visualBindings,
  assetRegistry = visualAssetRegistry,
  imageAssetRegistry = visualImageAssets,
}: {
  declaration: Readonly<VisualPlaceholder>;
  documentRevision: string;
  interactiveTargets: ReadonlyMap<string, InteractiveTarget>;
  bindingRegistry?: VisualBindingRegistry;
  assetRegistry?: VisualAssetRegistry;
  imageAssetRegistry?: VisualImageAssetRegistry;
}) {
  const binding = registeredVisualBinding(bindingRegistry, declaration);
  if (binding === undefined || !matchesBinding(binding, declaration, documentRevision)) {
    return <VisualFallback declaration={declaration} />;
  }

  if (binding.handling.kind === 'omit') return null;
  if (binding.handling.kind === 'pending') {
    return <PendingReference declaration={declaration} guidance={binding.handling.guidance} />;
  }

  if (binding.handling.kind === 'link-only') {
    return (
      <ReferenceLinkCard
        declaration={declaration}
        title={binding.handling.title}
        guidance={binding.handling.guidance}
        sourceName={binding.handling.sourceName}
        sourceUrl={binding.handling.sourceUrl}
      />
    );
  }

  if (binding.handling.kind === 'resolvedByInteractive') {
    const target = interactiveTargets.get(binding.handling.targetInstanceId);
    if (target === undefined || target.type !== binding.handling.targetType) {
      return <VisualFallback declaration={declaration} />;
    }
    return (
      <InteractiveGuide
        declaration={declaration}
        target={target}
        guidance={binding.handling.guidance}
      />
    );
  }

  if (binding.handling.kind === 'image') {
    const asset = imageAssetRegistry.get(binding.handling.assetId);
    if (asset === undefined || asset.rightsStatus !== 'approved') {
      return <VisualFallback declaration={declaration} />;
    }
    return (
      <VisualFrame
        title={binding.handling.title}
        caption={binding.handling.caption}
        note={binding.handling.note}
        source={{
          name: asset.publisher,
          url: asset.sourcePage,
          attribution: asset.attribution,
        }}
      >
        <img
          className="visual-reference-image"
          src={asset.src}
          alt={asset.alt}
          width={asset.width}
          height={asset.height}
          loading="lazy"
          decoding="async"
        />
      </VisualFrame>
    );
  }

  const Graphic = assetRegistry.get(binding.handling.assetId);
  if (Graphic === undefined) return <VisualFallback declaration={declaration} />;

  const identity = JSON.stringify([
    declaration.documentId,
    documentRevision,
    declaration.instanceId,
    binding.handling.assetId,
  ]);
  return (
    <VisualErrorBoundary identity={identity} declaration={declaration}>
      <Suspense fallback={<VisualFallback declaration={declaration} mode="loading" />}>
        <VisualFrame
          title={binding.handling.title}
          caption={binding.handling.caption}
          note={binding.handling.note}
        >
          <Graphic declaration={declaration} />
        </VisualFrame>
      </Suspense>
    </VisualErrorBoundary>
  );
}
