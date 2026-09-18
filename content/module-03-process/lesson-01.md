---
id: m03-l01
module_id: m03
lesson_number: 1
title: 반도체 공정의 큰 그림 — 웨이퍼 위에 어떻게 수십억 개의 트랜지스터를 만들까?
estimated_minutes: 15
content_origin: adapted_original
source_url: https://chatgpt.com/share/6aa52f15-5fac-83e8-bda5-c96211eeb771
source_message_ids:
- 3d57decf-0d62-4be3-923d-00def9924d9d
- 4fdec087-b651-4618-b05a-c7348fe891cb
last_updated: '2026-09-12'
kind: lesson
extension_minutes: 5
---

# Module 3 / Lesson 1

> 기본 수업과 Quiz 예상 15분. 원수업의 표·그림과 설명을 보존했으며, 뒤의 추가 설명은 별도로 이어 읽을 수 있어요.

## 반도체 공정의 큰 그림 — 웨이퍼 위에 어떻게 수십억 개의 트랜지스터를 만들까?

Module 2에서 우리는 **완성된 칩의 구조**를 봤어. 이제 Module 3에서는 관점을 완전히 바꾼다.

> **“그 구조를 FAB에서는 도대체 어떻게 만드는가?”**

Module 2에서 배운 **FEOL → MOL → BEOL**이 이번 Module에서 실제 공정으로 연결된다. 

---

## 🎯 오늘 목표

오늘은 세부 공정 원리를 외우지 않는다.

딱 이것만 잡으면 돼.

> **반도체는 웨이퍼 위에 필요한 물질을 만들고 → 원하는 모양만 남기고 → 깎고 → 성질을 바꾸는 작업을 수없이 반복해서 만든다.**

먼저 전체 지도를 머릿속에 넣자.

---

## 1. 출발점은 Wafer

<visual-needed id="visual-025" type="reference-structure" description="반도체 공정: 1. 출발점은 Wafer — 원수업 이미지 위치와 주변 설명을 함께 참고" />

우리가 흔히 보는 이 둥근 판이 **Silicon Wafer**야.

하지만 웨이퍼 자체가 CPU나 GPU인 건 아니야.

<interactive type="process-overview" />

```text
Silicon Wafer
      ↓
웨이퍼 위에 수많은 구조를 제작
      ↓
┌────┬────┬────┬────┐
│ Die│ Die│ Die│ Die│
├────┼────┼────┼────┤
│ Die│ Die│ Die│ Die│
└────┴────┴────┴────┘
      ↓
각 Die를 잘라냄
      ↓
Packaging
      ↓
완성된 Chip
```

Module 2에서 배운 **Die**가 여기서 다시 등장하는 거야.

---

## 2. 그런데 웨이퍼 위에 회로를 어떻게 만들까?

여기서 처음 보면 신기한 점이 하나 있어.

트랜지스터 하나를 웨이퍼 위에 올려놓는 게 아니야.

웨이퍼의 특정 부분에

- 절연막을 만들고
- 특정 물질을 쌓고
- 필요한 모양만 남기고
- 필요 없는 부분을 깎고
- 특정 위치의 실리콘 성질을 바꾸고

이걸 **반복**한다.

마치 건물을 층층이 건설하는 것과 비슷해.

---

## 3. 핵심 공정들을 먼저 만나보자

Module 3에서 하나씩 깊게 배울 녀석들이다.

### ① Deposition — 쌓기

<visual-needed id="visual-026" type="reference-structure" description="반도체 공정: ① Deposition — 쌓기 — 원수업 이미지 위치와 주변 설명을 함께 참고" />

웨이퍼 위에 **얇은 막(Thin Film)을 형성**한다.

```text
Before

────────────  Wafer


After

████████████  ← 새로 만든 막
────────────  Wafer
```

예를 들어 절연막이나 금속막 등을 만든다.

쉽게:

> **Deposition = 막을 쌓는다**

---

## 4. Photo(Lithography) — 어디를 만들지 정하기

<visual-needed id="visual-027" type="reference-structure" description="반도체 공정: 4. Photo(Lithography) — 어디를 만들지 정하기 — 원수업 이미지 위치와 주변 설명을 함께 참고" />

반도체에서 정말 중요한 공정이야.

웨이퍼 전체를 똑같이 가공하면 원하는 회로 모양을 만들 수 없겠지.

그래서 **Mask**를 이용해서 원하는 패턴을 웨이퍼에 옮긴다.

아주 단순화하면:

```text
Mask
↓
빛을 이용해 패턴 전사
↓
Photoresist(PR)
↓
원하는 부분만 열림

████    ████
████    ████
──────────── Wafer
        ↑
     열린 부분
```

즉,

> **Photo = "어디를 가공할 것인가?"를 정한다.**

Module 1에서 잠깐 봤던 **Photo → Implant** 관계도 이제 본격적으로 이해하게 될 거야.

