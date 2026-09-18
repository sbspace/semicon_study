---
id: m00-l05
module_id: m00
lesson_number: 5
title: N형·P형 반도체 — 실리콘에 왜 일부러 불순물을 넣을까?
estimated_minutes: 15
content_origin: adapted_original
source_url: https://chatgpt.com/share/6aa53330-bbf0-83e8-b34f-53e1dc894671
source_message_ids:
- 59f577a9-286f-4b0d-b4a1-943e35188a0b
last_updated: '2026-09-12'
kind: lesson
---

# Module 0 / Lesson 5  

> 기본 수업과 Quiz 예상 15분. 원수업의 표·그림과 설명을 보존했으며, 뒤의 추가 설명은 별도로 이어 읽을 수 있어요.

## N형·P형 반도체 — 실리콘에 왜 일부러 불순물을 넣을까?

지난 수업에서 **트랜지스터(MOSFET) 전체 안에 Gate / Source / Drain / Channel이 있다**는 구조를 정리했지. 오늘은 그다음 단계로, **NMOS와 PMOS의 N/P가 대체 뭔지** 이해하는 수업이야. 

오늘 목표는 딱 이것이다.

> **순수 실리콘에 특정 원소를 조금 섞어서, 전자가 많은 N형 또는 정공이 많은 P형 반도체를 만든다.**

---

## 1. 순수한 실리콘은 왜 그대로 안 쓰지?

실리콘(Si)은 반도체 재료의 기본이야.

그런데 **아주 순수한 실리콘 자체는 전류를 잘 흘리는 재료가 아니다.**

그래서 우리가 원하는 대로 전기가 잘 흐르게 만들기 위해 **아주 소량의 다른 원소를 섞는다.**

이걸:

## `Doping`

이라고 한다.

그리고 섞는 물질을 **dopant(도펀트)**라고 한다.

