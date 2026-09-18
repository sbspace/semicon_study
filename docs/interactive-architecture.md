# Interactive Diagram 설계

2026-09-14 기준. 이 문서는 구현 명세이며 이번 작업에서는 문서만 추가한다. `content/`의 선언과 설명이 교육 내용의 기준이다. 조작 방식·상태·레이아웃은 그 설명을 바탕으로 제안하는 UI 설계이며 원문에 이미 선언된 설정이 아니다.

## 1. 현재 구현과 조사 기준

[콘텐츠 설계](content-architecture.md), 실제 `content/`의 curriculum·모듈·Lesson·Supplement·Review 및 supporting 문서, [visual_map](../content/visual_map.md), `src/content/types.ts`, parser와 loader, `.generated/content/documents/*.json`, `ContentRenderer.tsx`, 앱 스타일과 기존 테스트를 대조했다. 각 도식의 교육 목표는 해당 선언 앞뒤의 설명·예제·편집 보완을 기준으로 정리했다.

- 실제 interactive block은 **60개, type은 53개**다. Lesson 54개 슬롯, Supplement 5개 슬롯, Review 1개 슬롯이다. Module/Supporting Document에는 실행 슬롯이 없다. README의 fenced 문법 예제는 제외한다.
- 7개 타입이 두 문서에서 재사용된다: wafer-die-transistor, half-adder, sram-cell, die-floorplan, feol-mol-beol, pad-bump-package-pcb, chiplet-package. m00-l04에는 서로 다른 두 슬롯이 있다. Review의 유일한 슬롯은 m03-review다.
- 모든 실제 선언의 속성은 `type`뿐이다. 값 범위·초기 상태·정답·시나리오를 parser가 추정하지 않는다. `visual-needed`는 별도 슬롯이며 인접 Interactive와 자동 결합하지 않는다. visual_map은 제작 참고 자료이고 본문의 선언을 대체하지 않는다.
- 현재 React 19 / Vite / TypeScript 앱은 index와 개별 문서 JSON을 ContentLoader로 읽는다. ContentRenderer는 순서대로 Markdown·Quiz·Interactive·Visual을 분기한다. Interactive는 타입을 읽기 좋은 제목으로 바꾸는 aside placeholder다.
- 기존 스타일의 청록색·남색, 카드, 900/640px 분기와 reduced-motion 규칙을 활용한다. Quiz는 별도 session, progress는 별도 저장 계층이다. 도식은 양쪽 상태를 읽거나 변경할 필요가 없다.
- 기존 Vitest/Testing Library와 content·content-io·app·quiz·quiz-ui·progress 테스트를 확장할 수 있다. 새 테스트 도구나 canvas/game 라이브러리는 필요 없다.

## 2. 전체 inventory

문서 표기는 실제 frontmatter ID다. `mNN-lXX`는 아래 디렉터리의 `lesson-XX.md`를 뜻한다. 보충·Review 경로도 아래에 명시한다. 각 행의 **목표/핵심은 본문 근거**, **조작→결과는 제안**이다. 난이도는 현재 React+SVG 기반의 상대 추정이며 하=작은 선택/순수 계산, 중=복수 표현·기하, 상=상태 전이·교육적 예외 관리다. family와 primitive 약어는 다음 절에서 정의한다.

| Module | 실제 디렉터리 |
|---|---|
| m00 | [module-00-basics](../content/module-00-basics/module.md) |
| m01 | [module-01-cmos](../content/module-01-cmos/module.md) |
| m02 | [module-02-chip](../content/module-02-chip/module.md) |
| m03 | [module-03-process](../content/module-03-process/module.md) |
| m04 | [module-04-products](../content/module-04-products/module.md) |
| m05 | [module-05-advanced](../content/module-05-advanced/module.md) |
| m06 | [module-06-packaging](../content/module-06-packaging/module.md) |
| m07 | [module-07-hbm](../content/module-07-hbm/module.md) |
| m08 | [module-08-foundry](../content/module-08-foundry/module.md) |
| m09 | [module-09-trends](../content/module-09-trends/module.md) |

보충 경로: m01-s-half-adder = [supplement-half-adder.md](../content/module-01-cmos/supplement-half-adder.md), m01-s-sram = [supplement-sram.md](../content/module-01-cmos/supplement-sram.md), m02-s-feol-beol = [supplement-feol-beol.md](../content/module-02-chip/supplement-feol-beol.md), m02-s-floorplan = [supplement-floorplan.md](../content/module-02-chip/supplement-floorplan.md), m02-s-wafer-shot = [supplement-wafer-shot.md](../content/module-02-chip/supplement-wafer-shot.md)。m03-review = [review.md](../content/module-03-process/review.md)。

