---
id: m01-l06
module_id: m01
lesson_number: 6
title: Clock, Flip-Flop, Register — 계산한 0과 1을 어떻게 기억할까?
estimated_minutes: 12
content_origin: adapted_original
source_url: https://chatgpt.com/share/6aa5302d-67d0-83e9-b0c6-5b4883ef8170
source_message_ids:
- 4b0365bd-85a7-44f5-ab8f-d5ff10262239
last_updated: '2026-09-12'
kind: lesson
---

# Module 1 / Lesson 6  

> 기본 수업과 Quiz 예상 12분. 원수업의 표·그림과 설명을 보존했으며, 뒤의 추가 설명은 별도로 이어 읽을 수 있어요.

## Clock, Flip-Flop, Register — 계산한 0과 1을 어떻게 기억할까?

지금까지는 **계산하는 회로**를 배웠어.

`MOSFET → 논리게이트 → Adder`

그런데 CPU는 계산만 하면 끝이 아니야.

> **계산 결과를 잠깐 저장해두고, 다음 계산에서 다시 써야 해.**

오늘 목표는 이걸 이해하는 거야.

---

## 1. 먼저 Clock이 뭐야?

**Clock(클럭)**은 칩 전체가 “지금 움직여!”라고 맞춰주는 **박자 신호**야.

0과 1이 반복돼.

<interactive type="flipflop-register" />

```text
0 → 1 → 0 → 1 → 0 → 1 ...
```

중요한 건 단순히 HIGH/LOW가 아니라 **전압이 바뀌는 순간**이야.

- `0 → 1` : Rising Edge
- `1 → 0` : Falling Edge

보통 많은 회로는 특정 Edge에서 동작하도록 설계돼.

> Clock = CPU 내부 수많은 회로가 제각각 움직이지 않게 맞춰주는 공통 박자

---

## 2. Flip-Flop은 1 bit를 기억한다

오늘 핵심 소자는 **D Flip-Flop(DFF)**이야.

아주 쉽게 보면:

> **Clock이 오는 순간 입력 D를 찍어서, 그 값을 Q에 기억해두는 회로**

<visual-needed id="visual-016" type="reference-structure" description="트랜지스터와 CMOS: 2. Flip-Flop은 1 bit를 기억한다 — 원수업 이미지 위치와 주변 설명을 함께 참고" />

기호를 보면:

- **D** = 저장하고 싶은 Data
- **CLK** = 언제 저장할지 알려주는 Clock
- **Q** = 현재 저장된 값

예를 들어 Rising Edge에서 동작하는 DFF라면:

### Clock이 올라가는 순간 D=1

→ Q에 **1 저장**

그 뒤 D가 0으로 바뀌어도 다음 Clock Edge가 오기 전까지는:

→ **Q는 계속 1**

