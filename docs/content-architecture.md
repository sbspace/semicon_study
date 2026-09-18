# 콘텐츠 데이터 모델과 로딩 구조

작성일: 2026-09-13. 대상: 현재 `content/`의 83개 파일, `schema_version: '1.0'`, `content_version: 2026.09.12`.

이 문서는 구현 명세다. 이번 작업에서는 parser, 앱 코드, React component, 생성 JSON을 만들거나 패키지를 설치하지 않는다. 아래 TypeScript는 데이터 계약을 설명하는 예시이며 아직 프로젝트의 기술 스택으로 확정된 코드는 아니다.

설계의 중심은 **목차는 YAML에서, 본문과 학습 요소는 Markdown에서 읽고, 원문 위치를 보존한 데이터로 변환하는 것**이다. 콘텐츠를 MDX나 별도 CMS 형식으로 옮길 필요가 없다.

## 1. 실제 프로젝트와 콘텐츠 구조

작업 시작 시 `C:/CL_edu`에는 `content/`만 있었다. `package.json`, lockfile, `src/`, TypeScript·React·Vite·Next.js 설정, `AGENTS.md`, `.git`은 없었다. 따라서 기존 앱의 로더나 빌드 도구를 전제로 하지 않는다. React는 향후 소비자이고 이번 설계는 그 UI와 독립적이다.

확인은 실제 파일 열람, 모든 Markdown의 frontmatter·제목 계층·Quiz·태그 조사, 기존 환경에 있던 PyYAML을 사용한 읽기 전용 YAML 대조로 수행했다. 검사 스크립트는 프로젝트 파일로 남기지 않았다. 외부 출처 페이지의 기술 사실을 다시 검증하는 작업은 이번 범위에 포함하지 않았다.

```text
content/
  curriculum.yaml
  README.md
  visual_map.md
  source_map.md
  quality_review.md
  module-00-basics/       module.md, lesson-01..05.md, review.md
  module-01-cmos/         module.md, lesson-01..07.md, review.md, supplement-*.md × 2
  module-02-chip/         module.md, lesson-01..06.md, review.md, supplement-*.md × 3
  module-03-process/      module.md, lesson-01..09.md, review.md
  module-04-products/     module.md, lesson-01..06.md, review.md
  module-05-advanced/     module.md, lesson-01..04.md, review.md
  module-06-packaging/    module.md, lesson-01..04.md, review.md
  module-07-hbm/          module.md, lesson-01..04.md, review.md
  module-08-foundry/      module.md, lesson-01..04.md, review.md
  module-09-trends/       module.md, lesson-01..04.md, review.md
```

각 모듈을 실제 파일 기준으로 조사한 결과다. Interactive·Visual 수에는 보충 수업과 Review도 포함한다. README의 코드 예시는 실제 슬롯 수에서 제외했다.

| Module / 디렉터리 | 정규 Lesson | Review | 보충 | Interactive | Visual |
|---|---:|---:|---:|---:|---:|
| m00 / module-00-basics | 5 | 1 | 0 | 6 | 11 |
| m01 / module-01-cmos | 7 | 1 | 2 | 9 | 13 |
| m02 / module-02-chip | 6 | 1 | 3 | 9 | 8 |
| m03 / module-03-process | 9 | 1 | 0 | 10 | 17 |
| m04 / module-04-products | 6 | 1 | 0 | 6 | 1 |
| m05 / module-05-advanced | 4 | 1 | 0 | 4 | 3 |
| m06 / module-06-packaging | 4 | 1 | 0 | 4 | 3 |
| m07 / module-07-hbm | 4 | 1 | 0 | 4 | 1 |
| m08 / module-08-foundry | 4 | 1 | 0 | 4 | 0 |
| m09 / module-09-trends | 4 | 1 | 0 | 4 | 1 |
| 합계 | 53 | 10 | 5 | 60 | 58 |

- 총 83개, 686,574바이트: YAML 1개, frontmatter가 있는 학습 Markdown 78개, frontmatter가 없는 보조 Markdown 4개다.
- `module.md` 10개는 소개·학습 위치·정규 목차 표·Review 링크·전후 연결을 담는다. m01/m02에는 보충 목록이 있다. 이 본문도 앱에서 읽을 수 있어야 한다.
- Module 0~3 정규 Lesson 27개, 원문 Review 3개, 보충 5개는 `adapted_original`이다. 제목 계층, 말투, Quiz 배치가 일정하지 않다.
- Module 3 Review는 `new_supplement`, Module 4~9 정규 Lesson 26개와 Review 6개는 `new`다. 신규 Lesson은 대체로 목표→설명→구조→연결→연습→용어→요약→Quiz→해설→이어 읽기 순서다. 일부에는 추가 주제 절과 사실 확인 자료가 있다.
- 모든 정규 Lesson과 보충 수업에 Interactive가 있다. m00-l04는 2개이며, Review 중에는 m03-review에만 1개 있다. 이 수는 조사 결과이지 앞으로 모든 문서에 강제할 최소 슬롯 수는 아니다.

### 보조 문서의 역할

| 파일 | 실제 내용 | 앱 로딩에서의 역할 |
|---|---|---|
| [README.md](../content/README.md) | 읽기 방법, 구성, 메타데이터와 태그 규칙 | 일반 안내 문서 |
| [visual_map.md](../content/visual_map.md) | visual-001~047 추적 표, 파일별 Interactive 종류·이미지 설명 | 제작 참고·대조 자료. 슬롯 생성의 입력은 해당 본문 태그 |
| [source_map.md](../content/source_map.md) | 출처 URL·메시지 ID·번호 충돌·편집 보완·원문 지문 | 출처 안내 문서. 학습 ID나 진도를 생성하지 않음 |
| [quality_review.md](../content/quality_review.md) | 기존 검토 결과와 보존 예외 | 감사 기록. 현재 parser 검증을 통과했다는 실행 결과로 사용하지 않음 |

보조 문서는 frontmatter 없이 Markdown 문서로 로드한다. `module.md`의 `../source_map.md` 같은 링크가 앱에서도 열리도록 경로 색인에 포함하되, 정규 학습량·완료율에는 포함하지 않는다. 보조 문서의 표를 별도 CMS 테이블로 변환하거나 런타임 필수 의존성으로 삼지 않는다.

## 2. Source of Truth와 파일 간 관계

**편집 가능한 교육 데이터의 유일한 원본은 `content/` 전체다.** 앱 데이터와 JSON은 전부 재생성할 수 있는 파생물이다. parser는 콘텐츠를 읽기만 하며 제목·문장·표·정답·순서를 자동 교정하지 않는다.

