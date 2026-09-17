// libs/helical-react/src/questions.tsx
// Closely based on: diffbook Quiz (packages/diffbook-ui/src/components/Quiz.impl.tsx).
import { useEffect, useState } from 'react';
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import { RadioGroup, RadioGroupItem } from './radio-group';
import { Checkbox, CheckboxControl, CheckboxIndicator, CheckboxLabel } from './checkbox';
import {
  questionCardBase,
  questionPromptBase,
  questionGroupBase,
  questionOptionBase,
  questionOptionCorrectBase,
  questionOptionIncorrectBase,
  questionCheckButtonBase,
  questionInputBase,
  questionUnitBase,
  feedbackCorrectBase,
  feedbackIncorrectBase,
  feedbackExplanationBase,
  quizRootBase,
  quizHeaderBase,
  quizTitleBase,
  quizScoreBase,
  quizResultBase,
  quizResultTitleBase,
  quizResultTextBase,
  quizSubmitButtonBase,
  quizResetButtonBase,
  cn,
} from '@cloudvoyant/helical-ui';
import type {
  SingleChoiceQuestionData,
  MultipleChoiceQuestionData,
  NumericQuestionData,
  Question,
} from '@cloudvoyant/helical-ui';

function CheckCircleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4 shrink-0"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CircleXIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4 shrink-0"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export interface QuizAnswerState {
  answered: boolean;
  correct: boolean;
}

/** Shared quiz-mode contract: `quiz` suppresses the per-question Check button and reports the
 *  answer status via `onAnswerChange`; `submitted` reveals the graded result. */
interface QuizModeProps {
  quiz?: boolean;
  submitted?: boolean;
  onAnswerChange?: (state: QuizAnswerState) => void;
}

function Feedback({ correct, explanation }: { correct: boolean | null; explanation?: string }) {
  if (correct === null) return null;
  return (
    <div aria-live="polite" role="status" className="mt-3">
      <div
        className={cn(
          'flex items-center gap-2 text-sm font-medium',
          correct ? feedbackCorrectBase : feedbackIncorrectBase,
        )}
      >
        {correct ? (
          <>
            <CheckCircleIcon />
            <span>Correct</span>
          </>
        ) : (
          <>
            <CircleXIcon />
            <span>Incorrect</span>
          </>
        )}
      </div>
      {explanation ? <p className={feedbackExplanationBase}>{explanation}</p> : null}
    </div>
  );
}

