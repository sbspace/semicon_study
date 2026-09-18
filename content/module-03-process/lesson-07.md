---
id: m03-l07
module_id: m03
lesson_number: 7
title: Implant — 실리콘에 전기적 성질을 심는다
estimated_minutes: 15
content_origin: adapted_original
source_url: https://chatgpt.com/share/6aa52f15-5fac-83e8-bda5-c96211eeb771
source_message_ids:
- 44abf433-865d-4989-afef-064c3a4e04e6
last_updated: '2026-09-12'
kind: lesson
---

# Module 3 / Lesson 7

> 기본 수업과 Quiz 예상 15분. 원수업의 표·그림과 설명을 보존했으며, 뒤의 추가 설명은 별도로 이어 읽을 수 있어요.

## Implant — 실리콘에 전기적 성질을 심는다

지금까지는 주로 **막을 만들고 → 패턴을 만들고 → 깎고 → 평탄화**하는 공정을 봤어.

이번에는 성격이 조금 달라.

<interactive type="implant-profile" />

```text
CVD      → Film을 만든다
Photo    → 위치를 정한다
Etch     → Film을 깎는다
CMP      → 평평하게 만든다

Implant  → Silicon의 전기적 성질을 바꾼다 ★
```

Module 0에서 배웠던 **N형 / P형 반도체와 Dopant**가 실제 FAB 공정으로 연결되는 시간이라고 보면 돼.

---

## 🎯 오늘 목표

세 가지만 이해하면 돼.

> **① Implant는 무엇을 넣는 공정인가?**  
> **② 왜 Silicon에 불순물을 일부러 넣는가?**  
> **③ Photo와 Implant는 어떻게 연결되는가?**

---

## 1. 순수 Silicon만으로는 원하는 트랜지스터를 만들기 어렵다

Silicon 자체도 반도체지만, 우리가 원하는 전기적 특성을 만들기 위해 **아주 소량의 특정 원소**를 넣어준다.

이 원소를:

### Dopant = 도펀트, 불순물

이라고 했었지.

대표적으로 크게 보면:

```text
Silicon
   │
   ├─ Donor 계열 Dopant
   │       ↓
   │     N-type
   │
   └─ Acceptor 계열 Dopant
           ↓
         P-type
```

대표적인 예로:

- **Phosphorus(P), Arsenic(As)** → N-type 형성에 사용
- **Boron(B)** → P-type 형성에 사용

즉 여기서 말하는 `P`는 **P-type의 P가 아니라 원소기호 Phosphorus**라는 점은 조심해야 해.

---

## 2. Implant = Ion Implantation

정식 명칭은:

### Ion Implantation = 이온 주입

이야.

**Ion(이온)**은 전하를 띤 원자나 분자야. Dopant 원자를 **Ion(이온)** 상태로 만들고, 전기장으로 아주 빠르게 가속해서 웨이퍼에 쏜다.

```text
     Dopant Ion

     ↓  ↓  ↓  ↓
     ↓  ↓  ↓  ↓
     ↓  ↓  ↓  ↓

─────────────────
      Silicon

          ↓

────●──●────●────
──●──────●────●──
      Silicon

● = 들어간 Dopant
```

즉 Film을 위에 **쌓는 것**이 아니야.

> **Implant = Dopant를 Silicon 내부로 집어넣는 것**

이 핵심이야.

<visual-needed id="visual-038" type="reference-structure" description="반도체 공정: Ion Implantation = 이온 주입 — 원수업 이미지 위치와 주변 설명을 함께 참고" />

---

## 3. 그런데 아무 데나 Dopant를 넣으면 안 되겠지?

여기서 **Photo가 다시 등장한다.**

예를 들어 가운데 부분에만 Dopant를 넣고 싶다고 해보자.

먼저 Photo로 PR Mask를 만든다.

```text
PR      █████       █████
        █████       █████

Silicon ─────────────────
```

그리고 Implant:

```text
Ion     ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓

PR      █████       █████
        █████       █████
                    ↓↓↓
Silicon ───────────●●●───
                  ●●●
```

PR로 덮여 있는 부분은 Implant를 막아주고,

**열려 있는 부분에 선택적으로 Ion을 주입**할 수 있어.

즉:

```text
Photo
 ↓
"어디에 넣을지" 결정

Implant
 ↓
그 위치에 실제 Dopant 주입
```

