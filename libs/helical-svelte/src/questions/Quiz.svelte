<!-- libs/helical-svelte/src/questions/Quiz.svelte -->
<!-- Closely based on: diffbook Quiz, mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import SingleChoiceQuestion from './SingleChoiceQuestion.svelte';
  import MultipleChoiceQuestion from './MultipleChoiceQuestion.svelte';
  import NumericQuestion from './NumericQuestion.svelte';
  import {
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
  import type { Question } from '@cloudvoyant/helical-ui';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    id: string;
    title?: string;
    questions: Question[];
    class?: string;
  } & HTMLAttributes<HTMLDivElement>;

  let { id, title, questions, class: className = '', ...rest }: Props = $props();

  let answers = $state<Record<string, { answered: boolean; correct: boolean }>>({});
  let submitted = $state(false);
  let resetKey = $state(0);

  const total = $derived(questions.length);
  const allAnswered = $derived(questions.length > 0 && questions.every((q) => answers[q.id]?.answered === true));
  const score = $derived(questions.filter((q) => answers[q.id]?.correct === true).length);
  const pct = $derived(total > 0 ? Math.round((score / total) * 100) : 0);

  function handleAnswerChange(questionId: string) {
    return (state: { answered: boolean; correct: boolean }) => {
      answers = { ...answers, [questionId]: state };
    };
  }

  function handleReset() {
    answers = {};
    submitted = false;
    resetKey += 1;
  }
</script>

<div data-quiz-id={id} class={cn(quizRootBase, className)} {...rest}>
  <div class={quizHeaderBase}>
    {#if title}<Ark as="h3" class={quizTitleBase}>{title}</Ark>{/if}
  </div>
  {#each questions as q (q.id)}
    {#key `${q.id}-${resetKey}`}
      {#if q.type === 'single'}
        <SingleChoiceQuestion
          id={q.id}
          prompt={q.prompt}
          choices={q.choices}
          correct={q.correct}
          explanation={q.explanation}
          quiz
          {submitted}
          onAnswerChange={handleAnswerChange(q.id)}
        />
      {:else if q.type === 'multiple'}
        <MultipleChoiceQuestion
          id={q.id}
          prompt={q.prompt}
          choices={q.choices}
          correct={q.correct}
          explanation={q.explanation}
          quiz
          {submitted}
          onAnswerChange={handleAnswerChange(q.id)}
        />
      {:else if q.type === 'numeric'}
        <NumericQuestion
          id={q.id}
          prompt={q.prompt}
          answer={q.answer}
          tolerance={q.tolerance}
          unit={q.unit}
          explanation={q.explanation}
          quiz
          {submitted}
          onAnswerChange={handleAnswerChange(q.id)}
        />
      {/if}
    {/key}
  {/each}
  <div class="mt-4 flex items-center gap-3">
    {#if !submitted}
      <Ark as="button" type="button" onclick={() => (submitted = true)} disabled={!allAnswered} class={quizSubmitButtonBase}>
        Submit
      </Ark>
    {:else}
      <Ark as="button" type="button" onclick={handleReset} class={quizResetButtonBase}>
        Reset
      </Ark>
    {/if}
    <Ark as="span" role="status" class={quizScoreBase}>
      {submitted ? `${score}/${total} (${pct}%)` : `${total} question${total === 1 ? '' : 's'}`}
    </Ark>
  </div>
  {#if submitted}
    <div class={quizResultBase}>
      <div aria-live="polite" role="status" class="text-center">
        <p class={quizResultTitleBase}>{score}/{total} ({pct}%)</p>
        <p class={quizResultTextBase}>{pct >= 70 ? 'Well done!' : 'Keep studying and try again.'}</p>
      </div>
    </div>
  {/if}
</div>
