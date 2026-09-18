---
id: m03-l08
module_id: m03
lesson_number: 8
title: Diffusion & Thermal Process — 열을 이용해 반도체의 성질과 막을 바꾼다
estimated_minutes: 15
content_origin: adapted_original
source_url: https://chatgpt.com/share/6aa52f15-5fac-83e8-bda5-c96211eeb771
source_message_ids:
- 208da593-31a1-40ec-96db-e3fe69e0d779
last_updated: '2026-09-12'
kind: lesson
---

# Module 3 / Lesson 8

> 기본 수업과 Quiz 예상 15분. 원수업의 표·그림과 설명을 보존했으며, 뒤의 추가 설명은 별도로 이어 읽을 수 있어요.

## Diffusion & Thermal Process — 열을 이용해 반도체의 성질과 막을 바꾼다

지난 Implant Lesson 마지막에서 **Annealing(열처리)**이 등장했지.

<interactive type="thermal-process" />

```text
Implant
   ↓
Dopant 주입
   ↓
결정 손상 + 아직 충분히 활성화되지 않은 Dopant
   ↓
Annealing 🔥
   ↓
결정 회복 + Dopant 활성화
```

오늘은 회사 8대 공정의 **Diffusion**을 보자.

여기서 한 가지 먼저 주의해야 해.

> 회사에서 말하는 **Diffusion 공정 = 단순히 Dopant를 퍼뜨리는 작업 하나만 뜻한다고 생각하면 안 돼.**

큰 틀에서는 **고온을 이용하는 여러 Thermal Process**와 연결해서 이해하는 게 좋아.

---

## 🎯 오늘 목표

오늘은 네 가지만 잡자.

> **① Diffusion은 Implant와 어떻게 다른가?**  
> **② Annealing은 왜 하는가?**  
> **③ Oxidation으로 SiO₂ 막은 어떻게 만드는가?**  
> **④ CVD로 만든 SiO₂와 Oxidation으로 만든 SiO₂는 뭐가 다른가?**

---

## 1. 먼저 진짜 'Diffusion'의 뜻

### Diffusion = 확산

어떤 원자들이 농도가 높은 곳에서 낮은 곳으로 **열에 의해 이동하는 현상**이라고 생각하면 돼.

예를 들어 Silicon 표면에 Dopant가 많이 있다고 하자.

```text
처음

●●●●●●●●●   ← Dopant 많음
───────────
   Silicon


      🔥 열을 가함
          ↓


시간이 지나면

───────────
● ● ● ● ●
  ●   ●
    ●
───────────
```

Dopant가 Silicon 내부로 퍼져나갈 수 있어.

그래서 과거부터 Dopant를 Silicon 내부에 넣는 중요한 방법으로 **Thermal Diffusion**이 사용되어 왔어.

---

## 2. Implant와 Diffusion은 어떻게 다를까?

지난 시간 Implant는:

```text
Dopant Ion

↓↓↓↓↓↓↓↓↓↓
───────────
 Silicon
```

**전기장으로 Ion을 가속해서 집어넣는 것**이었지.

반면 Diffusion은:

```text
Dopant
●●●●●●
───────────
     🔥
     ↓
 ● ● ●
   ●
───────────
```

**열에 의해 원자가 이동하도록 하는 것**이야.

따라서 직관적으로:

| Implant | Diffusion |
|---|---|
| Ion을 가속해서 주입 | 열에 의해 원자가 확산 |
| Energy로 깊이 등에 영향 | 온도·시간이 확산에 큰 영향 |
| Dose로 주입량 제어 | 농도·온도·시간 등이 중요 |
| 물리적으로 쏴 넣음 | 열에 의해 퍼짐 |

---

## 3. 그런데 현대 공정에서 Implant를 했는데 왜 또 열이 필요할까?

Implant는 Ion을 상당한 에너지로 Silicon에 충돌시키는 과정이야.

Silicon 결정은 원래:

```text
●   ●   ●   ●
●   ●   ●   ●
●   ●   ●   ●
●   ●   ●   ●
```

처럼 규칙적인 **Crystal Lattice(결정 격자)**를 이루고 있어.

그런데 Ion이 들어오면:

```text
       ↓ Ion
       ↓
●   ●  ↓  ●
●  ↙ ●    ●
   ●    ●
●     ●   ●
```

결정에 손상을 줄 수 있어.

그래서 열처리를 한다.

## Annealing

### Annealing = 어닐링 / 열처리

