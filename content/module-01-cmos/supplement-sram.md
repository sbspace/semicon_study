---
id: m01-s-sram
module_id: m01
kind: supplement
title: SRAM 6T와 Register — 다른 회차 원문
estimated_minutes: 15
content_origin: adapted_original
source_url: https://chatgpt.com/share/6aa53330-bbf0-83e8-b34f-53e1dc894671
source_message_ids:
- 6d11ed4a-45de-4a68-8339-86cb7cc32563
original_label: 'Module 1 / Lesson 7  '
last_updated: '2026-09-12'
---

# Module 1 보충 수업 — SRAM 6T와 Register — 다른 회차 원문

> **출처 안내:** Module 0 공유 세션 뒤쪽에 실린 실제 수업 원문입니다. 원래 Module/Lesson 표기를 아래에 보존했습니다. 세션별 번호가 충돌하므로 정규 목차와 별도의 보충 ID로 관리합니다. [관련 정규 수업](lesson-07.md)과 함께 읽을 수 있습니다.

## Module 1 / Lesson 7  
## SRAM 6T Cell — CMOS로 1 bit를 계속 기억하는 방법과 Register와의 차이

오늘은 지금까지 배운 **MOSFET → CMOS → 논리게이트**에서 한 단계 올라가서, **“0 또는 1을 어떻게 기억하는가?”**를 본다.

오늘 핵심은 하나야.

> **SRAM은 CMOS 트랜지스터 6개를 이용해 전원이 켜져 있는 동안 0 또는 1 한 비트를 안정적으로 유지할 수 있다.**

그리고 오늘 끝날 때는 **SRAM과 Register가 왜 둘 다 데이터를 저장하면서도 다른 말인지**까지 구분하면 된다. 

---

## 1. 지금까지는 '계산'만 했다

앞에서 배운 논리게이트를 떠올려보자.

<interactive type="sram-cell" />

```text
A ──┐
    AND ──→ 결과
B ──┘
```

입력이 들어오면 출력이 결정된다.

하지만 입력을 없애면 **이 회로 자체가 과거 결과를 기억하는 것은 아니다.**

CPU에는 계산만 필요한 게 아니라:

> **“방금 계산한 1을 잠깐 기억해둬.”**

도 필요하다.

그래서 **저장 기능**이 필요해진다.

---

## 2. SRAM이란?

새 용어부터 풀자.

**SRAM = Static Random Access Memory**

지금은 이름 전체를 외울 필요 없고,

> **전원이 공급되는 동안 값을 유지할 수 있는 빠른 메모리**

라고 이해하면 된다.

실제 SRAM의 기본 단위인 **6T SRAM Cell**은 이런 구조다.

<visual-needed id="visual-043" type="reference-structure" description="반도체/전기 기초: 2. SRAM이란? — 원수업 이미지 위치와 주변 설명을 함께 참고" />

여기서 `6T`의 T는:

> **6 Transistors**

라는 뜻이다.

즉 **SRAM 1 bit를 저장하는 기본 Cell에 트랜지스터 6개가 사용된다.**

---

## 3. 6개 중 핵심은 사실 4개

6T SRAM을 처음부터 트랜지스터 6개로 보면 복잡해.

먼저 **4개만** 보자.

지난 수업들에서 배운 CMOS NOT Gate, 즉 **Inverter** 하나에는 보통:

```text
PMOS 1개
+
NMOS 1개
────────
Transistor 2개
```

가 필요하다.

그런데 SRAM에는 이 Inverter가 **두 개** 있다.

```text
Inverter A = 2T

Inverter B = 2T

합계 = 4T
```

그리고 이 두 Inverter를 특이하게 연결한다.

---

## 4. 서로의 출력을 서로의 입력으로 넣는다

이게 오늘 가장 중요한 개념이다.

```text
      ┌──────────────┐
      ↓              │
   Inverter A → Inverter B
      ↑              │
      └──────────────┘
```

이걸 **Cross-coupled inverter**, 즉 서로 교차 연결된 Inverter라고 한다.

왜 이렇게 할까?

---

## 5. 예를 들어 A가 1이라고 해보자

Inverter는 입력을 반대로 만드는 회로였지.

A 쪽 상태가 `1`이면:

```text
A = 1
 ↓
Inverter
 ↓
B = 0
```

그런데 B의 `0`이 다시 반대편 Inverter로 들어간다.

```text
B = 0
 ↓
Inverter
 ↓
A = 1
```

그러면 다시:

```text
A = 1
↓
B = 0
↓
A = 1
↓
B = 0
↓
...
```

서로가 서로의 상태를 계속 유지시킨다.

즉:

> **1과 0이 서로를 붙잡고 있는 구조**

라고 생각하면 된다.

---

## 6. 반대 상태도 가능하다

이번에는:

```text
A = 0
B = 1
```

이라고 해보자.

그러면 역시:

```text
A = 0
 → B = 1
 → A = 0
 → B = 1
```

이 상태도 안정적이다.

