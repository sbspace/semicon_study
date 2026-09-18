---
id: m02-l01
module_id: m02
lesson_number: 1
title: 칩 안의 계층 구조 — 트랜지스터 수십억 개는 어떻게 하나의 칩이 될까?
estimated_minutes: 15
content_origin: adapted_original
source_url: https://chatgpt.com/share/6aa5303e-8a2c-83ee-8693-21afceb6bd01
source_message_ids:
- f6d58cdd-cbdd-45d0-a860-0e5865cc4fc0
last_updated: '2026-09-12'
kind: lesson
---

# Module 2 / Lesson 1  

> 기본 수업과 Quiz 예상 15분. 원수업의 표·그림과 설명을 보존했으며, 뒤의 추가 설명은 별도로 이어 읽을 수 있어요.

## 칩 안의 계층 구조 — 트랜지스터 수십억 개는 어떻게 하나의 칩이 될까?

### 핵심 목표

오늘은 **칩을 아주 멀리서 보는 관점**을 잡는 수업이야.

딱 이것만 이해하면 된다.

> **Transistor → Logic Gate → Standard Cell → Functional Block → Die**

Module 1에서는 트랜지스터 하나하나를 확대해서 봤다면, Module 2에서는 반대로 **줌아웃하면서 전체 칩을 보는 것**이 핵심이야.

---

## 1. 먼저 실제 CPU Die를 보자

<visual-needed id="visual-020" type="reference-structure" description="칩 구조: 1. 먼저 실제 CPU Die를 보자 — 원수업 이미지 위치와 주변 설명을 함께 참고" />

왼쪽은 실제 **CPU Die를 위에서 본 사진**이고, 오른쪽은 CMOS inverter를 실제 칩 위에 배치할 때의 **layout 예시**야.

왼쪽 CPU 사진에서 중요한 건 세부 글자를 외우는 게 아니라,

<interactive type="wafer-die-transistor" />

```text
Core     Core

   L3 Cache

Core     Core

Memory Controller
```

처럼 **기능별 영역이 덩어리로 나뉘어 있다는 것**이야.

