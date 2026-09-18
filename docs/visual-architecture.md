# Visual 자산 및 슬롯 처리 설계

2026-09-17 조사. **이번 산출물은 설계 문서 하나다.** 이미지 제작·다운로드, React 구현, 콘텐츠 수정은 하지 않는다. 교육 내용의 기준은 `content/`이고, 아래 분류·우선순위·registry는 UI에 대한 제안이다.

## 1. 조사 기준과 결론

[콘텐츠 설계](content-architecture.md), [Interactive 설계](interactive-architecture.md), [visual_map](../content/visual_map.md), curriculum과 Module 0~9의 Lesson·보충·Review 및 supporting 문서, 현재 generated JSON, `VisualPlaceholder` 계약, `ContentRenderer`와 CSS, 등록된 53개 도식의 구현을 대조했다. 본문의 태그 위치와 앞뒤 설명을 기준으로 판정했다. 기존 설계 문서의 “아직 placeholder”라는 역사적 설명을 현재 구현 상태로 간주하지 않았다.

현재 generated index의 contentVersion은 `2026.09.16`, parserVersion은 `0.3.1`, sourceDigest는 `f191aefb43bb5fdcaa6be55a8a65c2f6e1033bbc9a001cdeb9b2e4a6a7644003`이다. 실제 Visual은 **58 instance, sourceId 47개(visual-001~047 각각 한 번), ID 없는 슬롯 11개**다. Interactive는 60 instance / 53 type이며 모두 literal lazy registry에 등록되어 있다. 이것은 등록·소스 감사 결과이며 53개 모두의 교육적 완전성이나 브라우저 품질을 보증하는 표현이 아니다.

현재 Visual UI는 `figure.content-placeholder.visual-placeholder` 안에 `Visual`과 description만 표시한다. 실제로 “이미지 준비 중”이라는 문구를 출력하지는 않지만 모든 슬롯을 동일한 회색 점선 카드로 남긴다는 문제는 같다. sourceId·instanceId는 데이터에 있으나 현재 figure에는 노출하지 않는다.

**권장 배분은 A 21 / B 25 / C 10 / D 1 / E 1 / F 0 = 58이다.** 58장의 이미지 제작 계획이 아니다. A는 기존 도식으로 안내하고, B는 실제로 빠진 공간 관계를 보완하며, C는 실물 또는 공식 구조 자료의 관찰 가치를 보존한다. 사진 후보가 본문에 없다는 이유로 새 슬롯을 만들지는 않는다.

| 분류 | 결정 기준 | UI 결과 |
|---|---|---|
| A Interactive 대체 | 같은 문서의 현재 도식에서 해당 개념을 실제로 볼 수 있음 | 자산 없이 도식 안내 링크 또는 조건부 숨김 |
| B 정적 SVG | 도식에 없는 배선·단면·동시 비교 등 정밀한 공간 관계 필요 | 조작 없는 SVG와 caption |
| C 실제/reference image | 실물 사진·현미경 관찰 또는 특정 제조사의 공식 구조 그림이 본문의 목적 | 검토된 외부 원자료를 로컬 자산으로 제공 |
| D illustration/comparison | 기하 정밀성보다 인과·사례 비교가 목적 | 간단한 자체 제작 비교 graphic; SVG/HTML 가능 |
| E 생략 | 본문과 기존 도식으로 충분하고 독립적인 그림 참조가 없음 | 슬롯 비노출, 감사 기록 유지 |
| F 보류 | 교육 목적 자체의 판정에 추가 조사가 필요 | 설명 fallback 유지; 이번에는 0개 |

C의 자료 사용권은 아직 확인하지 않았다. 이는 교육 분류를 F로 바꿀 이유가 아니라 별도의 `rightsStatus: pending` 상태다. 우선순위 P1은 현재 설명의 이해에 빈틈이 있는 항목, P2는 구조 연결 또는 실물 보완, P3는 중복 정리다. 난이도 하/중/상은 각각 작은 안내·도형, 복수 패널·회로, 외부 자료 확보·해석·사용 조건 확인을 포함한 상대 작업량이다.

## 2. 58개 전체 판정 inventory

아래의 `mNN-lXX`는 Module NN / Lesson XX다. `m01-s-half-adder`, `m01-s-sram`, `m02-s-feol-beol`, `m02-s-floorplan`, `m02-s-wafer-shot`은 해당 모듈 보충 수업이다. **각 행의 instance, sourceId, 원문 type·description, 파일·행, 앞뒤 원문은 부록의 같은 instance 항목과 결합해 읽는다.** sourceId가 없는 11개도 instance 전체 문자열로 추적한다. 겹침은 교육 내용의 겹침이며 픽셀 유사도가 아니다. “없을 때”는 기존 Interactive와 본문을 유지했을 때의 영향이다.

### Module 0 — 11개

| instance | sourceId | 대응 Interactive / 겹침 | 앞→뒤의 교육 맥락·없을 때 영향 | 결정·이유 / 난이도·우선 |
|---|---|---|---|---|
| m00-l01:visual:1 | visual-001 | wafer-die-transistor / 높음 | 소자 소개→Gate/Source/Drain 이름. Transistor 단계로 이동하면 별도 그림 없어도 충분 | A: 세 단자와 oxide가 있는 단계 안내 / 하·P3 |
| m00-l01:visual:2 | visual-002 | wafer-die-transistor / 중간 | Ingot에서 원판→원판 전체와 반복 Die 관찰. 실물의 재질·외형 경험은 빠짐 | C: 실제 패턴 wafer 전체 사진 / 상·P2 |
| m00-l01:visual:3 | visual-003 | wafer-die-transistor / 높음 | 가공 완료 wafer→동일 회로 반복이 Die. 기본 wafer 격자가 목적 충족 | A: “가장 중요한 그림” 참조를 도식 안내로 연결 / 하·P3 |
| m00-l01:visual:4 | visual-004 | wafer-die-transistor / 낮음 | 잘라낸 실리콘→전기 연결·보호·외부 단자. 계층 도식에는 package 내부가 없음 | B: Die–연결–기판–외부 접점의 분해도 / 중·P1 |
| m00-l02:visual:1 | visual-005 | voltage-current / 높음 | 수도 비유→배터리·부하·닫힌 경로. 도식이 전압·전류와 회로를 함께 표시 | A: 같은 문서 회로로 안내 / 하·P3 |
| m00-l03:visual:1 | — | rc-coupling / 중간 | 전하 저장→전원–저항–커패시터와 스위치. 현재 R/C 연결 그림은 전원·귀환을 포함한 완전한 루프가 아님 | B: 스위치 포함 RC 폐회로, 충전 경로 / 중·P1 |
| m00-l03:visual:2 | — | rc-coupling / 낮음 | MOS 용량성→Gate/SiO₂/반도체 단면. 배선 coupling은 이 단면을 대신하지 않음 | B: 절연층 양쪽 전하와 전기장; 산화막 관통 전류 금지 / 중·P1 |
| m00-l04:visual:1 | visual-006 | mosfet-channel / 높음 | MOSFET 소개→네 부분과 channel. 인접 단면 도식이 목적 충족 | A: Gate 수준에 따른 단면으로 안내 / 하·P3 |
| m00-l04:visual:2 | visual-007 | mosfet-channel / 높음 | 전체가 transistor→소자 종류 구별. 도식 전체 구조로 설명 가능하나 앞쪽과 거리가 큼 | A: “전체 MOSFET 단면 보기” 링크 필수, 조용한 삭제 금지 / 하·P3 |
| m00-l04:visual:3 | visual-008 | mosfet-channel, mos-capacitor / 낮음 | planar 한계→회색 Fin의 위·양옆 제어. 현재 문서의 도식은 planar | B: 회색 Fin·Gate·oxide가 보이는 사시도 / 중·P1 |
| m00-l04:visual:4 | visual-009 | mosfet-channel, mos-capacitor / 낮음 | 삼성 공식 그림 소개→왼쪽 FinFET/오른쪽 GAA 비교. 일반 planar 그림은 불충분 | C: 삼성 공식 FinFET–MBCFET 구조 비교 자료 / 상·P2 |

### Module 1 — 13개

| instance | sourceId | 대응 Interactive / 겹침 | 앞→뒤의 교육 맥락·없을 때 영향 | 결정·이유 / 난이도·우선 |
|---|---|---|---|---|
| m01-l01:visual:1 | visual-010 | nmos-pmos-channel / 중간 | VDD/GND→실리콘 안의 PMOS/NMOS 배치·공통 OUT. 두 단면 비교만으로 공통 출력 연결이 보이지 않음 | B: well·소자 단면과 VDD/GND/OUT 연결 / 중·P1 |
| m01-l02:visual:1 | visual-011 | cmos-inverter / 중간 | 반전 목표→왼쪽 회로도·오른쪽 실리콘 단면 대응. 현재 도식은 회로 기호 | B: 회로↔물리 단면 짝, 010의 단면 재사용 / 중·P1 |
| m01-l03:visual:1 | visual-012 | nand-nor / 중간 | 직렬/병렬→PMOS 병렬·NMOS 직렬. 현재는 두 망을 사각 블록으로 표시 | B: 네 transistor의 실제 배선 topology / 중·P1 |
| m01-l03:visual:2 | visual-013 | nand-nor / 중간 | NAND 다음 NOR→위 직렬·아래 병렬. 말로 된 topology와 배선 형상은 다름 | B: 012와 동일 기호의 NOR 회로 / 중·P1 |
| m01-l04:visual:1 | visual-014 | half-adder / 높음 | Carry=AND→A/B가 XOR와 AND에 동시 입력. 기존 두 경로로 충분 | A: Half Adder 도식 안내 / 하·P3 |
| m01-l05:visual:1 | visual-015 | full-adder / 중간 | A/B/Cin, Sum/Cout→1bit와 다자리 연결. 기존 그림은 1bit 내부 half-adder 두 개 | B: 1bit 블록 옆에 ripple carry 연결, 자리 순서 표시 / 중·P1 |
| m01-l06:visual:1 | visual-016 | flipflop-register / 높음 | DFF 정의→D/CLK/Q와 상승 edge. D·Q 및 Clock 조작으로 저장 원리 확인 가능 | A: Clock ↑ 조작과 D/Q를 안내 / 하·P3 |
| m01-l06:visual:2 | visual-017 | flipflop-register / 중간 | edge 사이 Q 유지→timing diagram. 최근 저장값 목록은 D·CLK·Q 동시 파형이 아님 | B: 공통 시간축 3파형, edge 표식, D 변화에도 Q 유지 / 중·P1 |
| m01-l06:visual:3 | visual-018 | flipflop-register / 중간 | 여러 DFF→10110100 8bit 예. 현재 4bit 문자 블록은 8개 대응과 공통 CLK 선이 없음 | B: 8개 D/Q와 공통 CLK, 각 자리 연결 / 중·P2 |
| m01-l07:visual:1 | visual-019 | sram-cell / 중간 | 실제 6T→가운데4+양옆2. 현 도식은 inverter 2T 블록과 access 블록 | B: 여섯 개 MOS 기호, 교차 feedback, WL/BL/BLB / 중·P1 |
| m01-s-half-adder:visual:1 | visual-042 | half-adder / 높음 | 논리 구조→XOR Sum·AND Carry. 같은 도식이 목적 충족 | A: 본 수업과 동일 도식 안내 / 하·P3 |
| m01-s-sram:visual:1 | visual-043 | sram-cell / 중간 | SRAM 정의→6T의 T 개수. 개별 transistor를 셀 수 있어야 함 | B: 019의 정적 6T 회로 공유 / 중·P1 |
| m01-s-sram:visual:2 | visual-044 | sram-cell / 낮음 | Cell 반복→WL 행·BL 열과 array. 단일 셀 조작에 배열이 없음 | B: 소규모 셀 행렬과 행 선택·열 읽기 관계 / 중·P1 |

### Module 2 — 8개

