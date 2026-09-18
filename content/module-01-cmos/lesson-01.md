---
id: m01-l01
module_id: m01
lesson_number: 1
title: NMOS와 PMOS — 왜 트랜지스터가 두 종류나 필요할까?
estimated_minutes: 12
content_origin: adapted_original
source_url: https://chatgpt.com/share/6aa5302d-67d0-83e9-b0c6-5b4883ef8170
source_message_ids:
- 895d5043-0c5e-4b3a-88dd-1b19adcd98a9
- 76b61170-b9b1-4b6a-a92c-f6dc3b0895bf
- e1b9bfa5-7aad-4da7-a571-e1712d28c8ce
last_updated: '2026-09-12'
kind: lesson
extension_minutes: 5
---

# Lesson 1. NMOS와 PMOS

> 기본 수업과 Quiz 예상 12분. 원수업의 표·그림과 설명을 보존했으며, 뒤의 추가 설명은 별도로 이어 읽을 수 있어요.

## 왜 트랜지스터가 두 종류나 필요할까?

> **편집 보완 — 먼저 쓰는 용어:** VDD는 높은 쪽 전원 전압, GND는 보통 0 V로 잡는 기준점이야. HIGH/LOW는 그 회로에서 높은/낮은 논리 전압 범위를 뜻해. Source와 Drain은 전류 경로의 양쪽 단자, Gate는 그 경로를 제어하는 전극이야. 아래 ON/OFF 표는 일반적인 CMOS 연결에서 정상 논리 입력을 가정해. 실제로는 Gate와 Source 사이 전압 차이가 문턱 조건을 만족해야 해.



오늘은 딱 **두 가지만 확실히 잡으면 돼.**

> **NMOS는 Gate가 HIGH일 때 ON**  
> **PMOS는 Gate가 LOW일 때 ON**

그리고 이 둘을 **서로 보완되게 조합한 것이 CMOS**야. 

---

## 1. NMOS부터

NMOS의 아주 단순한 구조는 이래.

<interactive type="nmos-pmos-channel" />

```text
             Gate
         ─────────────
            절연막

  N+                         N+
Source                     Drain

          P-type Body
```

즉,

**N - P - N**

구조야. Source와 Drain은 N형이고 가운데 Body는 P형이야. 

그런데 처음에는 Source와 Drain 사이가 떨어져 있어.

```text
N          P          N
Source     X        Drain
```

그래서 기본적으로는

**전류가 흐를 길이 없음 → OFF**

이라고 생각하면 돼.

---

## 2. Gate에 +전압을 걸면?

Gate 전압을 높이면 전기장이 생겨.

그러면 **음전하인 전자(e⁻)**가 Gate 아래쪽으로 몰려와.

```text
       Gate + + + + +
            ↓ ↓ ↓ ↓
       ─────────────   ← 절연막
        e⁻ e⁻ e⁻ e⁻

N+ ================= N+
        N-channel
```

원래 P형이던 표면에 전자가 잔뜩 모이면서 **N형처럼 작동하는 길**이 순간적으로 만들어지는 거야.

이 길이 바로 **N-channel**이고,

**N-channel MOSFET → NMOS**

라고 부르는 거야. 

따라서:

```text
Gate LOW
   ↓
Channel 없음
   ↓
NMOS OFF


Gate HIGH
   ↓
전자 모임
   ↓
N-channel 생성
   ↓
NMOS ON
```

### 한 줄 암기
**NMOS = HIGH를 좋아한다.**

---

## 3. PMOS는 반대

PMOS 구조는:

```text
             Gate
         ─────────────
            절연막

  P+                         P+
Source                     Drain

          N-type Body
```

즉,

**P - N - P**

구조야.

이번에는 주요 운반자가 **전자(e⁻)**가 아니라 우리가 전에 배운 **Hole(정공)**이야. 

그리고 동작도 NMOS와 반대야.