function SingleChoiceRenderer({
  prompt,
  choices,
  correct,
  explanation,
  quiz = false,
  submitted = false,
  onAnswerChange,
  onGraded,
  className,
  ...rest
}: Omit<SingleChoiceQuestionData, 'type'> &
  HTMLArkProps<'div'> &
  QuizModeProps & { onGraded?: (correct: boolean) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<boolean | null>(null);

  // Quiz mode: report answer status whenever selection changes.
  useEffect(() => {
    if (quiz) {
      const isAnswered = selected !== null;
      onAnswerChange?.({ answered: isAnswered, correct: isAnswered && selected === correct });
    }
  }, [quiz, selected, correct]);

  const displayResult = quiz ? (submitted ? selected === correct : null) : result;

  const handleCheck = () => {
    if (selected === null) return;
    const isCorrect = selected === correct;
    setResult(isCorrect);
    onGraded?.(isCorrect);
  };

  return (
    <div className={cn(questionCardBase, className)} {...rest}>
      <p className={questionPromptBase}>{prompt}</p>
      <RadioGroup
        orientation="vertical"
        value={selected === null ? null : String(selected)}
        onValueChange={(details) => {
          if (quiz ? submitted : result !== null) return;
          setSelected(details.value == null ? null : Number(details.value));
        }}
        disabled={quiz ? submitted : result !== null}
        className={questionGroupBase}
      >
        {choices.map((choice, i) => (
          <RadioGroupItem
            key={i}
            value={String(i)}
            className={cn(
              questionOptionBase,
              displayResult !== null && i === correct && questionOptionCorrectBase,
              displayResult !== null && i === selected && i !== correct && questionOptionIncorrectBase,
            )}
          >
            {choice}
          </RadioGroupItem>
        ))}
      </RadioGroup>
      {!quiz && result === null && (
        <ark.button
          type="button"
          onClick={handleCheck}
          disabled={selected === null}
          className={questionCheckButtonBase}
        >
          Check
        </ark.button>
      )}
      <Feedback correct={displayResult} explanation={displayResult === null ? undefined : explanation} />
    </div>
  );
}

function MultipleChoiceRenderer({
  prompt,
  choices,
  correct,
  explanation,
  quiz = false,
  submitted = false,
  onAnswerChange,
  onGraded,
  className,
  ...rest
}: Omit<MultipleChoiceQuestionData, 'type'> &
  HTMLArkProps<'div'> &
  QuizModeProps & { onGraded?: (correct: boolean) => void }) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [result, setResult] = useState<boolean | null>(null);

  const computeCorrect = () => {
    const correctSet = new Set(correct);
    return selected.size === correctSet.size && [...selected].every((v) => correctSet.has(v));
  };

  useEffect(() => {
    if (quiz) {
      const isAnswered = selected.size > 0;
      onAnswerChange?.({ answered: isAnswered, correct: isAnswered && computeCorrect() });
    }
  }, [quiz, selected, correct]);

  const toggleOption = (index: number) => {
    if (quiz ? submitted : result !== null) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const displayResult = quiz ? (submitted ? computeCorrect() : null) : result;

  const handleCheck = () => {
    if (selected.size === 0) return;
    const isCorrect = computeCorrect();
    setResult(isCorrect);
    onGraded?.(isCorrect);
  };

  return (
    <div className={cn(questionCardBase, className)} {...rest}>
      <p className={questionPromptBase}>{prompt}</p>
      <div role="group" className={questionGroupBase}>
        {choices.map((choice, i) => {
          const isCorrectOption = correct.includes(i);
          return (
            <Checkbox
              key={i}
              checked={selected.has(i)}
              onCheckedChange={() => toggleOption(i)}
              disabled={quiz ? submitted : result !== null}
              className={cn(
                questionOptionBase,
                displayResult !== null && isCorrectOption && questionOptionCorrectBase,
                displayResult !== null && selected.has(i) && !isCorrectOption && questionOptionIncorrectBase,
              )}
            >
              <CheckboxControl>
                <CheckboxIndicator>
                  <CheckIcon />
                </CheckboxIndicator>
              </CheckboxControl>
              <CheckboxLabel>{choice}</CheckboxLabel>
            </Checkbox>
          );
        })}
      </div>
      {!quiz && result === null && (
        <ark.button
          type="button"
          onClick={handleCheck}
          disabled={selected.size === 0}
          className={questionCheckButtonBase}
        >
          Check
        </ark.button>
      )}
      <Feedback correct={displayResult} explanation={displayResult === null ? undefined : explanation} />
    </div>
  );
}

function NumericRenderer({
  id,
  prompt,
  answer,
  tolerance = 0,
  unit,
  explanation,
  quiz = false,
  submitted = false,
  onAnswerChange,
  onGraded,
  className,
  ...rest
}: Omit<NumericQuestionData, 'type'> &
  HTMLArkProps<'div'> &
  QuizModeProps & { onGraded?: (correct: boolean) => void }) {
  const inputId = `q-${id}-input`;
  const [value, setValue] = useState('');
  const [result, setResult] = useState<boolean | null>(null);

  const computeCorrect = () => {
    const parsed = parseFloat(value);
    return !Number.isNaN(parsed) && Math.abs(parsed - answer) <= tolerance;
  };

  useEffect(() => {
    if (quiz) {
      const parsed = parseFloat(value);
      const isAnswered = value.trim() !== '' && !Number.isNaN(parsed);
      onAnswerChange?.({ answered: isAnswered, correct: isAnswered && computeCorrect() });
    }
  }, [quiz, value, answer, tolerance]);

  const displayResult = quiz ? (submitted ? computeCorrect() : null) : result;

  const handleCheck = () => {
    const parsed = parseFloat(value);
    if (Number.isNaN(parsed)) return;
    const isCorrect = Math.abs(parsed - answer) <= tolerance;
    setResult(isCorrect);
    onGraded?.(isCorrect);
  };

  return (
    <div className={cn(questionCardBase, className)} {...rest}>
      <ark.label htmlFor={inputId} className={questionPromptBase}>
        {prompt}
      </ark.label>
      <div className="flex items-center gap-2">
        <ark.input
          id={inputId}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => {
            if (quiz ? submitted : result !== null) return;
            setValue(e.currentTarget.value);
          }}
          disabled={quiz ? submitted : result !== null}
          className={questionInputBase}
        />
        {unit ? <ark.span className={questionUnitBase}>{unit}</ark.span> : null}
      </div>
      {!quiz && result === null && (
        <ark.button
          type="button"
          onClick={handleCheck}
          disabled={value.trim() === '' || Number.isNaN(parseFloat(value))}
          className={questionCheckButtonBase}
        >
          Check
        </ark.button>
      )}
      <Feedback correct={displayResult} explanation={displayResult === null ? undefined : explanation} />
    </div>
  );
}