따라서 이 회로에는 안정적인 상태가 두 개 있다.

```text
상태 ①
A = 1
B = 0

상태 ②
A = 0
B = 1
```

이 둘을 각각:

**Logic 1 / Logic 0**

으로 사용한다.

그래서 **1 bit를 기억할 수 있다.**

---

## 7. 그런데 왜 '계속 전기가 돌아야' 하지?

여기서 SRAM의 중요한 특징이 나온다.

두 Inverter가 상태를 유지하려면 **트랜지스터에 계속 전원이 공급되어야 한다.**

전원을 완전히 끄면:

```text
전원 OFF
   ↓
Inverter 동작 중단
   ↓
상태 유지 불가능
   ↓
저장 데이터 소실
```

된다.

이런 메모리를:

### Volatile Memory
**휘발성 메모리**

라고 한다.

SRAM뿐 아니라 DRAM도 휘발성 메모리다.

반면 NAND Flash는 전원을 꺼도 데이터를 유지한다.

이 차이는 나중에 메모리 Module에서 제대로 다룬다.

---

## 8. 그럼 나머지 2개 Transistor는?

지금까지:

```text
Inverter 2개
= 4 Transistors
```

였지.

하지만 이것만 있으면 데이터를 **유지**할 수 있을 뿐,

외부에서:

> “이번에는 0을 저장해.”

또는

> “현재 뭐가 저장되어 있는지 읽어줘.”

하기 어렵다.

그래서 외부와 연결되는 **문 역할의 트랜지스터 2개**를 추가한다.

```text
외부 ── [문] ── SRAM 내부 ── [문] ── 외부
          ↑                    ↑
         1T                   1T
```

이들을 **Access Transistor**라고 한다.

즉 전체적으로:

```text
상태 유지용
Inverter 2개
= 4T

+

읽기/쓰기용
Access Transistor
= 2T

──────────────

총 6T
```

그래서:

## 6T SRAM

이다.

---

## 9. 실제 SRAM Cell 구조를 다시 보면

이제 아까 이미지가 조금 다르게 보일 거야.

전형적인 6T Cell은:

```text
          상태 유지
      ┌───────────────┐
      │ Inverter 2개  │
      │      4T       │
      └───────────────┘

       ↙             ↘
   Access T        Access T
       ↓             ↓
      BL            BLB
```

여기서 새로운 용어 두 개만 보자.

### BL = Bit Line

SRAM Cell에 **데이터를 읽고 쓰는 배선**.

### WL = Word Line

Access Transistor를 열어서:

> **“이 Cell에 지금 접근해.”**

라고 선택하는 배선이다.

따라서 아주 단순하게:

```text
Word Line
   ↓
문 열기

Bit Line
   ↓
0/1 읽기 또는 쓰기
```

라고 이해하면 된다.

---

## 10. SRAM Cell 하나만 사용하는 건 아니다

실제 칩에서는 이런 Cell이 엄청나게 반복된다.

<visual-needed id="visual-044" type="reference-structure" description="반도체/전기 기초: 10. SRAM Cell 하나만 사용하는 건 아니다 — 원수업 이미지 위치와 주변 설명을 함께 참고" />

대략:

```text
        Bit Line들
       ↓  ↓  ↓  ↓

WL → [Cell][Cell][Cell][Cell]
WL → [Cell][Cell][Cell][Cell]
WL → [Cell][Cell][Cell][Cell]
WL → [Cell][Cell][Cell][Cell]
```

처럼 Cell을 빽빽하게 배열한다.

이걸 **SRAM Array**라고 한다.

---

## 11. 실제 CPU에는 어디에 있을까?

대표적인 곳이:

## Cache Memory

다.

CPU는 DRAM보다 훨씬 빠르게 접근해야 하는 데이터를 가까운 곳에 저장하기 위해 SRAM 기반 Cache를 많이 사용한다.

예를 들어 개념적으로:

```text
CPU Core
│
├─ 계산 회로(ALU)
│
├─ Register
│
├─ L1 Cache ─┐
├─ L2 Cache  │ → 주로 SRAM
│            │
└────────────┘

       ↓

DRAM
```

즉 SRAM은 우리가 앞으로 CPU 구조를 배울 때 계속 등장한다.

---

## 12. 그런데 Register도 값을 저장한다고 했는데?

좋은 구분이 필요하다.

### Register

> **CPU가 지금 당장 계산에 사용할 작은 저장 공간**

이라고 우선 이해하자.

예를 들어:

```text
3 + 5 = 8
```

계산할 때 CPU 내부에서 `3`, `5`, 결과 `8` 같은 값을 매우 가까운 곳에서 잠깐 잡고 있어야 한다.

그런 역할을 Register가 한다.

---

## 13. SRAM과 Register의 가장 중요한 차이

둘 다 결국 트랜지스터 회로로 데이터를 저장할 수 있지만 **용도와 구성 방식이 다르다.**

