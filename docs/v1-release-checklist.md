# v1.0.0 release checklist

2026-09-18 기준의 실제 출시 확인 목록이다. 세부 브라우저 QA 근거는 [v1 QA 보고서](v1-qa-report.md)를 참조하고, 이 문서는 재현 가능한 출시 명령과 배포 직전 확인 사항만 유지한다.

## 코드와 콘텐츠

- [x] Module 0~9, Lesson 53, Review 10, Supplement 5가 generated index에 존재한다.
- [x] `content/` 원본 83파일의 작업 전후 집계 SHA-256이 일치한다.
- [x] generated index `sourceDigest`가 `f191aefb43bb5fdcaa6be55a8a65c2f6e1033bbc9a001cdeb9b2e4a6a7644003`으로 유지된다.
- [x] parser와 generated document 계약을 변경하지 않았다.
- [x] Quiz 69그룹/244문항, Interactive 53종/60인스턴스, Visual 58슬롯을 유지한다.
- [x] 진도 완료·취소·이어하기가 `localStorage`에서 복원된다.

## 품질 게이트

- [x] `npm run typecheck`
- [x] `npm test` — 15 files, 321 tests
- [x] `npm run build`
- [x] `npm run verify`
- [x] `npm audit --offline` — 0 vulnerabilities
- [x] production entry와 Home 초기 요청에서 Lesson renderer, Markdown, KaTeX, Quiz, Interactive/Visual registry가 제외된다.
- [x] 500 kB chunk warning이 발생하지 않는다.
- [x] production preview의 대표 8개 route가 직접 접근과 새로고침에서 정상 동작한다.
- [x] 대표 Lesson에서 content JSON, Quiz, Interactive, Visual, approved image, 완료 진도를 확인한다.
- [x] 320px/desktop 레이아웃과 reduced-motion 정책을 유지한다.
- [x] 키보드로 Home → Curriculum → Lesson → Quiz → Interactive → 완료 → Next 흐름을 진행할 수 있다.
- [x] lazy route 실패는 내부 stack이나 chunk URL 없이 친화적 오류 화면으로 격리된다.

## 배포 직전 운영 확인

- [ ] 배포 CI에서 네트워크가 허용된 `npm audit`을 다시 실행한다.
- [ ] 정적 호스트가 모든 앱 route를 `index.html`로 rewrite하도록 SPA fallback을 설정한다.
- [ ] 실제 배포 URL에서 `/learn/m01-l02` 직접 접근과 새로고침을 확인한다.
- [ ] `dist/`만 배포하고 `.generated/`, `content/`, 테스트 파일은 공개 산출물에 섞지 않는다.

## 알려진 제약

- reference image pending 5슬롯은 승인 가능한 원자료가 확보될 때까지 pending 안내를 유지한다. v1 학습 흐름을 막지 않는다.
- 진도는 브라우저 로컬 저장소 전용이며 로그인과 cloud sync는 제공하지 않는다.
- 특정 hosting vendor 설정은 이 저장소에 포함하지 않는다. SPA fallback은 배포 대상에 맞춰 설정한다.

## 판정

로컬 production artifact와 QA 기준으로 **Release Ready**다. 위의 미체크 항목은 실제 네트워크와 호스팅 대상이 정해진 배포 단계에서 수행할 운영 항목이며, 현재 앱 artifact의 release blocker는 아니다.
