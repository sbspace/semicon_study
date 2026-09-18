import type { ComponentType, LazyExoticComponent } from 'react';

import type { VisualPlaceholder } from '../../content/types.js';

export type VisualHandling =
  | {
      kind: 'static-svg' | 'illustration';
      assetId: string;
      title: string;
      caption: string;
      note?: string;
    }
  | {
      kind: 'image';
      assetId: string;
      title: string;
      caption: string;
      note?: string;
    }
  | {
      kind: 'link-only';
      title: string;
      guidance: string;
      sourceName: string;
      sourceUrl: string;
    }
  | {
      kind: 'resolvedByInteractive';
      targetInstanceId: string;
      targetType: string;
      guidance: string;
    }
  | { kind: 'omit'; reason: string }
  | { kind: 'pending'; reason: string; guidance: string };

export interface VisualImageAsset {
  assetId: string;
  src: string;
  alt: string;
  author: string;
  publisher: string;
  sourcePage: string;
  rightsStatus: 'approved';
  license: string;
  attribution: string;
  width: number;
  height: number;
  byteSize: number;
  sha256: string;
}

export interface VisualBinding {
  documentId: string;
  instanceId: string;
  sourceId?: string;
  documentRevision: string;
  expectedType: string;
  expectedDescription: string;
  handling: VisualHandling;
  rationale: string;
}

export interface InteractiveTarget {
  instanceId: string;
  type: string;
  anchorId: string;
}

export interface VisualGraphicProps {
  declaration: Readonly<VisualPlaceholder>;
}

export type VisualGraphicComponent = ComponentType<VisualGraphicProps>;
export type VisualAssetRegistry = ReadonlyMap<
  string,
  LazyExoticComponent<VisualGraphicComponent>
>;
export type VisualBindingRegistry = ReadonlyMap<string, VisualBinding>;
export type VisualImageAssetRegistry = ReadonlyMap<string, VisualImageAsset>;