| instance | sourceId | 대응 Interactive / 겹침 | 앞→뒤의 교육 맥락·없을 때 영향 | 결정·이유 / 난이도·우선 |
|---|---|---|---|---|
| m02-l01:visual:1 | visual-020 | wafer-die-transistor / 중간 | 실제 CPU 소개→왼쪽 die 사진·오른쪽 inverter layout. 계층 그림만으로 실물 패턴과 layout 대응이 안 보임 | C: die shot+교육용 layout 짝; 사진 부분 필수 / 상·P1 |
| m02-l02:visual:1 | visual-021 | die-floorplan / 중간 | 실제 CPU→무늬가 다른 Core/cache/I/O. 색 사각형은 실제 표면 관찰을 대신하지 않음 | C: 검증된 기능 주석 die shot / 상·P2 |
| m02-l03:visual:1 | visual-022 | feol-mol-beol / 중간 | 실제 단면→소자·접점·다층 배선. 계층은 설명되나 실제 층 형상은 빠짐 | C: FEOL–MOL–BEOL이 읽히는 현미경 단면 / 상·P2 |
| m02-l05:visual:1 | visual-023 | pad-bump-package-pcb / 높음 | 전체 구조→Die/Pad/Bump/기판/PCB. 현 단면에 모두 있으며 열도 별도 보기 가능 | A: “앱의 단순화 단면”으로 안내, 실사로 부르지 않음 / 하·P3 |
| m02-l06:visual:1 | visual-024 | chiplet-package / 중간 | 실제 chiplet→중앙 I/O와 주변 CPU chiplet 사례. 두 개의 일반 사각 die는 제품 배치를 설명하지 못함 | C: 해당 배치가 확인되는 공식 패키지 내부 사례 / 상·P2 |
| m02-s-feol-beol:visual:1 | visual-045 | feol-mol-beol / 중간 | 실제 칩 단면→상하 배선층. 022와 같은 관찰 목적 | C: 022 자산 공유, orientation·층 이름 검증 / 상·P2 |
| m02-s-floorplan:visual:1 | visual-046 | die-floorplan / 중간 | 실제 die의 무늬→계층·기능 영역. 개념 배치와 실물의 차이가 학습 대상 | C: 021 사진 공유, 필요하면 crop / 상·P2 |
| m02-s-wafer-shot:visual:1 | visual-047 | wafer-shot-reticle / 높음 | 삼성의 wafer 설명→Die/Scribe/Shot 구별. 현 도식에서 세 경계를 선택해 확인 가능 | A: 자사 앱 개념도임을 명시하고 도식 안내; 삼성 원본 그림으로 오인시키지 않음 / 하·P3 |

### Module 3 — 17개

| instance | sourceId | 대응 Interactive / 겹침 | 앞→뒤의 교육 맥락·없을 때 영향 | 결정·이유 / 난이도·우선 |
|---|---|---|---|---|
| m03-l01:visual:1 | visual-025 | process-overview / 낮음 | 출발점→원판 자체는 CPU가 아님. 현 도식은 공정 이름의 순환 지도 | C: 002의 실제 wafer 사진 공유 / 상·P2 |
| m03-l01:visual:2 | visual-026 | process-overview / 중간 | 쌓기 소개→Film 형성 전후. 지도에 단면 변화는 없음 | B: wafer 위 Film before/after / 하·P2 |
| m03-l01:visual:3 | visual-027 | process-overview / 중간 | 위치 정하기→Mask 빛 PR. 공정 이름 선택만으로 광학·PR 위치가 안 보임 | B: Mask–빛–PR–Film–wafer 기본도 / 중·P2 |
| m03-l01:visual:4 | visual-028 | process-overview / 중간 | Photo 다음 제거→보호 영역과 Film 식각. 순환 지도는 단면이 없음 | B: PR 보호와 Film 제거 전후 / 중·P2 |
| m03-l02:visual:1 | visual-029 | photo-pattern-transfer / 높음 | PR 정의→도포·노광·현상 흐름. 단계 도식에 PR/Film/wafer 존재 | A: PR 도포부터 단계 탐색 안내 / 하·P3 |
| m03-l02:visual:2 | visual-030 | photo-pattern-transfer / 낮음 | Stepper/Scanner→EUV 장비와 노광. PR 단면은 실제 장비 외형을 안 보여줌 | C: 공식 scanner 장비 사진, 외형과 기능 구별 / 상·P2 |
| m03-l02:visual:3 | visual-031 | photo-pattern-transfer / 중간 | Scanner 정의→Reticle–광학계–PR wafer. 장비 사진과 PR 공정도 사이의 설명 공백 | B: scanner 기능 블록도; DUV/EUV 광학을 섞지 않음 / 중·P1 |
| m03-l03:visual:1 | visual-032 | etch-profile / 높음 | Wet/Dry→등방·방향성 형상 사례. 현 단면에서 옆/아래 제거 비교 가능 | A: 대표 형상 사례로 안내; Wet=항상 등방이라고 확정 금지 / 하·P3 |
| m03-l04:visual:1 | visual-033 | deposition-conformality / 중간 | 여러 재료 막→CVD 설명. 현 피복선 하나는 다종 막 stack을 보여주지 않음 | B: 도전막/절연막 다층 단면 / 하·P2 |
| m03-l04:visual:2 | visual-034 | deposition-conformality / 높음 | 깊은 구조→Conformality. 위/옆/바닥 상대 피복을 현재 도식이 비교 | A: ALD와 단차 선택 안내 / 하·P3 |
| m03-l05:visual:1 | visual-035 | dual-damascene / 높음 | Line=수평/Via=층간→사이 절연막. 최종 CMP 단계에 line/via 공간과 연결 존재 | A: 최종 단계 보기 안내 / 하·P3 |
| m03-l05:visual:2 | visual-036 | dual-damascene / 높음 | Cu 공간 채움→대표 BEOL 방식. 여섯 단계로 직접 설명 | A: 단계 도식 안내 / 하·P3 |
| m03-l06:visual:1 | visual-037 | cmp / 높음 | 요철→평탄화와 과도 제거. 부족/적정/과도 단면으로 충분 | A: CMP 단면 안내 / 하·P3 |
| m03-l07:visual:1 | visual-038 | implant-profile / 높음 | 표면 증착 아님→silicon 내부 주입·mask. 도펀트 깊이/양과 차단 영역 존재 | A: 주입 분포 도식 안내 / 하·P3 |
| m03-l08:visual:1 | visual-039 | thermal-process / 중간 | 표면 산화→CVD와 생성 원리 비교. 현 도식은 oxide 두께와 설명만 변화 | B: 기존 Si의 반응과 외부 원료 증착을 나란히 표시 / 중·P1 |
| m03-l09:visual:1 | visual-040 | clean / 높음 | 반복 세정 서론→목표·오염 종류. 별도 그림 지시어 없이 목표와 도식으로 충분 | E: 서론의 일반 세정 카드 생략 / 하·P3 |
| m03-l09:visual:2 | visual-041 | clean / 중간 | Particle→위치에 따른 Open/Short 위험. 현 도식은 오염 수·표면 손상 중심 | D: 정상/단선/브리지 사례 비교, 항상 결함이 생긴다고 표현하지 않음 / 중·P2 |

### Module 4~9 — 9개

| instance | sourceId | 대응 Interactive / 겹침 | 앞→뒤의 교육 맥락·없을 때 영향 | 결정·이유 / 난이도·우선 |
|---|---|---|---|---|
| m04-l05:visual:1 | — | memory-cell-comparison / 중간 | 저장 원리 표→Cell과 제품 구별. 현 그림은 feedback 블록·간단 capacitor·전하 상자이며 6T/1T1C 구조 비교는 부족 | B: 6T·1T1C·NAND 저장 영역 3패널, 축척 다름 / 중·P1 |
| m05-l02:visual:1 | — | finfet-gaa / 중간 | 제어면 비교→oxide·nanosheet 설명. 현재 선택 단면에 S/D 방향 및 세 구조 동시 관점 비교가 빠짐 | B: 같은 관점의 3단면, S/D 방향과 oxide label / 중·P1 |
| m05-l03:visual:1 | — | photo-etch-pattern-transfer / 중간 | 반사 광학·NA→패턴 전사와 반복. 현재 수직 광선/PR/Film 그림에 반사 mask·광학계가 없음 | B: EUV 반사 경로와 PR·식각 패널 / 중·P1 |
| m05-l04:visual:1 | — | backside-power-delivery / 중간 | 전면/후면 표→연결·박막화. 현 Signal/Power 경로는 VDD/GND 개별 망 구분 없음 | B: 소자층 기준 VDD·GND 두 망과 후면 접점 단면 / 중·P1 |
| m06-l01:visual:1 | — | pad-bump-package-pcb / 높음 | Flip Chip→전기와 열. 회로면 아래·범프·기판·PCB·상부 열 경로 모두 존재 | A: 인접 도식으로 대체 / 하·P3 |
| m06-l02:visual:1 | — | chiplet-package / 높음 | 2.5D/3D 표→기능 분할과 배치 구별. 두 배치와 interposer/수직 연결 탐색 가능 | A: Chiplet 선택 후 나란히/적층 비교 안내 / 하·P3 |
| m06-l03:visual:1 | — | tsv-bonding / 높음 | Via/TSV/Microbump 표→다이 내부·경계 연결. 단면에서 위치와 경로 확인 가능 | A: 인접 연결 요소 도식으로 대체 / 하·P3 |
| m07-l02:visual:1 | — | hbm-stack / 높음 | 구성요소 표→GPU는 옆, base 기능. 현재 stack·접합·TSV·base·GPU·interposer가 함께 표시됨 | A: 인접 HBM 단면으로 대체; 실사 추가는 현재 필수 아님 / 하·P3 |
| m09-l02:visual:1 | — | high-na-process-window / 중간 | 조건 표→해상·초점 여유·PR/식각. 현 도식은 상대 막대이며 두 선·전사 결과를 그리지 않음 | B: 같은 목표 두 선의 광학/현상/식각 비교 / 중·P1 |

Module 8에는 Visual이 0개다. Module 9는 Lesson 2의 한 개뿐이다. Module/Review에는 Visual이 없고, 보충에는 6개가 있다. 위 분류를 모든 Lesson에 새 슬롯을 추가하는 근거로 사용하지 않는다.

## 3. Interactive 중복 감사에서 중요한 경계

등록 수 53/53은 Visual 해소율이 아니다. [NandNor](../src/app/interactive/diagrams/NandNor.tsx)는 PMOS/NMOS 망을 이름이 있는 블록으로 그린다. [SramCell](../src/app/interactive/diagrams/SramCell.tsx)은 inverter를 각각 2T 블록으로 그리므로 여섯 기호를 요구하는 019/043을 해결하지 않는다. [FullAdder](../src/app/interactive/diagrams/FullAdder.tsx)의 half-adder 두 개는 여러 자리 full-adder chain과 다르다.

[FlipflopRegister](../src/app/interactive/diagrams/FlipflopRegister.tsx)의 최근 저장값은 연속 시간축 파형이 아니며 4-bit 문자 예시는 본문의 8-bit 배선 그림과 다르다. [ProcessOverview](../src/app/interactive/diagrams/ProcessOverview.tsx)는 공정 선택 지도여서 026~028의 재료 변화 도식이 별도로 필요하다. [HighNaProcessWindow](../src/app/interactive/diagrams/HighNaProcessWindow.tsx)는 막대 비교여서 실제 두 선 형상과 전사 패널을 대체하지 않는다.

반대로 [PadBumpPackagePcb](../src/app/interactive/diagrams/PadBumpPackagePcb.tsx), [TsvBonding](../src/app/interactive/diagrams/TsvBonding.tsx), [HbmStack](../src/app/interactive/diagrams/HbmStack.tsx)는 요청된 연결 위치를 그린다. “HBM이므로 실제 TEM 필수” 같은 일괄 판단은 하지 않는다. 실사와 공간 관찰이 교육 목표인 020/021/022/045/046은 계속 C다. `reference-structure`라는 원문 type만으로 사진 또는 SVG를 정하지 않는다.

다른 Lesson의 도식은 현재 Lesson의 Visual을 자동 해소하지 않는다. m00-l04에 필요한 Fin/GAA는 m05-l02의 구현 존재만으로 A가 되지 않는다. m00-l03의 MOS capacitor도 m00-l04로 이동해야만 이해할 수 있게 두지 않는다.

### 원문 그림 참조의 보존

원문에는 “첫 번째 그림”, “왼쪽/오른쪽”, “회색 Fin”, “삼성 공식 자료”라는 구체적인 참조가 있다. B/C 제작 시 이 방향·대상을 맞추거나 caption에 실제 대응을 분명히 한다. 원문은 자동 교정하지 않는다. 특히 009는 일반 그림을 만들고 삼성 공식 자료로 소개하면 안 된다. 사용 가능한 공식 자료가 해당 패널 구성을 충족하지 못하면 fallback으로 남기고 콘텐츠 편집 검토를 별도 요청한다.

