import { useParams } from 'react-router-dom';

import type { LearningDocumentSummary } from '../../content/types.js';
import { moduleProgress } from '../../progress/progress.js';
import { useProgress } from '../../progress/ProgressContext.js';
import { ContentRenderer } from '../ContentRenderer.js';
import {
  duration,
  ErrorState,
  LearningLink,
  learningSummary,
  LoadingState,
  ProgressBar,
} from '../pageShared.js';
import { useContentDocument, useContentIndex } from '../useContent.js';

export default function ModulePage() {
  const { moduleId } = useParams();
  const indexState = useContentIndex();
  const documentState = useContentDocument(moduleId);
  const { progress } = useProgress();
  if (indexState.loading || documentState.loading) return <LoadingState label="모듈을 불러오는 중입니다." />;
  if (indexState.error || documentState.error || !indexState.data || !documentState.data) {
    return <ErrorState title="모듈을 찾을 수 없습니다." />;
  }
  const entry = moduleId ? indexState.data.documentsById[moduleId] : undefined;
  if (entry?.kind !== 'module' || documentState.data.kind !== 'module') return <ErrorState title="모듈을 찾을 수 없습니다." />;
  const items = [...entry.lessonIds, entry.reviewId, ...entry.supplementIds]
    .map(id => learningSummary(indexState.data!, id))
    .filter((item): item is LearningDocumentSummary => item !== undefined);
  const value = moduleProgress(entry, progress);
  return (
    <main className="page-width module-page">
      <header className="module-hero">
        <div className="module-index">M{String(entry.number).padStart(2, '0')}</div>
        <div><span className="eyebrow">Module {entry.number}</span><h1>{entry.title}</h1><p>{entry.description}</p>
          <div className="module-metrics"><span>{entry.lessonIds.length}개 Lesson</span><span>약 {duration(indexState.data, entry)}분</span><span>{value.completed} / {value.total} 완료 · {value.percent}%</span></div>
          <ProgressBar value={value} label={`Module ${entry.number} 진도`} />
        </div>
      </header>
      <div className="module-layout">
        <article className="reading-surface module-intro">
          <ContentRenderer document={documentState.data} index={indexState.data} suppressDocumentHeadings />
        </article>
        <aside className="module-lessons"><span className="eyebrow">In this module</span><h2>수업 목록</h2><div className="learning-list">{items.map(item => <LearningLink key={item.id} item={item} />)}</div></aside>
      </div>
    </main>
  );
}
