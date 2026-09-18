// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';

import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { ContentRenderer } from '../src/app/ContentRenderer.js';
import { parseContentDirectory } from '../src/content/parse.js';
import type { ContentCatalog, ContentDocument, ContentIndex } from '../src/content/types.js';
import { createContentIndex } from '../src/content/write.js';

let catalog: ContentCatalog;
let index: ContentIndex;

beforeAll(async () => {
  const parsed = await parseContentDirectory('content');
  if (!parsed.ok) throw new Error(JSON.stringify(parsed.diagnostics));
  catalog = parsed.data;
  index = createContentIndex(catalog);
});

afterEach(cleanup);

function renderDocument(id: string) {
  const document = catalog.documentsById[id] as ContentDocument;
  return render(
    <MemoryRouter><ContentRenderer document={document} index={index} /></MemoryRouter>,
  );
}

function questionCard(view: ReturnType<typeof render>, position: number) {
  const card = view.container.querySelectorAll<HTMLElement>('.quiz-question-card')[position];
  if (card === undefined) throw new Error(`Missing question card ${position}`);
  return within(card);
}

describe('interactive Quiz UI', () => {
  it('shows single-choice options while keeping the answer hidden before confirmation', () => {
    const view = renderDocument('m00-l01');
    const first = questionCard(view, 0);
    expect(first.getByRole('radio', { name: /A\. Gate/ })).toBeInTheDocument();
    expect(first.getByRole('radio', { name: /B\. Die/ })).toBeInTheDocument();
    expect(first.getByRole('button', { name: '정답 확인' })).toBeDisabled();
    expect(screen.queryByText(/Q1 → B\. Die/)).not.toBeInTheDocument();
  });

  it('marks a correct selected option and reveals the original answer once', () => {
    const view = renderDocument('m00-l01');
    const first = questionCard(view, 0);
    fireEvent.click(first.getByRole('radio', { name: /B\. Die/ }));
    fireEvent.click(first.getByRole('button', { name: '정답 확인' }));
    expect(first.getByText('✓ 정답입니다.')).toBeInTheDocument();
    expect(first.getByText('정답')).toBeInTheDocument();
    expect(screen.getAllByText(/Q1 → B\. Die/)).toHaveLength(1);
  });

  it('shows both the selected answer and the correct answer after an incorrect choice', () => {
    const view = renderDocument('m00-l01');
    const first = questionCard(view, 0);
    fireEvent.click(first.getByRole('radio', { name: /A\. Gate/ }));
    fireEvent.click(first.getByRole('button', { name: '정답 확인' }));
    expect(first.getByText('내 선택')).toBeInTheDocument();
    expect(first.getByText('정답')).toBeInTheDocument();
    expect(first.getByText(/선택한 답은 A입니다\. 정답은 B입니다\./)).toBeInTheDocument();
  });

  it('supports immediate-answer source layouts without exposing answers early', () => {
    const view = renderDocument('m01-l02');
    const first = questionCard(view, 0);
    expect(screen.queryByText(/PMOS가 ON이 되어/)).not.toBeInTheDocument();
    fireEvent.click(first.getByRole('radio', { name: /A\. VDD/ }));
    fireEvent.click(first.getByRole('button', { name: '정답 확인' }));
    expect(screen.getAllByText(/PMOS가 ON이 되어/)).toHaveLength(1);
  });

  it('accepts free-response text and reveals a model answer without automatic grading', () => {
    const view = renderDocument('m00-l01');
    const third = questionCard(view, 2);
    const input = third.getByRole('textbox', { name: '내 답' });
    fireEvent.change(input, { target: { value: '소자는 기능 단위이고 Die는 회로 조각이다.' } });
    expect(input).toHaveValue('소자는 기능 단위이고 Die는 회로 조각이다.');
    fireEvent.click(third.getByRole('button', { name: '모범 답안 보기' }));
    expect(third.getByText('모범 답안과 비교해보세요.')).toBeInTheDocument();
    expect(third.queryByText(/오답/)).not.toBeInTheDocument();
    expect(third.getByText(/하나의 완성된 IC 회로 조각/)).toBeInTheDocument();
  });

  it('allows a free-response model answer to be opened with an empty response', () => {
    const view = renderDocument('m04-l01');
    const first = questionCard(view, 0);
    fireEvent.click(first.getByRole('button', { name: '모범 답안 보기' }));
    expect(first.getByText(/ALU 등의 연산 회로가 계산하고/)).toBeInTheDocument();
  });

  it('preserves every answer and later explanation for one question', () => {
    const view = renderDocument('m03-l03');
    const first = questionCard(view, 0);
    fireEvent.click(first.getByRole('button', { name: '모범 답안 보기' }));
    expect(first.getByText('모범 답안')).toBeInTheDocument();
    expect(first.getByText('추가 해설')).toBeInTheDocument();
    expect(first.getByText(/Photo는 PR 패턴을 만들고 Etch는/)).toBeInTheDocument();
  });

  it('renders and grades the O/X question from its grading rule', () => {
    const view = renderDocument('m03-l09');
    const third = questionCard(view, 2);
    fireEvent.click(third.getByRole('radio', { name: 'X' }));
    fireEvent.click(third.getByRole('button', { name: '정답 확인' }));
    expect(third.getByText('✓ 정답입니다.')).toBeInTheDocument();
  });

  it('resets every response in a Quiz group without touching content', () => {
    const view = renderDocument('m00-l01');
    const first = questionCard(view, 0);
    fireEvent.click(first.getByRole('radio', { name: /B\. Die/ }));
    fireEvent.click(first.getByRole('button', { name: '정답 확인' }));
    fireEvent.click(screen.getByRole('button', { name: 'Quiz 다시 풀기' }));
    expect(first.getByRole('radio', { name: /B\. Die/ })).not.toBeChecked();
    expect(first.getByRole('radio', { name: /B\. Die/ })).toBeEnabled();
    expect(first.queryByText('✓ 정답입니다.')).not.toBeInTheDocument();
  });

  it('renders all ten questions in a cumulative Review Quiz', () => {
    const view = renderDocument('m03-review');
    expect(view.container.querySelectorAll('.quiz-question-card')).toHaveLength(10);
    expect(screen.getByText('0 / 10 확인 완료')).toBeInTheDocument();
  });

  it('renders the reflection group as self-check without a score denominator', () => {
    const view = renderDocument('m01-l05');
    expect(view.container.querySelectorAll('.quiz-question-card')).toHaveLength(4);
    const reflection = view.container.querySelector<HTMLElement>('.quiz-question-card.reflection');
    expect(reflection).not.toBeNull();
    expect(within(reflection!).getByText('Reflection')).toBeInTheDocument();
    const summaries = view.container.querySelectorAll<HTMLElement>('.quiz-group-summary');
    expect(summaries).toHaveLength(2);
    expect(within(summaries[1]!).getByText(/생각을 정리한 뒤/)).toBeInTheDocument();
    expect(within(summaries[1]!).queryByText(/자동 판정/)).not.toBeInTheDocument();
  });

  it('keeps fenced code and ASCII structure inside a question prompt', () => {
    const view = renderDocument('m02-l06');
    const third = questionCard(view, 2);
    expect(third.getByText(/\[CPU Die\] \[CPU Die\]/)).toBeInTheDocument();
    expect(view.container.querySelector('.quiz-question-card pre')).toBeInTheDocument();
  });
});
