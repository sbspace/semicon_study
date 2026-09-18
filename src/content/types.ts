export type ContentId = string;
export type ContentPath = string;
export type ISODate = string;

export type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | { [key: string]: JsonValue };

export type ContentOrigin =
  | 'adapted_original'
  | 'new'
  | 'new_supplement';

export interface SourceSpan {
  path: ContentPath;
  start: number;
  end: number;
  startLine: number;
  endLine: number;
}

export interface MarkdownFragment {
  markdown: string;
  source: SourceSpan;
}

export interface Heading {
  id: string;
  depth: number;
  text: string;
  source: SourceSpan;
}

export interface InteractiveDeclaration {
  instanceId: string;
  documentId: ContentId;
  type: string;
  attributes: Record<string, string>;
  original: MarkdownFragment;
}

export interface VisualPlaceholder {
  instanceId: string;
  documentId: ContentId;
  sourceId?: string;
  type: string;
  description: string;
  attributes: Record<string, string>;
  original: MarkdownFragment;
}

export interface QuizOption {
  id: string;
  label: string;
  content: MarkdownFragment;
}

export interface QuizAnswer {
  id: string;
  role: 'answer' | 'explanation';
  content: MarkdownFragment;
}

export type GradingRule =
  | { kind: 'single-choice'; correctOptionId: string }
  | { kind: 'ox'; correct: 'O' | 'X' }
  | { kind: 'self-check' };

export interface QuizQuestion {
  id: string;
  ordinal: number;
  sourceLabel?: string;
  responseKind: 'single-choice' | 'free-response' | 'ox';
  prompt: MarkdownFragment;
  options: QuizOption[];
  answers: QuizAnswer[];
  grading: GradingRule;
  source: SourceSpan;
}

export interface Quiz {
  id: string;
  documentId: ContentId;
  category: 'practice' | 'cumulative' | 'reflection';
  title: MarkdownFragment;
  status: 'structured' | 'unparsed';
  sourceRanges: SourceSpan[];
  questions: QuizQuestion[];
}

export type ContentBlock =
  | { kind: 'markdown'; content: MarkdownFragment }
  | {
      kind: 'quiz-question';
      quizId: string;
      questionId: string;
      original: MarkdownFragment;
    }
  | {
      kind: 'quiz-answer';
      quizId: string;
      questionId: string;
      answerId: string;
      original: MarkdownFragment;
    }
  | { kind: 'interactive'; value: InteractiveDeclaration }
  | { kind: 'visual'; value: VisualPlaceholder }
  | {
      kind: 'unsupported-directive';
      original: MarkdownFragment;
      tagName: string;
    };

export interface DocumentBody {
  markdown: string;
  blocks: ContentBlock[];
  quizzes: Quiz[];
  headings: Heading[];
}

export interface DocumentBase {
  id: ContentId;
  title: string;
  path: ContentPath;
  revision: string;
  lastUpdated: ISODate;
  extra: Record<string, JsonValue>;
  body: DocumentBody;
}

export interface Module extends DocumentBase {
  kind: 'module';
  number: number;
  description: string;
  lessonIds: ContentId[];
  reviewId: ContentId;
  supplementIds: ContentId[];
}

export interface LearningDocument extends DocumentBase {
  moduleId: ContentId;
  estimatedMinutes: number;
  extensionMinutes?: number;
  contentOrigin: ContentOrigin;
  sourceUrl?: string;
  sourceMessageIds: string[];
  asOf?: ISODate;
  timeSensitive?: boolean;
  updateReviewAfter?: ISODate;
}

export interface Lesson extends LearningDocument {
  kind: 'lesson';
  lessonNumber: number;
}

export interface Review extends LearningDocument {
  kind: 'review';
}

export interface Supplement extends LearningDocument {
  kind: 'supplement';
  originalLabel?: string;
}

export interface SupportingDocument {
  kind: 'supporting';
  id: ContentId;
  path: ContentPath;
  title: string;
  revision: string;
  body: DocumentBody;
}

export type ContentDocument =
  | Module
  | Lesson
  | Review
  | Supplement
  | SupportingDocument;

export interface Curriculum {
  schemaVersion: string;
  contentVersion: string;
  language: string;
  title: string;
  description: string;
  lastUpdated: ISODate;
  moduleIds: ContentId[];
  extra: Record<string, JsonValue>;
}

export interface ContentCatalog {
  modelVersion: '1';
  parserVersion: string;
  sourceDigest: string;
  curriculum: Curriculum;
  documentsById: Record<ContentId, ContentDocument>;
  idByPath: Record<ContentPath, ContentId>;
}

export interface ContentDocumentSummaryBase {
  id: ContentId;
  kind: ContentDocument['kind'];
  title: string;
  path: ContentPath;
  revision: string;
  documentFile: ContentPath;
}

export interface ModuleSummary extends ContentDocumentSummaryBase {
  kind: 'module';
  number: number;
  description: string;
  lessonIds: ContentId[];
  reviewId: ContentId;
  supplementIds: ContentId[];
}

export interface LearningDocumentSummary extends ContentDocumentSummaryBase {
  kind: 'lesson' | 'review' | 'supplement';
  moduleId: ContentId;
  estimatedMinutes: number;
  extensionMinutes?: number;
  contentOrigin: ContentOrigin;
  lessonNumber?: number;
  originalLabel?: string;
}

export interface SupportingDocumentSummary extends ContentDocumentSummaryBase {
  kind: 'supporting';
}

export type ContentDocumentSummary =
  | ModuleSummary
  | LearningDocumentSummary
  | SupportingDocumentSummary;

export interface ContentIndex {
  modelVersion: ContentCatalog['modelVersion'];
  parserVersion: string;
  sourceDigest: string;
  curriculum: Curriculum;
  moduleIds: ContentId[];
  documentIds: ContentId[];
  documentsById: Record<ContentId, ContentDocumentSummary>;
  idByPath: Record<ContentPath, ContentId>;
}

export interface Diagnostic {
  severity: 'error' | 'warning';
  code: string;
  message: string;
  path: ContentPath;
  source?: SourceSpan;
  related?: SourceSpan[];
}

export type ParseResult =
  | {
      ok: true;
      data: ContentCatalog;
      diagnostics: Diagnostic[];
    }
  | {
      ok: false;
      diagnostics: Diagnostic[];
    };