export type SingleChoiceQuestionProps = HTMLArkProps<'div'> & Omit<SingleChoiceQuestionData, 'type'>;

export function SingleChoiceQuestion(props: SingleChoiceQuestionProps) {
  return <SingleChoiceRenderer {...props} />;
}

export type MultipleChoiceQuestionProps = HTMLArkProps<'div'> & Omit<MultipleChoiceQuestionData, 'type'>;

export function MultipleChoiceQuestion(props: MultipleChoiceQuestionProps) {
  return <MultipleChoiceRenderer {...props} />;
}

export type NumericQuestionProps = HTMLArkProps<'div'> & Omit<NumericQuestionData, 'type'>;

export function NumericQuestion(props: NumericQuestionProps) {
  return <NumericRenderer {...props} />;
}

export type QuizProps = HTMLArkProps<'div'> & {
  id: string;
  title?: string;
  questions: Question[];
};

export function Quiz({ id, title, questions, className, ...props }: QuizProps) {
  const [answers, setAnswers] = useState<Record<string, QuizAnswerState>>({});
  const [submitted, setSubmitted] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const total = questions.length;
  const allAnswered = questions.length > 0 && questions.every((q) => answers[q.id]?.answered === true);
  const score = questions.filter((q) => answers[q.id]?.correct === true).length;
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;

  const handleAnswerChange = (questionId: string) => (state: QuizAnswerState) => {
    setAnswers((prev) => ({ ...prev, [questionId]: state }));
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setResetKey((k) => k + 1);
  };

  const renderQuestion = (q: Question) => {
    const key = `${q.id}-${String(resetKey)}`;
    const quizProps = {
      quiz: true,
      submitted,
      onAnswerChange: handleAnswerChange(q.id),
    };
    switch (q.type) {
      case 'single':
        return (
          <SingleChoiceRenderer
            key={key}
            id={q.id}
            prompt={q.prompt}
            choices={q.choices}
            correct={q.correct}
            explanation={q.explanation}
            {...quizProps}
          />
        );
      case 'multiple':
        return (
          <MultipleChoiceRenderer
            key={key}
            id={q.id}
            prompt={q.prompt}
            choices={q.choices}
            correct={q.correct}
            explanation={q.explanation}
            {...quizProps}
          />
        );
      case 'numeric':
        return (
          <NumericRenderer
            key={key}
            id={q.id}
            prompt={q.prompt}
            answer={q.answer}
            tolerance={q.tolerance}
            unit={q.unit}
            explanation={q.explanation}
            {...quizProps}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div data-quiz-id={id} className={cn(quizRootBase, className)} {...props}>
      <div className={quizHeaderBase}>{title ? <ark.h3 className={quizTitleBase}>{title}</ark.h3> : null}</div>
      {questions.map(renderQuestion)}
      <div className="mt-4 flex items-center gap-3">
        {submitted ? (
          <ark.button type="button" onClick={handleReset} className={quizResetButtonBase}>
            Reset
          </ark.button>
        ) : (
          <ark.button
            type="button"
            onClick={() => setSubmitted(true)}
            disabled={!allAnswered}
            className={quizSubmitButtonBase}
          >
            Submit
          </ark.button>
        )}
        <ark.span role="status" className={quizScoreBase}>
          {submitted ? `${score}/${total} (${pct}%)` : `${total} question${total === 1 ? '' : 's'}`}
        </ark.span>
      </div>
      {submitted && (
        <div className={quizResultBase}>
          <div aria-live="polite" role="status" className="text-center">
            <p className={quizResultTitleBase}>
              {score}/{total} ({pct}%)
            </p>
            <p className={quizResultTextBase}>{pct >= 70 ? 'Well done!' : 'Keep studying and try again.'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
