---
id: m03-l02
module_id: m03
lesson_number: 2
title: Photo 공정 — 빛으로 웨이퍼에 회로의 위치를 그린다
estimated_minutes: 15
content_origin: adapted_original
source_url: https://chatgpt.com/share/6aa52f15-5fac-83e8-bda5-c96211eeb771
source_message_ids:
- 3cfe5b61-163c-4347-963a-64b488a3ea7f
- 08b9911d-c12a-4c0b-b979-c0a7da3fdc32
- b9b98df9-7b93-49cd-95df-4e9facdcf855
last_updated: '2026-09-12'
kind: lesson
extension_minutes: 5
---

# Module 3 / Lesson 2

> 기본 수업과 Quiz 예상 15분. 원수업의 표·그림과 설명을 보존했으며, 뒤의 추가 설명은 별도로 이어 읽을 수 있어요.

## Photo 공정 — 빛으로 웨이퍼에 회로의 위치를 그린다

지난 시간에 전체 공정 지도를 잡았어. 이제부터는 회사에서 쓰는 **8대 공정 분류(Photo / Etch / Metal / CVD / CMP / Implant / Diffusion / Clean)**와 연결해서 하나씩 보자.

오늘은 그중 **Photo**야.

## 🎯 오늘 목표

Photo 공정은 딱 이 문장부터 잡으면 돼.

> **Photo는 실리콘을 직접 깎는 공정이 아니다.  
> 뒤의 Etch나 Implant가 "어디를 가공할지" 지정하는 패턴을 만드는 공정이다.**

---

## 1. 왜 Photo가 필요할까?

웨이퍼의 아주 작은 특정 위치만 깎고 싶다고 해보자.

<interactive type="photo-pattern-transfer" />

```text
웨이퍼

────────────────────
       ↑
    여기만 깎고 싶음
```

Etch 장비에게 그냥 "여기만 깎아"라고 할 수는 없겠지.

그래서 먼저 웨이퍼 위에 **보호막 역할을 하는 감광성 물질**을 바르고, 원하는 모양으로 패턴을 만든다.

이 물질이 바로:

> **편집 보완:** 아래에서 가공 대상 Film을 말할 때는 Photo에 들어오기 전에 증착·산화 등으로 형성한 얇은 막을 뜻해. 막을 식각하는 예의 층 순서는 위부터 PR → Film → Wafer/하부 구조야. 앞부분의 PR/Wafer 두 줄 그림은 중간 Film을 생략한 원수업 개략도이며, 이 생략을 뒤의 추가 설명에서 바로잡았어.

### PR = Photoresist

이야.

<visual-needed id="visual-029" type="reference-structure" description="반도체 공정: PR = Photoresist — 원수업 이미지 위치와 주변 설명을 함께 참고" />

---

## 2. 전체 과정부터 보자

Photo를 아주 단순화하면:

```text
Wafer
 ↓
① PR 도포
 ↓
② Mask를 이용해 빛 조사 (Exposure)
 ↓
③ 빛에 노출된 PR 성질 변화
 ↓
④ Develop
 ↓
⑤ PR Pattern 완성
```

하나씩 보자.

---

## 3. ① PR을 바른다 — Coating

웨이퍼 위에 **Photoresist(PR)**를 바른다.

```text
PR      █████████████████
Wafer   ─────────────────
```

PR은 그냥 페인트가 아니야.

> **빛을 받으면 화학적 성질이 변하는 물질**

이야.

웨이퍼를 빠르게 회전시키면서 PR을 균일하게 펴 바르는 **Spin Coating** 방식이 대표적이야.

---

## 4. ② Mask를 통해 빛을 쏜다 — Exposure

이제 우리가 만들고 싶은 회로 패턴 정보가 필요해.

그 역할을 하는 것이 **Mask**야.

정확히는 첨단 노광에서는 **Reticle**이라는 표현도 많이 사용해.

```text
       빛 ↓ ↓ ↓ ↓ ↓

       MASK / RETICLE
       ███     █████
          ↓↓↓

PR     ███████████████
Wafer  ───────────────
```

Mask에 들어있는 패턴에 따라 빛이 선택적으로 전달된다.

이 과정이:

> **Exposure = 노광**

이야.

여기서 중요한 포인트.

**Mask 자체를 웨이퍼에 찍어 붙이는 게 아니야.**

광학계를 이용해서 Mask/Reticle의 패턴을 웨이퍼 위 PR에 **노광하여 전사**하는 거야.

---

## 5. ③ PR은 빛을 받은 곳과 안 받은 곳이 달라진다

여기서 PR의 특성이 사용돼.

