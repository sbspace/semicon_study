---
id: m02-l04
module_id: m02
lesson_number: 4
title: 칩 안에서 신호와 전원은 어떻게 이동할까? — Signal / Clock / VDD / GND
estimated_minutes: 15
content_origin: adapted_original
source_url: https://chatgpt.com/share/6aa5303e-8a2c-83ee-8693-21afceb6bd01
source_message_ids:
- 649f56b8-b547-4e41-aeda-caa210063305
last_updated: '2026-09-12'
kind: lesson
---

# Module 2 / Lesson 4  

> 기본 수업과 Quiz 예상 15분. 원수업의 표·그림과 설명을 보존했으며, 뒤의 추가 설명은 별도로 이어 읽을 수 있어요.

## 칩 안에서 신호와 전원은 어떻게 이동할까? — Signal / Clock / VDD / GND

### 핵심 목표

지난 Lesson 3에서 배운 Metal Layer를 다시 떠올려보자.

<interactive type="signal-clock-pdn" />

```text
M6  ═══════════════
M5  ═══════════════
M4  ═══════════════
...
M1  ═══════════════
       │
    MOSFET
```

그런데 이 금속선들이 **전부 같은 일을 하는 게 아니야.**

오늘은 크게 세 종류로 나눠보자.

> **① Signal = 정보 전달**  
> **② Clock = 회로 전체의 타이밍 전달**  
> **③ VDD / GND = 회로가 동작할 전원 공급**