| # / type | 등장 문서 | 본문 교육 목표·핵심 takeaway | 제안: 조작 → 화면 결과 | 주 family / 난이도 / 재사용 |
|---|---|---|---|---|
| 1 `wafer-die-transistor` | m00-l01, m02-l01 | 반복 제조되는 die와 그 안의 소자 구분; m02에서는 기능 블록도 연결. die와 package는 다르다. | wafer/die/transistor 단계 선택 → 반복 격자·선택 die·소자 확대와 현재 위치 표시 | H / 하 / W,L |
| 2 `voltage-current` | m00-l02 | 전압차와 닫힌 경로가 전류 조건; 전압과 전류는 다르다. | 전압 단계와 회로 열기/닫기 → 전압 표시·전류 유무·부하 상태 | P / 하 / S,N |
| 3 `rc-coupling` | m00-l03 | 저항·축전·RC 지연과 인접 배선 영향 구분; 커패시터는 전기장에 에너지 저장. | R/C 선택, 입력 전환, 시간 단계 → 충전 곡선·지연; 별도 결합 보기에서 이웃 신호 변화 영향 | P / 상 / N,S,L |
| 4 `mosfet-channel` | m00-l04 | 절연된 Gate의 전기장이 channel을 제어; 산화막을 뚫는 gate 전류로 켜지지 않는다. | 정규화 Gate 전압 → channel 형성·Source–Drain 도통 상태 | P / 중 / T,S,N |
| 5 `mos-capacitor` | m00-l04 | Gate–절연막–반도체는 용량성 구조; 충전 과도와 정상 상태 구분. | 전압 전환 및 이전/다음 순간 → 양쪽 전하·전기장·과도/정상 표시 | P / 중 / L,N,S |
| 6 `np-doping` | m00-l05 | donor/acceptor와 전자/hole; N/P는 물질 전체의 순전하 부호가 아니다. | Si/donor/acceptor 선택 → 결합·다수 캐리어 비교 | C / 중 / L |
| 7 `nmos-pmos-channel` | m01-l01 | NMOS/PMOS의 상보 제어, Source 기준 전압; NPN 모양이 BJT라는 뜻은 아니다. | 입력 LOW/HIGH 선택 → 두 단면의 channel·ON/OFF 반전 | B / 중 / T,S |
| 8 `cmos-inverter` | m01-l02 | pull-up/pull-down이 출력 레일을 결정해 입력을 반전한다. | 입력 0/1 → PMOS/NMOS 상태·연결 레일·출력 및 진리표 행 | B / 하 / T,S |
| 9 `nand-nor` | m01-l03 | 직렬/병렬 네트워크와 NAND/NOR 결과 연결. | NAND/NOR 및 A/B → 도통 경로·출력·진리표 행 | B / 중 / T,S |
| 10 `half-adder` | m01-l04, m01-s-half-adder | XOR=Sum, AND=Carry; 1+1은 이진수 10. 보충도 XOR를 이 관계로 연결한다. | A/B → 두 논리 경로·Sum/Carry·이진 합 | B / 하 / S |
| 11 `full-adder` | m01-l05 | 이전 자리 Carry-in을 받아 다자리 계산으로 확장. | A/B/Cin → Sum/Cout·두 half-adder 경로 | B / 중 / S |
| 12 `flipflop-register` | m01-l06 | clock edge에서 D를 저장하고 사이에는 Q 유지; register는 여러 bit. | D 변경, 상승 edge 버튼 → D/Q 시간 단계·저장 비트 | M / 중 / S,E |
| 13 `sram-cell` | m01-l07, m01-s-sram | 교차 inverter와 access 2개로 1bit 유지; Hold는 진동이 아니다. | 쓰기0/1·읽기·Hold 단계 → Q/Q̅·WL·BL/BLB; 읽기 전 같은 전압 precharge 구분 | M / 상 / T,S,E |
| 14 `die-floorplan` | m02-l02, m02-s-floorplan | Core/cache/I/O 기능 배치와 연결; 보충은 계층과 긴 배선 의미. | 블록 선택·연결 보기 → 역할·이웃 경로 강조 | H / 중 / W,S |
| 15 `feol-mol-beol` | m02-l03, m02-s-feol-beol | 소자/접점/상부 배선은 한 칩의 다른 층. | FEOL/MOL/BEOL 선택 → 단면 층·contact/metal/via 강조 | H / 중 / L,T,V |
| 16 `signal-clock-pdn` | m02-l04 | 신호·타이밍·전원은 같은 배선 영역에 있지만 역할이 다르다. | 경로 종류 선택 → 동일 배치 위 경로·전달 대상 설명 | F / 중 / S,L |
| 17 `pad-bump-package-pcb` | m02-l05, m06-l01 | die에서 보드로 전기 연결; 패키지는 보호·열 역할도 하며 열 경로는 전기와 같지 않을 수 있다. | 연결 구간 선택, 전기/열 보기 → pad–bump–substrate–ball–PCB와 별도 열 경로 | H / 중 / L,V,S |
| 18 `chiplet-package` | m02-l06, m06-l02 | 기능 분할과 배치 방식은 별개; chiplet이 반드시 3D는 아니다. | monolithic/분할, 나란히/적층 사례 → die 간 연결과 패키지 구성 | H / 상 / W,L,V |
| 19 `wafer-shot-reticle` | m02-s-wafer-shot | reticle 패턴을 shot 단위 반복; shot·die·scribe가 다르다. | shot 이동·die/shot 표시 선택 → 노광 영역과 반복 die 경계 | H / 중 / W,E |
| 20 `process-overview` | m03-l01 | 공정은 필요한 구조에 따라 조합·반복하며 8단계 일회 통과가 아니다. | 구조 목표/단계 선택 → 웨이퍼 공정→die→package 개요와 반복 위치 | E / 중 / E,L |
| 21 `photo-pattern-transfer` | m03-l02 | Photo는 PR 패턴을 만들고 Etch가 아래 Film으로 전달; PR 아래 Film 누락 금지. | 도포/노광/현상/식각 이동 → PR·Film·wafer 단면 변화 | E / 중 / E,L |
| 22 `etch-profile` | m03-l03 | 방향성·선택비와 마스크 아래 가공; Wet/Dry를 절대적 형상 규칙으로 일반화하지 않음. | 대표 등방/방향성 사례·선택비 수준 → 옆/아래 제거·보호막 손실 비교 | P / 중 / L,N |
| 23 `deposition-conformality` | m03-l04 | PVD/CVD/ALD의 막 형성과 단차 피복; ALD cycle=정확한 원자 한 층은 아니다. | 공법 사례·cycle 단계 → 위/옆/바닥 피복 비교 | C / 중 / L,E |
| 24 `dual-damascene` | m03-l05 | 절연막 홈·via에 Cu를 채우고 표면 금속 제거. | 개념 공정 이전/다음 → line/via 공간·충전·CMP 결과 | E / 중 / L,V,E |
| 25 `cmp` | m03-l06 | 화학·기계 작용으로 평탄화; 과도하면 dishing/erosion. | 연마 부족/적정/과도 단계 → 단면 높이·결함 설명 | P / 중 / L,N |
| 26 `implant-profile` | m03-l07 | Energy는 깊이, Dose는 양에 영향; 주입≠활성화. | 두 상대 수준과 mask 보기 → 깊이 분포·농도·차단 영역 | P / 중 / L,N |
| 27 `thermal-process` | m03-l08 | 확산·회복/활성화·산화 구분; thermal budget 관리. | 목적과 짧음/길음 사례 → 분포·손상/활성화·산화막 비교 | C / 중 / L,N |
| 28 `clean` | m03-l09 | 오염 제거와 구조 보존 균형; 공정 사이 반복되며 Etch와 목적이 다르다. | 오염 종류·세정 강도 사례 → 잔사 감소와 과도 손상 | C / 중 / L,N |
| 29 `process-integration-review` | m03-review | 층/구조 요구에 따라 공정을 연결; 정해진 8대 공정 순서가 아니다. | 배선/도핑 목표 선택·단계 탐색 → 필요한 작업과 구조 변화 이유 | E / 상 / E,L,V |
| 30 `cpu-instruction-cycle` | m04-l01 | 제어·ALU·register 협업; 한 clock=한 명령 완료가 아니다. | 2+3 예제 단계 이동 → fetch/decode/execute/store 및 저장값 | E / 중 / E,S |
| 31 `cpu-gpu-parallelism` | m04-l02 | 독립/의존 작업과 자원 배치가 병렬 효과 결정; 실제 속도 예측 아님. | 작업 의존성·가상 작업자 수 → 대기/동시 실행 단계 비교 | C / 중 / E,N |
| 32 `npu-mac-dataflow` | m04-l03 | 입력×가중치 누산과 지역 재사용이 데이터 이동을 줄임. | 작은 입력/가중치·재사용 켜기 → 곱/부분합/출력·이동 횟수 | F / 중 / S,E,N |
| 33 `soc-block-map` | m04-l04 | CPU/GPU/NPU/메모리 제어/I/O가 연결되어 제품 일을 수행. | 사진 처리 등 작업 선택 → 블록 사이 데이터 경로 | F / 중 / W,S |
| 34 `memory-cell-comparison` | m04-l05 | SRAM 회로/DRAM capacitor/NAND 전하 저장 구분; cell과 제품은 다르다. | 메모리 종류·전원/시간 사례 → 보존·refresh 필요 비교 | C / 상 / T,L,S |
| 35 `memory-hierarchy-bottleneck` | m04-l06 | 계산 외 이동·재사용·겹침이 소요 시간에 영향. | 전송량/대역폭 예제·겹침/재사용 선택 → 이동시간과 계산시간 분리 | P / 중 / N,S |
| 36 `ppa-tradeoff` | m05-l01 | Power/Performance/Area 균형; 전압 감소가 모든 지표 동시 개선은 아님. | 전압비·대표 설계 선택 → 고정 C/활동/주파수의 동적 전력비와 정성 tradeoff | P / 중 / N |
| 37 `finfet-gaa` | m05-l02 | planar/FinFET/GAA는 Gate 제어 면적 차이; oxide 유지, nanosheet≠적층 die. | 구조 선택·단면 보기 → channel을 둘러싼 Gate 강조 | H / 중 / T,L |
| 38 `photo-etch-pattern-transfer` | m05-l03 | 미세화에서도 PR 패턴→식각 전사, EUV·NA·파장 구별. | 공정 단계·패턴 사례 → PR/Film 전사와 광학 역할 설명 | E / 중 / E,L |
| 39 `backside-power-delivery` | m05-l04 | 전원 경로를 후면으로 분리해 전면 신호 배선 여유; GAA와 다른 축. | 전면/후면 전원 선택 → 단면 전원/신호 경로 비교 | H / 중 / L,V,S |
| 40 `tsv-bonding` | m06-l03 | TSV는 silicon 관통, BEOL via/접합부와 다름. | TSV/미세 bump/접합면 선택 → 위치·연결·정렬 사례 | H / 중 / L,V |
| 41 `package-yield-path` | m06-l04 | die와 조립 수율·열/검증의 결합; KGD도 조립 후 보장 아님. | 가상 die/조립 수율 → 독립 가정 곱과 손실 단계; 열 문제 별도 사례 | P / 중 / N,E |
| 42 `hbm-bandwidth` | m07-l01 | 폭×pin 속도÷8이 이론 GB/s; 지연·실효 속도와 별개. | 폭·pin 속도 → 병렬 선·이론 대역폭과 단위식 | P / 하 / N,S |
| 43 `hbm-stack` | m07-l02 | DRAM/base/TSV/접합/interposer 역할; GPU는 옆, base가 GPU controller 전체는 아님. | 층·연결 선택 → stack 단면과 GPU까지 경로 | H / 중 / L,V,W |
| 44 `hbm-capacity-vs-bandwidth` | m07-l03 | 층수는 용량에 직접 영향, 대역폭과 같은 변수가 아니다. | 8/12/16H·die 밀도, 별도 폭/속도 → 용량/대역폭 별도 식; base 제외 | P / 중 / N,L |
| 45 `hbm-test-thermal` | m07-l04 | KGD·적층/접합 후 검사·열 경로를 함께 봐야 함. | 검사 단계·결함 위치·열 사례 → 발견 가능한 결함/열 배출 경로 | F / 상 / L,V,E,S |
| 46 `semiconductor-ecosystem` | m08-l01 | fabless/foundry/IDM/OSAT 역할은 겹칠 수 있다. | 역할/제품 흐름 선택 → 담당 일과 협업 연결; 회사 고정 분류 피함 | F / 하 / S,E |
| 47 `pdk-eda-ip` | m08-l02 | PDK 규칙·EDA 도구·IP 역할, DRC와 LVS 차이; 통과가 모든 검증 보장 아님. | 간격 오류/연결 오류 사례 → 해당 검사와 발견 이유 | C / 중 / L,S |
| 48 `design-to-silicon` | m08-l03 | 설계→검증→tapeout→제조→검사/조립과 피드백; MPW도 검증 필요. | 단계·문제 사례 → 산출물/역할·되돌아갈 확인 단계 | E / 중 / E,S |
| 49 `yield-capacity-cost` | m08-l04 | gross die·wafer/조립 수율 분모와 공급 조건 구분. | 500개·80%·95% 예제 변경 → 최종 양품 수와 손실; 비용/공급은 별도 조건 | P / 중 / N,E |
| 50 `technology-maturity-map` | m09-l01 | 발표·샘플·양산·출하의 증거 수준과 기술 축 구분. | 가상 발표/샘플/양산 증거 카드 선택 → 주장 가능한 단계·부족한 증거 | C / 하 / E |
| 51 `high-na-process-window` | m09-l02 | 같은 EUV 파장에서 NA 변화와 초점/공정 창·생산성 tradeoff. | NA 사례·초점 위치 → 정성 해상/초점 허용 범위 비교 | P / 중 / N,L |
| 52 `hbm-spec-reader` | m09-l03 | GB/H/TB/s 및 sampling/volume을 서로 다른 항목으로 읽음. | 교재 기반 가상 spec 필드 선택 → 단위·의미·확인할 조건 | C / 하 / N,E |
| 53 `chiplet-interoperability` | m09-l04 | 물리/프로토콜뿐 아니라 기능·옵션·열/조립 검증 필요. | 가상 두 chiplet의 조건 선택 → 층별 일치/미확인 설명; 호환 보증 아님 | C / 중 / L,S |

