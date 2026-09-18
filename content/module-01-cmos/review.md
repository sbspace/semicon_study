---
id: m01-review
module_id: m01
title: 트랜지스터와 CMOS 전체 복습
estimated_minutes: 15
content_origin: adapted_original
source_url: https://chatgpt.com/share/6aa5302d-67d0-83e9-b0c6-5b4883ef8170
source_message_ids:
- 1ff42d19-088a-4100-9cf5-da4450b1f6b1
last_updated: '2026-09-12'
kind: review
---

# Module 1 전체 복습  
## 트랜지스터 → CMOS → 논리 → 계산 → 저장

Module 1의 핵심을 한 문장으로 압축하면:

> **MOSFET이라는 작은 스위치를 NMOS/PMOS로 만들고 → 이를 조합해 CMOS 논리회로를 만들고 → 더 조합하면 CPU의 계산과 저장 기능이 된다.**

---

## 1. Lesson 1~7 전체 지도

| Lesson | 핵심 |
|---|---|
| **1. NMOS / PMOS** | MOSFET이라는 스위치의 두 종류 |
| **2. CMOS Inverter** | PMOS+NMOS로 0↔1을 뒤집음 |
| **3. NAND / NOR** | MOSFET 여러 개로 복잡한 논리 판단 |
| **4. Half Adder** | XOR+AND로 1-bit 덧셈 |
| **5. Full Adder** | Carry까지 받아 여러 자리 덧셈 |
| **6. Flip-Flop / Register** | 계산 결과를 Clock에 맞춰 기억 |
| **7. SRAM 6T** | 6개 MOSFET으로 1 bit 저장 |

---

## 2. 가장 중요한 계층부터

이건 앞으로 계속 나와.

```text
소자(Device)
   ↓
트랜지스터
   ↓
MOSFET 1개
   ↓
NMOS 또는 PMOS
```

즉 **MOSFET 하나 = 트랜지스터 하나**야.

그리고 NMOS와 PMOS는 서로 전혀 다른 계층의 물건이 아니라 **MOSFET의 두 종류**야. 자료에서도 NMOS와 PMOS 모두 MOSFET이며, NMOS는 Gate HIGH에서 ON, PMOS는 Gate LOW에서 ON으로 정리했어. 

또 하나:

> **Gate는 MOSFET 안에 들어있는 구성 요소**

야.

`Gate = 트랜지스터`가 아니야. Source, Drain과 함께 MOSFET을 구성해. 

---

## 3. NMOS와 PMOS

이 표는 거의 암기해도 좋아.

| Gate 입력 | NMOS | PMOS |
|---|---|---|
| **0 / LOW** | OFF | **ON** |
| **1 / HIGH** | **ON** | OFF |

자료의 표현대로:

> **NMOS는 HIGH를 좋아하고, PMOS는 LOW를 좋아한다.** 

### NMOS

Gate 전압을 높이면 Gate 아래에 전자가 모여 **N-channel**이 만들어지고 Source와 Drain 사이가 연결돼. 

### PMOS

반대로 Gate가 Source보다 충분히 낮으면 ON돼.

여기서 주의:

**PMOS에 반드시 음수 전압을 넣는 게 아니다.**

예를 들어 Source=1V라면 Gate=0V만 되어도 충분히 낮기 때문에 ON될 수 있어. 

---

## 4. CMOS Inverter

먼저:

- **VDD** = 높은 전압 쪽 → 논리 `1`
- **GND** = 0V 기준 → 논리 `0`

그리고:

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

PMOS 1개 + NMOS 1개니까:

> **CMOS Inverter = 2T**

여기서 `T = Transistor`.

### INPUT = 0

PMOS ON  
NMOS OFF

→ OUT이 VDD와 연결  
→ **OUT = 1**

### INPUT = 1

PMOS OFF  
NMOS ON

→ OUT이 GND와 연결  
→ **OUT = 0**

그래서:

```text
0 → 1
1 → 0
```

즉 **NOT Gate = Inverter**야. 

그리고 중요한 구분:

> **CMOS는 트랜지스터 하나의 이름이 아니다.**

NMOS와 PMOS를 **상보적으로 조합해 회로를 만드는 방식**이야. 

---

## 5. NAND / NOR

새로운 원리는 사실 두 개뿐이었어.

### 직렬

```text
A ─ B
```

둘 다 ON이어야 길이 열림.

→ **AND 느낌**

### 병렬

```text
├─ A ─┤
├─ B ─┤
```

하나만 ON이어도 길이 열림.

→ **OR 느낌**

그래서 CMOS에서:

| Gate | NMOS | PMOS |
|---|---|---|
| **NAND** | 직렬 | 병렬 |
| **NOR** | 병렬 | 직렬 |

