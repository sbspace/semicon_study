---
id: m02-review
module_id: m02
title: 칩 구조 전체 복습
estimated_minutes: 15
content_origin: adapted_original
source_url: https://chatgpt.com/share/6aa5303e-8a2c-83ee-8693-21afceb6bd01
source_message_ids:
- 40830d08-39c7-4588-af1d-c3da0e126e9f
last_updated: '2026-09-12'
kind: review
---

# Module 2 전체 복습  
## 칩 구조 — MOSFET부터 Package까지 한 번에 연결하기

### 1. 가장 큰 흐름

Module 2의 핵심은 이 한 줄이야.

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
   ↓
Package
   ↓
PCB
```

그리고 Die 내부를 옆에서 보면:

```text
위쪽
│
│  Metal Layers      ← BEOL
│
│  Contact / 연결     ← MOL
│
│  MOSFET            ← FEOL
│
└─ Silicon
```

즉,

> **아래에서 MOSFET이 계산하고, 위의 Metal 배선이 서로 연결한다.**

---

## 2. Lesson 1 — 작은 회로가 어떻게 Die가 되나

```text
MOSFET
 ↓
Logic Gate
 ↓
Standard Cell
 ↓
ALU / Cache 등의 Block
 ↓
CPU/GPU Die
```

### Standard Cell

**미리 설계해 놓은 작은 회로 블록**

예:

- Inverter
- NAND
- NOR
- Flip-Flop

쉽게 말해 **칩 설계용 레고 블록**이었어.

---

## 3. Lesson 2 — Floorplan

## Floorplan

> **Die 안에서 Core, Cache, I/O 같은 큰 Block을 어디에 배치할지 정한 구조**

예:

```text
┌──────────────────────┐
│ Core │ Core │ Cache │
│──────┼──────┼───────│
│ GPU  │ Memory Ctrl. │
│──────┴───────────────│
│        I/O           │
└──────────────────────┘
```

중요한 점:

> **CPU Core = CPU Die 전체가 아니다.**

CPU Die에는 Core 외에도:

- Cache
- Memory Controller
- I/O
- Interconnect

등이 같이 들어 있어.

---

## 4. Lesson 3 — FEOL / MOL / BEOL

이건 Module 2에서 아주 중요해.

### FEOL

**Transistor를 만드는 영역**

```text
Gate / Source / Drain / Channel
```

### MOL

**Transistor와 첫 배선을 연결**

대표적으로 Contact.

### BEOL

**Metal 배선층**

```text
M1
M2
M3
...
Upper Metal
```

Metal끼리는:

## Via

로 수직 연결했어.

```text
M2
═══════
   │
  Via
   │
═══════
M1
```

---

## 5. Lesson 4 — Signal / Clock / Power

Metal 배선이 전부 같은 역할을 하는 건 아니었지.

### Signal

**0/1 정보를 전달**

```text
회로 A ───→ 회로 B
```

### Clock

**회로의 동작 타이밍을 전달**

Clock이 각 회로에 도착하는 시간 차이를:

## Clock Skew

라고 했어.

### PDN

**Power Delivery Network**

칩 전체에:

```text
VDD
GND
```

를 공급하는 전원망.

배선에 저항이 있기 때문에 전압이 떨어지는 현상을:

## IR Drop

이라고 했어.

---

## 6. Lesson 5 — Die 밖으로 나가기

연결 순서:

```text
MOSFET
 ↓
Metal
 ↓
Pad
 ↓
Bump
 ↓
Package Substrate
 ↓
PCB
```

### Pad

Die의 **외부 연결용 금속 접점**

### Bump

Die와 Package를 연결하는 **돌기형 금속 접점**

### Package Substrate

Die의 아주 촘촘한 연결을 PCB 쪽으로 **재배선하는 기판**

### PCB

**Printed Circuit Board**

여러 반도체 부품을 올리고 연결하는 큰 회로기판.

---

## 7. Lesson 6 — Monolithic vs Chiplet

### Monolithic

```text
┌───────────────────┐
│ Core / Cache / I/O│
│      Die 하나      │
└───────────────────┘
```

큰 Die 하나에 기능을 통합.

### Chiplet

```text
[CPU Die] [CPU Die]
      \     /
      [I/O Die]
