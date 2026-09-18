---
id: m02-s-floorplan
module_id: m02
kind: supplement
title: 칩의 평면 구조 — 후속 회차 원문
estimated_minutes: 15
content_origin: adapted_original
source_url: https://chatgpt.com/share/6aa53330-bbf0-83e8-b34f-53e1dc894671
source_message_ids:
- ef8207af-5ea3-44a4-b024-8c66b2eba8e3
original_label: 'Module 2 / Lesson 3  '
last_updated: '2026-09-12'
---

# Module 2 보충 수업 — 칩의 평면 구조 — 후속 회차 원문

> **출처 안내:** Module 0 공유 세션 뒤쪽에 실린 실제 수업 원문입니다. 원래 Module/Lesson 표기를 아래에 보존했습니다. 세션별 번호가 충돌하므로 정규 목차와 별도의 보충 ID로 관리합니다. [관련 정규 수업](lesson-02.md)과 함께 읽을 수 있습니다.

## Module 2 / Lesson 3  
## 칩의 평면 구조 — Core, SRAM, I/O는 Die 안에서 어떻게 배치될까?

지난 Lesson에서는 칩을 **옆에서 잘라 본 단면**을 배웠어.

> 아래쪽 **FEOL = 트랜지스터**, 위쪽 **BEOL = 금속배선**

오늘은 방향을 90도 바꿔서 **Die를 위에서 내려다볼 거야.** 

### 오늘 핵심 목표

> **하나의 Die 안에는 기능이 다른 여러 회로 블록이 있고, 이들을 적절한 위치에 배치한 전체 지도를 Floorplan이라고 한다.**

---

## 1. 실제 칩을 위에서 보면

현대 프로세서 Die 사진을 보면 영역마다 무늬가 꽤 다르게 보인다.

<visual-needed id="visual-046" type="reference-structure" description="반도체/전기 기초: 1. 실제 칩을 위에서 보면 — 원수업 이미지 위치와 주변 설명을 함께 참고" />

왜 저렇게 구역이 나뉘어 보일까?

지난 Lesson 1에서 배운 계층을 떠올려보자.

<interactive type="die-floorplan" />

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

즉 Die는 그냥 트랜지스터가 균일하게 깔린 판이 아니라 **서로 다른 역할의 Functional Block을 배치한 하나의 도시**에 가깝다.

---

## 2. Floorplan이란?

새 용어부터 정의하자.

### Floorplan

> **Die 안에서 큰 회로 블록을 어디에 배치할지 정한 전체 배치도**

다.

아파트 평면도를 생각하면 쉽다.

```text
┌─────────────────────────────┐
│                             │
│   CPU Core     CPU Core     │
│                             │
├─────────────┬───────────────┤
│             │               │
│    Cache    │    Cache      │
│             │               │
├─────────────┴───────────────┤
│       I/O / 기타 회로       │
└─────────────────────────────┘
```

실제 구조가 반드시 이렇게 생긴다는 뜻은 아니고, **기능별 공간이 존재한다는 개념도**야.

---

## 3. Functional Block은 뭐였지?

지난 Lesson에서 잠깐 등장했지만 다시 정확하게 잡자.

### Functional Block

> **특정 기능을 담당하도록 많은 작은 회로를 묶은 덩어리**

예를 들어 CPU라면:

```text
CPU Die
 │
 ├─ CPU Core
 │
 ├─ Cache
 │
 ├─ Memory Controller
 │
 ├─ I/O
 │
 └─ 기타 회로
```

같은 큰 블록들이 있을 수 있다.

그리고 CPU Core 하나를 더 확대하면 또:

```text
CPU Core
 │
 ├─ ALU
 ├─ Register
 ├─ Control Logic
 └─ ...
```

처럼 더 작은 블록으로 나뉜다.

지난 Module에서 배운 **Adder, Register**가 여기서 다시 등장하는 거야.

---

## 4. Core는 무엇인가?

### Core

CPU에서 **명령을 실제로 처리하는 주요 계산 블록**이라고 우선 이해하면 된다.

우리가 앞에서 배운 것을 안쪽으로 내려가 보면:

