---
id: m01-l03
module_id: m01
lesson_number: 3
title: NAND와 NOR — 트랜지스터 여러 개를 연결하면 어떻게 논리가 만들어질까?
estimated_minutes: 12
content_origin: adapted_original
source_url: https://chatgpt.com/share/6aa5302d-67d0-83e9-b0c6-5b4883ef8170
source_message_ids:
- 968eb9a0-9841-4c54-a80e-2d73b547f9d6
last_updated: '2026-09-12'
kind: lesson
---

# Module 1 / Lesson 3  
<interactive type="nand-nor" />


> 기본 수업과 Quiz 예상 12분. 원수업의 표·그림과 설명을 보존했으며, 뒤의 추가 설명은 별도로 이어 읽을 수 있어요.

## NAND와 NOR — 트랜지스터 여러 개를 연결하면 어떻게 논리가 만들어질까?

지난 수업에서는 **PMOS 하나 + NMOS 하나**로 `NOT`을 만들었어.

이번에는 입력을 **A, B 두 개**로 늘려보자.

오늘 목표는 하나야.

> **NMOS/PMOS를 직렬·병렬로 연결하면 NAND와 NOR 같은 논리게이트가 만들어진다는 것.**

이번 주제는 3D 모양보다 **트랜지스터가 서로 어떻게 연결되는지**가 핵심이라, 실제 연결 회로도를 보는 게 더 도움이 돼.

---

## 1. 먼저 새 용어: 직렬과 병렬

스위치 2개가 있다고 생각해보자.

### 직렬(Series)

둘이 **연달아** 붙어 있어.

`스위치 A → 스위치 B`

그래서 전기가 끝까지 가려면:

> **A도 ON이고 B도 ON이어야 한다.**

즉 직렬은 느낌상 **AND 조건**이야.

### 병렬(Parallel)

갈 수 있는 길이 두 개야.

A 길 또는 B 길 중 **하나만 열려도** 전기가 갈 수 있어.

즉 병렬은 느낌상 **OR 조건**이야.

이 두 개념이 오늘 거의 전부야.

---

## 2. NAND부터 보자

<visual-needed id="visual-012" type="reference-structure" description="트랜지스터와 CMOS: 2. NAND부터 보자 — 원수업 이미지 위치와 주변 설명을 함께 참고" />

위 그림에서 중요한 부분만 보자.

### 위쪽 PMOS
**병렬**

### 아래쪽 NMOS
**직렬**

이렇게 총 **4개의 트랜지스터**가 사용돼.

---

## 3. 왜 NAND가 되지?

아래쪽 NMOS부터 생각하는 게 가장 쉬워.

NMOS는 지난 Lesson 1에서 배웠듯 **입력이 HIGH(1)이면 ON**이야. 

그런데 NMOS 두 개가 **직렬**로 연결돼 있어.

따라서 GND까지 길이 완전히 열리려면:

> **A = 1 AND B = 1**

둘 다 필요해.

### A=1, B=1

NMOS 두 개 모두 ON.

그러면 OUT이 GND로 연결돼.

→ **OUT = 0**

---

### A=0, B=1이라면?

A쪽 NMOS가 OFF.

직렬 회로 중간이 끊겨버려.

→ GND까지 못 감.

대신 위쪽 PMOS 중 하나가 ON이 되어 OUT을 VDD로 연결해.

→ **OUT = 1**

다른 경우도 마찬가지야.

그래서 결과는:

| A | B | NAND 출력 |
|---:|---:|---:|
| 0 | 0 | **1** |
| 0 | 1 | **1** |
| 1 | 0 | **1** |
| 1 | 1 | **0** |