실제 칩에서는 이 세 종류의 연결망이 같은 BEOL 공간을 함께 사용한다. imec도 전통적인 칩에서 **Power Delivery Network와 Signal Network가 BEOL 배선 공간을 공유한다**고 설명한다. [Backside power delivery | imec](https://www.imec-int.com/en/articles/how-power-chips-backside?utm_source=chatgpt.com)

---

## 1. Signal — 실제 `0`과 `1`을 전달하는 길

먼저 가장 직관적인 **Signal(신호)**부터 보자.

Signal은:

> **회로와 회로 사이에서 정보를 전달하는 전압 변화**

야.

예를 들어 Module 1에서 배운 NOT Gate 두 개를 연결했다고 하자.

```text
Input
  │
  ↓
[NOT 1] ────── [NOT 2]
          ↑
        Signal
```

첫 번째 NOT의 출력이 두 번째 NOT의 입력으로 전달돼야 하지.

그 연결을 실제 칩에서는 **Metal 배선**이 해.

### 예를 들어

```text
첫 번째 회로 OUT = HIGH
        │
        │ Metal
        ↓
두 번째 회로 IN = HIGH
```

즉 배선은 단순한 쇳덩어리가 아니라,

> **0과 1이라는 정보를 물리적으로 전달하는 통로**

인 거야.

---

## 2. Signal은 사실 전자가 칩 끝까지 달려가는 걸까?

여기서 조금 정확하게 이해해보자.

우리가 흔히:

```text
0 ───→ 1
```

이라고 표현하지만, 디지털 회로가 실제로 전달하는 것은 **전압 상태**야.

예를 들어 아주 단순화해서:

```text
0 V     → LOW
0.8 V   → HIGH
```

라고 약속할 수 있어.

앞 회로가 배선의 전압을 올리거나 내리고,

그 전압을 다음 transistor의 **Gate가 읽는 것**이야.

```text
회로 A
   │
   │ Metal의 전압 변화
   ↓
Gate
┌─────┐
│MOSFET
└─────┘
회로 B
```

그래서 Module 1에서 배웠던:

> **Gate의 전압으로 MOSFET을 ON/OFF한다**

가 다시 등장해.

---

## 3. Clock — 특별한 Signal

이번에는 **Clock**이야.

Clock도 본질적으로는 Signal이지만 매우 특별한 역할을 한다.

Module 1에서 Flip-Flop과 Register를 배울 때 봤지.

```text
Clock

1 ──┐   ┌───┐   ┌───
    │   │   │   │
0   └───┘   └───┘
```

Clock은:

> **“지금 데이터를 받아!”라는 타이밍 기준을 회로 전체에 전달하는 신호**

야.

예를 들어 CPU에 수많은 Flip-Flop이 있다고 하자.

```text
              Clock
                │
        ┌───────┼───────┐
        │       │       │
        ↓       ↓       ↓
      [FF]    [FF]    [FF]
```

모두 비슷한 시점에 Clock을 받아야 해.

---

## 4. 그런데 Clock 선 하나로 연결하면 안 되나?

칩이 작다면 단순하게 생각할 수 있지만 CPU처럼 큰 칩에서는 문제가 생겨.

예를 들어:

```text
Clock ── [FF1]

      └──────────────────── [FF2]
```

FF1은 Clock source와 가깝고,

FF2는 아주 멀리 있다고 하자.

배선에는 **저항과 capacitance**가 있기 때문에 신호 전달에는 시간이 걸려.

그러면:

```text
FF1 Clock 도착 : 10.000 ns
FF2 Clock 도착 : 10.050 ns
```

처럼 차이가 생길 수 있어.

이 차이를:

## `Clock Skew`

라고 해.

> **Clock Skew = 같은 Clock이 서로 다른 회로에 도착하는 시간 차이**

야.

---

## 5. 그래서 `Clock Tree`를 만든다

Clock을 칩 전체에 그냥 한 줄로 연결하지 않고 나뭇가지처럼 분배한다.

```text
                 Clock
                   │
             ┌─────┴─────┐
             │           │
          ┌──┴──┐     ┌──┴──┐
          │     │     │     │
          ↓     ↓     ↓     ↓
         FF    FF    FF    FF
```

이것을:

## `Clock Tree`

라고 해.

가능하면 각 목적지까지의 Clock 경로를 균형 있게 만들어 **Clock Skew를 줄이는 것**이 중요해.

Intel도 실제 clock network를 여러 목적지까지 균형 있게 배분하는 **skew-balanced clock tree**로 설명하며, 거리가 길어질수록 delay와 skew 문제가 커질 수 있다고 설명한다. [2.1.1.3. Programmable Clock Routing](https://www.intel.com/content/www/us/en/docs/programmable/683761/23-1/programmable-clock-routing.html?utm_source=chatgpt.com)

쉽게 말하면:

> **Clock Tree = 수많은 회로가 비슷한 시간에 출발 신호를 받을 수 있도록 만든 타이밍 배달망**

이야.

---

## 6. VDD와 GND — 정보가 아니라 `전력`을 운반한다

Module 1의 CMOS inverter를 다시 가져와보자.

```text
        VDD
         │
       PMOS
         │
        OUT
         │
       NMOS
         │
        GND
```

VDD와 GND가 있었지.

### VDD

> **회로에 전력을 공급하는 높은 전압 쪽**

### GND

> **회로의 기준이 되는 낮은 전압 쪽**

이야.

CMOS에서는 `VSS`라는 표현도 많이 쓰는데 지금 단계에서는:

```text
VDD ≈ 전원 쪽
VSS ≈ GND 쪽
```

정도로 이해하면 돼.

---

## 7. 왜 전원도 Metal Layer를 통해 공급할까?

칩 안에는 transistor가 엄청나게 많아.

모든 transistor와 Standard Cell에:

```text
VDD
GND
```

를 공급해야 해.

그러니 이런 식으로 한 줄만 내려보낼 수는 없어.

```text
VDD ─────────────────── 모든 회로
```

대신 칩 전체에 거대한 전원망을 만든다.

이를:

## `PDN — Power Delivery Network`

이라고 한다.

> **PDN = 칩 전체에 VDD와 GND를 공급하는 금속 배선 네트워크**

야.

매우 단순화하면:

```text
        VDD 큰 배선
════════════════════════
 │       │       │
 │       │       │
══════  ══════  ══════
 │       │       │
 ↓       ↓       ↓
Cell    Cell    Cell

 ↑       ↑       ↑
────────────────────────
        GND망
```

이라고 생각하면 돼.

---

## 8. 왜 Power 배선은 굵게 만드는 경우가 많을까?

여기서 전기 기초와 다시 연결된다.

Module 0에서:

> **전류가 흐르는 실제 배선에는 저항이 있다**

고 배웠지.

전원 배선도 저항 `R`을 가진다.

그리고 전류 `I`가 흐르면:

```text
V = I × R
```

만큼 전압이 떨어질 수 있어.

이걸 칩 전원에서는 흔히:

## `IR Drop`

이라고 부른다.

예를 들어 전원에서:

```text
VDD = 0.8 V
```

를 공급했는데,

긴 배선을 지나면서:

```text
0.8 V
 ↓
전원 배선
 ↓
0.74 V
```

밖에 도착하지 않는다면 문제가 될 수 있겠지.

---

## 9. 그래서 위쪽 Metal이 전원망에 유리하다

지난 Lesson에서 위쪽 Metal은 상대적으로 **더 넓고 굵은 배선**을 사용할 수 있다고 했지.

```text
Upper Metal ═════════════════════  굵음

           ═════════════

M2          ────────

M1           ────                  촘촘
```

굵은 금속선은 일반적으로 저항을 낮추는 데 유리해.

그래서 큰 전류를 공급하는 VDD/GND 배선에서는 **상부의 굵은 Metal Layer를 적극적으로 사용하는 것**이 중요해.

그리고 아래로 내려오면서:

```text
상부 Power Metal
       │
      Via
       ↓
중간 Metal
       │
      Via
       ↓
Local Power Rail
       │
Standard Cell
       ↓
MOSFET
```

처럼 전원을 분배한다.

imec는 전통적인 frontside PDN에서 전원이 BEOL의 여러 Metal/Via를 거쳐 transistor까지 내려가며, 첨단 공정에서는 이 과정의 저항과 IR drop이 중요한 문제가 된다고 설명한다. [Backside power delivery | imec](https://www.imec-int.com/en/articles/how-power-chips-backside?utm_source=chatgpt.com)

---

## 10. 그러면 Metal Layer에 뭐가 같이 있는 거야?

오늘 배운 것을 하나의 단면으로 합쳐보자.

```text
          Upper Metal
══════════════════════════
   VDD / GND 큰 전원망
══════════════════════════

──── Clock ───────────────
       │
       ├─────────
       │    └────────

── Signal ──── Signal ────

────── M1 / Local Wiring ──
     │     │      │
  Contact Contact Contact
     │     │      │
   MOSFET MOSFET MOSFET
──────────────────────────
          Silicon
```

실제 구조가 이렇게 깔끔하게 역할별로 한 층씩 분리된다는 뜻은 아니야.

중요한 것은:

> **BEOL이라는 한정된 공간 안에서 Signal, Clock, Power가 서로 배선 자리를 차지한다**

는 거야.

그래서 배선 공간이 부족해지는 **Routing Congestion**도 실제 칩 설계의 중요한 문제가 된다.

imec는 첨단 칩에서 power interconnect만으로도 상당한 routing resource를 사용하기 때문에 signal 배선과 경쟁한다고 설명한다. [Backside power delivery | imec](https://www.imec-int.com/en/articles/how-power-chips-backside?utm_source=chatgpt.com)

---

## 11. CPU가 빨라질수록 Clock도 빨라지는 건가?

대체로 CPU의 `3 GHz`, `4 GHz` 같은 숫자를 본 적 있을 거야.

예를 들어:

```text
4 GHz
```

는 Clock이 초당 약:

```text
4,000,000,000번
```

주기를 가진다는 뜻이야.

그러면 한 주기는 약:

```text
0.25 ns
```

밖에 안 돼.

그 짧은 시간 안에:

```text
Clock
 ↓
Flip-Flop
 ↓
Logic 계산
 ↓
Signal 전달
 ↓
다음 Flip-Flop
```

이 이루어져야 해.

그래서 CPU 성능은 단순히:

> **“트랜지스터가 빠르면 끝”**

이 아니야.

**배선 지연과 Clock 분배도 매우 중요해진다.**

---

## 12. 여기서 첨단 공정의 방향이 하나 보인다

지금까지는 전원과 Signal이 모두 transistor **위쪽 BEOL**을 사용한다고 배웠어.

그런데 첨단 공정에서는:

```text
위쪽 → Signal
         
Transistor

아래쪽 → Power
```

처럼 **전원을 wafer 뒷면에서 공급하는 기술**도 개발되고 있어.

이게 **Backside Power Delivery**야.

imec가 연구 중인 방식도 power network를 wafer backside로 옮겨 Signal과 Power의 배선 경쟁을 줄이고 IR drop을 개선하려는 접근이다. [Backside power delivery | imec](https://www.imec-int.com/en/articles/how-power-chips-backside?utm_source=chatgpt.com)

지금 자세히 알 필요는 없어.

이건 **Module 5 — 첨단 공정**에서 다시 제대로 만나게 될 거야.

지금은:

> **“Signal하고 Power가 배선 자리를 서로 차지하니까, 아예 Power를 뒤쪽으로 보내려는 기술도 있구나.”**

정도만 기억하면 충분해.

---

## 핵심 용어 4개

| 용어 | 지금 이해할 뜻 |
|---|---|
| **Signal** | 0/1 등의 정보를 전달하는 전압 변화 |
| **Clock Tree** | Clock을 칩 곳곳에 비슷한 타이밍으로 전달하는 배선망 |
| **PDN** | VDD/GND를 칩 전체에 공급하는 전원 배선망 |
| **IR Drop** | 배선 저항 때문에 공급 전압이 이동 중 낮아지는 현상 |

---

## 실제 칩 + 이전 수업 연결

지금까지 배운 칩 구조를 한 번에 합쳐보자.

```text
                 CHIP

          ┌──────────────┐
          │ VDD/GND PDN  │
          ├──────────────┤
 BEOL →   │ Clock Network│
          │ Signal Wiring│
          ├──────────────┤
 MOL  →   │   Contact    │
          ├──────────────┤
 FEOL →   │ NMOS / PMOS  │
          └──────────────┘
               Silicon
```

그리고 위에서 보면:

```text
┌────────────────────────────┐
│ Core │ Core │ Cache │ I/O │ ← Floorplan
└────────────────────────────┘
```

인 거야.

즉 **Floorplan과 Metal Layer는 서로 별개의 칩이 아니라 같은 칩을 다른 방향/배율에서 보는 것**이야.

---

## 오늘의 짧은 요약

**① Signal 배선은 실제 0/1 정보를 전달한다.**

**② Clock은 수많은 Flip-Flop에 타이밍 기준을 전달하며, 도착시간 차이인 Clock Skew를 줄이는 게 중요하다.**

**③ VDD/GND는 PDN이라는 거대한 전원망을 통해 칩 전체로 공급된다.**

**④ 첨단 칩에서는 transistor만큼 배선의 지연·저항·전원 공급이 중요하다.**

---

## 🧠 퀴즈

### Q1

Clock Tree의 가장 중요한 목적은?

A. DRAM에 데이터를 저장하기 위해  
B. 여러 회로에 Clock을 가능한 균형 있게 전달하기 위해  
C. MOSFET을 제조하기 위해

**정답: B**

수많은 Flip-Flop에 Clock이 너무 다른 시간에 도착하지 않도록 분배하는 것이 핵심이야.

---

### Q2

`PDN`은 무엇일까?

A. CPU 명령을 계산하는 회로  
B. VDD/GND를 칩 전체에 공급하는 전원망  
C. MOSFET의 Channel

**정답: B**

`Power Delivery Network`의 약자로, **칩 내부의 전력 공급 도로망**이라고 보면 돼.

---

### Q3

IR Drop이 커지면 어떤 문제가 생길까?

A. transistor까지 도착하는 VDD가 원래보다 낮아질 수 있다.  
B. Die 크기가 자동으로 커진다.  
C. SRAM이 DRAM으로 변한다.

**정답: A**

배선에도 저항이 있으므로 많은 전류가 흐르면 `V = IR`만큼 전압 손실이 발생할 수 있어.

---

다음 수업: [Lesson 5](lesson-05.md).