| 정보 | 권위 있는 위치 | 중복 정보 처리 |
|---|---|---|
| 과정 제목·설명·언어·버전 | curriculum.yaml | 앱에 상수로 재작성하지 않음 |
| Module 목록·소속·권장 순서·파일 경로 | curriculum.yaml | 파일명 정렬이나 module.md 표에서 목차 재추론 금지 |
| 목록용 ID·제목·시간, Module 번호·설명 | curriculum.yaml | 대응 frontmatter 값과 반드시 대조 |
| kind·module_id·lesson_number·출처·갱신 정보 | 각 Markdown frontmatter | YAML의 소속·번호와 대조 |
| 본문·Quiz·해설·도식 위치·설명 | 각 Markdown 본문 | H1/H2가 목록 제목과 달라도 보존 |
| 이미지 검색 단서·출처 정리·검토 이력 | 각 map/review 보조 문서 | 본문과의 차이는 보고하고 자동 덮어쓰기 금지 |

현재 목차의 78개 파일과 실제 frontmatter 문서 목록은 일치한다. ID 중복, 등록 경로 누락, 공유 메타데이터 값 불일치는 발견하지 않았다. 조사한 상대 `.md` 링크의 대상 파일도 모두 존재한다.

중복 필드가 향후 달라지면 YAML을 조용히 덮어쓰거나 Markdown 값을 무시하지 않는다. 두 파일 위치와 값을 담은 오류를 출력하고 정식 산출물 생성을 중단한다. 개발 중에는 기존 원문을 확인할 수 있지만 불일치한 데이터가 정상 데이터인 것처럼 배포되어서는 안 된다.

`modules[]`, `lessons[]`, `supplements[]`의 배열 순서를 유지한다. `number`와 `lesson_number`는 표시·일관성 검사용 번호다. Review는 해당 Module의 독립 문서이며 마지막 Lesson 본문에 합치지 않는다. 보충은 별도 목록으로 노출한다. 전후 이동은 목차에서 파생하되 원문에 있는 이어 읽기 링크도 보존한다. 어느 순서도 접근 선행 조건이 아니다.

## 3. ID와 파일 naming

| 종류 | 현재 규칙 | 예 |
|---|---|---|
| Module | `m` + 최소 두 자리 번호 | `m00`, `m09` |
| Lesson | Module ID + `-l` + 최소 두 자리 번호 | `m01-l07` |
| Review | Module ID + `-review` | `m03-review` |
| 보충 | Module ID + `-s-` + kebab-case 주제 | `m02-s-wafer-shot` |
| 디렉터리 | `module-NN-slug` | `module-02-chip` |
| 파일 | `module.md`, `lesson-NN.md`, `review.md`, `supplement-slug.md` | `lesson-06.md` |

이름은 현재 규칙을 그대로 이어 쓴다. 최소 두 자리이므로 향후 100 이상을 막는 고정 두 자리 타입은 만들지 않는다. 파일명에서 ID를 생성하지 않고 frontmatter와 YAML의 명시 ID를 사용한다. 제목과 경로가 바뀌어도 같은 학습 자료이면 ID를 유지하며, 정렬 변경을 이유로 기존 ID를 다시 매기지 않는다. 삭제한 ID를 다른 학습 내용에 재사용하지 않는다.

curriculum 경로는 `content/` 기준 POSIX 상대 경로다. Windows에서도 앱에는 `/`로 직렬화한다. 본문 상대 링크는 **해당 Markdown이 있는 디렉터리 기준**이다. `../source_map.md`는 유효하며, 정규화 후 `content/` 밖으로 나가는 경로만 거부한다. 절대 파일 경로, 드라이브 경로, 중복 정규화 경로, 대소문자만 다른 파일도 검사한다.

보조 문서 ID는 `doc:README`, `doc:visual_map`, `doc:source_map`, `doc:quality_review`처럼 parser가 파일명에서 부여한다. 이는 학습 ID와 다른 네임스페이스이며 원문에 frontmatter를 추가할 이유가 되지 않는다.

원문에 ID가 없는 요소에는 다음 파생 ID를 쓴다.

- Quiz 그룹: `m00-l01:quiz:1`, 문항: `m00-l01:quiz:1:q3`.
- 정답 위치: 문항 ID + `:answer:1`, `:answer:2`. 원래 정답과 추가 해설의 여러 위치를 구분한다.
- Interactive 인스턴스: `m00-l04:interactive:1`, `m00-l04:interactive:2`.
- Visual 인스턴스: `m00-l03:visual:1`. 원래 있는 `visual-001`은 별도 `sourceId`로 보존한다.

등장 순서는 문서 안의 **같은 종류 요소끼리** 센다. 줄 번호를 영구 ID로 쓰지 않는다. 순서 기반 ID는 앞에 같은 종류를 삽입하면 달라질 수 있다. 따라서 문항 답안·도식 임시 상태는 문서 revision과 함께 관리하고, 이를 영구 콘텐츠 ID와 같은 안정성으로 취급하지 않는다. 원본의 명시적 슬롯 ID 추가는 나중에 별도 편집을 승인받아 결정할 사안이며 현재 마이그레이션 요구 사항은 아니다.

## 4. Frontmatter 입력 계약

현재 확인한 필드 전부를 다음처럼 처리한다. YAML 입력은 `unknown`에서 검증해 타입으로 좁히고 TypeScript 타입 단언만으로 통과시키지 않는다.

| 대상 | 필수 필드 | 현재 선택 필드 |
|---|---|---|
| Module 10개 | id, number, title, description, kind, last_updated | 없음 |
| Lesson 53개 | id, module_id, lesson_number, title, estimated_minutes, content_origin, kind, last_updated | extension_minutes, source_url, source_message_ids, 시점 필드 |
| Review 10개 | id, module_id, title, estimated_minutes, content_origin, kind, last_updated | source_url, source_message_ids, 시점 필드 |
| Supplement 5개 | id, module_id, title, estimated_minutes, content_origin, kind, last_updated | original_label, source_url, source_message_ids |

현재 모든 supplement에 `original_label`이 있고, adapted_original 35개에는 `source_url`과 `source_message_ids`가 있다. Module에는 `module_id`, `estimated_minutes`, `content_origin`이 없다. README의 “각 수업” 설명을 Module까지 확장해 이 필드들을 강제하지 않는다.

`extension_minutes`는 8개 Lesson에만 있다: m00-l03(5), m00-l04(10), m01-l01(5), m01-l07(5), m02-l05(5), m03-l01(5), m03-l02(5), m03-l06(5). 기본 시간과 별도로 노출한다. 없으면 선택 시간이 미지정된 것이며 원문 메타데이터에 0을 써 넣지 않는다. 합계 계산에서만 0으로 취급할 수 있다.

Module 9의 Lesson 4개와 Review 1개에는 `as_of: '2026-09-12'`, `time_sensitive: true`, `update_review_after: '2027-03-12'`가 있다. Module 9의 module.md에는 이 세 필드가 없다. `last_updated`는 모든 frontmatter 문서에 있으며 현재 모두 2026-09-12다. 점검 권장일을 지났다고 콘텐츠를 잠그거나 본문 사실을 자동 갱신하지 않는다.

처리 규칙:

