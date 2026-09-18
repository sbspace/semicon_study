---
id: m02-s-feol-beol
module_id: m02
kind: supplement
title: FEOL과 BEOL — 후속 회차 원문
estimated_minutes: 15
content_origin: adapted_original
source_url: https://chatgpt.com/share/6aa53330-bbf0-83e8-b34f-53e1dc894671
source_message_ids:
- 6e04ae79-bc24-4ef1-b33b-8f22f732403e
original_label: 'Module 2 / Lesson 2  '
last_updated: '2026-09-12'
---

# Module 2 보충 수업 — FEOL과 BEOL — 후속 회차 원문

> **출처 안내:** Module 0 공유 세션 뒤쪽에 실린 실제 수업 원문입니다. 원래 Module/Lesson 표기를 아래에 보존했습니다. 세션별 번호가 충돌하므로 정규 목차와 별도의 보충 ID로 관리합니다. [관련 정규 수업](lesson-03.md)과 함께 읽을 수 있습니다.

## Module 2 / Lesson 2  
## FEOL과 BEOL — 트랜지스터를 만들고, 그들을 배선으로 연결한다

지난 Lesson에서 칩 안의 계층을 이렇게 봤지.

**Transistor → Logic Gate → Standard Cell → Functional Block → Die**

오늘은 시선을 **회로 설계에서 실제 칩의 단면**으로 바꿔볼 거야.

### 오늘 핵심 목표

> **칩 아래쪽에는 트랜지스터가 있고, 그 위에는 트랜지스터들을 서로 연결하는 여러 층의 금속배선이 쌓여 있다.**

그리고 이 둘을 각각 **FEOL과 BEOL**이라고 부른다는 것까지 이해하면 된다.

---

## 1. 먼저 실제 칩 단면을 보자

이 주제는 3차원 구조를 봐야 이해가 쉬워.

<visual-needed id="visual-045" type="reference-structure" description="반도체/전기 기초: 1. 먼저 실제 칩 단면을 보자 — 원수업 이미지 위치와 주변 설명을 함께 참고" />

그림을 볼 때 세부 구조를 전부 이해하려 하지 말고 **위/아래만** 보자.

대략 이런 구조다.

<interactive type="feol-mol-beol" />

```text
칩 표면
━━━━━━━━━━━━━━━━━━━━

Metal 10  ──────────
Metal 9   ──────────
Metal 8   ──────────
   ...
Metal 2   ──────────
Metal 1   ──────────
          ↑
       금속 배선층
━━━━━━━━━━━━━━━━━━━━
      Contact
━━━━━━━━━━━━━━━━━━━━
 NMOS   PMOS   NMOS
━━━━━━━━━━━━━━━━━━━━
     Silicon
```

즉 우리가 Module 0~1에서 열심히 배웠던 **MOSFET은 칩의 아래쪽에 있다.**

그 위로 엄청난 양의 배선이 쌓인다.

---

## 2. FEOL이란?

새 용어부터 정의하자.

### FEOL = Front End Of Line

쉽게 말하면:

> **실리콘 위에 트랜지스터 자체를 만드는 영역/공정**

이라고 이해하면 된다.

예를 들어:

- Source / Drain
- Gate
- Channel
- Isolation

같은 구조가 여기 포함된다.

즉 지금까지 배운:

```text
      Gate
       ↓
Source ─ Channel ─ Drain
```

이 녀석을 실제 웨이퍼에 만드는 과정이 **FEOL의 핵심**이다.

---

## 3. 그런데 트랜지스터만 수십억 개 만들어놓으면?

아무 계산도 못 한다.

예를 들어 트랜지스터가 이렇게 있다고 해보자.

```text
T1    T2    T3    T4
```

서로 연결되어 있지 않으면 각각 따로 존재할 뿐이다.

지난 Module에서 배운 AND, XOR, Adder 같은 회로는 결국:

```text
T1 ── T2
      │
T3 ── T4 ── T5
```

처럼 **트랜지스터들을 특정 방식으로 연결해야** 만들어진다.

그래서 두 번째 영역이 필요하다.

---

## 4. BEOL이란?

### BEOL = Back End Of Line

쉽게 말하면:

> **만들어놓은 트랜지스터들을 금속배선으로 연결하는 영역/공정**

이다.

