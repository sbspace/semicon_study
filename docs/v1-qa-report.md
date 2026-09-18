# v1 출시 전 QA 보고서

2026-09-18 기준으로 현재 앱의 사용자 흐름, 78개 공개 학습 라우트, Interactive·Quiz·Visual, 진도 저장, 접근성, 반응형, 오류 상태를 점검했다. 이번 작업은 UI와 런타임 처리만 수정했으며 `content/`, parser 계약, generated 콘텐츠의 의미와 문장은 변경하지 않았다.

## 1. 범위와 방법

검사한 공개 화면은 Home, Curriculum, Module 0~9, 정규 Lesson 53개, Review 10개, Supplement 5개, 잘못된 route와 존재하지 않는 document ID다. supporting 문서 4개는 콘텐츠 색인에는 있으나 현재 주요 학습 UI의 독립 route로 노출하지 않는 기존 경계를 유지했다.

- 자동 브라우저 route 검사: Module 10 + 학습 문서 68 = **78 route**
- 별도 흐름 검사: Home, Curriculum, Not Found, unknown document, fetch failure fallback
- 반응형 검사: 320, 400, 768, 1280px × 대표 7화면 = **28 조합**
- 대표 화면: Home, Curriculum, 긴 Lesson, Quiz·Interactive 혼합 Lesson, 정적 Visual, reference image/pending, 표·코드가 있는 Lesson
- 실제 조작 Interactive: wafer-die-transistor, voltage-current, cmos-inverter, sram-cell, photo-pattern-transfer, cpu-gpu-parallelism, hbm-stack, chiplet-interoperability
- 실제 조작 Quiz: single-choice, free-response, O/X, cumulative, reflection
- 진도 흐름: 완료 → 새로고침 → Home 진도/이어하기 → 완료 취소

## 2. 결과

78개 route는 모두 제목과 본문을 정상 렌더했고 ContentLoader 오류, missing generated JSON, unknown document mismatch, 미지원 directive 노출이 없었다. 브라우저에서 lazy 로딩 완료까지 기다려 합산한 결과 Interactive는 **60/60 실제 component, fallback 0**이었다.

Visual 58슬롯의 최종 처리는 다음과 같다.

| 처리 | 슬롯 | 브라우저 결과 |
|---|---:|---|
| resolvedByInteractive | 21 | 안내 링크 21, target 연결 정상 |
| static SVG | 25 | 실제 자산 렌더 정상 |
| illustration | 1 | 실제 자산 렌더 정상 |
| approved local image | 2 | 이미지·alt·출처 렌더 정상 |
| link-only | 3 | 외부 원자료 링크 카드 정상 |
| pending | 5 | pending 안내 정상 |
| omit | 1 | 빈 figure/공백 없이 비노출 |
| 미등록 fallback | 0 | 없음 |

정적 SVG 25 + illustration 1 + approved image 2는 브라우저 DOM에서 `visual-asset` 28개로 확인했다. pending 5는 오류가 아니라 승인 가능한 CPU die 및 chip cross-section 자료가 남아 있는 명시적 상태다.

Quiz는 기존 parser 검증 기준 **69그룹 / 244문항**을 유지한다. 브라우저에서 선택형 정답 판정, 서술형 답안 입력과 모범 답안 공개, O/X 판정, 누적 Review 진행 요약, reflection UI를 직접 확인했다. Quiz 결과와 수동 학습 완료는 기존 정책대로 독립적이다.

## 3. 발견 및 수정한 문제

| ID | Severity | 문제 | 수정 | 파일 |
|---|---|---|---|---|
| QA-01 | Medium | Lesson/Module 상단 제목과 원문 첫 H1/H2가 중복되어 한 페이지에 같은 제목과 H1이 반복됨 | 상단 chrome이 있는 화면에서 첫 Markdown 블록의 문서 H1과 동일 제목 H2만 렌더 단계에서 제외. 원문은 유지 | `Markdown.tsx`, `ContentRenderer.tsx`, `App.tsx` |
| QA-02 | Medium | 320px에서 Home roadmap 카드가 5px, Curriculum 모듈 카드가 8px 전역 가로 넘침 | grid track을 `minmax(0, 1fr)`로 바꾸고 카드 내부 최소 폭을 0으로 제한 | `styles.css` |
| QA-03 | Medium | 현재 완료 상태가 긴 본문 맨 아래에서만 보여 Lesson 상단에서 확인할 수 없음 | 상단 metadata에 `완료/미완료` 텍스트 배지를 추가하고 완료·취소 즉시 동기화 | `App.tsx`, `styles.css` |
| QA-04 | Medium | index/document fetch 실패의 내부 HTTP 오류 문자열이 사용자 오류 화면에 전달될 수 있음 | route별 친화적 오류 문구만 표시하고 원시 loader message를 UI에 전달하지 않음 | `App.tsx` |
| QA-05 | Low | 긴 한글 제목에 `overflow-wrap:anywhere`만 적용되어 어색한 한 글자 줄바꿈 가능 | 한글 phrase 기준 줄바꿈, `text-wrap: pretty`, overflow 안전 fallback을 함께 적용 | `styles.css` |
| QA-06 | Low | 일부 도식 control에만 명시적 focus ring이 있어 일반 링크·버튼의 키보드 focus 표현이 일관되지 않음 | 전역 `:focus-visible` outline을 추가하고 기존 도식별 강조색은 유지 | `styles.css` |