삼성 설명에서도 순수 실리콘에 특정 불순물을 넣어 전자나 정공 수를 늘려 전도성을 조절한다고 설명한다. [n형 반도체 | 삼성반도체](https://semiconductor.samsung.com/kr/support/tools-resources/dictionary/semiconductor-glossary-n-type-semiconductor/?utm_source=chatgpt.com)

---

## 2. 왜 하필 다른 원소를 넣으면 전기가 잘 흐르지?

실리콘 원자 하나는 주변 원자들과 전자를 공유해서 꽉 연결되어 있다.

대충 이런 느낌이야.

<interactive type="np-doping" />

```text
Si ─ Si ─ Si
│    │    │
Si ─ Si ─ Si
│    │    │
Si ─ Si ─ Si
```

전자들이 서로 결합에 묶여 있어서 자유롭게 움직이기 어렵다.

그런데 여기에 **전자가 하나 더 많은 원소**를 살짝 넣으면?

남는 전자가 생긴다.

그 전자는 상대적으로 움직이기 쉽다.

---

## 3. N-type = 전자가 남는 반도체

실리콘은 최외각 전자가 4개다.

여기에 대표적으로:

- **Phosphorus(P, 인)**
- **Arsenic(As, 비소)**

처럼 최외각 전자가 **5개인 원소**를 넣는다.

그러면:

```text
          Si
           │
      Si ─ P ─ Si
           │
          Si

P가 가진 전자 5개 중
4개 → 주변 Si와 결합
1개 → 남음
```

그 **남는 전자 하나**가 자유롭게 움직일 수 있게 된다.

그래서 전자가 많은 반도체:

> **N-type semiconductor**

라고 부른다.

`N`은 **Negative**, 즉 음전하를 가진 **전자(electron)**가 주된 전하 운반자라는 뜻으로 이해하면 된다. 삼성도 N형 반도체를 5족 원소를 넣어 전자 수를 증가시킨 반도체로 설명한다. [n-type Semiconductor | Samsung Semiconductor Global](https://semiconductor.samsung.com/support/tools-resources/dictionary/semiconductor-glossary-n-type-semiconductor/?utm_source=chatgpt.com)

---

## 4. P-type은 반대다

이번에는 실리콘보다 전자가 **하나 부족한 원소**를 넣는다.

대표적으로:

- **Boron(B, 붕소)**

는 최외각 전자가 3개다.

```text
          Si
           │
      Si ─ B ─ Si
           │
          Si
```

주변 실리콘과 결합하려면 전자 하나가 부족하다.

그래서:

```text
전자 하나가 있어야 할 자리

     ○  ← 비어 있음
```

이런 **빈자리**가 생긴다.

이걸:

## `Hole(정공)`

이라고 한다.

삼성 설명에서도 P형은 붕소 같은 3족 원소를 넣어 정공의 수를 증가시킨 반도체라고 설명한다. [p-type Semiconductor | Samsung Semiconductor Global](https://semiconductor.samsung.com/support/tools-resources/dictionary/semiconductor-glossary-p-type-semiconductor/?utm_source=chatgpt.com)

---

## 5. Hole은 진짜 입자야?

여기서 굉장히 중요해.

**Hole이라는 새로운 물질이나 입자가 생기는 건 아니야.**

그냥:

> **“전자 하나가 비어 있는 자리”**

를 하나의 +전하처럼 취급하는 거야.

예를 들어 영화관 좌석으로 생각해보자.

```text
사람 사람 [빈자리] 사람 사람
```

오른쪽 사람이 빈자리로 이동하면:

```text
사람 사람 사람 [빈자리] 사람
```

실제로 이동한 건 **사람**이지?

그런데 빈자리만 보면:

```text
빈자리가 오른쪽으로 이동한 것처럼 보임
```

전기도 똑같아.

전자들이 빈자리로 이동하면서:

> **Hole이 반대 방향으로 움직이는 것처럼 보인다.**

그래서 P형에서는 Hole을 **양전하 운반자**처럼 계산한다.

---

## 6. N형과 P형을 한 번에 비교

| | N-type | P-type |
|---|---|---|
| 대표 Dopant | P, As | B |
| 실리콘 대비 전자 | 하나 많음 | 하나 부족 |
| 주된 운반자 | **Electron** | **Hole** |
| 이름 이미지 | Negative | Positive |

다만 중요한 주의점:

> **N형 자체가 전체적으로 음전하이고 P형 자체가 전체적으로 양전하라는 뜻은 아니다.**

전체 재료는 기본적으로 **전기적으로 중성**이다.

단지 **전류를 운반하기 쉬운 주된 운반자가 무엇인가**를 N/P로 구분하는 거야.

이거 꽤 자주 오해한다.

---

## 7. 실제 공정에서는 어떻게 넣어?

여기서 처음으로 **8대 공정과 직접 연결**된다.

웨이퍼에 붕소나 인을 손으로 섞을 순 없지.

대표적으로 사용하는 방법이:

## `Ion Implantation`
### 이온주입

이다.

**이온(Ion)**은 전하를 띤 원자나 분자야. 원하는 원소를 이온으로 만들고 **고속으로 웨이퍼 안에 쏴 넣는다.**

삼성 설명처럼 Ion Implantation은 P, As 또는 B 등의 이온을 웨이퍼의 원하는 깊이에 주입해 N형/P형 전기적 특성을 만드는 공정이다. [The Addition of Electrical Properties | Samsung Semiconductor Global](https://semiconductor.samsung.com/support/tools-resources/fabrication-process/eight-essential-semiconductor-fabrication-processes-part-6-deposition-and-ion-implantation-for-the-electrical-properties/?utm_source=chatgpt.com)

대충:

```text
P / As / B 이온
↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

───────────────  Wafer 표면
    ↓ ↓ ↓
   Silicon
```

라고 보면 된다.

나중에 공정 Module에서 이 장비와 Dose/Energy까지 제대로 배울 거야. 여기서 Dose는 단위 면적당 주입량, Energy는 주입 에너지라는 뜻만 알아두자.

---

## 8. 이게 MOSFET하고 어떻게 연결돼?

지난번 NMOS 그림을 다시 생각해보자.

```text
       Gate
        ↓
   ──────────

 n+             n+
Source         Drain

    p-type
   Silicon
```

여기서 갑자기 의미가 보이지?

### NMOS에서는

- Source → **N형**
- Drain → **N형**
- Body → 보통 **P형**

으로 구성한다.

그래서 이름이:

> **N-channel MOSFET → NMOS**

이다.

Gate에 적절한 +전압을 걸면 P형 영역 표면에 전자가 모이고, Source와 Drain 사이에 **N형처럼 전자가 잘 움직일 수 있는 Channel**이 만들어진다.

---

## 9. PMOS는 반대

PMOS는 대략:

```text
       Gate
        ↓
   ──────────

 p+             p+
Source         Drain

    n-type
   Silicon
```

처럼 반대 구조를 사용한다.

여기서는 주로 **Hole**을 이용한다.

그래서 아주 크게만 보면:

```text
NMOS → Electron 중심
PMOS → Hole 중심
```

이라고 기억하면 된다.

다음 Module에서 NMOS/PMOS 동작을 제대로 비교할 거야.

---

## 10. 왜 굳이 N형과 P형 둘 다 필요하지?

이 질문은 다음 수업의 핵심인데, 미리 맛보기만 하자.

NMOS 하나만 가지고도 스위치를 만들 수 있다.

그런데 NMOS와 PMOS를 **짝으로 사용하면** 전력을 효율적으로 쓰면서 0과 1을 만들 수 있다.

그 구조가 바로:

## `CMOS`

다.

CPU, GPU, SoC 같은 현대 디지털 로직의 기본이다.

대략:

```text
PMOS
  │
  ├── Output
  │
NMOS
```

두 종류를 서로 보완적으로 사용한다.

그래서:

**Complementary MOS**

→ **CMOS**

라는 이름이 붙었다.

---

## 11. 생산 시스템 관점에서는?

Doping도 결국 공정 조건이 정확해야 한다.

예를 들어 Ion Implant에서:

- 어떤 원소를 넣는가
- 얼마나 많이 넣는가 (**Dose**)
- 얼마나 깊게 넣는가 (**Energy**)

가 달라지면:

```text
Ion Implant 조건 변화
        ↓
Doping 농도/깊이 변화
        ↓
트랜지스터 전기적 특성 변화
        ↓
Vth / Leakage / Drive current 변화
        ↓
Chip 성능·전력 변화
        ↓
Yield 영향
```

으로 이어진다.

즉 생산 시스템에서 **Recipe가 조금 달라졌다**는 게 단순히 장비 설정값 하나의 문제가 아니라, 결국 **MOSFET이 제대로 켜지고 꺼지느냐**까지 연결되는 거야. 

---

## 오늘 현업 용어 4개

| 용어 | 의미 |
|---|---|
| **Doping** | 실리콘에 특정 불순물을 넣어 전기적 특성을 바꾸는 것 |
| **Dopant** | 넣는 불순물 원소 |
| **N-type** | 자유전자가 주요 운반자인 반도체 |
| **P-type** | Hole이 주요 운반자인 반도체 |

추가로:

**Ion Implantation = Dopant 이온을 웨이퍼 내부로 주입하는 공정**

정도로 기억하면 충분하다.

---

## 오늘 반드시 기억할 3줄

**① 순수 Silicon에 Dopant를 넣어 전기가 흐르는 특성을 조절한다.**

**② N형은 전자가 많고, P형은 Hole이 많다.**

**③ NMOS/PMOS의 N/P는 바로 이 N형/P형 반도체 개념에서 나온다.**

---

## 🧠 Lesson 5 퀴즈

### Q1
N형 반도체에서 전류 운반에 주로 관여하는 것은?

A. Electron  
B. Hole  
C. Gate

### Q2
Hole은 무엇인가?

A. 새로운 양전하 입자  
B. 전자가 비어 있는 자리  
C. 실리콘에 뚫린 실제 구멍

### Q3
실리콘에 Boron(B)을 넣으면 일반적으로 어떤 타입을 만드는 데 사용될까?

A. N-type  
B. P-type  
C. Metal

---

## 정답

**Q1 → A. Electron**

**Q2 → B. 전자가 비어 있는 자리**

Hole 자체가 새로운 입자는 아니고, 전자가 이동할 때 **빈자리가 움직이는 것처럼 표현하는 개념**이야.

**Q3 → B. P-type**

Boron은 실리콘보다 결합에 사용할 전자가 하나 부족해서 Hole을 만든다. [p형 반도체 | 삼성반도체](https://semiconductor.samsung.com/kr/support/tools-resources/dictionary/semiconductor-glossary-p-type-semiconductor/?utm_source=chatgpt.com)

---

다음 연결: [Module 전체 복습](review.md).
