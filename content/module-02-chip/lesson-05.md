---
id: m02-l05
module_id: m02
lesson_number: 5
title: 칩은 바깥세상과 어떻게 연결될까? — Pad → Bump → Package → PCB
estimated_minutes: 15
content_origin: adapted_original
source_url: https://chatgpt.com/share/6aa5303e-8a2c-83ee-8693-21afceb6bd01
source_message_ids:
- e5e79a0b-8cf5-4ef2-939c-13a8b4b62151
- 4e2a2547-f6c3-4a86-8a04-ff283eefb293
last_updated: '2026-09-12'
kind: lesson
extension_minutes: 5
---

# Module 2 / Lesson 5  

> 기본 수업과 Quiz 예상 15분. 원수업의 표·그림과 설명을 보존했으며, 뒤의 추가 설명은 별도로 이어 읽을 수 있어요.

## 칩은 바깥세상과 어떻게 연결될까? — Pad → Bump → Package → PCB

### 핵심 목표

지금까지는 **Die 내부**만 봤어.

오늘은 처음으로 신호가 Die 밖으로 나가는 길을 본다.

핵심 경로는 이것 하나야.

> **Die 내부 Metal → Pad → Bump → Package Substrate → PCB**

실제 패키지는 Die를 보호하는 것뿐 아니라, **전기적 연결·전원 공급·방열** 역할도 한다. [패키징 | 삼성반도체](https://semiconductor.samsung.com/kr/support/tools-resources/dictionary/semiconductor-glossary-packaging/?utm_source=chatgpt.com)

---

## 1. 먼저 전체 3D 구조부터 보자

<visual-needed id="visual-023" type="reference-structure" description="칩 구조: 1. 먼저 전체 3D 구조부터 보자 — 원수업 이미지 위치와 주변 설명을 함께 참고" />

그림을 아주 단순화하면:

<interactive type="pad-bump-package-pcb" />

```text
          Die
   ┌─────────────┐
   │ Transistors │
   │ Metal Layers│
   └─────────────┘
       ● ● ● ●       ← Bump
   ═══════════════
   Package Substrate
   ═══════════════
       ● ● ● ●       ← Solder Ball / Contact
   ───────────────
          PCB
```

지난 Lesson의 BEOL이 이제 **Package와 연결되는 지점**까지 온 거야.

---

## 2. `Pad`가 뭐야?

새 용어부터 정의하자.

## Pad

> **Die 내부 배선이 외부와 연결되기 위해 마련한 금속 접점**

이야.

칩 내부에서는 수많은 Metal 배선이 움직이다가, 외부로 나갈 신호나 전원을 특정 접점으로 모아.

```text
Transistor
    ↓
M1
    ↓
M2
    ↓
...
Upper Metal
    ↓
   PAD
```

쉽게 말하면:

> **Pad = Die의 출입구**

라고 보면 돼.

신호뿐 아니라 `VDD`, `GND`도 Pad를 통해 들어오고 나갈 수 있어.

---

## 3. Pad를 Package에 어떻게 붙일까?

전통적으로는 대표적으로 두 방식이 있어.

```text
① Wire Bonding
② Flip Chip
```

오늘은 현대 고성능 CPU/GPU에서 중요한 **Flip Chip**을 중심으로 볼게.

---

## 4. 먼저 Wire Bonding

Die의 Pad와 Package 쪽 Pad를 가느다란 금속선으로 연결하는 방식이야.

```text
        금속 Wire
      /──────────\
     /            \
 [Die Pad]     [Package Pad]

 ┌────Die────┐
 └───────────┘
════════════════
 Package Substrate
```

삼성전자도 Wire Bonding을 **반도체 칩의 접점과 기판 접점을 가는 금선 등으로 연결하는 방식**으로 설명한다. [반도체 8대 공정 9탄, 외부환경으로부터 반도체를 보호하는 패키징 (Packaging) 공정 | 삼성반도체](https://semiconductor.samsung.com/kr/support/tools-resources/fabrication-process/eight-essential-semiconductor-fabrication-processes-part-9-packaging-to-protect-the-chips-from-external-elements/?utm_source=chatgpt.com)

여전히 많이 쓰이는 방식이지만, 고성능 칩에서는 훨씬 많은 연결이 필요하지.

그래서 등장하는 게 Flip Chip이야.

---

## 5. `Bump`란?

## Bump

> **Die와 Package Substrate를 직접 전기적으로 연결하는 작은 돌기 형태의 금속 접점**

이야.

Die 아래쪽에 작은 금속 돌기들을 아주 많이 만든다.

```text
        Die

┌────────────────┐
│                │
└────────────────┘
 ● ● ● ● ● ● ● ●
 ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑
       Bump
```

그리고 그 Die를 뒤집어서:

```text
      Die
  ● ● ● ● ●
  ↓ ↓ ↓ ↓ ↓
═══════════════
Package Substrate
```

붙인다.

그래서 이름이:

## Flip Chip

이야.

말 그대로 **Chip을 뒤집어서 붙인다**는 뜻이지.

삼성전기도 Flip Chip 방식에서는 반도체가 **Bump를 통해 뒤집어진 상태로 기판과 연결**되며, Wire Bonding보다 신호 경로가 짧고 많은 I/O 연결을 만들기 유리하다고 설명한다. [FCCSP | Package Substrate | 삼성전기](https://www.sem.samsung.com/kr/product/substrate/package-substrate/fccsp.do?utm_source=chatgpt.com)

---

## 6. Pad와 Bump는 같은 건가?

아니야. 이거 중요해.

```text
칩 내부 배선
    ↓
   Pad
    ↓
   Bump
    ↓
Package
```

### Pad

평평한 **금속 접점 영역**

### Bump

Pad 위에 만들어서 실제 Package와 접촉하는 **튀어나온 연결 구조**

라고 생각하면 돼.

아주 단순하게:

> **Pad = 콘센트 위치**  
> **Bump = 실제 플러그 접촉부**

정도로 구분하면 된다.

실제로 Bump와 Pad 사이에는 UBM 같은 추가 구조가 들어갈 수 있지만, 지금은 여기까지면 충분해.

---

## 7. Package Substrate는 뭐야?

여기서 아주 중요한 새 개념.

## Package Substrate

> **Die와 PCB 사이에서 신호와 전원을 재배선해 주는 Package 내부의 기판**

이야.

Intel도 Die를 Package의 **substrate에 부착**하며, substrate를 package의 주요 기반 구조로 설명한다. [How Silicon Die Become Chip Packages](https://www.intel.com/content/www/us/en/newsroom/tech101/manufacturing/how-silicon-die-become-chip-packages.html?utm_source=chatgpt.com)

구조는:

```text
          Die
 ● ● ● ● ● ● ● ●
      Bumps
════════════════════
   Package Substrate
════════════════════
 ●     ●      ●     ●
        ↓
       PCB
```

여기서 이상한 점 하나 보이지?

위 Bump는 굉장히 촘촘한데,

아래쪽 연결은 더 넓게 퍼져 있어.

---

## 8. 왜 Package Substrate가 필요한가?

Die는 아주 작고 연결점은 매우 촘촘해.

예를 들어:

```text
Die 쪽

●●●●●●●●●●●●
●●●●●●●●●●●●
```

그런데 PCB는 그렇게 미세한 배선을 직접 받기 어렵다.

그래서 Package Substrate가 중간에서:

```text
●●●●●●●●   ← Die의 촘촘한 연결
 \ |||| /
  \||||/
   \||/
●   ●   ●   ● ← PCB 쪽 넓은 연결
```

처럼 **연결 간격을 넓혀서 재배선**해준다.

쉽게 비유하면:

> **Package Substrate = 좁은 골목길들을 큰 도로로 연결해주는 인터체인지**

야.

그래서 Package가 단순한 플라스틱 껍데기가 아니라는 거야.

---

## 9. Package에서 PCB로는 어떻게 내려갈까?

Package 종류에 따라 다르다.

대표적인 방식 중 하나가:

## BGA — Ball Grid Array

야.

Package 밑면에 solder ball들이 있어.

```text
══════════════════
 Package Substrate
══════════════════
 ●   ●   ●   ●
 ●   ●   ●   ●
 ↑
Solder Ball

──────────────────
       PCB
```

이 solder ball이 PCB와 전기적으로 연결된다.

다른 CPU Package에서는 `LGA`처럼 Ball 대신 평평한 contact를 사용하는 경우도 있어.

따라서:

> **Package → PCB 연결이 항상 Bump인 것은 아니다.**

라고 구분해두자.

---

## 10. 지금까지 전체 길을 한 번 따라가보자

CPU Core 안에서 어떤 `1` 신호가 만들어졌다고 해보자.

```text
MOSFET
  ↓
Logic Gate
  ↓
Signal Metal
  ↓
Upper Metal
  ↓
Pad
  ↓
Bump
  ↓
Package Substrate
  ↓
Solder Ball / Land
  ↓
PCB
  ↓
다른 Chip
```

반대로 전원은:

```text
PCB
 ↓
Package
 ↓
Bump
 ↓
Die의 PDN
 ↓
VDD / GND
 ↓
MOSFET
```

방향으로 들어올 수도 있어.

즉 지난 Lesson에서 배운 **Signal과 VDD/GND가 결국 Die 밖까지 이어지는 것**이야.

---

## 11. 그럼 Package는 정확히 왜 필요한 거야?

크게 세 가지로 보면 된다.

### ① 전기적 연결

```text
Die ↔ PCB
```

를 이어준다.

### ② 보호

맨 Die는 얇고 깨지기 쉬운 실리콘 조각이야.

Package가:

- 충격
- 먼지
- 습기
- 외부 환경

등으로부터 보호한다.

### ③ 열 방출

고성능 CPU/GPU는 열도 많이 발생한다.

Package와 Heat Spreader 등을 통해 열을 외부로 전달한다.

삼성전자 역시 Packaging의 역할을 **상호배선, 전력 공급, 방열 및 칩 보호**로 설명한다. [패키징 | 삼성반도체](https://semiconductor.samsung.com/kr/support/tools-resources/dictionary/semiconductor-glossary-packaging/?utm_source=chatgpt.com)

---

## 12. 매우 중요한 용어 혼동 하나

`Substrate`라는 말을 앞으로 많이 보게 될 거야.

그런데 문맥에 따라 의미가 달라.

### Transistor 공부할 때

```text
Silicon Substrate
```

→ MOSFET이 만들어지는 **실리콘 기반**

### Packaging 공부할 때

```text
Package Substrate
```

→ Die와 PCB를 연결하는 **Package 기판**

둘은 완전히 다른 물건이야.

앞으로 `substrate`라는 단어를 보면:

> **“지금 소자 얘기인가, Package 얘기인가?”**

부터 확인하면 된다.

---

## 13. Wire Bonding vs Flip Chip 한눈에 보기

```text
Wire Bonding

    ┌── Die ──┐
     \        /
      \ Wire /
════════════════
   Substrate
```

반면:

```text
Flip Chip

    ┌── Die ──┐
    ● ● ● ● ●
════════════════
   Substrate
```

Flip Chip은 Wire를 길게 돌아가지 않고 **Bump로 바로 아래 기판과 연결**하기 때문에 신호 경로가 짧고 높은 I/O 밀도에 유리하다. 삼성전자도 이 점을 Wire Bonding과의 주요 차이로 설명한다. [반도체 8대 공정 9탄, 외부환경으로부터 반도체를 보호하는 패키징 (Packaging) 공정 | 삼성반도체](https://semiconductor.samsung.com/kr/support/tools-resources/fabrication-process/eight-essential-semiconductor-fabrication-processes-part-9-packaging-to-protect-the-chips-from-external-elements/?utm_source=chatgpt.com)

---

## 핵심 용어 4개

| 용어 | 지금 이해할 뜻 |
|---|---|
| **Pad** | Die 내부 배선이 외부로 연결되는 금속 접점 |
| **Bump** | Die와 Package를 직접 이어주는 돌기형 전기 접점 |
| **Package Substrate** | Die와 PCB 사이에서 신호·전원을 재배선하는 기판 |
| **Flip Chip** | Bump가 있는 Die를 뒤집어 Substrate에 직접 연결하는 방식 |

---

## 실제 칩 + 이전 수업 연결

Module 2의 흐름을 이제 거의 한 번에 볼 수 있어.

```text
CPU Core / Cache
      ↓
Standard Cell
      ↓
MOSFET                 ← FEOL
      ↓
Contact
      ↓
Metal Layers           ← BEOL
      ↓
Signal / Clock / PDN
      ↓
Pad
      ↓
Bump
      ↓
Package Substrate
      ↓
PCB
```

즉 우리가 Module 1에서 시작했던 **MOSFET 하나가 실제 컴퓨터 기판까지 어떻게 이어지는지** 연결된 거야.

---

## 오늘의 짧은 요약

**① Pad는 Die의 외부 연결용 금속 접점이다.**

**② Flip Chip에서는 Pad 쪽에 Bump를 만들고 Die를 뒤집어 Package Substrate와 연결한다.**

**③ Package Substrate는 촘촘한 Die 연결을 PCB가 사용할 수 있도록 재배선한다.**

**④ Package는 단순 보호 껍데기가 아니라 전기 연결·전원·방열까지 담당한다.**

---

## 🧠 퀴즈

### Q1

Die와 Package Substrate 사이를 직접 연결하는 돌기형 구조는?

A. Via  
B. Bump  
C. Gate

**정답: B**

`Via`는 주로 배선층끼리 연결하고, **Bump는 Die와 Package 쪽 연결**에 사용한다고 구분하면 쉬워.

---

### Q2

Package Substrate가 필요한 가장 적절한 이유는?

A. MOSFET의 Channel을 만들기 위해  
B. Die의 촘촘한 I/O를 PCB 쪽 연결로 재배선하기 위해  
C. SRAM 데이터를 저장하기 위해

**정답: B**

Package substrate는 **Die ↔ PCB 사이의 중간 연결망** 역할을 한다.

---

### Q3

다음 연결 순서로 가장 적절한 것은?

A. MOSFET → Metal → Pad → Bump → Package → PCB  
B. MOSFET → PCB → Gate → Bump  
C. Package → MOSFET → Wafer → PCB

**정답: A**

이 순서는 오늘 반드시 머릿속에 남겨두자.

---

## 수업 중 추가 설명 — 필요할 때 이어 읽기

- **I/O = Input / Output**  
  칩이 **외부와 신호를 주고받는 연결**이야.

- **I/O 밀도**  
  일정 면적 안에 **외부 연결점(Pad/Bump)을 얼마나 많이 넣을 수 있는지**를 뜻해.  
  → 밀도가 높을수록 같은 면적에서 더 많은 신호를 주고받을 수 있어.

- **PCB = Printed Circuit Board, 인쇄회로기판**  
  CPU, 메모리 같은 여러 칩을 올리고 **서로 전기적으로 연결하는 큰 기판**이야.

흐름은 이렇게 보면 돼:

**Die → Package → PCB → 다른 칩/장치**

다음 수업: [Lesson 6](lesson-06.md).
