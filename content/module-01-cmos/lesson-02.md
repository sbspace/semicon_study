---
id: m01-l02
module_id: m01
lesson_number: 2
title: CMOS Inverter — 트랜지스터가 어떻게 실제로 0과 1을 만드는가
estimated_minutes: 12
content_origin: adapted_original
source_url: https://chatgpt.com/share/6aa5302d-67d0-83e9-b0c6-5b4883ef8170
source_message_ids:
- 22491a41-91b1-47b6-860d-c7dd185991eb
last_updated: '2026-09-12'
kind: lesson
---

# Module 1 / Lesson 2  
<interactive type="cmos-inverter" />


> 기본 수업과 Quiz 예상 12분. 원수업의 표·그림과 설명을 보존했으며, 뒤의 추가 설명은 별도로 이어 읽을 수 있어요.

## CMOS Inverter — 트랜지스터가 어떻게 실제로 0과 1을 만드는가

지난 Lesson 1에서 배운 핵심은 **NMOS는 HIGH에서 ON, PMOS는 LOW에서 ON**이었어. 

오늘 목표는 하나야.

> **CMOS가 어떻게 출력선을 VDD 또는 GND에 연결해서 실제 `1`과 `0`을 만드는지 이해하기.**

## 1. 먼저 실제 구조를 보자

<visual-needed id="visual-011" type="reference-structure" description="트랜지스터와 CMOS: 1. 먼저 실제 구조를 보자 — 원수업 이미지 위치와 주변 설명을 함께 참고" />

첫 번째 그림이 특히 좋아. **왼쪽은 회로도**, **오른쪽은 같은 회로를 실제 실리콘 단면으로 만든 모습**이야.

중요한 건 PMOS와 NMOS가 따로 노는 게 아니라, **둘의 중간이 하나의 출력(OUT)으로 연결되어 있다는 것**이야.

---

## 2. VDD와 GND부터 다시 확실히

지난번에 이걸 늦게 설명했으니 이번에는 먼저 잡자.

- **VDD** = 높은 쪽 전압. 예: `1 V`
- **GND** = 기준 전압. 보통 `0 V`

그리고 디지털에서는 대략:

| 실제 전압 | 논리값 |
|---|---|
| VDD 근처 | **1 (HIGH)** |
| GND 근처 | **0 (LOW)** |

즉 칩 안에 진짜 `숫자 1`이 흐르는 게 아니야.

> **높은 전압을 1이라고 약속하고, 낮은 전압을 0이라고 약속한 것**이야.

---

## 3. CMOS Inverter의 핵심 구조

PMOS와 NMOS의 Gate에는 **똑같은 INPUT**이 들어가고, 둘의 Drain 쪽은 합쳐져서 **OUT**이 돼.

여기서 **Node(노드)**라는 새 용어 하나만 알아두자.

> **Node = 여러 회로가 연결되어 같은 전압을 갖는 지점**

OUT도 하나의 노드야.

---

## 4. INPUT = 0이면?

Lesson 1을 떠올리면:

**PMOS → ON**  
**NMOS → OFF**

그러면 OUT에서 갈 수 있는 길은 **VDD 쪽만 열린다.**

쉽게 스위치로 생각하면:

**OUT ── 열린 PMOS ── VDD**

그래서 OUT의 전압이 VDD와 거의 같아져.

> **OUT ≈ VDD → 출력 = 1**

이걸 **Pull-up**이라고 해.

**Pull-up = 출력 전압을 높은 쪽(VDD)으로 끌어올리는 것.**

