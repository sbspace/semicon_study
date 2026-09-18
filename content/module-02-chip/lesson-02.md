---
id: m02-l02
module_id: m02
lesson_number: 2
title: Die 안의 Core·Cache·I/O는 어디에 있을까? — Floorplan
estimated_minutes: 15
content_origin: adapted_original
source_url: https://chatgpt.com/share/6aa5303e-8a2c-83ee-8693-21afceb6bd01
source_message_ids:
- 74088eba-c22b-4173-b1f0-79f60e53bf8c
last_updated: '2026-09-12'
kind: lesson
---

# Module 2 / Lesson 2

> 기본 수업과 Quiz 예상 15분. 원수업의 표·그림과 설명을 보존했으며, 뒤의 추가 설명은 별도로 이어 읽을 수 있어요.

## Die 안의 Core·Cache·I/O는 어디에 있을까? — Floorplan

### 핵심 목표

오늘은 새로운 용어 하나를 제대로 이해하면 돼.

> **Floorplan = Die 안에서 큰 기능 블록들을 어디에 배치할지 정한 전체 배치도**

지난 Lesson 1에서 배운 `Core`, `Cache`, `Memory Controller`, `I/O`가 실제 Die 안에서 **각자 물리적인 자리를 차지한다**는 걸 이해하는 게 목표야.

---

## 1. 실제 CPU Die부터 보자

아래처럼 실제 CPU Die를 위에서 보면 서로 다른 패턴의 큰 영역들이 보인다.

<visual-needed id="visual-021" type="reference-structure" description="칩 구조: 1. 실제 CPU Die부터 보자 — 원수업 이미지 위치와 주변 설명을 함께 참고" />

사진에서 중요한 건 세부 모양을 외우는 게 아니야.

대략:

<interactive type="die-floorplan" />

```text
┌────────────────────────────────┐
│         Memory / I/O           │
│                                │
│   Core     Core     Core       │
│                                │
│      Shared Cache              │
│                                │
│   Core     Core     Core       │
│                                │
│        GPU / I/O 등            │
└────────────────────────────────┘
               Die
```

처럼 **기능별로 큰 구역이 존재한다**는 걸 보는 거야.