A 21개는 **별도 asset 불필요**라는 뜻이다. 항상 아무 흔적 없이 지워도 된다는 뜻은 아니다. 같은 문서의 인접 도식이며 지시어가 깨지지 않는 경우만 비노출한다. 먼 도식·선택 상태·원본 출처 언급이 있는 001/007/047 등은 짧은 안내를 남긴다. 예: “이 구조는 아래 ‘Wafer → Die → Transistor’에서 Transistor 단계를 선택해 볼 수 있습니다.” 047은 “아래는 본문에서 설명한 관계를 정리한 앱 개념도입니다”라고 명시해 삼성 그림이라는 잘못된 귀속을 피한다.

## 4. 실제/reference image 계획 — C 10슬롯

| 자산 묶음 / 연결 슬롯 | 필요한 모습·반드시 보일 것 | 일반 illustration으로 부족한 이유 | 권장 출처 유형 |
|---|---|---|---|
| patterned-wafer / 002,025 | 원판 전체와 실제 반복 die; bare wafer와 가공 wafer 구별 caption | 재질·반사·실제 표면과 추상 격자를 연결하는 관찰 | wafer 제조사·반도체 제조사 공식 교육/미디어 자료 |
| cpu-die / 020,021,046 | 실제 die top view, Core/cache/I/O 식별 근거. 020은 오른쪽에 별도 교육용 inverter layout 필요 | 본문이 실제 사진의 무늬를 관찰하도록 요청 | CPU 제조사 공식 die shot·기술 문서, 사용 허가된 대학 자료 |
| chip-cross-section / 022,045 | 아래 소자·접점·위 다층 배선을 구별할 수 있는 SEM/TEM 또는 검증된 실물 단면, 방향·scale bar 유지 | 실제 배선층의 밀도·형상과 개념 층을 대응 | 제조사·연구기관·대학의 공개 기술 자료 |
| chiplet-product / 024 | 중앙 I/O die와 주변 CPU chiplet의 실제 배치, 제품·세대 명시 | 본문이 특정 실제 구성 사례를 설명 | 해당 제조사 공식 패키지 내부 사진/구조 자료 |
| scanner / 030 | 노광 장비 전체 외형; 필요 시 wafer 위치를 확인한 주석 | PR 단면이 공장 장비 외형·역할을 보여주지는 못함 | 장비사 공식 미디어/교육 자료 |
| official-fin-gaa / 009 | 삼성 공식 구조 그림, FinFET 왼쪽·GAA 오른쪽, 채널/Gate 구별 | 본문에 명시된 회사 자료라는 정체성을 보존해야 함 | 삼성 공식 기술 설명 자료; 전재·편집 조건 확인 |

**10은 슬롯 수다. 6개 자산 묶음으로 공유할 수 있다.** 9슬롯은 실물 사진/현미경 자료 중심이고, 009 한 슬롯은 공식 구조 일러스트도 적합하다. C를 “실사 10장”으로 보고하지 않는다. 020의 layout 보조 패널은 자사 교육용 정적 도형이며 사진과 축척·출처를 분리한다. 하나의 die 사진에서 근거 없이 기능 영역을 추측해 라벨링하지 않는다. 허용 crop/주석 여부가 다르면 공유 범위를 줄인다.

이번에는 외부 URL 검증·다운로드를 하지 않았다. 원문 링크와 visual_map 검색어는 **탐색 단서**일 뿐, 자산 URL·사용권의 증거가 아니다. SEM/TEM, Fin/GAA 실제 단면, TSV/HBM 사진은 향후 선택적 심화 자료가 될 수 있지만 이번 58슬롯에서 필요 이상으로 사진을 늘리지 않는다.

## 5. 정적 SVG·graphic 제작 목록

다음은 B 25슬롯의 자산 공유 후보다. 최종 파일 수는 패널 분리 및 모바일 검토 후 정한다. geometry·교육 문장은 Visual 소유이며 Interactive component를 고정 상태로 mount하거나 그대로 복제하지 않는다.

| 자산 묶음 | B 대상 | Interactive와 다른 내용 | 기존 primitive 활용 후보 |
|---|---|---|---|
| package-intro | 004 | 패키지 보호/연결의 한눈에 보는 분해 관계 | StructureBlock; caption은 별도 |
| rc-loop | m00-l03:visual:1 | 전원·스위치·R·C·귀환이 있는 폐회로 | 기본 SVG path/line; RC 상태 계산 재사용 안 함 |
| mos-capacitance | m00-l03:visual:2 | Gate/oxide/반도체와 양쪽 전하 | MosCrossSection은 모양 적합성 검토; 단순 층이면 MaterialLayer |
| fin-perspective | 008 | 본문이 지칭하는 회색 Fin과 3면 Gate | 정적 SVG; 3차원 엔진 불필요 |
| cmos-physical | 010,011 | 회로와 well/소자 단면의 OUT 대응 | MosCrossSection의 개별 형상 후보; 두 소자 연결은 별도 |
| nand-nor-topology | 012,013 | 네 MOS의 직렬·병렬 배선 자체 | 현재 범용 TransistorSymbol은 없음; 필요한 작은 기호만 두 소비자에서 추출 검토 |
| adder-chain | 015 | 1bit와 여러 자리 Carry 연결 | StructureBlock, SVG path |
| dff-timing | 017 | D·CLK·Q 공통 시간축과 sampling edge | 정적 path; 타이머·waveform library 불필요 |
| register-eight | 018 | 10110100의 8개 bit 대응·공통 CLK | StructureBlock 반복 |
| sram-six | 019,043 | MOS 6개와 교차 feedback·access | nand-nor와 기호 공통화 가능; 상태 머신 없음 |
| sram-array | 044 | WL 행/BL 열/셀 배열과 주변 읽기 연결 | StructureBlock 반복; 실제 array 크기 아님 |
| process-basics | 026,027,028 | 증착/PR 선택/식각의 정적 전후 | MaterialLayer, ProcessView; 단계 control 제외 |
| scanner-path | 031 | reticle·광학계·wafer 기능 연결 | SVG path/label; 027과 PR 층 어휘 공유 |
| multi-material | 033 | 서로 다른 재료의 층 stack | MaterialLayer |
| oxidation-vs-deposition | 039 | Si가 반응하는 경우와 외부 원료 막 형성 | MaterialLayer; 정확한 성장 비율 수치 불필요 |
| memory-structure | m04-l05:visual:1 | 6T/1T1C/NAND 저장 영역을 동시에 비교 | sram-six 패널을 재사용; 같은 축척으로 오인 금지 |
| transistor-compare | m05-l02:visual:1 | 같은 관점 세 단면 + S/D 방향 + oxide | fin-perspective와 label 어휘 공유; 자동 동일 geometry 아님 |
| euv-transfer | m05-l03:visual:1 | 반사 mask·반사 광학 경로→PR→Film | scanner-path/MaterialLayer; 반사 방향 검토 |
| backside-rails | m05-l04:visual:1 | Signal과 VDD/GND의 분리 및 후면 연결부 | MaterialLayer, SVG 경로 |
| high-na-pattern | m09-l02:visual:1 | 동일 목표 두 선·PR 현상·식각 결과 | euv-transfer 패널 재사용; 장비 성능 예측 아님 |

D는 **visual-041 한 개**다. 정상 배선·미형성으로 인한 단선·브리지 사례를 간단한 비교 graphic으로 그린다. 오염이 반드시 그 결과를 낸다는 식의 결정론적 화살표를 피하고 “가능한 영향의 예”라고 명시한다. 이 graphic을 SVG로 구현해도 분류는 교육 목적상 D이며 B에 중복 집계하지 않는다.

`StructureView`, `ProcessView`, `ConceptView`, `StackView`는 접근성 SVG shell 후보이고 `MaterialLayer`, `StructureBlock`, `StackDie`, `VerticalVia`, `BondingInterface`는 실제 존재한다. 반면 설계 문서의 `SignalWire`, `TransistorSymbol` 등 모든 후보가 구현됐다고 전제하지 않는다. 기존 wrapper의 Interactive 전용 CSS 결합을 먼저 확인한다. 새 라이브러리·범용 JSON diagram 엔진은 필요 없다.

## 6. Visual registry와 런타임 경계

현재 content/parser/generated 계약을 유지하고 UI 전용 명시 manifest를 권장한다. parser의 `VisualPlaceholder.type`은 열린 문자열로 그대로 둔다. `visual_map`에서 런타임 슬롯을 만들거나 description으로 자산을 검색하지 않는다.

```text
VisualPlaceholder (read-only, original.source 유지)
 → VisualSlot: 검토된 binding 조회 및 내용 일치 확인
 → static-svg / image / illustration / resolvedByInteractive / omit / pending
 → VisualFrame (figure + caption + 필요한 source)
```

### 키와 개정 안전성

- 명시 sourceId 47개: `JSON.stringify(['source', documentId, sourceId])`로 scope를 둔다. sourceId만 전역 조회하지 않는다.
- sourceId 없는 11개: `JSON.stringify(['instance', documentId, instanceId])`를 사용한다. ordinal instanceId는 영구 ID가 아니다.
- 각 binding은 `expectedType`, `expectedDescription`, 검토한 `documentRevision`을 보관한다. 같은 sourceId여도 개정 후 문맥이 달라질 수 있다. 불일치한 매핑은 자동 적용하지 않고 pending으로 돌아간다. 개정 검토 후 metadata만 갱신한다.
- 문서 revision 전체를 검사하면 무관한 문장 수정도 재검토를 유발하지만, 첫 버전에서는 이 보수적 방식이 안전하다. 나중에 필요성이 확인되면 원문 태그+인접 문맥의 fingerprint로 세분화한다.
- registry는 `Map` 또는 own-property 확인을 사용한다. `toString`/`__proto__`도 미등록으로 처리한다. type을 경로에 이어붙여 동적 import하지 않는다.

```ts
// 향후 UI 설계 예시; content types 수정 지시가 아니다.
type VisualHandling =
  | { kind: 'static-svg' | 'illustration'; assetId: string }
  | { kind: 'image'; assetId: string }
  | { kind: 'resolvedByInteractive'; targetInstanceId: string;
      targetType: string; presentation: 'link' | 'hide-when-ready';
      guidance: string }
  | { kind: 'omit'; reason: string }
  | { kind: 'pending'; reason: string };

interface VisualBinding {
  documentId: string;
  instanceId: string;
  sourceId?: string;
  documentRevision: string;
  expectedType: string;
  expectedDescription: string;
  handling: VisualHandling;
  reviewedAt: string;
  rationale: string;
}
```

bindings와 assets는 분리한다. 019/043은 두 binding이 하나의 `sram-six` 자산을 참조한다. 자산 manifest는 제작 상태·caption/alt·출처·사용 조건을 갖고, binding은 해당 위치의 목적·검토 근거를 갖는다. 020처럼 복합 패널이면 `assetId`가 명시적 composite를 참조하고 각 부분 출처를 따로 기록한다. 임의 source 문자열이나 content attributes를 JSX에 spread하지 않는다.

정적 component registry도 literal lazy import를 모듈 스코프에 선언한다. 작은 공통 SVG shell은 일반 import한다. 원격 SVG/HTML을 `dangerouslySetInnerHTML`로 삽입하지 않는다. image URL은 reviewed local asset manifest에서만 얻는다. 현재 ContentLoader/cache·문서 JSON 파일 배치·writer를 변경할 이유가 없다.

### A와 E의 처리 결정

**추천은 A=명시적 도식 연결, E=명시적 비노출**이다. 인접성 자동 추론은 금지한다. A에는 같은 문서에 실제 존재하는 정확한 `targetInstanceId`와 기대 type을 기록한다. 예를 들어 m07-l02의 Visual은 `m07-l02:interactive:1`의 hbm-stack으로 연결한다. 기본은 짧은 안내 링크이고, 인접·참조 안전성을 검토한 항목만 `hide-when-ready`로 둔다.

링크는 해당 InteractiveSlot wrapper의 안정적인 UI anchor로 이동한다. 원문 ID를 그대로 DOM ID로 쓰지 않고 안전한 UI ID를 할당하며 중복을 검사한다. 초점 이동과 제목 읽기를 지원한다. “어떤 버튼을 선택하면 되는가”는 guidance로 제공하고, Visual이 도식 state를 바꾸거나 별도 Interactive를 mount하지 않는다. 현재 Quiz/progress 상태와 연결하지 않는다.

`resolvedByInteractive`를 단순 registry 등록 여부만으로 숨기면 import 실패 시 정보가 사라진다. 향후 문서 범위의 작은 ready/error 상태 전달을 InteractiveSlot과 VisualSlot 사이에 두되 도식 내부 학습 state는 공유하지 않는다. target 누락·type 불일치·revision 불일치·로딩/오류 시 Visual은 읽을 수 있는 설명 fallback을 유지한다. ready일 때만 숨김 또는 정상 안내로 전환한다. 첫 SOL에서는 **링크 방식만** 구현해 이 상태 정책을 검증한다.

