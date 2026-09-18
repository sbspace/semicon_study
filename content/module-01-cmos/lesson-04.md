---
id: m01-l04
module_id: m01
lesson_number: 4
title: XOR와 Half Adder — 논리게이트가 실제로 덧셈을 한다
estimated_minutes: 12
content_origin: adapted_original
source_url: https://chatgpt.com/share/6aa5302d-67d0-83e9-b0c6-5b4883ef8170
source_message_ids:
- 50c8c97b-9705-40c3-9f85-47e898bfa902
last_updated: '2026-09-12'
kind: lesson
---

# Module 1 / Lesson 4  
<interactive type="half-adder" />


> 기본 수업과 Quiz 예상 12분. 원수업의 표·그림과 설명을 보존했으며, 뒤의 추가 설명은 별도로 이어 읽을 수 있어요.

## XOR와 Half Adder — 논리게이트가 실제로 덧셈을 한다

지금까지는 `NOT / NAND / NOR`처럼 **0과 1을 판단하는 회로**를 배웠어.

오늘은 한 단계 더 나가서,

> **논리게이트 여러 개를 조합하면 실제 숫자 계산도 할 수 있다**

는 걸 볼 거야.

---

## 1. 먼저 2진수 덧셈

컴퓨터는 `0`과 `1`만 사용하니까 덧셈도 이렇게 해.

| 계산 | 결과 |
|---|---|
| 0 + 0 | 0 |
| 0 + 1 | 1 |
| 1 + 0 | 1 |
| 1 + 1 | **10** |

마지막이 중요해.

### `1 + 1 = 10`?

10진수로는 당연히 2지만, **2진수에서 2를 `10`이라고 써.**

그래서 `1 + 1`을 하면 결과가 두 부분으로 나뉘어.

**현재 자리 = 0**  
**다음 자리로 넘김 = 1**