```text
Gate HIGH
   ↓
PMOS OFF


Gate LOW
   ↓
PMOS ON
```

### 한 줄 암기
**PMOS = LOW를 좋아한다.**

---

## 4. 여기서 중요한 오해 하나

“PMOS는 Gate 전압을 낮춰야 한다.”

그러면 혹시

> `-1V` 같은 **마이너스 전압**을 넣어야 하나?

아니야.

중요한 건 절대적인 음수 전압이 아니라

**Gate가 Source보다 충분히 낮은가?**

야. 

예를 들어:

```text
PMOS Source = 1V

Gate = 1V
→ 차이가 거의 없음
→ OFF

Gate = 0V
→ Gate가 Source보다 1V 낮음
→ ON
```

그래서 일반적인 디지털 회로에서는 그냥

**0V = LOW**  
**VDD = HIGH**

이 두 전압만으로도 충분해.

---

## 5. NMOS vs PMOS

오늘 가장 중요한 표야.

| Gate 입력 | NMOS | PMOS |
|---|---|---|
| **LOW (0)** | 🔴 OFF | 🟢 ON |
| **HIGH (1)** | 🟢 ON | 🔴 OFF |



이걸 완전히 익혀야 다음 CMOS가 쉬워져.

---

## 6. 그래서 왜 둘을 같이 쓰는데?

둘을 이렇게 연결한다고 해보자.

```text
        VDD (1)
          │
        PMOS
          │
          ├──── OUT
          │
        NMOS
          │
        GND (0)
```

그리고 **PMOS와 NMOS의 Gate에 똑같은 INPUT**을 넣어.

---

### INPUT = 0

```text
PMOS → ON
NMOS → OFF
```

그러면 위쪽 길만 열려.

```text
VDD
 │
PMOS ON
 │
 ├── OUT
 │
NMOS OFF
 X
GND
```

따라서

**OUT = 1**

---

### INPUT = 1

```text
PMOS → OFF
NMOS → ON
```

이번에는 아래쪽 길만 열려.

```text
VDD
 X
PMOS OFF
 │
 ├── OUT
 │
NMOS ON
 │
GND
```

따라서

**OUT = 0**

결국:

```text
INPUT 0 → OUTPUT 1
INPUT 1 → OUTPUT 0
```

입력을 **뒤집었지?**

이게 바로 **NOT Gate(Inverter)**야.  

---

## 7. 이게 바로 CMOS

CMOS의 **C = Complementary**, 즉 **상보적**이라는 뜻이야.

NMOS와 PMOS가:

- 하나가 ON이면 다른 하나는 OFF
- 하나가 OFF면 다른 하나는 ON

처럼 서로 반대로 움직이면서 역할을 보완해.

그래서:

```text
NMOS + PMOS
     ↓
CMOS 회로
     ↓
NOT / AND / OR ...
     ↓
복잡한 논리회로
     ↓
CPU / GPU / SoC
```

로 발전하는 거야. 

여기서 계층도 같이 기억해.

```text
소자
└─ Transistor
    └─ MOSFET
        ├─ NMOS
        └─ PMOS
```

**Gate는 트랜지스터의 일부**이고,  
**CMOS는 트랜지스터 하나의 이름이 아니라 NMOS/PMOS를 조합해서 회로를 만드는 방식**이야. 

---

## 오늘 반드시 기억할 4줄

**① NMOS와 PMOS는 둘 다 MOSFET 트랜지스터다.**  
**② NMOS: Gate HIGH → ON.**  
**③ PMOS: Gate LOW → ON.**  
**④ 둘을 상보적으로 짝지은 것이 CMOS의 핵심이다.** 

### 🧠 확인 퀴즈

**Q1.** Gate가 `HIGH`일 때?

A. NMOS ON / PMOS OFF  
B. NMOS OFF / PMOS ON  
C. 둘 다 ON

**Q2.** PMOS를 켜려면 반드시 `-1V` 같은 음수 전압이 필요하다.

A. 맞다  
B. 아니다