E의 040은 사유를 기록하고 `null` 반환할 수 있다. 개발 감사에서 binding key·instance/sourceId·원문 위치·분류를 조회할 수 있어야 한다. production DOM에 숨은 이미지·focus target·스크린리더용 빈 figure를 잔뜩 남길 필요는 없다. 숨긴 슬롯도 manifest와 JSON으로 추적된다. pending/미등록/깨진 이미지·component에는 짧은 description fallback을 제공하고 문서 전체를 실패시키지 않는다.

## 7. 디자인·출처·성능 원칙

VisualFrame은 제목/caption → 그림 → 필요 시 짧은 설명과 출처 순서다. Interactive의 control header·초기화·조작 안내를 복제하지 않는다. navy·teal·밝은 배경·기술 label과 여백은 공유하되 회색 Fin 등 원문이 특정한 의미 색을 우선한다. 실제 사진의 색을 브랜드 팔레트에 맞추려고 바꾸지 않는다.

색만으로 재료·전류·선택 경로를 구분하지 않는다. 선 종류·기호·label을 함께 쓴다. SVG의 title/desc ID는 useId로 만들고 HTML caption에 핵심 관계를 설명한다. 이미지 alt는 “이미지”나 원래 placeholder description 복사가 아니라 학습자가 확인할 구조를 설명한다. 장식은 접근성 트리에서 제외한다. source 링크를 별도 제공하고 확대가 꼭 필요하면 native button 기반 확대 보기로 설계한다.

320px에서 caption·source·label이 읽히며 페이지 가로 스크롤이 없어야 한다. 3패널은 세로로 재배치하고 시간축 파형은 핵심 edge 수를 줄인다. 모든 label을 작은 SVG 안에 넣어 축소하지 않는다. 정적 자료에는 상시 애니메이션이 필요 없다. 기존 reduced-motion 정책을 그대로 따른다.

### 출처 기록 및 사용 조건

공식 공개 자료를 우선 탐색하되 **공개 열람 가능과 재배포 허용은 별도로 검토**한다. 아래는 자산 도입 시 적용할 내부 운영 기준이며, 이번 단계에서 개별 이미지의 사용권을 확인했다는 뜻이 아니다.

자산마다 publisher/author, 원문 페이지 URL, 원래 asset URL, 문서명·figure/page, 확인일, license 이름과 조건/근거 URL 또는 허가 기록, attribution 문구, crop/annotation 등 변경 내역, 제품·세대·촬영/발표 시점, 검토자, 로컬 파일·hash·치수를 기록한다. `rightsStatus`는 pending/approved/rejected로 분리하고 approved만 배포한다. attribution을 썼다는 이유로 사용 허가를 대신하지 않는다.

기본은 허용된 원본을 로컬 자산으로 저장하고 앱이 크기·캐시·실패 처리를 관리하는 방식이다. 외부 hotlink는 기본 금지 정책으로 한다. URL 만료·외부 요청·원본 교체와 가용성 문제가 있으므로 예외는 명시 검토한다. 출처 페이지로 가는 링크는 hotlink 이미지와 별개다. 검색 결과 썸네일·블로그 재게시·불명확한 원수업 이미지 URL을 승인 자산으로 승격하지 않는다. m00-l03의 원래 두 링크도 그대로 Markdown 링크이며 자동 img src로 변환하지 않는다.

허가가 없으면 다운로드/배포하지 않고 description fallback 또는 사용 가능한 출처 링크만 유지한다. 자체 SVG로 대체할 수 있는 일반 구조라면 별도 재판정하되 C의 실물 관찰·공식 자료 정체성까지 해결됐다고 표시하지 않는다. AI 생성 이미지를 SEM/TEM·실물 제품 증거처럼 제시하지 않는다.

### 성능

사진은 글자·미세 패턴 보존을 확인한 WebP/AVIF 파생본과 필요 시 호환 fallback을 준비한다. 무손실이 필요한 현미경 scale bar·세부 label은 압축 후 확인한다. 벡터 도식은 SVG를 우선하며 텍스트가 많은 기술 그림을 무조건 래스터화하지 않는다.

`width`/`height` 또는 aspect-ratio로 공간을 예약하고 `srcset`/`sizes`로 화면에 맞는 이미지를 선택한다. 아래쪽 이미지는 native `loading="lazy"`, `decoding="async"`를 사용한다. 첫 화면의 핵심 이미지를 무조건 lazy로 지연시키지 않는다. caption·출처·fallback도 같은 레이아웃을 유지한다. 공유 자산은 같은 URL/hash로 캐시한다.

이미지 바이너리를 JS/base64 registry에 넣지 않는다. 문서별 도식만 lazy import하고 manifest에는 가벼운 metadata만 둔다. Vite의 import/public 경로 방식은 첫 자산 구현 때 결정하되 `.generated/content`에 미디어나 검증 임시파일을 저장하지 않는다. 빌드 시 복사될 public 경로와 writer가 소유한 콘텐츠 산출물을 분리한다. 현시점에는 이미지 변환 서버·CDN·observer scheduler·대규모 pipeline을 만들지 않는다.

## 8. 구현 batch 및 작업량

**Module 기준 3개 batch**를 권장한다. 공유 자산을 먼저 설계하고 같은 batch 안에서 소비 슬롯을 연결한다. 첫 SOL은 Batch A의 작은 pilot이며 네 번째 별도 batch로 중복 집계하지 않는다.

| Batch | 범위 | A 대체 | B SVG | C reference image | D graphic | E 생략 | F 보류 | 합계 | 예상 제작·검토량 |
|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| A | Module 0~3 | 17 | 20 | 10 | 1 | 1 | 0 | 49 | registry 기반 + 회로/공정 정적 패널 + 6개 외부 자산 묶음 검토. 3개 중 가장 큼; pilot→회로→공정→실사로 나눠 진행 |
| B | Module 4~6 | 3 | 4 | 0 | 0 | 0 | 0 | 7 | 메모리·소자·EUV·전원 4개 구조 비교; SRAM/층 primitive 재사용 |
| C | Module 7~9 | 1 | 1 | 0 | 0 | 0 | 0 | 2 | HBM 안내와 High-NA 패턴 비교; EUV 패널 재사용 |
| 전체 | Module 0~9 | 21 | 25 | 10 | 1 | 1 | 0 | 58 | 슬롯 수이며 파일 수·이미지 장수가 아님 |

일정으로는 Batch A를 한 번에 완료하려 하지 않는다. 상대 작업량은 A가 대략 전체의 3/4 이상, B가 중간 규모, C가 작은 마무리다. 실제 사진 확보 기간은 라이선스와 자료 가독성 검토에 따라 달라지므로 개발 일수처럼 확정하지 않는다. 같은 C 묶음의 여러 슬롯은 1회 소스 검토를 공유하지만 개별 caption·원문 참조 검수는 모두 한다.

우선순위 상위 5개는 **019(6T 회로), 017(D/CLK/Q timing), m04-l05:visual:1(메모리 구조 비교), m05-l03:visual:1(EUV 반사 경로), 020(실제 die+layout)**다. 앞의 두 개는 회로·시간 표현의 빈틈을 막고, 다음 둘은 현재 도식이 생략한 구조를 보완하며, 020은 개념과 실물 관찰을 연결한다. 이는 P1 내부의 구현 추천 순서이며 C 사용권 승인을 기다리는 동안 B 작업을 진행할 수 있다.

### 첫 SOL의 정확한 범위

1. UI 전용 `visual/types.ts`, `registry.ts`, `VisualSlot.tsx`, `VisualFrame.tsx`의 최소 구조를 만든다. ContentRenderer의 visual 분기만 Slot으로 연결한다. 실제 이미지 pipeline은 만들지 않는다.
2. 정적 자산 **2개만** 제작한다: `SramSixTransistors`(019와 043 공유), `DffTiming`(017). B binding 3개를 완료한다. 각각 6개 소자·교차 연결과 D/CLK/Q sampling 관계를 검수한다.
3. A binding **2개**를 안내 링크 방식으로 연결한다: 006→m00-l04:interactive:1/mosfet-channel, 005→m00-l02:interactive:1/voltage-current. 상태 안내와 실패 fallback을 검증한다. E binding **1개**인 040을 명시적으로 생략한다.
4. 즉 pilot은 **6슬롯 = B3+A2+E1**, 외부 이미지 0개다. 나머지 **52슬롯 = A19+B22+C10+D1**은 기존 설명 fallback을 유지한다. 58건 전체를 자동 hide 처리하지 않는다. 향후 등록할 metadata를 이번 pilot에서 작동 완료로 세지 않는다.
5. 콘텐츠/parser/generated/writer/Quiz/progress와 기존 도식 계산·geometry는 변경하지 않는다. 필요한 연결 anchor/ready 신호는 InteractiveSlot wrapper의 최소 UI 변경으로 한정한다.
6. 검증: sourceId 없는 키·sourceId 키·revision 불일치·미등록/toString·중복 source 범위·target 누락/오류·SVG ID 독립·공유 자산 caption·원문 블록 순서. 실제 수업에서 두 6T 소비자와 timing 위치를 확인한다. 키보드 링크/초점, 320px/desktop, reduced-motion을 실제 브라우저로 확인한다. typecheck/전체 test/build 및 content/src/generated 의도한 변경 목록을 기록한다.

다음 단계에서는 Batch A의 NAND/NOR/CMOS/array 및 공정 패널을 이어가고, C 사용권 조사와 자산 제작은 분리해 진행한다. 단순 CSS 좌표 assertion보다 “여섯 소자가 있는가”, “Q가 edge 사이에 유지되는가”, “반사 광학과 식각이 다른 단계인가”를 검증한다.

## 9. 조사 범위와 검증 한계

이번 분류는 원문과 현재 component 소스의 비교다. 브라우저에서 58개 완성 자산을 검증한 결과가 아니다. 외부 이미지 URL·라이선스는 아직 검증하지 않았고, 실제 자산은 제작하지 않았다. 정적 Visual 구현 리뷰에서 본문의 그림 방향·원문 출처 지시어를 다시 확인한다. 분류 A도 도식 오류 시 정보를 잃지 않는 runtime 조건을 충족해야 실제로 해소된다.

`npm.cmd run typecheck`와 `npm.cmd test` 통과: 13개 파일, 262개 테스트. PowerShell의 npm.ps1 실행 정책으로 처음 명령은 시작되지 않아 동일 npm 스크립트를 npm.cmd로 실행했다. build·generated writer는 실행하지 않았다. 작업 시작/종료 시 파일별 SHA-256과 파일 집합을 비교해 `content/` 83개, `src/` 88개, `.generated/content/` 83개 모두 추가·삭제·변경 0개임을 확인했다. 추가 산출물은 이 문서뿐이다.

원문 module Markdown의 실제 선언 58개와 generated Visual 58개, inventory 58행 및 부록 58항목을 대조했다. sourceId 47개가 visual-001~047과 일대일로 일치하고 각 description이 generated 값과 일치함을 검사했다. 로컬 문서 링크의 대상 존재와 category·Module별 합계도 확인했다. 테스트 통과를 Visual 설계의 시각 검증이나 외부 자산 사용권 검증으로 해석하지 않는다.

## 10. 원문 추적 부록

아래는 현재 generated Visual 값과 해당 원문 위치에서 추출한 기록이다. description은 원문 값을 그대로 보존한다. 앞뒤 발췌는 위치 확인용이며 전체 교육 맥락의 판정은 위 inventory에 적었다. `sourceId 없음`은 누락 오류가 아니라 현재 원문의 정상 상태다.

### `m00-l01:visual:1`

- document: `m00-l01`; sourceId: `visual-001`; type: `reference-structure`; category: **A**
- source: [module-00-basics/lesson-01.md:99](../content/module-00-basics/lesson-01.md); source line: 99
- description: 반도체/전기 기초: 실제 트랜지스터는 대략 이런 구조다 — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: &gt; 편집 보완 — 위 원문 화살표의 범위: CPU 코어가 GPU가 된다는 포함 관계는 아니야. 논리게이트는 비트 관계를 처리하는 회로, CPU 코어는 명령을 실행하는 블록, GPU는 많은 병렬 연산을 하는 처리장치, SoC는 여러 시스템 기능을 통합한 칩이야. CPU와 GPU 기능이 SoC에 함께 들어갈 수 있어. / 같은 복잡한 회로가 만들어진다. / 아직 게이트가 뭔지는 몰라도 된다. 다음에 차근차근 간다.
- 뒤: 지금은 그림에서 Gate / Source / Drain이라는 이름만 눈에 익혀둬. Gate는 제어 전극, Source와 Drain은 제어할 전류 경로의 양쪽 단자야. / 다음 Module에서 이걸 아주 천천히 뜯어볼 거다. / 지금 당장은:

### `m00-l01:visual:2`

- document: `m00-l01`; sourceId: `visual-002`; type: `reference-structure`; category: **C**
- source: [module-00-basics/lesson-01.md:123](../content/module-00-basics/lesson-01.md); source line: 123
- description: 반도체/전기 기초: 3. 웨이퍼(Wafer)는 뭐야? — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: 이제 네 업무와 훨씬 가까워진다. / 반도체 회로를 허공에 만들 수는 없으니까 바닥판이 필요하다. / 그게 웨이퍼다.
- 뒤: 동그란 전체가 Wafer. / 그 안에 바둑판처럼 반복되는 네모 하나하나가 Die다. / 즉,

### `m00-l01:visual:3`

- document: `m00-l01`; sourceId: `visual-003`; type: `reference-structure`; category: **A**
- source: [module-00-basics/lesson-01.md:177](../content/module-00-basics/lesson-01.md); source line: 177
- description: 반도체/전기 기초: 5. `Die`가 뭐야? — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: 수백 단계 반복 / 을 거치면서 작은 트랜지스터와 배선이 층층이 생긴다. / 가공이 완료된 웨이퍼를 보면 이런 모습이다.
- 뒤: 이 그림이 오늘 가장 중요한 그림이다. / 웨이퍼 한 장 위에 동일한 회로가 여러 개 반복돼 있다. / 그 사각형 하나가:

### `m00-l01:visual:4`

- document: `m00-l01`; sourceId: `visual-004`; type: `reference-structure`; category: **B**
- source: [module-00-basics/lesson-01.md:243](../content/module-00-basics/lesson-01.md); source line: 243
- description: 반도체/전기 기초: 7. 왜 패키징을 해야 하지? — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: 그 상태는 그냥 몇 mm~수십 mm 크기의 얇은 실리콘 조각이다. / 그걸 메인보드에 바로 꽂을 수는 없다. / 그래서 이런 구조로 만들어준다.
- 뒤: 첫 번째 그림에서 가장 중요한 건 가운데의 Die다. / 그 주변에: / Die

### `m00-l02:visual:1`

- document: `m00-l02`; sourceId: `visual-005`; type: `reference-structure`; category: **A**
- source: [module-00-basics/lesson-02.md:85](../content/module-00-basics/lesson-02.md); source line: 85
- description: 반도체/전기 기초: 3. 실제 회로를 보면 — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: | 흐르는 물의 양 | 전류 A | / | 좁은 수도관 | 큰 저항 R | / 저항은 다음에 필요할 때 조금 더 볼 거야.
- 뒤: 배터리와 전구를 전선으로 연결했다고 생각하자. / 배터리가 전압 차이를 만들어준다. / 그리고 회로가 연결되어 있으면 그 전압 때문에 전류가 흐른다.

### `m00-l03:visual:1`

- document: `m00-l03`; sourceId: `none`; type: `original-image`; category: **B**
- source: [module-00-basics/lesson-03.md:72](../content/module-00-basics/lesson-03.md); source line: 72
- description: RC 회로
- 앞: 커패시터는 조금 더 중요해. / 가장 쉬운 비유는 작은 물탱크다. / 전기가 들어오면 전하를 잠시 저장하고, 필요하면 다시 내보낸다.
- 뒤: 이 회로에서는 전원 → 저항 → 커패시터가 연결돼 있다. / 스위치를 닫으면: / 전원 ON

### `m00-l03:visual:2`

- document: `m00-l03`; sourceId: `none`; type: `original-image`; category: **B**
- source: [module-00-basics/lesson-03.md:134](../content/module-00-basics/lesson-03.md); source line: 134
- description: MOSFET capacitance
- 앞: + Oxide / + Semiconductor / 원래 MOS 구조 자체가 상당히 커패시터와 비슷한 구조다.
- 뒤: 그림 중앙을 보면: / Gate / ────────────

### `m00-l04:visual:1`

- document: `m00-l04`; sourceId: `visual-006`; type: `reference-structure`; category: **A**
- source: [module-00-basics/lesson-04.md:35](../content/module-00-basics/lesson-04.md); source line: 35
- description: 반도체/전기 기초: 1. MOSFET부터 그림으로 보자 — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: 오늘 목표는 딱 이것이다. / &gt; Gate에 전압을 걸면 → 전기장으로 Channel을 만들고 → Source와 Drain 사이에 전류가 흐를 수 있게 된다. / 앞으로 가장 많이 보게 될 기본 트랜지스터가 MOSFET이다.
- 뒤: 첫 번째 그림에서 지금 볼 것은 딱 네 군데뿐이다. / Gate / ↓

### `m00-l04:visual:2`

- document: `m00-l04`; sourceId: `visual-007`; type: `reference-structure`; category: **A**
- source: [module-00-basics/lesson-04.md:613](../content/module-00-basics/lesson-04.md); source line: 613
- description: 반도체/전기 기초: 1. 제일 중요한 것: `트랜지스터 = MOSFET 전체` — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: &gt; Gate + 절연막 + Source + Drain + Channel/Body 등을 합친 구조 전체 = MOSFET 트랜지스터 하나 / 야. / 아래 실제 단면 그림으로 보면 훨씬 명확해.
- 뒤: 그림의 큰 구조 전체 하나가 NMOS 트랜지스터 하나야. / 이 셋은 같은 레벨의 '소자 종류'라고 생각하면 돼. / 소자(Device)

### `m00-l04:visual:3`

- document: `m00-l04`; sourceId: `visual-008`; type: `reference-structure`; category: **B**
- source: [module-00-basics/lesson-04.md:862](../content/module-00-basics/lesson-04.md); source line: 862
- description: 반도체/전기 기초: FinFET — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: GAA / 라고 보면 된다. / 아래가 실제 구조를 이해하기 훨씬 좋은 그림들이야.
- 뒤: 여기서 회색으로 솟아 있는 Fin이 Channel이고, 큰 Gate가 그 Fin을 위 + 양옆, 3면에서 감싸고 있어. / 그래서 Fin + FET → FinFET. / 이건 삼성 공식 자료 그림이 제일 이해하기 좋다.

### `m00-l04:visual:4`

- document: `m00-l04`; sourceId: `visual-009`; type: `reference-structure`; category: **C**
- source: [module-00-basics/lesson-04.md:874](../content/module-00-basics/lesson-04.md); source line: 874
- description: 반도체/전기 기초: 삼성 GAA / MBCFET — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: 여기서 회색으로 솟아 있는 Fin이 Channel이고, 큰 Gate가 그 Fin을 위 + 양옆, 3면에서 감싸고 있어. / 그래서 Fin + FET → FinFET. / 이건 삼성 공식 자료 그림이 제일 이해하기 좋다.
- 뒤: 왼쪽이 FinFET, 오른쪽이 GAA야. / 차이는: / FinFET

### `m01-l01:visual:1`

- document: `m01-l01`; sourceId: `visual-010`; type: `reference-structure`; category: **B**
- source: [module-01-cmos/lesson-01.md:411](../content/module-01-cmos/lesson-01.md); source line: 411
- description: 트랜지스터와 CMOS: VDD와 GND는 아주 쉽게 — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: | GND | 0V | LOW = 0 | / 즉 CMOS inverter에서 PMOS는 VDD 쪽에 붙어서 출력에 1을 공급하는 역할, NMOS는 GND 쪽에 붙어서 출력을 0으로 끌어내리는 역할을 해. / 이번 Lesson 1에서 실제로 봐야 했던 그림은 이런 종류야.
- 뒤: 첫 그림처럼 PMOS + NMOS가 실제 실리콘 안에서 어떻게 배치되고 VDD/GND와 연결되는지, 두 번째처럼 NMOS/PMOS 내부의 Gate·Source·Drain·N/P 영역이 실제로 어떻게 생겼는지 보여주는 그림을 쓰는 게 네가 요청했던 방식에 더 맞아. / 아주 쉽게 보면 PMOS와 NMOS는 출력선을 각각 위쪽 전압과 아래쪽 전압에 연결해주는 스위치야. / - PMOS가 ON → OUT이 VDD(높은 전압, 1)에 연결됨 → 출력 1

### `m01-l02:visual:1`

- document: `m01-l02`; sourceId: `visual-011`; type: `reference-structure`; category: **B**
- source: [module-01-cmos/lesson-02.md:31](../content/module-01-cmos/lesson-02.md); source line: 31
- description: 트랜지스터와 CMOS: 1. 먼저 실제 구조를 보자 — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: 지난 Lesson 1에서 배운 핵심은 NMOS는 HIGH에서 ON, PMOS는 LOW에서 ON이었어. / 오늘 목표는 하나야. / &gt; CMOS가 어떻게 출력선을 VDD 또는 GND에 연결해서 실제 1과 0을 만드는지 이해하기.
- 뒤: 첫 번째 그림이 특히 좋아. 왼쪽은 회로도, 오른쪽은 같은 회로를 실제 실리콘 단면으로 만든 모습이야. / 중요한 건 PMOS와 NMOS가 따로 노는 게 아니라, 둘의 중간이 하나의 출력(OUT)으로 연결되어 있다는 것이야. / 지난번에 이걸 늦게 설명했으니 이번에는 먼저 잡자.

### `m01-l03:visual:1`

- document: `m01-l03`; sourceId: `visual-012`; type: `reference-structure`; category: **B**
- source: [module-01-cmos/lesson-03.md:65](../content/module-01-cmos/lesson-03.md); source line: 65
- description: 트랜지스터와 CMOS: 2. NAND부터 보자 — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: A 길 또는 B 길 중 하나만 열려도 전기가 갈 수 있어. / 즉 병렬은 느낌상 OR 조건이야. / 이 두 개념이 오늘 거의 전부야.
- 뒤: 위 그림에서 중요한 부분만 보자. / 병렬 / 직렬

### `m01-l03:visual:2`

- document: `m01-l03`; sourceId: `visual-013`; type: `reference-structure`; category: **B**
- source: [module-01-cmos/lesson-03.md:155](../content/module-01-cmos/lesson-03.md); source line: 155
- description: 트랜지스터와 CMOS: 5. 이번에는 NOR — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: 그래서: / &gt; NAND = NOT AND / 야.
- 뒤: NOR는 NAND와 연결 방식이 반대야. / 직렬 / 병렬

### `m01-l04:visual:1`

- document: `m01-l04`; sourceId: `visual-014`; type: `reference-structure`; category: **A**
- source: [module-01-cmos/lesson-04.md:130](../content/module-01-cmos/lesson-04.md); source line: 130
- description: 트랜지스터와 CMOS: 4. Carry는 누가 만들까? — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: 따라서: / &gt; AND가 Carry를 계산한다. / 이 두 개를 합친 회로가 Half Adder야.
- 뒤: 그림을 보면 입력 A, B가 동시에 두 군데로 들어가. / XOR → Sum / AND → Carry

### `m01-l05:visual:1`

- document: `m01-l05`; sourceId: `visual-015`; type: `reference-structure`; category: **B**
- source: [module-01-cmos/lesson-05.md:91](../content/module-01-cmos/lesson-05.md); source line: 91
- description: 트랜지스터와 CMOS: 출력 2개 — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: 그래서 Full Adder는: / A, B, Cin / Sum, Cout
- 뒤: 첫 그림이 1-bit Full Adder, 두 번째가 이런 Full Adder들을 여러 개 연결한 모습이야. / 입력이: / - A = 1

### `m01-l06:visual:1`

- document: `m01-l06`; sourceId: `visual-016`; type: `reference-structure`; category: **A**
- source: [module-01-cmos/lesson-06.md:64](../content/module-01-cmos/lesson-06.md); source line: 64
- description: 트랜지스터와 CMOS: 2. Flip-Flop은 1 bit를 기억한다 — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: 오늘 핵심 소자는 D Flip-Flop(DFF)이야. / 아주 쉽게 보면: / &gt; Clock이 오는 순간 입력 D를 찍어서, 그 값을 Q에 기억해두는 회로
- 뒤: 기호를 보면: / - D = 저장하고 싶은 Data / - CLK = 언제 저장할지 알려주는 Clock