특히 공정 도식의 모양과 그래프는 정성 모델이다. implant 농도, 열처리 시간, 식각률, 공정 창을 실제 recipe 수치처럼 표시하지 않는다. Module 9의 자료 확인일은 교재의 2026-09-12 스냅샷이며 도식이 실시간 업계 현황을 제공하지 않는다.

## 3. 7개 interaction family

각 타입에는 inventory의 주 family 하나를 배정했다. 한 도식이 다른 family의 작은 UI를 사용할 수 있지만 범용 simulator 엔진이나 family별 상속 계층은 만들지 않는다.

| 약어 / family | 타입 수 | 공통 동작과 추출 범위 |
|---|---:|---|
| B — Binary & multi-input logic | 5 | HTML 0/1 입력, 순수 Boolean 계산, 출력/진리표 행. transistor 연결 회로와 adder 계산식을 범용 netlist로 통합하지 않는다. |
| P — Parameter & cause/effect | 14 | label/range/output, 단위·가정, 입력에서 파생되는 값. 각 식·물리 단순화는 개별 도식 책임. |
| H — Structure & hierarchy | 10 | 선택 부품/층, 상하위 breadcrumb, 단면 강조. package stack도 이 family에 포함한다. |
| E — Step-by-step process | 7 | 이전/다음/초기화, 현재 단계와 결과 단면. 단계 순서는 도식별 명시 배열. |
| F — Flow & signal path | 5 | 선택 흐름, wire/arrow 강조, 출발·도착·의미 텍스트. 범용 graph layout 엔진 불필요. |
| M — State & memory | 2 | 이벤트 전이, 입력과 저장값 구분, Hold/읽기/쓰기 설명. feedback 회로를 반복 렌더로 계산하지 않는다. |
| C — Comparison & evidence | 10 | 사례 선택·나란히 비교·조건/근거 표시. 정답 채점 기능을 포함하지 않는다. |

