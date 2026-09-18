# 원수업 출처 추적

확인일: 2026-09-12. 사용자가 제공한 공유 대화 4개의 공개 본문을 메시지 단위로 대조했습니다. 같은 프로젝트라는 이유로 다른 비공개 세션 전문까지 확보했다고 가정하지 않았습니다. 아래는 실제 확보한 공유 스냅샷의 범위입니다.

## 기준 원칙

- 실제 대화의 교육 본문을 오래된 학습 상태 파일보다 우선했습니다. 상태 파일은 원수업 본문 출처로 사용하지 않았습니다.
- 설명·비유·표·ASCII·Quiz 및 해당 주제의 추가 질의응답을 보존했습니다. 예약·진도·개인 채점 결과·세션 이동 지시는 콘텐츠에서 제외했습니다.
- 표기·제목 레벨·수식 구분자를 Markdown에 맞게 정리하고 내부 인용 토큰은 확인된 원문 URL로 변환했습니다. 이미지 자체를 확보하지 못한 위치는 표시와 주변 설명을 남겼습니다.
- 실제 학습 여부는 이 파일이나 콘텐츠 메타데이터에 기록하지 않습니다.

## 공유 스냅샷

| 출처 | 본문에서 확인한 범위 |
|---|---|
| [Module 0 — 반도체기초(소자와 MOS)](https://chatgpt.com/share/6aa53330-bbf0-83e8-b34f-53e1dc894671) | Module 0 Lesson 1~5와 Review, 뒤쪽의 다른 모듈 수업 5회 |
| [Module 1 — 트랜지스터와 CMOS](https://chatgpt.com/share/6aa5302d-67d0-83e9-b0c6-5b4883ef8170) | Module 1 Lesson 1~7과 Review |
| [Module 2 — 칩 구조 / 로직 / 메모리](https://chatgpt.com/share/6aa5303e-8a2c-83ee-8693-21afceb6bd01) | Module 2 Lesson 1~6과 Review. 수정 전·후 Lesson 1 존재 |
| [Module 3 — 반도체 공정](https://chatgpt.com/share/6aa52f15-5fac-83e8-bda5-c96211eeb771) | Module 3 Lesson 1~9와 추가 질문 설명. Review 본문 미포함 |

## 번호·회차 충돌의 처리

Module 2 전용 세션의 Lesson 1에는 사용자의 지적 뒤 다시 작성된 버전이 있어, 그 수정본을 본문으로 삼았습니다. 명시적으로 다시 작성된 이전 초안은 정규 수업으로 중복 편입하지 않았습니다. Module 0 세션에서 시작했다가 새 세션에서 다시 시작하도록 명시된 Module 1 Lesson 1도 전용 세션 버전을 사용했습니다.

Module 0 세션 뒤쪽에도 Module 1 Lesson 4·7 및 Module 2 Lesson 2·3·6이 실려 있습니다. Module 1 두 회차는 전용 세션의 해당 본문보다 앞선 버전입니다. Module 2의 후속 FEOL/BEOL·Floorplan 회차는 전용 세션의 같은 주제보다 뒤에 있지만, 번호와 순서가 다릅니다. 최신 설명도 함께 검토했으며 서로 다른 번호가 같은 주제를 가리킨다는 점을 표시했습니다. 전용 세션의 더 상세한 본문·목차를 유지하고 후속 전체 원문을 보충 자료로 보존했습니다. 최신 교정과 충돌하는 오래된 설명을 정답으로 채택하지 않았습니다.

Shot·Reticle·Scribe Line 회차는 독립적인 교육 내용이므로 `supplement-wafer-shot.md`로 전부 보존했습니다. 전용 세션의 Lesson 6인 Monolithic/Chiplet을 덮어쓰거나 두 개를 같은 ID로 저장하지 않았습니다.

## 파일별 출처

메시지 시각은 공유본의 생성 시각을 한국 표준시(KST)로 변환한 값입니다. 파일 front matter의 `source_message_ids`에는 추가 설명의 ID까지 들어 있습니다. 아래 SHA-256은 대표 원문 메시지 텍스트의 지문이며 편집 후 파일의 지문과 다릅니다.

### Module 0

| 파일 | 출처 / 대표 메시지 시각(KST) | 메시지 ID |
|---|---|---|
| [lesson-01.md](module-00-basics/lesson-01.md) | [공유 원문](https://chatgpt.com/share/6aa53330-bbf0-83e8-b34f-53e1dc894671) / 2026-08-24 10:31 | `549c7e21-97c4-4dbf-8d38-d8cf9148c626` |
| [lesson-02.md](module-00-basics/lesson-02.md) | [공유 원문](https://chatgpt.com/share/6aa53330-bbf0-83e8-b34f-53e1dc894671) / 2026-08-24 17:48 | `789deda8-3985-4fc1-99e8-a615198ffc7f` |
| [lesson-03.md](module-00-basics/lesson-03.md) | [공유 원문](https://chatgpt.com/share/6aa53330-bbf0-83e8-b34f-53e1dc894671) / 2026-08-25 08:42 | `bb062b58-06d2-4646-b063-dd2d4ffa1901`, `7a798f5a-8434-4c6a-b0c8-4ff87a5f0618`, `20d8a475-14dc-4d15-9f33-130ce970c23a` |
| [lesson-04.md](module-00-basics/lesson-04.md) | [공유 원문](https://chatgpt.com/share/6aa53330-bbf0-83e8-b34f-53e1dc894671) / 2026-08-25 12:52 | `8656df7f-6cb2-48f3-918b-d4dfd04d441a`, `94727872-0a6b-4c1c-9c19-ba51e9eaec41` |
| [lesson-05.md](module-00-basics/lesson-05.md) | [공유 원문](https://chatgpt.com/share/6aa53330-bbf0-83e8-b34f-53e1dc894671) / 2026-08-26 08:08 | `59f577a9-286f-4b0d-b4a1-943e35188a0b` |
| [review.md](module-00-basics/review.md) | [공유 원문](https://chatgpt.com/share/6aa53330-bbf0-83e8-b34f-53e1dc894671) / 2026-08-26 19:02 | `837a6f82-a07d-40fc-86a8-05bc449a9a10` |

### Module 1

| 파일 | 출처 / 대표 메시지 시각(KST) | 메시지 ID |
|---|---|---|
| [lesson-01.md](module-01-cmos/lesson-01.md) | [공유 원문](https://chatgpt.com/share/6aa5302d-67d0-83e9-b0c6-5b4883ef8170) / 2026-08-26 19:22 | `895d5043-0c5e-4b3a-88dd-1b19adcd98a9`, `76b61170-b9b1-4b6a-a92c-f6dc3b0895bf`, `e1b9bfa5-7aad-4da7-a571-e1712d28c8ce` |
| [lesson-02.md](module-01-cmos/lesson-02.md) | [공유 원문](https://chatgpt.com/share/6aa5302d-67d0-83e9-b0c6-5b4883ef8170) / 2026-08-27 09:57 | `22491a41-91b1-47b6-860d-c7dd185991eb` |
| [lesson-03.md](module-01-cmos/lesson-03.md) | [공유 원문](https://chatgpt.com/share/6aa5302d-67d0-83e9-b0c6-5b4883ef8170) / 2026-08-27 19:51 | `968eb9a0-9841-4c54-a80e-2d73b547f9d6` |
| [lesson-04.md](module-01-cmos/lesson-04.md) | [공유 원문](https://chatgpt.com/share/6aa5302d-67d0-83e9-b0c6-5b4883ef8170) / 2026-08-28 11:44 | `50c8c97b-9705-40c3-9f85-47e898bfa902` |
| [lesson-05.md](module-01-cmos/lesson-05.md) | [공유 원문](https://chatgpt.com/share/6aa5302d-67d0-83e9-b0c6-5b4883ef8170) / 2026-08-28 11:57 | `32ade514-89df-4f2c-8c5f-10979d77e795` |
| [lesson-06.md](module-01-cmos/lesson-06.md) | [공유 원문](https://chatgpt.com/share/6aa5302d-67d0-83e9-b0c6-5b4883ef8170) / 2026-08-28 14:45 | `4b0365bd-85a7-44f5-ab8f-d5ff10262239` |
| [lesson-07.md](module-01-cmos/lesson-07.md) | [공유 원문](https://chatgpt.com/share/6aa5302d-67d0-83e9-b0c6-5b4883ef8170) / 2026-08-29 09:55 | `37e058bd-23b1-4a86-840c-c6d93ed2e204`, `ce7e9ffb-4f46-47ca-8048-46160250b330` |
| [review.md](module-01-cmos/review.md) | [공유 원문](https://chatgpt.com/share/6aa5302d-67d0-83e9-b0c6-5b4883ef8170) / 2026-08-29 10:37 | `1ff42d19-088a-4100-9cf5-da4450b1f6b1` |
| [supplement-half-adder.md](module-01-cmos/supplement-half-adder.md) | [공유 원문](https://chatgpt.com/share/6aa53330-bbf0-83e8-b34f-53e1dc894671) / 2026-08-28 08:13 | `76a8897a-9e8a-420f-87e8-fadc6206481a` |
| [supplement-sram.md](module-01-cmos/supplement-sram.md) | [공유 원문](https://chatgpt.com/share/6aa53330-bbf0-83e8-b34f-53e1dc894671) / 2026-08-29 08:07 | `6d11ed4a-45de-4a68-8339-86cb7cc32563` |

### Module 2

| 파일 | 출처 / 대표 메시지 시각(KST) | 메시지 ID |
|---|---|---|
| [lesson-01.md](module-02-chip/lesson-01.md) | [공유 원문](https://chatgpt.com/share/6aa5303e-8a2c-83ee-8693-21afceb6bd01) / 2026-08-29 11:41 | `f6d58cdd-cbdd-45d0-a860-0e5865cc4fc0` |
| [lesson-02.md](module-02-chip/lesson-02.md) | [공유 원문](https://chatgpt.com/share/6aa5303e-8a2c-83ee-8693-21afceb6bd01) / 2026-08-30 12:17 | `74088eba-c22b-4173-b1f0-79f60e53bf8c` |
| [lesson-03.md](module-02-chip/lesson-03.md) | [공유 원문](https://chatgpt.com/share/6aa5303e-8a2c-83ee-8693-21afceb6bd01) / 2026-08-30 12:59 | `b4aea9a0-787d-4f6c-9f66-a8823fb3bf67` |
| [lesson-04.md](module-02-chip/lesson-04.md) | [공유 원문](https://chatgpt.com/share/6aa5303e-8a2c-83ee-8693-21afceb6bd01) / 2026-08-30 21:43 | `649f56b8-b547-4e41-aeda-caa210063305` |
| [lesson-05.md](module-02-chip/lesson-05.md) | [공유 원문](https://chatgpt.com/share/6aa5303e-8a2c-83ee-8693-21afceb6bd01) / 2026-09-01 21:30 | `e5e79a0b-8cf5-4ef2-939c-13a8b4b62151`, `4e2a2547-f6c3-4a86-8a04-ff283eefb293` |
| [lesson-06.md](module-02-chip/lesson-06.md) | [공유 원문](https://chatgpt.com/share/6aa5303e-8a2c-83ee-8693-21afceb6bd01) / 2026-09-02 21:54 | `f1ca91ef-a947-48a7-b2a3-5c045e17bafe` |
| [review.md](module-02-chip/review.md) | [공유 원문](https://chatgpt.com/share/6aa5303e-8a2c-83ee-8693-21afceb6bd01) / 2026-09-03 08:07 | `40830d08-39c7-4588-af1d-c3da0e126e9f` |
| [supplement-feol-beol.md](module-02-chip/supplement-feol-beol.md) | [공유 원문](https://chatgpt.com/share/6aa53330-bbf0-83e8-b34f-53e1dc894671) / 2026-08-31 08:42 | `6e04ae79-bc24-4ef1-b33b-8f22f732403e` |
| [supplement-floorplan.md](module-02-chip/supplement-floorplan.md) | [공유 원문](https://chatgpt.com/share/6aa53330-bbf0-83e8-b34f-53e1dc894671) / 2026-09-01 08:23 | `ef8207af-5ea3-44a4-b024-8c66b2eba8e3` |
| [supplement-wafer-shot.md](module-02-chip/supplement-wafer-shot.md) | [공유 원문](https://chatgpt.com/share/6aa53330-bbf0-83e8-b34f-53e1dc894671) / 2026-09-02 08:25 | `ee72864b-0af9-48bd-8709-16042637bf0c` |

### Module 3

| 파일 | 출처 / 대표 메시지 시각(KST) | 메시지 ID |
|---|---|---|
| [lesson-01.md](module-03-process/lesson-01.md) | [공유 원문](https://chatgpt.com/share/6aa52f15-5fac-83e8-bda5-c96211eeb771) / 2026-09-05 09:27 | `3d57decf-0d62-4be3-923d-00def9924d9d`, `4fdec087-b651-4618-b05a-c7348fe891cb` |
| [lesson-02.md](module-03-process/lesson-02.md) | [공유 원문](https://chatgpt.com/share/6aa52f15-5fac-83e8-bda5-c96211eeb771) / 2026-09-05 11:02 | `3cfe5b61-163c-4347-963a-64b488a3ea7f`, `08b9911d-c12a-4c0b-b979-c0a7da3fdc32`, `b9b98df9-7b93-49cd-95df-4e9facdcf855` |
| [lesson-03.md](module-03-process/lesson-03.md) | [공유 원문](https://chatgpt.com/share/6aa52f15-5fac-83e8-bda5-c96211eeb771) / 2026-09-05 15:31 | `c38b0e46-caea-45f6-8d3c-f18c79ed1847` |
| [lesson-04.md](module-03-process/lesson-04.md) | [공유 원문](https://chatgpt.com/share/6aa52f15-5fac-83e8-bda5-c96211eeb771) / 2026-09-07 22:03 | `5485acf0-b3c6-4675-a9ef-efd9a02a0c06` |
| [lesson-05.md](module-03-process/lesson-05.md) | [공유 원문](https://chatgpt.com/share/6aa52f15-5fac-83e8-bda5-c96211eeb771) / 2026-09-07 22:49 | `459f559e-c55d-4995-b2c1-40abb6591f08` |
| [lesson-06.md](module-03-process/lesson-06.md) | [공유 원문](https://chatgpt.com/share/6aa52f15-5fac-83e8-bda5-c96211eeb771) / 2026-09-10 12:38 | `e7094867-e243-4c6d-bdd8-b49f1c08e3ca`, `7516a86f-889c-459b-8c62-77629fe11b8a` |
| [lesson-07.md](module-03-process/lesson-07.md) | [공유 원문](https://chatgpt.com/share/6aa52f15-5fac-83e8-bda5-c96211eeb771) / 2026-09-10 18:11 | `44abf433-865d-4989-afef-064c3a4e04e6` |
| [lesson-08.md](module-03-process/lesson-08.md) | [공유 원문](https://chatgpt.com/share/6aa52f15-5fac-83e8-bda5-c96211eeb771) / 2026-09-10 18:25 | `208da593-31a1-40ec-96db-e3fe69e0d779` |
| [lesson-09.md](module-03-process/lesson-09.md) | [공유 원문](https://chatgpt.com/share/6aa52f15-5fac-83e8-bda5-c96211eeb771) / 2026-09-12 11:03 | `9976e947-6bdf-4df2-a566-92df7d1a7c38` |

### Module 3 Review의 출처 한계

[Module 3 Review](module-03-process/review.md)는 새로 보완한 복습입니다. 공유본 마지막 수업은 다음에 Module Review를 하겠다고 안내하지만 그 복습 본문은 스냅샷에 없습니다. 이 사실은 별도 세션에서의 실제 학습 여부를 판단한 것이 아닙니다. `content_origin: new_supplement`로 구별했습니다.

## 편집 보완 기록

| 위치 | 보완 이유와 범위 |
|---|---|
| Module 0 Lesson 1 | CPU 코어→GPU→SoC 화살표의 잘못된 포함 관계를 설명으로 정정. HBM 나열이 실제 수직 배치가 아님을 명시. 미리 쓰는 제품·단자 용어를 짧게 정의 |
| Module 0 Lesson 3~5 | C와 거리 관계의 가정, 전원 분리와 0전압의 차이, VGS 기준의 문턱 조건을 명시 |
| Module 0 Review | 정공 그림에서 전자의 이동 방향 문장을 정정. FAB 예고 용어를 정의 |
| Module 1 Lesson 1 | 먼저 필요한 VDD/GND 정의와 Quiz 즉시 정답 추가. 원수업 추가 설명 보존, 개인 채점 상태 제외 |
| Module 1 Lesson 7 및 SRAM 보충 | 피드백 화살표는 시간에 따른 진동이 아님을 명시. BL/BLB의 쓰기와 읽기 전 준비 상태 구별 |
| Module 2 Lesson 1 | Standard Cell과 논리게이트 관계가 반드시 독립된 크기의 층은 아님을 명시 |
| Module 2 후속 보충 | 번호 충돌을 표시하고 전체 원문 보존. Shot 크기는 특정 장비 예, Wafer Map은 원인 단서라는 범위 명시 |
| Module 3 Lesson 2~4 | Photo 앞 Film 존재 및 원래 생략 도식의 한계, 플라스마 입자 정의, ALD Cycle의 자기 제한 반응과 성장량 구별 |
| Module 3 Lesson 7 | Dose는 단위 면적당 주입량이며 Energy만으로 깊이가 결정되지 않음을 설명 |
| Module 3 일부 Lesson | 원래 문항 바로 아래 정답은 유지하고 별도 해설 묶음 추가. 누락된 핵심 용어 표 보완 |
| 전반 | 원문 보존을 위해 일부 원래 Quiz 4개·용어 5개인 예외 유지. 긴 질의응답은 추가 학습 시간으로 구분 |

## 신규 Module 4~9

26개 정규 Lesson과 6개 Review는 이번에 새로 작성했습니다. 원수업의 수도관·작업자·도시·구조 확대 방식, 소자→회로→칩→공정→제품 연결, 현업 예시와 즉시 Quiz 해설을 이어받았습니다. 실제 회사 사양과 일정에는 본문의 공식 자료를 연결했고, 교육용 숫자는 가상 조건으로 표시했습니다. Module 9에는 기준일과 다음 점검 권장일을 남겼습니다.

## 이미지·도식 추적

원문 ASCII 구조는 삭제하지 않았습니다. 이미지 그룹은 실제 이미지 URL이 공유 본문에서 복구되지 않은 경우가 있어 `<visual-needed>`와 설명으로 보존합니다. 원문에 직접 들어 있던 이미지 주소는 출처로 남기고 현재 표시 여부를 보장하지 않습니다. [visual_map.md](visual_map.md)에는 삽입 위치와 원문 검색 설명을 정리했습니다.

## 대표 원문 지문

| 파일 | 대표 메시지 SHA-256 |
|---|---|
| module-00-basics/lesson-01.md | `9688cb341e5e06a17ea551e958acbb65e398ded794c27229bacd675d684011ce` |
| module-00-basics/lesson-02.md | `fbe5fa18b2b913a651603db1aa569784bddec9c77a2cad4963f96f6d0fe20bfe` |
| module-00-basics/lesson-03.md | `1b972809c0f1e11a74188c54666595e2a50aefb5fb3e45f5cfbb353a40616178` |
| module-00-basics/lesson-04.md | `ff7af1642fae4548e8a78a32ec9eeb1ed51f26ab40708f73d211b16045def4c5` |
| module-00-basics/lesson-05.md | `0149e328089e21b5bb2316e71c594b5d8d4de5ef9758d2f391e7dba192a4b4f3` |
| module-00-basics/review.md | `af111efc401d6dc8305172ed230d649f5dbe1ac4c8b3cc11644b50ad5f575c4b` |
| module-01-cmos/lesson-01.md | `778fb5ff873c5fc58c6829d8fd3e75a30abf88a233228a3f20cb784f1e6252d0` |
| module-01-cmos/lesson-02.md | `a13d51edb3f15578bc660b6f9d8cec3ae5031c74db2980cfde944083df1961ce` |
| module-01-cmos/lesson-03.md | `bb804ade1603f8313c1d547cd6d4355cdef6d732ec480eed4f3a0a9ecb1dba12` |
| module-01-cmos/lesson-04.md | `7fa2f31e0e2b4f750468316123b3c1bc965b5d89b132f2eb90f72eaecb20c442` |
| module-01-cmos/lesson-05.md | `4a225bf28f5ae344514b8fe16cef4944de860696b557ced9389da922a9d632a1` |
| module-01-cmos/lesson-06.md | `060a4e58b05a10d5f0e7904107f2ddbb416897cff8a62c0b7f6f633c7aecb8f4` |
| module-01-cmos/lesson-07.md | `6410e2e9c4f1926c146ade69c09941dd52dbdd2c463ee2c2f3b7379fb09d18e8` |
| module-01-cmos/review.md | `db42ae9199ce4c4ee28861c56892ebc66eb17e0ebe6dbecb183755ba7aadf7eb` |
| module-02-chip/lesson-01.md | `28c70d618460a4479a9428c57e428150edc85c2ad2df399a082494a86acbc8f4` |
| module-02-chip/lesson-02.md | `ff2ad8a7d396cc8d778886cd5e0daf1023f8f08b81b8f59aa92f50ba9c5fcd98` |
| module-02-chip/lesson-03.md | `060a8b65a35867a8a96c876b2ae1bc605e0fa4d6a735f9d02f725d0cef505935` |
| module-02-chip/lesson-04.md | `3bef323824f32726f2ea2a21eda2439fd8b8d6c36f6a73bf6493e16228de9d78` |
| module-02-chip/lesson-05.md | `381ace766c57f42daeb50b98dd56ab2e9e5a6dfd9bfe272b6d1e0bfee7a3c13f` |
| module-02-chip/lesson-06.md | `a7eaf9bfe347b57e58f6bb296eb2b5d2a6113d13ee24aea8e63ebd8d7ac272df` |
| module-02-chip/review.md | `b2018e5ea4994ce29ddeeafbb42a42d14677f02bddc29649c1f3f800f76fe41d` |
| module-03-process/lesson-01.md | `c50cd52064922236f4e2a09b9a6cbb931b851494fb042d841c75e6940e8fe860` |
| module-03-process/lesson-02.md | `7ce5791ac5ecf7cc41939d8304eae83147e1744f363e5135846075bb18204f28` |
| module-03-process/lesson-03.md | `b2dfa73a0cfaf6d290900a733791034233fa3167c623bed2236a42f0d5eaefcf` |
| module-03-process/lesson-04.md | `ef6ffe96521965ca5a3498cee13e56e552e5cbafd2583a0b36c2acea152a60d2` |
| module-03-process/lesson-05.md | `7253370aaee117ac399b46c5b7aea057c2a25e7cb0224b34e359dcaeb2233166` |
| module-03-process/lesson-06.md | `6d9bf1f3cf61e94ecc52f413669ad00e8a99e652b49341fdd046041f525cf855` |
| module-03-process/lesson-07.md | `971660f1e04112281b1f99a60db39f8c6748e59ce93a785ab63a25bc7b564535` |
| module-03-process/lesson-08.md | `f2ac00b6944b17e5c9513a70d10971629772ed97ba62a120a56beb6c82661f2e` |
| module-03-process/lesson-09.md | `7c286566ae6937abd579c0bd8a805c84de25a5e42c66715abd3d8d2a77f770e1` |
| module-01-cmos/supplement-half-adder.md | `5e021b860df51f173b60b38a6aee5fca5420eb931dec0b12de6ddfb088263a07` |
| module-01-cmos/supplement-sram.md | `59c25b13d598c5fd6295aa966e84bfc8a1a5d2a3061f570cbabbc09c18b2a5b2` |
| module-02-chip/supplement-feol-beol.md | `2ddc5f3d2479c1d9ce0a2c197f1791f8f8917b2974bac58afe6f403e7d9432da` |
| module-02-chip/supplement-floorplan.md | `145709e0c0e666951679ebf313dbdf0d22677d4799e7256c39e6ee8d3d4def09` |
| module-02-chip/supplement-wafer-shot.md | `fadd7e469f84a771a1b80ab2b19d61f29a522c7700d4d58b212e71ea8b9014d5` |

## 2026-09-16 수업 문체 개정

사용자의 지적에 따라 Module 4~9를 기존 수업의 친근한 반말·선생님 설명 방식에 맞춰 수정했습니다. Lesson마다 이전 수업 연결 질문, 비유에서 실제 구조로 넘어가는 설명, 질문형 소제목을 개별 작성했습니다. 보고서식 도입과 시간 배분 문장을 교체하고, 요약·Quiz 해설·Review·Module 안내도 대화체로 통일했습니다.

이번 개정에서 Module 0~3의 모든 파일은 이전 배포본과 동일합니다. 신규 구간의 수업 ID와 순서, 핵심 수치·기술 설명의 조건, 출처 URL과 도식 슬롯은 유지했습니다. 신규 사실 조사나 2026-09-16 기준의 기술 현황 갱신으로 표시하지 않습니다.
