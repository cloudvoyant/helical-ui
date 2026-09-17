// libs/helical-ui/src/question.ts
// Closely based on: diffbook Quiz (packages/diffbook-ui/src/components/Quiz.impl.tsx).

export interface SingleChoiceQuestionData {
  id: string;
  type: 'single';
  prompt: string;
  choices: string[];
  correct: number;
  explanation?: string;
}

export interface MultipleChoiceQuestionData {
  id: string;
  type: 'multiple';
  prompt: string;
  choices: string[];
  correct: number[];
  explanation?: string;
}

export interface NumericQuestionData {
  id: string;
  type: 'numeric';
  prompt: string;
  answer: number;
  tolerance?: number;
  unit?: string;
  explanation?: string;
}

export type Question = SingleChoiceQuestionData | MultipleChoiceQuestionData | NumericQuestionData;

export const questionCardBase = 'not-prose my-4 rounded-lg border border-border bg-card p-4';

export const questionPromptBase = 'mb-3 text-sm font-medium text-foreground';

export const questionGroupBase = 'grid gap-2';

export const questionOptionBase = 'rounded-md px-3 py-2 transition-colors hover:bg-muted/60';

export const questionOptionCorrectBase = 'bg-success/10';

export const questionOptionIncorrectBase = 'bg-destructive/10';

export const questionCheckButtonBase =
  'mt-3 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

export const questionInputBase =
  'h-9 w-32 rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50';

export const questionUnitBase = 'text-sm text-muted-foreground';

export const feedbackCorrectBase = 'text-success';

export const feedbackIncorrectBase = 'text-destructive';

export const feedbackExplanationBase = 'mt-1.5 text-sm text-muted-foreground';

export const quizRootBase = 'not-prose my-6 rounded-lg border border-border bg-card/50 p-4';

export const quizHeaderBase = 'mb-4 flex items-center justify-between gap-3';

export const quizTitleBase = 'text-base font-semibold text-foreground';

export const quizScoreBase =
  'inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground';

export const quizResultBase = 'mt-4 rounded-lg border border-border bg-muted/40 p-4';

export const quizResultTitleBase = 'text-lg font-semibold text-foreground';

export const quizResultTextBase = 'mt-1 text-sm text-muted-foreground';

export const quizSubmitButtonBase =
  'rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

export const quizResetButtonBase =
  'inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