> family는 교육 동작의 분류이고 배포 chunk 또는 디렉터리를 강제하는 기술 단위가 아니다.

## 4. 최소 재사용 구조와 registry

```text
Markdown 선언 (read-only)
 → 기존 parser / InteractiveDeclaration
 → 기존 generated JSON / ContentLoader
 → ContentRenderer의 interactive 분기
 → InteractiveSlot (등록 조회, 로딩, 오류/fallback, instance 경계)
 → 명시적으로 등록된 lazy component
 → DiagramFrame + 필요한 작은 primitive + 도식 자체 계산/상태
```

현재 데이터 타입을 유지한다. `type`은 열린 문자열이다. 원본의 53 type 전체 union을 parser에 넣거나, UI 구현 여부로 콘텐츠 validation을 실패시키지 않는다. 아래는 **향후 코드 예시**다.

```ts
import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import type { InteractiveDeclaration } from '../../content/types.js';

export interface InteractiveProps {
  declaration: Readonly<InteractiveDeclaration>;
  documentRevision: string;
}
export type InteractiveComponent = ComponentType<InteractiveProps>;
export type InteractiveRegistry = Readonly<
  Partial<Record<string, LazyExoticComponent<InteractiveComponent>>>
>;

// registry.ts: 모듈 스코프에서 한 번 정의한다.
export const interactiveRegistry: InteractiveRegistry = {
  'cmos-inverter': lazy(() => import('./diagrams/CmosInverter.js')),
  'wafer-die-transistor': lazy(() => import('./diagrams/WaferDieTransistor.js')),
};
// 각 파일은 InteractiveProps를 받는 component를 default export한다.
// Object.hasOwn(registry, type) 확인 후 조회한다 (toString 등도 미등록).
```

