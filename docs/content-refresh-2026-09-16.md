# 콘텐츠 재생성 확인 — 2026-09-16

## 후속 작업: conversational-teacher-v2 반영 완료

아래 이전 작업 기록의 “반말 수정본 미확인” 상태는 이번 후속 작업으로 해소되었다.

- `m04-l01`에서 “Module 3에서는 웨이퍼에 소자를 만들고 배선으로 연결하는 과정을 봤지.”와 `style_revision: conversational-teacher-v2`를 확인했다.
- Module 4~9의 Lesson 26개·Review 6개 모두 style_revision, 원문 전체 본문과 generated JSON의 일치, 원본 SHA-256과 revision의 일치, generated와 dist JSON의 일치를 검사했다. 불일치 0개. 작업 중 content 원본 변경 0개.
- 기존 절차로 전체 82개 문서와 index를 재생성했다. 새 sourceDigest는 `f191aefb43bb5fdcaa6be55a8a65c2f6e1033bbc9a001cdeb9b2e4a6a7644003`이다.
- `src/content/quiz.ts`: 정답 영역 안의 단독 `**Q1**` 형식을 번호로 연결하도록 추가했다. 기존에는 새 32개 Quiz가 원문 fallback으로만 표시됐다. 수정 후 모든 대상 Quiz가 structured이며 기존 답안 보기 UI를 유지한다.
- `src/content/parse.ts`: style_revision 문자열을 extra에 보존하는 알려진 편집 메타데이터로 처리한다. 파서 버전은 0.3.1로 갱신했다.
- `tests/content.test.ts`, `tests/quiz.test.ts`: 최신 콘텐츠 버전·heading 수·Q 번호 기대값을 갱신하고, 답안 순서가 바뀌어도 번호로 정확히 연결되는 회귀 검사를 추가했다.
- 기존 cache 재검증, 디자인, Lesson ID/경로, 진도 저장, Interactive registry는 변경하지 않았다. 콘텐츠 83개 원본은 작업 시작 후 그대로 유지했다.
- typecheck 및 Vite 빌드 완료, 테스트 8개 파일/171개 통과. 빌드의 기존 718.40 kB entry chunk 경고는 유지된다. PowerShell 로그 리다이렉션은 이 stderr 경고를 NativeCommandError로 표시했지만 Vite 자체는 built 완료를 보고했다.
- Chrome에서 Module 4·9의 Lesson 10개와 Review 2개를 열고 각 문서의 반말 본문 및 첫 Quiz 모범 답안/해설을 실제로 확인했다.
- 로컬 서버 주소: `http://localhost:5173`. 이미 열린 탭은 새로고침하면 최신 콘텐츠를 읽는다. 사용자 요청에 따라 원격 배포는 수행하지 않았다.

## 이전 작업 기록

- 기준 원본: `C:\CL_edu\content`. 원본 83개 파일은 작업 전후 SHA-256이 동일하다. 본문을 수정하거나 요약하지 않았다.
- `content/README.md`, `curriculum.yaml`, parser/writer, loader, renderer, 진도 저장 코드를 확인했다. `npm.cmd run build`가 콘텐츠 검증 → `.generated/content` 생성 → typecheck → Vite `dist` 생성을 수행한다.
- 생성 결과: Module 10개, Lesson 53개, Review 10개, Supplement 5개, Supporting 4개. 총 82개 문서와 index JSON이다. 커리큘럼과 원본 목록 검증 통과. 모든 문서 revision이 원본 파일 SHA-256과 일치하며 generated와 dist 문서도 모두 일치한다.
- sourceDigest: `547b7e0241e21e425009f5ceb903348e37d6aa5e61400ffa388f6549c1125447`.
- 재생성된 콘텐츠 JSON은 작업 전 JSON과 동일하다. 현재 원본에는 Module 4 Lesson 1의 “생각해 봅시다”, Module 9 Review의 “설명합니다” 등 존댓말이 남아 있다. 요청한 반말 수정본의 반영 완료로 판단할 수 없다. 실제 수정본 경로 확인이 필요하다.

## 변경과 캐시

- `src/app/content.ts`: 고정 JSON URL 요청에 `cache: 'no-cache'`를 지정하여 HTTP 캐시를 재검증한다.
- `tests/app.test.tsx`: 해당 요청 계약을 검증한다.
- `.generated/content/`, `dist/` 재생성. 콘텐츠 JSON 내용은 동일하며 앱 번들에는 캐시 수정이 포함된다.
- ContentLoader의 세션 내 메모리 캐시는 유지한다. 이미 열린 화면은 새로고침해야 새 index를 읽는다. localStorage 진도 키와 저장 구조, Lesson ID/경로, Quiz 접근, Interactive registry는 변경하지 않았다.

## 검증

- `npm.cmd test`: 8개 파일, 170개 테스트 통과. 원문 블록 재조합, Quiz, 진도 보존, Interactive 회귀 검사 포함.
- `npm.cmd run build`: 콘텐츠 변환, typecheck, Vite 빌드 통과. entry JS 718.40 kB / gzip 218.58 kB. 500 kB 초과 chunk 경고는 남아 있다.
- Chrome에서 `/learn/m04-l01`~`m04-l06`, `/learn/m04-review`, `/learn/m09-l01`~`m09-l04`, `/learn/m09-review`를 실제로 열어 제목·본문·표·요약·Quiz가 표시됨을 접근성 트리로 확인했다. Module 4 Lesson 1 및 두 Review에서 모범 답안 버튼과 해설 표시를 확인했다.
- Module 4·9 원본에는 `$` 수식 구문이 없다. 기존 수식 렌더러는 변경하지 않았고 기존 렌더링 테스트가 통과했다.
- 브라우저 스크린샷 캡처는 두 차례 timeout으로 실패했다. 픽셀 단위 레이아웃 검증 완료를 주장하지 않는다.
- 실행 중 Vite가 출력 디렉터리 교체를 막아 해당 개발 서버를 중지한 후 빌드했다. 검증 후 기존 `http://localhost:5173` 개발 서버를 다시 실행했다.

## 배포

원격 배포는 수행하지 않았다. 프로젝트에 Git 저장소, 배포 스크립트, 호스팅 설정 또는 배포 대상 주소가 없다. `dist/`의 로컬 배포 산출물은 준비되었지만 기존 원격 사이트를 갱신하려면 배포 대상과 접근 수단이 필요하다. 먼저 반말 수정본이 담긴 실제 원본 폴더도 확인해야 한다.