### `m01-l06:visual:2`

- document: `m01-l06`; sourceId: `visual-017`; type: `reference-structure`; category: **B**
- source: [module-01-cmos/lesson-06.md:149](../content/module-01-cmos/lesson-06.md); source line: 149
- description: 트랜지스터와 CMOS: 다음 Clock — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: → 이제 Q = 0으로 변경 / 그래서 Q는 D를 실시간으로 따라다니는 게 아니라 Clock 순간마다 한 번씩 갱신돼. / 이 동작을 timing diagram으로 보면 훨씬 쉬워.
- 뒤: D Flip-Flop 하나: / &gt; 1 bit 저장 / 그럼 8개를 나란히 놓으면?

### `m01-l06:visual:3`

- document: `m01-l06`; sourceId: `visual-018`; type: `reference-structure`; category: **B**
- source: [module-01-cmos/lesson-06.md:165](../content/module-01-cmos/lesson-06.md); source line: 165
- description: 트랜지스터와 CMOS: 5. Flip-Flop 여러 개를 모으면 Register — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: 그럼 8개를 나란히 놓으면? / &gt; 8 bit 저장 / 이게 Register(레지스터)의 기본 개념이야.
- 뒤: 예를 들어: / 10110100 / 이라는 8-bit 데이터를 저장하려면 DFF 8개가 각각 한 자리씩 기억하면 돼.

### `m01-l07:visual:1`

- document: `m01-l07`; sourceId: `visual-019`; type: `reference-structure`; category: **B**
- source: [module-01-cmos/lesson-07.md:56](../content/module-01-cmos/lesson-07.md); source line: 56
- description: 트랜지스터와 CMOS: 2. 실제 6T SRAM Cell을 보자 — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: &gt; 전원이 공급되는 동안 별도로 계속 새로 써주지 않아도 값을 유지한다 / 는 의미야. / DRAM처럼 주기적인 Refresh가 필요한 메모리와 다른 점인데, DRAM은 나중에 메모리 Module에서 제대로 배울 거야.
- 뒤: 처음 보면 복잡해 보이지만 딱 두 덩어리만 보면 돼. / CMOS Inverter 2개 / 저장된 값에 접근하기 위한 Access Transistor

### `m01-s-half-adder:visual:1`

- document: `m01-s-half-adder`; sourceId: `visual-042`; type: `reference-structure`; category: **A**
- source: [module-01-cmos/supplement-half-adder.md:211](../content/module-01-cmos/supplement-half-adder.md); source line: 211
- description: 반도체/전기 기초: 6. 이게 바로 Half Adder — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: B ─────┼──── AND ───→ Carry / 가 된다. / 실제 논리회로 구조는 이렇게 생긴다.
- 뒤: 그림에서 두 입력이 동시에: / - XOR로 들어가서 Sum / - AND로 들어가서 Carry

### `m01-s-sram:visual:1`

- document: `m01-s-sram`; sourceId: `visual-043`; type: `reference-structure`; category: **B**
- source: [module-01-cmos/supplement-sram.md:72](../content/module-01-cmos/supplement-sram.md); source line: 72
- description: 반도체/전기 기초: 2. SRAM이란? — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: &gt; 전원이 공급되는 동안 값을 유지할 수 있는 빠른 메모리 / 라고 이해하면 된다. / 실제 SRAM의 기본 단위인 6T SRAM Cell은 이런 구조다.
- 뒤: 여기서 6T의 T는: / &gt; 6 Transistors / 라는 뜻이다.

### `m01-s-sram:visual:2`

- document: `m01-s-sram`; sourceId: `visual-044`; type: `reference-structure`; category: **B**
- source: [module-01-cmos/supplement-sram.md:373](../content/module-01-cmos/supplement-sram.md); source line: 373
- description: 반도체/전기 기초: 10. SRAM Cell 하나만 사용하는 건 아니다 — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: 0/1 읽기 또는 쓰기 / 라고 이해하면 된다. / 실제 칩에서는 이런 Cell이 엄청나게 반복된다.
- 뒤: 대략: / Bit Line들 / ↓  ↓  ↓  ↓

### `m02-l01:visual:1`

- document: `m02-l01`; sourceId: `visual-020`; type: `reference-structure`; category: **C**
- source: [module-02-chip/lesson-01.md:35](../content/module-02-chip/lesson-01.md); source line: 35
- description: 칩 구조: 1. 먼저 실제 CPU Die를 보자 — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: 딱 이것만 이해하면 된다. / &gt; Transistor → Logic Gate → Standard Cell → Functional Block → Die / Module 1에서는 트랜지스터 하나하나를 확대해서 봤다면, Module 2에서는 반대로 줌아웃하면서 전체 칩을 보는 것이 핵심이야.
- 뒤: 왼쪽은 실제 CPU Die를 위에서 본 사진이고, 오른쪽은 CMOS inverter를 실제 칩 위에 배치할 때의 layout 예시야. / 왼쪽 CPU 사진에서 중요한 건 세부 글자를 외우는 게 아니라, / Core     Core

### `m02-l02:visual:1`

- document: `m02-l02`; sourceId: `visual-021`; type: `reference-structure`; category: **C**
- source: [module-02-chip/lesson-02.md:35](../content/module-02-chip/lesson-02.md); source line: 35
- description: 칩 구조: 1. 실제 CPU Die부터 보자 — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: &gt; Floorplan = Die 안에서 큰 기능 블록들을 어디에 배치할지 정한 전체 배치도 / 지난 Lesson 1에서 배운 Core, Cache, Memory Controller, I/O가 실제 Die 안에서 각자 물리적인 자리를 차지한다는 걸 이해하는 게 목표야. / 아래처럼 실제 CPU Die를 위에서 보면 서로 다른 패턴의 큰 영역들이 보인다.
- 뒤: 사진에서 중요한 건 세부 모양을 외우는 게 아니야. / 대략: / ┌────────────────────────────────┐

### `m02-l03:visual:1`

- document: `m02-l03`; sourceId: `visual-022`; type: `reference-structure`; category: **C**
- source: [module-02-chip/lesson-03.md:37](../content/module-02-chip/lesson-03.md); source line: 37
- description: 칩 구조: 1. 실제 단면 구조부터 보자 — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: 오늘 가장 중요한 그림은 이것 하나야. / &gt; 트랜지스터는 실리콘 쪽 아래에 있고, 그 위로 여러 층의 금속 배선이 건물처럼 쌓인다. / 즉 실제 칩은 평면 회로가 아니라 3차원 구조야.
- 뒤: 첫 번째 그림을 아래에서 위로 봐봐. / ───── M6 ───── / │

### `m02-l05:visual:1`

- document: `m02-l05`; sourceId: `visual-023`; type: `reference-structure`; category: **A**
- source: [module-02-chip/lesson-05.md:39](../content/module-02-chip/lesson-05.md); source line: 39
- description: 칩 구조: 1. 먼저 전체 3D 구조부터 보자 — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: 오늘은 처음으로 신호가 Die 밖으로 나가는 길을 본다. / 핵심 경로는 이것 하나야. / &gt; Die 내부 Metal → Pad → Bump → Package Substrate → PCB
- 뒤: 그림을 아주 단순화하면: / Die / ┌─────────────┐

### `m02-l06:visual:1`

- document: `m02-l06`; sourceId: `visual-024`; type: `reference-structure`; category: **C**
- source: [module-02-chip/lesson-06.md:89](../content/module-02-chip/lesson-06.md); source line: 89
- description: 칩 구조: Chiplet — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: 겉으로 보면 CPU 제품 하나지만, / 안에는 여러 개의 Die가 들어 있는 것이지. / 대표적인 실제 구조를 보면 이런 느낌이야.
- 뒤: 첫 그림처럼 중앙에 I/O Die, 주변에 여러 CPU Chiplet을 두는 구조가 대표적인 예야. / 가장 중요한 이유 중 하나가 수율(Yield)이야. / ┌─────────────────────┐

### `m02-s-feol-beol:visual:1`

- document: `m02-s-feol-beol`; sourceId: `visual-045`; type: `reference-structure`; category: **C**
- source: [module-02-chip/supplement-feol-beol.md:40](../content/module-02-chip/supplement-feol-beol.md); source line: 40
- description: 반도체/전기 기초: 1. 먼저 실제 칩 단면을 보자 — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: &gt; 칩 아래쪽에는 트랜지스터가 있고, 그 위에는 트랜지스터들을 서로 연결하는 여러 층의 금속배선이 쌓여 있다. / 그리고 이 둘을 각각 FEOL과 BEOL이라고 부른다는 것까지 이해하면 된다. / 이 주제는 3차원 구조를 봐야 이해가 쉬워.
- 뒤: 그림을 볼 때 세부 구조를 전부 이해하려 하지 말고 위/아래만 보자. / 대략 이런 구조다. / 칩 표면

### `m02-s-floorplan:visual:1`

- document: `m02-s-floorplan`; sourceId: `visual-046`; type: `reference-structure`; category: **C**
- source: [module-02-chip/supplement-floorplan.md:38](../content/module-02-chip/supplement-floorplan.md); source line: 38
- description: 반도체/전기 기초: 1. 실제 칩을 위에서 보면 — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: 오늘은 방향을 90도 바꿔서 Die를 위에서 내려다볼 거야. / &gt; 하나의 Die 안에는 기능이 다른 여러 회로 블록이 있고, 이들을 적절한 위치에 배치한 전체 지도를 Floorplan이라고 한다. / 현대 프로세서 Die 사진을 보면 영역마다 무늬가 꽤 다르게 보인다.
- 뒤: 왜 저렇게 구역이 나뉘어 보일까? / 지난 Lesson 1에서 배운 계층을 떠올려보자. / Transistor

### `m02-s-wafer-shot:visual:1`

- document: `m02-s-wafer-shot`; sourceId: `visual-047`; type: `reference-structure`; category: **A**
- source: [module-02-chip/supplement-wafer-shot.md:34](../content/module-02-chip/supplement-wafer-shot.md); source line: 34
- description: 반도체/전기 기초: 1. 먼저 실제 Wafer 구조를 보자 — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: 지난 Lesson 5에서는 Die → Pad/Bump → Package → PCB로 칩 바깥까지 연결되는 구조를 봤어. 오늘은 다시 한 단계 위로 올라가서, 웨이퍼 한 장 위에 Die가 어떤 식으로 반복해서 만들어지는지를 이해해보자. / &gt; 웨이퍼 위에는 같은 Die가 반복 배치되고, 노광 장비는 Reticle의 패턴을 Shot 단위로 반복 인쇄한다. Die 사이에는 나중에 절단하기 위한 Scribe Line이 있다. / 삼성전자에서 설명하는 Wafer 구조 그림을 보면 Die와 Scribe Line의 관계가 잘 보인다.
- 뒤: 그림에서 가장 중요한 건 이것뿐이야. / Wafer / ┌──────────────────────────┐

### `m03-l01:visual:1`

- document: `m03-l01`; sourceId: `visual-025`; type: `reference-structure`; category: **C**
- source: [module-03-process/lesson-01.md:45](../content/module-03-process/lesson-01.md); source line: 45
- description: 반도체 공정: 1. 출발점은 Wafer — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: 딱 이것만 잡으면 돼. / &gt; 반도체는 웨이퍼 위에 필요한 물질을 만들고 → 원하는 모양만 남기고 → 깎고 → 성질을 바꾸는 작업을 수없이 반복해서 만든다. / 먼저 전체 지도를 머릿속에 넣자.
- 뒤: 우리가 흔히 보는 이 둥근 판이 Silicon Wafer야. / 하지만 웨이퍼 자체가 CPU나 GPU인 건 아니야. / Silicon Wafer

### `m03-l01:visual:2`

- document: `m03-l01`; sourceId: `visual-026`; type: `reference-structure`; category: **B**
- source: [module-03-process/lesson-01.md:101](../content/module-03-process/lesson-01.md); source line: 101
- description: 반도체 공정: ① Deposition — 쌓기 — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: 이걸 반복한다. / 마치 건물을 층층이 건설하는 것과 비슷해. / Module 3에서 하나씩 깊게 배울 녀석들이다.
- 뒤: 웨이퍼 위에 얇은 막(Thin Film)을 형성한다. / Before / ────────────  Wafer

### `m03-l01:visual:3`