지난번 Photo + Etch 관계와 매우 비슷하지.

### Photo + Etch

> Photo가 위치 결정 → Etch가 그 부분을 깎음

### Photo + Implant

> Photo가 위치 결정 → Implant가 그 부분에 Dopant를 넣음

그래서 Photo는 여러 공정의 **패턴/위치 결정 역할**을 한다고 했던 거야.

---

## 4. Implant에서 무엇을 조절할까?

이온을 총알처럼 쏜다고 생각하면 직관적이야.

두 가지가 특히 중요해.

### ① Energy

> **얼마나 세게 쏘느냐**

에너지가 높으면 일반적으로 Ion이 더 깊은 영역까지 들어갈 수 있어.

```text
낮은 Energy

────●──●──────
──●───────────


높은 Energy

──────────────
──────●───────
──●──────●────
────●─────────
```

### ② Dose

> **얼마나 많은 Ion을 넣느냐**

```text
Low Dose

──●──────●─────
─────●─────────


High Dose

─●●──●─●●──●──
●──●●──●──●●──
```

그래서 아주 단순하게:

> **Energy → 얼마나 깊게**  
> **Dose → 얼마나 많이**

라고 먼저 기억하면 돼.

실제로는 분포가 더 복잡하지만 지금은 이 정도면 충분해.

---

## 5. 그런데 Ion을 세게 때려 넣으면 Silicon은 괜찮을까?

당연히 영향이 생겨.

Silicon 원자들은 원래 규칙적인 **Crystal Lattice(결정 격자)**를 이루고 있어.

```text
정상 Silicon

●   ●   ●   ●
●   ●   ●   ●
●   ●   ●   ●
●   ●   ●   ●
```

여기에 고에너지 Ion을 충돌시키면:

```text
Implant 후

●   ●    ●   ●
  ●   ×
●      ●     ●
    ×     ●
●   ●       ●
```

결정 구조에 손상이 생길 수 있어.

그리고 들어간 Dopant도 **들어갔다고 즉시 모두 원하는 전기적 역할을 하는 것은 아니야.**

그래서 Implant 뒤에 중요한 과정이 필요해.

## Annealing

### Anneal = 열처리

웨이퍼에 열을 가해서:

> **① Implant로 생긴 결정 손상을 회복하고**  
> **② Dopant가 전기적으로 활성화될 수 있도록 한다.**

라고 이해하면 돼.

```text
Implant
   ↓
Dopant 주입 + 결정 손상
   ↓
Annealing
   ↓
결정 회복 + Dopant 활성화
```

이 부분이 다음에 배울 **Diffusion/열공정**과 연결된다.

---

## 6. NMOS / PMOS와 연결하면?

Module 1에서 MOSFET의:

- Source
- Drain
- Gate

를 배웠지.

아주 단순화한 NMOS 구조를 보면:

```text
      Gate
       ███
       ███

 N+             N+
Source         Drain
█████           █████
─────────────────────
     P-type Body
```

여기 있는 `N+` 같은 영역은 그냥 원래 Silicon이 저절로 그렇게 생긴 게 아니야.

**Doping 공정을 통해 원하는 전기적 특성을 만든 영역**이야.

마찬가지로 PMOS에서는 반대 극성의 도핑 영역들이 필요하지.

그래서 Module 1에서 그림으로만 봤던:

```text
Source | Gate | Drain
```

이 실제 제조 단계에서는 **Photo + Implant + Anneal 등의 공정**과 연결되는 거야.

---

## 7. N+의 `+`는 무슨 뜻일까?

이것도 현업에서 자주 보니까 지금 알아두자.

```text
N-     N     N+
```

이때 `+`는 양전하라는 뜻이 아니야.

### N+

→ **N-type 중에서도 Dopant 농도가 높은 영역**

### P+

→ **P-type 중에서도 Dopant 농도가 높은 영역**

이라는 뜻이야.

반대로 `N-`, `P-`는 상대적으로 낮게 도핑된 영역을 의미해.

즉:

> **+ = Heavy Doping**  
> **- = Light Doping**

정도로 보면 돼.

---

## 8. Implant와 Deposition을 절대 헷갈리지 말자

둘 다 웨이퍼에 뭔가를 넣거나 붙이는 것처럼 보여서 처음엔 헷갈려.

