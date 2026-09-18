# Reference Image 10슬롯 출처·사용권 조사

조사·판정일: **2026-09-18**. 검토자: Codex. 산출물은 이 문서뿐이다. 이미지 파일을 다운로드·저장하거나 UI에 연결하지 않았다. 여기서 `approved`는 명시적인 재배포 근거를 확인한 **다음 구현의 후보 승인**이며, 현재 Visual 완료 수는 여전히 **48/58**이다.

결론: 바로 도입할 수 있는 외부 원자료는 **patterned-wafer 1자산 / 2슬롯**이다. 공식 자료 링크를 추천하는 것은 3그룹 / 3슬롯, 추가 증거가 필요한 것은 2그룹 / 5슬롯이다. 공개 게시·교육 목적·출처 표기만으로 배포 권한을 인정하지 않았다.

## 1. 범위와 판정 방식

[Visual 설계](visual-architecture.md), [visual_map](../content/visual_map.md), 아래 실제 Lesson의 태그와 앞뒤 설명, [registry](../src/app/visual/registry.ts), [VisualSlot](../src/app/visual/VisualSlot.tsx)을 확인했다. 설계 문서의 초기 placeholder 설명과 현재 구현을 구분했다. 현재 Slot은 문서·instance·source·revision·type·description을 대조하고 미등록/불일치 시 설명 fallback을 유지한다. 이번에는 binding을 추가하지 않는다.

| 판정 | 이번 조사에서의 의미 |
|---|---|
| approved | 특정 파일의 저작자·재배포 근거와 관찰 목적을 확인. 이후 도입 가능 |
| link-only | 원문 링크는 추천하지만 앱에 복제할 권한은 확보하지 못함. 이미지 embedding을 뜻하지 않음 |
| pending | 원본 접근, 개별 권리 또는 교육적 식별 근거가 남음. 자동 승인 금지 |
| rejected | 해당 후보를 이 슬롯의 자산으로 선택하지 않음. 반드시 불법 자료라는 뜻은 아님 |

모든 URL은 조사일 기준이다. 접근 실패와 미확인은 표에 남겼다. 논문 미러·검색 결과는 탐색 단서로만 사용했으며 승인 근거는 저작자의 파일 페이지 또는 실제 원 publisher의 약관이다. `미확인`은 허용이라는 뜻이 아니다. 아래 크기는 파일 페이지/브라우저 관찰로 확인한 값과 URL상의 표기를 구별한다. 웹 열람 과정의 브라우저 표시 외에 별도 이미지 다운로드·자산 저장은 하지 않았다.

## 2. 정확한 10슬롯 매핑

| assetGroup | sourceId | instance | 실제 원문 위치 | 보존할 목적 |
|---|---|---|---|---|
| patterned-wafer | visual-002 | m00-l01:visual:2 | [lesson-01:123](../content/module-00-basics/lesson-01.md) | 원형 전체와 반복 Die |
| patterned-wafer | visual-025 | m03-l01:visual:1 | [lesson-01:45](../content/module-03-process/lesson-01.md) | Wafer 외형; 그 자체가 CPU 제품은 아님 |
| official-fin-gaa | visual-009 | m00-l04:visual:4 | [lesson-04:874](../content/module-00-basics/lesson-04.md) | 삼성 공식 자료, FinFET 왼쪽/GAA 오른쪽 |
| cpu-die | visual-020 | m02-l01:visual:1 | [lesson-01:35](../content/module-02-chip/lesson-01.md) | 실제 die 왼쪽/교육용 inverter layout 오른쪽 |
| cpu-die | visual-021 | m02-l02:visual:1 | [lesson-02:35](../content/module-02-chip/lesson-02.md) | 실제 패턴과 기능 영역 |
| cpu-die | visual-046 | m02-s-floorplan:visual:1 | [supplement-floorplan:38](../content/module-02-chip/supplement-floorplan.md) | 위에서 본 실제 die와 floorplan 관계 |
| chip-cross-section | visual-022 | m02-l03:visual:1 | [lesson-03:37](../content/module-02-chip/lesson-03.md) | 아래 소자, 접점, 위 다층 금속 |
| chip-cross-section | visual-045 | m02-s-feol-beol:visual:1 | [supplement-feol-beol:40](../content/module-02-chip/supplement-feol-beol.md) | 실물 FEOL/BEOL 위치 |
| chiplet-product | visual-024 | m02-l06:visual:1 | [lesson-06:89](../content/module-02-chip/lesson-06.md) | 중앙 I/O와 주변 compute die 사례 |
| scanner | visual-030 | m03-l02:visual:2 | [lesson-02:296](../content/module-03-process/lesson-02.md) | 실제 노광 장비 외형 |

