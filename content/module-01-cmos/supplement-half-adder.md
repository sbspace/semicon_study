---
id: m01-s-half-adder
module_id: m01
kind: supplement
title: XOR와 Half Adder — 다른 회차 원문
estimated_minutes: 15
content_origin: adapted_original
source_url: https://chatgpt.com/share/6aa53330-bbf0-83e8-b34f-53e1dc894671
source_message_ids:
- 76a8897a-9e8a-420f-87e8-fadc6206481a
original_label: 'Module 1 / Lesson 4  '
last_updated: '2026-09-12'
---

# Module 1 보충 수업 — XOR와 Half Adder — 다른 회차 원문

> **출처 안내:** Module 0 공유 세션 뒤쪽에 실린 실제 수업 원문입니다. 원래 Module/Lesson 표기를 아래에 보존했습니다. 세션별 번호가 충돌하므로 정규 목차와 별도의 보충 ID로 관리합니다. [관련 정규 수업](lesson-04.md)과 함께 읽을 수 있습니다.

## Module 1 / Lesson 4  
## CMOS 논리게이트를 조합해 계산하기 — XOR와 Half Adder

오늘은 드디어 **“트랜지스터가 어떻게 계산으로 이어지는가”**를 본다.

지금까지 Module 1에서 배운 흐름은 대략 이랬어.

> **NMOS/PMOS → CMOS → NOT/AND/OR 같은 논리게이트**

오늘은 그 논리게이트를 조합해서 **실제로 1비트 덧셈을 만드는 단계**야. 

핵심 목표는 하나다.

> **XOR와 AND를 조합하면 0과 1 두 개를 더하는 가장 기본적인 회로인 Half Adder를 만들 수 있다.**

---

## 1. 먼저 XOR가 뭐였지?

XOR는 **Exclusive OR**, 한국어로는 **배타적 OR**라고 한다.

이름보다 동작만 기억하면 된다.

> **입력 두 개가 서로 다르면 1, 같으면 0**

