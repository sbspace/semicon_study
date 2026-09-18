---
id: m01-l05
module_id: m01
lesson_number: 5
title: Full Adder와 여러 비트 덧셈 — CPU는 큰 숫자를 어떻게 더할까?
estimated_minutes: 12
content_origin: adapted_original
source_url: https://chatgpt.com/share/6aa5302d-67d0-83e9-b0c6-5b4883ef8170
source_message_ids:
- 32ade514-89df-4f2c-8c5f-10979d77e795
last_updated: '2026-09-12'
kind: lesson
---

# Module 1 / Lesson 5  
<interactive type="full-adder" />


> 기본 수업과 Quiz 예상 12분. 원수업의 표·그림과 설명을 보존했으며, 뒤의 추가 설명은 별도로 이어 읽을 수 있어요.

## Full Adder와 여러 비트 덧셈 — CPU는 큰 숫자를 어떻게 더할까?

지난 Lesson 4에서는:

> **XOR → Sum(현재 자리)**  
> **AND → Carry(올림수)**

를 이용해서 **Half Adder**를 만들었어.

오늘 목표는 하나야.

> **앞자리에서 넘어온 Carry까지 받아서 여러 자리 숫자를 더하는 방법을 이해하기.**

이번 주제도 3D 소자 구조보다는 **논리게이트가 어떻게 연결되는지**가 핵심이야.

---

## 1. Half Adder의 문제가 뭐였지?

Half Adder의 입력은 두 개뿐이야.

**A, B**

예를 들어 맨 오른쪽 자리에서:

`1 + 1 = 10`

이면

- Sum = 0
- Carry = 1

이 되지.

그런데 **다음 자리**에서는 원래 숫자 두 개뿐 아니라, 앞에서 넘어온 Carry도 더해야 해.

즉:

> **A + B + 이전 자리 Carry**

세 개를 더해야 해.

Half Adder는 이 세 번째 입력을 받을 수 없어.

---

## 2. 그래서 Full Adder

새 용어 하나.

**Cin = Carry In**

> 이전 자리에서 넘어온 Carry.

그리고:

**Cout = Carry Out**

> 계산 후 다음 자리로 넘겨줄 Carry.

그래서 Full Adder는:

### 입력 3개
**A, B, Cin**

### 출력 2개
**Sum, Cout**

