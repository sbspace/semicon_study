import { Link } from 'react-router-dom';

import type {
  ContentDocument,
  ContentIndex,
  LearningDocumentSummary,
  ModuleSummary,
} from '../content/types.js';
import {
  isCompleted,
} from '../progress/progress.js';
import { useProgress } from '../progress/ProgressContext.js';
import type { ProgressMetrics } from '../progress/types.js';

export function LoadingState({ label = '콘텐츠를 불러오는 중입니다.' }: { label?: string }) {
  return <div className="state-panel loading-state"><span className="loading-dot" />{label}</div>;
}

export function ErrorState({ title = '콘텐츠를 열 수 없습니다.', detail }: {
  title?: string | undefined;
  detail?: string | undefined;
}) {
  return (
    <div className="state-panel error-state" role="alert">
      <span className="eyebrow">Content error</span>
      <h1>{title}</h1>
      <p>{detail ?? '주소를 확인하거나 잠시 뒤 다시 시도해주세요.'}</p>
      <Link className="button secondary" to="/curriculum">커리큘럼으로 돌아가기</Link>
    </div>
  );
}

export function moduleSummaries(index: ContentIndex): ModuleSummary[] {
  return index.moduleIds
    .map(id => index.documentsById[id])
    .filter((item): item is ModuleSummary => item?.kind === 'module');
}

export function learningSummary(index: ContentIndex, id: string): LearningDocumentSummary | undefined {
  const item = index.documentsById[id];
  return item?.kind === 'lesson' || item?.kind === 'review' || item?.kind === 'supplement'
    ? item
    : undefined;
}

export function duration(index: ContentIndex, module: ModuleSummary): number {
  return [...module.lessonIds, module.reviewId, ...module.supplementIds]
    .reduce((total, id) => total + (learningSummary(index, id)?.estimatedMinutes ?? 0), 0);
}

export function documentKindLabel(document: ContentDocument): string {
  if (document.kind === 'lesson') return `Lesson ${document.lessonNumber}`;
  if (document.kind === 'review') return 'Module review';
  if (document.kind === 'supplement') return 'Supplement';
  if (document.kind === 'module') return `Module ${document.number}`;
  return 'Reference';
}

export function ProgressBar({ value, label }: { value: ProgressMetrics; label: string }) {
  return (
    <div className="progress-summary">
      <div><span>{label}</span><strong>{value.completed} / {value.total}</strong><em>{value.percent}%</em></div>
      <div className="progress-track" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={value.total} aria-valuenow={value.completed}>
        <span style={{ width: `${value.percent}%` }} />
      </div>
    </div>
  );
}

export function LearningLink({ item }: { item: LearningDocumentSummary }) {
  const { progress } = useProgress();
  const completed = isCompleted(progress, item.id);
  const stateLabel = item.kind === 'lesson' ? 'Lesson' : item.kind === 'review' ? 'Review' : 'Supplement';
  return (
    <Link className="learning-row" to={`/learn/${item.id}`}>
      <span className={`kind-mark ${item.kind}`}>{item.kind === 'lesson' ? String(item.lessonNumber).padStart(2, '0') : item.kind === 'review' ? 'R' : '+'}</span>
      <span className={`completion-mark ${completed ? 'completed' : ''}`} aria-label={`${stateLabel} ${completed ? '완료' : '미완료'}`}>{completed ? '✓' : '○'}</span>
      <span className="learning-title"><strong>{item.title}</strong><small>{item.kind === 'review' ? '전체 복습' : item.kind === 'supplement' ? '보충 수업' : `Lesson ${item.lessonNumber}`}</small></span>
      <span className="learning-time">{item.estimatedMinutes}분{item.extensionMinutes ? ` + ${item.extensionMinutes}분` : ''}</span>
      <span className="row-arrow">→</span>
    </Link>
  );
}

export function LessonNavigation({ document, index }: { document: ContentDocument; index: ContentIndex }) {
  if (document.kind !== 'lesson' && document.kind !== 'review' && document.kind !== 'supplement') return null;
  const module = index.documentsById[document.moduleId];
  if (module?.kind !== 'module') return null;
  if (document.kind === 'lesson') {
    const position = module.lessonIds.indexOf(document.id);
    const previous = module.lessonIds[position - 1];
    const next = module.lessonIds[position + 1];
    return (
      <nav className="lesson-navigation" aria-label="이전 및 다음 수업">
        {previous ? <Link to={`/learn/${previous}`}><small>이전 Lesson</small><strong>{index.documentsById[previous]?.title}</strong></Link> : <Link to={`/modules/${module.id}`}><small>Module</small><strong>{module.title}</strong></Link>}
        {next ? <Link className="next" to={`/learn/${next}`}><small>다음 Lesson</small><strong>{index.documentsById[next]?.title}</strong></Link> : <Link className="next" to={`/learn/${module.reviewId}`}><small>다음</small><strong>Module 전체 복습</strong></Link>}
      </nav>
    );
  }
  return <nav className="lesson-navigation single"><Link to={`/modules/${module.id}`}><small>돌아가기</small><strong>Module {module.number} · {module.title}</strong></Link></nav>;
}
