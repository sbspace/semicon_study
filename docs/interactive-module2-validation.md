# Module 2 Interactive 구현 검증

2026-09-16. Module 2 신규 6종을 구현했다. 기존 wafer-die-transistor는 수정하지 않았다.

## 구현 범위

| Type | 핵심 조작 | production JS / gzip (kB) |
|---|---|---:|
| die-floorplan | Core·Cache·I/O·제어 선택, 연결 보기 | 3.20 / 1.55 |
| feol-mol-beol | 전체·FEOL·MOL·BEOL 선택, 단면 강조 | 3.90 / 1.66 |
| signal-clock-pdn | Signal·Clock·Power의 경로와 역할 비교 | 3.39 / 1.60 |
| pad-bump-package-pcb | 접점별 선택, 전기 연결과 상부 열 경로 비교 | 3.87 / 1.75 |
| chiplet-package | 기능 통합/분할, 나란히/적층 사례 | 3.72 / 1.59 |
| wafer-shot-reticle | 관찰 대상 선택, 반복 Shot 이동 | 4.19 / 1.80 |

Module 2는 7 type, Lesson 6개와 Supplement 3개의 9슬롯 모두 구현됐다. Module 6의 m06-l01/l02도 같은 component를 재사용한다. 전체 등록은 19/53종, 미구현은 34종이다. Module 3은 이번 범위에 포함하지 않았다.

`primitives/StructureView.tsx`에 SVG 이름·설명 ID, native radio 선택, 작은 SVG block 표현만 공통화했다. 각 도식의 좌표·교육 문구·상태는 자체 component에 있다. 공통 chunk는 1.10kB / gzip 0.52kB이며 여섯 도식은 각각 literal lazy import로 별도 분리됐다.

## 검증 결과

- typecheck 통과.
- 전체 Vitest: 9개 파일, 190개 테스트 통과. 신규 19개 테스트는 교육 상태, 실제 11개 문서, 독립 instance·revision/document 초기화·SVG ID, unknown/prototype type fallback을 포함한다.
- 기존 Module 0~1, Quiz, Progress, 앱·콘텐츠 테스트 통과.
- production build 통과. Entry 719.30kB / gzip 218.93kB, CSS 79.39kB / gzip 18.87kB. 기존 500kB 경고는 남는다.
- npm audit: 취약점 0개. 제한된 환경의 네트워크 오류 후 일반 환경에서 재실행했다.
- build: tsx의 환경 오류 후 일반 환경에서 재실행했고, Vite watcher의 generated 폴더 잠금을 해제한 뒤 성공했다. 개발 서버는 5173으로 복원했다.
- content 83개, generated 83개, src/content 8개의 작업 전 파일별 SHA-256을 비교했다. 174개 모두 동일하다.
- sourceDigest는 작업 전후 `f191aefb43bb5fdcaa6be55a8a65c2f6e1033bbc9a001cdeb9b2e4a6a7644003`으로 동일하다. 이전 batch 이후 사용자가 갱신한 콘텐츠를 이번 작업의 기준으로 삼았다.

## 실제 브라우저

Chrome에서 m02-l02~l06, m02-s-wafer-shot, m02-s-floorplan, m02-s-feol-beol, m06-l01/l02를 열어 실제 component와 동작을 확인했다. 통합 테스트에는 기존 m02-l01도 포함했다.

데스크톱 1200px와 실제 400px에서 FEOL/MOL/BEOL, Signal/Clock/Power, 패키지, Wafer/Shot 네 대표 화면을 시각 확인했다. 모바일에서는 세로로 배치되며 HTML 설명과 SVG label이 읽힌다. 400px에서 Shot 수업의 기존 긴 H1이 넘치는 문제를 발견해 `.lesson-header h1`에 `overflow-wrap:anywhere`를 추가했다.

같은 네 페이지는 320px에서도 document scrollWidth가 320px이고 선택 label의 최소 높이가 44px임을 확인했다. ArrowRight로 Core→Cache, Space로 연결 보기를 조작했고 focus-visible 상태를 확인했다. 신규 도식에는 animation이나 timer가 없으며 기존 reduced-motion CSS를 사용한다. 별도 OS reduced-motion 설정 변경은 하지 않았다.

## 콘텐츠 해석

- Module 2는 정규 6슬롯뿐 아니라 보충 3슬롯도 포함한다. floorplan과 FEOL은 보충에서 같은 기본 표현을 사용한다.
- 최신 Module 6 원문은 Flip Chip의 아래쪽 회로면과 위쪽 방열, Interposer/Bridge와 2.5D/3D를 구분한다. 전기와 열 경로를 별도 모드로 표현했다.
- Shot 보충 원문에는 장비 치수 예시가 있지만 범용 규격이 아니라는 편집 보완이 있다. UI에는 규격 숫자를 넣지 않고 Shot·Die·Scribe·Reticle 관계만 표현했다.
- 다음 batch는 Module 3의 정규 Lesson 9종과 process-integration-review 1종을 묶을 수 있다.
