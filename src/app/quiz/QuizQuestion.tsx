import type { ContentIndex, Quiz, QuizQuestion as QuizQuestionData } from '../../content/types.js';
import { Markdown } from '../Markdown.js';
import { isCorrect, useQuizSession } from './QuizGroup.js';

function choiceResultClass(
  option: string,
  selected: string,
  correct: string,
  revealed: boolean,
): string {
  if (!revealed) return selected === option ? 'selected' : '';
  if (option === correct) return 'correct';
  return selected === option ? 'incorrect' : '';
}

export function QuizQuestion({
  quiz,
  question,
  currentPath,
  index,
}: {
  quiz: Quiz;
  question: QuizQuestionData;
  currentPath: string;
  index: ContentIndex;
}) {
  const { states, setResponse, reveal } = useQuizSession();
  const state = states[question.id] ?? { response: '', revealed: false };
  const correct = isCorrect(question, state.response);
  const correctChoice = question.grading.kind === 'single-choice'
    ? question.grading.correctOptionId
    : question.grading.kind === 'ox' ? question.grading.correct : '';
  const isChoice = question.responseKind === 'single-choice' || question.responseKind === 'ox';
  const choices = question.responseKind === 'ox'
    ? [{ id: 'O', markdown: 'O' }, { id: 'X', markdown: 'X' }]
    : question.options.map(option => ({ id: option.id, markdown: option.content.markdown }));
  const actionLabel = question.grading.kind === 'self-check' ? '모범 답안 보기' : '정답 확인';

  return (
    <section className={`quiz-question-card ${quiz.category}`} aria-labelledby={`${question.id}-prompt`}>
      <div className="quiz-question-heading">
        <span>문항 {question.ordinal}</span>
        {quiz.category !== 'practice' && <small>{quiz.category === 'reflection' ? 'Reflection' : 'Cumulative'}</small>}
      </div>
      <div id={`${question.id}-prompt`} className="quiz-prompt">
        <Markdown markdown={question.prompt.markdown} currentPath={currentPath} index={index} />
      </div>

      {isChoice ? (
        <fieldset className={`quiz-options ${question.responseKind === 'ox' ? 'ox-options' : ''}`}>
          <legend className="sr-only">답 선택</legend>
          {choices.map(choice => (
            <label key={choice.id} className={choiceResultClass(choice.id, state.response, correctChoice, state.revealed)}>
              <input
                type="radio"
                name={question.id}
                value={choice.id}
                checked={state.response === choice.id}
                disabled={state.revealed}
                onChange={() => setResponse(question.id, choice.id)}
              />
              <span className="option-control" aria-hidden="true" />
              <span className="option-content">
                {question.responseKind === 'ox'
                  ? choice.markdown
                  : <Markdown markdown={choice.markdown} currentPath={currentPath} index={index} />}
              </span>
              {state.revealed && choice.id === correctChoice && <strong className="option-result">정답</strong>}
              {state.revealed && choice.id === state.response && choice.id !== correctChoice && <strong className="option-result">내 선택</strong>}
            </label>
          ))}
        </fieldset>
      ) : (
        <label className="free-response-field">
          <span>내 답</span>
          <textarea
            rows={4}
            value={state.response}
            disabled={state.revealed}
            placeholder="생각을 자유롭게 적어보세요. 입력하지 않고 모범 답안을 볼 수도 있습니다."
            onChange={event => setResponse(question.id, event.target.value)}
          />
        </label>
      )}

      {!state.revealed && (
        <button
          type="button"
          className="quiz-reveal-button"
          disabled={isChoice && state.response.length === 0}
          onClick={() => reveal(question.id)}
        >
          {actionLabel}
        </button>
      )}

      {state.revealed && (
        <div className="quiz-revealed" aria-live="polite">
          {correct === true && <p className="quiz-verdict correct">✓ 정답입니다.</p>}
          {correct === false && <p className="quiz-verdict incorrect">선택한 답은 {state.response}입니다. 정답은 {correctChoice}입니다.</p>}
          {correct === undefined && <p className="quiz-verdict self-check">모범 답안과 비교해보세요.</p>}
          <div className="quiz-answers">
            {question.answers.map(answer => (
              <section key={answer.id} className={`quiz-answer-panel ${answer.role}`}>
                <span>{answer.role === 'answer' ? '모범 답안' : '추가 해설'}</span>
                <Markdown markdown={answer.content.markdown} currentPath={currentPath} index={index} />
              </section>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