### NAND

**둘 다 1일 때만 0**

### NOR

**둘 다 0일 때만 1**

그리고 실제 칩 설계에서는 이런 회로를 매번 직접 그리기보다 `NAND2`, `NOR2`, `INV` 같은 **Standard Cell** 형태로 사용한다고 배웠지.

---

## 6. 논리게이트 → 덧셈

여기서 CPU 계산으로 연결됐어.

## Half Adder

2진수에서는:

```text
1 + 1 = 10
```

여기서:

- 오른쪽 `0` = **Sum**
- 왼쪽 `1` = **Carry**

그리고 아주 절묘하게:

### XOR

두 입력이 다르면 1.

→ **Sum 계산**

### AND

둘 다 1이면 1.

→ **Carry 계산**

따라서:

> **XOR + AND = Half Adder**

---

## 7. Full Adder

Half Adder의 문제:

앞자리에서 넘어온 Carry를 못 받음.

그래서 Full Adder에는 입력이 3개야.

- A
- B
- **Cin = Carry In**

출력은:

- **Sum**
- **Cout = Carry Out**

즉:

> **A + B + Cin**

을 계산해.

그리고:

```text
Full Adder
   ↓ Cout
Full Adder
   ↓ Cout
Full Adder
```

처럼 연결하면 여러 bit 숫자를 더할 수 있어.

이런 단순 구조가 **Ripple Carry Adder**였어.

---

## 8. 여기까지는 '계산'만 했다

여기서 중요한 분기점이 생겨.

### Combinational Logic

> 현재 입력만 가지고 출력 계산

예:

- AND
- XOR
- Adder

### Sequential Logic

> 이전 값을 기억하면서 동작

여기서 등장한 게 **Flip-Flop**이야.

---

## 9. Clock / Flip-Flop / Register

## Clock

CPU 회로가 움직이는 공통 **박자 신호**.

```text
0 → 1 → 0 → 1 → 0 → 1
```

그리고 `0 → 1` 같은 변화 순간을 **Edge**라고 해.

---

## D Flip-Flop

아주 쉽게:

> **Clock Edge가 오는 순간 D에 있는 값을 찍어서 Q에 저장**

한다.

### DFF 1개

→ **1 bit 저장**

### DFF 여러 개

→ **Register**

예:

```text
DFF DFF DFF DFF DFF DFF DFF DFF
 ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓
        8-bit Register
```

그래서 CPU는 대략:

> **계산 → Register 저장 → 계산 → Register 저장**

을 Clock에 맞춰 반복한다고 이해했어.

---

## 10. SRAM 6T

여기가 방금 질문했던 부분이야.

정확히 다시 잡자.

## MOSFET 1개

= **1T**

## CMOS Inverter 1개

```text
PMOS 1개
+
NMOS 1개
```

= **2T**

## SRAM Cell 1개

```text
Inverter 2개 = 4T
+
Access Transistor 2개 = 2T
────────────────────
총 6T
```

즉:

> **6T = 트랜지스터 6개**

야.

그리고 Inverter는 **3개가 아니라 2개** 들어가.

---

## 왜 Inverter 2개가 기억하지?

두 Inverter를 서로 연결해.

### Cross-coupled

한쪽 출력이 다른 쪽 입력으로 들어가고, 다시 반대로 돌아오는 구조.

예:

```text
Q = 1
↓
반대쪽 = 0
↓
그 0이 다시 반대쪽 Inverter로 들어감
↓
Q = 1 유지
```

그래서 안정적인 두 상태가 존재해.

```text
Q=1 / Q̅=0

또는

Q=0 / Q̅=1
```

이걸 이용해서 **1 bit**를 기억해.

---

## 11. Cell이 정확히 뭐였지?

이것도 확실히.

> **SRAM Cell = SRAM에서 1 bit를 저장하는 최소 단위**

야.

즉:

```text
6T SRAM Cell 1개
↓
1 bit

Cell 수백만 개
↓
SRAM Array

SRAM Array + 읽기/쓰기 회로
↓
큰 SRAM

↓
CPU Cache
```

그러니까:

**Cell 하나 = SRAM 전체**

가 아니야.

아파트로 비유하면:

- SRAM Cell = 방 하나
- SRAM Array = 방이 수없이 모인 건물
- Cache = 그 건물 전체를 이용한 저장 공간

정도로 보면 돼.

---

## 12. Register와 SRAM의 차이

둘 다 0/1을 저장해서 헷갈리기 좋아.

