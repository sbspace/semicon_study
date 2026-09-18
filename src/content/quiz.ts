import type { Root, RootContent, ListItem } from 'mdast';
import { toString } from 'mdast-util-to-string';
import { markdownFragment, sourceSpan, type LocatedMarkdownSource } from './locations.js';
import type { ContentBlock, Diagnostic, Quiz, QuizQuestion, QuizOption } from './types.js';

type Node = RootContent | ListItem;
type QuizBlock = Extract<ContentBlock, { kind: 'quiz-question' | 'quiz-answer' }>;
interface Unit { node: Node; start: number; end: number; text: string; number?: number }
interface Range { start: number; end: number; block: QuizBlock }
interface Draft { unit: Unit; nodes: Unit[]; answers: Unit[][] }

const answerHeading = (text: string) => /정답|해설/.test(text);
const quizHeading = (text: string) => /(?:\bquiz\b|퀴즈)/i.test(text) && !answerHeading(text);
const reflectionHeading = (text: string) => /Lesson\s+\d+\s*~\s*\d+\s+누적 체크/.test(text);
const questionLabel = (text: string) => /^Q(\d+)(?:\.(?:\s|$)|\s*$)/.exec(text);
const answerLabel = (text: string) => /^Q(\d+)\s*→/.exec(text);
const immediateAnswer = (text: string) => /^(?:정답\s*[:：]?\s*|→\s*)/.test(text);
const navigation = (text: string) => /^(?:(?:다음 수업|다음 연결|관련 원수업 보충)\s*:|다음 Module에서는)/.test(text);
const boldParagraph = (unit: Unit) => unit.node.type === 'paragraph' && unit.node.children[0]?.type === 'strong';

function units(tree: Root, source: LocatedMarkdownSource): Unit[] {
  const result: Unit[] = [];
  const add = (node: Node, number?: number) => {
    const start = node.position?.start.offset;
    const end = node.position?.end.offset;
    if (start === undefined || end === undefined) throw new Error('Missing Markdown AST position');
    result.push({ node, start, end, text: toString(node), ...(number === undefined ? {} : { number }) });
  };
  for (const node of tree.children) {
    if (node.type === 'list' && node.ordered) {
      node.children.forEach(item => {
        // mdast keeps only the list's first number. Read each item's literal
        // marker at its AST offset so reordered answer keys stay correctly linked.
        const raw = source.body.slice(item.position!.start.offset!, item.position!.end.offset!);
        const marker = /^(\d+)[.)]\s/.exec(raw);
        add(item, marker ? Number(marker[1]) : undefined);
      });
    } else add(node);
  }
  return result;
}

function optionsIn(source: LocatedMarkdownSource, nodes: Unit[]): QuizOption[] {
  const options: QuizOption[] = [];
  // Only paragraph lines inside an already identified question; code is never searched.
  for (const unit of nodes) {
    if (unit.node.type !== 'paragraph') continue;
    const raw = source.body.slice(unit.start, unit.end);
    for (const match of raw.matchAll(/^[ \t]*([A-Z])\.[ \t]+[^\n]+/gm)) {
      const label = match[1]!;
      const start = unit.start + match.index;
      // A multiline inline-code value can contain an apparent option line.
      if (unit.node.children.some(child => child.type === 'inlineCode' &&
        (child.position?.start.offset ?? Infinity) <= start &&
        (child.position?.end.offset ?? -1) > start)) continue;
      options.push({ id: label, label, content: markdownFragment(source, start, start + match[0].length) });
    }
  }
  return options;
}

function explicitAnswer(text: string): string | undefined {
  const stripped = text.replace(/^Q\d+\s*→\s*|^→\s*|^정답\s*[:：]?\s*/, '')
    .replace(/^정답\s*[:：]?\s*/, '');
  return /^([A-Z])(?=$|[.,:—–-]|[ \t]+[.,:—–-])/.exec(stripped)?.[1];
}