주요 목적을 아주 단순화하면:

**① Implant Damage 회복**

그리고

**② Dopant Activation**

이야.

---

## 4. Dopant Activation이 뭐야?

여기가 조금 중요해.

Dopant는 **Silicon 안에 들어가기만 하면 무조건 제 역할을 하는 게 아니야.**

Dopant가 결정 구조 안에서 적절한 위치를 차지해야 전자나 Hole을 제공하는 등 원하는 전기적 역할을 할 수 있어.

```text
Implant 직후

Si — Si — Si
  Dopant?      ← 위치가 불완전할 수 있음


Annealing 🔥
      ↓

Si — Dopant — Si
      ↑
전기적으로 활성화
```

그래서:

> **Dopant를 넣는 것 = Implant**

와

> **들어간 Dopant가 제대로 전기적 역할을 하게 하는 것 = Activation**

은 구분해서 생각해야 해.

---

## 5. 그런데 열을 너무 오래 주면?

문제가 생길 수 있어.

Dopant도 열을 받으면 **Diffusion**할 수 있으니까.

원래 이렇게 좁게 만들고 싶었는데:

```text
    ●●●
   ●●●●
────────────
```

열을 너무 많이 받으면 더 넓고 깊게 퍼질 수 있어.

```text
  ● ● ● ● ●
 ● ● ● ● ● ●
    ● ● ●
────────────
```

미세공정에서는 원하는 위치와 농도 분포를 정밀하게 유지해야 하니까 이것도 문제가 될 수 있겠지.

그래서 중요한 개념이:

### Thermal Budget

> **공정 전체에서 웨이퍼가 얼마나 높은 온도에, 얼마나 오래 노출되는가**

를 관리하는 개념이야.

첨단공정으로 갈수록 이게 굉장히 중요해져.

지금은:

> **열도 무작정 많이 주면 좋은 게 아니다.**

정도로 기억하면 충분해.

---

## 6. Diffusion/Thermal에서 또 하나 중요한 것: Oxidation

이번에는 Dopant 말고 **Film** 이야기로 돌아가보자.

아까 네가 물어봤지.

> "SiO₂, SiN 같은 게 Film이고 막질인 거지?"

맞아.

그런데 여기서 재미있는 사실이 있어.

**SiO₂ Film을 만드는 방법이 CVD만 있는 게 아니야.**

Silicon 자체를 산화시켜서 SiO₂를 만들 수도 있어.

### Thermal Oxidation

실리콘에 높은 온도에서 산소 계열 분위기를 제공하면:

```text
Before

────────────────
     Silicon


       O₂ + 🔥
          ↓


After

████████████████  SiO₂
────────────────  Silicon
```

Silicon 표면이 반응하면서 **SiO₂ 산화막(Oxide)**이 형성돼.

<visual-needed id="visual-039" type="reference-structure" description="반도체 공정: Thermal Oxidation — 원수업 이미지 위치와 주변 설명을 함께 참고" />

---

## 7. 이건 Deposition과 조금 다르다

이 부분은 꼭 구분하자.

### CVD로 SiO₂를 만든다면

외부에서 공급한 기체 원료들이 반응하면서 **SiO₂ Film을 증착**한다.

```text
   Gas ↓↓↓

████████████████  ← SiO₂ Deposition
────────────────  ← 아래 구조
```

### Thermal Oxidation이라면

**기존 Silicon 자체가 산소와 반응해서 SiO₂가 된다.**

```text
O₂ + Silicon
      🔥
      ↓
    SiO₂
```

즉 결과물은 둘 다 `SiO₂ 계열 막`일 수 있지만 **만드는 원리가 다르다.**

이건 매우 중요한 구분이야.

---

## 8. 그럼 SiO₂ = 무조건 CVD 막이라고 하면 틀리겠네?

**맞아.**

SiO₂라는 이름은 기본적으로 **무슨 물질인가**를 말해.

그걸 **어떻게 만들었는가**는 별개의 문제야.

예를 들어:

```text
             SiO₂ Film
                 │
         ┌───────┴───────┐
         ↓               ↓
   Thermal Oxidation     CVD 등
   Silicon을 산화       증착으로 형성
```

그래서 앞으로는:

> **막질(Material)과 공정 방식(Process)을 분리해서 생각**

하면 좋아.

예를 들면:

**SiO₂**
→ "무슨 막질?"

**CVD**
→ "어떤 방식으로 막을 만들었어?"

이 차이야.

---

