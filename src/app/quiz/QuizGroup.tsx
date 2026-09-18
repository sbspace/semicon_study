import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';

import type { Quiz, QuizQuestion } from '../../content/types.js';

export interface QuizQuestionState {
  response: string;
  revealed: boolean;
}

interface QuizSessionValue {
  states: Record<string, QuizQuestionState>;
  setResponse(questionId: string, response: string): void;
  reveal(questionId: string): void;
  resetQuiz(quiz: Quiz): void;
}

const QuizSessionContext = createContext<QuizSessionValue | null>(null);

export function QuizSessionProvider({ children }: PropsWithChildren) {
  const [states, setStates] = useState<Record<string, QuizQuestionState>>({});
  const value = useMemo<QuizSessionValue>(() => ({
    states,
    setResponse(questionId, response) {
      setStates(current => ({
        ...current,
        [questionId]: { response, revealed: current[questionId]?.revealed ?? false },
      }));
    },
    reveal(questionId) {
      setStates(current => ({
        ...current,
        [questionId]: { response: current[questionId]?.response ?? '', revealed: true },
      }));
    },
    resetQuiz(quiz) {
      setStates(current => {
        const next = { ...current };
        for (const question of quiz.questions) delete next[question.id];
        return next;
      });
    },
  }), [states]);
  return <QuizSessionContext.Provider value={value}>{children}</QuizSessionContext.Provider>;
}

export function useQuizSession(): QuizSessionValue {
  const value = useContext(QuizSessionContext);
  if (value === null) throw new Error('QuizSessionProvider is missing');
  return value;
}

export function isCorrect(question: QuizQuestion, response: string): boolean | undefined {
  if (question.grading.kind === 'single-choice') {
    return response === question.grading.correctOptionId;
  }
  if (question.grading.kind === 'ox') return response === question.grading.correct;
  return undefined;
}

export function QuizGroupSummary({ quiz }: { quiz: Quiz }) {
  const { states, resetQuiz } = useQuizSession();
  const answered = quiz.questions.filter(question => states[question.id]?.revealed).length;
  const attempted = quiz.questions.some(question => {
    const state = states[question.id];
    return state !== undefined && (state.response.length > 0 || state.revealed);
  });
  const gradable = quiz.questions.filter(question => question.grading.kind !== 'self-check');
  const correct = gradable.filter(question => {
    const state = states[question.id];
    return state?.revealed === true && isCorrect(question, state.response) === true;
  }).length;
  return (
    <footer className={`quiz-group-summary ${quiz.category}`} aria-label="Quiz 확인 현황">
      <div>
        <strong>{answered} / {quiz.questions.length} 확인 완료</strong>
        {quiz.category !== 'reflection' && gradable.length > 0 && (
          <span>자동 판정 {gradable.length}문제 중 {correct}문제 정답</span>
        )}
        {quiz.category === 'reflection' && <span>생각을 정리한 뒤 모범 답안과 비교해보세요.</span>}
      </div>
      {attempted && <button type="button" onClick={() => resetQuiz(quiz)}>Quiz 다시 풀기</button>}
    </footer>
  );
}