| | Register | SRAM |
|---|---|---|
| 기본 저장 구조 | Flip-Flop | 6T SRAM Cell |
| 1 bit | DFF 하나 | 6 MOSFET |
| Clock | 직접 중요 | Cell 자체는 Clock 없이 상태 유지 |
| 장점 | 매우 빠른 제어/상태 저장 | 많은 bit를 조밀하게 저장 |
| 대표 위치 | CPU 계산 바로 주변 | CPU Cache |

**둘 다 결국 CMOS/MOSFET으로 만들어진다**는 건 동일해.

---

## 13. Module 1 전체를 한 줄로 연결하면

이게 가장 중요해.

```text
MOSFET
│
├─ NMOS
└─ PMOS
      ↓
CMOS 회로
      ↓
Inverter / NAND / NOR / XOR...
      ↓
   ┌───────────────┬────────────────┐
   ↓               ↓
계산 회로          저장 회로
   ↓               ↓
Adder          Flip-Flop / SRAM
   ↓               ↓
ALU          Register / Cache
   └───────────────┬────────────────┘
                   ↓
              CPU / GPU / SoC
```

Module 1에서 배운 건 결국:

> **“트랜지스터가 어떻게 CPU의 기능으로 커지는가”**

였어.

---

## 14. FAB 관점 연결

이 모든 회로도 그림은 설계 관점이고, 실제 웨이퍼에서는 결국:

```text
원하는 위치 결정
→ Lithography

N/P 영역 형성
→ Ion Implantation

Gate / 절연막 등 형성

Contact 형성

Metal 배선으로
트랜지스터끼리 연결
```

해야 실제 CMOS 회로가 돼.

자료에서도 한 Die 안에 NMOS/PMOS를 만들기 위해 Lithography로 위치를 정하고 Implant로 영역별 Doping을 하는 흐름을 설명했어. 

즉:

> **공정은 트랜지스터를 만들고, 배선은 그 트랜지스터들을 연결해서 논리회로로 만든다.**

라고 보면 좋아.

---

## ⚠️ Module 1에서 특히 헷갈리기 쉬운 것

### ① MOSFET과 CMOS

**MOSFET = 트랜지스터 한 개**

**CMOS = NMOS/PMOS를 조합하는 회로 방식**

---

### ② Gate와 Logic Gate

이름이 같아서 조심.

**MOSFET의 Gate**
→ Source/Drain과 함께 있는 물리적 전극

**Logic Gate**
→ AND/NAND/XOR 같은 논리회로

완전히 다른 의미야.

---

### ③ 0과 1

칩 안에 숫자 `0`, `1`이 들어있는 게 아니야.

> **낮은 전압을 0, 높은 전압을 1이라고 해석하는 것.**

---

### ④ Inverter와 SRAM 6T

```text
Inverter 1개 = 2T

Inverter 2개 = 4T
+
Access 2T
=
6T SRAM Cell
```

---

### ⑤ Cell과 SRAM

**Cell = 1 bit 저장 단위**

수많은 Cell이 모여 SRAM이 돼.

---

## 🧠 Module 1 누적 퀴즈

### Q1
NMOS와 PMOS는 무엇의 두 종류일까?

A. Capacitor  
B. MOSFET  
C. SRAM

**정답: B**

---

### Q2
Gate=HIGH일 때 일반적인 CMOS에서?

A. NMOS ON / PMOS OFF  
B. NMOS OFF / PMOS ON

**정답: A**

---

### Q3
CMOS Inverter 하나에는 기본적으로 몇 개의 MOSFET이 필요한가?

A. 1개  
B. 2개  
C. 6개

**정답: B — NMOS 1 + PMOS 1**

---

### Q4
Half Adder에서 Sum을 만드는 Gate는?

A. XOR  
B. AND

**정답: A**

AND는 Carry를 만든다.

---

### Q5
Full Adder가 Half Adder보다 추가로 받는 입력은?

A. Clock  
B. Carry In  
C. VDD

**정답: B**

---

### Q6
D Flip-Flop 하나가 기본적으로 저장하는 양은?

A. 1 bit  
B. 1 byte  
C. 6 bit

**정답: A**

---

### Q7
6T SRAM Cell에서 Inverter는 몇 개?

A. 1개  
B. 2개  
C. 3개

**정답: B**

`2 inverter = 4T`, Access 2T를 더해서 총 6T.

---

### Q8
SRAM Cell 하나는 보통 몇 bit를 저장할까?

A. 1 bit  
B. 6 bit

**정답: A**

---

> **편집 보완:** Register 비교표는 DFF 기반 기본 구현을 설명한 것이며 실제 register file에는 전용 메모리 구조도 쓰여. SRAM Cell의 상태 유지는 전원이 공급되는 동안을 전제로 해.

다음 Module에서는 회로의 계층, 다이 내부 배선, 외부 연결을 이해한다.