실제 registry에는 구현한 항목만 추가한다. `import('./diagrams/' + type)`나 전체 eager barrel import, 속성의 JSX spread·eval·HTML 실행은 금지한다. 현재 `attributes`는 보존 정보이며 `type` 외 설정을 무조건 props로 해석하지 않는다. 새 설정이 정말 필요할 때 UI에서 허용 항목을 좁혀 별도 설계하고 기존 parser 계약은 유지한다.

ContentRenderer는 `<InteractiveSlot declaration={block.value} documentRevision={document.revision} />`만 호출한다. 도식 이름·진리표·전압식을 알지 않는다. slot의 remount key는 `documentId + revision + instanceId`의 충돌 없는 조합(예: JSON.stringify 배열)이다. 타입만 key로 쓰지 않는다. 각 SVG marker/clipPath/title ID는 React `useId()`로 만들고 원문 문자열을 그대로 DOM ID로 사용하지 않는다.

Slot은 다음 세 상태를 분리한다.

1. 미등록: 기존 placeholder 문구와 안전한 type 표시. 나머지 본문은 정상 출력한다.
2. 등록되었으나 lazy 로딩 중: Suspense의 짧은 한국어 상태와 일정한 최소 높이. 콘텐츠 전체를 감싸서 숨기지 않는다.
3. import/render 실패: 슬롯 단위 Error Boundary로 설명 fallback과 페이지 새로고침 안내. lazy의 실패 promise가 캐시될 수 있으므로 boundary reset만으로 재다운로드된다고 약속하지 않는다. 다음 문서/Quiz/progress를 막지 않는다.

선택·슬라이더·저장 bit는 각 instance의 `useState` 또는 필요한 경우 작은 reducer에 둔다. 동일 type이 두 문서에 있어도 상태를 공유하지 않는다. 문서 이동/개정/remount 시 초기화하며 localStorage·진도·Quiz session과 연결하지 않는다. 도식 조작 여부는 수업 완료 조건이 아니다. 기본 상태만으로 구조를 읽을 수 있고 모든 수업은 계속 접근 가능하다.

## 5. 공통 visual primitive 후보

inventory의 재사용 약어는 후보이지 첫 PR에서 모두 만들라는 뜻이 아니다. 두 번째 실제 소비자가 생겼을 때 공통화한다. 개별 좌표·교육 문구·공정 시나리오는 해당 도식 안에 둔다.

| 약어 / 후보 | 실제 반복 근거 | 표현 및 경계 |
|---|---|---|
| S — SignalWire / LogicValue | inverter, NAND/NOR, adder, SRAM, signal-clock-pdn | SVG path+화살표·굵기/점선; 0/1·ON/OFF는 텍스트. wire가 임의 회로의 전기적 해를 계산하지 않는다. |
| T — TransistorSymbol / MosCrossSection | NMOS/PMOS, inverter, NAND/NOR, SRAM / mosfet, FinFET | 회로 기호와 물리 단면은 별도 작은 SVG 구성. Gate/Source/Drain·oxide label 공유 가능. 두 표현을 혼합한 만능 transistor 금지. |
| W — WaferGrid / DieOutline | wafer hierarchy, wafer-shot / floorplan, SoC, chiplet | SVG 반복 die/윤곽. floorplan 배치와 shot grouping은 별도 데이터. 실제 mask/치수로 오인하지 않도록 개념도 표시. |
| L — MaterialLayer / LayerLabel | FEOL/BEOL, Photo, Etch, deposition, thermal, package | SVG rect/path와 재료 label·패턴. 층 순서/두께·제거 logic은 각 도식 소유. |
| V — ConnectionVia / StackDie | FEOL, damascene, TSV, HBM, packaging | SVG 연결 및 반복 die. contact/BEOL via/TSV/bump는 label·형상으로 구별; 같은 모양 하나로 의미를 지우지 않는다. |
| E — StepControls | process, CPU, flipflop, SRAM | HTML 이전/다음·단계 목록. 상태 전이 자체는 공통 hook으로 서둘러 추출하지 않는다. |
| N — ParameterControl / FormulaResult | RC, implant, PPA, bandwidth, yield | native range/select/number와 output, 단위·가정 텍스트. 단순 식은 HTML로 표현해 기존 수식 렌더러 의존성 불필요. |

