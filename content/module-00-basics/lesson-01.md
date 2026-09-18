---
id: m00-l01
module_id: m00
lesson_number: 1
title: 반도체·소자·웨이퍼·다이·칩 — 일단 이것부터 구분하자
estimated_minutes: 15
content_origin: adapted_original
source_url: https://chatgpt.com/share/6aa53330-bbf0-83e8-b34f-53e1dc894671
source_message_ids:
- 549c7e21-97c4-4dbf-8d38-d8cf9148c626
last_updated: '2026-09-12'
kind: lesson
---

# Module 0 / Lesson 1  

> 기본 수업과 Quiz 예상 15분. 원수업의 표·그림과 설명을 보존했으며, 뒤의 추가 설명은 별도로 이어 읽을 수 있어요.

## 반도체·소자·웨이퍼·다이·칩 — 일단 이것부터 구분하자

**오늘 목표는 딱 하나야.**

> **“반도체를 만든다”는 게 실제로 무엇을 만드는 건지 머릿속에 그림을 만드는 것.**

오늘 이 관계만 확실하게 잡으면 된다.

**실리콘 → 웨이퍼 → 그 위에 수많은 소자를 만듦 → 하나의 회로(IC) → 다이 → 패키징 → 우리가 부르는 칩**

---

## 1. 먼저 `반도체`가 뭐야?

구리는 전기가 아주 잘 흐르고, 고무는 거의 흐르지 않는다.

반도체(Semiconductor)는 그 중간쯤인데, 중요한 건 단순히 **“중간 정도 흐른다”**가 아니다.