즉 **둘 다 1일 때만 0**이야. 이것이 NAND야. [CMOS NAND Gate](https://www-inst.eecs.berkeley.edu/~ee290c/sp17/lectures/Lecture22.pdf?utm_source=chatgpt.com)

---

## 4. NAND라는 이름은?

먼저 AND를 보면:

| A | B | AND |
|---:|---:|---:|
| 0 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | **1** |

그런데 이걸 **NOT으로 뒤집으면**:

`AND + NOT = NAND`

그래서:

> **NAND = NOT AND**

야.

---

## 5. 이번에는 NOR

<visual-needed id="visual-013" type="reference-structure" description="트랜지스터와 CMOS: 5. 이번에는 NOR — 원수업 이미지 위치와 주변 설명을 함께 참고" />

NOR는 NAND와 연결 방식이 반대야.

### 위쪽 PMOS
**직렬**

### 아래쪽 NMOS
**병렬**

특히 아래쪽 NMOS를 보자.

NMOS가 병렬이라서 **A 또는 B 중 하나만 1이어도** GND로 가는 길이 열려.

---

## A=1, B=0

A의 NMOS가 ON.

OUT → GND 연결

→ **OUT = 0**

## A=0, B=1

B의 NMOS가 ON.

→ **OUT = 0**

## A=1, B=1

둘 다 ON.

→ 당연히 **OUT = 0**

## 그러면 언제 1일까?

**A=0, B=0**일 때만 NMOS가 전부 OFF야.

반대로 PMOS는 LOW에서 ON이므로 위쪽 PMOS 두 개가 모두 ON.

→ OUT이 VDD에 연결

→ **OUT = 1**

결과:

| A | B | NOR 출력 |
|---:|---:|---:|
| 0 | 0 | **1** |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 0 |

즉:

> **둘 다 0일 때만 1**

---

## 6. NAND와 NOR를 한 번에 정리

| Gate | 언제 출력이 1? |
|---|---|
| **NOT** | 입력이 0일 때 |
| **NAND** | 둘 다 1인 경우를 **제외하고** |
| **NOR** | 둘 다 0일 때만 |

연결 구조도 중요해.

| Gate | NMOS | PMOS |
|---|---|---|
| **NAND** | 직렬 | 병렬 |
| **NOR** | 병렬 | 직렬 |

여기서 외우기보다 원리를 기억해.

> **NMOS는 OUT을 GND로 끌어내리는 쪽.**

그래서 NMOS를 **직렬**로 하면 둘 다 ON이어야 0 → NAND.

NMOS를 **병렬**로 하면 하나만 ON이어도 0 → NOR.

이렇게 생각하면 돼.

---

## 7. 그런데 AND와 OR은 어디 갔지?

재미있는 점이 있어.

CMOS에서는 NAND와 NOR가 아주 자연스럽게 만들어져.

그리고 이미 배운 **Inverter(NOT)**를 뒤에 하나 붙이면:

**NAND → NOT → AND**

**NOR → NOT → OR**

이 돼.

즉 우리가 지금까지 배운 것만으로 이미:

**NOT / AND / OR / NAND / NOR**

를 전부 만들 수 있어.

---

## 8. 왜 이게 중요한가?

여기서 처음으로:

**트랜지스터 → 논리게이트**

연결이 제대로 완성돼.

예를 들어 아주 복잡한 CPU도 밑으로 계속 내려가면 결국:

**CPU의 계산 회로**  
↓  
여러 논리게이트  
↓  
NAND / NOR / NOT 등  
↓  
NMOS + PMOS  
↓  
MOSFET  
↓  
실리콘 위의 실제 소자

라는 계층으로 내려갈 수 있어.

---

## 실제 칩에서는?

실제 설계자가 CPU를 만들면서 매번

“여기 NMOS 2개 직렬로 놓고 PMOS 2개 병렬로…”

라고 직접 그리는 건 아니야.

보통 **Standard Cell(표준 셀)**이라는 미리 설계된 작은 회로 블록을 사용해.

예를 들어:

- `INV` → Inverter
- `NAND2` → 입력 2개 NAND
- `NOR2` → 입력 2개 NOR

같은 셀들이 있고, 설계 도구가 이 셀들을 엄청나게 많이 배치해서 큰 디지털 회로를 만드는 거야.

**Standard Cell = 미리 만들어놓은 논리게이트용 작은 회로 블록**

정도로 지금은 이해하면 충분해.

---

## 9. FAB와 연결하면

설계상으로는 단순히 `NAND2` 하나지만, 실제 웨이퍼에서는 그 안에:

**PMOS 여러 개 + NMOS 여러 개 → Contact → Metal 배선**

이 실제 패턴으로 만들어져.

즉 Module 0에서 배운 Photo/Implant/Deposition/Etch/Metal 공정을 수없이 반복해서 **논리게이트의 물리적 형태**를 만드는 거야.

---

## 오늘 현업 용어 4개

| 용어 | 뜻 |
|---|---|
| **Series** | 직렬 연결. 모두 ON이어야 길이 연결 |
| **Parallel** | 병렬 연결. 하나만 ON이어도 길이 연결 |
| **NAND / NOR** | CMOS의 대표적인 기본 논리게이트 |
| **Standard Cell** | NAND, NOR, INV 등을 미리 설계해 둔 회로 블록 |

---

## 오늘 반드시 기억할 4줄

**① 직렬 = 모두 ON이어야 연결**

**② 병렬 = 하나만 ON이어도 연결**

**③ NAND: NMOS 직렬 / PMOS 병렬**

**④ NOR: NMOS 병렬 / PMOS 직렬**

---

## 🧠 퀴즈

**Q1. NAND에서 A=1, B=1이면 출력은?**

A. 0  
B. 1

**정답: A**

NMOS 두 개가 모두 ON → 직렬 길이가 완전히 열림 → OUT이 GND → 0.

---

**Q2. NOR에서 A=1, B=0이면 출력은?**

A. 0  
B. 1

**정답: A**

NMOS는 병렬이라 A쪽 하나만 ON이어도 OUT이 GND와 연결돼.

---

**Q3. NAND 뒤에 NOT을 하나 붙이면?**

A. AND  
B. OR

**정답: A**

`NOT(NAND) = AND`.

---

다음 수업: [Lesson 4](lesson-04.md).