- document: `m03-l01`; sourceId: `visual-027`; type: `reference-structure`; category: **B**
- source: [module-03-process/lesson-01.md:127](../content/module-03-process/lesson-01.md); source line: 127
- description: 반도체 공정: 4. Photo(Lithography) — 어디를 만들지 정하기 — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: 예를 들어 절연막이나 금속막 등을 만든다. / 쉽게: / &gt; Deposition = 막을 쌓는다
- 뒤: 반도체에서 정말 중요한 공정이야. / 웨이퍼 전체를 똑같이 가공하면 원하는 회로 모양을 만들 수 없겠지. / 그래서 Mask를 이용해서 원하는 패턴을 웨이퍼에 옮긴다.

### `m03-l01:visual:4`

- document: `m03-l01`; sourceId: `visual-028`; type: `reference-structure`; category: **B**
- source: [module-03-process/lesson-01.md:165](../content/module-03-process/lesson-01.md); source line: 165
- description: 반도체 공정: 5. Etch — 깎기 — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: &gt; Photo = "어디를 가공할 것인가?"를 정한다. / Module 1에서 잠깐 봤던 Photo → Implant 관계도 이제 본격적으로 이해하게 될 거야. / Photo로 위치를 정했으면 그다음에는 실제 물질을 제거할 수 있어.
- 뒤: ████████████  막 / ────────────  Wafer / ↓ Etch

### `m03-l02:visual:1`

- document: `m03-l02`; sourceId: `visual-029`; type: `reference-structure`; category: **A**
- source: [module-03-process/lesson-02.md:63](../content/module-03-process/lesson-02.md); source line: 63
- description: 반도체 공정: PR = Photoresist — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: 이 물질이 바로: / &gt; 편집 보완: 아래에서 가공 대상 Film을 말할 때는 Photo에 들어오기 전에 증착·산화 등으로 형성한 얇은 막을 뜻해. 막을 식각하는 예의 층 순서는 위부터 PR → Film → Wafer/하부 구조야. 앞부분의 PR/Wafer 두 줄 그림은 중간 Film을 생략한 원수업 개략도이며, 이 생략을 뒤의 추가 설명에서 바로잡았어. / 이야.
- 뒤: Photo를 아주 단순화하면: / Wafer / ↓

### `m03-l02:visual:2`

- document: `m03-l02`; sourceId: `visual-030`; type: `reference-structure`; category: **C**
- source: [module-03-process/lesson-02.md:296](../content/module-03-process/lesson-02.md); source line: 296
- description: 반도체 공정: Stepper / Scanner — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: CPU/GPU의 트랜지스터는 엄청 작지. / 결국 Photo가 얼마나 작은 패턴을 정확하게 만들어낼 수 있느냐가 중요해진다. / 여기서 유명한 장비가:
- 뒤: 첨단 공정에서 사용하는 EUV(Extreme Ultraviolet)도 결국 Photo 기술이야. / EUV의 파장은 약 13.5 nm이고, 기존 ArF 노광에서 사용하는 193 nm보다 훨씬 짧다. / 대략적인 직관은:

### `m03-l02:visual:3`

- document: `m03-l02`; sourceId: `visual-031`; type: `reference-structure`; category: **B**
- source: [module-03-process/lesson-02.md:497](../content/module-03-process/lesson-02.md); source line: 497
- description: 반도체 공정: Scanner — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: 즉: / &gt; Spinner = PR을 균일하게 바르는 쪽 / Scanner는 노광(Exposure)을 하는 장비야.
- 뒤: 대략: / 빛 / ↓

### `m03-l03:visual:1`

- document: `m03-l03`; sourceId: `visual-032`; type: `reference-structure`; category: **A**
- source: [module-03-process/lesson-03.md:93](../content/module-03-process/lesson-03.md); source line: 93
- description: 반도체 공정: Dry Etch — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: 크게 두 가지 방식이 있어. / → 액체 화학약품으로 깎는다. / → 주로 Plasma를 이용한 기체 기반 식각을 한다. 여기서 Plasma는 전자와 이온 등 하전 입자를 포함한 기체 상태야. 뒤에서 그 역할을 더 자세히 볼게.
- 뒤: 둘 다 물질을 제거하지만 깎이는 모양이 상당히 달라질 수 있어. / 쉽게 생각하면 특정 물질과 반응하는 액체 화학약품으로 Film을 제거하는 거야. / PR

### `m03-l04:visual:1`

- document: `m03-l04`; sourceId: `visual-033`; type: `reference-structure`; category: **B**
- source: [module-03-process/lesson-04.md:108](../content/module-03-process/lesson-04.md); source line: 108
- description: 반도체 공정: 2. 그런데 뭘 쌓는 거야? — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: 중요한 건: / &gt; 반도체는 실리콘 하나만 깎아서 만드는 게 아니라 서로 다른 성질을 가진 여러 막을 쌓고 가공하면서 만든다. / 는 거야.
- 뒤: 이름을 뜯어보자. / Chemical → 화학 반응 / Vapor → 기체

### `m03-l04:visual:2`

- document: `m03-l04`; sourceId: `visual-034`; type: `reference-structure`; category: **A**
- source: [module-03-process/lesson-04.md:272](../content/module-03-process/lesson-04.md); source line: 272
- description: 반도체 공정: 7. ALD가 왜 중요할까? — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: │       │ / └───────┘ / 여기에서 위쪽뿐 아니라 옆면과 깊숙한 바닥까지 균일하게 막을 형성해야 하는 상황이 생겨.
- 뒤: 이때 중요한 용어가: / 복잡한 구조의 표면을 따라 얼마나 균일하게 막이 형성되는가를 뜻해. / ALD는 이런 정밀한 conformal film 형성에 매우 유리해.

### `m03-l05:visual:1`

- document: `m03-l05`; sourceId: `visual-035`; type: `reference-structure`; category: **A**
- source: [module-03-process/lesson-05.md:139](../content/module-03-process/lesson-05.md); source line: 139
- description: 반도체 공정: Via — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: &gt; Metal Line = 수평 도로 / &gt; Via = 층간 엘리베이터 / 라고 생각하면 편해.
- 뒤: 이것도 중요해. / Metal을 그냥 층층이 붙이면 서로 닿아서 전부 Short가 나겠지. / 그래서 금속 사이에는 절연막(Dielectric)이 존재해.

### `m03-l05:visual:2`

- document: `m03-l05`; sourceId: `visual-036`; type: `reference-structure`; category: **A**
- source: [module-03-process/lesson-05.md:335](../content/module-03-process/lesson-05.md); source line: 335
- description: 반도체 공정: Dual Damascene — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: 그러면 Trench와 Via 구조를 함께 형성한 뒤 Cu를 채우는 방식을 사용할 수 있어. / 이걸: / 이라고 해.
- 뒤: 지금 세부 순서를 외울 필요는 없어. / 딱: / &gt; Dual Damascene = Cu를 채워 Via + Metal 배선 구조를 만드는 대표적인 BEOL 방식

### `m03-l06:visual:1`

- document: `m03-l06`; sourceId: `visual-037`; type: `reference-structure`; category: **A**
- source: [module-03-process/lesson-06.md:151](../content/module-03-process/lesson-06.md); source line: 151
- description: 반도체 공정: 2. 왜 굳이 평평해야 할까? — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: 그래서 중간중간: / &gt; "여기까지 만들었으니 표면 한번 평평하게 만들자." / 가 필요한 거야.
- 뒤: CMP 장비를 아주 단순화하면 이래. / Wafer / ───────

### `m03-l07:visual:1`

- document: `m03-l07`; sourceId: `visual-038`; type: `reference-structure`; category: **A**
- source: [module-03-process/lesson-07.md:118](../content/module-03-process/lesson-07.md); source line: 118
- description: 반도체 공정: Ion Implantation = 이온 주입 — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: 즉 Film을 위에 쌓는 것이 아니야. / &gt; Implant = Dopant를 Silicon 내부로 집어넣는 것 / 이 핵심이야.
- 뒤: 여기서 Photo가 다시 등장한다. / 예를 들어 가운데 부분에만 Dopant를 넣고 싶다고 해보자. / 먼저 Photo로 PR Mask를 만든다.

### `m03-l08:visual:1`

- document: `m03-l08`; sourceId: `visual-039`; type: `reference-structure`; category: **B**
- source: [module-03-process/lesson-08.md:296](../content/module-03-process/lesson-08.md); source line: 296
- description: 반도체 공정: Thermal Oxidation — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: ████████████████  SiO₂ / ────────────────  Silicon / Silicon 표면이 반응하면서 SiO₂ 산화막(Oxide)이 형성돼.
- 뒤: 이 부분은 꼭 구분하자. / 외부에서 공급한 기체 원료들이 반응하면서 SiO₂ Film을 증착한다. / Gas ↓↓↓

### `m03-l09:visual:1`

- document: `m03-l09`; sourceId: `visual-040`; type: `reference-structure`; category: **E**
- source: [module-03-process/lesson-09.md:31](../content/module-03-process/lesson-09.md); source line: 31
- description: 반도체 공정: Clean — 왜 웨이퍼를 공정 중간중간 계속 씻을까? — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: Clean은 단순히 마지막에 웨이퍼를 한 번 깨끗하게 씻는 공정이 아니야. / &gt; Photo → Etch → Clean → Deposition → CMP → Clean → … / 처럼 제조 과정 곳곳에서 반복적으로 등장하는 기반 공정이라고 보는 게 정확해.
- 뒤: 오늘은 네 가지만 잡으면 돼. / &gt; ① 웨이퍼에 무엇이 묻길래 Clean이 필요한가? / &gt; ② Particle / Organic / Metal / Residue는 무엇인가?

### `m03-l09:visual:2`

- document: `m03-l09`; sourceId: `visual-041`; type: `reference-structure`; category: **D**
- source: [module-03-process/lesson-09.md:79](../content/module-03-process/lesson-09.md); source line: 79
- description: 반도체 공정: 2. 작은 Particle 하나가 그렇게 큰 문제야? — 원수업 이미지 위치와 주변 설명을 함께 참고
- 앞: 반도체에서는 그럴 수 있어. / 우리가 만드는 패턴 자체가 매우 작기 때문이야. / 예를 들어 Metal 배선 위에 원하지 않는 Particle이 존재하면 후속 공정에서 패턴 형성이나 막 형성 등에 영향을 줄 수 있고, 위치와 크기에 따라 Open/Short 같은 결함으로 이어질 수도 있어.
- 뒤: 그래서 FAB에서는 / &gt; 눈으로 깨끗해 보인다 = 깨끗하다 / 가 아니야.

### `m04-l05:visual:1`

- document: `m04-l05`; sourceId: `none`; type: `cross-section`; category: **B**
- source: [module-04-products/lesson-05.md:59](../content/module-04-products/lesson-05.md); source line: 59
- description: 6T SRAM 회로, 대표 1T1C DRAM 셀, NAND 전하 저장 영역 비교. 서로 다른 축척임을 명시
- 앞: | SRAM | 회로가 서로 상태를 유지 | 정보 소실 | 코어 가까운 캐시 | / | DRAM | 커패시터의 전하 | 정보 소실 | 주기억장치 | / | NAND | 절연된 영역의 전하 상태 | 정보 유지 가능 | 저장장치 |
- 뒤: 소자를 어떻게 묶느냐가 저장 방식에 영향을 줘. 셀을 많이 배열하고, 원하는 위치를 고르고, 작은 전기적 차이를 읽는 주변 회로를 더하면 메모리 블록이나 메모리 칩이 돼. / 셀 그림 하나가 메모리 제품 전체는 아니야. / 캐시는 자주 쓰거나 곧 쓸 가능성이 있는 데이터를 가까이 두어 느린 접근을 줄이는 역할이야. SRAM은 구현 기술이고 캐시는 역할이므로 같은 단어가 아니야. DRAM은 실행 중 데이터를 놓는 주기억장치에 널리 쓰이며, NAND는 SSD 같은 저장장치에서 사용돼. SSD는 Solid State Drive로, 반도체 메모리를 이용해 파일 등을 저장하는 장치야. SSD에는 NAND 외에 요청을 관리하는 컨트롤러도 필 …

### `m05-l02:visual:1`

