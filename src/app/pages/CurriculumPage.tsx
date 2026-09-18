import { Link } from 'react-router-dom';

import type { LearningDocumentSummary } from '../../content/types.js';
import { moduleProgress } from '../../progress/progress.js';
import { useProgress } from '../../progress/ProgressContext.js';
import {
  duration,
  ErrorState,
  LearningLink,
  learningSummary,
  LoadingState,
  moduleSummaries,
  ProgressBar,
} from '../pageShared.js';
import { useContentIndex } from '../useContent.js';

export default function CurriculumPage() {
  const state = useContentIndex();
  const { progress } = useProgress();
  if (state.loading) return <LoadingState />;
  if (state.error || !state.data) return <ErrorState />;
  const index = state.data;
  return (
    <main className="page-width curriculum-page">
      <header className="page-header">
        <span className="eyebrow">Full curriculum</span>
        <h1>{index.curriculum.title}</h1>
        <p>{index.curriculum.description}</p>
      </header>
      <div className="curriculum-list">
        {moduleSummaries(index).map(module => {
          const value = moduleProgress(module, progress);
          const items = [...module.lessonIds, module.reviewId, ...module.supplementIds]
            .map(id => learningSummary(index, id))
            .filter((item): item is LearningDocumentSummary => item !== undefined);
          return (
            <section className="curriculum-module" key={module.id}>
              <div className="module-summary">
                <div className="module-orbit"><span>{String(module.number).padStart(2, '0')}</span></div>
                <div className="module-summary-copy">
                  <span className="eyebrow">Module {module.number}</span>
                  <h2><Link to={`/modules/${module.id}`}>{module.title}</Link></h2>
                  <p>{module.description}</p>
                  <div className="module-metrics"><span>{module.lessonIds.length}개 Lesson</span><span>약 {duration(index, module)}분</span><span>{value.completed} / {value.total} 완료 · {value.percent}%</span></div>
                  <ProgressBar value={value} label={`Module ${module.number} 진도`} />
                </div>
              </div>
              <div className="learning-list">{items.map(item => <LearningLink key={item.id} item={item} />)}</div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