대표적으로 두 종류가 있어.

### Positive PR

빛을 받은 부분이 현상액에 **잘 녹게 된다.**

```text
빛 받은 곳
    ↓
████████████   PR
    ↓
 Develop
    ↓
████    ████
```

### Negative PR

반대로 빛을 받은 부분이 **남는다.**

지금 단계에서는 둘 다 외울 필요 없어.

우선:

> **PR은 빛을 받은 영역의 화학적 특성이 달라진다.**

이것만 기억하면 충분해.

---

## 6. ④ Develop — 현상

Exposure 직후에는 PR이 눈에 보이게 뻥 뚫려 있는 게 아니야.

빛 때문에 **PR의 화학적 성질이 바뀐 상태**일 뿐이야.

그래서 현상액을 이용해서 선택적으로 PR을 제거한다.

이게:

### Develop = 현상

이야.

그러면 드디어:

```text
PR Pattern

██████        ██████
██████        ██████
────────────────────
       Wafer
```

처럼 PR 패턴이 만들어진다.

---

## 7. 그런데 여기까지도 실리콘은 안 깎였다

이게 오늘 가장 중요한 부분이야.

Photo가 끝난 상태:

```text
PR     ████      ████
Film   ██████████████
Wafer  ──────────────
```

우리가 만든 것은 **PR의 모양**이지 아래 Film을 깎은 게 아니야.

이제 이 웨이퍼가 **Etch 공정**으로 넘어간다고 생각해보자.

Etch하면:

```text
PR     ████      ████
              ↓ Etch

Film   ████      ████
Wafer  ──────────────
```

PR이 보호하지 않는 부분의 Film을 제거할 수 있다.

그리고 PR까지 제거하면:

```text
Film   ████      ████
Wafer  ──────────────
```

원래 Mask가 가지고 있던 패턴이 실제 Film 구조로 옮겨진 셈이지.

그래서:

> **Photo가 설계도를 그린다면, Etch가 그 설계도대로 실제 구조를 깎는다.**

라고 생각하면 굉장히 편해.

---

## 8. Photo 다음에 꼭 Etch만 오는 건 아니다

여기서 지난 질문과 연결해서 한 단계 더 가자.

Photo로 만든 PR pattern은 **"여기만 처리하세요"라는 가이드**이기 때문에 다른 공정에도 사용할 수 있어.

대표적으로 **Implant**가 있어.

```text
PR     ████      ████
                 ↓↓↓
                Ion
                 ↓↓↓
Wafer  ─────────────────
          N-type 영역
```

PR 등으로 보호된 곳에는 이온이 들어가는 것을 막고, 열린 영역에는 Implant를 수행할 수 있어.

그래서:

```text
Photo → Etch

Photo → Implant
```

둘 다 가능해.

즉 **Photo는 특정 공정 하나에 종속된 공정이라기보다, 웨이퍼의 "어느 위치를 처리할 것인가"를 정의하는 핵심 기술**이라고 이해하면 좋아.

---

## 9. 왜 미세공정에서 Photo가 그렇게 중요할까?

CPU/GPU의 트랜지스터는 엄청 작지.

결국 Photo가 얼마나 작은 패턴을 정확하게 만들어낼 수 있느냐가 중요해진다.

여기서 유명한 장비가:

### Stepper / Scanner