Intel의 Alder Lake 역시 하나의 SoC 안에 Performance Core와 Efficient Core가 함께 들어가고, 각 Core 주변에는 여러 단계의 Cache가 존재한다. [Intel 64 and IA-32 Architectures Optimization Reference Manual Volume 1](https://cdrdv2-public.intel.com/814198/248966-Optimization-Reference-Manual-V1-049.pdf?utm_source=chatgpt.com)

---

## 2. Floorplan이 정확히 뭐야?

건물 설계와 거의 똑같아.

아파트를 짓는다고 생각해보자.

```text
┌───────────────────────┐
│ 방 │ 방 │ 거실        │
│────┼────┤             │
│ 욕실    │ 주방        │
└───────────────────────┘
```

각 공간에는 역할이 있지.

칩도 마찬가지야.

```text
┌───────────────────────────┐
│ CPU Core │ CPU Core       │
│──────────┼────────────────│
│      L3 Cache             │
│───────────────────────────│
│ GPU      │ Memory Ctrl.   │
│──────────┼────────────────│
│          I/O              │
└───────────────────────────┘
```

이렇게 **큰 회로 블록의 위치와 크기를 정하는 것**이 Floorplanning이야.

아직 여기서는 개별 트랜지스터 위치를 정하는 게 아니야.

---

## 3. 지난 Lesson의 Standard Cell과 무슨 관계일까?

지난 시간의 계층 구조를 다시 가져와보자.

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

예를 들어 `CPU Core`라는 큰 블록을 확대하면:

```text
CPU Core

┌────────────────────┐
│ □ □ □ □ □ □ □ □  │
│ □ □ □ □ □ □ □ □  │
│ □ □ □ □ □ □ □ □  │
│ □ □ □ □ □ □ □ □  │
└────────────────────┘
       ↑
수많은 Standard Cell
```

이라고 생각하면 돼.

즉,

> **Floorplan에서는 Core라는 큰 덩어리의 자리를 보고, 더 확대하면 그 안에 수많은 Cell들이 배치되어 있다.**

---

## 4. 왜 아무 데나 배치하면 안 될까?

예를 들어 CPU Core가 데이터를 자주 쓰는 Cache가 있다고 해보자.

### 경우 A — 가까움

```text
[CPU Core] ─── [Cache]
```

신호가 이동해야 할 거리가 짧다.

### 경우 B — 멀리 떨어짐

```text
[CPU Core] ───────────────── [Cache]
```

더 긴 배선을 지나야 해.

실제 회로에서는 배선도 저항과 capacitance를 가지기 때문에 길어질수록 신호 전달에 부담이 생긴다.

그래서 칩 설계자는 단순히:

> "빈자리에 넣자."

가 아니라,

> **서로 많이 통신하는 회로를 어떻게 효율적으로 배치할까?**

를 생각해야 해.

---

## 5. Cache는 왜 Die에서 이렇게 크게 보일까?

Lesson 1에서 연결했던 내용이지.

지난 Module 1의 **6T SRAM Cell**을 떠올려봐.

```text
MOSFET 6개
   ↓
SRAM Cell 1개
```

그 Cell을 엄청 많이 반복하면:

```text
□□□□□□□□□□□□□□□□
□□□□□□□□□□□□□□□□
□□□□□□□□□□□□□□□□
□□□□□□□□□□□□□□□□
```

거대한 SRAM Array가 된다.

CPU Cache에는 이런 SRAM이 아주 많이 필요하기 때문에 실제 die shot을 보면 **규칙적으로 반복되는 큰 영역**이 Cache인 경우가 많아.

Intel의 Alder Lake에서도 P-core와 E-core에 L1/L2 Cache가 있고, 여러 E-core가 하나의 L2 Cache를 공유하는 구조가 사용된다. [IA Cores Level 1 and Level 2 Caches - 011 - ID:655258 | 12th Generation Intel® Core™ Processors](https://edc.intel.com/content/www/us/en/design/ipla/software-development-platforms/client/platforms/alder-lake-desktop/12th-generation-intel-core-processors-datasheet-volume-1-of-2/ia-cores-level-1-and-level-2-caches/https%3A%25252F%25252Fedc.intel.com%25252Fcontent%25252Fwww%25252Fes%25252Fes%25252Fdesign%25252Fipla%25252Fsoftware-development-platforms%25252Fclient%25252Fplatforms%25252Falder-lake-desktop%25252F12th-generation-intel-core-processors-datasheet-volume-1-of-2%25252Fia-cores-level-1-and-level-2-caches%25252F/https%3A%25252F%25252Fedc.intel.com%25252Fcontent%25252Fwww%25252Fes%25252Fes%25252Fdesign%25252Fipla%25252Fsoftware-development-platforms%25252Fclient%25252Fplatforms%25252Falder-lake-desktop%25252F12th-generation-intel-core-processors-datasheet-volume-1-of-2%25252Fia-cores-level-1-and-level-2-caches%25252Fhttps%3A%25252F%25252Fedc.intel.com%25252Fcontent%25252Fwww%25252Fes%25252Fes%25252Fdesign%25252Fipla%25252Fsoftware-development-platforms%25252Fclient%25252Fplatforms%25252Falder-lake-desktop%25252F12th-generation-intel-core-processors-datasheet-volume-1-of-2%25252Fia-cores-level-1-and-level-2-caches%25252F%25252F/?utm_source=chatgpt.com)

즉 우리가 Module 1에서 배웠던:

**6개의 MOSFET**

이 수없이 복제되면 지금 사진에서 보이는 **큰 Cache 영역**까지 커지는 거야.

---

## 6. Memory Controller는 뭐지?

새 용어니까 먼저 정의하자.

> **Memory Controller = CPU와 외부 DRAM 사이의 데이터 이동을 관리하는 회로**

CPU가:

```text
"RAM에 있는 이 데이터 가져와!"
```

라고 하면 중간에서 Memory Controller가 처리한다.

```text
CPU Core
   │
 Cache
   │
Memory Controller
   │
   │  칩 밖으로
   ↓
 DRAM
```

중요한 점은 **DRAM 자체와 Memory Controller는 다른 것**이라는 거야.

일반적인 CPU에서는 DRAM은 칩 밖에 있지만,

**DRAM과 대화하는 회로는 CPU Die 안에 들어갈 수 있다.**

---

## 7. I/O는 뭐야?

**I/O = Input / Output**

즉 칩이 **바깥 세상과 통신하기 위한 회로**야.

예를 들면 CPU 입장에서는:

```text
CPU Die
   │
   ├── DRAM
   ├── GPU / 다른 칩
   ├── SSD
   └── PCIe 장치
```

등과 정보를 주고받아야 한다.

칩 안에서 아무리 빠르게 계산해도 외부와 연결하지 못하면 의미가 없지.

그래서 Die에는 계산하는 Core만 있는 게 아니라 **Cache, Controller, I/O 같은 영역도 상당한 공간을 사용한다.**

---

## 8. Core가 칩 전체는 아니다

처음 CPU를 배우면 이걸 헷갈리기 쉬워.

```text
CPU = CPU Core
```

가 아니야.

실제 CPU Die를 매우 단순화하면:

```text
CPU Die
│
├── CPU Core들       ← 실제 계산
├── Cache            ← 빠른 저장 공간
├── Memory Controller
├── I/O
├── Interconnect
└── 기타 제어 회로
```

가 함께 들어 있다.

즉:

> **Core는 CPU Die를 구성하는 중요한 블록 중 하나다.**

이게 오늘 꼭 잡아야 하는 개념이야.

---

## 9. 그럼 GPU도 똑같을까?

큰 원리는 같다.

GPU Die를 보면 CPU와 내부 구성은 다르지만,

```text
GPU Die

Compute Blocks
Cache
Memory Interface
I/O
기타 제어 회로
```

처럼 여러 기능 영역으로 나뉜다.

CPU와 GPU의 **블록 종류와 비율이 다를 뿐**, Die를 여러 기능 Block으로 나눈다는 기본 개념은 같다.

GPU 자체 구조는 **Module 4**에서 제대로 비교할 거야.

---

## 핵심 용어 4개

| 용어 | 뜻 |
|---|---|
| **Floorplan** | Die 안에서 큰 기능 블록의 위치와 크기를 정한 배치 |
| **Core** | 실제 명령을 실행하고 계산하는 CPU의 핵심 블록 |
| **Memory Controller** | CPU와 외부 메모리 사이의 데이터 이동을 관리하는 회로 |
| **I/O** | 칩이 외부 장치·다른 칩과 데이터를 주고받는 부분 |

---

## 실제 칩 + 이전 수업 연결

지금까지 배운 내용을 처음부터 연결하면:

```text
MOSFET
 ↓
Logic Gate
 ↓
Standard Cell
 ↓
ALU 등의 회로
 ↓
CPU Core
 ↓
┌────────────────────────┐
│ Core │ Cache │ I/O ... │ ← Floorplan
└────────────────────────┘
            Die
```

즉 **Floorplan은 우리가 지금까지 배운 작은 회로들이 충분히 커졌을 때 보이는 '도시 지도' 같은 것**이라고 생각하면 가장 쉽다.

---

## 오늘의 짧은 요약

**① Floorplan = Die 내부의 큰 기능 블록 배치도.**

**② CPU Die에는 Core뿐 아니라 Cache, Memory Controller, I/O 등이 함께 있다.**

**③ 서로 자주 통신하는 회로의 거리와 배선도 중요하기 때문에 아무렇게나 배치할 수 없다.**

**④ Floorplan에서 보이는 거대한 Block도 확대하면 결국 Standard Cell → Logic Gate → MOSFET으로 내려간다.**

---

## 🧠 퀴즈

### Q1

`Floorplan`이 의미하는 것은?

A. MOSFET의 Gate 두께  
B. Die 내부의 큰 기능 Block 배치  
C. Wafer 위 Die 개수

**정답: B**

Floorplan은 `Core`, `Cache`, `I/O` 같은 **큰 Block을 Die 어디에 둘지 보는 단계**야.

---

### Q2

다음 중 CPU Core와 DRAM 사이의 데이터 이동을 관리하는 회로는?

A. Memory Controller  
B. SRAM Cell  
C. Gate Oxide

**정답: A**

DRAM 자체가 아니라 **DRAM과 통신하는 회로**가 Memory Controller야.

---

### Q3

CPU Die를 설명한 것으로 맞는 것은?

A. CPU Die 전체가 하나의 CPU Core다.  
B. CPU Die에는 Core만 존재한다.  
C. Core, Cache, Controller, I/O 등 여러 Block이 함께 존재한다.

**정답: C**

**CPU Core ⊂ CPU Die**라고 생각하면 된다.

---

다음 수업: [Lesson 3](lesson-03.md).

관련 원수업 보충: [추가 회차 원문](supplement-floorplan.md). 세션별 번호 충돌과 시간 순서는 source_map.md에 기록했습니다.