이게 단순 논리게이트와 가장 큰 차이야. D Flip-Flop은 Clock edge에서 입력을 받아 상태를 유지할 수 있어. [Circuit and Operation of a D Flip-Flop - Technical Articles](https://www.allaboutcircuits.com/technical-articles/circuit-and-operation-of-a-d-flip-flop/?utm_source=chatgpt.com)

---

## 3. 왜 이게 '기억'이지?

지난 Lesson의 AND나 XOR는 입력이 바뀌면 출력도 따라서 바뀌었어.

예를 들어:

`XOR(1,0) = 1`

인데 입력을 `1,1`로 바꾸면 바로 출력도 `0`으로 바뀌지.

이런 회로를:

**Combinational Logic(조합논리)**

이라고 해.

반면 Flip-Flop은:

> **과거에 저장했던 상태를 가지고 있다.**

그래서 이런 회로를:

**Sequential Logic(순차논리)**

이라고 불러.

즉:

- **조합논리** = 지금 입력만 보고 계산
- **순차논리** = 이전에 기억한 값까지 사용

이 차이가 엄청 중요해.

---

## 4. 실제로 Clock을 넣어보자

D가 이렇게 변한다고 생각해봐.

Clock Rising Edge가 왔을 때만 D를 읽는다고 하자.

### 첫 번째 Clock

D = 1

→ **Q = 1 저장**

### Clock 사이에 D가 0으로 바뀜

하지만 아직 Clock이 안 왔어.

→ **Q는 여전히 1**

### 다음 Clock

D = 0

→ 이제 **Q = 0으로 변경**

그래서 Q는 D를 실시간으로 따라다니는 게 아니라 **Clock 순간마다 한 번씩 갱신돼.**

이 동작을 timing diagram으로 보면 훨씬 쉬워.

<visual-needed id="visual-017" type="reference-structure" description="트랜지스터와 CMOS: 다음 Clock — 원수업 이미지 위치와 주변 설명을 함께 참고" />

---

## 5. Flip-Flop 여러 개를 모으면 Register

D Flip-Flop 하나:

> **1 bit 저장**

그럼 8개를 나란히 놓으면?

> **8 bit 저장**

이게 **Register(레지스터)**의 기본 개념이야.

<visual-needed id="visual-018" type="reference-structure" description="트랜지스터와 CMOS: 5. Flip-Flop 여러 개를 모으면 Register — 원수업 이미지 위치와 주변 설명을 함께 참고" />

예를 들어:

`10110100`

이라는 8-bit 데이터를 저장하려면 DFF 8개가 각각 한 자리씩 기억하면 돼.

각 DFF가 같은 Clock을 공유하기 때문에 **8개 bit가 같은 순간에 함께 저장**될 수 있어. [Digital system | D flip-flop & registers | Synchronous circuits, FSM | Timing constraints](https://faculty.sist.shanghaitech.edu.cn/liust/courses/slides/L10.%20Digital%20circuits%20and%20systems%202_26.pdf?utm_source=chatgpt.com)

---

## 6. 그럼 CPU에서 Register는 왜 필요하지?

Lesson 5에서 Adder가 계산했다고 해보자.

`5 + 3 = 8`

Adder 출력은 `1000`.

그런데 이 값을 그냥 흘려보내면 다음 계산에 못 써.

그래서:

**Adder**  
→ 계산 결과 `1000`  
→ **Register에 저장**  
→ 다음 Clock  
→ 다음 계산에 사용

하는 식으로 동작해.

즉 CPU는 대략:

**계산 → 저장 → 계산 → 저장**

을 Clock 박자에 맞춰 계속 반복하는 거야.

---

## 7. CPU 3 GHz라는 말과 연결

여기서 우리가 자주 듣는:

**3 GHz CPU**

의 GHz가 Clock과 관련돼.

`1 Hz = 초당 1번`

이니까,

`3 GHz = 초당 약 30억 번의 Clock cycle`

이라는 뜻이야.

다만:

> **Clock 한 번 = 명령어 하나 완료**

라는 뜻은 아니야.

실제 CPU는 파이프라인, 병렬 실행 등 훨씬 복잡하니까 지금은:

**GHz = CPU 내부 회로가 동작을 맞추는 Clock의 빈도**

정도로 이해하면 충분해.

---

## 8. Flip-Flop도 결국 CMOS다

중요한 연결이야.

Flip-Flop이 새로운 종류의 물리 소자인 건 아니야.

내부를 계속 내려가면:

**Flip-Flop**  
↓  
Latch / 논리게이트  
↓  
NAND / NOR / Inverter 등  
↓  
NMOS + PMOS  
↓  
MOSFET

이야.

예를 들어 Flip-Flop 내부의 기본 저장 구조는 NAND/NOR 게이트의 **Feedback(출력을 다시 입력으로 돌려주는 연결)**을 이용해 이전 상태를 유지할 수 있어. [Circuit and Operation of a D Flip-Flop - Technical Articles](https://www.allaboutcircuits.com/technical-articles/circuit-and-operation-of-a-d-flip-flop/?utm_source=chatgpt.com)

즉 결국 또 CMOS야.

---

## 9. 실제 칩/FAB과 연결

CPU 안에는 Register가 엄청 많이 있고, 각 Register는 여러 Flip-Flop으로 만들어져.

그리고 실제 웨이퍼에서는 이 모든 것이:

**NMOS / PMOS**  
→ **Standard Cell**  
→ **Metal 배선**  
→ Clock 연결

이라는 물리 구조로 만들어져.

여기서 Clock은 칩 전체에 매우 넓게 뿌려져야 해서 배선의 **저항과 Capacitance**가 중요해져.

Module 0에서 배운 capacitance가 여기서 다시 등장해.

배선이 길고 capacitance가 크면 전압을 빠르게 0↔1로 바꾸기가 어려워져서 **속도와 전력에 영향을 준다.**

---

## 오늘 현업 용어 4개

| 용어 | 쉽게 말하면 |
|---|---|
| **Clock** | 회로 전체가 움직이는 박자 신호 |
| **Edge** | Clock이 0→1 또는 1→0으로 바뀌는 순간 |
| **Flip-Flop** | Clock에 맞춰 1 bit를 기억하는 회로 |
| **Register** | Flip-Flop 여러 개를 모은 빠른 저장 공간 |

---

## 오늘 반드시 기억할 4줄

**① 논리게이트는 계산하고, Flip-Flop은 상태를 기억한다.**

**② D Flip-Flop 하나는 1 bit를 저장한다.**

**③ Flip-Flop 여러 개를 모으면 Register가 된다.**

**④ CPU는 Clock에 맞춰 계산 → 저장 → 계산 → 저장을 반복한다.**

---

## 🧠 퀴즈

**Q1. D Flip-Flop 하나가 저장하는 정보량은?**

A. 1 bit  
B. 8 bit

**정답: A**

---

**Q2. D가 바뀌면 Q도 항상 즉시 바뀌는가?**

A. 그렇다  
B. 아니다

**정답: B.** Edge-triggered DFF라면 지정된 Clock edge에서 D를 받아 Q를 갱신한다.

---

**Q3. 8-bit Register의 가장 단순한 구성은?**

A. D Flip-Flop 8개  
B. NMOS 1개

**정답: A**

---

다음 수업: [Lesson 7](lesson-07.md).
