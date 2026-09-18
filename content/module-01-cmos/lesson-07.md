---
id: m01-l07
module_id: m01
lesson_number: 7
title: SRAM 6T Cell — CMOS로 1 bit를 계속 기억하는 방법
estimated_minutes: 15
content_origin: adapted_original
source_url: https://chatgpt.com/share/6aa5302d-67d0-83e9-b0c6-5b4883ef8170
source_message_ids:
- 37e058bd-23b1-4a86-840c-c6d93ed2e204
- ce7e9ffb-4f46-47ca-8048-46160250b330
last_updated: '2026-09-12'
kind: lesson
extension_minutes: 5
---

# Module 1 / Lesson 7  
<interactive type="sram-cell" />


> 기본 수업과 Quiz 예상 15분. 원수업의 표·그림과 설명을 보존했으며, 뒤의 추가 설명은 별도로 이어 읽을 수 있어요.

## SRAM 6T Cell — CMOS로 1 bit를 계속 기억하는 방법

지난 Lesson 6에서는:

> **Flip-Flop 1개 → 1 bit 저장**  
> **Flip-Flop 여러 개 → Register**

를 배웠어.

오늘은 CPU 안의 또 다른 중요한 저장 공간인 **SRAM**으로 넘어가자.

오늘 목표는 하나야.

> **CMOS Inverter 2개를 서로 연결하면 왜 0 또는 1을 계속 기억할 수 있는지 이해하기.**

---

## 1. SRAM부터: 뭐의 약자야?

**SRAM = Static Random Access Memory**

여기서 `Static`은:

> **전원이 공급되는 동안 별도로 계속 새로 써주지 않아도 값을 유지한다**

는 의미야.

DRAM처럼 주기적인 **Refresh**가 필요한 메모리와 다른 점인데, DRAM은 나중에 메모리 Module에서 제대로 배울 거야.

---

## 2. 실제 6T SRAM Cell을 보자

<visual-needed id="visual-019" type="reference-structure" description="트랜지스터와 CMOS: 2. 실제 6T SRAM Cell을 보자 — 원수업 이미지 위치와 주변 설명을 함께 참고" />

처음 보면 복잡해 보이지만 딱 두 덩어리만 보면 돼.

### 가운데 4개 트랜지스터

**CMOS Inverter 2개**

### 양옆 2개 트랜지스터

저장된 값에 접근하기 위한 **Access Transistor**

따라서:

> **4 + 2 = 총 6개 Transistor → 6T SRAM Cell**

