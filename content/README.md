# 반도체 교육 콘텐츠 저장소

완전 기초에서 출발해 **소자 → 회로 → 칩 → 공정 → 제품 → 산업**을 연결하는 한국어 교재입니다. Module 0~3은 실제 공유 수업 원문을 중심으로 정리했고, Module 4~9는 같은 설명 방식으로 이어 썼습니다.

정규 Lesson **53개**, Module Review **10개**, 실제 추가 회차 보충 수업 **5개**를 제공합니다. Module 3 Review는 공유본에 원래 복습 본문이 없어 기존 Lesson을 근거로 새로 보완했습니다.

## 시작하기

[Module 0](module-00-basics/module.md)부터 순서대로 읽거나 아래 목차에서 필요한 내용을 선택할 수 있습니다. 모든 본문·Quiz·정답·Review는 처음부터 접근 가능합니다. Quiz는 이해를 확인하는 연습이며 접근 조건이 아닙니다. 개인별 완료 여부와 답안·점수는 이 콘텐츠에 포함하지 않습니다.

## 전체 목차

| Module | 내용 | 정규 Lesson | Review |
|---|---|---:|---|
| 0 | [반도체/전기 기초](module-00-basics/module.md) | 5 | [복습](module-00-basics/review.md) |
| 1 | [트랜지스터와 CMOS](module-01-cmos/module.md) | 7 | [복습](module-01-cmos/review.md) |
| 2 | [칩 구조](module-02-chip/module.md) | 6 | [복습](module-02-chip/review.md) |
| 3 | [반도체 공정](module-03-process/module.md) | 9 | [복습](module-03-process/review.md) |
| 4 | [제품 구조와 CPU/GPU/NPU/SoC/메모리](module-04-products/module.md) | 6 | [복습](module-04-products/review.md) |
| 5 | [첨단 공정](module-05-advanced/module.md) | 4 | [복습](module-05-advanced/review.md) |
| 6 | [패키징](module-06-packaging/module.md) | 4 | [복습](module-06-packaging/review.md) |
| 7 | [HBM](module-07-hbm/module.md) | 4 | [복습](module-07-hbm/review.md) |
| 8 | [파운드리 생태계](module-08-foundry/module.md) | 4 | [복습](module-08-foundry/review.md) |
| 9 | [최신 트렌드](module-09-trends/module.md) | 4 | [복습](module-09-trends/review.md) |

## 파일 구성과 출처

- `curriculum.yaml`: Module과 Lesson의 ID·번호·제목·설명·예상 시간·파일 위치, Review와 보충 자료 목록.
- 각 모듈의 `module.md`: 학습 위치, Lesson 목차와 전후 연결.
- `lesson-NN.md`: 수업 본문·핵심 용어·요약·Quiz·즉시 해설.
- `review.md`: 전체 요약·혼동 개념·연결 관계·누적 Quiz와 해설.
- `supplement-*.md`: 세션별 번호가 겹치는 실제 추가 회차. 정규 Lesson과 별도 ID.
- [source_map.md](source_map.md): 기존 수업별 출처·메시지 ID·번호 충돌·보완 기록.
- [visual_map.md](visual_map.md): 원래 이미지 위치와 향후 도식 슬롯 목록.
- [quality_review.md](quality_review.md): 전체 검토 결과와 원문 보존 예외.

## 학습량과 수업 구성

신규 Lesson은 핵심 목표, 쉬운 비유, 실제 구조·동작, 전후 개념 연결, 실제 제품·FAB 연결, 2~4개 핵심 용어, 요약, Quiz 3개와 해설로 구성합니다. 약 10~15분은 구조와 예제를 직접 설명하는 연습을 포함한 추정치입니다.

원수업은 설명 순서·핵심 문장·표·Quiz를 보존하므로 제목과 문항 배치가 조금씩 다릅니다. 문항 바로 아래 제시된 원래 정답도 유지했습니다. 원래 4문항 Quiz나 5개 용어 표는 보존을 우선했습니다. 길게 이어진 추가 질문 설명은 Lesson 뒤에 두었으며 `extension_minutes`는 선택적으로 이어 읽는 시간입니다. 원문 정정·정의 추가는 편집 보완으로 표시합니다.

## Markdown와 메타데이터 규칙

UTF-8 Markdown와 YAML을 사용합니다. 각 수업의 YAML front matter에는 `id`, `module_id`, `kind`, `title`, `estimated_minutes`, `content_origin`, `last_updated`가 있습니다. 정규 Lesson은 `lesson_number`를 추가합니다. 출처가 있는 본문에는 `source_url`, `source_message_ids`가 있습니다.