**Q3.** 다음 중 맞는 것은?

A. Gate + Capacitor = NMOS  
B. NMOS와 PMOS는 완전히 다른 종류의 소자다  
C. NMOS와 PMOS는 둘 다 MOSFET이며 둘을 상보적으로 조합해 CMOS 회로를 만든다

## Quiz 정답 및 짧은 해설 — 편집 보완

1. **A.** 일반적인 CMOS 연결에서 HIGH 입력은 NMOS를 켜고 PMOS를 꺼.
2. **B.** 절대적인 음수 전압이 필요한 것이 아니라 Gate가 Source보다 충분히 낮아야 해.
3. **C.** 둘 다 MOSFET이며 상보적으로 조합해 CMOS 회로를 만들어.

## 핵심 용어 — 편집 보완

| 용어 | 뜻 |
|---|---|
| NMOS | 전자 채널을 사용하는 MOSFET |
| PMOS | 정공 채널을 사용하는 MOSFET |
| CMOS | NMOS와 PMOS를 상보적으로 사용하는 회로 방식 |
| VDD / GND | 높은 전원 전압과 기준 전압 |

## 수업 중 추가 설명 — 필요할 때 이어 읽기



**VDD/GND는 내가 먼저 설명했어야 해.** 실제 Lesson 1에서도 `0V와 VDD`를 갑자기 등장시킨 뒤 바로 CMOS 회로에 넣었는데, VDD와 GND 자체를 정의하는 단계가 빠져 있었다. 

### VDD와 GND는 아주 쉽게

CMOS 회로에서는 보통 전압의 **위쪽 기준과 아래쪽 기준** 두 개를 정해놔.

**VDD**는 회로에 공급하는 **높은 쪽 전압**이야. 예를 들어 어떤 칩이 `1V`로 동작한다면 `VDD = 1V`라고 생각하면 돼.

**GND(Ground)**는 전압을 재는 **기준점**, 보통 `0V`야.

그래서 디지털 회로에서는 일단 이렇게 생각하면 충분해.

| 이름 | 예시 | 디지털 의미 |
|---|---:|---|
| **VDD** | 1V | HIGH = 1 |
| **GND** | 0V | LOW = 0 |

즉 CMOS inverter에서 **PMOS는 VDD 쪽에 붙어서 출력에 1을 공급하는 역할**, **NMOS는 GND 쪽에 붙어서 출력을 0으로 끌어내리는 역할**을 해.

이번 Lesson 1에서 실제로 봐야 했던 그림은 이런 종류야.

<visual-needed id="visual-010" type="reference-structure" description="트랜지스터와 CMOS: VDD와 GND는 아주 쉽게 — 원수업 이미지 위치와 주변 설명을 함께 참고" />

첫 그림처럼 **PMOS + NMOS가 실제 실리콘 안에서 어떻게 배치되고 VDD/GND와 연결되는지**, 두 번째처럼 **NMOS/PMOS 내부의 Gate·Source·Drain·N/P 영역이 실제로 어떻게 생겼는지** 보여주는 그림을 쓰는 게 네가 요청했던 방식에 더 맞아.

## 수업 중 추가 설명 — 필요할 때 이어 읽기

아주 쉽게 보면 **PMOS와 NMOS는 출력선을 각각 위쪽 전압과 아래쪽 전압에 연결해주는 스위치**야.

- **PMOS가 ON** → OUT이 **VDD(높은 전압, 1)**에 연결됨 → **출력 1**
- **NMOS가 ON** → OUT이 **GND(0V, 0)**에 연결됨 → **출력 0**

즉,

**PMOS = 출력을 위로 끌어올림(1)**  
**NMOS = 출력을 아래로 끌어내림(0)**

여기서 “공급한다/끌어내린다”는 말은 그냥 **OUT을 VDD 또는 GND와 전기적으로 연결한다**는 뜻이야.

다음 수업: [Lesson 2](lesson-02.md).