실제 칩에서는 배선 하나만 사용하는 게 아니라 여러 층을 사용한다.

```text
Metal 4   ═══════════
               │
Metal 3      ══╪════
               │
Metal 2   ═════╪═════
          │
Metal 1   ╪══════════
          │
      Transistor
```

도로로 비유하면 꽤 정확하다.

**FEOL = 건물들**

**BEOL = 건물들을 연결하는 도로망**

이라고 생각해봐.

건물을 아무리 많이 지어도 도로가 없다면 도시가 제대로 작동하지 않는다.

칩도 똑같다.

---

## 5. 왜 Metal을 여러 층이나 쌓을까?

트랜지스터가 몇 개라면 한 층으로도 연결할 수 있겠지.

그런데 현대 칩에는 엄청난 수의 트랜지스터가 있다.

배선을 한 층에 모두 넣으려고 하면:

```text
────────────
   X
────────────
```

서로 교차해야 하는 문제가 생긴다.

전기적으로 연결되면 안 되는 두 선을 그냥 교차시킬 수는 없어.

그래서:

```text
Metal 2
────────────
      │
      │
────────────
Metal 1
```

처럼 **높이가 다른 층으로 지나간다.**

고속도로의 **입체교차로**와 비슷해.

---

## 6. 그러면 층과 층은 어떻게 연결하지?

여기서 새 용어가 하나 등장한다.

### Via(비아)

> **서로 다른 Metal Layer를 위아래로 연결하는 작은 수직 전기 연결부**

다.

```text
Metal 3  ═════════
              │
             VIA
              │
Metal 2  ═════════
```

반면 가장 아래쪽에서 트랜지스터와 첫 배선을 연결하는 구조는 보통 **Contact**라는 표현을 사용한다.

초보 단계에서는:

```text
Transistor
    │
 Contact
    │
Metal 1
    │
   Via
    │
Metal 2
    │
   Via
    │
Metal 3
```

정도로 구분하면 충분하다.

---

## 7. 위쪽 Metal과 아래쪽 Metal은 역할도 조금 다르다

배선층을 모두 똑같은 크기로 만들지는 않는다.

일반적으로 아래쪽 배선은:

> **트랜지스터 근처의 짧고 촘촘한 연결**

에 많이 사용한다.

```text
M1  ──┐ ┌───┐ ──
M2  ─────┐ └────
```

반대로 위쪽으로 갈수록 비교적 **굵고 긴 배선**을 사용할 수 있다.

```text
Upper Metal
══════════════════
```

칩 전체에 전원이나 신호를 멀리 전달해야 하기 때문이다.

그래서 실제 단면을 보면 위쪽 Metal이 더 두껍게 보이는 경우가 많다.

---

## 8. FEOL과 BEOL 사이에는 뭐가 있을까?

실제 제조 분류는 조금 더 세분화할 수 있다.

FEOL과 BEOL 사이에:

### MOL = Middle Of Line

이라는 표현도 사용한다.

쉽게 말하면:

> **트랜지스터와 첫 번째 본격적인 금속배선을 이어주는 연결 영역**

정도로 생각하면 된다.

따라서 조금 더 정확한 그림은:

```text
        BEOL
   Metal / Via
        ↑
━━━━━━━━━━━━━━━━
        MOL
     Contact
        ↑
━━━━━━━━━━━━━━━━
        FEOL
   Transistor
        ↑
━━━━━━━━━━━━━━━━
      Silicon
```

이다.

지금은 **FEOL / BEOL 두 덩어리가 핵심**이고 MOL은 중간 연결부 정도로만 기억하면 된다.

---

## 9. 지난 Lesson의 Standard Cell과 연결해보자

지난 Lesson에서 Standard Cell을:

> **AND, NAND, Flip-Flop 같은 기능을 구현하기 위해 미리 설계해둔 작은 회로 블록**

정도로 배웠지.

Standard Cell 하나를 실제 물리 구조로 내려가 보면:

```text
Standard Cell
      ↓

Metal 배선
─────────────
     │
NMOS / PMOS
─────────────
Silicon
```

이다.

즉 Standard Cell이라는 것도 결국:

**FEOL에 만들어진 NMOS/PMOS + BEOL의 배선**

조합이다.

그리고 Cell들을 또 BEOL 배선으로 연결하면:

```text
Cell ─ Cell ─ Cell
 │             │
 └──── Cell ───┘
```

더 큰 Functional Block이 만들어진다.

---

## 10. FAB 공정과 연결하면

앞으로 Module 3에서 배울 공정들이 이제 어디에 쓰이는지 큰 위치를 잡을 수 있다.

예를 들어:

### FEOL 쪽

트랜지스터를 만들기 위해

**Photo → Etch → Implant → Deposition → Anneal → CMP ...**

같은 공정들이 반복된다.

### BEOL 쪽

금속배선을 만들기 위해 다시

**Deposition → Photo → Etch → Metal 형성 → CMP ...**

등이 반복된다.

즉 흔히 말하는 **반도체 8대 공정은 한 번씩 하고 끝나는 순서가 아니다.**

이게 중요하다.

```text
Photo
Etch
Deposition
CMP
...

↓ 반복

다음 Layer

↓ 또 반복

다음 Layer
```

수많은 Layer를 만들기 위해 여러 공정을 **계속 반복**한다.

---

## 11. 왜 생산 시스템 관점에서도 중요한가?

같은 Wafer라도 공정 Step이:

```text
Gate 관련 Step
```

인지,

```text
Metal Layer 관련 Step
```

인지에 따라 **만들고 있는 물리적 구조 자체가 다르다.**

예를 들어:

**Gate CD 이상**

→ Transistor 자체 특성에 영향

반면

**Metal/Via 이상**

→ Transistor는 정상이어도 연결에 문제가 생길 수 있음

이다.

그래서 나중에 Defect나 Yield를 볼 때도:

> **이 Defect가 FEOL 문제인가? BEOL 문제인가?**

라는 구분 자체가 꽤 중요한 큰 분류가 된다.

---

## 오늘 핵심 용어 4개

| 용어 | 지금 수준의 의미 |
|---|---|
| **FEOL** | Silicon 위에 Transistor 자체를 만드는 영역 |
| **BEOL** | Transistor들을 Metal 배선으로 연결하는 영역 |
| **Via** | 서로 다른 Metal Layer를 수직으로 연결 |
| **Contact** | Transistor와 아래쪽 배선을 연결하는 접점 |

---

## 오늘 내용을 한 장으로 압축하면

```text
             DIE

     ┌─────────────────┐
     │   Metal Layer   │
     │   Metal Layer   │
     │   Metal Layer   │ ← BEOL
     │   Metal Layer   │
     ├─────────────────┤
     │ Contact / MOL   │
     ├─────────────────┤
     │ NMOS PMOS NMOS  │ ← FEOL
     ├─────────────────┤
     │     Silicon     │
     └─────────────────┘
```

지난 Lesson의 계층과 오늘 내용을 합치면:

> **Transistor를 FEOL에서 만들고 → BEOL 배선으로 연결해 Standard Cell과 더 큰 회로를 구성하고 → 그 수많은 회로가 모여 하나의 Die가 된다.**

---

## 🧠 Lesson 2 퀴즈

### Q1

MOSFET 트랜지스터 자체를 만드는 영역과 가장 가까운 것은?

A. BEOL  
B. FEOL  
C. Package

### Q2

Via의 역할은?

A. N형 Silicon을 만든다.  
B. 서로 다른 Metal Layer를 수직으로 연결한다.  
C. Wafer를 Die로 자른다.

### Q3

반도체 8대 공정에 대한 설명으로 맞는 것은?

A. Photo → Etch → Deposition 등을 각각 한 번씩만 하면 칩이 완성된다.  
B. 여러 Layer와 구조를 만들기 위해 여러 공정을 반복한다.  
C. 8대 공정은 모두 BEOL에서만 사용한다.

## 정답 및 해설

**Q1 → B. FEOL**

우리가 배운 Gate / Source / Drain / Channel을 가진 **트랜지스터 자체를 만드는 쪽**이다.

**Q2 → B**

Via는 위아래의 서로 다른 **Metal Layer 사이를 연결하는 수직 통로**다.

**Q3 → B**

이 부분은 앞으로 공정을 배울 때 매우 중요하다. **8대 공정은 칩 제조 순서 8단계라는 뜻이 아니다.** Photo, Etch, Deposition, CMP 등의 공정을 수많은 Layer를 만들면서 반복적으로 사용한다.