`content_origin`은 `adapted_original`(원수업 정리), `new`(신규 작성), `new_supplement`(누락된 복습의 신규 보완)를 구별합니다. Module과 Lesson ID는 표시 제목과 독립적이며 파일을 연결하는 기준입니다. 시간 단위는 분, 날짜는 ISO 8601의 `YYYY-MM-DD` 문자열입니다. `curriculum.yaml`의 파일 경로는 `content/` 기준 상대 경로입니다.

메타데이터에는 개인 진도·점수·잠금·해제 조건을 넣지 않습니다. 목차 순서는 권장 읽기 순서입니다. 향후 앱의 상태 데이터는 콘텐츠와 별도로 관리합니다.

본문은 GFM 표·목록·코드 블록과 `$...$`, `$$...$$` 수식 표기를 사용합니다. 원수업 ASCII는 코드 블록 안에 보존했습니다. 신규 UI, 데이터 parser, 앱 의존성은 포함하지 않습니다.

## 도식과 이미지 슬롯 규칙

다음 태그는 향후 렌더러가 인식할 콘텐츠 표시입니다. 여기에는 실행 코드나 원격 자산을 자동으로 불러오는 동작이 없습니다.

```html
<interactive type="cmos-inverter" />
<visual-needed type="cross-section" description="채널·절연층·게이트를 구분한 GAA 단면" />
```

`interactive`의 `type`은 도식 종류를 나타내는 소문자 kebab-case 식별자입니다. 같은 종류가 여러 Lesson에서 재사용될 수 있으므로 필요하면 Lesson ID와 파일 내 등장 순서를 묶어 인스턴스를 구분합니다.

`visual-needed`의 `type`과 `description`은 필요한 이미지 형태와 내용을 나타냅니다. 원수업 이미지 그룹에서 변환한 항목에는 추적용 `id`도 있습니다. 이미지 주소가 불확실하면 URL을 새로 만들지 않습니다. XML 속성에서 필요한 따옴표 등은 이스케이프했습니다.

이 태그를 지원하지 않는 Markdown 뷰어에서도 주변 본문과 기존 코드 블록은 남습니다. 향후 앱은 미지원 태그를 이미지 설명으로 표시하거나 건너뛸 수 있습니다. 이미지 표시나 Interactive 조작이 본문·정답을 여는 필수 조건이 되어서는 안 됩니다.

## 최신 내용 갱신

Module 9의 기준일은 **2026-09-12**입니다. `as_of`, `last_updated`, `time_sensitive`, `update_review_after`를 기록했습니다. 점검 권장일은 알림 예약이나 자동 갱신 기능이 아닙니다. 실제 기술·제품 상태는 새로운 1차 자료를 확인한 뒤 갱신해야 합니다.

원수업 안의 외부 참고 링크는 그 수업에서 사용된 출처입니다. 신규 수업의 기술·시점 확인 자료와 구분합니다. 새 Lesson에서 제시한 계산용 수치는 가정과 단위를 본문에 명시했습니다.

## 수업 말투와 설명 방식 — 2026-09-16 개정

Module 4~9의 정규 Lesson 26개, Review 6개와 Module 안내를 기존 수업의 대화체로 수정했습니다. Module 0~3 원문은 이 개정에서 변경하지 않았습니다.

앞으로 수업을 추가·수정할 때도 다음 방식을 유지합니다.

- 수업 본문은 친근한 반말로 쓴다. “~입니다 / ~합니다”식 보고서 문장으로 바꾸지 않는다.
- 앞에서 배운 내용에서 출발해 학습자가 궁금해할 질문을 던진다.
- 쉬운 비유 → 실제 구조 → 정확한 개념 순서로 하나씩 설명한다.
- 소제목도 “그럼 CPU 안에서는 누가 무슨 일을 할까?”처럼 수업의 질문을 담는다.
- 긴 문단에 정의를 몰아넣지 않고, 작은 예제를 함께 따라간다.
- 핵심 3줄과 Q1·Q2·Q3, 즉시 확인할 해설로 마무리한다.

내용의 ID·파일 경로·Quiz의 학습 목표·수치 예제·도식 슬롯·출처는 유지했습니다. Module 9의 사실 확인 기준일은 2026-09-12이고, 2026-09-16은 말투와 구성의 개정일입니다.
