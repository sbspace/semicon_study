---
id: m00-l04
module_id: m00
lesson_number: 4
title: 트랜지스터는 어떻게 전기를 켜고 끌까? — MOSFET의 Gate · Source · Drain
estimated_minutes: 15
content_origin: adapted_original
source_url: https://chatgpt.com/share/6aa53330-bbf0-83e8-b34f-53e1dc894671
source_message_ids:
- 8656df7f-6cb2-48f3-918b-d4dfd04d441a
- 94727872-0a6b-4c1c-9c19-ba51e9eaec41
last_updated: '2026-09-12'
kind: lesson
extension_minutes: 10
---

# Module 0 / Lesson 4  

> 기본 수업과 Quiz 예상 15분. 원수업의 표·그림과 설명을 보존했으며, 뒤의 추가 설명은 별도로 이어 읽을 수 있어요.

## 트랜지스터는 어떻게 전기를 켜고 끌까? — MOSFET의 Gate · Source · Drain

이번 수업이 **첫 번째 핵심 관문**이야. 앞에서 배운 `전압`, `전류`, `Capacitance`가 오늘 처음으로 **트랜지스터 하나 안에서 합쳐진다.** 

오늘 목표는 딱 이것이다.

> **Gate에 전압을 걸면 → 전기장으로 Channel을 만들고 → Source와 Drain 사이에 전류가 흐를 수 있게 된다.**

---

## 1. MOSFET부터 그림으로 보자

앞으로 가장 많이 보게 될 기본 트랜지스터가 **MOSFET**이다.

<visual-needed id="visual-006" type="reference-structure" description="반도체/전기 기초: 1. MOSFET부터 그림으로 보자 — 원수업 이미지 위치와 주변 설명을 함께 참고" />

첫 번째 그림에서 지금 볼 것은 딱 네 군데뿐이다.

<interactive type="mosfet-channel" />

```text
                 Gate
                  ↓
           ┌────────────┐
           │   Metal    │
           └────────────┘
              SiO₂
      ─────────────────────

Source   ←   Channel   →   Drain
 n+                         n+

        P-type Silicon
```

**Gate / Source / Drain / Channel**

오늘은 이것만 이해하면 된다.

---

## 2. Source와 Drain부터

트랜지스터를 아주 단순한 수도꼭지라고 생각하자.

```text
Source ───────────── Drain
```

Source와 Drain은 **전류가 드나드는 두 끝**이라고 우선 생각하면 된다.

그런데 가운데 길이 항상 열려 있는 게 아니다.

```text
Source     X X X     Drain
```

중간에 **Channel(채널)**이 제대로 형성되지 않으면 Source와 Drain 사이에 전류가 거의 흐르지 않는다.

→ **Transistor OFF**

반대로 가운데 전기가 흐를 수 있는 길이 만들어지면:

```text
Source =========== Drain
          Channel
```

→ **Transistor ON**