`DiagramFrame`만 초기 공통 shell로 둔다: 제목, 한 줄 목표, controls 영역, SVG/HTML 결과, 짧은 feedback, takeaway, 초기화. 필요한 영역만 children/명시 slot으로 받고 모든 화면을 JSON schema로 생성하지 않는다. 장식 화살표, badge, 버튼은 기존 CSS를 우선 활용한다. DRAM stack이나 process layer 라이브러리를 1차에 미리 구현하지 않는다.

SVG는 선 연결·단면·확대 계층·패턴 정렬에 유리하다. 설명·버튼·입력·진리표·단위 계산·증거 카드는 HTML/CSS가 적합하다. SVG 안에 긴 본문이나 입력폼을 넣지 않는다. React가 계산한 상태로 SVG 속성을 바꾸며 DOM 직접 수정·canvas·외부 game engine을 추가하지 않는다.

## 6. 교육 UX와 단순화 규칙

각 화면은 **설명 → 조작 → 상태 변화 → 결과 문장 → 핵심 takeaway**를 따른다. 예: 입력 HIGH 선택 → NMOS ON/PMOS OFF와 GND 경로 → 출력 LOW → “입력을 반전한다”. 조작 전 예상해 볼 짧은 문장을 둘 수 있지만 점수·보상·강제 통과는 없다.

- 조작 하나가 바꾸는 개념을 보이게 한다. input과 derived output을 중복 state로 저장하지 않는다. 값/단위/가정을 결과 가까이 둔다.
- 상시 애니메이션은 피한다. 전류 표시가 전자 이동 방향인지 관습적 전류 방향인지 label을 붙인다. binary logic은 이상적 정상 상태이며 지연·누설·단락 전류 모델이 아님을 필요할 때 짧게 밝힌다.
- SRAM의 `1→0→1` 관계를 시간 진동으로 그리지 않는다. 읽기 전 BL/BLB 동일 precharge와 읽기 중 작은 차이를 단순 LOW/HIGH 반대 쌍으로 오도하지 않는다.
- MOS 전압 slider는 교육용 정규화 값이다. 임의 문턱을 모든 공정의 실제 Vth로 표시하지 않는다. PMOS의 LOW/HIGH는 표준 CMOS의 Source 레일 조건을 함께 표시한다.
- 수치 모델은 교재의 식/예제 범위에 한정한다. HBM은 bit/byte와 이론/실효를 구분, PPA는 동적 전력 조건을 고정, 수율 곱은 독립 가정을 명시한다. 관계가 정성적인 경우 가짜 정밀 수치나 제품 예측 점수를 만들지 않는다.
- 교육용 짧은 feedback은 UI 문구로 관리하되 Lesson을 새로 복제해 장문 설명을 유지하지 않는다. 각 component 구현 리뷰에서 inventory의 원문·편집 보완과 대조한다. 반복 type에 documentId별 숨은 동작 분기를 만들지 않고 두 수업 모두에 맞는 기본 표현을 제공한다.

## 7. 첫 구현 대상 8개와 순서

Module 0~1의 소자→논리→기억 학습 연결을 우선한다. 후보의 full-adder 대신 **half-adder**를 선택한다. 먼저 XOR/AND와 Sum/Carry를 확실히 보여주고 보충 수업에서도 재사용을 검증할 수 있다. full-adder는 이후 Cin 하나를 추가하는 확장으로 두면 초기 범위가 줄어든다. 초기 8개는 B/P/H/M의 4 family를 검증하며 공정/흐름/비교는 기초 primitive가 실제로 검증된 다음 다룬다.

