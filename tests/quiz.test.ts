import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { beforeAll, describe, expect, it } from 'vitest';
import { parseContentDirectory, parseDocumentBody, parseMarkdownSource } from '../src/content/parse.js';
import { blocksFromDirectives, extractDirectiveOccurrences } from '../src/content/directives.js';
import type { ContentBlock, ContentCatalog, Diagnostic, MarkdownFragment, SourceSpan } from '../src/content/types.js';

let catalog: ContentCatalog;
beforeAll(async () => {
  const result = await parseContentDirectory('content');
  expect(result.ok).toBe(true);
  expect(result.diagnostics).toEqual([]);
  if (!result.ok) throw new Error('Catalog did not parse');
  catalog = result.data;
});

function fragment(block: ContentBlock): MarkdownFragment {
  return block.kind === 'markdown' ? block.content :
    block.kind === 'interactive' || block.kind === 'visual' ? block.value.original : block.original;
}
function fixture(text: string, id = 'fixture') {
  const parsed = parseMarkdownSource({ path: 'fixture.md', text, revision: createHash('sha256').update(text).digest('hex') });
  if (!parsed.source) throw new Error(JSON.stringify(parsed.diagnostics));
  const diagnostics: Diagnostic[] = [];
  const body = parseDocumentBody(parsed.source, id, diagnostics);
  expect(body.blocks.map(block => fragment(block).markdown).join('')).toBe(parsed.source.body);
  return { body, diagnostics, source: parsed.source };
}
const quiz = (id: string) => catalog.documentsById[id]!.body.quizzes[0]!;