---

## 5. Etch — 깎기

Photo로 위치를 정했으면 그다음에는 실제 물질을 제거할 수 있어.

<visual-needed id="visual-028" type="reference-structure" description="반도체 공정: 5. Etch — 깎기 — 원수업 이미지 위치와 주변 설명을 함께 참고" />

```text
████████████  막
────────────  Wafer

      ↓ Etch

████      ████
████      ████
──────────────
```

PR 등이 보호하지 않는 부분을 선택적으로 제거해서 **패턴을 실제 구조로 만든다.**

쉽게 말하면:

> **Photo = 어디를 깎을지 정한다**  
> **Etch = 실제로 깎는다**

둘의 차이가 매우 중요해.

---

## 6. Ion Implantation — 실리콘의 성질 바꾸기

이건 우리가 Module 0~1에서 배운 **N형/P형 반도체**와 직접 연결된다.

실리콘에 특정 불순물(Dopant)을 넣는다.

```text
     ↓ ↓ ↓ ↓ ↓
      Dopant

████      ████   ← 보호된 영역
████      ████

    • • •
    • • •       ← Dopant가 들어감
────────────
 Silicon
```

예를 들어 적절한 dopant를 사용해서 특정 영역을 **N-type 또는 P-type**으로 만든다.

그래서 예전에 배운 NMOS의:

```text
N+ Source     N+ Drain
     P Body
```

같은 구조가 그냥 처음부터 존재하는 게 아니야.

> **FAB 공정을 통해 우리가 원하는 위치에 그런 전기적 특성을 만들어내는 것**이야.

---

## 7. CMP — 평평하게 만들기

계속 쌓고 깎다 보면 표면이 울퉁불퉁해지겠지.

그 상태로 계속 층을 올리면 문제가 생긴다.

그래서 사용하는 대표적인 공정이:

**CMP = Chemical Mechanical Planarization**

쉽게 말하면,

> **화학적 + 기계적 방법으로 표면을 평탄화한다.**

```text
Before

██
██████
██████████
──────────

       ↓ CMP

██████████
──────────
```

Module 2에서 여러 Metal Layer가 층층이 올라가는 걸 배웠지?

그런 다층 구조를 안정적으로 만들기 위해서도 **평탄한 표면**이 중요하다.

---

## 8. 결국 이걸 계속 반복한다

여기가 오늘의 핵심이다.

실제 반도체 제조를 극단적으로 단순화하면:

```text
        Wafer
          ↓
     Deposition
       "쌓기"
          ↓
       Photo
    "위치 정하기"
          ↓
        Etch
       "깎기"
          ↓
 Implant / 기타 처리
    "성질 바꾸기"
          ↓
        CMP
     "평평하게"
          ↓
         ↺
      다시 반복
```

단 한 번 하는 게 아니야.

**수많은 공정 Step과 여러 Mask/Layer를 거치며 반복**하면서 복잡한 3차원 구조를 만들어낸다.

---

## 9. Module 2와 Module 3가 여기서 연결된다

Module 2에서는 완성품을 이렇게 봤어.

```text
        Metal
        Metal
        Metal       ← BEOL
        Metal
          │
       Contact      ← MOL
          │
     Transistor     ← FEOL
────────────────
       Silicon
```

Module 3에서는 반대로 생각하면 돼.

> **저 구조를 실제 웨이퍼 위에 아래에서부터 어떻게 만들어 올라가는가?**

이걸 배우는 거야.

즉,

**Module 2 = 완성된 칩의 구조**

**Module 3 = 그 구조를 만드는 제조법**

이라고 생각하면 정확해.

---

## 오늘 핵심 용어

| 용어 | 지금은 이렇게 기억 |
|---|---|
| **Deposition** | 막을 **쌓는다** |
| **Photo / Lithography** | 가공할 **위치를 정한다** |
| **Etch** | 물질을 **깎는다** |
| **Ion Implantation** | 실리콘의 **전기적 성질을 바꾼다** |
| **CMP** | 표면을 **평평하게 만든다** |

오늘은 세부 원리보다 **각 공정의 역할 구분**이 훨씬 중요해.

---

## 🔥 딱 3줄만 기억하자

**① 반도체는 완성된 트랜지스터를 웨이퍼에 갖다 붙이는 게 아니다.**

**② 쌓기 → 위치 정하기 → 깎기 → 성질 바꾸기 → 평탄화 같은 작업을 반복해서 구조를 직접 만든다.**

**③ Module 2에서 본 FEOL/MOL/BEOL 구조를 실제로 만드는 방법이 바로 Module 3에서 배울 반도체 공정이다.**

---

## 🧠 오늘의 퀴즈

**Q1.** 막을 형성하는 공정은?

A. Etch  
B. Deposition  
C. CMP

→ **정답 B. Deposition**

**Q2.** Photo와 Etch의 차이로 가장 적절한 것은?