| 순서 / 도식 | 목표·control·화면 변화 | 최소 상태와 파생값 | primitive / 난이도 / 후속 확장 |
|---|---|---|---|
| 1 cmos-inverter | 입력0/1 버튼 → 두 transistor ON/OFF, VDD/GND 중 도통 경로, Y와 2행 진리표. takeaway: 입력과 출력 반전. | `input: 0 또는 1`, 초기0. Y=1-input, NMOS=input, PMOS=1-input; 파생값 저장하지 않음. | Frame, LogicValue, SignalWire, 간단 transistor 기호 / 하 / NAND/NOR·SRAM |
| 2 wafer-die-transistor | wafer/die/transistor 버튼·돌아가기 → 선택 die에서 소자까지 단계 확대, breadcrumb. die view에서 기능 블록 포함 관계 설명. | `level: wafer 또는 die 또는 transistor`, 선택 die는 필요할 때만 index; 초기 wafer. | Frame, WaferGrid, DieOutline / 하 / floorplan·shot·chiplet |
| 3 voltage-current | 전압0/낮음/높음 선택과 경로 열기/닫기 → V와 전류 유무/상대 크기·부하 표시. | `voltageLevel: 0 또는 1 또는 2`, `closed: boolean`; 초기 1/false. 일정 저항의 이상 부하 모델로만 상대값 파생. | Frame, Wire, HTML ParameterControl / 하 / RC·HBM 등 입력/결과 shell |
| 4 mosfet-channel | 정규화 Gate slider → oxide 아래 channel·Source/Drain 연결·ON/OFF. Gate 전류로 연결되는 그림 금지. | `gateLevel: number` (0~1 교육 범위); 고정된 교육 threshold에서 on 파생. 초기0. threshold와 실물 수치 차이 표시. | MosCrossSection, ParameterControl, Wire / 중 / mos-capacitor·FinFET/GAA |
| 5 nmos-pmos-channel | 공통 LOW/HIGH 버튼 → NMOS/PMOS 단면 나란히 반전; 각 Source 레일 표시. | `input: 0 또는 1`; 초기0. 두 on 상태 파생; 독립 전압 solver 없음. | MosCrossSection, LogicValue / 중 / inverter의 구조적 설명·doping |
| 6 half-adder | A/B 버튼 → XOR 경로 Sum, AND 경로 Carry, 두 bit를 `Carry Sum` 순서로 표시. | `a,b: 0 또는 1`, 초기0/0; sum=a XOR b, carry=a AND b. | LogicValue, Wire, HTML truth table / 하 / full-adder·CPU |
| 7 nand-nor | 회로 선택과 A/B → 직렬/병렬 도통 경로, Y, 4행 진리표. | `mode: nand 또는 nor`, `a,b`, 초기 nand/0/0; 이상적 네트워크 도통과 Y 순수 계산. | TransistorSymbol, Wire, LogicValue / 중 / 회로 표현 재사용 확인 |
| 8 sram-cell | 쓰기0/1, 읽기, Hold·초기화 → 두 저장 node 및 access 경로, precharge/read 결과. | `q: 0 또는 1`, `phase: hold 또는 write-setup 또는 write-access 또는 read-precharge 또는 read-access 또는 read-result`, `writeValue: 0 또는 1`. 초기 q=0/hold를 교육용 사전 저장으로 명시. WL/BL/BLB 표시는 phase에서 파생; 쓰기 access에서만 q 갱신, 읽기는 q 유지. | TransistorSymbol, Wire, LogicValue, StepControls / 상 / flipflop·DRAM 비교 |

첫 번째는 cmos-inverter다. 제어 한 개와 완전한 두 상태로 registry/lazy/fallback/접근성/상태 격리와 실제 회로 결과를 함께 검증할 수 있다. 교과 순서와 구현 순서는 달라도 된다. 그 다음 다른 family인 hierarchy로 shell이 inverter에 종속되지 않는지 확인한다.

SRAM은 전원을 켠 이상적 셀로 범위를 고정한다. 전원 OFF 기능을 나중에 추가한다면 q에 unknown 상태를 도입하고 켤 때 기존 bit를 자동 복구하지 않는다. 쓰기 중 임의 phase 점프를 허용하지 않으며 읽기 경로는 명시된 단계로 진행한다. 초기화는 실물 reset pin이 아니라 도식 초기화다. read/write 시간을 실제 ns로 제시하지 않는다.

초기 대상 이후에는 flipflop/full-adder → FEOL·Photo 공정 family → signal-clock-pdn 흐름 → memory 비교로 확장한다. 53종을 미리 빈 component 파일로 만들지 않는다.

## 8. 접근성·모바일

- 입력은 native button/range/select를 사용한다. 0/1 토글은 현재 값과 `aria-pressed`, mode 선택은 native radio가 우선이다. Tab/Enter/Space와 range 방향키로 모든 조작이 가능해야 한다. drag/hover만으로 도달하는 기능을 두지 않는다.
- slider에는 연결된 label, min/max/step, 현재 값과 단위를 둔다. 정규화 수치의 `aria-valuetext`도 “교육용 Gate 수준 50%”처럼 의미를 설명한다. slider 움직임마다 긴 live announcement를 발생시키지 않는다.
- 결과는 읽을 수 있는 HTML 문장으로 제공한다. 이산 조작의 짧은 결과만 `aria-live="polite"`로 알린다. SVG에는 고유 title/desc와 연결된 접근 가능한 이름을 주고 중복 장식은 숨긴다. 그림만 봐야 알 수 있는 정답 정보를 만들지 않는다.
- ON/OFF·0/1·활성 경로는 색 외 텍스트, 선 굵기/점선, 기호로 구분한다. 키보드 focus를 제거하지 않는다. 대비는 밝은 배경에서도 확인한다.
- 터치 target은 설계 기준 최소 44×44 CSS px로 한다. 좁은 화면에서 control/설명은 위아래 배치, 진리표는 HTML 유지. SVG `viewBox`, `width:100%`, 적절한 aspect ratio를 사용하되 label까지 무조건 축소하지 않는다. 복잡하면 단계별 부분도나 별도 HTML label로 단순화한다. 320px 폭에서 페이지 전체 가로 스크롤이 없어야 한다.
- 기존 `prefers-reduced-motion` CSS를 계승한다. 향후 JS 타이머를 쓰면 media query도 반영하고 cleanup한다. 움직임 없이도 동일 최종 상태/정보를 제공한다. 기본은 수동 단계, 자동 재생 도입 시 중지 버튼과 비활성/이탈 시 정지를 제공한다.

