import { Component, lazy, Suspense, type ErrorInfo, type ReactNode } from 'react';
import { Link, NavLink, Route, Routes } from 'react-router-dom';

import { AuthForm } from '../auth/AuthContext.js';
import { ErrorState } from './pageShared.js';

const HomePage = lazy(() => import('./pages/HomePage.js'));
const CurriculumPage = lazy(() => import('./pages/CurriculumPage.js'));
const ModulePage = lazy(() => import('./pages/ModulePage.js'));
const LearnPage = lazy(() => import('./pages/LearnPage.js'));

function RouteLoading() {
  return (
    <main className="page-width">
      <div className="state-panel loading-state"><span className="loading-dot" />페이지를 여는 중입니다.</div>
    </main>
  );
}

class RouteErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // The user-facing state intentionally omits internal chunk URLs and stacks.
  }

  render() {
    if (this.state.failed) {
      return (
        <main className="page-width">
          <ErrorState title="페이지를 불러오지 못했습니다." detail="연결을 확인한 뒤 새로고침하거나 커리큘럼으로 돌아가주세요." />
        </main>
      );
    }
    return this.props.children;
  }
}

function LazyRoute({ children }: { children: ReactNode }) {
  return (
    <RouteErrorBoundary>
      <Suspense fallback={<RouteLoading />}>{children}</Suspense>
    </RouteErrorBoundary>
  );
}

function NotFoundPage() {
  return <main className="page-width"><ErrorState title="페이지를 찾을 수 없습니다." detail="요청한 주소에 학습 페이지가 없습니다." /></main>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LazyRoute><HomePage /></LazyRoute>} />
      <Route path="/curriculum" element={<LazyRoute><CurriculumPage /></LazyRoute>} />
      <Route path="/modules/:moduleId" element={<LazyRoute><ModulePage /></LazyRoute>} />
      <Route path="/learn/:documentId" element={<LazyRoute><LearnPage /></LazyRoute>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" to="/"><span className="brand-mark">S</span><span><strong>SEMI</strong><small>Semiconductor Learning</small></span></Link>
          <div className="header-actions">
            <nav aria-label="주요 메뉴">
              <NavLink to="/" end>Home</NavLink>
              <NavLink to="/curriculum">Curriculum</NavLink>
            </nav>
            <AuthForm />
          </div>
        </div>
      </header>
      <AppRoutes />
      <footer className="site-footer"><div className="page-width"><span>SEMI</span><p>반도체의 구조와 흐름을 차근차근 연결합니다.</p></div></footer>
    </div>
  );
}