1. UTF-8을 엄격하게 읽고 선두 BOM을 허용한다. 파싱용 텍스트는 CRLF/LF 차이를 정규화하되 파일에 다시 쓰지 않는다.
2. 파일 맨 앞의 `---`로 둘러싸인 블록만 frontmatter다. 본문의 수평선 `---`는 일반 Markdown이다. 보조 문서는 frontmatter가 없어도 정상이다.
3. YAML은 안전한 데이터 스키마로 읽는다. 중복 키, 실행 가능한 사용자 정의 태그, 순환 참조는 거부한다. 현재 앵커·별칭에 의존하는 구조는 없으므로 우선 허용할 필요가 없다.
4. 날짜와 버전은 문자열로 유지한다. `schema_version: '1.0'`을 숫자 1로, `content_version: 2026.09.12`를 날짜·소수로 바꾸지 않는다. 날짜는 실제 유효한 `YYYY-MM-DD`인지 확인한다.
5. `estimated_minutes`는 양의 정수, `extension_minutes`는 0 이상의 정수, `time_sensitive`는 boolean이다. 문자열 `"true"`나 `"15"`를 조용히 강제 변환하지 않는다.
6. 알 수 없는 메타데이터 키는 `extra`에 JSON 호환 값으로 보존하고 경고한다. 알려진 필드의 잘못된 타입이나 알 수 없는 `kind`는 오류다. `content_origin` 새 값도 명시적 지원 전에는 오류로 다룬다.
7. `original_label`의 후행 공백을 포함한 원래 값, source_message_ids 배열 순서, 한글·기호·백틱이 든 제목을 보존한다. 목록 제목은 안전한 inline Markdown으로 표시할 수 있지만 HTML/JSX 실행은 허용하지 않는다.

## 5. Typed App Data Model

아래 모델은 JSON으로 직렬화할 수 있다. 함수, React element, 파일 핸들, Date 객체, parser 라이브러리의 AST를 공개 데이터에 넣지 않는다. 본문 전체를 목표·비유·요약 등 고정 필수 필드로 해체하지 않는다. 서로 다른 원수업의 구조를 담기 위해 순서 있는 `blocks`를 공통 기반으로 둔다.

```ts
type ContentId = string;
type ContentPath = string; // content/ 기준, '/' 사용
type ISODate = string;     // 런타임 검증: YYYY-MM-DD
type JsonValue = null | boolean | number | string
  | JsonValue[] | { [key: string]: JsonValue };
type Origin = 'adapted_original' | 'new' | 'new_supplement';

interface SourceSpan {
  path: ContentPath;
  start: number; // 정규화한 전체 파일 문자열의 UTF-16 offset, 포함
  end: number;   // 제외. 줄 번호가 아니라 정확한 substring 범위
  startLine: number; // frontmatter 포함 1부터
  endLine: number;
}
interface MarkdownFragment {
  markdown: string;
  source: SourceSpan;
}
interface DocumentBody {
  markdown: string; // frontmatter 제외 전체 본문, 검토·fallback용
  blocks: ContentBlock[]; // 원래 순서의 렌더링 계획
  quizzes: Quiz[];        // 독립 Quiz UI의 질의용 색인
  headings: { id: string; depth: number; text: string; source: SourceSpan }[];
}
interface DocumentBase {
  id: ContentId;
  title: string;
  path: ContentPath;
  revision: string; // 원본 파일 바이트의 SHA-256
  lastUpdated: ISODate;
  extra: Record<string, JsonValue>;
  body: DocumentBody;
}
interface Module extends DocumentBase {
  kind: 'module';
  number: number;
  description: string;
  lessonIds: ContentId[];
  reviewId: ContentId;
  supplementIds: ContentId[]; // 미지정 시 빈 배열
}
interface LearningDocument extends DocumentBase {
  moduleId: ContentId;
  estimatedMinutes: number;
  extensionMinutes?: number;
  contentOrigin: Origin;
  sourceUrl?: string;
  sourceMessageIds: string[]; // 미지정 시 빈 배열
  asOf?: ISODate;
  timeSensitive?: boolean;
  updateReviewAfter?: ISODate;
}
interface Lesson extends LearningDocument {
  kind: 'lesson';
  lessonNumber: number;
}
interface Review extends LearningDocument { kind: 'review'; }
interface Supplement extends LearningDocument {
  kind: 'supplement';
  originalLabel?: string;
}
interface SupportingDocument {
  kind: 'supporting';
  id: ContentId;
  path: ContentPath;
  title: string; // 선두 H1에서 추출
  revision: string;
  body: DocumentBody; // 일반 Markdown. 예시 태그는 실행하지 않음
}
type ContentDocument = Module | Lesson | Review | Supplement | SupportingDocument;

interface Curriculum {
  schemaVersion: string;  // 원본 YAML 스키마 버전
  contentVersion: string;
  language: string;
  title: string;
  description: string;
  lastUpdated: ISODate;
  moduleIds: ContentId[]; // YAML 배열 순서
  extra: Record<string, JsonValue>;
}
interface ContentCatalog {
  modelVersion: '1'; // 앱의 파생 JSON 계약 버전. schemaVersion과 별개
  parserVersion: string;
  sourceDigest: string; // 경로순 원본 해시 목록 + parser/model 버전으로 생성
  curriculum: Curriculum;
  documentsById: Record<ContentId, ContentDocument>;
  idByPath: Record<ContentPath, ContentId>; // 내부 링크 해결
}
```

위 `SupportingDocument`의 제목은 선두 H1에서 가져온다. Module/Lesson의 제목은 YAML/frontmatter의 값을 사용한다. H1을 지우거나 합쳐 제목 중복을 자동 제거하지 않는다. heading anchor는 정규화 규칙을 하나 정해 parser와 renderer가 공유하며 중복 제목은 등장 순서 suffix로 구분한다.

## 6. Quiz 데이터와 현재 표현의 해석

현재 Quiz는 frontmatter의 배열도, `<quiz>` 선언도 아니다. 제목과 일반 Markdown 문단·목록으로 쓰였다. 질문과 답을 구조화하되 원문 문장을 선택지나 정답 문자열로 다시 만들어 쓰지 않는다.

### 실제로 지원해야 하는 패턴

| 실제 파일 | 질문 표현 | 정답 표현·주의점 |
|---|---|---|
| m00-l01 | `### Q1.`, `### Q3.` | 뒤쪽 `### 정답`, `**Q1 → B. Die**`; Q3는 선택지 없는 서술형 |
| m00-l02/l03 | `**Q1.**` 뒤 질문 | 뒤쪽 `**Q1 → ...**` 묶음 |
| m00-l04/l05, m00-review | `### Q1` | `정답`, `정답 및 체크` 절의 Q 번호 매칭 |
| m01-l01 | `### 🧠 확인 퀴즈` 아래 굵은 Q | 편집 보완 해설의 `1. **A.** ...` 목록 |
| m01-l02~07 | `**Q1. 질문 전체**` | 바로 아래 `**정답: A.**`, 콜론·마침표·대시 변화 |
| m01-review, m02-l01~06, m02-review | `### Q1` | 문항별 즉시 정답과 해설; m02-l06 Q3 안에 ASCII 코드 블록 |
| supplement 5개 | `### Q1` | 뒤쪽 `정답 및 해설`, `**Q1 → B**` |
| m03-l01/l02 | 굵은 Q | `→ **정답 B.**` |
| m03-l03~09 | 굵은 Q, 객관식·주관식 혼합 | `→ **B**`, `→ **CMP**`, `→ **X.**` 등. 일부는 뒤쪽 번호 해설도 있음 |
| m03-review, m04~09 전체 | `## Quiz` 또는 `## 누적 Quiz` 아래 번호 목록 | 별도 정답 절의 같은 번호 목록 |
| m01-l05 누적 체크 | `### 🔁 Lesson 1~5 누적 체크` 아래 번호 없는 굵은 질문 | `→ **높은 전압 ...**`; 정규 3문항과 별도 reflection 그룹 |