## 9. 성능

기존 약 700kB JS chunk 경고는 이번 요청의 출발 조건이다. 이 문서 작업에서는 build를 재생성하거나 원인별 비중을 추정하지 않는다. 현재 Markdown/수식·라우터 등 의존성도 있으므로 도식 lazy만으로 기존 경고가 사라진다고 보장하지 않는다.

registry의 import 경로는 모두 literal이며 `lazy` 선언은 렌더 밖에 둔다. 방문 문서의 도식만 import되고 나머지 53종이 초기 실행 bundle에 정적으로 들어가지 않게 한다. 타입만 사용하는 import는 `import type`으로 유지한다. 작은 공통 primitive는 일반 import로 충분하며 Vite가 공통 chunk를 처리하도록 먼저 둔다. family별 manualChunks, viewport observer, prefetch scheduler는 초기 필수가 아니다. m00-l04의 두 도식도 정상적으로 동시에 로드할 수 있어야 한다.

후속 구현 때 build 결과의 entry/gzip 및 도식 chunk 크기, cold navigation의 네트워크 요청을 기록한다. inverter 문서 방문 시 미방문 SRAM/공정 module을 다운로드하지 않는지 확인한다. 현재 문서 요청·content cache 구조를 바꾸지 않는다. 입자 수천 개나 지속 타이머 대신 작은 SVG와 파생 계산으로 시작하고, 실제 병목이 관찰될 때만 최적화한다.

## 10. 다음 SOL 구현 범위와 파일 구조

**첫 SOL 작업은 registry 기반 + cmos-inverter 한 개만** 구현한다. 위 8개는 이후 작업 순서이며 한 번에 8개를 모두 완성하라는 범위가 아니다. 콘텐츠/parser/generated schema/Quiz/progress/Visual을 수정하지 않는다.

```text
src/app/interactive/
  types.ts                 # UI contract만 (content types 변경 없음)
  registry.ts              # 명시적인 lazy 매핑
  InteractiveSlot.tsx       # 조회·Suspense·슬롯 오류 경계·fallback
  DiagramFrame.tsx          # 공통 교육 흐름 shell
  diagrams/
    CmosInverter.tsx        # 두 상태와 SVG; 작은 순수 계산은 여기
tests/
  interactive-ui.test.tsx   # registry/slot/두 입력/접근성/격리
src/app/ContentRenderer.tsx # interactive 분기만 Slot 연결
src/app/styles.css         # 범위를 .interactive-diagram 등으로 제한
```

처음에는 inverter 기호·wire를 도식 안에 둬도 된다. 다음 NAND/NOR 등 실제 두 번째 소비자가 생기면 `primitives/LogicValue.tsx`, `SignalWire.tsx`, `TransistorSymbol.tsx`를 추출한다. Wafer·Layer·StepControls도 해당 단계에서만 추가한다. 복잡한 SRAM의 순수 transition 함수는 그때 인접 파일로 분리하고 transition test를 작성한다.

SOL 완료 검증:

1. 실제 m01-l02의 원래 슬롯 위치에 inverter 표시. 입력 0→Y1/PMOS ON, 입력1→Y0/NMOS ON과 두 레일 경로 확인. 초기화 및 keyboard 동작 확인.
2. 나머지 미등록 52종은 placeholder 유지. 알 수 없는 문자열·`toString`·import 실패·render 오류에도 문서 나머지 정상. 로딩과 미등록 문구를 구분.
3. 같은 타입의 두 instance는 독립적이며 문서 ID/revision 변경 시 상태 초기화. SVG ID 충돌 없음. 기존 Quiz 답안·완료 상태와 무관하며 모든 문서 접근 가능.
4. 320px/mobile와 desktop에서 label/버튼·focus·ON/OFF·reduced-motion을 실제 브라우저로 확인. Testing Library만으로 시각 검증 완료라고 하지 않음.
5. typecheck, 기존 전체 test, 새 interaction test, build 통과. build warning과 chunk 변화를 사실대로 기록. `content/` 작업 전후 SHA-256 비교, parser와 generated schema 변경 없음 확인.

이후 각 도식마다 inventory 원문과 단순화 범위를 리뷰한다. Boolean 회로는 모든 입력 조합, SRAM은 Hold·쓰기·비파괴 읽기 전이, HBM은 단위 계산, 공정은 단계별 층 순서를 검증한다. CSS 좌표와 동일한 값을 반복 asserting하는 테스트보다 학습자가 보는 결과와 보존해야 할 개념을 검사한다.

## 11. 이번 설계 작업 검증 결과

- generated의 interactive block 60개와 원문 선언을 대조하고, 위 inventory 53행의 type별 등장 document 집합이 generated와 일치함을 확인했다. family 합계는 53이다.
- `npm run typecheck` 통과, `npm test` 6개 파일/104개 테스트 통과. 구현 변경이 없는 문서 작업이므로 build·generated writer는 실행하지 않았다. 실제 도식 UI의 브라우저 검증은 다음 구현 단계의 작업이다.
- 작업 전후 파일별 SHA-256 비교: `content/` 83개, `src/` 23개, `.generated/content/` 83개 모두 변경 없음. 추가 산출물은 이 문서뿐이며 패키지를 설치하지 않았다.
