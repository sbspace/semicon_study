---
id: m02-l06
module_id: m02
lesson_number: 6
title: 큰 Die 하나 vs 여러 작은 Die — Monolithic와 Chiplet
estimated_minutes: 15
content_origin: adapted_original
source_url: https://chatgpt.com/share/6aa5303e-8a2c-83ee-8693-21afceb6bd01
source_message_ids:
- f1ca91ef-a947-48a7-b2a3-5c045e17bafe
last_updated: '2026-09-12'
kind: lesson
---

# Module 2 / Lesson 6  

> 기본 수업과 Quiz 예상 15분. 원수업의 표·그림과 설명을 보존했으며, 뒤의 추가 설명은 별도로 이어 읽을 수 있어요.

## 큰 Die 하나 vs 여러 작은 Die — Monolithic와 Chiplet

### 핵심 목표

오늘은 이것만 잡으면 돼.

> **Monolithic = 기능을 큰 Die 하나에 넣는 방식**  
> **Chiplet = 기능을 여러 작은 Die로 나눠 한 Package 안에서 연결하는 방식**

최근 고성능 CPU/GPU에서는 **여러 Die를 한 Package에 묶는 구조**가 매우 중요해졌어. AMD는 실제 Ryzen/EPYC 계열에서 여러 CPU chiplet을 I/O Die와 연결하는 구조를 사용해 왔다. [](https://www.amd.com/content/dam/amd/en/documents/processor-tech-docs/white-papers/threadripperpro-white-paper-third-wave-workstation-computing.pdf)

---

## 1. Monolithic Die부터

**Monolithic**은 쉽게 말해:

> **필요한 기능을 실리콘 Die 하나에 모두 넣는 것**

이야.

<interactive type="chiplet-package" />

```text
┌─────────────────────────┐
│                         │
│  CPU Core   Cache       │
│                         │
│  CPU Core   I/O         │
│                         │
│  Memory Controller      │
│                         │
└─────────────────────────┘
          Die 1개
```

지난 Lesson 2에서 배운 Floorplan 전체가 **한 장의 실리콘 안에 있는 형태**라고 보면 돼.

---

## 2. Chiplet은?

## Chiplet

> **큰 칩의 기능을 여러 개의 작은 Die로 나눈 뒤, 같은 Package 안에서 서로 연결하는 방식**

이야.

예를 들어:

```text
          Package

┌────────────────────────────┐
│                            │
│ [CPU Die]     [CPU Die]    │
│                            │
│        [I/O Die]            │
│                            │
│ [CPU Die]     [CPU Die]    │
│                            │
└────────────────────────────┘
```

겉으로 보면 CPU 제품 하나지만,

안에는 **여러 개의 Die가 들어 있는 것**이지.

대표적인 실제 구조를 보면 이런 느낌이야.

<visual-needed id="visual-024" type="reference-structure" description="칩 구조: Chiplet — 원수업 이미지 위치와 주변 설명을 함께 참고" />

첫 그림처럼 중앙에 **I/O Die**, 주변에 여러 **CPU Chiplet**을 두는 구조가 대표적인 예야.

AMD는 Threadripper PRO에서 여러 CPU chiplet을 Infinity Fabric으로 서로 연결하고 Memory/I/O에도 연결하는 방식을 사용했다. [](https://www.amd.com/content/dam/amd/en/documents/processor-tech-docs/white-papers/threadripperpro-white-paper-third-wave-workstation-computing.pdf)

---

## 3. 왜 굳이 잘게 나눌까?

가장 중요한 이유 중 하나가 **수율(Yield)**이야.

### 큰 Die 하나

```text
┌─────────────────────┐
│                     │
│          X          │ ← 결함 1개
│                     │
└─────────────────────┘

→ 큰 Die 전체가 불량이 될 수 있음
```

### 작은 Die 여러 개

```text
[OK] [OK] [X] [OK]
```

불량 난 작은 Die만 제외하고 좋은 Die들을 골라 사용할 수 있어.

일반적으로 같은 결함 밀도라면 **Die가 커질수록 하나의 Die 안에 결함이 포함될 확률이 커지므로 수율 측면에서 불리해질 수 있어.** AMD 역시 작은 Die가 wafer당 더 많은 양품을 얻는 데 유리할 수 있다고 설명한다. [](https://www.amd.com/content/dam/amd/en/documents/processor-tech-docs/white-papers/threadripperpro-white-paper-third-wave-workstation-computing.pdf)

---

## 4. 그래서 비용에도 유리할 수 있다

Wafer 하나가 있다고 하자.

```text
       Wafer

   ○ ○ ○ ○ ○
  ○ ○ ○ ○ ○ ○
   ○ ○ ○ ○ ○
```

### Die가 크면

Wafer에서 잘라낼 수 있는 개수가 적어.

```text
[        ]
[        ]
[        ]
```

### Die가 작으면

더 많이 넣을 수 있어.

```text
[] [] [] []
[] [] [] []
[] [] [] []
```

거기에 수율까지 좋아질 수 있으니 **Chiplet이 제조 비용 측면에서 유리해질 가능성**이 생기는 거야. AMD도 chiplet 구조의 장점으로 die 크기와 제조비용·확장성을 언급한다. [](https://www.amd.com/content/dam/amd/en/documents/processor-tech-docs/white-papers/threadripperpro-white-paper-third-wave-workstation-computing.pdf)

---

## 5. 두 번째 큰 장점 — 서로 다른 공정을 섞을 수 있다

이게 파운드리 관점에서 상당히 중요해.

모든 회로가 최신 2nm, 3nm 같은 첨단 공정을 반드시 필요로 하는 건 아니야.

예를 들어:

```text
CPU Core
→ 최고 성능 필요
→ 최신 Node 사용

I/O
→ 굳이 최고 미세공정이 필요하지 않을 수도 있음
→ 더 성숙한 Node 사용
```

그래서 하나의 Package 안에:

```text
┌──────────┐
│ CPU Die  │ → 3nm
└──────────┘

┌──────────┐
│ I/O Die  │ → 6nm
└──────────┘
```

처럼 **서로 다른 공정에서 만든 Die를 조합**할 수 있어.

AMD의 최신 CDNA 계열도 compute chiplet과 I/O/cache 기능에 서로 다른 process node를 사용하는 방식으로 각 기능을 독립적으로 최적화한다. [CHIPLET ARCHITECTURE](https://www.amd.com/content/dam/amd/en/documents/instinct-tech-docs/white-papers/amd-cdna-4-architecture-whitepaper.pdf?utm_source=chatgpt.com)

이걸 **Heterogeneous Integration(이종 집적)**이라고 불러.

> 서로 다른 특성이나 공정의 Die를 하나의 시스템으로 합치는 것

이야.

---

## 6. 세 번째 장점 — 확장이 쉽다

CPU 제품을 만든다고 해보자.

### 8 Core

```text
[CPU Chiplet]
```

### 16 Core

```text
[CPU Chiplet] [CPU Chiplet]
```

### 32 Core

```text
[CPU] [CPU]
[CPU] [CPU]
```

처럼 같은 기본 Die를 재사용해서 제품군을 확장할 수 있어.

AMD도 chiplet을 **processor building block**처럼 사용해 더 많은 chiplet을 Package에 추가하는 방식으로 성능과 core 수를 확장할 수 있다고 설명한다. [AMD "Zen" Core Architecture](https://www.amd.com/en/technologies/zen-core.html)

---

## 7. 그러면 Chiplet이 무조건 좋은가?

아니야.

큰 단점이 하나 있어.

### Monolithic

```text
Core ─── Cache
```

같은 Die 안에서 연결.

### Chiplet

```text
Die A
  │
  │ Die-to-Die 연결
  ↓
Die B
```

**Die 경계를 넘어가야 해.**

그래서:

- 통신 지연
- 전력 소비
- 연결 설계
- Package 복잡도

가 증가할 수 있어.

즉:

> **작게 나누는 순간 Die와 Die를 빠르게 연결하는 기술이 중요해진다.**

그래서 Intel의 EMIB나 Foveros처럼 여러 Die를 고밀도로 연결하는 **Advanced Packaging 기술**이 등장하는 거야. Intel도 EMIB를 여러 복잡한 Die를 연결하는 2.5D 방식, Foveros를 Die를 적층하는 방식으로 설명한다. [Advanced Packaging Innovations | Chip Packages](https://www.intel.com/content/www/us/en/foundry/packaging.html)

---

## 8. Chiplet과 Package의 관계

지난 Lesson 5가 여기서 바로 연결돼.

Monolithic은:

```text
Package
└── Die 1개
```

Chiplet은:

```text
Package
├── CPU Die
├── CPU Die
├── I/O Die
└── 기타 Die
```

야.

그래서 중요한 포인트:

> **Chiplet 자체가 Package는 아니다.**

Chiplet은 **작은 Die**이고,

여러 Chiplet을 **Package가 하나의 제품으로 묶어주는 것**이야.

---

## 9. I/O Die는 뭐야?

아까 그림 중앙에 있었지.

## I/O Die

> **메모리, PCIe, 다른 Die 등과의 입출력 연결을 주로 담당하는 Die**

라고 보면 돼.

예를 들어:

```text
CPU Chiplet ─┐
CPU Chiplet ─┤
             ↓
          [I/O Die]
             │
     ┌───────┼───────┐
     ↓       ↓       ↓
    DRAM    PCIe   다른 장치
```

지난번 네가 물어본 **I/O = Input / Output**이 여기서 그대로 쓰이는 거야.

AMD는 실제 chiplet CPU에서 CPU chiplet들과 memory/I/O를 interconnect로 연결하는 구조를 사용한다. [](https://www.amd.com/content/dam/amd/en/documents/processor-tech-docs/white-papers/threadripperpro-white-paper-third-wave-workstation-computing.pdf)

---

## 10. 더 발전하면 위로도 쌓을 수 있다

지금까지는:

```text
[Die] [Die] [Die]
```

처럼 옆으로 놓았지.

이를 흔히 **2D / 2.5D 계열**이라고 볼 수 있어.

더 발전하면:

```text
   [Die]
     ↓
   [Die]
     ↓
   [Die]
```

처럼 위로 쌓는 **3D Stacking**도 가능해.

Intel Foveros 같은 기술은 실제로 Die를 수직 적층하는 방식을 사용한다. [Advanced Packaging Innovations | Chip Packages](https://www.intel.com/content/www/us/en/foundry/packaging.html)

이건 Module 6 **패키징**에서 제대로 배울 거야.

---

## 핵심 용어 4개

| 용어 | 뜻 |
|---|---|
| **Monolithic Die** | 대부분의 기능을 하나의 큰 Die에 구현 |
| **Chiplet** | 큰 칩의 기능을 나눠 만든 작은 Die |
| **I/O Die** | 메모리·PCIe·다른 Die 등과의 입출력을 담당하는 Die |
| **Heterogeneous Integration** | 서로 다른 공정/기능의 Die들을 하나로 통합 |

---

## 실제 칩 + 이전 수업 연결

Module 2 전체가 이제 이렇게 연결돼.

```text
Transistor
   ↓
Standard Cell
   ↓
Core / Cache
   ↓
Floorplan
   ↓
Die
   ↓
 ┌───────────────────┐
 │ Monolithic        │
 │       또는        │
 │ 여러 Chiplet      │
 └───────────────────┘
   ↓
Package
   ↓
PCB
```

즉 Lesson 1에서 시작한 **“수십억 transistor가 어떻게 하나의 칩이 되나?”**라는 질문에 거의 끝까지 답한 셈이야.

---

## 오늘의 짧은 요약

**① Monolithic = 큰 Die 하나에 기능을 통합.**

**② Chiplet = 기능을 여러 작은 Die로 나누고 Package 안에서 연결.**

**③ Chiplet은 수율·비용·확장성·서로 다른 공정 조합에 유리할 수 있다.**

**④ 대신 Die-to-Die 연결과 Advanced Packaging이 훨씬 중요해진다.**

---

## 🧠 퀴즈

### Q1

Chiplet을 가장 잘 설명한 것은?

A. Package의 외부 껍데기  
B. 큰 시스템의 일부 기능을 담당하는 작은 Die  
C. Metal Layer 하나

**정답: B**

Chiplet은 기본적으로 **하나의 작은 Die**야.

---

### Q2

Chiplet 방식의 장점이 아닌 것은?

A. 작은 Die로 수율에 유리할 수 있음  
B. 서로 다른 공정 Node를 조합 가능  
C. Die 사이 통신이 필요 없어짐

**정답: C**

오히려 Chiplet에서는 **Die-to-Die 통신이 추가되기 때문에 연결 기술이 중요해져.**

---

### Q3

다음 구조는?

```text
[CPU Die] [CPU Die]
      \     /
      [I/O Die]
```

A. Monolithic  
B. Multi-Die / Chiplet  
C. MOSFET

**정답: B**

하나의 Package 안에 여러 Die를 조합한 구조야.

---

다음 연결: [Module 전체 복습](review.md).

관련 원수업 보충: [추가 회차 원문](supplement-wafer-shot.md). 세션별 번호 충돌과 시간 순서는 source_map.md에 기록했습니다.
