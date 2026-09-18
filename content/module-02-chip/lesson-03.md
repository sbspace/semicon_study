---
id: m02-l03
module_id: m02
lesson_number: 3
title: 칩의 위아래 구조 — 트랜지스터 위에는 무엇이 쌓여 있을까?
estimated_minutes: 15
content_origin: adapted_original
source_url: https://chatgpt.com/share/6aa5303e-8a2c-83ee-8693-21afceb6bd01
source_message_ids:
- b4aea9a0-787d-4f6c-9f66-a8823fb3bf67
last_updated: '2026-09-12'
kind: lesson
---

# Module 2 / Lesson 3  

> 기본 수업과 Quiz 예상 15분. 원수업의 표·그림과 설명을 보존했으며, 뒤의 추가 설명은 별도로 이어 읽을 수 있어요.

## 칩의 위아래 구조 — 트랜지스터 위에는 무엇이 쌓여 있을까?

### 핵심 목표

지난 두 수업에서는 Die를 **위에서 내려다봤어.**

오늘은 Die를 옆에서 잘라서 본다고 생각해보자.

오늘 가장 중요한 그림은 이것 하나야.

> **트랜지스터는 실리콘 쪽 아래에 있고, 그 위로 여러 층의 금속 배선이 건물처럼 쌓인다.**

즉 실제 칩은 평면 회로가 아니라 **3차원 구조**야.

---

## 1. 실제 단면 구조부터 보자

<visual-needed id="visual-022" type="reference-structure" description="칩 구조: 1. 실제 단면 구조부터 보자 — 원수업 이미지 위치와 주변 설명을 함께 참고" />

첫 번째 그림을 아래에서 위로 봐봐.

<interactive type="feol-mol-beol" />

```text
        ───── M6 ─────
             │
            Via
        ───── M5 ─────
             │
            Via
        ───── M4 ─────
             │
            ...
        ───── M2 ─────
             │
        ───── M1 ─────
             │
          Contact
             │
      ┌─────────────┐
      │ Transistor  │
      └─────────────┘
          Silicon
```

**아래쪽에 MOSFET이 있고 그 위에 배선층이 여러 겹 쌓여 있지?**

