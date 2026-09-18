---
id: m00-l03
module_id: m00
lesson_number: 3
title: 저항·커패시터는 뭐고, 왜 트랜지스터만으로 끝나지 않을까?
estimated_minutes: 15
content_origin: adapted_original
source_url: https://chatgpt.com/share/6aa53330-bbf0-83e8-b34f-53e1dc894671
source_message_ids:
- bb062b58-06d2-4646-b063-dd2d4ffa1901
- 7a798f5a-8434-4c6a-b0c8-4ff87a5f0618
- 20d8a475-14dc-4d15-9f33-130ce970c23a
last_updated: '2026-09-12'
kind: lesson
extension_minutes: 5
---

# Module 0 / Lesson 3  

> 기본 수업과 Quiz 예상 15분. 원수업의 표·그림과 설명을 보존했으며, 뒤의 추가 설명은 별도로 이어 읽을 수 있어요.

## 저항·커패시터는 뭐고, 왜 트랜지스터만으로 끝나지 않을까?

지난 수업에서는 **전압 = 전기적 차이**, **전류 = 실제 전하의 흐름**, 그리고 회로가 HIGH/LOW 전압을 이용해 0/1을 표현한다는 걸 배웠어. 오늘은 그 전류와 전압을 실제 회로 안에서 다루는 가장 기본적인 두 소자, **저항(Resistor)**과 **커패시터(Capacitor)**를 본다. 

## 1. 저항(Resistor) = 전류를 너무 많이 못 흐르게 하는 것

수도관 비유를 계속 쓰자.

굵은 수도관은 물이 잘 흐르고, 아주 가는 수도관은 물이 덜 흐른다.

전기에서도 비슷하다.

