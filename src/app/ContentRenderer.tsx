import type { ContentBlock, ContentDocument, ContentIndex } from '../content/types.js';
import { Markdown } from './Markdown.js';
import { InteractiveSlot } from './interactive/InteractiveSlot.js';
import { QuizGroupSummary, QuizSessionProvider } from './quiz/QuizGroup.js';
import { QuizQuestion } from './quiz/QuizQuestion.js';
import { VisualSlot } from './visual/VisualSlot.js';
import type { InteractiveTarget } from './visual/types.js';

function blockSource(block: ContentBlock): number {
  if (block.kind === 'markdown') return block.content.source.start;
  if (block.kind === 'interactive' || block.kind === 'visual') {
    return block.value.original.source.start;
  }
  return block.original.source.start;
}

export function ContentRenderer({
  document,
  index,
  suppressDocumentHeadings = false,
}: {
  document: ContentDocument;
  index: ContentIndex;
  suppressDocumentHeadings?: boolean;
}) {
  const firstMarkdownPosition = document.body.blocks.findIndex(block => block.kind === 'markdown');
  const interactiveTargets = new Map<string, InteractiveTarget>();
  document.body.blocks.forEach((block, position) => {
    if (block.kind !== 'interactive') return;
    interactiveTargets.set(block.value.instanceId, {
      instanceId: block.value.instanceId,
      type: block.value.type,
      anchorId: `interactive-slot-${position + 1}`,
    });
  });

  return (
    <QuizSessionProvider>
      <div className="lesson-content">
      {document.body.blocks.map((block, position) => {
        const key = `${block.kind}:${blockSource(block)}:${position}`;
        if (block.kind === 'markdown') {
          return (
            <Markdown
              key={key}
              markdown={block.content.markdown}
              currentPath={document.path}
              index={index}
              suppressDocumentHeadings={suppressDocumentHeadings && position === firstMarkdownPosition}
              documentTitle={document.title}
            />
          );
        }
        if (block.kind === 'quiz-answer') return null;
        if (block.kind === 'quiz-question') {
          const quiz = document.body.quizzes.find(item => item.id === block.quizId);
          const question = quiz?.questions.find(item => item.id === block.questionId);
          if (quiz === undefined || question === undefined || quiz.status !== 'structured') {
            return (
              <div key={key} className="quiz-static quiz-question">
                <Markdown markdown={block.original.markdown} currentPath={document.path} index={index} />
              </div>
            );
          }
          const isLastQuestion = quiz.questions.at(-1)?.id === question.id;
          return (
            <div key={key} className="quiz-question-position">
              <QuizQuestion quiz={quiz} question={question} currentPath={document.path} index={index} />
              {isLastQuestion && <QuizGroupSummary quiz={quiz} />}
            </div>
          );
        }
        if (block.kind === 'interactive') {
          return (
            <InteractiveSlot
              key={key}
              declaration={block.value}
              documentRevision={document.revision}
              anchorId={interactiveTargets.get(block.value.instanceId)?.anchorId}
            />
          );
        }
        if (block.kind === 'visual') {
          return (
            <VisualSlot
              key={key}
              declaration={block.value}
              documentRevision={document.revision}
              interactiveTargets={interactiveTargets}
            />
          );
        }
        return (
          <aside key={key} className="unsupported-placeholder">
            <span>지원하지 않는 콘텐츠 선언</span>
            <code>{block.original.markdown}</code>
          </aside>
        );
      })}
      </div>
    </QuizSessionProvider>
  );
}