Intel의 실제 공정 자료에서도 transistor와 substrate 위로 M1, M2 … 여러 metal layer가 수직으로 쌓인 구조를 보여준다. 예를 들어 Intel 32 nm 공정에는 9개 금속층이 사용됐다. [IEDM 32nm SoC with RF Presentation](https://www.intel.com/content/dam/doc/technology-brief/32nm-soc-with-rf-cmos-technology-presentation.pdf?utm_source=chatgpt.com)

---

## 2. 왜 트랜지스터 위에 이렇게 많은 배선이 필요할까?

Module 1에서 CMOS inverter를 배웠지.

트랜지스터가 있다고 해서 저절로 계산이 되는 건 아니야.

예를 들어:

```text
NMOS        PMOS
  │           │
  └─────┬─────┘
        │
       OUT
```

NMOS와 PMOS를 **전기적으로 연결**해야 NOT Gate가 된다.

그리고 NOT, NAND, Flip-Flop 등을 또 연결해야 더 큰 회로가 되지.

결국 CPU는:

```text
MOSFET
 │
 ├──────── MOSFET
 │
 ├──────────────── MOSFET
 │
 └──── MOSFET
```

처럼 **수많은 트랜지스터 사이를 연결해야 하는 거대한 배선 문제**이기도 해.

그래서 트랜지스터를 한 층에 만들고, 그 위쪽 공간을 이용해 배선을 여러 층으로 올리는 거야.

---

## 3. 크게 세 부분으로 나눈다

오늘 새 용어 세 개가 나온다.

```text
          칩 위쪽
             ↑

 ┌────────────────────┐
 │       BEOL         │ ← Metal 배선
 │ M1 / M2 / M3 ...  │
 └────────────────────┘

 ┌────────────────────┐
 │        MOL         │ ← 소자 ↔ 배선 연결
 └────────────────────┘

 ┌────────────────────┐
 │       FEOL         │ ← MOSFET
 │ NMOS / PMOS        │
 └────────────────────┘

       Silicon
```

각각 하나씩 보자.

---

## 4. FEOL — 트랜지스터를 만드는 영역

**FEOL = Front End Of Line**

쉽게 말하면:

> **실리콘 위에 실제 트랜지스터를 만드는 부분**

이야.

여기에는 우리가 이미 배운:

- Gate
- Source
- Drain
- Channel
- Well
- FinFET / GAA 같은 transistor 구조

가 들어간다.

```text
             Gate
              │
          ┌───────┐
 Source ──┤       ├── Drain
          └───────┘
             ↑
           Channel
──────────────────────── Silicon
```

즉 Module 0~1에서 집중적으로 봤던 세계가 **FEOL 쪽**이라고 생각하면 돼.

---

## 5. 그런데 Gate 위에 바로 M1을 붙이면 될까?

중간 연결이 필요해.

그래서 등장하는 것이 **Contact**야.

### Contact

> **트랜지스터의 Gate / Source / Drain과 첫 배선 쪽을 연결하는 수직 금속 연결부**

라고 이해하면 돼.

단순화하면:

```text
           M1
════════════════════
        │
        │ Contact
        │
      Gate
    ┌───────┐
────┘       └────
   Transistor
```

트랜지스터가 **집**이라면 Contact는 그 집에서 큰길로 나가는 **진입로** 같은 거야.

이런 transistor와 BEOL 사이의 연결 영역을 보통 **MOL(Middle Of Line)**이라고 부른다.

---

## 6. BEOL — 우리가 보는 거대한 배선층

**BEOL = Back End Of Line**

> **트랜지스터들을 실제 회로가 되도록 연결하는 여러 층의 금속 배선 영역**

이야.

```text
M6  ═══════════════════
          │
         Via
M5  ══════╪════════════
          │
         Via
M4  ══════╪═══════
          │
         Via
M3  ══════╪════════════
          │
M2  ══════╪══════
          │
M1  ══════╪════════════
          │
       Contact
          │
      Transistor
```

여기서 `M`은 **Metal**이야.

- M1 = Metal 1
- M2 = Metal 2
- M3 = Metal 3
- ...

공정에 따라 실제 금속층 수는 다르며, 첨단 logic에서는 많은 층이 사용된다. imec도 현대 BEOL이 local·intermediate·global metal layer들로 구성되고 총 층수가 15개 수준까지 갈 수 있다고 설명한다. [Mitigating the thermal bottleneck in advanced interconnects | imec](https://www.imec-int.com/en/articles/mitigating-thermal-bottleneck-advanced-interconnects?utm_source=chatgpt.com)

---

## 7. M1과 M2는 어떻게 연결하지?

여기서 두 번째 중요한 연결 구조가 나온다.

## Via

> **서로 다른 Metal Layer를 위아래로 연결하는 수직 금속 통로**

야.

```text
      M2
══════════════
       █
       █ ← Via
       █
═══════█══════
      M1
```

그래서 구분하면:

```text
Transistor
    │
 Contact
    │
   M1
    │
   Via
    │
   M2
    │
   Via
    │
   M3
```

이런 구조라고 보면 돼.

imec 역시 BEOL의 서로 다른 금속층들이 **metal-filled via**를 통해 수직으로 연결된다고 설명한다. [Mitigating the thermal bottleneck in advanced interconnects | imec](https://www.imec-int.com/en/articles/mitigating-thermal-bottleneck-advanced-interconnects?utm_source=chatgpt.com)

---

## 8. 왜 금속층 하나에 전부 배선하지 않을까?

도로를 생각하면 쉬워.

서울의 모든 자동차를 **한 도로에만** 집어넣으면?

→ 난리가 나겠지.

칩도 똑같아.

```text
M1 ───────────────────
```

한 층만 사용하면 수십억 개 트랜지스터를 서로 연결할 공간이 없어.

그래서:

```text
M4  ← 다른 방향 / 장거리
M3  ← 다른 방향
M2  ← 다른 방향
M1  ← 주변 회로 연결
```

처럼 여러 층을 활용한다.

쉽게 비유하면:

> **BEOL은 칩 위에 만들어진 다층 고속도로망**

이라고 생각하면 돼.

---

## 9. 아래 Metal과 위 Metal의 역할도 조금 다르다

일반적으로 트랜지스터에 가까운 아래쪽 Metal은:

```text
M1
M2
M3
```

상대적으로 촘촘하게 배치되어 **가까운 회로끼리 연결**하는 데 많이 사용돼.

반대로 위쪽 Metal은 상대적으로 더 굵고 넓게 만들어서:

- 먼 거리 신호
- Clock
- 전원 VDD
- Ground

같은 연결에 활용할 수 있어.

Intel의 실제 interconnect 자료를 봐도 아래쪽 M1~M3보다 상부 금속층으로 갈수록 배선 pitch가 커지는 구조를 확인할 수 있다. [Silicon Technology Leadership for the mobility era](https://www.intel.com/content/dam/www/public/us/en/documents/presentation/silicon-technology-leadership-presentation.pdf?utm_source=chatgpt.com)

아파트 도로로 비유하면:

```text
M1  = 아파트 단지 골목길
M2  = 동네 도로
M3  = 큰 도로
...
Upper Metal = 고속도로
```

정도로 생각하면 돼.

완전히 1:1 대응되는 비유는 아니지만 구조 이해에는 꽤 좋아.

---

## 10. 그런데 Metal 선끼리 닿으면 안 되잖아?

맞아.

그래서 Metal 사이에는 **절연체(Dielectric)**가 들어간다.

```text
Metal   ═══════════

       절연체

Metal   ═══════════

       절연체

Metal   ═══════════
```

Module 0에서 배웠던 그 **절연체**가 여기서 다시 등장하는 거야.

서로 연결해야 하는 곳만:

```text
M2 ═══════█════
          █
         Via
          █
M1 ═══════█════
```

Via로 연결하고,

나머지 부분은 절연체가 분리해준다.

Intel 역시 processor의 copper interconnect 사이에 절연 물질을 넣어 의도하지 않은 short를 방지한다고 설명한다. [CMOS](https://www.intel.com/pressroom/kits/45nm/leadfree/lf_glossary.pdf?utm_source=chatgpt.com)

---

## 11. 지난 Lesson의 Floorplan과 합쳐보자

Lesson 2에서는 위에서 봤어.

### 위에서 보면

```text
┌─────────────────────────────┐
│ Core │ Core │ Cache │ I/O  │
│      │      │       │      │
└─────────────────────────────┘
```

이게 **Floorplan**이었지.

그런데 옆에서 보면:

```text
               Die

      Core         Cache
       ↓             ↓

══════════════════════════  Upper Metal
══════════════════════════
══════════════════════════
══════════════════════════  BEOL
══════════════════════════
══════════════════════════  M1
    │ │ │ │ │ │ │ │
       Contacts               MOL
    │ │ │ │ │ │ │ │
▽ ▽ ▽ ▽ ▽ ▽ ▽ ▽ ▽ ▽
   Transistors                FEOL
──────────────────────────
       Silicon
```

이렇게 생긴 거야.

즉 **Core라는 사각형 하나도 사실은 높이가 없는 그림이 아니야.**

그 영역 아래에는 수많은 transistor가 있고,

그 위에는 복잡한 배선층이 쌓여 있어.

---

## 12. 여기서 굉장히 중요한 오해 하나

칩의 구조를 이렇게 생각하면 안 돼.

```text
M1 = 트랜지스터 한 층
M2 = 또 다른 트랜지스터
M3 = 또 다른 트랜지스터
```

❌ 아니다.

일반적인 logic chip에서는 기본적으로:

```text
위
│
│ Metal
│ Metal
│ Metal
│ Metal
│
│ Transistor
│
Silicon
```

이야.

즉:

> **MOSFET들이 아래쪽에서 계산하고, 위에 있는 거대한 Metal network가 MOSFET들을 연결한다.**

이 그림을 머릿속에 꼭 넣어두자.

---

## 핵심 용어 4개

| 용어 | 지금 이해할 뜻 |
|---|---|
| **FEOL** | 실리콘 위에 transistor를 만드는 영역 |
| **MOL** | transistor와 첫 배선 사이를 연결하는 영역 |
| **BEOL** | 여러 Metal Layer로 회로를 연결하는 영역 |
| **Via** | 서로 다른 Metal Layer를 수직으로 연결하는 금속 통로 |

그리고 **Contact**는 transistor와 배선을 연결하는 연결부라고 기억하면 돼.

---

## 실제 칩/공정 + 이전 수업 연결

우리가 지금까지 배운 내용이 이제 이렇게 합쳐져.

```text
Module 1
NMOS + PMOS
    ↓
Logic Gate
    ↓
Standard Cell

Module 2
    ↓
Functional Block
    ↓
Core / Cache
    ↓
Floorplan

그리고 실제 물리 구조는

       Metal Layers   ← BEOL
             ↓
          Contact      ← MOL
             ↓
         MOSFET        ← FEOL
             ↓
          Silicon
```

그리고 중요한 연결 하나:

**Module 3 — 반도체 공정**에 가면,

> "도대체 이 FEOL과 BEOL을 Photo / Etch / Deposition / Implant / CMP로 어떻게 실제 웨이퍼 위에 만드는가?"

를 배우게 될 거야.

지금은 **무엇이 만들어져 있는지**, Module 3에서는 **어떻게 만드는지** 배우는 셈이야.

---

## 오늘의 짧은 요약

**① 실제 칩은 평면이 아니라 3차원 적층 구조다.**

**② 아래쪽 FEOL에는 MOSFET, 그 위 BEOL에는 여러 Metal Layer가 있다.**

**③ Transistor ↔ 배선은 Contact, Metal ↔ Metal은 Via로 연결한다.**

**④ 수십억 개의 transistor가 계산한다면, BEOL은 그들을 연결하는 거대한 다층 도로망이다.**

---

## 🧠 퀴즈

### Q1

일반적인 Logic Chip에서 MOSFET과 여러 Metal Layer의 위치 관계는?

A. Metal 아래에 MOSFET이 있고 그 위로 Metal Layer가 쌓인다.  
B. MOSFET이 Metal Layer보다 가장 위에 있다.  
C. 모든 Metal Layer마다 MOSFET이 하나씩 있다.

**정답: A**

실리콘 근처 FEOL에 transistor를 만들고, 그 위에 여러 층의 interconnect가 쌓인다.

---

### Q2

`M1`과 `M2`를 수직으로 연결하는 구조는?

A. Gate  
B. Via  
C. Channel

**정답: B**

Via는 **서로 다른 배선층 사이를 위아래로 연결하는 금속 통로**야.

---

### Q3

FEOL과 BEOL의 관계로 가장 적절한 것은?

A. FEOL은 transistor, BEOL은 transistor들을 연결하는 배선  
B. FEOL은 Package, BEOL은 Wafer  
C. 둘 다 같은 Metal Layer를 뜻한다.

**정답: A**

오늘 수업의 핵심 그 자체야.

---

다음 수업: [Lesson 4](lesson-04.md).

관련 원수업 보충: [추가 회차 원문](supplement-feol-beol.md). 세션별 번호 충돌과 시간 순서는 source_map.md에 기록했습니다.