**저항(Resistance)**은 전류의 흐름을 방해하는 성질이고, **Resistor**는 그 성질을 이용하는 소자다. 회로의 기본 구성요소로 저항·커패시터·트랜지스터 등이 함께 사용된다. [Circuit | Analog Devices](https://www.analog.com/en/resources/glossary/circuit.html?utm_source=chatgpt.com)

아주 직관적으로는:

<interactive type="rc-coupling" />

```text
전압을 가함
   ↓
저항이 작음
   ↓
전류 많이 흐름

전압을 가함
   ↓
저항이 큼
   ↓
전류 적게 흐름
```

여기서 유명한 식이 하나 있다.

**V = I × R**

하지만 지금은 외울 필요 없어. 뜻만 알면 된다.

> 같은 전압이라면 **저항이 커질수록 전류가 적게 흐른다.**

---

## 2. 커패시터(Capacitor) = 전하를 잠깐 저장하는 것

커패시터는 조금 더 중요해.

가장 쉬운 비유는 **작은 물탱크**다.

전기가 들어오면 전하를 잠시 저장하고, 필요하면 다시 내보낸다.

<visual-needed type="original-image" description="RC 회로" />

원수업 이미지 주소(현재 표시 여부 미확인): [출처](https://images.openai.com/static-rsc-4/wLiTvkzj-ZvUgSRkCOKulpaREgAsgiBt2SOjKzT9i2_PVVXf0pfTKx_Z_H_Z9ZdXBQlb4zVTcClSZtDSemKlEYGt5aJVMRGiggwfpYlsXylmKTjPyzI75Jw3DPS5S7nPBpUsnJ1auyDlKZquh93XkXZkiYPsfxhfIQuWsW89fvj9w8p3TleEJrrzYERB03_j?purpose=fullsize)

이 회로에서는 전원 → 저항 → 커패시터가 연결돼 있다.

스위치를 닫으면:

```text
전원 ON
  ↓
전류 흐름
  ↓
Capacitor에 전하 축적
  ↓
점점 충전됨
```

충전이 끝나면 이상적인 DC 회로에서는 더 이상 계속 전류가 흐르지 않는다. 커패시터는 전하와 에너지를 전기장 형태로 저장한다. [10.5 RC Circuits - University Physics Volume 2 | OpenStax](https://openstax.org/books/university-physics-volume-2/pages/10-5-rc-circuits?utm_source=chatgpt.com)

---

## 3. 커패시터는 실제로 어떻게 생겼나?

원리는 의외로 단순하다.

```text
금속판
────────

절연체

────────
금속판
```

전기가 통하는 두 판 사이에 **절연체**를 넣는다.

두 판이 서로 직접 연결되어 있지는 않지만, 양쪽에 서로 반대되는 전하를 모을 수 있다.

즉:

> **전류를 계속 통과시키는 소자라기보다, 전하를 저장하는 소자**

라고 생각하면 된다.

---

## 4. 그런데 반도체에서 커패시터가 왜 중요해?

여기서 반도체와 직접 연결된다.

우리가 앞으로 배울 **MOSFET**의 이름부터 보자.

**MOS**

= Metal  
+ Oxide  
+ Semiconductor

원래 MOS 구조 자체가 상당히 **커패시터와 비슷한 구조**다.

<visual-needed type="original-image" description="MOSFET capacitance" />

원수업 이미지 주소(현재 표시 여부 미확인): [출처](https://1.bp.blogspot.com/-KpnK4u5G6TU/Xf-x8Ey-j0I/AAAAAAAAVCU/nKzms8GPBxQ-mD06KBhS7Wt1Jdl18J7IwCLcBGAsYHQ/s1600/mos.JPG)

그림 중앙을 보면:

```text
Gate
────────────
SiO₂ 절연층
────────────
Silicon
```

구조가 있다.

즉 Gate와 Silicon 사이에 절연층이 끼어 있다.

이게 바로 다음 수업에서 배울 **MOSFET Gate의 핵심 구조**다.

실제 MOSFET에서는 Gate-Source, Gate-Drain 등 여러 **기생 커패시턴스(parasitic capacitance)**도 생기고, 이들은 스위칭 속도에 영향을 준다. 

지금은 어렵게 생각하지 말고:

> **Gate는 단순히 금속선 하나가 아니라, 절연막을 사이에 두고 실리콘의 전기적 상태를 제어한다.**

정도로만 기억하자.

---

## 5. DRAM도 사실 커패시터가 핵심이다

이건 나중에 메모리에서 다시 배우겠지만 미리 아주 조금만 보자.

DRAM 한 셀은 아주 단순화하면:

```text
Transistor
    +
Capacitor
```

로 이루어진다.

커패시터에 전하가 있느냐 없느냐를 이용해 정보를 저장한다.

대략:

```text
충전됨   → 1
방전됨   → 0
```

라고 생각하면 된다.

그래서 DRAM에서는 **커패시터를 아주 작게 만들면서도 충분한 전하를 저장하는 기술**이 중요하다.

나중에 삼성전자, SK하이닉스에서 말하는:

- capacitor
- dielectric
- high-k
- cell
- refresh

같은 단어들이 여기서 연결된다.

---

## 6. 그럼 트랜지스터만 많으면 CPU가 되는 게 아니야?

맞다.

트랜지스터가 핵심인 건 맞지만 실제 칩에는 **저항·커패시턴스·배선**의 영향이 함께 존재한다.

특히 현대 칩에서는 이것이 성능에 상당히 중요하다.

예를 들어 트랜지스터 하나가 다음 트랜지스터를 켜려면 그쪽 Gate를 충전해야 한다.

```text
Transistor A
     ↓
전류를 보냄
     ↓
Transistor B의 Gate capacitance 충전
     ↓
전압 상승
     ↓
B ON
```

그런데 충전하는 데는 시간이 걸린다.

그래서:

> **커패시턴스가 크면 다음 트랜지스터를 켜는 시간이 더 오래 걸릴 수 있다.**

이것이 결국 **칩의 속도**와 연결된다.

---

## 7. 아주 중요한 개념: RC Delay

여기서 현업에서 나중에 자주 만날 개념을 하나 미리 심어둘게.

**R = Resistance**

**C = Capacitance**

둘이 합쳐지면 전압이 즉시 변하지 않고 시간이 걸린다.

이걸 흔히 **RC delay**와 연결해서 생각한다.

```text
신호를 0 → 1로 바꾸고 싶음
       ↓
배선을 통해 전류 이동
       ↓
저항 R 존재
       +
커패시턴스 C 존재
       ↓
충전하는 데 시간 필요
       ↓
신호 도착 지연
```

즉 현대 반도체는 단순히

> **트랜지스터만 작게 만들면 무조건 빨라진다**

가 아니다.

배선의 저항과 커패시턴스도 중요하다.

그래서 나중에 **BEOL / Metal / Interconnect**를 배울 때 이 내용이 다시 등장한다.

---

## 8. 공정과 연결하면 더 재밌어진다

예를 들어 배선을 아주 가늘게 만든다고 생각해보자.

가늘어지면 칩을 작게 만들 수 있어서 좋다.

그런데 너무 가늘어지면:

```text
Metal line ↓ 작아짐
       ↓
Resistance ↑
       ↓
신호 전달 느려짐
       ↓
성능 문제
```

가 생길 수 있다.

반대로 서로 가까운 배선 사이에는 **Capacitance**가 생긴다.

```text
Metal │ │ Metal
      ↑
서로 가까움
      ↓
Capacitance 증가 가능
```

그래서 첨단 반도체 공정에서

**Metal pitch**

**Low-k dielectric**

**RC delay**

같은 단어가 중요하게 등장한다.

이건 나중에 8대 공정 중 **Metal / BEOL** 부분에서 제대로 볼 거야.

---

## 9. 생산 시스템 관점에서는?

여기서 공정 조건이 조금 변한다고 생각해보자.

예를 들어:

- 배선 두께 변화
- 절연막 두께 변화
- CD 변화

가 생기면,

```text
공정 변화
 ↓
저항 또는 커패시턴스 변화
 ↓
신호 속도 / 전력 변화
 ↓
칩 성능 변화
 ↓
Spec Fail
 ↓
Yield 영향
```

으로 이어질 수 있다.

즉 FAB에서 관리하는 **Thickness / CD / Profile** 같은 값들은 결국 전기적 특성과 연결된다.

이 연결을 계속 기억해두면 나중에 공정을 외워야 할 양이 크게 줄어든다. 

---

## 오늘 현업 용어 4개

| 용어 | 지금 이해할 의미 |
|---|---|
| **Resistance (R)** | 전류 흐름을 방해하는 정도 |
| **Resistor** | 저항을 이용하는 소자 |
| **Capacitance (C)** | 전하를 저장할 수 있는 정도 |
| **Capacitor** | 전하를 저장하는 소자 |

추가로 **RC delay = 저항과 커패시턴스 때문에 신호 변화에 시간이 걸리는 현상** 정도만 기억해두자.

---

## 오늘 반드시 기억할 3줄

**① Resistor는 전류를 제한한다.**

**② Capacitor는 전하를 저장한다.**

**③ 반도체 안에서는 저항과 커패시턴스가 신호 속도·전력·성능에 영향을 준다.**

---

## 🧠 Lesson 3 퀴즈

**Q1.** 다음 중 전하를 저장하는 소자는?

A. Resistor  
B. Capacitor  
C. Wafer

**Q2.** 배선의 저항 R과 커패시턴스 C가 커지면 일반적으로 신호 전달은 어떻게 될까?

A. 더 빨라질 수밖에 없다  
B. 느려질 수 있다  
C. 아무 영향 없다

**Q3.** DRAM 셀에서 정보를 저장하는 데 핵심적인 두 요소는?

A. Transistor + Capacitor  
B. Wafer + Package  
C. Etch + Lithography

---

## 정답

**Q1 → B. Capacitor**

**Q2 → B. 느려질 수 있다.**

커패시턴스를 충전·방전하는 데 시간이 필요하고, 저항은 그 과정의 전류 흐름을 제한한다.

**Q3 → A. Transistor + Capacitor**

DRAM은 이 구조를 이용해 0/1 정보를 저장한다.

---

## 수업 중 추가 설명 — 필요할 때 이어 읽기

핵심은 **“커패시터는 꼭 일부러 만든 부품일 필요가 없다”**는 거야.  
**금속 2개가 절연체를 사이에 두고 가까이 있으면 그 자체로 커패시터처럼 동작할 수 있어.**

예를 들어 배선 두 개가 이렇게 있다고 해보자.

```text
Metal A        Metal B
│              │
│  절연체      │
│              │
```

Metal A와 Metal B는 서로 직접 닿아 있지 않으니까 전류가 바로 흐르지는 않아.  
그런데 A에 전압을 걸면 A 표면에 전하가 모이고, 그 전기장이 옆의 B까지 영향을 준다.

```text
Metal A        Metal B
++++++         ------
│                │
│ ← 전기장 →     │
│                │
```

즉 두 배선 사이에 **전하를 저장하는 효과**가 생겨. 이게 바로 **Capacitance(정전용량)**야.

그리고 둘이 가까워지면:

```text
멀리 떨어짐

Metal A             Metal B
│                       │
   전기적 영향 약함
→ Capacitance 작음
```

반대로:

```text
가까이 붙음

Metal A │ │ Metal B
        ↑
   전기적 영향 강함
→ Capacitance 큼
```

왜냐하면 거리가 가까울수록 두 금속 사이의 **전기장이 더 강하게 결합**되기 때문이야.

수식도 사실 이 직관 그대로야.

$$
C \propto \frac{1}{d}
$$

여기서 `d`는 두 금속 사이 거리.

> **편집 보완:** 이 반비례식은 평행판처럼 단순화하고 면적과 절연체 재료 등 다른 조건을 같게 둔 관계야. 실제 3차원 배선에서는 형상 전체의 영향을 받아.

**거리가 d ↓ → Capacitance C ↑**

---

### 그럼 이게 왜 문제야?

Metal A가 어떤 신호를 전달한다고 해보자.

```text
Metal A : 0V → 1V
Metal B : 옆에 가만히 있음
```

A의 전압을 바꾸려면 A와 B 사이에 생긴 작은 커패시턴스도 같이 충전해야 해.

그래서:

```text
배선 가까워짐
   ↓
Capacitance ↑
   ↓
충전해야 할 전하 ↑
   ↓
0 → 1로 바뀌는 데 더 오래 걸림
   ↓
신호 지연
```

이게 앞에서 말한 **RC delay**와 연결돼.

게다가 A의 신호 변화가 B에 살짝 영향을 주는 **Crosstalk(간섭)**도 생길 수 있어.

---

### 정말 중요한 포인트

아까 우리가 배운 커패시터는 이렇게 **의도적으로 만든 것**이었지.

```text
Metal
──────
Insulator
──────
Metal

→ 의도적인 Capacitor
```

그런데 반도체 배선에서는:

```text
Metal │ Insulator │ Metal

→ 의도하지 않았는데도 Capacitor 효과 발생
```

이런 걸 흔히 **기생 커패시턴스(Parasitic Capacitance)**라고 해.

즉,

> **배선 두 개가 가까이 지나가기만 해도 작은 커패시터 하나가 저절로 생긴다고 생각하면 된다.**

이 문장만 이해하면 충분해.

그리고 첨단공정에서 배선을 점점 더 촘촘하게 넣을수록 **배선 간 거리가 줄어드니까 이 문제가 더 중요해지는 것**이야.

## 수업 중 추가 설명 — 필요할 때 이어 읽기

**Capacitance는 “전하를 저장하는 장소”가 아니라, 전하를 얼마나 저장할 수 있는지를 나타내는 성질/능력**이야.

정리하면:

- **Capacitor** = 전하 저장을 목적으로 만든 소자
- **Capacitance(C)** = 그 구조가 **얼마나 전하를 저장할 수 있는지 나타내는 값**
- 전압이 걸리지 않으면, capacitance가 있어도 **반드시 전하를 저장하고 있는 건 아님**

관계는 아주 단순하게:

$$
Q = C \times V
$$

즉 같은 전압 `V`가 걸렸을 때 **C가 클수록 더 많은 전하 Q가 모인다.**

예를 들어 배선 두 개가 가까이 있으면:

```text
Metal A      Metal B
   │            │
   │ 절연체     │
   │            │
```

이 구조 자체가 **capacitance를 가진다.**

하지만 두 배선 사이 전압 차이가 없다면 특별히 전하가 많이 모일 이유는 없어.

> **편집 보완:** 전압 차이가 0인 조건과 외부 전원을 분리한 상태는 다르다. 전원을 분리해도 이미 충전된 커패시터에는 전하와 전압이 남을 수 있어.

A가 `0V → 1V`로 바뀌면 그때:

```text
A에 + 전하가 모임
        ↕
   전기장이 형성
        ↕
B 쪽에 반대 전하가 유도됨
```

그래서 전하를 충전/방전해야 하고, 그 때문에 신호가 느려질 수 있는 거야.

한 문장으로 기억하면:

> **Capacitance = “여기에 전하를 꼭 저장해야 한다”가 아니라, “전압을 걸었을 때 전하를 저장하게 되는 정도”다.**

그리고 엄밀하게는 전하가 절연체 한가운데에 들어가 저장되는 게 아니라, **두 금속 표면에 반대 전하가 모이고 그 사이에 전기장이 형성되는 것**이라고 보면 돼.

다음 수업: [Lesson 4](lesson-04.md).