Severity 합계는 **Critical 0 / High 0 / Medium 4 / Low 2**이며 여섯 건을 모두 수정했다. 신규 기능이나 대규모 redesign은 하지 않았다.

## 4. UX 및 접근성 확인

- Lesson 상단에 Module, 문서 종류/번호, 예상 시간, 제목, 현재 완료 상태가 보인다.
- Lesson 하단의 완료/취소와 Previous/Next/Module 이동은 분리돼 있으며 미완료 상태에서도 다음 Lesson에 접근할 수 있다.
- Home의 전체 진도, 이어하기, 10개 Module roadmap과 Curriculum의 Lesson/Review/Supplement 계층이 유지된다.
- Lesson chrome의 H1은 하나이며 본문 소제목의 heading 순서를 보존한다.
- 완료, 정답/오답, pending, 선택 상태는 텍스트·기호·ARIA 상태로도 전달된다.
- 이미지 alt, 외부 링크, Interactive region, radio/range/button label, SVG title/desc 계약을 기존 테스트와 대표 브라우저 화면에서 확인했다.
- 키보드로 Interactive control에 focus한 뒤 Enter로 상태를 변경했고 명시적 focus ring을 확인할 수 있는 CSS 계약을 추가했다.

이번 접근성 확인은 DOM·키보드·기존 테스트를 이용한 출시 전 점검이며, 별도 스크린리더 조합별 인증이나 전면 WCAG 적합성 평가는 아니다.

## 5. 반응형과 가독성

초기 검사에서 320px Home/Curriculum의 전역 가로 넘침 두 건을 발견해 수정했다. 수정 후 320, 400, 768, 1280px의 28개 대표 조합에서 `documentElement.scrollWidth` 기준 전역 가로 넘침은 0이었다. 표, code/ASCII, 복잡한 SVG의 내부 스크롤은 의도한 컨테이너 안에 유지했다.

긴 Lesson에서 본문 폭, line-height, heading 간격, list, blockquote, table, inline/fenced code, 수식, Quiz, Interactive와 Visual의 연결을 확인했다. 긴 한글 제목은 컨테이너를 넘지 않으면서 phrase 단위 줄바꿈을 우선한다.

## 6. 오류·로딩 상태

- 잘못된 route: 친화적 Not Found와 Curriculum 복귀 링크
- 존재하지 않는 document ID: 친화적 Lesson 오류, 내부 파일명/HTTP 문자열 미노출
- Content fetch 실패: 전체 navigation을 무너뜨리지 않는 ErrorState
- Interactive/Visual lazy load: 실제 60/60 및 등록 Visual 로딩 후 fallback 0
- Visual pending/link-only/omit: 각각 명시적 UI, 외부 링크 카드, DOM 비노출로 구분

## 7. 회귀 검증과 빌드

- `npm.cmd run typecheck`: 통과
- `npm.cmd test`: **15 files, 320 tests 통과**
- `npm.cmd run build`: 통과, 82개 콘텐츠 문서 재생성 및 production build 성공
- `npm.cmd audit --offline`: **0 vulnerabilities**
- 브라우저 route 검사: **78/78 통과**
- 브라우저 반응형 검사: **28/28 통과**

회귀 검증에는 Lesson H1 단일성, 중복 H2 제거, 상단 완료 상태의 완료/취소 동기화, 내부 loader 오류 문자열 비노출 assertion을 추가했다.

## 8. 콘텐츠 무결성

`content/`은 83파일이며 작업 전후 집계 SHA-256은 모두 `120086497f4241a600e5b183b5297a7de6250213afbc2778e3a5212157b49228`이다. generated index의 sourceDigest도 작업 전후 모두 `f191aefb43bb5fdcaa6be55a8a65c2f6e1033bbc9a001cdeb9b2e4a6a7644003`이다. 콘텐츠 원문 수정은 0건이다.

## 9. 남은 known issue와 출시 판단

1. reference image **pending 5슬롯**: CPU die 3슬롯(020, 021, 046), chip cross-section 2슬롯(022, 045). 의도한 pending UI가 있으므로 현재 route를 막지 않는다. 권리와 교육적 식별 근거가 확보되기 전 임의 이미지로 대체하지 않는다.
2. 이 QA 시점의 production entry chunk는 **765.30 kB, gzip 234.58 kB**로 Vite의 500 kB 경고가 남았다. 이후 v1 release 최적화에서 route-level split을 적용해 해결했으며 최종 수치와 배포 확인은 [v1 release checklist](v1-release-checklist.md)를 기준으로 한다.
3. `npm audit`의 온라인 registry 요청은 실행 환경의 외부 전송 승인을 받지 못해, 설치된 lock/cache를 이용한 `--offline` 검사로 완료했다. 결과는 0건이지만 출시 파이프라인에서는 온라인 audit을 다시 실행하는 편이 좋다.

현재 확인된 **v1 release blocker는 없다**. 다음 Release 단계에서는 pending reference image 권리·교육 적합성 조사, entry chunk 분석, 실제 배포 환경 smoke test와 스크린리더/브라우저 조합 접근성 점검을 진행하면 된다.

## 10. 이번 QA에서 변경한 파일

- `src/app/App.tsx`
- `src/app/ContentRenderer.tsx`
- `src/app/Markdown.tsx`
- `src/app/styles.css`
- `tests/app.test.tsx`
- `docs/v1-qa-report.md`