## 3. patterned-wafer — approved

제조사 [Intel 제조 사진 모음](https://www.intel.com/pressroom/archive/photos/manufacturing_photos.htm)을 먼저 확인했으나 앱 재배포의 명확성은 아래 저작자 직접 공개 파일이 더 높았다. 상위 출처라는 이유로 제조사 자료를 자동 승인하지 않는다.

| 기록 항목 | W1 — 최종 추천 | W2 — 예비 후보 |
|---|---|---|
| assetGroup / slots | patterned-wafer / 002,025 | patterned-wafer / 002,025 |
| candidate title | Silicon wafer.jpg | Intel 2nd Generation Core microprocessor codenamed Sandy Bridge Wafer |
| author / publisher | Inductiveload / 저작자 직접 Wikimedia Commons 공개 | Intel Free Press / Flickr; Commons 재수록 |
| source page | [저작자 파일·권리 페이지](https://commons.wikimedia.org/wiki/File:Silicon_wafer.jpg) | [원 Flickr](https://www.flickr.com/photos/intelfreepress/8660652107/), [Commons 기록](https://commons.wikimedia.org/wiki/File:Intel_2nd_Generation_Core_microprocessor_codenamed_Sandy_Bridge_Wafer.jpg) |
| direct asset URL | [원본 JPEG](https://upload.wikimedia.org/wikipedia/commons/e/e2/Silicon_wafer.jpg) | 원 publisher의 파일 URL 미확인 |
| date / product | 2010-04-07; 제품·공정 세대 미확인 | Commons 기록 2010-08-14; Sandy Bridge |
| observation / resolution | 실제 원판 전체, 반복 사각 패턴을 브라우저로 확인. 1732×1750 JPEG | Commons 기록 1024×671; 원본 시각·가독성 검수 미완료 |
| license / evidence | 파일 페이지의 저작자 public-domain 선언 및 해당 선언이 성립하지 않는 국가에서의 무조건적 사용 허락 | Commons에 CC BY-SA 2.0 기록. [라이선스 본문](https://creativecommons.org/licenses/by-sa/2.0/) 열람; Flickr 개별 페이지 접근 실패 |
| local redistribution | 허용 | 원 publisher 확인 전 도입 보류 |
| crop / annotation | 둘 다 허용; 교육상 전체 원판과 반복 패턴 보존 | CC 조건이 해당 파일에 유효하면 가능; 지금은 보류 |
| attribution required | 선언 자체는 의무화하지 않음. 프로젝트 추적을 위해 표기 권장 | 해당 CC가 확인되면 저작자·출처·라이선스·변경 고지, 파생물 동일조건 필요 |
| attribution text | Silicon wafer — Inductiveload, 2010-04-07, public domain, Wikimedia Commons. 변경: [실제 변경 내역]. | Intel Free Press — Sandy Bridge Wafer, CC BY-SA 2.0. 변경: [내역]. **미승인 초안** |
| commercial / education | 상업·비상업 모두 가능, 교육 예외에 의존하지 않음 | CC BY-SA는 상업 이용도 허용하나 개별 파일 적용 재확인 필요 |
| hotlink | 파일 권리와 서버 이용 조건은 별개; 서비스 허용 미확인, 앱에서는 로컬 제공 권장 | 미확인; 사용하지 않음 |
| rightsStatus / usage | **approved** / 한 파일을 두 슬롯에서 공유 | **pending** / 예비 후보로만 보관 |

W1 caption 제안: “반복되는 칩 패턴이 형성된 실리콘 웨이퍼의 실제 사진입니다. 원판 전체와 그 안의 사각 패턴을 구분해 보세요.” 025에서는 “가공된 표면의 예이며, 웨이퍼 한 장 자체가 완성된 CPU 제품은 아닙니다”를 덧붙인다. 특정 CPU·최신 공정·wafer 지름·검은 영역의 기능을 추정하지 않는다. 전체 외곽이 보이는 사진을 기본으로 사용하고 임의 재색칠은 하지 않는다. 공유 가능성은 높다. 이후 파일 교체·권리 충돌이 발견되면 기존 설명 fallback으로 돌아간다.

## 4. official-fin-gaa — link-only

| 기록 항목 | S1 — 최종 추천 링크 | S2 — 비교 후보 |
|---|---|---|
| assetGroup / slots | official-fin-gaa / 009 | official-fin-gaa / 009 |
| candidate title | Samsung Begins Chip Production Using 3nm Process Technology With GAA Architecture | Reduced Size, Increased Performance: Samsung’s GAA Transistor MBCFET |
| author / publisher | Samsung Electronics / Samsung Newsroom; 별도 그림 작가 미표기 | Samsung Electronics / Samsung Newsroom; 별도 작가 미표기 |
| source page | [2022 기사](https://news.samsung.com/global/samsung-begins-chip-production-using-3nm-process-technology-with-gaa-architecture) | [2019 인포그래픽 기사](https://news.samsung.com/global/infographic-reduced-size-increased-performance-samsungs-gaa-transistor-mbcfettm) |
| direct asset | [구조 진화 그림 JPEG](https://img.global.news.samsung.com/global/wp-content/uploads/2022/06/3nm_Chip_Production_main5-754x563.jpg) | [긴 인포그래픽 JPEG](https://img.global.news.samsung.com/global/wp-content/uploads/2019/03/GAA-Infographic-0314_F.jpg) |
| date | 2022-06-30 | 2019-03-14 |
| observation / resolution | Planar→FinFET→nanowire GAA→nanosheet GAA 네 구조. 표시된 754×563 그림 시각 확인 | 브라우저 원본 1000×6048. 확대 확인한 좌우 패널은 **Nanowire / Nanosheet** |
| license / evidence | [Samsung Newsroom Terms, General Use](https://news.samsung.com/global/terms) | 동일 약관 |
| local redistribution | 앱 배포 허가 미확보 | 앱 배포 허가 미확보 |
| crop / annotation | 배포용 편집 허가 없음; 별도 허가 필요 | 비교 패널 추출·번역·라벨 추가 허가 필요 |
| attribution required / text | 고지 보존 필요. 초안: Samsung Electronics / Samsung Newsroom, 기사명, 2022-06-30. | 고지 보존 필요. 초안: Samsung Electronics / Samsung Newsroom, 인포그래픽명, 2019-03-14. |
| commercial / education | 개인적 정보·비상업적 이용 범위와 공개 앱 재배포는 다름. 별도 앱 교육 예외 확인 안 됨 | 동일 |
| hotlink | framing/mirroring 사전 서면 동의 조항 존재; 이미지 hotlink 승인 근거 없음 | 동일 |
| rightsStatus / usage | **link-only** / 공식 구조 설명의 출처 링크 | **rejected** / 원문의 두 패널 대응 자산으로는 부적합 |

S1도 원문의 정확한 2패널 그림은 아니다. FinFET보다 오른쪽에 GAA들이 있으나 네 구조 전체를 곧바로 “왼쪽 FinFET/오른쪽 GAA”로 소개하면 혼동된다. S2의 눈에 띄는 두 패널은 둘 다 GAA 계열이므로 FinFET/GAA로 오독해서는 안 된다. 일반 자체 그림을 삼성 자료로 귀속하지 않는다.

현재 권장: description 유지 + 향후 S1 원문 링크. 이미지 도입은 삼성에 특정 figure의 로컬 재배포·두 구조 추출·한글 annotation 허가를 받은 뒤 원문 지시어 대응을 재검수한다. 이번에는 허가 요청도 전송하지 않았다.

## 5. cpu-die — pending

| 기록 항목 | C1 — 우선 재확인 출처 | C2 — 비교 후보 |
|---|---|---|
| assetGroup / slots | cpu-die / 020,021,046 | cpu-die / 020,021,046 |
| candidate title | Intel Technology Journal, Vol.12 Issue 3, Dunnington die figure | Intel Core 2 Duo / Core 2 Extreme processor die photo |
| author / publisher | Intel; 해당 논문 저자·figure credit 원문 재확인 필요 | Intel; 개별 촬영자 미확인 |
| source page / direct asset | [Intel 원본 PDF](https://www.intel.com/content/dam/www/public/us/en/documents/research/2008-vol12-iss-3-intel-technology-journal.pdf); 개별 image URL 없음 | [공식 Core 2 Duo media kit](https://www.intel.com/pressroom/kits/core2duo/index.htm); TIFF 직접 URL 확인 실패 |
| date / product | 2008 / Dunnington; 검색상 Figure 2, 인쇄 p.232는 **재확인할 위치** | 2006 출시 자료 / Core 2 Duo·Core 2 Extreme; 사진 자체 날짜 미표기 |
| observation / resolution | 검색 단서는 core·LLC 라벨을 가리키지만 publisher PDF 본문 수신 실패. 실제 사진 여부·I/O 범위·해상도 미확인 | publisher는 die photo와 callout illustration을 구분. 사진의 영역 주석·해상도는 확인 못함 |
| license / evidence | [Intel Terms of Use](https://www.intel.com/content/www/us/en/legal/terms-of-use.html), 개별 PDF 추가 조건 미확인 | 동일 약관; 개별 사진 조건 미확인 |
| local redistribution | 승인 못함 | 승인 못함 |
| crop / annotation | 승인 못함; 기능 라벨의 제조사 근거도 필요 | 승인 못함; illustration의 라벨을 사진에 임의 이식하지 않음 |
| attribution required / text | 고지 보존. 초안: Intel Corporation, Intel Technology Journal 12(3), 2008, [확정 논문·figure]. | 고지 보존. 초안: Intel Corporation, Core 2 Duo / Core 2 Extreme die photo, 2006 media kit. |
| commercial / education | 일반 교육 이용 언급만으로 앱 배포 승인하지 않음; 아래 제한 참고 | 동일 |
| hotlink | 개별 자산 허용 미확인; 사용하지 않음 | 동일 |
| rightsStatus / usage | **pending** / 기능 영역 근거까지 확보할 우선 조사 후보 | **pending** / 실제 die 사진 예비 후보 |

Intel 약관 §6.4에는 교육·편집 목적 이용을 다루는 조항이 있지만 전체 조건을 따라야 한다. §8.1 Documents 이용은 개인·비상업·정보 목적, 네트워크 게시와 변경 제한을 포함하며 §8.2의 교육기관 교실 예외도 교실 밖 배포까지 포괄하지 않는다. 따라서 “교육 앱이므로 전부 허용”도 “Intel은 교육 이용을 전부 금지”도 근거가 없다. 이 앱의 배포 범위에 맞는 파일별 허가를 확인해야 한다. [실제 약관](https://www.intel.com/content/www/us/en/legal/terms-of-use.html)

**확정 배포 후보는 없음.** C1은 주석 근거가 있을 가능성 때문에 다음 확인 대상으로 추천하는 것이며 검색 결과를 승인 source로 승격한 것이 아니다. C2의 원 publisher 페이지는 열렸으나 링크 추출 결과에서 고해상도 이미지 주소를 복원하지 못했다. 현재는 description 유지; C2 페이지를 탐색용 출처 링크로 제공하는 방안만 가능하다.

공유 조건: 같은 실제 die의 제조사 기능 영역 근거가 확보되면 세 슬롯 공유 가능. 020 오른쪽 inverter layout은 다음 구현에서 별도로 제작하고 축척·출처를 분리한다. CPU 전체 사진 안에서 inverter 위치를 특정했다고 말하지 않는다. Core/Cache/I/O 중 식별되지 않는 영역은 라벨링하지 않는다. 자체 floorplan SVG만으로 실물 관찰을 완료 처리하지 않는다.

## 6. chip-cross-section — pending

| 기록 항목 | X1 — 우선 재확인 출처 | X2 — 비교 후보 |
|---|---|---|
| assetGroup / slots | chip-cross-section / 022,045 | chip-cross-section / 022,045 |
| candidate title | SEM imaging and analysis on advanced logic device cross section | Review—Ruthenium as Diffusion Barrier Layer in Electronic Interconnects, Figure 1(b) |
| author / publisher | Thermo Fisher Scientific; 촬영자·샘플 제조사 미표기 | R. Bernasconi, L. Magagnin / The Electrochemical Society, IOPscience |
| source page | [Advanced logic technologies, SEM imaging and analysis](https://www.thermofisher.com/us/en/home/semiconductors/advanced-logic-devices/technologies.html) | [publisher DOI 페이지](https://iopscience.iop.org/article/10.1149/2.0281901jes) |
| direct asset | [공식 JPEG](https://www.thermofisher.com/content/dam/tfsite/images/storefront/semiconductors/gate-all-around-transistors/Tech-09_SEM-I-A_1024x576.jpg) | [publisher PDF](https://iopscience.iop.org/article/10.1149/2.0281901jes/pdf); figure 단독 URL 미확인 |
| date / product | 게시일·제품 세대 미표기 | JES 166(1), D3219–D3225 (2019); 저작권 연도 2018. Broadwell 관련 그림이라는 단서 재검증 필요 |
| observation / resolution | 다층 구조 실물 이미지는 브라우저 확인. URL에 1024×576 표기. 소자/접점/배선의 명시 라벨과 위아래 기준은 확인 못함 | PDF 두 번째 페이지, 인쇄 D3220 단서. publisher 접근 실패; 해상도·원도판 권리 미확인 |
| license / evidence | [Thermo Fisher Terms §2·4](https://www.thermofisher.com/us/en/home/global/terms-of-use.html), [부속 DO’s and DON’Ts](https://www.thermofisher.com/content/dam/LifeTech/Documents/PDFs/terms-of-use-Dos-and-Donts.pdf) | publisher 개별 라이선스 페이지 접근 실패. 논문 미러의 CC BY 4.0 표시는 **승인 근거로 채택하지 않음** |
| local redistribution | 명시적 서면 라이선스 밖 권리 유보; 앱 재배포 승인 없음 | 보류: 논문 전체의 CC와 인용·재사용 figure 권리는 별도 |
| crop / annotation | 둘 다 별도 허가 필요; 회전도 먼저 방향 검증 | 개별 figure의 권리·scale bar 확인 전 불가 |
| attribution required / text | 허가 시 조건 확인. 초안: Thermo Fisher Scientific, SEM imaging and analysis on advanced logic device cross section, 날짜 미상. | 초안: Bernasconi & Magagnin, JES 166(1), 2019, Fig.1(b), DOI:10.1149/2.0281901jes; 원도판 credit 추가 필요 |
| commercial / education | 교육 목적 사이트라는 설명은 복제 라이선스가 아님; 상업·비상업 앱 모두 허가 미확보 | 개별 figure 적용 조건 미확인; 교육 예외에 의존하지 않음 |
| hotlink | 허용 근거 미확인 | 허용 근거 미확인 |
| rightsStatus / usage | **pending** / 교육적 위치 식별과 권리 함께 보완 | **pending** / 원 publisher·제3자 figure 권리 재조사 |

X1은 공식 publisher와 실물 이미지는 확인했지만 아래 transistor→contact→위 다층 배선을 정확히 지목할 근거가 부족하다. 이미지가 복잡하다는 이유만으로 FEOL/MOL/BEOL 전체 단면이라고 승인하지 않는다. 권리만 보면 출처 링크 후보이고, 그룹 도입 판정은 교육 적합성까지 남아 **pending**이다.

X2는 [논문 미러](https://pdfs.semanticscholar.org/1c08/888e89aefbe98aa6ec3b57b96538e7f63d19.pdf)를 탐색에 사용했으나 원 publisher를 열지 못했다. 미러 본문에 CC 표기가 있어도 외부에서 재인용된 사진까지 저자가 재허가할 수 있는지 확인되지 않았다. 이 경로로 다운로드·배포하지 않는다.

권장 fallback은 기존 설명과 X1 공식 기술 페이지 링크다. 두 슬롯에 공유하려면 소자·접점·여러 배선층 식별, 원 방향, 원 scale bar 유무, 샘플 정보, 재배포·주석 허가를 확보해야 한다. 숫자 축척을 새로 만들어 넣거나 layer 이름을 모양만 보고 추정하지 않는다. 자체 단면 SVG는 보조 설명일 뿐 C 완료가 아니다.

## 7. chiplet-product — link-only

| 기록 항목 | P1 — 최종 추천 링크 | P2 — 비교 후보 |
|---|---|---|
| assetGroup / slots | chiplet-product / 024 | chiplet-product / 024 |
| candidate title | Threadripper PRO white paper, Figure 2: chiplet implementation | 같은 white paper, Figure 1: third wave of workstation computing |
| author / publisher | AMD; 개별 그림 작가 미표기 | AMD |
| source page / direct asset | [공식 white paper PDF](https://www.amd.com/content/dam/amd/en/documents/processor-tech-docs/white-papers/threadripperpro-white-paper-third-wave-workstation-computing.pdf), PDF p.3 / Fig.2. 별도 bitmap URL 없음 | 같은 PDF p.2 / Fig.1 |
| date / product | 문서 표기 Revision 11.01.22; Ryzen Threadripper PRO 5000 WX-Series / Zen 3 | 동일 문서·제품 맥락 |
| observation / resolution | 제조사가 chiplet 구현이라고 지칭한 사례. PDF 본문·caption 확인; 도판의 중앙 I/O 라벨·원본 해상도 시각 검수는 미완료 | 세대별 컴퓨팅 접근을 설명하는 개념 figure; 패키지 내부 관찰 자산으로 부족 |
| license / evidence | [AMD Copyright](https://www.amd.com/en/legal/copyright.html) | 동일 |
| local redistribution | 공개·상업적 복제/배포/표시는 별도 사전 서면 허가 필요. 개인 이용 허용을 앱 배포로 확장하지 않음 | 동일 |
| crop / annotation | 별도 허가 필요 | 별도 허가 필요 |
| attribution required / text | 고지 보존. 초안: AMD, Ryzen Threadripper PRO Processors: Riding the Third Wave of Workstation Computing, Rev.11.01.22, Fig.2. | 고지 보존. 초안: 동일 문서, Fig.1. |
| commercial / education | 공개 앱 배포 허가 없음; 앱 교육 예외 확인 안 됨 | 동일 |
| hotlink | 이미지 embedding 허용 미확인. PDF 원문 링크만 추천 | 동일 |
| rightsStatus / usage | **link-only** / 기존 Lesson이 가리키는 공식 문서 링크 | **rejected** / 내부 배치 관찰용으로 선택 안 함 |

P1은 특정 모델의 다이 수를 추정해서 넣지 않는다. 허가 확보 후에도 중앙 I/O와 주변 compute die를 실제 도판으로 재검수해야 하며 사진인지 공식 구조 렌더링인지 caption에 정확히 표시한다. 브라우저 PDF 시각 열람은 실패하여 텍스트·figure 설명의 확인 범위만 기록했다. 이 한계 때문에 지금 승인 자산 목록에는 들어가지 않는다. 자체 일반 chiplet 그림은 특정 제품의 관찰을 대체하지 않는다. 현재 설명을 유지하고 향후 “AMD 공식 제품 자료에서 보기”를 검토한다.

## 8. scanner — link-only

| 기록 항목 | E1 — 최종 추천 링크 | E2 — 예비 후보 경로 |
|---|---|---|
| assetGroup / slots | scanner / 030 | scanner / 030 |
| candidate title | TWINSCAN NXE:3600D product page equipment visual | ASML media library / Our technology equipment photographs |
| author / publisher | ASML; 개별 촬영자 미표기 | ASML; 파일별 작가 확인 필요 |
| source page | [NXE:3600D 공식 제품 페이지](https://www.asml.com/en/products/euv-lithography-systems/twinscan-nxe-3600d) | [공식 media library](https://www.asml.com/en/news/media-library), [연결된 Our technology 포털](https://ourbrand.asml.com/web/ffdedecebf4d8fe6/asml-com---our-technology/) |
| direct asset | 고정 원본 image URL 미확인 | 개별 파일 미선정; 포털은 asset URL 아님 |
| date / product | 게시·촬영일 미표기 / TWINSCAN NXE:3600D EUV | 제품·사진 날짜 개별 확인 필요 |
| observation / resolution | 특정 EUV 장비임을 공식 페이지에서 확인. 고해상도 원본·사진/렌더링 구분은 후속 검수 | 장비 사진 확보 경로. 파일별 크기·외형·촬영 조건 미확인 |
| license / evidence | [ASML Terms of Use](https://www.asml.com/en/terms-of-use); [media library 이용 안내](https://www.asml.com/en/news/media-library)의 허용을 제품 페이지 전체로 확장하지 않음 | media library의 editorial-only 안내; 포털 파일별 추가 조건 미확인 |
| local redistribution | 이 앱에 대한 명시 허가 없음 | editorial 범위가 이 앱에 해당하는지 미확인; 승인 안 함 |
| crop / annotation | 명시 허가 미확인; 별도 허가 필요 | 라이브러리 개별 편집 조건 확인 필요 |
| attribution required / text | 초안: ©ASML — TWINSCAN NXE:3600D. 원문 링크. credit만으로 허가되지 않음 | 라이브러리 요구 표기: ©ASML. 추가로 [파일 제목·제품·날짜·변경 내역] |
| commercial / education | 일반 약관은 다른 사이트 재배포 등에 명시 허락 요구. 교육 앱 예외 미확인 | editorial 용도에 한정, promotional/commercial 불가. 교육=editorial로 간주하지 않음 |
| hotlink | 다른 사이트 embed 허가 근거 없음 | 별도 허용 미확인 |
| rightsStatus / usage | **link-only** / 제품 공식 페이지 링크 | **pending** / 파일 선정과 이용 목적 승인 필요 |

이 슬롯은 장비 외형을 위한 것이다. 내부 EUV 광학 경로 자료를 받아도 외형 관찰을 완료한 것으로 세지 않는다. wafer 위치가 원자료로 확인되지 않으면 장비 사진 위에 임의 화살표를 추가하지 않는다. 현재 설명 유지 + 향후 E1 링크가 최소 대안이다. 실제 이미지 도입 시 ASML에 비상업/상업 여부, 공개 웹 앱, 로컬 저장, crop/한글 주석 범위를 특정해 허가를 확보한다.

## 9. 다음 구현 단계에 넘길 목록

| 구분 | 자산 / 대상 | 다음 작업 |
|---|---|---|
| 다운로드·로컬 배포 가능 후보 | **W1 Silicon wafer.jpg 1개 / 002,025** | 후속 구현에서만 원본 확보, SHA-256·치수·출처 기록, caption 2종, responsive 파생본 품질 검수 |
| 권한 확보 전 앱용 다운로드·저장·배포 금지 | S1/S2, C1/C2, X1/X2, P1/P2, E1/E2 | 미승인 원자료를 public 폴더에 넣지 않음. 개인 열람 허용 여부와 별개인 앱 운영 결정 |
| 원 publisher 재확인 전 도입 보류 | W2 | Flickr 개별 license 및 원본 확인; W1이 있어 우선순위 낮음 |
| 권한 때문에 링크만 추천 | **S1 삼성 / P1 AMD / E1 ASML** | 외부 원문 링크만 검토. iframe·img hotlink·PDF 미러링을 뜻하지 않음 |
| 교육 적합성도 미확정 | **C1 CPU / X1 단면** | 원도판과 기능/층 식별 근거 및 파일별 권리 확보; 기존 fallback 유지 |

approved 파일도 이번에는 받지 않았다. 저장 경로·hash·파생본·최종 alt는 아직 없다. 이후 W1이 구현되면 2슬롯을 처리할 수 있지만 이번 연구만으로 완료 수를 올리지 않는다. 원문 링크를 추가하더라도 실제 사진이 슬롯에 표시된 것과 구분해 집계한다.

허가가 필요한 경우 전달할 검토 항목: 정확한 figure/파일, 공개 교육 웹 앱과 배포 주체, 상업성, 로컬 복제·캐시·반응형 파생본, crop·한글 annotation, 제품명·credit·source 링크, 허용 기간/지역. 이 문서는 허가를 요청하거나 받은 기록이 아니다.

## 10. 검증 기록

- `npm.cmd run typecheck`: 통과.
- `npm.cmd test`: **15개 파일 / 309개 테스트 통과**.
- 시작/종료 파일 집합·SHA-256 비교: `content/` **83개**, `src/` **99개**, `.generated/content/` **83개**, 추가·삭제·내용 변경 **0개**. 이 작업이 추가한 프로젝트 산출물은 `docs/reference-image-research.md`뿐이다.
- build 및 content writer는 실행하지 않았다. 이미지 다운로드, React·registry·parser·content 수정, AI 생성은 수행하지 않았다.
- 이 작업 디렉터리에는 `.git`이 없어 git diff 대신 파일 hash 비교를 사용한다. 테스트 통과는 외부 자료의 권리·교육 적합성을 대신 증명하지 않는다.

## 11. 최종 합계

최종 그룹 판정만 합산한다. 예비·탈락 후보의 상태를 중복 집계하지 않는다. pending은 미승인이라는 완료된 조사 결론이며, 후보를 찾았다는 이유로 approved로 승격하지 않는다.

| Asset group | 슬롯 | 최종 추천 출처 | 결과 |
|---|---:|---|---|
| patterned-wafer | 2 — 002,025 | W1 Inductiveload 직접 공개 wafer 사진 | **approved** |
| official-fin-gaa | 1 — 009 | S1 Samsung Newsroom 2022 GAA 기사 | **link-only** |
| cpu-die | 3 — 020,021,046 | C1 Intel Technology Journal 2008 — 재확인 우선 후보 | **pending** |
| chip-cross-section | 2 — 022,045 | X1 Thermo Fisher advanced logic SEM — 식별 근거 필요 | **pending** |
| chiplet-product | 1 — 024 | P1 AMD Threadripper PRO white paper Fig.2 | **link-only** |
| scanner | 1 — 030 | E1 ASML TWINSCAN NXE:3600D 제품 페이지 | **link-only** |
| **전체** | **10** | **6그룹** | |

| rightsStatus | asset group | Visual slot |
|---|---:|---:|
| approved | **1** | **2** |
| link-only | **3** | **3** |
| pending | **2** | **5** |
| rejected | **0** | **0** |
| **합계** | **6** | **10** |

다음 구현에서 배포 가능한 외부 파일 후보는 **1개**, 연결 가능한 슬롯은 **2개**다. 이번에 배포한 파일은 **0개**다.