- document: `m05-l02`; sourceId: `none`; type: `cross-section`; category: **B**
- source: [module-05-advanced/lesson-02.md:57](../content/module-05-advanced/lesson-02.md); source line: 57
- description: 평면 MOSFET·FinFET·나노시트 GAA의 동일 관점 단면 비교. 채널, 게이트, 게이트 절연층, 소스·드레인 방향 표시
- 앞: | 평면 MOSFET | 표면 가까운 평면 통로 | 주로 위쪽에서 제어 | / | FinFET | 솟아 있는 핀 모양 | 위와 옆면을 통해 제어 | / | 나노시트 GAA | 떠 있는 얇은 시트 | 시트 둘레에서 제어 |
- 뒤: 게이트가 둘레를 감싸도 채널과 직접 금속 접촉하는 것은 아니야. 사이에는 게이트 절연층이 있어. / 여러 나노시트를 위아래로 놓으면 제한된 면적에서 전류 통로를 확보할 수 있어. 이것은 완성된 다이를 여러 개 쌓는 패키징 적층과 다른 규모의 구조야. / 나노시트 구조의 제조를 단순화해 보면, 서로 다른 재료의 층을 쌓고, 채널로 남길 부분을 패턴으로 만들고, 필요한 층만 선택적으로 제거하고, 노출된 채널 둘레에 절연층과 게이트 재료를 형성해. 실제 순서와 재료는 공정마다 다르지만, “쌓기·선택적으로 깎기·빈 공간을 균일하게 채우기”가 왜 중요해지는지 보여.

### `m05-l03:visual:1`

- document: `m05-l03`; sourceId: `none`; type: `process-diagram`; category: **B**
- source: [module-05-advanced/lesson-03.md:61](../content/module-05-advanced/lesson-03.md); source line: 61
- description: 마스크의 패턴이 반사 광학계를 거쳐 PR에 기록되고 현상·식각으로 전달되는 단계도. 실제 장비 축척과 다름을 명시
- 앞: | 현상 | 반응 차이를 이용해 PR의 일부를 제거 | / | 패턴 전달 | PR 또는 다른 마스크 층을 이용해 아래 재료 가공 | / EUV에서는 빛이 많은 물질에 흡수되기 쉬워 진공 환경과 반사 광학계를 사용해. NA, 즉 개구수는 광학계가 빛을 모으고 세부 구조를 구분하는 능력과 관련된 수치야. High-NA EUV는 EUV의 파장을 더 줄인 이름이 아니라 NA를 높인 방식이야. ASML 설명의 비교는 기존 0.33과 High-NA 0.55야.
- 뒤: 작은 패턴을 만들려면 이전 방식에서 한 층의 패턴을 여러 번 나누어 만드는 경우도 있어. 이를 멀티 패터닝이라고 해. / 더 나은 노광은 필요한 반복을 줄일 여지가 있지만, 모든 층과 모든 제품에서 반복 공정이 사라지는 것은 아니야. / Module 3의 포토와 식각은 서로 다른 역할이야. Module 5 Lesson 2의 핀과 시트 구조도 정밀한 패턴 형성이 필요해. 다만 더 좋은 노광 장비만 들이면 GAA의 모든 제조 문제가 해결되는 것은 아니야.

### `m05-l04:visual:1`

- document: `m05-l04`; sourceId: `none`; type: `cross-section`; category: **B**
- source: [module-05-advanced/lesson-04.md:57](../content/module-05-advanced/lesson-04.md); source line: 57
- description: 소자층을 기준으로 전면 신호 배선과 후면 전력망을 구별한 단면도. VDD·GND 경로 및 후면 연결부 표시
- 앞: | 전면 배선에 신호·전력 경로 배치 | 전력 경로의 일부 또는 주요 부분을 후면으로 이동 | / | 전력망과 신호망이 배치 자원 사용 | 전면 신호 배선의 공간 부담 완화 가능 | / | 공급 경로의 저항·혼잡 고려 | 후면 연결·박막화·정렬 등 새 통합 문제 고려 |
- 뒤: 기본적인 제조 그림은 앞면의 소자·배선을 준비하고, 임시 지지 구조를 사용하여 웨이퍼를 다루고, 뒤쪽을 얇게 가공하고, 전력 연결부와 배선을 형성하는 것이야. 실제 순서와 소자에 연결하는 방법은 구현마다 달라. / 후면 배선 기술과 나중에 배울 패키지의 배선은 같은 층이 아니야. / Lesson 2의 GAA는 채널 제어를, Lesson 3의 EUV는 패턴 형성을, 이번 Lesson은 전력 전달을 개선해. 하나가 나머지를 대신하지 않아.

### `m06-l01:visual:1`

- document: `m06-l01`; sourceId: `none`; type: `package-cross-section`; category: **A**
- source: [module-06-packaging/lesson-01.md:59](../content/module-06-packaging/lesson-01.md); source line: 59
- description: 회로면이 아래를 향한 Flip Chip 다이, 범프, 패키지 기판, PCB와 상부 방열 경로를 구분한 단면
- 앞: 이 표는 대표적인 기판 기반 패키지의 예야. 모든 패키지에 별도 기판과 솔더볼이 반드시 있는 것은 아니야. / Wire Bonding은 가는 금속선으로 두 접점을 잇고, Flip Chip은 다이를 뒤집어 범프로 연결해. 앞의 방식은 흔히 가장자리 패드를 사용하고, 뒤의 방식은 다이 면적 안에 접점을 분산 배치하기 유리해. / 제품은 연결 수, 크기, 비용, 성능에 따라 방식을 골라.
- 뒤: 전원은 PCB와 패키지 접점을 통해 다이의 전원망으로 들어와. 신호는 목적에 따라 양방향으로 오갈 수 있어. / 열은 다이가 동작하면서 발생하고, 패키지 구조와 냉각 장치를 통해 주변으로 전달돼. / 방열판은 열을 밖으로 전달하기 위해 마련하는 구조야. 고성능 칩에서는 다이의 뒷면에서 상부 방열 구조로 열을 보내기도 해.

### `m06-l02:visual:1`

- document: `m06-l02`; sourceId: `none`; type: `packaging-dimensions`; category: **A**
- source: [module-06-packaging/lesson-02.md:58](../content/module-06-packaging/lesson-02.md); source line: 58
- description: 옆으로 놓인 두 다이와 인터포저, 수직 적층된 두 다이를 같은 축과 색으로 비교
- 앞: | 얻으려는 이점 | 넓고 짧은 다이 간 연결 | 작은 면적과 짧은 수직 경로 | / | 함께 어려워지는 점 | 연결 구조의 크기와 비용 | 열·정렬·적층 후 검사 | / Bridge(브리지)는 필요한 경계 부근에 놓는 작은 연결 다리라고 이해하면 돼. 전체 다이 아래를 넓게 덮는 인터포저와는 모양과 적용 범위가 달라질 수 있어.
- 뒤: 여기서 ‘입체적으로 생겼으니 전부 3D 패키지’라고 부르면 구분이 사라져. 일반 패키지도 실제 높이는 있지만, 기술 분류의 3D는 다이의 적층과 수직 연결을 가리켜. / Module 2의 Chiplet은 큰 시스템의 일부 기능을 담당하도록 나눈 다이였어. Chiplet은 기능을 나누는 방식과 부품을 말하고, 2.5D·3D는 그 다이를 배치하고 연결하는 방법을 말해. Chiplet을 옆으로 놓을 수도, 위로 쌓을 수도 있어. / 그래서 ‘Chiplet이면 무조건 3D’도 아니고 ‘옆에 있으면 그냥 PCB 연결’도 아니야. 어떤 배선 구조를 통해 연결했는지까지 봐야 해.

### `m06-l03:visual:1`

- document: `m06-l03`; sourceId: `none`; type: `stack-cross-section`; category: **A**
- source: [module-06-packaging/lesson-03.md:51](../content/module-06-packaging/lesson-03.md); source line: 51
- description: TSV는 다이 내부, Microbump는 다이 경계에 표시하고 두 경로를 이어 보여주는 단면
- 앞: | TSV | 실리콘 두께 방향 | 다이 앞뒤 연결 경로 제공 | / | Microbump | 다이 경계 접합면 | 인접한 다이의 접점 연결 | / Microbump는 작은 범프를 이용하는 접합 구조야. Bonding(접합)은 다이 또는 웨이퍼를 맞춰 붙이는 과정이고, 전기 연결과 기계적 결합을 함께 고려해.
- 뒤: 공정 관점에서는 필요한 구멍과 절연 구조를 형성하고, 전도 재료를 채우고, 웨이퍼를 얇게 만들어 연결을 드러내는 등 여러 작업이 들어갈 수 있어. 구체적인 순서는 TSV를 언제 형성하느냐와 제품 구조에 따라 달라. Module 3에서 본 Etch·Deposition·Metal·CMP가 다시 등장하는 이유야. / Pitch(피치)는 반복되는 구조의 중심과 중심 사이 간격이야. 접점 피치가 작아지면 같은 면적에 더 많은 연결을 넣기 유리해. / 동시에 조금만 어긋나도 맞는 접점끼리 연결하지 못할 위험이 커져.

### `m07-l02:visual:1`

- document: `m07-l02`; sourceId: `none`; type: `cross-section`; category: **A**
- source: [module-07-hbm/lesson-02.md:55](../content/module-07-hbm/lesson-02.md); source line: 55
- description: DRAM 다이 적층과 베이스 다이, TSV·다이 사이 접합부를 구분. HBM 스택과 GPU를 인터포저 위에 나란히 배치한 대표적 2.5D 단면
- 앞: | 다이와 다이 사이 | 접합부 | 서로 다른 다이의 연결 지점을 이어줌 | / | 스택 아래 | 베이스 다이 | 외부와의 연결·인터페이스 등 | / | 스택 밖 | 인터포저 등의 패키지 배선 | HBM과 연산 다이를 연결 |
- 뒤: 대표적인 구성에서 HBM 스택과 GPU 다이는 인터포저 위에 나란히 있어. HBM이 여러 층이라고 해서 GPU가 반드시 HBM 바로 아래에 있는 것은 아니야. 제품별 구현은 다르지만, 이 대표 구조를 먼저 잡으면 적층 사진을 읽기 쉬워. / 메모리 컨트롤러는 메모리에 보낼 요청의 순서와 동작을 관리하는 회로야. GPU 쪽 컨트롤러가 읽기 요청을 만들고, 물리적 신호를 주고받는 인터페이스 회로와 패키지 연결을 거쳐 HBM에 전달해. 선택된 DRAM 영역에서 읽은 데이터가 연결을 따라 되돌아와. / 베이스 다이를 “GPU 전체의 메모리 컨트롤러가 통째로 내려간 것”이라고 단정하지 않아. 컨트롤러, 신호 인터페이스, DRAM 주변 회로 …

### `m09-l02:visual:1`

- document: `m09-l02`; sourceId: `none`; type: `comparison`; category: **B**
- source: [module-09-trends/lesson-02.md:56](../content/module-09-trends/lesson-02.md); source line: 56
- description: 같은 작은 두 선을 표현하는 기존 EUV와 High-NA 개념 비교. 이어 PR 현상과 식각 결과를 별도 패널로 표시
- 앞: | 작은 패턴 구별 | 더 작은 구조를 표현 | PR의 반응·현상과 결함 | / | 복잡한 패턴 분할 | 일부 반복 단계 감소 가능 | 어떤 층에 적용할지 판단 | / | 패턴 전사 결과 | 목표 형상에 가깝게 제조 | 식각·막 두께·정렬 |
- 뒤: 공정 윈도(Process Window)는 원하는 결과를 얻을 수 있는 공정 조건의 허용 범위야. 초점이 아주 정확한 한 점에서만 좋은 패턴이 나오는 것보다, 실제 제조에서 생기는 작은 변동에도 허용 결과를 유지하는 것이 중요해. / 처리량(Throughput)은 장비가 단위 시간에 처리하는 양이야. 해상도와 처리량은 다른 지표야. / 작은 패턴을 만들 수 있어도 노광 시간이나 운영 조건이 생산 목표에 맞는지 별도로 확인해. 여기서는 장비별 최신 처리량 숫자를 제시하지 않아.

## 11. 최종 숫자 요약

| 처리 방식 | Visual instance |
|---|---:|
| A Interactive 대체 | 21 |
| B Static SVG | 25 |
| C 실제/reference image | 10 |
| D illustration/comparison | 1 |
| E 생략 | 1 |
| F 판단 보류 | 0 |
| **전체** | **58** |

sourceId 있음 **47** + 없음 **11** = **58**. C 10슬롯은 실물 중심 9슬롯과 공식 구조 그림 1슬롯이며, 공유 가능한 원자료 묶음은 6개다. A 21개와 E 1개는 별도 자산이 필요 없다. 구현 batch는 3개, 첫 SOL pilot은 Batch A 안의 6슬롯(정적 SVG 2자산으로 B3, 도식 안내 A2, 생략 E1)이다. 코드·content·generated 변경 없이 문서만 추가했고 typecheck 및 262개 테스트가 통과했다.