describe('actual Quiz fixtures', () => {
  it('maps conversational answer labels by number without rewriting explanations', () => {
    const { body, diagnostics } = fixture('## Quiz\n\n**Q1. 첫 질문?**\n\n**Q2. 둘째 질문?**\n\n## 정답과 해설\n\n**Q2**\n\n둘째 해설이야.\n\n**Q1**\n\n첫 해설이야.\n');
    expect(diagnostics).toEqual([]);
    expect(body.quizzes[0]!.questions.map(question => question.answers[0]!.content.markdown))
      .toEqual(['**Q1**\n\n첫 해설이야.', '**Q2**\n\n둘째 해설이야.']);
  });
  it('matches the complete researched inventory without a schema question-count limit', () => {
    const groups = Object.values(catalog.documentsById).flatMap(document => document.body.quizzes);
    const questions = groups.flatMap(group => group.questions);
    expect(groups).toHaveLength(69);
    expect(groups.filter(group => group.status === 'structured')).toHaveLength(69);
    expect(groups.filter(group => group.status === 'unparsed')).toHaveLength(0);
    expect(questions).toHaveLength(244);
    expect(questions.filter(question => question.responseKind === 'single-choice')).toHaveLength(98);
    expect(questions.filter(question => question.responseKind === 'free-response')).toHaveLength(145);
    expect(questions.filter(question => question.responseKind === 'ox')).toHaveLength(1);
    expect(groups.filter(group => group.category === 'reflection')).toHaveLength(1);
    for (const document of Object.values(catalog.documentsById)) {
      if (document.kind === 'lesson') expect(document.body.quizzes[0]?.questions).toHaveLength(document.id === 'm03-l08' ? 4 : 3);
    }
  });

  it.each([8, 8, 4, 10, 7, 6, 6, 6, 6, 7].map((count, index) => [index, count]))(
    'Module %i Review has %i cumulative questions', (index, count) => {
      const group = quiz(`m${String(index).padStart(2, '0')}-review`);
      expect(group.category).toBe('cumulative');
      expect(group.questions).toHaveLength(count!);
      expect(group.questions.every(question => question.answers.length > 0)).toBe(true);
    },
  );
  it.each(['m01-s-half-adder', 'm01-s-sram', 'm02-s-feol-beol', 'm02-s-floorplan', 'm02-s-wafer-shot'])(
    '%s retains three supplement questions and their delayed answers', id => {
      const group = quiz(id);
      expect(group.questions).toHaveLength(3);
      for (const question of group.questions) {
        expect(question.answers).toHaveLength(1);
        expect(question.answers[0]!.content.markdown).toContain(`**${question.sourceLabel} →`);
        expect(question.answers[0]!.content.source.start).toBeGreaterThan(group.questions.at(-1)!.source.end);
      }
    },
  );
  it('m00-l01 preserves heading questions, distant answers and the free-response prompt', () => {
    const questions = quiz('m00-l01').questions;
    expect(questions[0]!.prompt.markdown).toContain('### Q1.');
    expect(questions[0]!.options.map(option => option.id)).toEqual(['A', 'B', 'C', 'D']);
    expect(questions[0]!.grading).toEqual({ kind: 'single-choice', correctOptionId: 'B' });
    expect(questions[2]!.responseKind).toBe('free-response');
    expect(questions[2]!.grading).toEqual({ kind: 'self-check' });
    expect(questions[2]!.answers[0]!.content.markdown).toContain('하나의 완성된 IC 회로 조각');
  });
  it('m00-l02 and m01-l02 split bold prompts and hard-break options without merging answers', () => {
    for (const id of ['m00-l02', 'm01-l02']) {
      const questions = quiz(id).questions;
      expect(questions[0]!.prompt.markdown).toContain('**Q1.');
      expect(questions[0]!.prompt.markdown).not.toContain('A.');
      expect(questions[0]!.options[0]!.content.markdown).toMatch(/^A\./);
      expect(questions.every(question => question.answers.length === 1)).toBe(true);
    }
    const questions = quiz('m01-l02').questions;
    expect(questions[0]!.answers[0]!.content.source.end).toBeLessThan(questions[1]!.source.start);
  });
  it('m01-l01 maps numbered explanations to bold questions using their numbers', () => {
    expect(quiz('m01-l01').questions.map(question => question.grading)).toEqual(
      ['A', 'B', 'C'].map(correctOptionId => ({ kind: 'single-choice', correctOptionId })),
    );
    expect(quiz('m01-l01').questions[0]!.answers[0]!.content.markdown).toMatch(/^1\. \*\*A\./);
  });
  it('m01-l05 has a separate reflection and preserves the legacy visual link', () => {
    const document = catalog.documentsById['m01-l05']!;
    expect(document.body.quizzes.map(group => [group.category, group.questions.length])).toEqual([
      ['practice', 3], ['reflection', 1],
    ]);
    expect(document.body.quizzes[1]!.questions[0]!.answers[0]!.content.markdown).toContain('높은 전압 범위');
    expect(document.body.blocks.some(block => block.kind === 'markdown' && block.content.markdown.includes('[<visual_element id="e1">]('))).toBe(true);
  });
  it('m02-l06 keeps the ASCII diagram inside question 3', () => {
    const question = quiz('m02-l06').questions[2]!;
    expect(question.prompt.markdown).toContain('```text');
    expect(question.prompt.markdown).toContain('[I/O Die]');
    expect(question.options).toHaveLength(3);
  });
  it('m03-l03 keeps immediate answers and additional explanations in source order', () => {
    const questions = quiz('m03-l03').questions;
    expect(questions.map(question => question.responseKind)).toEqual(['free-response', 'single-choice', 'free-response']);
    for (const question of questions) {
      expect(question.answers.map(answer => answer.role)).toEqual(['answer', 'explanation']);
      expect(question.answers[0]!.content.source.end).toBeLessThan(question.answers[1]!.content.source.start);
    }
    expect(questions[1]!.answers[0]!.content.markdown).toBe('→ **B**');
    expect(questions[1]!.answers[1]!.content.markdown).toContain('B야.');
    expect(questions[1]!.grading).toEqual({ kind: 'single-choice', correctOptionId: 'B' });
  });
  it('m03-l08 has four questions and m03-l09 has an explicit O/X question', () => {
    expect(quiz('m03-l08').questions).toHaveLength(4);
    expect(quiz('m03-l08').questions.every(question => question.answers.length === 2)).toBe(true);
    expect(quiz('m03-l09').questions[2]!.grading).toEqual({ kind: 'ox', correct: 'X' });
    expect(quiz('m03-l09').questions[2]!.responseKind).toBe('ox');
  });
  it('m04-l01 keeps numbered questions as self-check responses', () => {
    const questions = quiz('m04-l01').questions;
    expect(questions.map(question => question.sourceLabel)).toEqual(['Q1', 'Q2', 'Q3']);
    expect(questions.every(question => question.grading.kind === 'self-check')).toBe(true);
  });
  it('does not truncate the actual 다음 연결 순서 questions as navigation', () => {
    for (const id of ['m02-l05', 'm02-review']) {
      expect(quiz(id).questions[2]!.prompt.markdown).toContain('다음 연결 순서');
    }
  });
  it('preserves every source substring, block reconstruction, ID, and directive declaration', async () => {
    for (const document of Object.values(catalog.documentsById)) {
      const raw = await readFile(`content/${document.path}`, 'utf8');
      const parsed = parseMarkdownSource({ path: document.path, text: raw, revision: document.revision });
      const source = parsed.source!;
      const checkSpan = (span: SourceSpan) => {
        expect(span.path).toBe(document.path);
        expect(span.start).toBeGreaterThanOrEqual(source.bodyStart);
        expect(span.end).toBeLessThanOrEqual(source.normalizedText.length);
        expect(span.end).toBeGreaterThanOrEqual(span.start);
        expect(span.startLine).toBe(source.normalizedText.slice(0, span.start).split('\n').length);
        expect(span.endLine).toBe(source.normalizedText.slice(0, span.end > span.start ? span.end - 1 : span.end).split('\n').length);
      };
      const checkFragment = (part: MarkdownFragment) => {
        checkSpan(part.source);
        expect(source.normalizedText.slice(part.source.start, part.source.end)).toBe(part.markdown);
      };
      expect(document.body.blocks.map(block => fragment(block).markdown).join('')).toBe(source.body);
      for (const block of document.body.blocks) checkFragment(fragment(block));
      for (const [groupIndex, group] of document.body.quizzes.entries()) {
        expect(group.id).toBe(`${document.id}:quiz:${groupIndex + 1}`);
        checkFragment(group.title);
        group.sourceRanges.forEach(checkSpan);
        for (const [index, question] of group.questions.entries()) {
          expect(question.id).toBe(`${group.id}:q${index + 1}`);
          checkSpan(question.source); checkFragment(question.prompt);
          question.options.forEach(option => checkFragment(option.content));
          question.answers.forEach((answer, answerIndex) => {
            expect(answer.id).toBe(`${question.id}:answer:${answerIndex + 1}`);
            checkFragment(answer.content);
          });
          expect(document.body.blocks.some(block => block.kind === 'quiz-question' && block.questionId === question.id)).toBe(true);
          for (const answer of question.answers) expect(document.body.blocks.some(block => block.kind === 'quiz-answer' && block.answerId === answer.id)).toBe(true);
        }
      }
      const before = blocksFromDirectives(source, extractDirectiveOccurrences(document.id, source, source.tree, []))
        .filter(block => block.kind !== 'markdown');
      const after = document.body.blocks.filter(block => ['interactive', 'visual', 'unsupported-directive'].includes(block.kind));
      expect(after).toEqual(before);
    }
  }, 15_000);
});

