# SEMI — 반도체 학습 앱

SEMI는 반도체 기초부터 CMOS, 칩 구조, 제조 공정, 패키징, HBM과 최신 산업 흐름까지 연결하는 한국어 학습 앱입니다. Module 0~9의 53개 Lesson, 10개 Review, 5개 Supplement를 제공하며 Quiz, 조작형 도식, 정적 Visual, 브라우저 진도 저장을 포함합니다.

교육 원문과 작성 규칙은 [`content/README.md`](content/README.md), 출시 전 QA 근거는 [`docs/v1-qa-report.md`](docs/v1-qa-report.md), 실제 출시 절차는 [`docs/v1-release-checklist.md`](docs/v1-release-checklist.md)에서 확인할 수 있습니다.

## 주요 기능

- 10개 Module과 68개 학습 문서
- 53종, 60개 Interactive 인스턴스
- 58개 Visual 슬롯의 명시적 처리
- 69개 Quiz 그룹, 244문항
- `localStorage` 기반 완료 진도와 이어서 학습
- Markdown, GFM 표, 코드/ASCII, 인라인·블록 수식
- 라우트, Interactive, Visual 단위 지연 로딩

## 기술 스택과 요구 사항

- React 19, React Router 7
- TypeScript 5, Vite 8, Vitest 4
- react-markdown, remark/rehype, KaTeX
- **Node.js 20 이상** (`package.json`의 `engines` 기준)

## 설치와 실행

```bash
npm install
npm run dev
```

개발 서버는 콘텐츠 산출물을 먼저 갱신한 뒤 Vite를 시작합니다. 앱은 `content/index.json`을 한 번에 읽지 않으며, 생성된 경량 index를 로드한 뒤 선택한 문서 JSON만 가져옵니다.

## 검증과 production build

```bash
npm run typecheck
npm test
npm run build
npm run verify
npm run preview
```

- `npm run build:content`: `content/`를 검사하고 `.generated/content/`를 다시 생성합니다.
- `npm run build`: 콘텐츠 생성, 타입 검사, Vite production build를 순서대로 실행합니다.
- `npm run verify`: 타입 검사, 전체 테스트, production build를 한 번에 실행합니다.
- `npm run analyze:bundle`: 쓰기 없는 production build로 chunk별 크기와 주요 모듈 기여도를 출력합니다.
- production 결과는 `dist/`에 생성됩니다.

`.generated/content/`는 `content/`에서 만들어지는 파생 산출물입니다. 직접 편집하지 말고 `npm run build:content`로 갱신해야 합니다. `content/` 원문을 변경했다면 생성 결과와 `sourceDigest`를 함께 검토합니다.

## 정적 호스팅

이 앱은 `BrowserRouter`를 사용합니다. `/learn/m01-l02` 같은 주소를 직접 열거나 새로고침해도 `index.html`로 전달되도록 정적 호스트에 SPA fallback/rewrite가 필요합니다. 배포 전에 실제 호스트에서 deep link를 다시 확인하세요.

## v1 known issues

- CPU die 3슬롯과 chip cross-section 2슬롯, 총 5개 reference image는 사용권과 교육적 식별 근거를 확인 중이며 명시적 pending UI로 표시됩니다.
- 진도는 현재 브라우저의 `localStorage`에만 저장됩니다. 로그인, cloud sync, 계정 간 복원은 없습니다.
- 온라인 `npm audit` 결과는 네트워크 가용성에 좌우됩니다. 제한된 환경에서는 `npm audit --offline`을 사용하고, 배포 CI에서는 온라인 audit을 다시 실행하세요.