CMOS inverter에서 이 역할을 **PMOS**가 해. [Power Dissipation of a CMOS Inverter - Technical Articles](https://www.allaboutcircuits.com/technical-articles/power-dissipation-of-a-cmos-inverter/?utm_source=chatgpt.com)

---

## 5. INPUT = 1이면?

이번에는 반대야.

**PMOS → OFF**  
**NMOS → ON**

OUT에서 열린 길은 **GND 쪽**이야.

**OUT ── 열린 NMOS ── GND**

그러면 OUT 전압이 0V 근처로 내려가.

> **OUT ≈ GND → 출력 = 0**

이걸 **Pull-down**이라고 해.

**Pull-down = 출력 전압을 낮은 쪽(GND)으로 끌어내리는 것.**

이 역할은 **NMOS**가 해. [Power Dissipation of a CMOS Inverter - Technical Articles](https://www.allaboutcircuits.com/technical-articles/power-dissipation-of-a-cmos-inverter/?utm_source=chatgpt.com)

---

## 6. 그래서 Inverter가 된다

결국 딱 이것뿐이야.

| INPUT | PMOS | NMOS | OUT 연결 | OUTPUT |
|---|---|---|---|---|
| **0** | ON | OFF | VDD | **1** |
| **1** | OFF | ON | GND | **0** |

즉,

**입력 0 → 출력 1**  
**입력 1 → 출력 0**

입력을 반대로 뒤집으니까 **Inverter**, 즉 **NOT Gate**라고 부르는 거야. Lesson 1에서 본 구조가 바로 이 관계였어. 

---

## 7. 한 가지 중요한 직관

CMOS가 `1`과 `0`을 **만드는 기계**라고 생각하면 약간 헷갈릴 수 있어.

더 정확하게는:

> **출력선을 VDD 또는 GND 중 하나에 연결하는 스위치 묶음이다.**

예를 들어 VDD가 1V라면,

**PMOS ON → OUT을 1V에 연결 → 이것을 1이라고 해석**  
**NMOS ON → OUT을 0V에 연결 → 이것을 0이라고 해석**

이렇게 이해하면 돼.

---

## 8. 그런데 VDD에서 GND로 전기가 계속 새지 않나?

여기서 CMOS의 큰 장점이 나와.

정상적으로 입력이 0이나 1에 고정되어 있을 때는:

**PMOS ON이면 NMOS OFF**  
또는  
**NMOS ON이면 PMOS OFF**

라서 이상적으로는

**VDD → PMOS → NMOS → GND**

가 한꺼번에 뚫린 길이 생기지 않아.

그래서 CMOS는 **가만히 있을 때 전력 소모가 매우 작다.**

다만 실제로 `0 ↔ 1`이 바뀌는 순간에는 잠깐 전류가 흐르고, 회로의 작은 capacitance도 충·방전돼. 이게 나중에 배우게 될 **동적 전력(Dynamic Power)**의 핵심이야. [Power Dissipation of a CMOS Inverter - Technical Articles](https://www.allaboutcircuits.com/technical-articles/power-dissipation-of-a-cmos-inverter/?utm_source=chatgpt.com)

---

## 9. 실제 실리콘에서는 어디에 있나?

아까 첫 번째 실제 단면 그림을 다시 떠올려봐.

**NMOS**는 P-type 영역에 만들고,  
**PMOS**는 N-type 영역인 **N-well** 안에 만들어.

여기서 **Well**은 쉽게 말하면:

> 특정 종류의 트랜지스터를 만들기 위해 웨이퍼 안에 따로 만들어 놓은 도핑 영역.

그리고 각각의 Source/Drain을 만든 뒤 **Contact와 Metal 배선**으로 연결해서 INPUT, OUTPUT, VDD, GND를 만든다.

즉 지난 Module 0에서 배운 **도핑 → Photo → Implant → Contact/Metal 배선**이 이제 실제 CMOS 논리회로로 연결되기 시작한 거야. 

---

## 오늘 현업 용어 4개

| 용어 | 아주 쉽게 |
|---|---|
| **Inverter / NOT Gate** | 입력을 반대로 출력하는 회로 |
| **Node** | 같은 전압을 공유하는 연결 지점 |
| **Pull-up** | OUT을 VDD 쪽으로 연결해 1로 만듦 |
| **Pull-down** | OUT을 GND 쪽으로 연결해 0으로 만듦 |

## 오늘 반드시 기억할 3줄

**① 디지털 1/0은 실제로는 높은 전압/낮은 전압이다.**

**② PMOS ON → OUT을 VDD에 연결 → 1**

**③ NMOS ON → OUT을 GND에 연결 → 0**

---

## 🧠 짧은 퀴즈

**Q1. INPUT=0일 때 OUT은 어디와 연결될까?**  
A. VDD  
B. GND

**정답: A.** PMOS가 ON이 되어 OUT을 VDD로 끌어올린다.

**Q2. NMOS가 ON이면 출력은 보통?**  
A. 1  
B. 0

**정답: B.** OUT이 GND와 연결되어 0V 근처가 된다.

**Q3. 디지털 `1`이라는 숫자가 실제로 칩 안을 흐르는가?**  
A. 그렇다  
B. 아니다. 특정 범위의 높은 전압을 1이라고 해석한다.

**정답: B.**

다음 수업: [Lesson 3](lesson-03.md).
