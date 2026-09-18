import { Component, Suspense, type ErrorInfo, type ReactNode } from 'react';

import type { InteractiveDeclaration } from '../../content/types.js';
import { interactiveRegistry, registeredInteractive } from './registry.js';
import type { InteractiveRegistry } from './types.js';

function readableType(type: string): string {
  return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function Placeholder({ type, mode = 'unregistered' }: {
  type: string;
  mode?: 'unregistered' | 'loading' | 'error';
}) {
  const message = mode === 'loading'
    ? '인터랙티브 도식을 불러오고 있습니다.'
    : mode === 'error'
      ? '인터랙티브 도식을 표시하지 못했습니다. 페이지를 새로고침해 다시 시도해 주세요.'
      : '인터랙티브 도식은 준비 중입니다.';
  return (
    <aside
      className={`content-placeholder interactive-placeholder interactive-${mode}`}
      role={mode === 'error' ? 'alert' : undefined}
      aria-busy={mode === 'loading' ? true : undefined}
    >
      <span className="placeholder-kicker">Interactive diagram</span>
      <strong>{readableType(type)}</strong>
      <p>{message}</p>
    </aside>
  );
}

class SlotErrorBoundary extends Component<
  { identity: string; type: string; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // Raw implementation errors never replace the learner-facing fallback.
  }
  componentDidUpdate(previous: Readonly<{ identity: string }>) {
    if (this.state.failed && previous.identity !== this.props.identity) this.setState({ failed: false });
  }
  render() {
    return this.state.failed ? <Placeholder type={this.props.type} mode="error" /> : this.props.children;
  }
}

export function InteractiveSlot({ declaration, documentRevision, anchorId, registry = interactiveRegistry }: {
  declaration: Readonly<InteractiveDeclaration>;
  documentRevision: string;
  anchorId?: string | undefined;
  registry?: InteractiveRegistry;
}) {
  const Interactive = registeredInteractive(registry, declaration.type);
  const identity = JSON.stringify([declaration.documentId, documentRevision, declaration.instanceId]);
  return (
    <div
      id={anchorId}
      className="interactive-slot-anchor"
      tabIndex={anchorId === undefined ? undefined : -1}
      aria-label={anchorId === undefined ? undefined : `${readableType(declaration.type)} 인터랙티브 도식`}
    >
      {Interactive === undefined ? (
        <Placeholder type={declaration.type} />
      ) : (
        <SlotErrorBoundary key={identity} identity={identity} type={declaration.type}>
          <Suspense fallback={<Placeholder type={declaration.type} mode="loading" />}>
            <Interactive declaration={declaration} documentRevision={documentRevision} />
          </Suspense>
        </SlotErrorBoundary>
      )}
    </div>
  );
}
