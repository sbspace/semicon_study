---
id: m02-s-wafer-shot
module_id: m02
kind: supplement
title: Wafer·Shot·Reticle·Scribe Line
estimated_minutes: 15
content_origin: adapted_original
source_url: https://chatgpt.com/share/6aa53330-bbf0-83e8-b34f-53e1dc894671
source_message_ids:
- ee72864b-0af9-48bd-8709-16042637bf0c
original_label: 'Module 2 / Lesson 6  '
last_updated: '2026-09-12'
---

# Module 2 보충 수업 — Wafer·Shot·Reticle·Scribe Line

> **출처 안내:** Module 0 공유 세션 뒤쪽에 실린 실제 수업 원문입니다. 원래 Module/Lesson 표기를 아래에 보존했습니다. 세션별 번호가 충돌하므로 정규 목차와 별도의 보충 ID로 관리합니다. [관련 정규 수업](lesson-06.md)과 함께 읽을 수 있습니다.

## Module 2 / Lesson 6  
## Wafer 위에서 Die는 어떻게 반복될까? — Shot, Reticle, Scribe Line

지난 Lesson 5에서는 **Die → Pad/Bump → Package → PCB**로 칩 바깥까지 연결되는 구조를 봤어. 오늘은 다시 한 단계 위로 올라가서, **웨이퍼 한 장 위에 Die가 어떤 식으로 반복해서 만들어지는지**를 이해해보자. 

### 오늘 핵심 목표

> **웨이퍼 위에는 같은 Die가 반복 배치되고, 노광 장비는 Reticle의 패턴을 Shot 단위로 반복 인쇄한다. Die 사이에는 나중에 절단하기 위한 Scribe Line이 있다.**

---

## 1. 먼저 실제 Wafer 구조를 보자

삼성전자에서 설명하는 Wafer 구조 그림을 보면 **Die와 Scribe Line**의 관계가 잘 보인다. 

<visual-needed id="visual-047" type="reference-structure" description="반도체/전기 기초: 1. 먼저 실제 Wafer 구조를 보자 — 원수업 이미지 위치와 주변 설명을 함께 참고" />

그림에서 가장 중요한 건 이것뿐이야.

<interactive type="wafer-shot-reticle" />

```text
Wafer
┌──────────────────────────┐
│ [Die][Die][Die][Die]     │
│ [Die][Die][Die][Die]     │
│ [Die][Die][Die][Die]     │
│ [Die][Die][Die][Die]     │
└──────────────────────────┘
```

즉 하나의 큰 칩을 웨이퍼 전체에 만드는 게 아니라, **같은 칩 설계를 여러 번 반복해서 만든다.**

---

## 2. Die는 다시 무엇이었지?

Module 0에서 배웠던 개념이야.

### Die

> **Wafer 위에 만들어진 개별 IC 하나**

라고 보면 된다.

예를 들어 CPU 하나의 회로가 있다고 하면:

```text
Wafer

[CPU][CPU][CPU][CPU]
[CPU][CPU][CPU][CPU]
[CPU][CPU][CPU][CPU]
```

처럼 같은 패턴이 반복된다.

공정이 모두 끝난 뒤 이들을 하나씩 잘라내면 각각 독립된 Die가 된다.

---

## 3. 그럼 이 패턴을 웨이퍼 전체에 한 번에 찍나?

보통 그렇지 않다.

포토 공정에서는 **노광 장비가 한 번에 일정 영역만 노광**하고, 위치를 이동해 다시 노광하는 방식을 사용한다.

여기서 새 용어:

### Shot

> **노광 장비가 한 번에 패턴을 전사하는 웨이퍼상의 영역**

이라고 이해하면 된다.

개념적으로:

```text
Wafer

┌──────┐┌──────┐
│ Shot ││ Shot │
└──────┘└──────┘
┌──────┐┌──────┐
│ Shot ││ Shot │
└──────┘└──────┘
```

처럼 노광 위치를 옮기며 반복한다.