실제 현대 CPU에서도 CPU core, cache, memory controller, GPU/I/O 같은 기능들이 서로 다른 물리적 영역으로 배치된다. Intel Alder Lake의 실제 die 분석에서도 CPU core, L2/L3 cache, memory controller, GPU 및 I/O 영역을 구분해서 볼 수 있다. [03_basicarch](https://www.cs.cmu.edu/afs/cs/academic/class/15418-f24/www/lectures/03_basicarch.pdf?utm_source=chatgpt.com)

오늘 주제는 위에서 내려다보는 **평면 배치**이기 때문에 억지로 3D 그림을 쓰기보다 실제 **die shot**이 더 직관적이야. 이후 배선층이나 패키징처럼 높이 방향 구조가 중요해지는 수업에서는 3D 구조도를 적극적으로 사용할게.

---

## 2. `Die`부터 정확히 잡자

**Die(다이)**란:

> **웨이퍼 위에 만들어진 하나의 완성된 IC 회로 영역**

이야.

웨이퍼를 아주 단순화하면:

```text
             Wafer

       ┌─────────────┐
       │ □ □ □ □ □ │
       │ □ □ □ □ □ │
       │ □ □ □ □ □ │
       │ □ □ □ □ □ │
       └─────────────┘
          ↑
       □ 하나 = Die
```

웨이퍼에는 똑같은 Die가 반복해서 만들어지고,

```text
Wafer
  ↓ 절단
Die
  ↓ Package에 장착
반도체 제품
```

이 되는 거야.

### Die와 Chip은 완전히 같은 말인가?

실무에서는 꽤 섞어서 말하지만 엄밀히 구분하면:

```text
Die
= 실제 회로가 새겨진 실리콘 조각

Package
= Die를 보호하고 외부와 연결하는 구조

Chip
= 문맥에 따라 Die 또는 패키징된 반도체 제품을 넓게 부르는 말
```

정도로 이해하면 충분해.

---

## 3. 그런데 Die 안에 트랜지스터 수십억 개를 그냥 뿌려놓을까?

아니야.

예를 들어 트랜지스터 100억 개가 있다고 해서

```text
○ ○ ○ ○ ○ ○ ○ ○ ○
○ ○ ○ ○ ○ ○ ○ ○ ○
○ ○ ○ ○ ○ ○ ○ ○ ○
```

처럼 무작위로 존재하는 게 아니다.

아주 작은 회로를 만들고,

그 회로들을 묶어 더 큰 회로를 만들고,

다시 그것들을 묶어 거대한 기능을 만든다.

건물에 비유하면:

```text
벽돌
 ↓
벽
 ↓
방
 ↓
한 세대
 ↓
아파트 한 동
 ↓
아파트 단지
```

칩은:

```text
Transistor
 ↓
Logic Gate
 ↓
Standard Cell
 ↓
Functional Block
 ↓
Die
```

라고 생각하면 돼.

---

## 4. ① Transistor → Logic Gate

여기는 Module 1 내용이지.

MOSFET인 NMOS와 PMOS를 조합해서:

```text
NMOS + PMOS
     ↓
CMOS 회로
```

를 만들고,

그 결과:

```text
NOT
NAND
NOR
XOR
...
```

같은 **Logic Gate(논리 게이트)**를 만들 수 있었어.

즉:

```text
트랜지스터 몇 개
       ↓
    논리 기능 하나
```

가 되는 거야.

---

## 5. ② Logic Gate → `Standard Cell`

여기서 오늘의 첫 번째 새로운 핵심 개념이 나온다.

### Standard Cell이란?

> **자주 사용하는 작은 회로를 미리 설계해 놓은 기본 부품**

이야.

예를 들어 설계자가 CPU를 만들 때마다 NAND Gate의 NMOS/PMOS를 처음부터 직접 그린다면 너무 비효율적이겠지.

그래서:

```text
┌─────────┐
│   INV   │  ← Inverter
└─────────┘

┌─────────┐
│  NAND2  │
└─────────┘

┌─────────┐
│  NOR2   │
└─────────┘

┌─────────┐
│ FlipFlop│
└─────────┘
```

처럼 이미 설계된 기본 블록들을 사용해.

이것이 **Standard Cell**이야.

쉽게 말하면:

> **디지털 칩 설계용 레고 블록**

이라고 생각하면 거의 맞아.

아까 두 번째 실제 이미지가 바로 이런 작은 회로의 **물리적 Layout** 예시야.

---

## 6. ③ Standard Cell → Functional Block

이번에는 Standard Cell을 엄청 많이 연결한다.

그러면 특정 기능을 수행하는 더 큰 영역이 만들어져.

이런 큰 기능 단위를 **Functional Block(기능 블록)**이라고 부르자.

예를 들어 CPU 안에는:

```text
┌─────────────┐
│     ALU     │ ← 계산
└─────────────┘

┌─────────────┐
│    Cache    │ ← 데이터 임시 저장
└─────────────┘

┌─────────────┐
│   Decoder   │ ← 명령 해석
└─────────────┘
```

같은 블록들이 있어.

즉:

```text
수많은 작은 Cell
        ↓
   큰 기능 하나
```

가 된다.

---

## 7. 그러면 CPU Core도 하나의 큰 Block인가?

맞아.

아주 단순화하면:

```text
CPU Die
│
├── CPU Core 0
├── CPU Core 1
├── CPU Core 2
├── CPU Core 3
│
├── L3 Cache
├── Memory Controller
├── I/O
└── 기타 회로
```

처럼 볼 수 있어.

그리고 `CPU Core 하나`를 다시 확대하면:

```text
CPU Core
│
├── ALU
├── Register
├── Decoder
├── Scheduler
├── L1 Cache
└── 기타 회로
```

가 나온다.

Intel도 실제 processor die 내부에 여러 CPU core와 shared cache, controller 등이 함께 존재하는 구조를 설명한다. 

---

## 8. 끝까지 확대하면 결국 다시 MOSFET이다

이게 오늘 가장 중요한 큰 그림이야.

```text
┌───────────────────────────────┐
│             Die               │
│                               │
│   ┌──────┐      ┌──────┐     │
│   │ Core │      │ Core │     │
│   └──────┘      └──────┘     │
│                               │
│       ┌──────────────┐        │
│       │    Cache     │        │
│       └──────────────┘        │
└───────────────────────────────┘
              ↓ 확대

       Functional Block
              ↓ 확대

         Standard Cell
              ↓ 확대

          Logic Gate
              ↓ 확대

         NMOS / PMOS
```

Module 1과 Module 2가 여기서 딱 연결돼.

---

## 9. 지난 수업의 SRAM과 연결해보자

Module 1 마지막에 **6T SRAM Cell**을 배웠지.

SRAM Cell 하나는:

```text
MOSFET 6개
   ↓
SRAM Cell 1개
```

였다.

그걸 하나만 사용하는 게 아니라 엄청 많이 반복한다.

```text
□ □ □ □ □ □ □
□ □ □ □ □ □ □
□ □ □ □ □ □ □
□ □ □ □ □ □ □
```

→ SRAM Array

이런 Array와 주변 회로를 묶어서 **Cache라는 큰 Block**을 만든다.

따라서:

```text
MOSFET
 ↓
6T SRAM Cell
 ↓
SRAM Array
 ↓
Cache
 ↓
CPU Die의 일부
```

가 되는 거야.

Module 1에서 배운 **소자 하나**가 드디어 실제 칩의 **큰 영역**으로 이어진 거지.

---

## 핵심 용어 4개

| 용어 | 지금 이해할 뜻 |
|---|---|
| **Die** | 실제 회로가 만들어져 있는 하나의 실리콘 조각 |
| **Standard Cell** | 작은 디지털 회로를 미리 설계한 기본 블록 |
| **Functional Block** | 특정 기능을 담당하는 큰 회로 영역 |
| **Die Shot** | Die 표면을 위에서 촬영하거나 분석한 이미지 |

---

## 오늘의 핵심 요약

**① CPU/GPU Die 안에 트랜지스터가 무작위로 깔려 있는 게 아니다.**

**② Transistor → Logic Gate → Standard Cell → Functional Block → Die의 계층으로 커진다.**

**③ CPU Core, Cache, Memory Controller 등은 Die 안의 큰 기능 블록이다.**

**④ 큰 블록도 계속 확대하면 결국 NMOS/PMOS와 배선으로 돌아간다.**

---

## 🧠 퀴즈

### Q1

작은 것 → 큰 것 순서로 맞는 것은?

A. Transistor → Logic Gate → Standard Cell → Functional Block  
B. Standard Cell → Transistor → Functional Block → Logic Gate  
C. Logic Gate → Die → Transistor → Standard Cell

**정답: A**

Logic Gate는 여러 transistor로 만들고, 이런 작은 회로를 Standard Cell이라는 기본 부품으로 만들어 더 큰 Functional Block을 구성한다.

---

### Q2

`Standard Cell`을 가장 잘 설명한 것은?

A. 웨이퍼를 잘라낸 실리콘 조각  
B. 자주 사용하는 작은 회로를 미리 설계해 놓은 기본 부품  
C. CPU를 감싸는 외부 Package

**정답: B**

`NAND`, `Inverter`, `Flip-Flop` 같은 회로를 매번 처음부터 만들지 않고 **레고 블록처럼 재사용하기 위한 기본 단위**라고 이해하면 돼.

---

### Q3

CPU의 `Cache` 영역을 계속 확대하면 궁극적으로 무엇이 나올까?

A. 또 다른 CPU  
B. SRAM Cell → MOSFET  
C. Package

**정답: B**

지난 Module의 **6T SRAM Cell**들이 반복되어 SRAM array를 만들고, 그것들이 Cache의 핵심 저장 영역을 구성한다.

---

> **편집 보완 — 계층 비유의 범위:** Standard Cell은 논리 기능을 실제 공정에서 배치할 수 있게 설계한 기본 부품이야. NAND 하나가 곧 NAND2 Standard Cell로 구현될 수 있으므로 둘이 반드시 별도 크기의 층인 것은 아니야. SRAM Array 같은 블록은 일반 Standard Cell을 단순 반복하는 대신 전용 메모리 셀·매크로를 사용해.

다음 수업: [Lesson 2](lesson-02.md).