정규 Lesson의 주 Quiz는 m03-l08만 4문항이고 나머지는 3문항이다. Review 문항 수는 m00부터 순서대로 **8, 8, 4, 10, 7, 6, 6, 6, 6, 7**이다. supplement는 각각 3문항이다. m01-l05의 번호 없는 누적 체크는 이 주 Quiz 수와 구분한다. “Quiz는 항상 3개”라는 검증 규칙을 만들지 않는다.

```ts
interface Quiz {
  id: string;
  documentId: ContentId;
  category: 'practice' | 'cumulative' | 'reflection';
  title: MarkdownFragment;
  status: 'structured' | 'unparsed';
  sourceRanges: SourceSpan[]; // 질문 절과 떨어진 해설 절도 추적
  questions: QuizQuestion[];
}
interface QuizOption {
  id: string;    // 해당 문항 안에서 'A', 'B', 'C', 'D'
  label: string; // 원래 표시 문자
  content: MarkdownFragment;
}
interface QuizAnswer {
  id: string;
  role: 'answer' | 'explanation';
  content: MarkdownFragment; // 원문 정답 표기와 해설을 그대로 보존
}
type GradingRule =
  | { kind: 'single-choice'; correctOptionId: string }
  | { kind: 'ox'; correct: 'O' | 'X' }
  | { kind: 'self-check' };
interface QuizQuestion {
  id: string;
  ordinal: number;
  sourceLabel?: string; // Q1, Q1., 1. 등을 보존; reflection은 없음
  responseKind: 'single-choice' | 'free-response' | 'ox';
  prompt: MarkdownFragment; // 표·수식·코드가 포함될 수 있음
  options: QuizOption[];
  answers: QuizAnswer[]; // 원래 즉시 정답 + 추가 해설을 모두 연결
  grading: GradingRule;
  source: SourceSpan;
}
```

객관식 선택지는 GFM ordered list가 아니라 `A. ...` 문단과 hard line break인 경우가 많다. AST의 문단 내부 line break와 원문 위치를 보고 구분한다. 굵은 문장의 `Q1.` 뒤에 질문이 붙는 경우와 다음 문단에 질문이 있는 경우도 모두 다룬다. 단순히 모든 `Q\d`를 세면 뒤쪽 정답 Q 번호를 중복 문항으로 인식한다.

해석은 Markdown AST를 만든 뒤 **명확한 Quiz 영역 안에서만** 수행한다. 문서 전체의 `1.` 목록, 일반 질문형 소제목, “직접 설명하기”, “연결 연습”, 본문의 화살표를 Quiz로 승격하지 않는다. `Quiz 정답...`은 질문 절이 아닌 답 절이다. m01-l05의 명시된 누적 체크만 별도 reflection으로 다룰 수 있다.

질문 번호와 답 번호를 먼저 대응시키고, 즉시 정답은 해당 문항에 연결한다. m01-l01처럼 Q 질문과 번호 목록 답이 만나는 경우에는 번호와 수가 일치해야 한다. m03-l03/l04/l05/l07/l08/l09에서는 원래 즉시 정답과 편집 보완 해설이 함께 있으므로 `answers[]`의 별개 위치로 보존한다. 추가 해설의 “B야”를 또 다른 문제나 유일한 기계 채점 근거로 추론하지 않는다.

원문에 선택지와 확실한 답 표기가 있을 때만 single-choice 채점 규칙을 만든다. `맞다/아니다`라는 문장이 있어도 선택지가 없으면 free-response/self-check가 기본이다. m03-l09 Q3처럼 질문 자체가 명시적으로 O/X를 요구하고 답이 X일 때 ox로 분류할 수 있다. 주관식·계산형은 모범 답안이 있어도 문자열 일치 자동 채점을 만들지 않는다. 자동 채점이 불확실한 객관식도 선택지는 보존하고 self-check를 쓴다.

파싱 범위는 다음 질문, 명시적 정답 절, Quiz 바깥의 다음 절·이어 읽기까지 검토해 정한다. 수평선 하나만을 종료 조건으로 쓰지 않는다. 정답 뒤의 편집 보완 인용문이나 Module 최종 요약을 마지막 문항의 해설로 흡수하지 않는다. 인식이 모호하면 해당 그룹을 `unparsed`로 남기고 원문 Markdown을 온전히 표시하며 경고한다. 일부만 잘라 문항·해설을 유실하는 결과는 허용하지 않는다.

## 7. 본문 순서를 보존하는 블록

독립 Quiz UI를 지원한다고 본문의 정답을 모두 문서 끝으로 이동시키지 않는다. 일반 읽기 화면은 아래 `blocks`를 순서대로 사용하고, 독립 Quiz 화면은 같은 `quizzes` 데이터를 조회한다. 두 화면이 별도 정답 원본을 가지지 않는다.

```ts
type ContentBlock =
  | { kind: 'markdown'; content: MarkdownFragment }
  | { kind: 'quiz-question'; quizId: string; questionId: string;
      original: MarkdownFragment }
  | { kind: 'quiz-answer'; quizId: string; questionId: string; answerId: string;
      original: MarkdownFragment }
  | { kind: 'interactive'; value: InteractiveDeclaration }
  | { kind: 'visual'; value: VisualPlaceholder }
  | { kind: 'unsupported-directive'; original: MarkdownFragment; tagName: string };
```

예를 들어 m00-l01은 Quiz 제목→Q1/Q2/Q3→원래 정답 제목→Q1/Q2/Q3 답 순서다. m01-l02는 Q1→Q1 답→Q2→Q2 답 순서다. m03-l03은 즉시 정답 위치와 뒤쪽 해설 목록 위치가 모두 남는다. 설명 제목·절 사이 문장·수평선·끝의 연결 링크는 markdown 블록으로 보존한다. 일반 읽기 화면의 질문 component는 답을 자동으로 복제 표시하지 않고 `quiz-answer` 위치가 담당한다. 독립 Quiz 화면에서는 `answers[]`를 통해 해설을 함께 볼 수 있다.

원문 범위는 겹치지 않게 분할하고 공백까지 포함하여 블록의 원래 문자열을 순서대로 합치면 정규화한 본문과 같아야 한다. `quizzes` 안의 fragment는 그 범위를 가리키는 질의용 데이터이므로 별도로 본문에 덧붙이지 않는다. fallback 시에는 `body.markdown` 하나만 렌더링해 중복을 방지한다.