### Deposition

```text
██████████████  ← 새로운 Film
──────────────── Silicon
```

**표면 위에 새로운 막을 만든다.**

### Implant

```text
──────────────── Silicon
──●──●────●────
────●──●────────
```

**Silicon 내부에 Dopant를 넣어 전기적 특성을 바꾼다.**

이 차이가 핵심이야.

---

## 9. 그러면 Diffusion이랑 Implant는 뭐가 다른데?

좋은 다음 연결점이 여기야.

둘 다 **Dopant**와 관련된 용어라 헷갈릴 수 있어.

아주 간단히 예고만 하면:

### Implant

> Ion을 **가속해서 직접 집어넣는다.**

### Diffusion

> 높은 온도에서 원자들이 **열에 의해 이동/확산**한다.

비유하면:

```text
Implant
→ 총으로 Dopant를 쏴서 넣기 🎯


Diffusion
→ 열을 줘서 Dopant가 퍼져나가게 함 🌡️
```

다만 회사의 `Diffusion` 조직/공정 범위는 단순히 **도펀트 확산 하나만 의미한다고 보면 안 돼.** 산화(Oxidation), 열처리(Anneal) 등 여러 **Thermal Process**와 연결해서 이해하는 게 좋아.

이건 다음 Lesson에서 제대로 보자.

---

## 10. 지금까지 공정 연결

이제 상당히 많은 게 이어졌다.

```text
CVD / Deposition
→ Film을 만든다

Photo
→ 어디를 가공할지 정한다

Etch
→ Film을 깎는다

Metal
→ 배선을 만든다

CMP
→ 평탄화한다

Implant
→ Dopant를 주입해
  Silicon의 전기적 특성을 바꾼다

Diffusion / Thermal
→ 다음 Lesson
```

---

## 오늘 핵심 용어 4개

| 용어 | 의미 |
|---|---|
| **Dopant** | Silicon의 전기적 특성을 바꾸기 위해 넣는 원소 |
| **Ion Implantation** | Dopant Ion을 가속해 Silicon에 주입 |
| **Dose** | 얼마나 많이 주입하는가 |
| **Energy** | 주입 깊이에 큰 영향을 주는 조건 |

> **편집 보완:** Dose는 정확히 단위 면적당 주입한 이온 수로 다루며, 체적당 도핑 농도와 같은 단위가 아니야. 깊이는 Energy 외에도 이온 종류와 재료·입사 조건의 영향을 받아.

그리고 하나 추가:

**Annealing** = Implant 후 결정 손상 회복 + Dopant 활성화를 위한 열처리.

---

## 🔥 오늘 반드시 기억할 4줄

**① Implant는 Film을 쌓는 게 아니라 Dopant를 Silicon 내부에 넣는 공정이다.**

**② Dopant를 이용해 N-type / P-type 같은 원하는 전기적 특성을 만든다.**

**③ Photo와 함께 사용하면 원하는 위치에 선택적으로 Implant할 수 있다.**

**④ Implant 후에는 결정 손상 회복과 Dopant 활성화를 위해 Annealing이 중요하다.**

---

## 🧠 퀴즈

**Q1. Implant에서 Energy와 Dose의 차이는?**

→ **Energy = 얼마나 깊게 들어갈지에 큰 영향 / Dose = 얼마나 많이 넣을지**

**Q2. Implant와 CVD의 가장 큰 차이는?**

→ **CVD는 표면에 Film을 형성하고, Implant는 Silicon 내부에 Dopant를 주입한다.**

**Q3. `N+`의 `+`는 양전하를 의미한다?**

→ **아니야.** N-type 중에서도 **Dopant 농도가 높은(Heavy Doped) 영역**이라는 의미야.

---


## Quiz 정답 및 짧은 해설 — 편집 보완

원문에 각 문항 바로 아래 제시된 정답을 유지하고, 해설을 한곳에 모았어.

1. Energy는 주입 깊이에 큰 영향을 주고 Dose는 단위 면적당 주입량이야.
2. CVD는 막 형성, Implant는 내부 도펀트 주입이야.
3. 아니야. N+는 고농도 N형이라는 뜻이며 재료 전체가 양전하라는 뜻이 아니야.

다음 수업: [Lesson 8](lesson-08.md).