삼성의 설명에서도 트랜지스터는 Gate에 전압을 가하면 Channel을 통해 Source와 Drain 사이로 전류가 흐르도록 동작한다고 설명한다. [GAA | 삼성반도체](https://semiconductor.samsung.com/kr/support/tools-resources/dictionary/gaa-transistors-a-next-generation-process-for-next-generation-semiconductors/?utm_source=chatgpt.com)

---

## 3. 그럼 가운데 길을 누가 만들지?

바로 **Gate**다.

```text
               Gate
                 ↓
             전압 인가

Source        ?????        Drain
```

Gate에 적절한 전압을 걸면 아래 실리콘의 전기적 상태가 변한다.

그래서:

```text
               Gate
              +++++
                ↓
            전기장 발생
                ↓
Source ===== Channel ===== Drain
```

**Channel이 형성된다.**

그러면 Source와 Drain 사이로 전류가 흐를 수 있다.

즉 Gate는 말 그대로:

> **전류가 지나갈 문(Gate)을 여닫는 제어장치**

라고 생각하면 상당히 정확하다.

---

## 4. 그런데 Gate에서 Channel로 전류를 보내는 거야?

**아니다.**

이 부분이 정말 중요하다.

Gate 아래에는 **절연막(Oxide)**이 있다.

```text
        Gate
     +++++++++++
         │
    ─────────────   ← Oxide (절연체)
         │
      Silicon
```

그래서 이상적으로는:

```text
Gate
 ↓
전류가 아래로 쭉 흐름
 ↓
Channel
```

이렇게 동작하는 게 아니다.

대신:

```text
Gate에 전압
      ↓
Gate에 전하 형성
      ↓
────────────  Oxide
      ↓
전기장이 Silicon에 영향
      ↓
Channel 형성
```

이다.

MOSFET의 Gate는 절연막을 사이에 두고 실리콘과 직접 전기적으로 연결되지 않으며, Gate 전압이 실리콘 표면의 전하 분포를 변화시켜 Channel을 만든다. [Insulated-gate Field-effect Transistors (MOSFET) | Solid-state Device Theory | Electronics Textbook](https://www.allaboutcircuits.com/textbook/semiconductors/chpt-2/insulated-gate-field-effect-transistors-mosfet/?utm_source=chatgpt.com)

---

## 5. 어? 이거 아까 Capacitor랑 똑같은데?

<interactive type="mos-capacitor" />

**맞아. 바로 그걸 이해시키려고 지난 수업에서 Capacitor를 먼저 배운 거야.**

지난번 구조:

```text
Metal
────────────

Insulator

────────────
Metal
```

MOSFET Gate 부분:

```text
Gate (도전체)
────────────

Oxide (절연체)

────────────
Silicon
```

굉장히 비슷하지?

그래서 MOS 구조에는 **Capacitance**가 존재한다.

Gate에 전압을 걸려면 Gate 쪽을 어느 정도 **충전**해야 하고, Gate 전압을 낮출 때는 다시 **방전**해야 한다.

이게 지난 질문과 정확히 연결된다.

> **Gate capacitance는 “전하를 꼭 저장해야 하는 별도 창고”가 아니다.**

Gate와 Silicon이 절연막을 사이에 두고 있기 때문에 **자연스럽게 capacitance를 가지는 구조**이고, Gate 전압을 변화시키면 그 capacitance를 충·방전하게 되는 거야. MOSFET Gate에는 정상상태에서 지속적인 Gate 전류가 거의 흐르지 않지만, Gate capacitance를 충전할 때는 일시적인 전류가 필요하다. [Insulated-gate Field-effect Transistors (MOSFET) | Solid-state Device Theory | Electronics Textbook](https://www.allaboutcircuits.com/textbook/semiconductors/chpt-2/insulated-gate-field-effect-transistors-mosfet/?utm_source=chatgpt.com)

---

## 6. 이제 NMOS를 아주 살짝 맛보자

> **편집 보완 — 다음 Lesson 용어 미리 정의:** N형은 전자가 주된 전하 운반자인 반도체, P형은 전자 빈자리인 정공이 주된 운반자인 반도체야. 아래 N+의 +는 높은 도핑 농도를 뜻해. 도핑은 전기적 성질을 조절하려고 특정 원소를 넣는 것이고, 다음 Lesson에서 차근차근 배워.

아직 NMOS/PMOS를 본격적으로 배우지는 않을 거야.

오늘은 **NMOS 하나만 예시**로 보자.

전형적인 NMOS는 이런 구조다.

```text
                   Gate
                +++++++++
                   │
               ─────────   Oxide
                   │
      n+                        n+
    Source                    Drain

            p-type Silicon
```

처음 Gate 전압이 낮으면:

```text
Source    [ 길 없음 ]    Drain

           OFF
```

Source와 Drain 사이에 제대로 된 Channel이 없다.

---

Gate 전압을 충분히 높이면:

```text
                   Gate
                 +++++++
                    ↓
                 전기장
                    ↓

Source ====== Channel ====== Drain

                  ON
```

실리콘 표면에 **전자가 모이면서 전자가 이동할 수 있는 Channel**이 형성된다.

그래서 Source와 Drain 사이가 연결된다. [Insulated-gate Field-effect Transistors (MOSFET) | Solid-state Device Theory | Electronics Textbook](https://www.allaboutcircuits.com/textbook/semiconductors/chpt-2/insulated-gate-field-effect-transistors-mosfet/?utm_source=chatgpt.com)

---

## 7. 그러면 Gate 전압이 높으면 무조건 ON?

> **편집 보완:** 아래 NMOS 예는 Source를 0V로 둔 설명이야. 정확한 기준은 Gate와 Source 사이 전압 차이인 VGS야. 보통의 향상형 NMOS에서는 VGS가 문턱전압보다 충분히 높아야 강한 채널이 형성돼. OFF도 현실에서 완전한 0전류를 뜻하지는 않아.

조금 더 정확하게는 **어떤 기준 전압 이상**이어야 한다.

그 기준을:

## `Threshold Voltage`, $V_{th}$

라고 한다.

한국에서는 **문턱전압 / 임계전압**이라고 많이 부른다.

아주 단순화하면:

```text
Gate voltage < Vth
        ↓
Channel 제대로 안 생김
        ↓
OFF


Gate voltage > Vth
        ↓
Channel 형성
        ↓
ON
```

실제로는 이렇게 딱 잘라 완벽한 ON/OFF가 되는 것은 아니고 $V_{th}$ 아래에서도 작은 누설전류 등이 존재하지만, 지금 단계에서는 이 모델이 충분하다.

---

## 8. 여기서 지난번의 0과 1이 연결된다

Lesson 2에서 배웠지.

```text
LOW voltage  → Logic 0
HIGH voltage → Logic 1
```

이제 그 뒤에 실제 물리적 장치를 붙일 수 있다.

예를 들어 NMOS에서는 단순화해서:

```text
Gate = LOW
   ↓
NMOS OFF


Gate = HIGH
   ↓
NMOS ON
```

즉 **전압이라는 신호를 이용해서 또 다른 전류의 흐름을 제어**하는 것이다.

이게 트랜지스터가 엄청나게 중요한 이유야.

---

## 9. 수도꼭지 비유를 완성하면

MOSFET을 이렇게 생각하면 된다.

```text
                    손잡이
                     ↓
                   Gate
                     │

물 들어옴                          물 나감
Source  ========================  Drain
                 ↑
              Channel
```

손잡이를 움직인다고 손잡이에서 물이 흘러나오는 건 아니지?

손잡이는 **물길을 제어할 뿐**이다.

MOSFET도 비슷하다.

> **Gate는 전류의 주 통로가 아니라 Source–Drain 사이의 통로를 제어한다.**

이 비유가 매우 중요하다.

---

## 10. 그러면 `Source`와 `Drain`이라는 이름은 왜 붙었어?

지금은 간단히:

- **Source** = 전하 운반자가 출발하는 쪽
- **Drain** = 전하 운반자가 빠져나가는 쪽

이라고 생각하면 된다.

다만 NMOS에서 **전자 흐름**과 우리가 정의한 **전류 방향**이 반대라서 처음 배우면 헷갈린다.

예를 들어 흔한 NMOS 조건에서는:

```text
전자 이동
Source ─────────────→ Drain

전류 방향
Source ←───────────── Drain
```

이다.

이건 지금 외우지 않아도 된다.

**오늘 핵심은 Source와 Drain 사이의 길을 Gate가 제어한다는 것**이다.

---

## 11. 왜 Gate가 반도체 미세화에서 그렇게 중요하지?

여기서 파운드리 이야기로 넘어간다.

트랜지스터가 작아지면:

```text
Source          Drain
 │                │
 └──── Channel ───┘
```

Channel 길이가 점점 짧아진다.

```text
Source     Drain
 │           │
 └─Channel───┘
```

너무 짧아지면 Gate가 **Channel을 완벽하게 통제하기 어려워진다.**

Gate가 OFF라고 명령했는데도 Source와 Drain 사이에 전류가 슬금슬금 흐를 수 있다.

→ **Leakage Current**

이게 미세화에서 큰 문제다.

---

## 12. 그래서 Planar → FinFET → GAA가 나온다

아직 구조를 공부할 단계는 아니지만 **큰 그림만 미리 보자.**

옛날 평면형 트랜지스터:

```text
     Gate
 ──────────
   Channel

Gate가 위쪽에서만 제어
```

FinFET:

```text
     ┌ Gate ┐
     │      │
     │Channel
     │      │
     └──────┘

여러 면에서 Channel 제어
```

GAA:

```text
   ┌───────────┐
   │   Gate    │
   │ ┌───────┐ │
   │ │Channel│ │
   │ └───────┘ │
   └───────────┘

Gate가 Channel을 둘러쌈
```

그래서 이름도 **Gate-All-Around**다.

삼성은 GAA를 Gate가 Channel을 더 많이 둘러싸도록 만들어 Channel 제어력을 높이는 차세대 트랜지스터 구조로 설명한다. [GAA | 삼성반도체](https://semiconductor.samsung.com/kr/support/tools-resources/dictionary/gaa-transistors-a-next-generation-process-for-next-generation-semiconductors/?utm_source=chatgpt.com)

나중에 첨단공정 Module에서 제대로 배운다.

---

## 13. 생산 시스템 업무와 연결하면

FAB에서 Photo/Etch/Deposition 같은 수많은 Step을 관리하는 이유가 조금씩 보이기 시작한다.

결국 이런 구조를 만들어야 하는 거야.

```text
          Gate
       ─────────
          Oxide

Source   Channel   Drain
```

그런데 공정이 흔들려서:

- Gate 길이가 달라지거나
- Oxide 두께가 달라지거나
- Source/Drain 위치가 어긋나거나
- Channel 치수가 달라지면

↓

```text
Vth 변화
Leakage 변화
속도 변화
전력 변화
      ↓
Chip Spec 영향
      ↓
Yield 영향
```

이 된다.

그래서 나중에 공정에서 듣게 될:

**CD / Overlay / Thickness / Profile**

같은 관리값은 궁극적으로 **Gate가 Channel을 원하는 대로 제어하도록 만드는 것**과 연결되어 있다. 

---

## 오늘 현업 용어 4개

| 용어 | 오늘 수준에서 이해 |
|---|---|
| **Gate** | Channel을 만들거나 없애 전류를 제어하는 단자 |
| **Source / Drain** | 전류가 흐르는 주 통로의 양쪽 단자 |
| **Channel** | Source와 Drain을 연결하는 전도 경로 |
| **Threshold Voltage (Vth)** | 트랜지스터가 본격적으로 켜지는 기준이 되는 Gate 전압 |

---

## 오늘 반드시 기억할 3줄

**① MOSFET에서 주 전류는 `Gate → Silicon`으로 흐르는 게 아니라 `Source ↔ Drain` 사이로 흐른다.**

**② Gate는 절연막 너머로 전기장을 만들어 Channel을 제어한다.**

**③ 그래서 MOSFET은 `전압으로 전류를 제어하는 초미세 스위치`라고 이해하면 된다.**

---

## 🧠 Lesson 4 퀴즈

### Q1
MOSFET에서 Gate의 가장 중요한 역할은?

A. Source에서 나온 전류를 직접 받아 Drain으로 전달한다.  
B. 전기장을 이용해 Source–Drain 사이 Channel을 제어한다.  
C. Wafer를 보호한다.

### Q2
Gate와 Silicon 사이에 Oxide라는 절연체가 있는데도 Gate가 Silicon에 영향을 줄 수 있는 이유는?

A. 전자가 Oxide를 대량으로 통과하기 때문에  
B. Gate 전압이 만드는 **전기장**이 절연막 너머의 Silicon에 영향을 주기 때문에  
C. Oxide가 금속이기 때문에

### Q3
지난 수업의 Capacitance와 MOSFET Gate는 어떤 관계일까?

A. 아무 관계가 없다.  
B. Gate–Oxide–Silicon 구조가 capacitor와 비슷해서 Gate capacitance가 생긴다.  
C. Gate 안에 별도의 배터리가 있다.

---

### 정답

**Q1 → B**

Gate는 Source–Drain 전류의 **제어 손잡이**다.

**Q2 → B**

전류가 Oxide를 통과해야만 영향을 줄 수 있는 게 아니다. **전기장**으로 Silicon의 전하 분포를 변화시킨다.

**Q3 → B**

이 부분이 특히 중요하다. 지난번에 헷갈렸던 capacitance가 MOSFET에서도 그대로 등장한다.

---

## 수업 중 추가 설명 — 필요할 때 이어 읽기

맞아. 여기서 내가 **개념 계층을 먼저 분명하게 안 잡고 Gate/Source/Drain으로 넘어가서 헷갈릴 만했어.** 아래처럼 정리하면 거의 다 풀려.

## 1. 제일 중요한 것: `트랜지스터 = MOSFET 전체`

**Gate만 트랜지스터가 아니다.**

MOSFET이라는 **트랜지스터 하나** 안에 여러 부분이 있는 거야.

```text
        ┌───────────────┐
        │   Gate        │
        ├───────────────┤
        │ Insulator     │  ← Gate dielectric
        └───────────────┘
              ↓
Source ─── Channel ─── Drain
          Silicon
```

즉,

> **Gate + 절연막 + Source + Drain + Channel/Body 등을 합친 구조 전체 = MOSFET 트랜지스터 하나**

야.

아래 실제 단면 그림으로 보면 훨씬 명확해.

<visual-needed id="visual-007" type="reference-structure" description="반도체/전기 기초: 1. 제일 중요한 것: `트랜지스터 = MOSFET 전체` — 원수업 이미지 위치와 주변 설명을 함께 참고" />

그림의 큰 구조 **전체 하나가 NMOS 트랜지스터 하나**야.

---

## 2. 그러면 Transistor / Resistor / Capacitor 관계는?

이 셋은 **같은 레벨의 '소자 종류'**라고 생각하면 돼.

```text
소자(Device)
 │
 ├─ Transistor
 │    └─ MOSFET
 │         ├─ Gate
 │         ├─ Source
 │         ├─ Drain
 │         └─ Channel ...
 │
 ├─ Resistor
 │
 └─ Capacitor
```

따라서

> **Gate = Capacitor**  
> **Source = Resistor**

이런 대응 관계가 **전혀 아니다.**

Gate / Source / Drain은 **트랜지스터라는 소자의 내부 구성요소**이고,

Transistor / Resistor / Capacitor는 **서로 다른 종류의 소자**야.

이 구분이 핵심이야.

---

## 3. 그런데 왜 Capacitor 배우다가 갑자기 Gate 이야기가 나왔나?

여기가 헷갈리게 만든 부분이야.

Gate 자체가 Capacitor라는 뜻이 아니라,

**MOSFET의 Gate 구조가 전기적으로 Capacitor와 비슷한 성질(Capacitance)을 갖기 때문**이야.

우리가 배운 기본 Capacitor는:

```text
도체
──────────

절연체

──────────
도체
```

였지.

MOSFET에서는 정확히는:

```text
Gate 금속
──────────────
Gate 절연막
──────────────
Silicon
```

이 구조가 된다.

즉 **두 금속 사이가 아니다.**

### `Metal - Insulator - Semiconductor`

구조야.

그래서 이름도 원래:

**M**etal  
**O**xide  
**S**emiconductor

→ **MOS**

야.

그리고 거기에 Field Effect Transistor를 붙여서

**MOS + FET = MOSFET**

이다.

---

## 4. 그럼 `Insulator`는 정확히 뭐야?

**전기가 직접 통하지 않도록 막는 절연막**이야.

옛날부터 대표적으로:

**SiO₂ (Silicon Dioxide, 산화막)**

를 사용했다.

```text
Gate
█████████████████   ← 도체

─────────────────   ← 아주 얇은 절연막

Silicon
░░░░░░░░░░░░░░░░░
```

Gate와 Silicon이 **직접 붙어버리면 전류가 Gate에서 Silicon으로 흘러버리겠지.**

그런데 우리는 Gate에서 전류를 보내고 싶은 게 아니야.

Gate는:

> **전압을 걸어서 전기장으로 아래 Silicon을 조종**

해야 한다.

그래서 사이에 절연막이 있는 거야.

```text
Gate에 +전압
+++++++++++++
     ↓
────────────  ← 절연막: 전자는 직접 못 내려감
     ↓
   전기장
     ↓
Silicon의 전하 상태 변화
     ↓
Channel 생성
```

삼성도 트랜지스터를 **Gate가 Channel을 제어하고 Source와 Drain 사이 전류를 조절하는 구조**로 설명한다. [GAA | 삼성반도체](https://semiconductor.samsung.com/kr/support/tools-resources/dictionary/gaa-transistors-a-next-generation-process-for-next-generation-semiconductors/?utm_source=chatgpt.com)

---

## 5. Source와 Drain도 금속이야?

여기도 조금 더 정확하게 고쳐 잡자.

기본 MOSFET 단면에서 **Source와 Drain의 핵심 영역은 Silicon**이야.

예를 들어 NMOS라면:

```text
          Gate Metal
        █████████████
          절연막
        ─────────────

 n+ Silicon           n+ Silicon
   Source              Drain
      │                  │
      └──── Channel ─────┘

        p-type Silicon
```

다만 실제 칩에서는 Source/Drain에 전기를 연결해야 하니까 **그 위에 금속 Contact와 배선**이 연결된다.

즉 실제로는:

```text
Metal 배선          Metal 배선
    │                   │
 Contact              Contact
    │                   │
 Source              Drain
     \                 /
      \___ Channel ___/
            ↑
           Gate
```

처럼 생각하면 된다.

---

## 6. 그래서 MOSFET 하나를 보면

역할은 이렇게 나뉜다.

| 부분 | 역할 |
|---|---|
| **Gate** | Channel을 켜고 끄는 조종장치 |
| **Gate Insulator** | Gate 전류는 막고 전기장 효과는 전달 |
| **Channel** | 실제 전류가 지나가는 길 |
| **Source** | Channel 한쪽 끝 |
| **Drain** | Channel 반대쪽 끝 |
| **전체 구조** | **Transistor(MOSFET)** |

수도꼭지로 보면:

```text
        손잡이
          ↓
        Gate

Source ========== Drain
        물길
       Channel
```

**수도꼭지 전체 = Transistor**

이고,

**손잡이만 = Gate**

라고 생각하면 돼.

---

## 7. FinFET과 GAA도 `다른 물건`이 아니라 트랜지스터다

이것도 엄청 중요해.

**MOSFET**
이라는 큰 범주 안에서 Channel과 Gate의 **모양을 발전시킨 것**이야.

대략:

```text
MOSFET 트랜지스터

Planar
  ↓
FinFET
  ↓
GAA
```

라고 보면 된다.

아래가 실제 구조를 이해하기 훨씬 좋은 그림들이야.

### FinFET

<visual-needed id="visual-008" type="reference-structure" description="반도체/전기 기초: FinFET — 원수업 이미지 위치와 주변 설명을 함께 참고" />

여기서 회색으로 솟아 있는 **Fin이 Channel**이고, 큰 Gate가 그 Fin을 **위 + 양옆, 3면에서 감싸고 있어.**

그래서 `Fin` + `FET` → **FinFET**.

---

### 삼성 GAA / MBCFET

이건 삼성 공식 자료 그림이 제일 이해하기 좋다.

<visual-needed id="visual-009" type="reference-structure" description="반도체/전기 기초: 삼성 GAA / MBCFET — 원수업 이미지 위치와 주변 설명을 함께 참고" />

왼쪽이 **FinFET**, 오른쪽이 **GAA**야.

차이는:

**FinFET**

```text
Gate가 Channel의
위 + 왼쪽 + 오른쪽

→ 3면 제어
```

**GAA**

```text
Gate가 Channel을
사방으로 둘러쌈

→ 4면/전방위 제어
```

삼성의 GAA에서는 Channel을 얇고 넓은 **Nanosheet** 형태로 여러 층 쌓은 **MBCFET** 구조를 사용한다. Gate가 Channel을 더 완전히 감싸기 때문에 미세화할수록 Channel에 대한 제어력을 높일 수 있다. [기고문 반도체 미세화, 새로운 길을 가다 | 삼성반도체](https://semiconductor.samsung.com/kr/news-events/tech-blog/editorial-making-semiconductor-history-contextualizing-samsungs-latest-transistor-technology/?utm_source=chatgpt.com)

---

## 지금 머릿속 구조를 이렇게 잡으면 돼

이게 오늘 질문에서 **가장 중요한 그림**이야.

```text
반도체 칩
  ↓
수많은 소자(Device)
  ↓
┌─────────────────────────┐
│                         │
├─ Transistor             │
│     ↓                   │
│   MOSFET                │
│     ├ Gate              │
│     ├ Insulator         │
│     ├ Source            │
│     ├ Drain             │
│     └ Channel           │
│                         │
├─ Resistor               │
│                         │
└─ Capacitor              │
                          │
└─────────────────────────┘
```

그리고

**Planar / FinFET / GAA는 모두 MOSFET 트랜지스터를 구현하는 구조의 발전형**이라고 일단 이해하면 된다.

### 딱 3개만 기억하면

**① Gate만 트랜지스터가 아니라, Gate·Source·Drain·Channel 등을 합친 전체가 트랜지스터(MOSFET)다.**

**② Transistor / Resistor / Capacitor는 서로 다른 소자 종류다. Gate / Source / Drain은 그중 Transistor의 내부 구성요소다.**

**③ Gate와 Silicon 사이에는 절연막이 있고, Gate는 그 절연막을 뚫고 전류를 보내는 게 아니라 `전기장`으로 Channel을 제어한다.**

그리고 앞으로 **FinFET/GAA처럼 3차원 구조가 중요한 내용은 지금처럼 짝대기 그림만으로 끝내지 않고 실제 3D 구조 이미지도 같이 붙일게.**

다음 수업: [Lesson 5](lesson-05.md).