이때 다음 자리로 넘기는 `1`을 **Carry(캐리, 올림수)**라고 해. [https://www.allaboutcircuits.com/textbook/digital/chpt-9/half-adder/](https://www.allaboutcircuits.com/textbook/digital/chpt-9/half-adder/)

---

## 2. 새 논리게이트: XOR

XOR는 **Exclusive OR**의 약자야.

어렵게 생각하지 말고:

> **두 입력이 서로 다르면 1**

이라고 기억하면 돼.

| A | B | XOR |
|---:|---:|---:|
| 0 | 0 | 0 |
| 0 | 1 | **1** |
| 1 | 0 | **1** |
| 1 | 1 | 0 |

즉 `A와 B 중 정확히 하나만 1`일 때 출력이 1이야.

OR와의 차이도 봐두자.

- OR: 하나라도 1이면 1
- XOR: **딱 하나만** 1이어야 1

그래서 `1 XOR 1 = 0`이야.

---

## 3. 그런데 이 표, 어디서 본 것 같지?

아까 덧셈을 다시 보자.

| A | B | 덧셈의 현재 자리 |
|---:|---:|---:|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | **0** |

이게 정확히 **XOR**야.

즉:

> **XOR가 덧셈 결과의 현재 자리(Sum)를 계산한다.**

그런데 `1 + 1`에서는 끝이 아니지.

`1 + 1 = 10`

이므로 다음 자리로 `1`을 넘겨야 해.

---

## 4. Carry는 누가 만들까?

Carry가 필요한 경우는 딱 하나야.

**A=1이고 B=1일 때**

그런데 지난번에 배운 **AND**가 바로:

> 둘 다 1이면 1

이었지.

따라서:

> **AND가 Carry를 계산한다.**

이 두 개를 합친 회로가 **Half Adder**야.

<visual-needed id="visual-014" type="reference-structure" description="트랜지스터와 CMOS: 4. Carry는 누가 만들까? — 원수업 이미지 위치와 주변 설명을 함께 참고" />

그림을 보면 입력 `A, B`가 동시에 두 군데로 들어가.

**XOR → Sum**  
**AND → Carry**

아주 단순해. [https://www.geeksforgeeks.org/digital-logic/half-adder-in-digital-logic/](https://www.geeksforgeeks.org/digital-logic/half-adder-in-digital-logic/)

---

## 5. Half Adder를 실제로 돌려보자

### A=0, B=0

XOR → 0  
AND → 0

따라서:

**Carry = 0 / Sum = 0**

→ `00`, 즉 0

---

### A=0, B=1

XOR → 1  
AND → 0

→ **01**

즉 1.

---

### A=1, B=0

마찬가지로

→ **01**

---

### A=1, B=1

XOR → 0  
AND → 1

→ **10**

이게 바로 2진수 `2`야.

따라서 전체 표는:

| A | B | Carry | Sum | 결과 |
|---:|---:|---:|---:|---|
| 0 | 0 | 0 | 0 | `00` |
| 0 | 1 | 0 | 1 | `01` |
| 1 | 0 | 0 | 1 | `01` |
| 1 | 1 | **1** | **0** | `10` |

[https://www.allaboutcircuits.com/textbook/digital/chpt-9/half-adder/](https://www.allaboutcircuits.com/textbook/digital/chpt-9/half-adder/)

---

## 6. 여기서 중요한 연결

이제 처음으로 전체 계층이 이렇게 이어져.

**MOSFET**  
↓  
**NMOS / PMOS**  
↓  
**CMOS 논리게이트**  
↓  
**XOR / AND**  
↓  
**Half Adder**  
↓  
**덧셈**

즉 CPU가 숫자를 더하는 것도 밑바닥까지 내려가면 결국:

> **엄청나게 많은 MOSFET의 ON/OFF**

야.

이 연결을 이해하는 게 Module 1의 핵심이야.

---

## 7. 그런데 왜 이름이 ‘Half’ Adder일까?

Half Adder에는 문제가 하나 있어.

예를 들어 여러 자리 숫자를 더하면 **앞자리에서 Carry가 넘어올 수 있잖아.**

그런데 Half Adder의 입력은:

`A, B`

딱 두 개뿐이야.

앞자리에서 넘어온 **Carry-in**을 받을 입력이 없어.

그래서 완전한 덧셈기가 아니라 **Half(반쪽) Adder**라고 불러. 

Carry까지 입력받을 수 있게 만든 것이 다음 Lesson에서 배울:

> **Full Adder**

야.

---

## 8. 실제 CPU에서는 어디에 쓰일까?

CPU 안에는 **ALU(Arithmetic Logic Unit)**라는 부분이 있어.

새 용어니까 쉽게 말하면:

> **ALU = CPU 안에서 덧셈, 비교, AND/OR 같은 계산을 담당하는 회로**

Adder는 이런 계산 회로의 핵심 구성 요소야.

물론 실제 최신 CPU에서는 우리가 오늘 본 Half Adder 하나만 단순 반복하는 수준은 아니고 훨씬 최적화된 구조를 사용하지만,

**논리게이트를 조합해서 binary addition을 한다는 기본 원리는 같다.**

---

## 오늘 현업 용어 4개

| 용어 | 지금 이해할 뜻 |
|---|---|
| **XOR** | 두 입력이 다르면 1 |
| **Sum** | 현재 자리의 덧셈 결과 |
| **Carry** | 다음 자리로 넘어가는 올림수 |
| **Half Adder** | XOR + AND로 1-bit 두 개를 더하는 회로 |

---

## 오늘 반드시 기억할 4줄

**① 2진수에서 `1 + 1 = 10`.**

**② XOR가 현재 자리 `Sum`을 만든다.**

**③ AND가 다음 자리 `Carry`를 만든다.**

**④ XOR + AND = Half Adder.**

---

## 🧠 퀴즈

**Q1. `1 + 1`을 2진수로 쓰면?**

A. 2  
B. 10

**정답: B**

`10₂`가 10진수의 `2`야.

---

**Q2. Half Adder에서 Sum을 담당하는 것은?**

A. XOR  
B. AND

**정답: A**

XOR의 출력표가 1-bit 덧셈의 현재 자리 결과와 정확히 같아.

---

**Q3. A=1, B=1일 때 Carry는?**

A. 0  
B. 1

**정답: B**

둘 다 1이므로 AND가 1을 출력하고, 이 값이 다음 자리로 넘어가.

---

다음 수업: [Lesson 5](lesson-05.md).