**전기가 흐르는 정도를 우리가 의도적으로 조절할 수 있는 물질**이라는 게 핵심이다. 실리콘에 특정 불순물을 넣거나 전압을 가하면 전기가 흐르는 특성을 바꿀 수 있다. [반도체 | 삼성반도체](https://semiconductor.samsung.com/kr/support/tools-resources/dictionary/semiconductor-glossary-semiconductor/?utm_source=chatgpt.com)

그래서 실리콘으로 이런 걸 만들 수 있다.

> 전기 흐르게 하기 → **ON**  
> 전기 막기 → **OFF**

그리고 이 ON/OFF를 엄청 빠르게 반복하는 작은 스위치가 나중에 배울 **트랜지스터**다.

### 아주 단순화하면

**트랜지스터 = 전기로 조작하는 초미세 스위치**

0과 1을 처리하는 디지털 컴퓨터의 출발점이라고 생각하면 된다.

---

## 2. 그런데 `소자`가 뭐야?

현업에서 엄청 많이 듣는 말이지.

**소자(Device)**는 쉽게 말하면

> **특정 전기적 기능 하나를 수행하는 작은 구성요소**

다.

대표적으로:

- **Transistor** → 전기를 켜고 끄거나 증폭
- **Diode** → 전류를 주로 한 방향으로 흐르게 함
- **Capacitor** → 전하를 저장
- **Resistor** → 전류 흐름을 제한

이런 것들이 전부 **소자**다.

그리고 이 소자들을 엄청 많이 연결한 것이 **집적회로(IC, Integrated Circuit)**다. 삼성의 반도체 설명에서도 IC를 트랜지스터·다이오드·커패시터·저항 등을 초소형으로 집적한 회로로 설명한다. [반도체 | 삼성반도체](https://semiconductor.samsung.com/kr/support/tools-resources/dictionary/semiconductor-glossary-semiconductor/?utm_source=chatgpt.com)

### 집 비유로 보면

**트랜지스터 하나 = 벽돌 하나**

수많은 벽돌을 조합하면

**방 → 집 → 아파트**

가 만들어지듯,

수많은 트랜지스터를 조합하면

**논리게이트 → CPU 코어 → GPU → SoC**

> **편집 보완 — 위 원문 화살표의 범위:** CPU 코어가 GPU가 된다는 포함 관계는 아니야. 논리게이트는 비트 관계를 처리하는 회로, CPU 코어는 명령을 실행하는 블록, GPU는 많은 병렬 연산을 하는 처리장치, SoC는 여러 시스템 기능을 통합한 칩이야. CPU와 GPU 기능이 SoC에 함께 들어갈 수 있어.

같은 복잡한 회로가 만들어진다.

아직 게이트가 뭔지는 몰라도 된다. 다음에 차근차근 간다.

---

## 실제 트랜지스터는 대략 이런 구조다

<visual-needed id="visual-001" type="reference-structure" description="반도체/전기 기초: 실제 트랜지스터는 대략 이런 구조다 — 원수업 이미지 위치와 주변 설명을 함께 참고" />

지금은 그림에서 **Gate / Source / Drain**이라는 이름만 눈에 익혀둬. Gate는 제어 전극, Source와 Drain은 제어할 전류 경로의 양쪽 단자야.

다음 Module에서 이걸 아주 천천히 뜯어볼 거다.

지금 당장은:

> **Gate에 전압을 줘서 Source ↔ Drain 사이의 전기 흐름을 제어한다.**

이 정도만 기억하면 충분하다.

---

## 3. 웨이퍼(Wafer)는 뭐야?

이제 네 업무와 훨씬 가까워진다.

반도체 회로를 허공에 만들 수는 없으니까 **바닥판**이 필요하다.

그게 웨이퍼다.

주로 고순도 단결정 **Silicon(Si)**을 기둥 형태의 **Ingot**으로 만든 뒤 얇게 썰어서 원판으로 만든다. [잉곳 | 삼성반도체](https://semiconductor.samsung.com/kr/support/tools-resources/dictionary/semiconductor-glossary-ingot/?utm_source=chatgpt.com)

<visual-needed id="visual-002" type="reference-structure" description="반도체/전기 기초: 3. 웨이퍼(Wafer)는 뭐야? — 원수업 이미지 위치와 주변 설명을 함께 참고" />

### 이 그림에서 반드시 볼 것

동그란 전체가 **Wafer**.

그 안에 바둑판처럼 반복되는 네모 하나하나가 **Die**다.

즉,

> 🍕 **Wafer = 피자 한 판**  
> 🔲 **Die = 피자 한 조각**

라고 생각하면 된다.

---

## 4. 그런데 처음부터 웨이퍼에 네모난 칩이 붙어 있는 건 아니야

여기가 굉장히 중요하다.

처음 웨이퍼는 그냥 **매끈한 실리콘 원판**에 가깝다.

그 위에 수백 번의 공정을 반복하면서 회로를 만든다.

대략 앞으로 배우게 될:

**Deposition**  
↓  
**Photo Lithography**  
↓  
**Etch**  
↓  
**Ion Implantation**  
↓  
또 Deposition  
↓  
또 Photo  
↓  
또 Etch  
↓  
⋮  
수백 단계 반복

을 거치면서 작은 트랜지스터와 배선이 층층이 생긴다.

삼성의 설명처럼 오늘날 칩은 수많은 트랜지스터·다이오드·저항·커패시터 등의 요소를 집적하고, 이를 만들기 위해 여러 물질의 미세 패턴을 반복적으로 형성한다. [A short introduction to semiconductor fabrication | Samsung Semiconductor Global](https://semiconductor.samsung.com/news-events/tech-blog/a-short-introduction-to-semiconductor-fabrication/?utm_source=chatgpt.com)

---

## 5. `Die`가 뭐야?

가공이 완료된 웨이퍼를 보면 이런 모습이다.

<visual-needed id="visual-003" type="reference-structure" description="반도체/전기 기초: 5. `Die`가 뭐야? — 원수업 이미지 위치와 주변 설명을 함께 참고" />

이 그림이 오늘 **가장 중요한 그림**이다.

웨이퍼 한 장 위에 **동일한 회로가 여러 개 반복**돼 있다.

그 사각형 하나가:

### **Die(다이)**

다.

예를 들어 어떤 고객이 AI Accelerator를 설계했고 삼성 파운드리에 생산을 맡겼다고 해보자.

웨이퍼 위에

<interactive type="wafer-die-transistor" />

```text
AI칩  AI칩  AI칩  AI칩
AI칩  AI칩  AI칩  AI칩
AI칩  AI칩  AI칩  AI칩
...
```

처럼 동일 설계가 여러 번 만들어진다고 생각하면 된다.

삼성도 웨이퍼상의 각 사각형에 전자회로가 집적돼 있으며 이를 **Die**라고 설명한다. [반도체 8대 공정 1탄, ‘웨이퍼’란 무엇일까요? | 삼성반도체](https://semiconductor.samsung.com/kr/support/tools-resources/fabrication-process/eight-essential-semiconductor-fabrication-processes-part-1-what-is-a-wafer/?utm_source=chatgpt.com)

---

## 6. 그러면 `Chip`과 `Die`는 같은 거야?

여기서 사람들이 많이 헷갈린다.

엄밀하게 구분하면:

### Die
웨이퍼에서 만들어진 **실리콘 회로 조각 자체**

### Package
그 조그만 실리콘을 보호하고 바깥 세상과 전기적으로 연결하도록 감싸는 구조

### Chip
문맥에 따라 **Die 자체를 chip이라고 부르기도 하고**, 패키징이 완료된 반도체 제품을 chip이라고 부르기도 한다.

즉 **chip은 꽤 느슨하게 쓰이는 단어**다.

그래서 현업에서는 `die`라는 말을 들으면

> **“아, 패키지 말고 실리콘 본체를 이야기하는구나.”**

라고 이해하는 게 좋다.

---

## 7. 왜 패키징을 해야 하지?

웨이퍼에서 다이를 잘라냈다고 생각해보자.

그 상태는 그냥 **몇 mm~수십 mm 크기의 얇은 실리콘 조각**이다.

그걸 메인보드에 바로 꽂을 수는 없다.

그래서 이런 구조로 만들어준다.

<visual-needed id="visual-004" type="reference-structure" description="반도체/전기 기초: 7. 왜 패키징을 해야 하지? — 원수업 이미지 위치와 주변 설명을 함께 참고" />

첫 번째 그림에서 가장 중요한 건 가운데의 **Die**다.

그 주변에:

**Die**  
↓  
전기 연결  
↓  
**Package substrate**  
↓  
Solder ball 등  
↓  
**PCB**

가 연결된다.

스마트폰이나 GPU 기판에서 우리가 보는 검은색/금속성 덩어리는 보통 **맨 실리콘 자체가 아니라 패키징된 반도체**인 경우가 많다.

HBM 수업에 가면 이게 훨씬 복잡해진다.

> **편집 보완 — 미리 보는 제품 용어:** HBM은 높은 데이터 대역폭을 목표로 DRAM 다이를 쌓은 메모리, Base Die는 그 아래의 연결·인터페이스 다이, Interposer는 다이 사이를 연결하는 중간 구조야. 아래 원수업 나열은 구성요소를 보여주며 실제 위아래 배치를 뜻하지 않아. 대표 구성에서는 GPU와 HBM 스택이 Interposer 위에 나란히 놓여.

```text
DRAM Die
DRAM Die
DRAM Die
DRAM Die
   ↓
Base Die
   ↓
Interposer
   ↓
GPU
```

같은 구조가 등장한다.

지금은 아직 신경 쓰지 않아도 된다.

---

## 8. 오늘 배운 걸 한 그림으로 합치면

이 흐름을 꼭 기억해.

```text
실리콘(Si)
   ↓
Ingot
실리콘 기둥
   ↓ 잘라냄
Wafer
동그란 실리콘 원판
   ↓
Photo / Etch / Deposition / Implant ...
수백 번의 FAB 공정
   ↓
┌─────────────────────┐
│ □ □ □ □ □ □ □ □   │
│ □ □ □ □ □ □ □ □   │   ← Wafer
│ □ □ □ □ □ □ □ □   │
└─────────────────────┘
      ↓
      □
     Die
      ↓
   Dicing
      ↓
Packaging
      ↓
우리가 사용하는 반도체 Chip
```

---

## 9. 여기서 네 생산 시스템 업무랑 어떻게 연결되나?

이게 앞으로 중요하다.

FAB에서 네가 보는 **Lot / Wafer / Step / EQP / Recipe / WIP / Cycle Time**이 결국 무엇을 위해 움직이는가?

결국 이거다.

> **웨이퍼 한 장 위에 정상적인 Die를 최대한 많이 만들어내는 것.**

예를 들어 웨이퍼 한 장에 500개의 Die가 있다고 치자.

공정 문제가 생겨:

- 정상 Die = 450개 → Yield 90%
- 정상 Die = 300개 → Yield 60%

가 될 수 있다.

그래서 FAB에서:

**공정 조건 → 결함 → 소자 특성 → Die 정상/불량 → Yield**

가 모두 연결된다.

너는 지금까지 주로 이 중에서 **FAB 운영/WIP/TAT/생산 시스템 쪽**을 봤다면, 앞으로 수업에서는 그 앞단의

> **“대체 웨이퍼 안에서 무슨 물리적인 일이 벌어지고 있길래 생산 시스템을 이렇게 운영해야 하지?”**

를 채우는 거라고 생각하면 된다. 

---

## 10. 오늘 현업 용어 5개

| 용어 | 지금 단계에서 이해할 뜻 |
|---|---|
| **Semiconductor** | 전기적 성질을 조절할 수 있는 물질. 산업적으로는 반도체 칩/IC를 통칭하기도 함 |
| **Device / 소자** | 트랜지스터 등 특정 전기 기능을 하는 기본 구성요소 |
| **Wafer** | 회로를 만드는 동그란 실리콘 원판 |
| **Die** | 웨이퍼 위에 반복 제작된 개별 IC 한 개 |
| **Package** | Die를 보호하고 외부 회로와 연결시키는 구조 |

오늘은 **IC(Integrated Circuit) = 여러 소자를 집적한 회로**도 같이 기억해두자.

---

## 오늘 반드시 기억할 3줄

**① 반도체 칩 안에는 수많은 `소자`, 특히 트랜지스터가 들어 있다.**

**② FAB은 동그란 `Wafer` 위에 이런 회로를 여러 개 동시에 만든다.**

**③ 웨이퍼 위의 사각형 하나가 `Die`이고, 이를 잘라 Packaging하면 실제 제품이 된다.**

---

## 🧠 Lesson 1 퀴즈

### Q1.
웨이퍼 위에 보이는 작은 사각형 하나하나를 무엇이라고 할까?

A. Gate  
B. Die  
C. Transistor  
D. Package

### Q2.
다음 중 크기 관계가 가장 자연스러운 것은?

A. Die > Wafer > Transistor  
B. Wafer > Die > Transistor  
C. Transistor > Wafer > Die

### Q3.
`소자(Device)`와 `Die`의 차이는 무엇일까?

---

### 정답

**Q1 → B. Die**

**Q2 → B. Wafer > Die > Transistor**

웨이퍼 하나에 여러 Die가 있고, Die 하나 안에는 엄청나게 많은 트랜지스터가 있다.

**Q3 →**  
`소자`는 트랜지스터처럼 **전기적 기능을 수행하는 기본 구성요소**, `Die`는 그런 소자들을 엄청 많이 집적해서 만든 **하나의 완성된 IC 회로 조각**이다.

---

다음 수업: [Lesson 2](lesson-02.md).
