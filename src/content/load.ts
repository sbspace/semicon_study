import type {
  ContentDocument,
  ContentDocumentSummary,
  ContentIndex,
  Lesson,
  Module,
  Review,
  Supplement,
  SupportingDocument,
} from './types.js';

export interface ContentTransport {
  loadJson(path: string): Promise<unknown>;
}

export type ContentLoadErrorCode =
  | 'TRANSPORT_ERROR'
  | 'INVALID_INDEX'
  | 'UNKNOWN_DOCUMENT'
  | 'INVALID_DOCUMENT'
  | 'DOCUMENT_MISMATCH'
  | 'KIND_MISMATCH';

export class ContentLoadError extends Error {
  constructor(readonly code: ContentLoadErrorCode, message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'ContentLoadError';
  }
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validSummary(value: unknown, id: string): value is ContentDocumentSummary {
  return record(value) && value.id === id && typeof value.kind === 'string' &&
    typeof value.title === 'string' && typeof value.path === 'string' &&
    typeof value.revision === 'string' && typeof value.documentFile === 'string' &&
    !value.documentFile.startsWith('/') && !value.documentFile.includes('..');
}

function validateIndex(value: unknown): ContentIndex {
  if (!record(value) || value.modelVersion !== '1' || typeof value.parserVersion !== 'string' ||
    typeof value.sourceDigest !== 'string' || !record(value.curriculum) ||
    !Array.isArray(value.moduleIds) || !value.moduleIds.every(id => typeof id === 'string') ||
    !Array.isArray(value.documentIds) || !value.documentIds.every(id => typeof id === 'string') ||
    !record(value.documentsById) || !record(value.idByPath)) {
    throw new ContentLoadError('INVALID_INDEX', 'Content index has an unsupported or invalid shape');
  }
  const summaries = value.documentsById as Record<string, unknown>;
  if (new Set(value.documentIds).size !== value.documentIds.length ||
    !value.documentIds.every(id => validSummary(summaries[id], id))) {
    throw new ContentLoadError('INVALID_INDEX', 'Content index document mapping is invalid');
  }
  return value as unknown as ContentIndex;
}

function validateDocument(value: unknown): ContentDocument {
  if (!record(value) || typeof value.id !== 'string' || typeof value.kind !== 'string' ||
    typeof value.path !== 'string' || typeof value.revision !== 'string' || !record(value.body) ||
    typeof value.body.markdown !== 'string' || !Array.isArray(value.body.blocks) ||
    !Array.isArray(value.body.quizzes) || !Array.isArray(value.body.headings)) {
    throw new ContentLoadError('INVALID_DOCUMENT', 'Content document has an invalid shape');
  }
  return value as unknown as ContentDocument;
}

export class ContentLoader {
  private indexPromise: Promise<ContentIndex> | undefined;
  private readonly documentCache = new Map<string, Promise<ContentDocument>>();

  constructor(private readonly transport: ContentTransport) {}

  private async transportJson(path: string): Promise<unknown> {
    try {
      return await this.transport.loadJson(path);
    } catch (error) {
      if (error instanceof ContentLoadError) throw error;
      throw new ContentLoadError('TRANSPORT_ERROR', `Failed to load ${path}`, { cause: error });
    }
  }

  loadIndex(): Promise<ContentIndex> {
    if (this.indexPromise === undefined) {
      const pending = this.transportJson('index.json').then(validateIndex);
      this.indexPromise = pending;
      void pending.catch(() => {
        if (this.indexPromise === pending) this.indexPromise = undefined;
      });
    }
    return this.indexPromise;
  }

  async getDocument(id: string): Promise<ContentDocument> {
    const index = await this.loadIndex();
    const summary = index.documentsById[id];
    if (summary === undefined) {
      throw new ContentLoadError('UNKNOWN_DOCUMENT', `Unknown content document ID: ${id}`);
    }
    const key = `${id}\u0000${summary.revision}`;
    const cached = this.documentCache.get(key);
    if (cached !== undefined) return cached;
    const pending = this.transportJson(summary.documentFile).then(value => {
      const document = validateDocument(value);
      if (document.id !== id || document.revision !== summary.revision ||
        document.kind !== summary.kind || document.path !== summary.path) {
        throw new ContentLoadError(
          'DOCUMENT_MISMATCH',
          `Loaded document does not match index entry ${id}@${summary.revision}`,
        );
      }
      return document;
    });
    this.documentCache.set(key, pending);
    void pending.catch(() => {
      if (this.documentCache.get(key) === pending) this.documentCache.delete(key);
    });
    return pending;
  }

  private async getKind<K extends ContentDocument['kind']>(
    id: string,
    kind: K,
  ): Promise<Extract<ContentDocument, { kind: K }>> {
    const document = await this.getDocument(id);
    if (document.kind !== kind) {
      throw new ContentLoadError('KIND_MISMATCH', `Expected ${id} to be ${kind}, received ${document.kind}`);
    }
    return document as Extract<ContentDocument, { kind: K }>;
  }

  getModule(id: string): Promise<Module> { return this.getKind(id, 'module'); }
  getLesson(id: string): Promise<Lesson> { return this.getKind(id, 'lesson'); }
  getReview(id: string): Promise<Review> { return this.getKind(id, 'review'); }
  getSupplement(id: string): Promise<Supplement> { return this.getKind(id, 'supplement'); }
  getSupportingDocument(id: string): Promise<SupportingDocument> {
    return this.getKind(id, 'supporting');
  }
}