Markdown 분할은 코드·표·수식·인용·목록의 문맥을 깨지 않아야 한다. 번호 목록 문항/해설을 개별 데이터로 꺼낼 때도 원래 번호와 시작 번호, 연속 목록 컨테이너를 renderer가 보존해야 한다. 문항 사이 빈 줄이 없는 목록을 단순 줄 단위로 잘라 매번 1부터 렌더링하지 않는다. GFM 링크 정의 등 문서 전체 문맥이 추가되는 경우에도 내부 AST 문맥을 이용하고 전체 파일의 링크 색인을 공유한다.

## 8. Interactive 선언과 React 연결

현재 문법은 모두 단독 줄의 self-closing 태그이며 Interactive에는 `type` 속성만 있다.

```html
<interactive type="cmos-inverter" />
```

```ts
interface InteractiveDeclaration {
  instanceId: string;
  documentId: ContentId; // Lesson 외 Supplement·Review도 허용
  type: string;         // component registry key, 소문자 kebab-case
  attributes: Record<string, string>; // 검증·보존용, 임의 props로 spread하지 않음
  original: MarkdownFragment;
}
```

`type`은 전역 유일 인스턴스 ID가 아니다. `wafer-die-transistor`, `half-adder`, `sram-cell`, `die-floorplan`, `feol-mol-beol`, `pad-bump-package-pcb`, `chiplet-package`가 각각 두 문서에서 재사용된다. m00-l04는 `mosfet-channel`과 `mos-capacitor` 두 종류를 서로 다른 위치에 사용한다.

향후 React registry는 명시적으로 등록한 `type → component` 매핑만 가진다. parser는 registry를 import하지 않는다. UI는 선언과 documentId·instanceId를 해당 component에 전달한다. type에서 임의 파일 경로를 구성해 동적 import하거나 Markdown을 JSX로 실행하지 않는다.

현재 알려진 type이 53개여도 앱 모델을 53종 props union으로 만들 필요는 없다. type은 문자열로 두고, registry가 구현된 종류를 명시한다. 새 type이 추가되면 parser 구조는 유지되고 필요한 component 등록만 추가한다. **등록되지 않은 type은 경고 및 설명 fallback**이며 본문·Quiz 접근 오류가 아니다. 현재 type만으로 범위·슬라이더 설정 같은 동작 사양을 정확히 알 수 없으므로 parser가 교육적 의미나 숫자 props를 만들어내지 않는다.

fallback은 “이 도식은 아직 준비 중입니다”와 안전하게 표시한 type, 필요하면 주변 설명으로 구성할 수 있다. 인접 ASCII·원문 설명을 유지한다. component 내부 입력값과 애니메이션 상태는 UI 임시 상태이며 콘텐츠나 학습 완료 조건에 기록하지 않는다.

### 현재 type 목록

각 행은 그 모듈에서 처음 등장한 type이다. 재사용 type은 위 설명과 visual_map에서 확인할 수 있다. 이 표는 조사 기록이며 실제 registry를 수동 동기화하는 별도 원본이 아니다.

| 첫 등장 | type |
|---|---|
| m00 | wafer-die-transistor, voltage-current, rc-coupling, mosfet-channel, mos-capacitor, np-doping |
| m01 | nmos-pmos-channel, cmos-inverter, nand-nor, half-adder, full-adder, flipflop-register, sram-cell |
| m02 | die-floorplan, feol-mol-beol, signal-clock-pdn, pad-bump-package-pcb, chiplet-package, wafer-shot-reticle |
| m03 | process-overview, photo-pattern-transfer, etch-profile, deposition-conformality, dual-damascene, cmp, implant-profile, thermal-process, clean, process-integration-review |
| m04 | cpu-instruction-cycle, cpu-gpu-parallelism, npu-mac-dataflow, soc-block-map, memory-cell-comparison, memory-hierarchy-bottleneck |
| m05 | ppa-tradeoff, finfet-gaa, photo-etch-pattern-transfer, backside-power-delivery |
| m06 | tsv-bonding, package-yield-path |
| m07 | hbm-bandwidth, hbm-stack, hbm-capacity-vs-bandwidth, hbm-test-thermal |
| m08 | semiconductor-ecosystem, pdk-eda-ip, design-to-silicon, yield-capacity-cost |
| m09 | technology-maturity-map, high-na-process-window, hbm-spec-reader, chiplet-interoperability |

## 9. Visual placeholder

```html
<visual-needed id="visual-001" type="reference-structure" description="..." />
<visual-needed type="original-image" description="RC 회로" />
<visual-needed type="cross-section" description="..." />
```

```ts
interface VisualPlaceholder {
  instanceId: string;
  documentId: ContentId;
  sourceId?: string; // 원문의 visual-001 등을 보존
  type: string;
  description: string;
  attributes: Record<string, string>;
  original: MarkdownFragment;
}
```

실제 58개 중 47개는 `id="visual-NNN" type="reference-structure"`다. 나머지 11개는 ID가 없다. `original-image` 2개, `cross-section` 4개, `process-diagram`, `package-cross-section`, `packaging-dimensions`, `stack-cross-section`, `comparison` 각각 1개다. sourceId 유무로 필수 여부를 나누지 않는다.

모든 태그의 type과 description을 읽고 원문에 id가 있으면 보존한다. `visual_map.md`의 visual-001~047은 이 sourceId로 추적 가능하지만 58개 전체의 자산 manifest는 아니다. 특히 m00-l03의 이미지 출처 URL 두 개는 태그 속성이 아닌 인접한 일반 링크다. 그 링크를 이미지 src로 자동 변환하거나 재다운로드하지 않는다.

현재 자산 파일은 동봉되어 있지 않다. 기본 출력은 description이 보이는 placeholder다. 나중에 실제 이미지가 준비되면 UI 쪽의 작은 자산 매핑에서 sourceId 또는 revision을 고려한 instanceId로 연결할 수 있다. 원본 슬롯의 설명·위치가 기준이며 이미지 주소를 parser가 추정하지 않는다. 가까이 있는 Interactive와 Visual도 서로 다른 선언으로 남긴다.

## 10. Custom syntax와 Markdown 처리

순서는 **frontmatter 분리 → GFM·수식을 이해하는 Markdown AST → 선언 태그 및 Quiz 구조 추출 → 검증된 앱 데이터**다. Markdown 전체를 정규식 치환하여 HTML로 만드는 방식은 쓰지 않는다. 단순 표기 매칭은 AST가 구분한 문단·태그 영역 내부에서만 사용한다.