이다. [XOR Gate - GeeksforGeeks](https://www.geeksforgeeks.org/digital-logic/xor-gate/?utm_source=chatgpt.com)

진리표로 보면:

| A | B | XOR 출력 |
|---:|---:|---:|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

즉:

<interactive type="half-adder" />

```text
0 XOR 0 → 0
0 XOR 1 → 1
1 XOR 0 → 1
1 XOR 1 → 0
```

여기서 중요한 건 마지막 줄이야.

**1 XOR 1 = 0**

왜냐하면 XOR는 단순 OR가 아니라 **둘 중 하나만 1일 때 1**이기 때문이야.

---

## 2. 그런데 왜 XOR가 덧셈에 쓰이지?

이진수 1비트 덧셈을 직접 해보자.

```text
0 + 0 = 0
0 + 1 = 1
1 + 0 = 1
1 + 1 = 10
```

앞의 세 개는 쉬운데 마지막이 중요하다.

### `1 + 1 = 10`

10진수로는 2이고, 이진수에서는:

```text
10
```

이 된다.

즉 결과가 **두 자리**가 필요하다.

---

## 3. 그래서 덧셈 결과를 두 개로 나눈다

1비트 두 개를 더하면 출력이 두 개 필요하다.

- **Sum** = 현재 자리의 결과
- **Carry** = 다음 자리로 넘기는 값

예를 들어:

```text
1 + 1 = 10
```

이면

```text
Carry = 1
Sum   = 0
```

이다.

십진수 덧셈에서:

```text
  8
+ 7
---
 15
```

할 때 `5`를 쓰고 `1`을 윗자리로 올리는 것과 같은 원리야.

이 **올림수**가 Carry다.

---

## 4. 이제 표로 만들어보자

두 입력 A, B를 더해서 Sum과 Carry를 만들면:

| A | B | 결과 | Sum | Carry |
|---:|---:|---|---:|---:|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 1 | 1 | 1 | 0 |
| 1 | 0 | 1 | 1 | 0 |
| 1 | 1 | 10 | 0 | 1 |

여기서 패턴을 찾아보자.

### Sum

```text
0
1
1
0
```

이거 방금 본 **XOR**와 정확히 같다.

그래서:

> **Sum = A XOR B**

다. [Half-Adder | Combinational Logic Functions | Electronics Textbook](https://www.allaboutcircuits.com/textbook/digital/chpt-9/half-adder/?utm_source=chatgpt.com)

---

## 5. Carry는 어떤 Gate일까?

Carry 열을 보자.

```text
0
0
0
1
```

즉:

> **A와 B가 둘 다 1일 때만 1**

이다.

이건 바로 **AND Gate**다.

따라서:

> **Carry = A AND B**

다. [Half-Adder | Combinational Logic Functions | Electronics Textbook](https://www.allaboutcircuits.com/textbook/digital/chpt-9/half-adder/?utm_source=chatgpt.com)

---

## 6. 이게 바로 Half Adder

결국:

```text
A ─────┬──── XOR ───→ Sum
       │
B ─────┼──── AND ───→ Carry
```

가 된다.

실제 논리회로 구조는 이렇게 생긴다.

<visual-needed id="visual-042" type="reference-structure" description="반도체/전기 기초: 6. 이게 바로 Half Adder — 원수업 이미지 위치와 주변 설명을 함께 참고" />

그림에서 두 입력이 동시에:

- XOR로 들어가서 **Sum**
- AND로 들어가서 **Carry**

를 만든다.

이 회로를:

## Half Adder
## 반가산기

라고 한다.

Half Adder는 두 개의 1비트 입력을 더해 `Sum`과 `Carry`를 출력하는 가장 기본적인 조합논리 회로다. [Half Adder - GeeksforGeeks](https://www.geeksforgeeks.org/digital-logic/half-adder-in-digital-logic/?utm_source=chatgpt.com)

---

## 7. 왜 이름이 “Half” Adder야?

왜 그냥 Adder가 아니라 **Half Adder**일까?

이 회로에는 한 가지가 빠져 있어.

예를 들어 여러 자리 이진수를 더한다고 해보자.

```text
  1011
+ 0111
------
```

오른쪽 자리에서 `1 + 1`을 하면 Carry가 발생하지?

그 Carry를 **다음 자리 계산에 다시 넣어야 한다.**

그런데 Half Adder는 입력이 딱 두 개뿐이다.

```text
A
B
```

이전 자리에서 넘어온 Carry를 받을 입력이 없다.

그래서:

> **Half Adder = A + B만 계산**

하는 “절반짜리” 덧셈기라고 보면 된다.

---

## 8. 그럼 진짜 CPU 덧셈에는 뭘 쓰지?

다음 단계가:

## Full Adder

다.

Full Adder는 입력이 세 개다.

- A
- B
- **Carry-in**

그리고 출력은:

- Sum
- Carry-out

이다. [Full Adder - GeeksforGeeks](https://www.geeksforgeeks.org/digital-logic/full-adder-in-digital-logic/?utm_source=chatgpt.com)

즉:

```text
        이전 자리 Carry
              ↓
A ─────────── Full Adder ───→ Sum
B ───────────            ───→ Carry-out
```

여러 개를 연결하면:

```text
1 bit
 ↓
Full Adder
 ↓ Carry
Full Adder
 ↓ Carry
Full Adder
 ↓ Carry
Full Adder
```

이런 식으로 여러 비트 덧셈이 가능해진다.

---

## 9. 여기서 정말 중요한 연결

지금까지 우리가 배운 내용을 아래에서 위로 올라가 보자.

```text
NMOS / PMOS
    ↓
CMOS 회로
    ↓
NOT / AND / OR / XOR
    ↓
Half Adder
    ↓
Full Adder
    ↓
여러 비트 Adder
    ↓
ALU
    ↓
CPU
```

새 용어 하나만 소개하자.

### ALU
**Arithmetic Logic Unit**

쉽게 말하면:

> **CPU 안에서 덧셈, 뺄셈, 비교, AND/OR 같은 계산을 담당하는 회로 블록**

이야.

즉 CPU가 `3 + 5`를 계산한다고 해서 트랜지스터가 갑자기 숫자 3과 5를 이해하는 게 아니다.

밑바닥에서는 결국:

> **수많은 MOSFET → Logic Gate → Adder**

가 동작하는 것이다.

---

## 10. XOR 자체도 결국 트랜지스터로 만든다

여기서 계층을 다시 확실히 하자.

XOR라는 게 칩 안에 독립적인 마법 부품으로 들어가는 게 아니다.

XOR도 결국 여러 NMOS와 PMOS로 구현한다.

예를 들어 개념적으로는 XOR를:

- NOT
- AND
- OR

의 조합으로도 만들 수 있다. [Implementation of XOR Gate from AND, OR and NOT Gate - GeeksforGeeks](https://www.geeksforgeeks.org/digital-logic/implementation-of-xor-gate-from-and-or-and-not-gate/?utm_source=chatgpt.com)

즉:

```text
Transistor 여러 개
        ↓
XOR Gate 하나
        ↓
XOR + AND
        ↓
Half Adder
```

다.

이게 바로 **복잡한 칩을 계층적으로 설계하는 방식**의 첫 모습이야.

---

## 11. 실제 반도체 안에서는 어디에 있을까?

CPU나 GPU의 Die를 확대한다고 생각해보자.

```text
CPU Die
 ├─ Core
 │   ├─ ALU
 │   │   ├─ Adder
 │   │   │   ├─ Logic Gate
 │   │   │   │   └─ MOSFET
 │   │   │   └─ ...
 │   │   └─ ...
 │   └─ ...
 └─ ...
```

우리가 지금 배우는 Half Adder는 실제 칩 전체로 보면 아주 작은 기본 블록이지만,

**“트랜지스터가 어떻게 계산기로 변하는가”를 이해하기 위한 핵심 연결고리**다.

---

## 12. FAB에서는 이 논리게이트를 하나씩 만드는 걸까?

아니다.

FAB에서:

> “여기는 XOR니까 XOR 공정”

을 따로 하는 게 아니다.

웨이퍼 위에 **엄청난 수의 MOSFET과 배선을 한꺼번에 제조**한다.

그 후 그 트랜지스터들이 어떤 방식으로 연결됐느냐에 따라:

```text
어떤 부분 → NAND
어떤 부분 → XOR
어떤 부분 → Adder
어떤 부분 → Memory
```

가 된다.

즉 공정 관점에서는 크게:

```text
Transistor 구조를 정확히 제조
            +
Metal 배선을 정확히 연결
            ↓
설계자가 의도한 Logic 구현
```

이라고 보면 된다.

이게 나중에 배울 **FEOL과 BEOL**에도 연결된다.

- FEOL: 트랜지스터 자체를 만드는 쪽
- BEOL: 트랜지스터들을 금속배선으로 연결하는 쪽

지금은 이름만 익혀두면 충분하다.

---

## 오늘 현업 용어 4개

| 용어 | 아주 쉽게 |
|---|---|
| **XOR** | 두 입력이 다르면 1 |
| **Sum** | 현재 자리의 덧셈 결과 |
| **Carry** | 다음 자리로 넘기는 올림수 |
| **Half Adder** | 두 개의 1비트를 더해 Sum과 Carry를 만드는 회로 |

---

## 왜 이게 중요한가?

오늘 수업이 중요한 이유는 **처음으로 물리적인 트랜지스터와 “컴퓨터의 계산”이 직접 연결됐기 때문**이야.

지금까지는:

> MOSFET이 켜지고 꺼진다.

정도였다면 이제는:

> MOSFET의 ON/OFF → 논리게이트 → 덧셈

까지 올라왔다.

앞으로 CPU/GPU/NPU를 배울 때도 결국 이 계층 구조를 계속 확대해서 보는 거야.

---

## 오늘 반드시 기억할 3줄

**① XOR는 두 입력이 다를 때 1을 출력한다.**

**② 1비트 덧셈에서 `Sum = XOR`, `Carry = AND`다.**

**③ XOR와 AND를 조합한 가장 기본적인 덧셈 회로가 Half Adder다.**

---

## 🧠 Lesson 4 퀴즈

### Q1
`1 + 1`을 이진수로 계산하면?

A. `1`  
B. `10`  
C. `11`

### Q2
Half Adder에서 `A=1, B=1`이면 Sum과 Carry는?

A. Sum=1, Carry=0  
B. Sum=0, Carry=1  
C. Sum=1, Carry=1

### Q3
Half Adder가 여러 자리 덧셈을 혼자 처리하지 못하는 핵심 이유는?

A. XOR가 없어서  
B. 이전 자리에서 넘어온 Carry를 입력받지 못해서  
C. Transistor를 사용하지 않아서

---

## 정답 및 해설

**Q1 → B. `10`**

`1 + 1 = 2`, 이진수의 2는 `10`이다.

**Q2 → B. Sum=0, Carry=1**

그래서 결과가 `10`이 된다.

**Q3 → B**

Half Adder에는 `A`, `B` 두 입력만 있고 **Carry-in이 없다.** Carry-in까지 받는 것이 다음 단계인 **Full Adder**다. [Full Adder - GeeksforGeeks](https://www.geeksforgeeks.org/digital-logic/full-adder-in-digital-logic/?utm_source=chatgpt.com)