```

여러 작은 Die로 나눠 Package 안에서 연결.

### Chiplet 장점

- 작은 Die → 수율에 유리할 수 있음
- 서로 다른 공정 Node 조합 가능
- 제품 확장성이 좋음

### 단점

Die와 Die 사이 통신이 추가돼서:

- 지연
- 전력
- Package 복잡도

문제가 생길 수 있어.

---

## 헷갈리기 쉬운 포인트

| 헷갈리는 것 | 구분 |
|---|---|
| **Die vs Package** | Die = 실리콘 회로 / Package = Die를 연결·보호하는 구조 |
| **Core vs Die** | Core는 Die 내부의 한 기능 Block |
| **Contact vs Via** | Contact = transistor↔배선 / Via = Metal↔Metal |
| **Pad vs Bump** | Pad = 평평한 접점 / Bump = 실제 접촉하는 돌기 |
| **I/O vs I/O Die** | I/O = 입출력 기능 / I/O Die = 그 기능을 많이 담당하는 별도 Die |
| **Chiplet vs Package** | Chiplet = 작은 Die / Package = 여러 Die를 묶는 구조 |

---

## 전체 연결 관계

이 그림이 Module 2의 최종 그림이야.

```text
                    CPU / GPU

        ┌────────────────────────┐
        │ Core │ Cache │ I/O ... │
        └────────────────────────┘
                 Floorplan
                     │
             Functional Blocks
                     │
              Standard Cells
                     │
               Logic Gates
                     │
              NMOS / PMOS
                     │
                 FEOL
                     │
                 Contact
                     │
              M1 / M2 / M3...
                 BEOL
                     │
         Signal / Clock / VDD/GND
                     │
                    Pad
                     │
                   Bump
                     │
             Package Substrate
                     │
                    PCB
```

---

## 🧠 누적 퀴즈

### Q1

다음 중 작은 것 → 큰 것 순서로 맞는 것은?

A. Die → Standard Cell → MOSFET  
B. MOSFET → Standard Cell → Functional Block → Die  
C. Package → MOSFET → Die

**정답: B**

작은 transistor들이 회로와 Cell, Block을 거쳐 Die를 만든다.

---

### Q2

M1과 M2를 연결하는 구조는?

A. Bump  
B. Via  
C. Pad

**정답: B**

`Via = Metal Layer ↔ Metal Layer`.

---

### Q3

다음 연결 순서 중 맞는 것은?

A. Die → Bump → Package → PCB  
B. Die → PCB → Bump → Package  
C. Package → MOSFET → PCB

**정답: A**

Die의 외부 신호가 Bump를 통해 Package로 나가고, 최종적으로 PCB에 연결된다.

---

### Q4

Chiplet 방식의 특징으로 맞는 것은?

A. 반드시 Die 하나만 사용한다.  
B. 여러 작은 Die를 Package 안에서 연결할 수 있다.  
C. Package가 필요 없다.

**정답: B**

Chiplet의 핵심은 **여러 Die를 하나의 시스템처럼 묶는 것**이야.

---

## Module 2에서 반드시 남아야 할 5줄

**① Die 안의 회로는 MOSFET → Cell → Block의 계층으로 구성된다.**

**② Die 위에서 보면 Core/Cache/I/O 등의 Floorplan이 보인다.**

**③ Die 옆에서 보면 아래 MOSFET, 위 Metal Layer 구조다.**

**④ Signal·Clock·Power는 모두 Metal 배선망을 통해 이동한다.**

**⑤ Die는 Pad/Bump/Package를 거쳐 PCB와 연결되고, 필요하면 여러 Die를 Chiplet으로 묶을 수도 있다.**

---

다음 Module에서는 재료를 쌓고 패턴을 옮기고 가공하여 칩을 만드는 과정을 이해한다.