A. Photo는 위치를 정하고, Etch는 실제 물질을 제거한다.  
B. 둘 다 똑같이 물질을 깎는다.  
C. Photo가 물질을 쌓고 Etch가 평탄화한다.

→ **정답 A.** 이 구분은 앞으로 계속 나온다.

**Q3.** N-type/P-type 영역을 만들 때 직접 연결되는 대표 공정은?

A. CMP  
B. Packaging  
C. Ion Implantation

→ **정답 C. Ion Implantation.** Dopant를 넣어 특정 영역의 전기적 특성을 조절한다.

---

## 수업 중 추가 설명 — 필요할 때 이어 읽기

응. **내가 위에서 설명한 5개는 8대 공정을 크게 기능별로 압축해서 설명한 것**이라고 보면 돼.

회사에서 말하는 8대 공정을 대응시키면 이렇게 정리돼.

| 회사 8대 공정 | 내가 설명한 5개 기준 | 한마디로 |
|---|---|---|
| **Photo** | **Photo** | 어디를 가공할지 **패턴을 만든다** |
| **Etch** | **Etch** | 원하는 부분을 **깎는다** |
| **Metal** | **Deposition 계열 + 배선 형성** | 전기가 흐를 **금속 배선을 만든다** |
| **CVD** | **Deposition** | 박막을 **증착한다** |
| **CMP** | **CMP** | 표면을 **평평하게 만든다** |
| **Implant** | **Ion Implantation** | 이온을 넣어 **전기적 성질을 바꾼다** |
| **Diffusion** | 내가 5개로 단순화하며 생략 | **열처리/산화 등**으로 물질·특성을 변화시킨다 |
| **Clean** | 내가 5개로 단순화하며 생략 | 오염물·잔여물을 **제거한다** |

특히 몇 가지는 정확히 구분해두면 좋아.

### 1. CVD = 내가 말한 Deposition의 한 종류

**Deposition(증착)**은 큰 개념이고, CVD는 그 방법 중 하나야.

```text
Deposition
 ├─ CVD
 ├─ PVD
 └─ ALD
```

즉 **Deposition이라는 이름의 별도 8대 공정부서가 있는 게 아니라**, 네 회사 분류에서는 대표적인 증착 공정을 **CVD**로 잡은 거라고 이해하면 돼.

### 2. Metal도 넓게 보면 '쌓는 공정'이지만 목적이 다름

CVD가 주로 **막을 형성하는 기술 자체**에 초점을 둔다면,

**Metal은 트랜지스터들을 전기적으로 연결하는 배선(Interconnect)을 만드는 것**이 핵심이야.

Module 2에서 배운:

```text
Metal Layer
Metal Layer
Metal Layer   ← 이걸 만드는 영역
Metal Layer
    │
 Transistor
```

와 바로 연결돼.

그래서 **Metal = Deposition**이라고 1:1로 외우면 조금 부정확하고,

> **Metal = 금속 배선을 만드는 공정 영역이며, 그 과정에서 증착 등의 기술을 사용한다.**

정도로 이해하면 좋아.

### 3. Diffusion은 Implant와 비슷해 보여도 다르다

둘 다 트랜지스터의 특성을 만드는 데 중요하지만,

**Implant**  
→ 이온을 가속해서 웨이퍼에 **직접 집어넣음**

**Diffusion**  
→ 주로 **고온 열처리, 산화 및 dopant 활성화/확산 등 열공정 영역**

이라고 우선 구분하자.

나중에 Implant Lesson에서 **Implant → Anneal** 관계를 보면 훨씬 명확해질 거야.

### 4. Clean은 거의 모든 공정 사이사이에 등장한다

이게 의외로 중요해.

```text
Photo
 ↓
Etch
 ↓
Clean
 ↓
CVD
 ↓
Clean
 ↓
Photo
 ↓
Etch
 ↓
Clean
 ↓
...
```

실제 FAB에서는 미세한 particle이나 잔여물, 금속 오염 등이 다음 공정과 수율에 영향을 줄 수 있어서 **Clean은 특정 한 번의 단계라기보다 제조 전반에 반복적으로 등장**한다고 생각하면 돼.

---

그래서 네가 회사에서 보는 **8대 공정 기준으로 앞으로 Module 3을 배우는 게 더 좋겠다.**

> **Photo → Etch → CVD → Metal → CMP → Implant → Diffusion → Clean**

각각을 배우면서 **“이 공정이 실제로 트랜지스터/BEOL의 어느 부분을 만드는가?”**를 계속 연결해줄게.

그리고 **8대 공정은 실제 wafer가 반드시 저 순서로 딱 한 번씩 지나간다는 뜻은 아니다.** 실제 공정에서는 필요한 구조에 따라 Photo, Etch, CVD, Clean 등이 여러 번 반복돼. 이 부분이 꽤 중요해.

다음 수업: [Lesson 2](lesson-02.md).