그리고 회사 이름으로는 [ASML](https://www.asml.com/)을 자주 듣게 돼.

<visual-needed id="visual-030" type="reference-structure" description="반도체 공정: Stepper / Scanner — 원수업 이미지 위치와 주변 설명을 함께 참고" />

첨단 공정에서 사용하는 **EUV(Extreme Ultraviolet)**도 결국 Photo 기술이야.

EUV의 파장은 약 **13.5 nm**이고, 기존 ArF 노광에서 사용하는 **193 nm**보다 훨씬 짧다.

대략적인 직관은:

> **더 짧은 파장의 빛 → 더 미세한 패턴을 구현하는 데 유리**

야.

다만 `3 nm 공정 → 3 nm 파장의 빛을 사용한다`는 뜻은 **절대 아니야.**

공정 노드 이름과 노광 파장은 서로 다른 개념이야.

---

## 10. 회사에서 Photo 부서는 뭘 중요하게 볼까?

아직 깊게 들어갈 필요는 없지만 현업 용어 몇 개만 눈에 익혀두자.

**CD (Critical Dimension)**  
→ 패턴의 중요한 선폭/치수

**Overlay**  
→ 이전 Layer와 이번 Layer의 패턴이 얼마나 정확하게 정렬되었는가

예를 들어:

```text
Layer 1    │ │

Layer 2    │ │     ← 정확히 맞음
           ↑
         Good


Layer 1    │ │

Layer 2      │ │   ← 옆으로 밀림
             →
        Overlay Error
```

반도체는 Layer를 계속 쌓기 때문에 **각 Layer의 위치가 정확히 맞아야 해.**

Module 2에서 Metal Layer가 여러 층 쌓인다고 배웠잖아.

Photo가 잘못 정렬되면 위아래 구조의 연결 자체가 틀어질 수 있어.

---

## 오늘의 핵심 용어 4개

| 용어 | 의미 |
|---|---|
| **PR** | 빛에 반응하는 감광성 물질 |
| **Exposure** | Mask/Reticle 패턴을 빛으로 PR에 노광 |
| **Develop** | 반응한 PR을 선택적으로 제거해 패턴 형성 |
| **Overlay** | 서로 다른 Layer 패턴 간 정렬 정확도 |

---

## 🔥 오늘 반드시 기억할 4줄

**① Photo는 웨이퍼를 직접 깎는 공정이 아니다.**

**② PR을 바르고 → Mask/Reticle을 이용해 Exposure → Develop하여 PR 패턴을 만든다.**

**③ 이 PR 패턴을 이용해 뒤에서 Etch나 Implant 등의 가공 위치를 정할 수 있다.**

**④ 미세화될수록 CD와 Overlay 제어가 매우 중요해지고, 첨단 노광에서는 EUV가 핵심 기술 중 하나다.**

---

## 🧠 퀴즈

**Q1. Photo가 끝난 직후 실제 Film까지 원하는 모양으로 깎여 있는가?**

A. 그렇다  
B. 아니다

→ **정답 B.** 기본적으로 Photo는 PR 패턴을 형성하는 단계이고, 실제 Film 제거는 이후 Etch 등이 담당한다.

**Q2. Exposure와 Develop의 차이는?**

A. Exposure가 빛으로 PR의 성질을 변화시키고, Develop이 선택적으로 PR을 제거한다.  
B. 둘 다 PR을 물리적으로 깎는다.

→ **정답 A.**

**Q3. Overlay가 중요한 이유는?**

A. 웨이퍼를 더 반짝이게 하기 위해  
B. 서로 다른 Layer의 패턴 위치를 정확히 맞추기 위해  
C. 웨이퍼를 평평하게 만들기 위해

→ **정답 B.**

## 수업 중 추가 설명 — 필요할 때 이어 읽기

맞아. **그 부분은 내가 설명을 잘못 이어갔어.** `Film`이 갑자기 등장하면 당연히 "언제 생겼지?"가 돼. 정확한 그림을 다시 잡자.

## 1. Film은 누가 만들었나?

**Photo 전에 이미 다른 공정에서 만들어놓은 막**이야.

대표적으로 **CVD / ALD / PVD / 산화(Oxidation) 등**으로 만들어진 막일 수 있어.

예를 들어 CVD에서 SiO₂ 막을 만들었다고 해보자.

```text
① 처음
Wafer  ─────────────────

② CVD 등으로 Film 형성
Film   █████████████████
Wafer  ─────────────────

③ Photo 공정으로 이동

④ Film 위에 PR 도포
PR     ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
Film   █████████████████
Wafer  ─────────────────

⑤ Exposure + Develop
PR     ▓▓▓▓      ▓▓▓▓
Film   █████████████████
Wafer  ─────────────────

⑥ Etch로 이동
        ↓↓↓ Etch
PR     ▓▓▓▓      ▓▓▓▓
Film   ████      ████
Wafer  ─────────────────
```

즉 실제 흐름의 한 예는

> **CVD(막 생성) → Photo(패턴 생성) → Etch(막 가공)**

인 거야.

내가 Lesson 2 앞부분에서 설명 편의를 위해

```text
PR
Wafer
```

라고 그렸는데, 정확하게는 많은 경우

```text
PR
가공 대상 Film
Wafer/하부 구조
```

라고 그렸어야 해.

그리고 **항상 Film이 있어야 하는 것도 아니야.** 예를 들어 Implant를 위한 Photo라면 PR 패턴을 이용해 아래 실리콘의 특정 영역에 이온을 주입하는 식으로 목적이 달라질 수 있어.

---

## 2. 그리고 맞아. Spinner도 있어

여기서 **Spinner와 Scanner는 완전히 다른 역할**이야.

이름이 비슷해서 처음에 엄청 헷갈릴 만해.

### Spinner

**PR을 웨이퍼에 바르는 장비/회전 메커니즘**이라고 생각하면 돼.

```text
        PR 액체
          ↓
          ●
     ┌─────────┐
     │  Wafer  │
     └─────────┘
          ↻↻↻
       고속 회전
```

웨이퍼 가운데 PR을 떨어뜨리고 웨이퍼를 회전시키면 원심력으로 PR이 얇고 균일하게 퍼져.

이게 앞에서 말한 **Spin Coating**이야.

즉:

> **Spinner = PR을 균일하게 바르는 쪽**

---

### Scanner

Scanner는 **노광(Exposure)**을 하는 장비야.

<visual-needed id="visual-031" type="reference-structure" description="반도체 공정: Scanner — 원수업 이미지 위치와 주변 설명을 함께 참고" />

대략:

```text
        빛
        ↓
     Reticle
        ↓
     광학계
        ↓
   ↓↓↓↓↓↓↓↓↓
  PR이 발린 Wafer
```

Reticle에 있는 패턴을 광학계를 통해 **PR에 노광**한다.

즉:

> **Scanner = 회로 패턴을 빛으로 노광하는 쪽**

---

## 3. Photo 공정을 장비 관점으로 다시 보면

이렇게 연결하면 훨씬 깔끔해.

```text
Film이 형성된 Wafer
        ↓
     Spinner
   PR을 바른다
        ↓
     Scanner
 Reticle 패턴을 노광
        ↓
     Develop
 PR 패턴을 만든다
        ↓
 Photo 완료
        ↓
 Etch / Implant 등
```

| 이름 | 역할 |
|---|---|
| **Spinner** | PR **도포** |
| **Scanner** | 빛으로 패턴 **노광** |
| **Etcher** | 실제 Film **식각** |

그래서 FAB에서 **"Photo 장비"라고 해서 장비 한 대가 모든 Photo 과정을 하는 게 아니야.** 여러 장비/모듈이 이어져 Photo 공정을 구성해.

그리고 하나 더: 현업에서 **Track**이라는 말도 많이 들을 텐데, 이게 Spinner와 Scanner 관계를 이해할 때 중요해. 보통 PR coating/develop 등의 작업을 담당하는 **Track 장비와 노광 Scanner가 연계**돼 돌아가.

이건 다음에 Photo를 조금 더 파면 `Track ↔ Scanner`, `Coat → Bake → Exposure → Develop`까지 실제 FAB 흐름에 가깝게 잡아줄게.

## 수업 중 추가 설명 — 필요할 때 이어 읽기

응. **둘 다 거의 맞게 이해했어.** 다만 용어를 조금 정확하게 잡자.

### 1. Coating = 도포, Spinner = 도포할 때 웨이퍼를 회전시키는 장비/방식

Photo에서:

**Coating(코팅/도포)** = PR을 웨이퍼 위에 균일하게 바르는 **공정 행위**  
**Spinner** = 웨이퍼를 고속 회전시켜 PR을 펴 바르는 **장비/기구**

```text
PR 떨어뜨림
     ↓
   ●
┌─────────┐
│  Wafer  │  ↻↻↻  ← Spinner
└─────────┘
     ↓
얇고 균일한 PR층
```

그래서 현업에서 **"PR coating 한다"**, **"spin coating 한다"**라고 표현할 수 있어.

---

### 2. Film = 막, 그리고 보통 '막질'이라고도 많이 표현

여기는 약간 차이가 있어.

**Film(막)**은 웨이퍼 위에 형성된 **얇은 물질층 자체**를 말해.

예를 들면:

```text
SiO₂ Film       ← 산화막
────────────
SiN Film        ← 질화막
────────────
Metal Film      ← 금속막
────────────
Silicon
```

반면 **막질**은 현업에서 보통 **그 막의 물질/종류 또는 막 자체를 지칭하는 표현**으로 많이 써.

예를 들어 회사에서:

> "이 Step 막질이 뭐야?"  
> → **무슨 물질로 된 막이야? SiO₂야? SiN이야?**

> "막질 특성이 안 좋아졌다."  
> → **막의 물성/품질에 문제가 있다.**

처럼 들을 수 있어.

그래서 지금 단계에서는

> **Film ≈ 막(박막)**  
> **막질 = 그 막/막의 재료·특성을 현업에서 지칭하는 표현**

정도로 구분하면 돼.

그리고 **Thin Film = 박막(薄膜)**이 가장 정식에 가까운 표현이야.

즉 앞으로 `Film`이라고 나오면 일단 **"웨이퍼 위에 형성된 얇은 막"**이라고 머릿속에 그리면 된다.

다음 수업: [Lesson 3](lesson-03.md).
