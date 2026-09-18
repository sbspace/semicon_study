import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import {
  isCompleted,
  isCompletionOutdated,
} from '../../progress/progress.js';
import { useProgress } from '../../progress/ProgressContext.js';
import { ContentRenderer } from '../ContentRenderer.js';
import {
  documentKindLabel,
  ErrorState,
  LessonNavigation,
  LoadingState,
} from '../pageShared.js';
import { useContentDocument, useContentIndex } from '../useContent.js';

export default function LearnPage() {
  const { documentId } = useParams();
  const indexState = useContentIndex();
  const documentState = useContentDocument(documentId);
  const { progress, complete, uncomplete, visit, loading: progressLoading, notice, savingIds } = useProgress();
  const loadedDocument = documentState.data;
  useEffect(() => {
    if (loadedDocument?.kind === 'lesson' || loadedDocument?.kind === 'review' || loadedDocument?.kind === 'supplement') {
      visit(loadedDocument.id);
    }
  }, [loadedDocument, visit]);
  if (indexState.loading || documentState.loading) return <LoadingState label="수업을 불러오는 중입니다." />;
  if (indexState.error || documentState.error || !indexState.data || !documentState.data) {
    return <ErrorState title="수업을 찾을 수 없습니다." />;
  }
  const document = documentState.data;
  if (document.kind === 'module') return <ErrorState title="이 주소는 학습 문서가 아닙니다." />;
  const module = document.kind === 'supporting' ? undefined : indexState.data.documentsById[document.moduleId];
  const canComplete = document.kind === 'lesson' || document.kind === 'review' || document.kind === 'supplement';
  const completed = canComplete && isCompleted(progress, document.id);
  const outdated = canComplete && isCompletionOutdated(progress, document.id, document.revision);
  const saving = savingIds.has(document.id);
  return (
    <main className="learn-page">
      <header className="lesson-header page-width-narrow">
        <Link className="back-link" to={module?.kind === 'module' ? `/modules/${module.id}` : '/curriculum'}>← {module?.kind === 'module' ? `Module ${module.number}` : 'Curriculum'}</Link>
        <div className="lesson-meta">
          <span>{documentKindLabel(document)}</span>
          {document.kind !== 'supporting' && <span>약 {document.estimatedMinutes}분{document.extensionMinutes ? ` + 확장 ${document.extensionMinutes}분` : ''}</span>}
          {canComplete && (
            <span className={`lesson-status ${completed ? 'completed' : ''}`} aria-label={`현재 학습 상태: ${completed ? '완료' : '미완료'}`}>
              {completed ? '✓ 완료' : '○ 미완료'}
            </span>
          )}
        </div>
        <h1>{document.title}</h1>
        {module?.kind === 'module' && <p>{module.title}</p>}
      </header>
      <article className="reading-surface page-width-narrow">
        <ContentRenderer document={document} index={indexState.data} suppressDocumentHeadings />
      </article>
      <div className="page-width-narrow">
        {canComplete && (
          <section className={`completion-action ${completed ? 'completed' : ''}`} aria-label="학습 완료 상태">
            <div>
              <span className="completion-icon">{completed ? '✓' : '○'}</span>
              <div><strong>{completed ? '학습 완료됨' : '이 문서를 다 읽었나요?'}</strong>{outdated && <small>완료 후 내용이 업데이트됨</small>}</div>
            </div>
            {completed
              ? <button type="button" className="completion-cancel" disabled={saving || progressLoading} onClick={() => uncomplete(document.id)}>{saving ? '저장 중…' : '완료 취소'}</button>
              : <button type="button" className="button primary" disabled={saving || progressLoading} onClick={() => complete(document.id, document.revision)}>{saving ? '저장 중…' : progressLoading ? '진도 불러오는 중…' : '학습 완료'}</button>}
          </section>
        )}
        {notice && <p className="progress-notice" role="status">{notice}</p>}
        <LessonNavigation document={document} index={indexState.data} />
      </div>
    </main>
  );
}