| | Register | SRAM |
|---|---|---|
| 목적 | CPU 연산에 직접 사용하는 값 보관 | 많은 데이터를 빠르게 저장 |
| 대표 구현 | Flip-Flop 등 | **6T SRAM Cell** |
| 밀도 | 낮음 | 높음 |
| 속도 | 매우 빠름 | 매우 빠르지만 Register보다 일반적으로 멂 |
| 대표 위치 | CPU 실행부 가까이 | Cache 등 |

중요한 점은:

> **Register = SRAM의 다른 이름**

이 아니다.

Register는 **논리적인 저장 공간/회로 블록의 역할**을 말하고, 일반적인 CPU register file은 SRAM과 유사한 custom memory cell을 쓰기도 하며 작은 상태 register는 flip-flop으로 구현하기도 한다.

따라서 초보 단계에서:

```text
Register
→ 계산 직전에 쓰는 아주 가까운 저장공간

SRAM
→ Cell을 많이 배열한 빠른 메모리
```

정도로 구분하면 충분하다.

---

## 14. 이전 수업과 연결하면

여기까지 온 흐름을 보자.

```text
NMOS + PMOS
     ↓
CMOS
     ↓
Inverter
     ↓
Inverter 2개를
서로 교차 연결
     ↓
상태 0/1 유지
     ↓
Access Transistor 2개 추가
     ↓
6T SRAM Cell
     ↓
수많은 Cell 배열
     ↓
SRAM
     ↓
CPU Cache 등
```

즉 오늘도 새로운 마법 같은 부품을 배운 게 아니야.

**우리가 계속 배우던 NMOS와 PMOS를 다르게 연결했을 뿐**이다.

---

## 15. FAB에서는 왜 중요하지?

SRAM은 같은 Cell을 엄청나게 반복한다.

따라서 Cell 하나가 작아지면 전체 Cache 면적을 크게 줄일 수 있다.

반대로 SRAM Cell의 트랜지스터 하나가 제대로 동작하지 않으면:

```text
6T 중 하나 특성 이상
        ↓
0/1 상태 불안정
        ↓
Read/Write 실패 가능
        ↓
SRAM bit 불량
```

이 될 수 있다.

그래서 첨단 Logic 공정에서 **SRAM Cell 면적과 안정성**은 공정 경쟁력을 평가할 때 중요한 요소 중 하나다.

나중에 공정을 배우면:

`Vth variation`, `CD`, `Overlay`, `Contact`, `Metal`

같은 공정 변화가 SRAM Cell 안정성과 어떻게 연결되는지도 다시 만나게 된다.

---

## 오늘 현업 용어 4개

| 용어 | 지금 수준의 의미 |
|---|---|
| **SRAM** | 전원이 있는 동안 0/1을 유지하는 빠른 메모리 |
| **6T Cell** | 6개 Transistor로 구성되는 대표적인 SRAM 1-bit Cell |
| **Bit Line (BL)** | Cell에 데이터를 읽고 쓰는 배선 |
| **Word Line (WL)** | 어떤 Cell에 접근할지 선택하는 배선 |

---

## 오늘 반드시 기억할 3줄

**① SRAM 6T Cell은 기본적으로 `상태 유지용 4T + 접근용 2T`로 구성된다.**

**② Inverter 두 개를 서로 연결하면 `1↔0` 상태가 서로를 유지하여 1 bit를 기억할 수 있다.**

**③ Register와 SRAM은 둘 다 데이터를 저장하지만, Register는 연산에 직접 쓰는 작은 저장공간이고 SRAM은 많은 Cell을 배열한 빠른 메모리라는 차이가 있다.**

---

## 🧠 Lesson 7 퀴즈

### Q1
6T SRAM에서 데이터를 유지하는 핵심 구조는?

A. Capacitor 6개  
B. 서로 교차 연결된 Inverter 2개  
C. AND Gate 6개

### Q2
6T에서 나머지 2개의 Access Transistor가 필요한 이유는?

A. SRAM을 냉각하기 위해  
B. 외부에서 Cell의 데이터를 읽고 쓰기 위해  
C. 전원을 저장하기 위해

### Q3
SRAM의 전원을 완전히 끄면 저장된 데이터는?

A. 그대로 유지된다.  
B. 사라진다.  
C. NAND Flash로 이동한다.

## 정답 및 해설

**Q1 → B**

Inverter 두 개가 서로의 출력을 다시 입력으로 받아 **0/1 상태를 안정적으로 유지**한다.

**Q2 → B**

Access Transistor는 Word Line의 제어를 받아 Cell 내부와 Bit Line을 연결하는 **출입문** 역할을 한다.

**Q3 → B**

SRAM은 **휘발성(Volatile) Memory**라서 전원이 없어지면 상태를 유지하지 못한다.

> **편집 보완:** 교차 연결 그림의 A=1 → B=0 → A=1은 두 노드의 안정된 논리 관계이며 시간에 따라 계속 진동한다는 뜻이 아닙니다. 전원 공급이 필요하다는 말도 큰 전류가 계속 순환해야 한다는 뜻은 아닙니다.