```text
CPU Core

   ↓

ALU

   ↓

Adder

   ↓

XOR / AND ...

   ↓

NMOS / PMOS
```

가 된다.

즉 뉴스에서:

> “8 Core CPU”

라고 할 때의 Core도 결국 아래로 계속 내려가면 **엄청난 수의 MOSFET으로 이루어진 회로 덩어리**다.

---

## 5. SRAM 영역은 왜 모양이 다를까?

Module 1 마지막에 **6T SRAM Cell**을 배웠지.

SRAM은 같은 Cell을 반복해서 배열한다.

```text
[Cell][Cell][Cell][Cell]
[Cell][Cell][Cell][Cell]
[Cell][Cell][Cell][Cell]
[Cell][Cell][Cell][Cell]
```

그래서 SRAM 영역은 구조가 매우 **규칙적이고 반복적**이다.

반면 CPU의 복잡한 Logic은:

```text
AND
XOR
Register
MUX
Adder
Control Logic
...
```

처럼 다양한 회로가 섞여 있다.

그래서 실제 Die 사진에서도 **Logic 영역과 SRAM 영역의 패턴이 다르게 보일 수 있다.**

---

## 6. Logic과 Memory가 같은 칩 안에 같이 있다

여기서 중요한 연결 하나.

우리가 흔히:

> CPU = Logic 반도체

라고 부르지만,

CPU Die 안에 **Logic transistor만 존재한다는 뜻은 아니다.**

예를 들어 CPU Cache는 SRAM이므로:

```text
CPU Die
│
├─ Logic
│    ├ 계산
│    └ 제어
│
└─ SRAM
     └ Cache
```

처럼 **Logic과 Memory 기능이 함께 들어갈 수 있다.**

다만 DRAM 칩처럼 메모리 저장 자체가 주목적인 제품과 구분해서 CPU를 Logic 제품이라고 부르는 거야.

---

## 7. I/O는 무엇인가?

새 용어다.

### I/O = Input / Output

쉽게 말하면:

> **칩 내부와 외부가 데이터를 주고받기 위한 회로**

다.

CPU가 아무리 계산을 잘해도 혼자 고립되어 있으면 쓸 수 없겠지.

예를 들어 CPU는 외부의 DRAM과 데이터를 주고받아야 한다.

```text
DRAM
  ↕
I/O 회로
  ↕
CPU 내부
```

그래서 Die에는 계산 회로뿐 아니라 **외부와 통신하기 위한 회로**도 들어간다.

---

## 8. 아무 곳에나 배치하면 안 되나?

여기서 Floorplan이 중요한 이유가 나온다.

예를 들어 서로 데이터를 엄청 자주 주고받는 두 블록이 있다고 해보자.

```text
A                               B

<--------- 아주 긴 배선 --------->
```

멀리 떨어져 있으면 신호가 지나가야 하는 배선이 길어진다.

배선이 길어지면 우리가 Module 0에서 배운 **저항과 기생 Capacitance**가 커질 수 있다.

그러면:

```text
배선 길이 ↑
   ↓
저항 / Capacitance 영향 ↑
   ↓
신호 전달 지연 ↑
   ↓
성능에 불리
```

할 수 있다.

그래서 회로 설계에서는:

> **어떤 Block을 어디에 놓느냐**

자체가 성능·전력·면적에 영향을 준다.

---

## 9. PPA라는 말을 여기서 처음 만나자

현업이나 반도체 기사에서 굉장히 자주 나오는 용어다.

### PPA

**Performance / Power / Area**

즉:

- **Performance** = 얼마나 빠른가
- **Power** = 전력을 얼마나 쓰는가
- **Area** = 칩 면적을 얼마나 차지하는가

를 묶어서 부르는 말이다.

좋은 칩을 만들려면 보통:

```text
Performance ↑

Power ↓

Area ↓
```

를 원한다.

하지만 세 가지를 동시에 완벽하게 개선하기 어려워서 서로 **Trade-off**가 발생한다.

Floorplan과 배선 역시 PPA에 영향을 준다.

---

## 10. 여기까지를 3차원으로 합쳐보자

