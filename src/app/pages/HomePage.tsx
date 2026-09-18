import { Link } from 'react-router-dom';

import {
  continueLearningId,
  moduleProgress,
  overallProgress,
} from '../../progress/progress.js';
import { useProgress } from '../../progress/ProgressContext.js';
import {
  ErrorState,
  LoadingState,
  moduleSummaries,
  ProgressBar,
} from '../pageShared.js';
import { useContentIndex } from '../useContent.js';

export default function HomePage() {
  const state = useContentIndex();
  const { progress } = useProgress();
  if (state.loading) return <LoadingState />;
  if (state.error || !state.data) return <ErrorState />;
  const index = state.data;
  const modules = moduleSummaries(index);
  const lessonCount = Object.values(index.documentsById).filter(item => item.kind === 'lesson').length;
  const nextId = continueLearningId(index, progress);
  const hasVisitedLesson = progress.lastVisitedId !== undefined &&
    index.documentsById[progress.lastVisitedId]?.kind === 'lesson';
  const overall = overallProgress(index, progress);
  return (
    <main>
      <section className="hero page-width">
        <div className="hero-copy">
          <span className="eyebrow">Semiconductor learning path</span>
          <h1>작은 소자에서<br />반도체 산업까지.</h1>
          <p>{index.curriculum.description}</p>
          <div className="hero-actions">
            {nextId && <Link className="button primary" to={`/learn/${nextId}`}>{hasVisitedLesson ? '이어서 학습' : '첫 수업 시작하기'} <span>→</span></Link>}
            <Link className="button secondary" to="/curriculum">커리큘럼 보기</Link>
          </div>
        </div>
        <div className="hero-card" aria-label="커리큘럼 요약">
          <div className="chip-illustration" aria-hidden="true">
            <span /><span /><span /><span /><i /><i /><i /><i />
          </div>
          <div className="stat-row">
            <div><strong>{modules.length}</strong><span>Modules</span></div>
            <div><strong>{lessonCount}</strong><span>Lessons</span></div>
          </div>
          <ProgressBar value={overall} label="전체 학습 진도" />
          <p>모든 수업은 처음부터 자유롭게 탐색할 수 있습니다.</p>
        </div>
      </section>

      <section className="roadmap-section page-width">
        <div className="section-heading">
          <div><span className="eyebrow">Curriculum roadmap</span><h2>하나씩 연결되는 10개 모듈</h2></div>
          <Link to="/curriculum">전체 과정 보기 <span>→</span></Link>
        </div>
        <div className="roadmap-grid">
          {modules.map(module => {
            const value = moduleProgress(module, progress);
            return (
              <Link className="roadmap-card" to={`/modules/${module.id}`} key={module.id}>
                <span className="module-number">{String(module.number).padStart(2, '0')}</span>
                <div><h3>{module.title}</h3><p>{module.description}</p><span className="roadmap-progress">{value.completed} / {value.total} 완료 · {value.percent}%</span></div>
                <span className="card-arrow">↗</span>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