이야. 일반적인 6T SRAM은 두 개의 서로 연결된 inverter와 두 개의 access transistor로 구성돼. [Memory cell types](https://semiengineering.com/wp-content/Memory-ebook-2024.pdf?utm_source=chatgpt.com)

---

## 3. Inverter 두 개가 어떻게 기억을 하지?

Lesson 2에서 Inverter를 배웠지.

입력이:

**0 → 출력 1**  
**1 → 출력 0**

이었어.

그런데 Inverter 두 개를 이렇게 **서로의 출력이 상대방 입력으로 들어가게** 연결해.

이걸:

## Cross-coupled Inverter

라고 해.

쉽게 말하면:

> **서로의 출력을 서로에게 다시 알려주는 두 Inverter**

야.

---

## 예를 들어 Q = 1이라고 해보자

한쪽 저장점이:

**Q = 1**

이면 첫 번째 inverter가 반대로 만들어서:

**Q̅ = 0**

이 돼.

그리고 이 `0`이 다시 반대쪽 inverter에 들어가면:

→ 다시 **Q = 1**

이 된다.

즉:

**1 → 0 → 1 → 0 → 1 ...**

> **편집 보완:** 이 화살표는 두 노드의 논리 관계를 따라간 것이야. 한 노드가 시간에 따라 계속 0과 1로 진동한다는 뜻이 아니야. Hold 중에는 Q와 Q̅가 각각 일정한 값을 유지해.

서로가 서로의 상태를 계속 유지해주는 구조야.

반대로:

**Q = 0 / Q̅ = 1**

도 안정적으로 유지될 수 있어.

그래서 이 회로에는 안정적인 상태가 두 개 있어:

- `Q=1, Q̅=0`
- `Q=0, Q̅=1`

이 두 상태를 이용해서 **1 bit의 0/1을 저장**해. [Memory cell (computing)](https://en.wikipedia.org/wiki/Memory_cell_%28computing%29?utm_source=chatgpt.com)

---

## 4. 그런데 어떻게 밖에서 읽고 쓰지?

그래서 나머지 **2개의 Access Transistor**가 필요해.

여기서 새 용어 세 개만 알자.

### WL = Word Line

> **“이 SRAM Cell을 지금 열어라”**라고 선택하는 신호.

### BL = Bit Line

### BLB = Bit Line Bar

> 실제 데이터를 SRAM Cell 안팎으로 전달하는 두 개의 선.

`BLB`는 보통 BL의 반대 값을 사용해.

> **편집 보완:** 이는 쓰기 때의 기본 설명이야. 읽기 전에는 BL과 BLB를 같은 전압으로 미리 충전한 뒤, 셀 때문에 생기는 작은 차이를 검출할 수 있어.

---

## 5. 평소에는 Cell을 닫아둔다

`WL = 0`

이면 Access Transistor 2개가 OFF돼.

그러면 SRAM Cell이 외부의 BL/BLB와 끊어져.

하지만 내부의 두 Inverter는 계속 서로 연결되어 있으므로:

> **기존의 0 또는 1을 계속 유지한다.**

이게 SRAM의 **Hold/Standby 상태**야. [Static random-access memory](https://en.wikipedia.org/wiki/Static_random-access_memory?utm_source=chatgpt.com)

---

## 6. 데이터를 읽을 때

먼저 쉽게 개념만 보자.

예를 들어 Cell 안에:

**Q = 1 / Q̅ = 0**

이 저장되어 있다고 하자.

읽으려면:

**WL → HIGH**

로 해서 Access Transistor를 열어.

그러면 내부 상태가 **BL / BLB 쪽에 영향을 주고**, 외부 회로가 두 Bit Line의 차이를 보고:

> “아, 이 Cell에는 1이 들어 있구나.”

라고 판별해.

실제 SRAM에서는 작은 bit-line 전압 차이를 빠르게 읽기 위해 **Sense Amplifier**라는 회로를 사용해. [Embedded Memory Impact On Power Grids](https://semiengineering.com/embedded-memory-impact-power-grids/?utm_source=chatgpt.com)

지금은:

> **WL로 Cell을 열고 → BL/BLB를 통해 읽는다**

만 기억하면 충분해.

---

## 7. 데이터를 쓸 때

이번에는 SRAM에 `1`이나 `0`을 새로 넣고 싶어.

외부 회로가 먼저:

**BL / BLB에 원하는 0과 1을 걸어준다.**

그리고:

**WL = HIGH**

로 Access Transistor를 열어.

외부에서 강하게 만들어준 전압이 내부 상태를 바꾸고, Cross-coupled Inverter가 새 상태를 유지하게 돼. [Static random-access memory](https://en.wikipedia.org/wiki/Static_random-access_memory?utm_source=chatgpt.com)

즉 SRAM에는 크게 세 상태가 있어.

| 상태 | WL | 의미 |
|---|---|---|
| **Hold** | OFF | 기존 값 유지 |
| **Read** | ON | 저장된 값 읽기 |
| **Write** | ON | 새로운 값 쓰기 |

---

## 8. 그러면 Flip-Flop과 SRAM은 뭐가 달라?

이게 오늘 중요한 부분이야.

둘 다 **0/1을 기억하는 CMOS 회로**라는 점은 같아.

하지만 목적이 달라.

| | Flip-Flop / Register | SRAM |
|---|---|---|
| 기본 목적 | 계산 중간 상태를 매우 빠르게 저장 | 많은 데이터를 조밀하게 저장 |
| 기본 단위 | 보통 Flip-Flop | 보통 6T Cell |
| Clock | 동작에 Clock을 직접 사용 | Cell 자체는 Clock 없이 상태 유지 |
| 집적도 | 상대적으로 낮음 | **높음** |
| 대표 사용 | Pipeline/Register | **CPU Cache** |

여기서 중요한 점:

> **SRAM Cell 자체가 Clock에 맞춰 값을 저장하는 Flip-Flop은 아니다.**

SRAM Cell은 전원이 있는 동안 Cross-coupled Inverter가 스스로 상태를 유지해.

실제 CPU의 register file은 구현에 따라 전용 메모리 구조를 쓰기도 있으므로, 지금은 **“기본적인 Register는 Flip-Flop 기반, Cache는 SRAM 기반”** 정도로 이해하면 돼.

---

## 9. CPU Cache와 연결

CPU 안에는 보통:

**L1 / L2 / L3 Cache**

가 있지.

이 Cache를 만드는 대표적인 메모리가 바로 **SRAM**이야.

왜 SRAM을 쓸까?

> **빠르기 때문.**

하지만 1 bit 저장에 트랜지스터가 여러 개 필요해서 면적을 많이 먹어.

그래서 큰 용량의 메인 메모리는 일반적으로 DRAM을 사용하고, CPU 가까이에서 빠르게 접근해야 하는 Cache에는 SRAM을 사용하는 거야.

SRAM은 array 안에서 수많은 1-bit cell을 행과 열로 배치하고 Word Line과 Bit Line으로 원하는 cell을 선택한다. [Embedded Memory Impact On Power Grids](https://semiengineering.com/embedded-memory-impact-power-grids/?utm_source=chatgpt.com)

---

## 10. 지금까지 배운 CMOS가 여기까지 온다

이 연결이 중요해.

**MOSFET**  
↓  
**NMOS / PMOS**  
↓  
**CMOS Inverter**  
↓  
**Inverter 2개 Cross-couple**  
↓  
**1 bit 저장**  
↓  
**6T SRAM Cell**  
↓  
수백만 개 배열  
↓  
**CPU Cache**

즉 CPU의 Cache라는 거대한 기능도 밑바닥으로 내려가면:

> **NMOS와 PMOS 몇 개의 ON/OFF에서 시작한다.**

---

## 11. FAB 관점에서는?

SRAM Cell 하나는 매우 작지만 칩 안에는 엄청나게 반복돼.

따라서 Cell 하나를 조금만 작게 만들어도 **전체 Die 면적에 큰 영향**을 줄 수 있어.

그래서 파운드리에서는 SRAM을 설계할 때:

- Cell 면적
- 속도
- 전력
- 공정 변동에 대한 안정성

이 굉장히 중요해.

실제로 Foundry는 공정에 맞춰 최적화된 SRAM macro들을 제공하기도 해. [Memory cell types](https://semiengineering.com/wp-content/Memory-ebook-2024.pdf?utm_source=chatgpt.com)

즉 공정 미세화가 단순히 “트랜지스터 하나를 작게 만든다”에서 끝나는 게 아니라 **SRAM 같은 실제 회로 블록의 면적·성능·안정성**까지 연결되는 거야.

---

## 오늘 현업 용어 4개

| 용어 | 쉽게 말하면 |
|---|---|
| **6T SRAM Cell** | 6개 트랜지스터로 1 bit를 저장 |
| **Cross-coupled** | 두 Inverter가 서로 출력을 다시 입력으로 연결 |
| **Word Line (WL)** | 어떤 SRAM Cell을 열지 선택하는 선 |
| **Bit Line (BL/BLB)** | 저장 데이터를 읽고 쓰는 선 |

---

## 오늘 반드시 기억할 4줄

**① SRAM 6T Cell = Inverter 2개(4T) + Access Transistor 2개.**

**② 두 Inverter가 서로 연결되어 0/1 상태를 유지한다.**

**③ WL로 Cell을 열고 BL/BLB를 통해 Read/Write한다.**

**④ SRAM은 CPU Cache를 만드는 대표적인 메모리다.**

---

## 🧠 퀴즈

**Q1. 6T SRAM Cell은 몇 bit를 저장할까?**

A. 1 bit  
B. 6 bit

**정답: A.** 트랜지스터 6개를 사용해 **1 bit**를 저장한다.

**Q2. SRAM이 값을 기억하는 핵심 구조는?**

A. Cross-coupled Inverter  
B. Adder

**정답: A.**

두 Inverter가 서로 상태를 보강한다.

**Q3. SRAM Cell을 외부 Bit Line과 연결할지 결정하는 신호는?**

A. WL  
B. VDD

**정답: A. Word Line.**

---

## 수업 중 추가 설명 — 필요할 때 이어 읽기

맞아. 거의 정확하게 잡았는데, **Inverter 개수만 수정하면 돼.**

- **MOSFET = 트랜지스터 1개**
  - NMOS도 MOSFET 1개
  - PMOS도 MOSFET 1개

- **CMOS Inverter 1개 = NMOS 1개 + PMOS 1개 = 총 2T**
- **6T SRAM Cell 1개 = Inverter 2개(4T) + Access Transistor 2개(2T) = 총 6T**

즉 이렇게야:

```text
MOSFET 1개
   ↓
NMOS 또는 PMOS

NMOS 1 + PMOS 1
   ↓
CMOS Inverter 1개 = 2T

Inverter 2개 = 4T
+ Access NMOS 2개 = 2T
   ↓
6T SRAM Cell 1개
   ↓
1 bit 저장
```

그리고 **Cell = SRAM 하나를 부르는 말은 아니야.**  
정확히는 **SRAM에서 1 bit를 저장하는 최소 단위**가 `SRAM Cell`이야.

그래서:

> **6T SRAM Cell 수백만 개 + 읽기/쓰기 주변회로 → SRAM 메모리(예: CPU Cache)**

라고 보면 가장 정확해.

다음 연결: [Module 전체 복습](review.md).