을 가져. [Ripple-carry Adder – Clayton Cafiero](https://www.uvm.edu/~cbcafier/cs2210/content/05_cpu_alu/ripple_carry_adder.html?utm_source=chatgpt.com)

<visual-needed id="visual-015" type="reference-structure" description="트랜지스터와 CMOS: 출력 2개 — 원수업 이미지 위치와 주변 설명을 함께 참고" />

첫 그림이 **1-bit Full Adder**, 두 번째가 이런 Full Adder들을 여러 개 연결한 모습이야.

---

## 3. 가장 쉬운 예: 1 + 1 + Carry 1

입력이:

- A = 1
- B = 1
- Cin = 1

이라고 해보자.

즉 실제 계산은:

**1 + 1 + 1 = 3**

2진수에서 3은:

**11**

이야.

따라서:

- **Sum = 1**
- **Cout = 1**

이 된다.

Full Adder의 전체 동작은 이렇게 돼.

| A | B | Cin | Cout | Sum |
|---:|---:|---:|---:|---:|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 0 | 1 |
| 0 | 1 | 0 | 0 | 1 |
| 0 | 1 | 1 | 1 | 0 |
| 1 | 0 | 0 | 0 | 1 |
| 1 | 0 | 1 | 1 | 0 |
| 1 | 1 | 0 | 1 | 0 |
| 1 | 1 | 1 | 1 | 1 |

[<visual_element id="e1">](https://www.ece.uvic.ca/~fayez/courses/ceng465/lab_465/project1/adders.pdf?utm_source=chatgpt.com)

표를 외울 필요는 전혀 없어.

그냥:

> **A + B + Cin을 계산해서 현재 자리는 Sum, 넘치는 자리는 Cout**

이라고 이해하면 돼.

---

## 4. Full Adder 안에는 뭐가 있을까?

사실 Lesson 4의 Half Adder를 재활용할 수 있어.

**Half Adder 2개 + OR Gate 1개**

를 조합하면 Full Adder를 만들 수 있어. [Ripple-carry Adder – Clayton Cafiero](https://www.uvm.edu/~cbcafier/cs2210/content/05_cpu_alu/ripple_carry_adder.html?utm_source=chatgpt.com)

핵심 흐름만 보면:

**A + B 계산**  
↓  
그 결과에 **Cin까지 계산**  
↓  
발생한 Carry들을 합침  
↓  
**Sum + Cout**

즉 새로운 마법의 소자가 등장한 게 아니라,

> **이미 배운 작은 논리회로들을 더 크게 조립한 것**

이야.

이 사고방식이 중요해.

---

## 5. 이제 여러 자리 숫자를 더해보자

예를 들어:

**0101₂ + 0011₂**

를 계산해보자.

10진수로는 `5 + 3 = 8`이니까 답은:

**1000₂**

가 되어야 해.

Full Adder를 오른쪽 자리부터 하나씩 사용한다.

### 가장 오른쪽

`1 + 1`

→ `10`

따라서:

**Sum = 0**  
**Carry = 1**

---

### 그다음 자리

원래 숫자는:

`0 + 1`

인데 앞에서 Carry `1`이 왔어.

따라서:

`0 + 1 + 1 = 10`

→ Sum 0 / Carry 1

---

### 그다음

`1 + 0 + 1 = 10`

→ Sum 0 / Carry 1

---

### 마지막

`0 + 0 + 1 = 1`

→ Sum 1

모으면:

> **1000**

정확히 `8`이 나와.

---

## 6. Full Adder를 옆으로 계속 연결하면?

각 자리의:

**Cout → 다음 자리 Cin**

으로 연결하면 돼.

그래서:

**1-bit Full Adder**  
× 여러 개  
↓  
**4-bit / 8-bit / 32-bit / 64-bit Adder**

를 만들 수 있어.

이렇게 Carry가 옆 자리로 **차례차례 전달되는 구조**를:

## Ripple Carry Adder

라고 해.

Ripple은 물결이 옆으로 퍼져가는 모습이라는 뜻이야.

> Carry가 `1번째 자리 → 2번째 → 3번째 → 4번째...` 순서대로 전달되기 때문이야. [Ripple-carry Adder – Clayton Cafiero](https://www.uvm.edu/~cbcafier/cs2210/content/05_cpu_alu/ripple_carry_adder.html?utm_source=chatgpt.com)

---

## 7. 그런데 문제가 하나 있다

64-bit 숫자를 더한다고 생각해봐.

Carry가 생기면:

**1번 자리 계산**  
→ Carry 전달  
→ **2번 자리 계산**  
→ Carry 전달  
→ **3번 자리 계산**  
→ ...

처럼 기다려야 할 수 있어.

즉 **Carry 전달이 길어질수록 느려질 수 있어.**

그래서 실제 고성능 CPU에서는 Carry를 더 빨리 계산하기 위한 여러 최적화된 Adder 구조를 사용해.

지금은 이름까지 외울 필요 없고:

> **단순 Ripple Carry는 이해하기 쉽지만 긴 Carry 경로가 속도 병목이 될 수 있다.**

정도만 기억하면 돼.

---

## 8. 다시 MOSFET까지 내려가 보자

지금까지 배운 게 이렇게 연결돼.

**NMOS / PMOS**  
↓  
**CMOS 회로**  
↓  
**NAND / NOR / XOR / AND**  
↓  
**Half Adder**  
↓  
**Full Adder**  
↓  
**여러 bit Adder**  
↓  
**ALU**  
↓  
**CPU 계산**

즉 CPU에서 `5 + 3`이라는 명령을 실행한다고 해도 밑바닥에서는 결국:

> **엄청난 수의 MOSFET이 ON/OFF되면서 전압 0과 1을 만들어 계산하는 것**

이야.

---

## 실제 칩/FAB과 연결

설계자는 보통 Full Adder의 MOSFET 하나하나를 직접 그리는 게 아니라 **Standard Cell과 설계 라이브러리**를 이용해 큰 회로를 구성해.

하지만 웨이퍼에 실제로 제조할 때는 결국 그 논리회로가:

**트랜지스터 → Contact → Metal 배선**

이라는 실제 물리적 패턴으로 구현돼.

그래서 트랜지스터 성능이나 Metal 배선의 저항·Capacitance가 나빠지면 **Adder 같은 논리회로의 계산 속도에도 영향을 줄 수 있어.**

---

## 오늘 현업 용어 4개

| 용어 | 쉽게 말하면 |
|---|---|
| **Cin** | 이전 자리에서 들어오는 Carry |
| **Cout** | 다음 자리로 보내는 Carry |
| **Full Adder** | A+B+Cin을 더하는 1-bit 덧셈 회로 |
| **Ripple Carry Adder** | Full Adder를 여러 개 이어 붙인 덧셈기 |

---

## 오늘 반드시 기억할 4줄

**① Half Adder는 A+B만 계산한다.**

**② Full Adder는 A+B+Cin을 계산한다.**

**③ Cout을 다음 Full Adder의 Cin에 연결하면 여러 자리 덧셈이 된다.**

**④ 이것이 CPU 덧셈 회로의 가장 기본적인 원리다.**

---

## 🧠 퀴즈

**Q1. Full Adder의 입력은 몇 개인가?**

A. 2개  
B. 3개

**정답: B — A, B, Cin 세 개.**

**Q2. A=1, B=1, Cin=1이면?**

A. Cout=1, Sum=1  
B. Cout=0, Sum=1

**정답: A.** `1+1+1 = 11₂`.

**Q3. Ripple Carry Adder가 느려질 수 있는 이유는?**

A. Carry가 자리마다 순서대로 전달되기 때문  
B. NMOS를 사용하지 않기 때문

**정답: A.**

### 🔁 Lesson 1~5 누적 체크

**“디지털 1”의 가장 밑바닥 물리적 의미는 무엇일까?**

→ **높은 전압 범위를 논리 1이라고 약속한 것.**

그리고 그 전압을 만드는 가장 밑바닥 스위치가 **MOSFET**, 이를 조합한 것이 **CMOS 논리회로**, 더 조합하면 **Adder와 CPU 계산 회로**가 되는 거야.

다음 수업: [Lesson 6](lesson-06.md).