| 실제 표현 | 처리 |
|---|---|
| GFM 표·정렬, 목록, 인용, 강조, inline code | 일반 Markdown으로 유지 |
| 줄 끝 두 공백 | hard break 보존. A/B 선택지 분리에 영향 |
| `text` fenced block 508개 | ASCII 도식 그대로 보존. 그림으로 자동 변환하거나 공백을 trim하지 않음 |
| `$V_{th}$` | inline math. m00-l04의 제목 안에도 있음 |
| `$$ ... $$` 3개 | block math. m00-l03 2개, m00-review 1개 |
| 유니코드 아래첨자·위첨자, 화살표, `①`, 이모지 | 일반 텍스트. 임의 제어문으로 사용하지 않음 |
| `편집 보완`, `편집 정정` 인용문 | 교육 본문의 일부. 제거·자동 재작성 금지 |
| 반복되는 `수업 중 추가 설명 — 필요할 때 이어 읽기` | 일반 heading. 별도 Lesson으로 분리하지 않음 |
| 단독 `<interactive ... />`, `<visual-needed ... />` | 정의한 typed block으로 변환 |
| README 코드 블록 안의 태그 예시 | 코드로 표시. 실제 슬롯 생성 금지 |
| 링크·inline code·ASCII 안의 `<...>` | 실행 태그로 인식하지 않음 |

태그 속성은 따옴표가 있는 문자열로 읽고 XML/HTML 문자 참조를 한 번 디코딩한다. 원본 태그는 따로 보존한다. 현재 태그는 double quote를 사용한다. 구현 시 single quote, 속성 순서 변화·공백·줄바꿈도 지원하되 임의 표현식 `{...}`, 이벤트 속성, 중첩 JSX는 허용하지 않는다. 중복 속성·닫히지 않은 따옴표·필수 속성 누락은 명확한 진단 대상이다.

새 custom tag나 알 수 없는 속성은 원문과 경고를 남기고 안전한 텍스트로 보여준다. 의미를 추정해 알려진 type으로 바꾸지 않는다. Inline unknown HTML은 부모 Markdown 노드 안에서 escape하고 링크를 보존한다. standalone unknown HTML은 unsupported-directive 블록으로 표현할 수 있다. HTML 실행과 `dangerouslySetInnerHTML`을 기본 경로로 삼지 않는다.

실제 특이 표기는 [m01-l05](../content/module-01-cmos/lesson-05.md)의 다음 링크다.

```md
[<visual_element id="e1">](https://www.ece.uvic.ca/~fayez/courses/ceng465/lab_465/project1/adders.pdf?utm_source=chatgpt.com)
```

이는 유일하게 남은 `visual_element` 표기이며 닫는 태그도 없다. `interactive`나 `visual-needed`로 변환하지 않는다. 링크 label의 태그 문자열을 escape하여 표시하고 원래 PDF 링크를 유지한다. `LEGACY_INLINE_TAG` 경고를 내되 문서 전체를 실패시키지 않는다. 단순 raw HTML 제거는 이 링크를 빈 label로 만들 수 있으므로 회귀 검증이 필요하다. supplement-floorplan의 `<--------- 아주 긴 배선 --------->`는 fenced ASCII이며 태그가 아니다.

현재 `:::...`, MDX import/export, 별도의 quiz directive, 실행 코드는 발견하지 않았다. 미래 가능성만으로 플러그인 DSL을 새로 설계하지 않는다.

링크의 원래 href·fragment를 보존한다. 상대 `.md`는 idByPath로 콘텐츠 ID를 해결하고 향후 라우터가 URL을 만든다. 확장자만 `.md`에서 제거하는 치환은 쓰지 않는다. 내부 heading fragment는 동일한 heading 규칙으로 검사한다. HTTP(S) 출처 링크는 외부 링크로 남기고 내용 파싱 과정에서 요청하지 않는다. 유해한 URL scheme은 renderer에서 차단하고 진단한다.

## 11. 사용자 학습 상태의 분리

완료·답안·점수·최근 위치는 `ContentCatalog`에 넣지 않는다. `locked`, `unlocked`, `prerequisites`, 합격 점수에 따른 다음 Lesson 활성화 같은 필드를 만들지 않는다. Module·Lesson·Review·Supplement는 첫 실행부터 모두 접근 가능하다. Quiz 해설을 읽거나 도식을 조작하지 않아도 다른 자료를 열 수 있다.

초기에는 브라우저 localStorage에 별도 버전의 상태만 저장하면 충분하다. 서버, 계정, CMS는 필요 없다. 저장 불가나 손상 시 빈 상태로 계속 학습할 수 있게 하고 콘텐츠 로딩을 실패시키지 않는다.

```ts
interface CompletionRecord {
  completedAt: string; // 사용자 행동 시각, ISO timestamp
  contentRevision: string;
}
interface LearningProgress {
  version: 1;
  completedById: Record<ContentId, CompletionRecord>; // 없으면 미완료
  lastVisitedId?: ContentId;
}
interface QuizAttempt {
  questionId: string;
  documentId: ContentId;
  contentRevision: string;
  response: string; // 선택지 ID 또는 입력 답안
  submittedAt: string;
}
```

첫 구현에서 답안·점수 영구 저장은 필수가 아니다. 필요해지면 위와 같은 별도 상태에 추가한다. 정답을 보았다는 이유나 퀴즈 점수를 이유로 완료를 자동 강제하지 않는다. 완료 표시는 사용자의 명시적 행동으로 기록하고 취소할 수 있다.

Module 완료율은 현재 `lessonIds`에 있는 정규 Lesson 중 완료된 수로 계산한다. Review 완료·보충 완료는 각각 따로 표시하고 정규 분모에 섞지 않는다. Module 자체의 중복 완료 boolean을 저장하지 않는다. 향후 Lesson이 추가되면 분모가 늘지만 기존 완료 기록은 유지한다.

같은 ID의 원문 revision이 바뀌어도 과거 완료를 삭제하지 않는다. 필요하면 “완료 후 내용 변경”을 파생 표시한다. QuizAttempt는 revision이 다르면 이전 판의 기록으로 취급하고 새 문항의 답으로 복원하지 않는다. 삭제된 ID 기록은 현재 완료율에서 제외하며 다른 ID에 자동 재할당하지 않는다. 표시 제목·경로를 바꿔도 ID가 같으면 완료 기록은 이어진다.

## 12. 향후 parser 입력·출력과 로딩 경계

현재 약 671KiB의 원본을 매번 브라우저에서 YAML 파싱할 이유는 없다. **개발/빌드 시 Node 환경에서 한 번 읽고 검증한 정적 JSON을 생성**하는 구조를 기본으로 한다. backend API나 데이터베이스 없이 정적 호스팅으로 사용할 수 있다. 프로젝트 도구가 아직 없으므로 특정 bundler 전용 glob API에 parser를 결합하지 않는다.

```text
content/curriculum.yaml + 등록 Markdown + 보조 Markdown
  → 파일 읽기 adapter (UTF-8, 경로, 원본 해시)
  → 순수 parser (YAML/frontmatter + Markdown AST + Quiz/directives)
  → 교차 validation
  → Typed ContentCatalog
  → 빌드용 index.json + documents/<id>.json
  → 향후 React loader → Markdown / Quiz / Interactive / Visual UI

별도 LearningProgress → UI의 완료 표시 (위 파이프라인에 역류하지 않음)
```