describe('conservative Quiz boundaries and fallback', () => {
  it('ignores ordinary questions, numbered exercises, code and supporting examples', () => {
    const text = '# 연결 연습\n\n1. 직접 설명해보자\n2. A.는 무엇인가?\n\n**Q1. 일반 질문**\n\n```md\n## Quiz\n### Q1\n```\n';
    expect(fixture(text).body.quizzes).toEqual([]);
    expect(fixture('## Quiz\n\n1. 예시\n\n## 정답\n\n1. 예시 답', 'doc:README').body.quizzes).toEqual([]);
  });
  it('keeps code and inline code markers as question content instead of options or answers', () => {
    const text = '## Quiz\n\n### Q1\n다음 코드 설명은?\n\n```text\nQ2 → B\nA. fake\n```\n\n`→ B`\n\n**정답: 코드 예시**';
    const result = fixture(text);
    expect(result.diagnostics).toEqual([]);
    expect(result.body.quizzes[0]!.questions).toHaveLength(1);
    expect(result.body.quizzes[0]!.questions[0]!.options).toEqual([]);
    expect(result.body.quizzes[0]!.questions[0]!.prompt.markdown).toContain('Q2 → B');
  });
  it.each([
    '## Quiz\n\n표현을 해석할 수 없음',
    '## Quiz\n\n### Q1\n질문만 있음',
    '## Quiz\n\n### Q1\n질문\n\n## 정답\n\n**Q9 → B**',
    '## Quiz\n\n**Q1. 질문**\n\n**정답: A**\n\n**Q2) 알 수 없는 문법**',
    '## Quiz\n\n### Q1\n질문\n\nA. 하나\n추가 선택지 설명\nB. 둘\n\n**정답: A**',
  ])('falls back as a whole group for unsupported or incomplete structure: %s', text => {
    const result = fixture(text);
    expect(result.body.quizzes[0]!.status).toBe('unparsed');
    expect(result.body.quizzes[0]!.questions).toEqual([]);
    expect(result.diagnostics).toEqual([expect.objectContaining({ severity: 'warning', code: 'UNPARSED_QUIZ' })]);
    expect(result.body.blocks.every(block => block.kind === 'markdown')).toBe(true);
  });
  it.each(['B야', '맞다', 'C', 'A 또는 B'])('does not infer a choice from ambiguous answer %s', answer => {
    const result = fixture(`## Quiz\n\n### Q1\n질문\n\nA. 하나\nB. 둘\n\n**정답: ${answer}**`);
    expect(result.body.quizzes[0]!.questions[0]!.grading).toEqual({ kind: 'self-check' });
  });
  it('does not infer O/X from an ordinary yes/no question', () => {
    const result = fixture('## Quiz\n\n**Q1. 맞는가?**\n\n→ **X.**');
    expect(result.body.quizzes[0]!.questions[0]!.responseKind).toBe('free-response');
  });
  it('uses literal answer numbers even when an ordered list presents them out of order', () => {
    const result = fixture('## Quiz\n\n1. 첫 질문\n2. 둘째 질문\n\n## 정답\n\n2. 둘째 답\n1. 첫 답');
    expect(result.diagnostics).toEqual([]);
    const questions = result.body.quizzes[0]!.questions;
    expect(questions[0]!.answers[0]!.content.markdown).toBe('1. 첫 답');
    expect(questions[1]!.answers[0]!.content.markdown).toBe('2. 둘째 답');
  });
  it('preserves directives inside a Quiz and source positions across BOM/CRLF', () => {
    const text = '\ufeff---\r\nkind: lesson\r\n---\r\n## Quiz\r\n\r\n### Q1\r\n😀 도식을 설명해봐\r\n\r\n<interactive type="future-diagram" />\r\n<visual-needed type="test" description="설명" />\r\n\r\n→ **예시 답**\r\n';
    const result = fixture(text);
    expect(result.diagnostics).toEqual([]);
    expect(result.body.quizzes[0]!.status).toBe('structured');
    expect(result.body.blocks.filter(block => block.kind === 'interactive')).toHaveLength(1);
    expect(result.body.blocks.filter(block => block.kind === 'visual')).toHaveLength(1);
    expect(result.body.quizzes[0]!.questions[0]!.source.startLine).toBe(6);
    for (const block of result.body.blocks) {
      const part = fragment(block);
      expect(result.source.normalizedText.slice(part.source.start, part.source.end)).toBe(part.markdown);
    }
  });
});