## 9. Furnace라는 장비도 알아두자

Thermal Process에서 전통적으로 많이 등장하는 장비가:

### Furnace = 퍼니스 / 확산로

야.

쉽게 말하면 **웨이퍼를 고온에서 처리하는 장비**야.

여러 장의 웨이퍼를 한 번에 처리하는 방식도 있어.

```text
      Furnace

┌─────────────────────┐
│  | | | | | | | |    │
│  W W W W W W W W    │
│                     │
│       🔥🔥🔥          │
└─────────────────────┘

W = Wafer
```

그리고 매우 빠르게 온도를 올렸다 내리는 방식으로:

### RTP / RTA

**Rapid Thermal Processing / Rapid Thermal Annealing**

같은 용어도 현업에서 볼 수 있어.

---

## 10. 왜 빨리 가열하고 빨리 식히고 싶을까?

아까 말한 문제 때문이야.

Annealing은 필요하지만:

> 너무 오랫동안 뜨거움  
> → Dopant가 필요 이상으로 Diffusion될 수 있음

그래서 상황에 따라:

```text
고온
 ↑
 │       /\
 │      /  \
 │     /    \
 │____/      \____
 └───────────────→ 시간

짧은 시간
빠르게 가열/냉각
```

하는 Rapid Thermal Process가 유용할 수 있어.

즉:

> **필요한 열처리는 하되 불필요한 열 영향은 줄이자.**

라는 아이디어야.

---

## 11. 지금까지 7개 공정이 연결됐다

회사 8대 공정 기준으로:

```text
Photo
→ 어디를 가공할지 결정

Etch
→ 원하는 부분 제거

CVD
→ Film 형성

Metal
→ 전기 배선 구조 형성

CMP
→ 평탄화

Implant
→ Dopant를 Silicon에 주입

Diffusion / Thermal
→ 열을 이용한 산화·Anneal·확산 등

Clean
→ 다음 Lesson
```

이제 마지막 하나 남았어.

---

## 🔥 오늘 반드시 기억할 5줄

**① Diffusion = 열에 의해 Dopant 등의 원자가 이동·확산하는 현상이다.**

**② Implant는 Ion을 쏴서 넣는 것이고, Diffusion은 열에 의해 원자가 퍼지는 것이다.**

**③ Implant 후 Annealing은 결정 손상 회복 + Dopant Activation에 중요하다.**

**④ 열을 너무 많이 주면 Dopant가 원치 않게 퍼질 수 있어 Thermal Budget 관리가 중요하다.**

**⑤ SiO₂는 CVD로 증착할 수도 있고, Silicon을 Thermal Oxidation해서 만들 수도 있다.**

---

## 🧠 퀴즈

**Q1. Implant와 Diffusion의 가장 직관적인 차이는?**

→ **Implant = Ion을 가속해서 집어넣음 / Diffusion = 열에 의해 원자가 이동함.**

**Q2. Implant 후 Annealing의 대표적인 두 목적은?**

→ **결정 손상 회복 + Dopant 활성화**

**Q3. `SiO₂`와 `CVD` 중 막질을 나타내는 것은?**

→ **SiO₂.**  
CVD는 그 막을 **형성할 수 있는 공정 방식**이야.

**Q4. Silicon 자체를 산소와 반응시켜 SiO₂를 만드는 것은?**

→ **Thermal Oxidation**

---


## Quiz 정답 및 짧은 해설 — 편집 보완

원문에 각 문항 바로 아래 제시된 정답을 유지하고, 해설을 한곳에 모았어.

1. Implant는 이온 가속 주입, Diffusion은 원자가 열적 운동으로 확산하는 현상이야.
2. 결정 손상 회복과 도펀트 활성화야. 필요 이상 확산되지 않도록 열 이력을 관리해.
3. SiO₂야. CVD는 재료 이름이 아니라 형성 방식이야.
4. Thermal Oxidation이야. 실리콘과 산소의 반응으로 산화막을 성장시키며 실리콘 일부가 소비돼.

## 핵심 용어 — 편집 보완

| 용어 | 뜻 |
|---|---|
| Diffusion | 원자 등이 퍼지는 확산 현상 |
| Anneal | 결정 회복·활성화 등의 목적을 위한 열처리 |
| Thermal Budget | 온도와 시간을 포함한 공정 열 이력 |
| Oxidation | 산소와 반응해 산화물을 만드는 과정 |

다음 수업: [Lesson 9](lesson-09.md).