```ts
interface SourceInput {
  path: ContentPath;
  text: string;       // UTF-8 해독 결과
  byteHash: string;   // 파일 읽기 adapter가 계산
}
interface ParseInput {
  curriculum: SourceInput;
  markdownFiles: SourceInput[];
}
interface Diagnostic {
  severity: 'error' | 'warning';
  code: string;
  message: string;
  path: ContentPath;
  source?: SourceSpan;
  related?: SourceSpan[];
}
type ParseResult =
  | { ok: true; data: ContentCatalog; diagnostics: Diagnostic[] }
  | { ok: false; diagnostics: Diagnostic[] }; // 정상 산출물과 부분 실패를 혼합하지 않음
```

권장 절차는 다음과 같다.

1. curriculum.yaml을 읽어 버전을 검증하고 등록 경로·종류·소속을 모은다. `content/` 파일 목록도 조사해 누락·미등록 자료를 진단한다.
2. 78개 등록 Markdown 및 4개 보조 문서를 읽는다. 보조 파일을 Lesson으로 오인하지 않는다. 새 학습 파일이 아직 YAML에 없으면 자동으로 정규 목차에 끼워 넣지 않고 미등록 오류를 보고한다.
3. frontmatter와 본문을 분리하고 AST에서 안전한 위치만 추출한다. 파일 경로와 원문 범위·해시를 모든 단계에 연결한다.
4. 문서별 blocks·quizzes·headings를 생성한 뒤, ID/경로/소속/중복 메타데이터/링크를 전역 대조한다. 순수 parser는 filesystem이나 React를 직접 사용하지 않는다.
5. error가 없을 때만 전체 catalog를 반환한다. writer가 index와 문서 JSON을 임시 출력 위치에 모두 만든 후 한 번에 게시 가능한 산출물로 교체한다. 실패 시 일부 새 문서와 오래된 index가 섞인 결과를 내지 않는다.
6. index에는 과정 정보, ordered IDs, 문서 메타데이터 요약, idByPath, 생성한 문서 JSON URL·revision을 둔다. 본문은 documents/<id>.json에서 읽는다. supporting ID의 `:`는 Windows 파일명에 쓸 수 없으므로 출력 파일명은 `doc-README.json`처럼 writer가 안전하게 매핑하고 index에 명시한다. UI는 ID로 파일명을 추정하지 않는다.
7. React loader는 index를 한 번 가져오고 문서를 ID로 조회한다. 문서 cache key는 ID+revision, index cache key는 sourceDigest로 둔다. 캐시는 로딩 최적화이며 접근 제한이 아니다. 모델 버전·document ID·revision을 응답에서 확인한다.
8. index 오류는 전체 목차 로딩 오류, 개별 문서 네트워크 오류는 그 문서의 재시도 상태로 표시한다. 다른 문서 링크를 잠그지 않는다. 미지원 Interactive 또는 Quiz 변환 경고는 원문 fallback으로 계속 읽는다.

정적 JSON은 직접 편집하지 않으며 `.generated/content/` 같은 폴더에서 재생성한다. 배포용 복사는 향후 bundler의 static asset 경로로 연결한다. 개발 시 content 변경을 감지하면 전체를 재생성해도 현재 크기에서 충분히 단순하다. 처음부터 증분 dependency graph, 검색 서버, 쿼리 API, 실시간 편집 시스템을 만들지 않는다.

추후 파서 라이브러리를 선택할 때 필요한 기능은 안전한 YAML, 위치 정보를 가진 Markdown AST, GFM, math 지원이다. MDX 컴파일러는 필요하지 않다. 구체적 패키지·버전 결정과 설치는 다음 구현 단계의 별도 작업이다.

## 13. Validation와 구현 완료 기준

| 수준 | 검증 항목 | 실패 처리 |
|---|---|---|
| error | 지원하지 않는 schema_version, 잘못된 YAML, 중복 키 | 정식 생성 중단 |
| error | 필수 frontmatter 누락·잘못된 타입·kind, 날짜 형식·유효성 | 파일·필드 위치 보고 |
| error | ID 중복, 파일 누락, 경로 탈출·충돌, 미등록 학습 Markdown | 목차/파일 양쪽 위치 보고 |
| error | YAML과 Markdown의 ID·제목·시간·Module 번호·설명 불일치 | 자동 교정 금지 |
| error | module_id·kind·lesson_number와 소속/파일 번호 불일치 | original_label은 비교 대상에서 제외 |
| error | 모듈 내 Lesson 번호 중복, Review 소속 오류 | 번호의 무조건 연속성은 요구하지 않음 |
| error | 명백하게 깨진 알려진 directive, type/description 누락 | 개발 원문 fallback, 정식 생성 중단 |
| error | 중복 visual sourceId, 중복 인스턴스/문항 ID | type 재사용은 허용 |
| error | typed Quiz의 중복 번호·없는 선택지 정답·해설 매핑 오류 | 잘못된 채점 데이터를 배포하지 않음 |
| warning | Quiz 패턴 미인식 또는 채점 불확실 | 전체 해당 Quiz 원문 유지, self-check/fallback |
| warning | 신규 메타데이터 키·미지원 태그/type·legacy inline tag | 원문 보존, 안전한 표시 |
| error | 내부 .md 링크 대상 없음, 경로 대소문자 오류 | 링크를 추정 수정하지 않음 |
| warning | 없는 heading fragment, 참고 map과 본문 불일치 | 파일은 유지하고 위치 보고 |
| warning | time_sensitive=true인데 시점 필드 부족, 점검일 경과 | 공개·학습 접근 유지 |
| error | AST 분할 후 본문 유실·중복·범위 겹침 | 원문 보존 계약 위반 |

빈 description/type과 잘못된 kebab-case를 검사한다. Optional 속성의 알 수 없는 값은 먼저 보존하고 명확한 지원 규칙 없이 component props로 넘기지 않는다. 원본에 개인 점수·완료·잠금 같은 메타데이터가 추가되면 금지된 상태 필드로 보고한다. 본문의 “스위치 ON/OFF”나 “Cell을 닫아둔다”를 접근 잠금으로 오인해서는 안 된다.

현재 조사에서 확인한 것은 파일·메타데이터 일치와 실제 syntax다. 향후 AST parser의 동작이나 Quiz 추출 정확성을 이미 검증했다고 주장하지 않는다. 구현 단계에는 다음 원본 파일을 직접 fixture로 쓰는 의미 있는 검증이 필요하다.