export function parseQuizzes(
  documentId: string,
  source: LocatedMarkdownSource,
  tree: Root,
  existingBlocks: ContentBlock[],
  diagnostics: Diagnostic[],
  documentKind?: string,
): { quizzes: Quiz[]; blocks: ContentBlock[] } {
  if (documentKind === 'supporting' || documentKind === 'module' || documentId.startsWith('doc:')) {
    return { quizzes: [], blocks: existingBlocks };
  }
  const all = units(tree, source);
  const quizzes: Quiz[] = [];
  const ranges: Range[] = [];
  for (let index = 0; index < all.length; index += 1) {
    const title = all[index]!;
    if (title.node.type !== 'heading' || (!quizHeading(title.text) && !reflectionHeading(title.text))) continue;
    const reflection = reflectionHeading(title.text);
    let endIndex = index + 1;
    for (; endIndex < all.length; endIndex += 1) {
      const unit = all[endIndex]!;
      if (unit.node.type === 'paragraph' && navigation(unit.text)) break;
      if (unit.node.type === 'heading' && !questionLabel(unit.text) && !answerHeading(unit.text)) break;
    }
    const section = all.slice(index + 1, endIndex);
    const quizId = `${documentId}:quiz:${quizzes.length + 1}`;
    const quiz: Quiz = {
      id: quizId, documentId,
      category: reflection ? 'reflection' : documentKind === 'review' ? 'cumulative' : 'practice',
      title: markdownFragment(source, title.start, title.end), status: 'unparsed',
      sourceRanges: [sourceSpan(source, title.start, section.at(-1)?.end ?? title.end)], questions: [],
    };
    const drafts: Draft[] = [];
    let current: Draft | undefined;
    let active: Unit[] | undefined;
    let inAnswers = false;
    let invalid = false;
    for (const unit of section) {
      if (unit.node.type === 'heading' && answerHeading(unit.text)) {
        inAnswers = true; active = undefined; continue;
      }
      if (unit.node.type === 'thematicBreak') { active = undefined; continue; }
      const label = boldParagraph(unit)
        ? answerLabel(unit.text) ?? (inAnswers ? /^Q(\d+)\s*$/.exec(unit.text) : null)
        : null;
      if (label || (inAnswers && unit.number !== undefined)) {
        const number = label ? Number(label[1]) : unit.number!;
        const target = drafts.find((draft) => Number(questionLabel(draft.unit.text)?.[1] ?? draft.unit.number ?? 1) === number);
        if (!target) { invalid = true; continue; }
        active = [unit]; target.answers.push(active); continue;
      }
      const isQuestion = !inAnswers && (
        ((unit.node.type === 'heading' || boldParagraph(unit)) && questionLabel(unit.text)) ||
        unit.number !== undefined ||
        (reflection && drafts.length === 0 && unit.node.type === 'paragraph' && unit.node.children[0]?.type === 'strong')
      );
      if (isQuestion) {
        current = { unit, nodes: [unit], answers: [] };
        drafts.push(current); active = current.nodes; continue;
      }
      if (!inAnswers && current && unit.node.type === 'paragraph' &&
        unit.node.children.some(child => child.type === 'strong') && immediateAnswer(unit.text)) {
        active = [unit]; current.answers.push(active); continue;
      }
      if (boldParagraph(unit) && /^Q\d+/.test(unit.text)) invalid = true;
      if (active) active.push(unit);
      else if (unit.node.type !== 'blockquote' && !/^원문에 각 문항/.test(unit.text)) invalid = true;
    }
    const localRanges: Range[] = [];
    for (const [ordinal, draft] of drafts.entries()) {
      const last = draft.nodes.at(-1)!;
      const options = optionsIn(source, draft.nodes);
      if (options.length && (options.length < 2 || new Set(options.map(option => option.id)).size !== options.length)) invalid = true;
      if (options.length) {
        // Unsupported multiline option continuations must fall back, not disappear
        // from the prompt/options model while remaining only in the original block.
        let cursor = options[0]!.content.source.start - source.bodyStart;
        for (const option of options) {
          const start = option.content.source.start - source.bodyStart;
          if (source.body.slice(cursor, start).trim()) invalid = true;
          cursor = option.content.source.end - source.bodyStart;
        }
        if (source.body.slice(cursor, last.end).trim()) invalid = true;
      }
      if (draft.answers.length === 0) invalid = true;
      const id = `${quizId}:q${ordinal + 1}`;
      const question: QuizQuestion = {
        id, ordinal: ordinal + 1,
        sourceLabel: questionLabel(draft.unit.text) ? `Q${questionLabel(draft.unit.text)![1]}` : String(draft.unit.number ?? ordinal + 1),
        responseKind: options.length ? 'single-choice' : 'free-response',
        prompt: markdownFragment(source, draft.unit.start, options[0] ? options[0].content.source.start - source.bodyStart : last.end),
        options, answers: [], grading: { kind: 'self-check' },
        source: sourceSpan(source, draft.unit.start, last.end),
      };
      localRanges.push({ start: draft.unit.start, end: last.end, block: {
        kind: 'quiz-question', quizId, questionId: id,
        original: markdownFragment(source, draft.unit.start, last.end),
      } });
      const letters: string[] = [];
      for (const [answerIndex, answerNodes] of draft.answers.entries()) {
        const first = answerNodes[0]!;
        const end = answerNodes.at(-1)!.end;
        const answerId = `${id}:answer:${answerIndex + 1}`;
        const content = markdownFragment(source, first.start, end);
        question.answers.push({ id: answerId, role: answerIndex === 0 ? 'answer' : 'explanation', content });
        const letter = explicitAnswer(first.text);
        if (letter) letters.push(letter);
        localRanges.push({ start: first.start, end, block: { kind: 'quiz-answer', quizId, questionId: id, answerId, original: content } });
      }
      const correct = letters[0];
      if (correct && letters.every(letter => letter === correct)) {
        if (options.some(option => option.id === correct)) question.grading = { kind: 'single-choice', correctOptionId: correct };
        else if (/O\s*\/\s*X/.test(question.prompt.markdown) && (correct === 'O' || correct === 'X')) {
          question.responseKind = 'ox'; question.grading = { kind: 'ox', correct };
        }
      }
      quiz.questions.push(question);
    }
    if (drafts.length === 0 || new Set(drafts.map(draft => questionLabel(draft.unit.text)?.[1] ?? draft.unit.number ?? 1)).size !== drafts.length) invalid = true;
    if (invalid) {
      quiz.questions = [];
      diagnostics.push({ severity: 'warning', code: 'UNPARSED_QUIZ', message: 'Quiz structure or answer mapping is ambiguous; complete source is preserved', path: source.path, source: quiz.sourceRanges[0]! });
    } else { quiz.status = 'structured'; ranges.push(...localRanges); }
    quizzes.push(quiz);
    index = endIndex - 1;
  }
  // Overlay only Markdown ranges, leaving every directive and its exact span untouched.
  const blocks: ContentBlock[] = [];
  ranges.sort((a, b) => a.start - b.start);
  for (const block of existingBlocks) {
    if (block.kind !== 'markdown') { blocks.push(block); continue; }
    let cursor = block.content.source.start - source.bodyStart;
    const end = block.content.source.end - source.bodyStart;
    for (const range of ranges) {
      const start = Math.max(cursor, range.start);
      const stop = Math.min(end, range.end);
      if (stop <= start) continue;
      if (start > cursor) blocks.push({ kind: 'markdown', content: markdownFragment(source, cursor, start) });
      blocks.push({ ...range.block, original: markdownFragment(source, start, stop) });
      cursor = stop;
    }
    if (cursor < end) blocks.push({ kind: 'markdown', content: markdownFragment(source, cursor, end) });
  }
  return { quizzes, blocks };
}
