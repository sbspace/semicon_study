import type { ComponentType, LazyExoticComponent } from 'react';

import type { InteractiveDeclaration } from '../../content/types.js';

export interface InteractiveProps {
  declaration: Readonly<InteractiveDeclaration>;
  documentRevision: string;
}

export type InteractiveComponent = ComponentType<InteractiveProps>;
export type InteractiveRegistry = Readonly<Partial<Record<string, LazyExoticComponent<InteractiveComponent>>>>;