- 83개 전체 입력에서 10 Module, 53 Lesson, 10 Review, 5 Supplement, 4 supporting이 생성되고 목차 순서가 같아야 한다.
- 현재 슬롯 60 Interactive/53 type, 58 Visual/47 sourceId, ASCII code block 508개와 수식이 보존되어야 한다. 이 수는 현재 fixture 기준이며 미래 콘텐츠 증가를 막는 일반 schema 제약이 아니다.
- m00-l01(Q heading·서술형·분리 답), m00-l02(부분 bold Q), m01-l01(Q→번호 해설), m01-l02(즉시 답), m02-l06(질문 안 코드), m03-l03(혼합·중복 해설), m03-l08(4문항), m03-l09(O/X), m04-l01(번호 목록), 10개 Review와 5개 supplement를 대조한다.
- m01-l05의 정규 Quiz 3개와 누적 reflection 1개를 구분하고 legacy 링크가 빈 label이나 새 도식으로 변하지 않아야 한다.
- 모든 문서에서 블록 원문 재조합 결과가 정규화한 본문과 같고, 질문·정답이 한 번씩 해당 위치에 나타나야 한다. 명시적으로 알려진 현재 Quiz를 fallback에만 남긴 상태로 완료 처리하지 않는다. 모호한 일반 연습 문장은 Markdown으로 유지한다.
- README 코드 예시는 슬롯이 아니어야 한다. 가짜 태그가 든 코드·알 수 없는 태그·닫히지 않은 속성·중복 ID·경로 탈출·정답 누락·선택지 불일치 사례도 검증한다.
- content 전체 해시를 작업 전후 비교해 source 변경이 없어야 한다. 같은 입력·parser 버전에서 동일 산출물을 만들어야 한다. 빌드 시각 같은 비결정적 값은 필수 산출물에 넣지 않는다.
- 완료 데이터가 없거나 손상됐거나 Quiz 답안이 없어도 모든 문서 ID를 조회할 수 있어야 한다. 콘텐츠 revision 변경 시 과거 답안을 새 문항에 잘못 연결하지 않아야 한다.

## 14. 발견한 예외·불일치와 처리 결정

| 발견 사항 | 실제 위치 | 결정 |
|---|---|---|
| YAML↔frontmatter 공유 값·경로·ID | 전체 78개 | 현재 불일치 없음. 이후에도 교차 검증 |
| metadata 제목과 화면 제목 구조가 다름 | m00-l01의 H1은 `Module 0 / Lesson 1`, 실제 주제는 H2; m01-l01은 `Lesson 1. NMOS와 PMOS` | H1을 canonical title로 추정하지 않음 |
| 보충 원래 번호가 현재 정규 주제와 충돌 | m02-s-feol-beol의 original_label은 Lesson 2지만 관련 정규는 l03; floorplan은 원래 Lesson 3, 관련 정규는 l02 | original_label은 출처 문자열. 현재 소속·이동 규칙으로 사용 금지 |
| wafer-shot의 관련 정규 링크가 l06(Chiplet) | m02-s-wafer-shot, m02-l06 | 파일은 존재함. 번호 충돌 맥락의 원문 연결을 보존하며 동등 주제 관계로 추론하지 않음 |
| 누락 원문을 보완한 Review | m03-review | kind=review, origin=new_supplement를 독립적으로 유지 |
| 정답이 두 위치에 존재 | m03-l03/l04/l05/l07/l08/l09 | 중복 삭제 없이 한 질문의 여러 answer 위치로 연결 |
| Quiz·Review 문항 수가 일정하지 않음 | m03-l08, 모든 Review | 3개 고정 배열·고정 정답 개수 금지 |
| 번호 없는 누적 질문 | m01-l05 | 정규 Quiz와 분리된 reflection |
| 같은 추가 설명 제목 반복, 동급 소제목 아래 긴 설명 | m00-l03/l04, m01-l01, m03-l02 등 | 확장 설명을 제목 한 번으로 잘라 버리지 않음. anchor 중복 처리 |
| visual_map은 전체 이미지 자산 목록이 아님 | visual-001~047 표와 실제 58개 태그 | runtime 슬롯은 본문에서 추출 |
| 이미지 원본 URL이 태그 밖에 있음 | m00-l03 | 일반 출처 링크로 보존, src 추론 금지 |
| 설명은 있으나 실제 이미지 없음 | content 전체 | placeholder가 정상 상태 |
| 표 안팎의 태그형 출처 잔재 | m01-l05의 `<visual_element id="e1">` 링크 | escape된 label+기존 링크, warning |
| Module 9 module.md는 시점 frontmatter가 없음 | m09 | Lesson/Review의 시점 메타데이터를 Module 필수로 강제하지 않음 |
| 일부 외부 출처가 본문에만 있음 | Module 4~9의 `사실 확인 자료` | source_url을 필수화하거나 웹에서 메타데이터를 새로 만들지 않음 |

`source_map.md`의 SHA-256은 대표 **원문 메시지 텍스트**의 지문이다. 앱의 파일 revision으로 복사하지 않고 실제 Markdown 바이트에서 계산한다. `quality_review.md`의 과거 “검사 완료” 기록도 다음 parser의 테스트 결과를 대체하지 않는다.

## 15. 다음 구현 단계의 최소 파일 구조

아래는 앞으로 만들 파일의 제안이며 이번에는 생성하지 않는다. 먼저 데이터 계층까지만 구현하고 UI는 그 출력 계약 위에 별도 작업한다.

```text
content/                         기존 원본 유지
docs/content-architecture.md     이 설계
src/content/
  types.ts                       공개 데이터 계약
  parse.ts                       순수 파이프라인·frontmatter·Markdown 처리
  quiz.ts                        기존 Quiz 표현 인식과 답 연결
  directives.ts                  두 선언 태그 처리·원문 fallback
  validate.ts                    필드·경로·교차 참조 검증
  load.ts                        향후 UI의 index/문서 조회·캐시 경계
scripts/
  build-content.ts               Node 파일 읽기·해시·parser 호출·JSON 출력
tests/
  content.test.ts                현재 원본 전체 및 위 예외 회귀 검증
.generated/content/              자동 생성, 수동 편집 금지
  index.json
  documents/*.json
```

처음에는 metadata parser를 별도 파일로 더 쪼개지 않아도 된다. 복잡해지면 parse.ts의 내부 책임만 분리한다. 테스트를 위해 전체 교재를 fixtures에 복사하지 않는다. 기존 content를 직접 읽고 실패용 작은 입력만 테스트 내부에 둔다.

React UI 단계에서 필요한 최소 경계는 `ContentRenderer`, `QuizQuestion`/`QuizAnswer`(또는 한 Quiz component의 표시 모드), `InteractiveSlot`과 명시적 registry, `VisualPlaceholder`, 별도 progress 저장 모듈이다. React 파일 경로·라우팅·스타일·도식 개별 구현은 데이터 계층 검증 후 정한다. 이 문서는 이 component들의 지금 구현을 요구하지 않는다.

## 다음 단계에서 구현해야 할 항목

SOL 모델에게는 이 문서와 실제 `content/`를 함께 전달한다.

1. 원본을 수정하지 않는 TypeScript 데이터 계약과 Node 빌드 입력 adapter를 만든다.
2. YAML/frontmatter, GFM·수식, 기존 Quiz와 두 directive를 파싱하고 원문 범위·fallback을 보존한다.
3. 목차·메타데이터·ID·링크 검증과 현재 전체 콘텐츠/예외 회귀 검증을 통과시킨다.
4. 정적 index·문서 JSON 생성 및 조회 API를 만든다. UI는 그 뒤 단계로 진행한다.
5. UI 구현 시 모든 문서를 항상 공개하고, 완료 상태·답안은 콘텐츠와 분리한다.