ASML의 일반적인 첨단 노광 장비는 최대 약 **26 × 33 mm의 exposure field**를 사용한다. 예를 들어 NXE:3600D EUV 장비가 이 크기의 최대 노광 필드를 지원한다. [TWINSCAN NXE:3600D - EUV lithography systems | ASML](https://www.asml.com/en/products/euv-lithography-systems/twinscan-nxe-3600d?utm_source=chatgpt.com)

---

## 4. Shot 하나 = Die 하나일까?

**반드시 그렇지는 않다.**

이 구분이 중요해.

Shot은 **노광 단위**, Die는 **최종 칩 단위**야.

그래서 작은 칩이라면 한 Shot 안에 여러 Die가 들어갈 수도 있다.

```text
1 Shot

┌────────────────────┐
│ [Die] [Die] [Die]  │
│ [Die] [Die] [Die]  │
└────────────────────┘
```

반대로 Die가 매우 크면 Shot 하나에 거의 하나의 Die가 들어갈 수도 있다.

즉:

> **Shot = 장비가 찍는 단위**  
> **Die = 제품 단위**

다.

---

## 5. Reticle은 무엇인가?

이제 중요한 용어가 하나 더 나온다.

### Reticle

> **웨이퍼에 전사할 회로 패턴이 들어 있는 원본 마스크 판**

이라고 생각하면 된다.

사진 인화의 원판 같은 개념이야.

구조는:

```text
Reticle
   ↓
노광 장비의 광학계
   ↓
Wafer 위 Photoresist
   ↓
패턴 전사
```

현대 DUV 노광 장비 중 일부는 **4배 축소 광학계**를 사용한다. 즉 Reticle의 패턴을 더 작게 줄여 Wafer에 전사한다. ASML NXT 계열 장비의 사양에도 4X reduction과 최대 26 × 33 mm field가 명시되어 있다. [TWINSCAN NXT:2000i - DUV lithography systems | ASML](https://www.asml.com/en/products/duv-lithography-systems/twinscan-nxt2000i?utm_source=chatgpt.com)

지금은 정확한 배율보다:

> **Reticle에 있는 패턴을 장비가 Wafer에 작게 투영한다**

정도만 기억하면 충분하다.

---

## 6. Reticle 하나로 칩 전체를 만드는가?

여기서 많이 헷갈릴 수 있다.

칩에는:

```text
Gate layer
Contact layer
Metal 1
Via 1
Metal 2
...
```

처럼 수많은 Layer가 있지.

각 Layer마다 필요한 패턴이 다르다.

그래서 대체로:

```text
Layer A → Mask/Reticle A
Layer B → Mask/Reticle B
Layer C → Mask/Reticle C
...
```

처럼 **공정 Layer마다 다른 패턴을 사용한다.**

즉 “CPU용 Reticle 하나”를 계속 쓰는 게 아니라,

> **한 제품을 만들기 위해 수많은 Mask 패턴이 순서대로 사용된다.**

이 개념이 Module 3의 Photo 공정에서 다시 중요해진다.

---

## 7. Scribe Line은 뭐지?

삼성 Wafer 그림에도 표시되어 있는 용어다. 

### Scribe Line

> **Die와 Die 사이에 남겨둔 절단용 공간**

이다.

아주 단순하게 보면:

```text
[ Die ] | [ Die ]
        ↑
   Scribe Line
```

공정이 끝난 뒤 Wafer를 개별 Die로 자를 때 이 영역을 따라 절단한다.

그래서 이 영역은 최종 제품 회로의 핵심 공간으로 쓰기보다, 절단 및 공정 관리 목적에 사용된다.

---

## 8. Scribe Line에는 아무것도 없을까?

꼭 그렇지는 않다.

Scribe Line에는 제품 회로 대신 **공정 상태를 확인하기 위한 Test Pattern이나 Alignment Mark** 등이 배치될 수 있다.

예를 들어:

```text
Die
│
├──────────── Scribe Line
│  □ Test pattern
│  + Alignment mark
├────────────
│
Die
```

이런 구조가 가능하다.

즉 FAB에서는 Scribe Line도 그냥 “버리는 빈 공간”만은 아니다.

공정 제어나 계측 관점에서 활용될 수 있다.

---

## 9. Wafer 가장자리의 Die는 왜 일부가 잘려 있지?

원형 Wafer 위에 사각형 Die를 반복해서 배치하면 가장자리에서는 당연히 이런 일이 생긴다.

```text
        _______
     / [ ][ ][ ] \
    / [ ][ ][ ][ ]\
   | [ ][ ][ ][ ][ ]
    \ [ ][ ][ ][ ] /
     \___[ ][ ]___/
```

가장자리에는 **완전한 Die가 들어가지 못하는 영역**이 생긴다.

그래서 Wafer 직경이 같더라도:

- Die 크기가 작을수록
- 한 Wafer에서 얻을 수 있는 완전한 Die 수는 일반적으로 많아진다.

이게 나중에 **Die Size와 원가/Yield**를 배울 때 직접 연결된다.

---

## 10. 생산 시스템에서 자주 보는 좌표가 여기서 나온다

FAB 시스템에서 Wafer Map을 보면 이런 형태를 자주 보게 된다.

```text
       (0,3)
   (-1,2)(0,2)(1,2)
(-2,1)(-1,1)(0,1)(1,1)(2,1)
...
```

각 위치는 대개 **Wafer 안의 Die 또는 Shot 위치**를 나타낸다.

그래서 생산 데이터에서:

- Wafer ID
- Die X / Y
- Shot coordinate

같은 값이 나온다면 단순한 DB 좌표가 아니라 **실제 웨이퍼의 물리적 위치**와 연결된 정보야.

---

## 11. 왜 위치 정보가 중요하지?

예를 들어 불량이 이렇게 생겼다고 해보자.

```text
Wafer

     X X X
   O O O O O
  O O O O O O
   O O O O O
     O O
```

특정 가장자리에서만 불량이 많다면:

> “제품 설계가 틀렸다.”

보다는

> “Wafer edge에서 어떤 공정 조건 차이가 있었나?”

를 의심할 수 있다.

반대로 같은 Shot 내부 특정 위치에서 반복되는 문제가 있다면:

> **노광/Mask/공정 Pattern과 연결된 문제인가?**

같은 관점도 생긴다.

즉 **Wafer → Shot → Die**라는 공간 계층을 알아야 Wafer Map이나 Defect Pattern도 더 의미 있게 볼 수 있다.

---

## 12. 이전 Lesson들과 연결

지금까지 Module 2를 한꺼번에 연결해보자.

```text
Wafer
  ↓
Shot 반복
  ↓
Die
  ↓
Floorplan
  ↓
Functional Block
  ↓
Standard Cell / SRAM Cell
  ↓
Transistor
```

그리고 옆에서 자르면:

```text
BEOL ─ Metal / Via
MOL  ─ Contact
FEOL ─ Transistor
Silicon
```

그리고 Die 밖으로 나오면:

```text
Die
 ↓
Pad / Bump
 ↓
Package
 ↓
PCB
```

즉 이제 하나의 칩을 **아래/위/옆/바깥 방향으로 거의 전부 볼 수 있게 된 셈**이야.

---

## 오늘 핵심 용어 4개

| 용어 | 아주 쉽게 |
|---|---|
| **Shot** | 노광 장비가 한 번에 패턴을 찍는 Wafer 영역 |
| **Reticle** | Wafer에 전사할 회로 패턴이 담긴 원판 역할의 마스크 |
| **Scribe Line** | Die 사이의 절단용 영역 |
| **Wafer Map** | Wafer 위 Die/Shot 위치와 검사 결과 등을 지도처럼 표현한 것 |

---

## 오늘 반드시 기억할 3줄

**① Wafer 위에는 같은 Die가 여러 개 반복해서 만들어진다.**

**② Photo 장비는 Reticle 패턴을 Shot 단위로 위치를 옮겨가며 반복 노광한다.**

**③ Die 사이에는 Scribe Line이 있고, Wafer Map의 X/Y 좌표는 실제 물리적 위치와 연결된다.**

---

## 🧠 Lesson 6 퀴즈

### Q1
Shot과 Die에 대한 설명으로 맞는 것은?

A. 둘은 항상 완전히 같은 개념이다.  
B. Shot은 노광 단위, Die는 최종 칩 단위다.  
C. Shot은 Package 내부 구조다.

### Q2
Reticle의 역할은?

A. Wafer를 잘라낸다.  
B. 회로 패턴을 담아 노광 장비를 통해 Wafer에 전사한다.  
C. Die를 PCB에 붙인다.

### Q3
Wafer Map에서 특정 Wafer edge에 불량이 집중된다면 가장 먼저 떠올릴 수 있는 관점은?

A. Wafer 위치에 따른 공정 특성 차이  
B. CPU의 계산 알고리즘 오류  
C. Package 색상 차이

## 정답 및 해설

**Q1 → B.** Shot은 Scanner가 한 번에 노광하는 **공정 단위**, Die는 나중에 개별 칩이 되는 **제품 단위**다.

**Q2 → B.** Reticle의 패턴을 노광 광학계를 통해 Wafer의 Photoresist에 전사한다.

**Q3 → A.** Wafer의 중앙/Edge 등 물리적 위치에 따라 공정 균일도나 장비 특성이 달라질 수 있기 때문에, 위치별 불량 분포는 중요한 공정 단서가 된다.

> **편집 보완:** 26×33 mm는 본문에 든 특정 장비의 최대 노광 필드 예입니다. 모든 노광 장비에 공통인 치수가 아니며 High-NA EUV에는 다른 필드 형식이 있습니다. Wafer Map 패턴은 원인 후보를 좁히는 단서이고 원인을 단독으로 확정하는 증거는 아닙니다.