Lesson 2와 오늘 Lesson 3을 합치는 게 중요하다.

### 위에서 보면

```text
┌───────────────────────┐
│ Core │ Core │ SRAM    │
│──────┼──────┤         │
│ Logic│ SRAM │ I/O     │
└───────────────────────┘

        Floorplan
```

### 옆에서 자르면

```text
      Metal Layers
════════════════════
════════════════════   ← BEOL
════════════════════
        │ │ │
────────────────────
 NMOS PMOS NMOS PMOS   ← FEOL
────────────────────
       Silicon
```

즉 **같은 칩을 서로 다른 방향에서 보고 있는 것**이다.

이 관계가 중요해.

> 위에서 보면 **Functional Block의 배치**,  
> 옆에서 보면 **Transistor와 Metal Layer의 적층 구조**가 보인다.

---

## 11. FAB 관점에서는?

설계자는 Floorplan을 설계하지만 FAB에서는 그 설계를 실제 Wafer 위에 구현해야 한다.

예를 들어 어떤 영역에는 SRAM Cell이 엄청나게 반복되고, 다른 영역에는 복잡한 Logic이 존재한다.

따라서 같은 Die 안에서도:

```text
SRAM 영역
→ 매우 반복적인 Pattern

Logic 영역
→ 상대적으로 다양한 Pattern

I/O 영역
→ 또 다른 구조와 요구사항
```

이 존재한다.

이 차이는 나중에 **공정 Window, Patterning 난이도, Defect 영향, 수율**을 이해할 때 다시 중요해진다.

특히 “같은 공정 Node로 만든 칩인데 왜 SRAM과 Logic의 Scaling 특성이 다르지?” 같은 질문도 결국 여기에서 시작한다.

---

## 오늘 핵심 용어 4개

| 용어 | 지금 수준의 의미 |
|---|---|
| **Floorplan** | Die 안에서 큰 회로 Block의 위치를 정한 배치도 |
| **Core** | CPU에서 명령을 처리하는 주요 계산 블록 |
| **I/O** | 칩 내부와 외부가 데이터를 주고받는 회로 |
| **PPA** | Performance / Power / Area를 묶은 핵심 설계 지표 |

---

## 오늘 짧은 요약

오늘은 칩을 **위에서 내려다봤다.**

```text
Die
 ↓
여러 Functional Block
 ↓
Core / Cache(SRAM) / I/O ...
 ↓
각 Block 내부에는
Standard Cell과 SRAM Cell
 ↓
그 아래에는
수많은 MOSFET
```

그리고 이 Block들을 **어디에 배치할지 정한 큰 지도 = Floorplan**이다.

지난 Lesson까지 합치면 이제 칩을 두 방향으로 볼 수 있다.

> **위에서 보면 Floorplan, 옆에서 보면 FEOL + BEOL.**

---

## 🧠 Lesson 3 퀴즈

### Q1

Floorplan의 의미로 가장 적절한 것은?

A. Wafer를 자르는 방법  
B. Die 안의 주요 회로 Block 배치  
C. Gate 절연막의 두께

### Q2

CPU Die 안의 Cache는 일반적으로 어떤 소자를 많이 이용할까?

A. 6T SRAM Cell  
B. NAND Flash Cell  
C. LED

### Q3

서로 자주 통신하는 두 Block을 너무 멀리 배치하면 불리할 수 있는 이유는?

A. Silicon 원자가 사라져서  
B. 배선이 길어져 저항·Capacitance와 신호 지연에 불리할 수 있어서  
C. NMOS가 자동으로 PMOS로 변해서

## 정답 및 해설

**Q1 → B.** Floorplan은 큰 Functional Block을 Die 안의 어디에 놓을지를 정하는 배치 개념이다.

**Q2 → A.** CPU의 Cache에는 SRAM이 널리 사용되고, 앞에서 배운 대표적인 기본 구조가 **6T SRAM Cell**이다.

**Q3 → B.** 배선도 완벽한 도체가 아니기 때문에 길어질수록 저항과 기생 Capacitance 등의 영향을 받는다. Module 0에서 배운 전기 기초가 실제 칩 배치 문제로 다시 연결된 것이다.
