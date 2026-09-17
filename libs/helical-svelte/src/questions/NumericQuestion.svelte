<!-- libs/helical-svelte/src/questions/NumericQuestion.svelte -->
<!-- Closely based on: diffbook Quiz, mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import {
    questionCardBase,
    questionPromptBase,
    questionCheckButtonBase,
    questionInputBase,
    questionUnitBase,
    feedbackCorrectBase,
    feedbackIncorrectBase,
    feedbackExplanationBase,
    cn,
  } from '@cloudvoyant/helical-ui';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    id: string;
    prompt: string;
    answer: number;
    tolerance?: number;
    unit?: string;
    explanation?: string;
    quiz?: boolean;
    submitted?: boolean;
    onAnswerChange?: (state: { answered: boolean; correct: boolean }) => void;
    onGraded?: (correct: boolean) => void;
    class?: string;
  } & HTMLAttributes<HTMLDivElement>;

  let {
    id,
    prompt,
    answer,
    tolerance = 0,
    unit,
    explanation = undefined,
    quiz = false,
    submitted = false,
    onAnswerChange,
    onGraded,
    class: className = '',
    ...rest
  }: Props = $props();

  let value = $state('');
  let result = $state<boolean | null>(null);

  const parsed = $derived(parseFloat(value));
  const computeCorrect = $derived(!Number.isNaN(parsed) && Math.abs(parsed - answer) <= tolerance);
  const displayResult = $derived(quiz ? (submitted ? computeCorrect : null) : result);

  function handleCheck() {
    if (Number.isNaN(parsed)) return;
    const isCorrect = computeCorrect;
    result = isCorrect;
    onGraded?.(isCorrect);
  }
</script>

<div class={cn(questionCardBase, className)} {...rest}>
  <Ark as="label" for={`q-${id}-input`} class={questionPromptBase}>{prompt}</Ark>
  <div class="flex items-center gap-2">
    <input
      id={`q-${id}-input`}
      type="text"
      inputmode="decimal"
      {value}
      oninput={(e) => {
        if (quiz ? submitted : result !== null) return;
        value = e.currentTarget.value;
        if (quiz) {
          const p = parseFloat(value);
          const has = value.trim() !== '' && !Number.isNaN(p);
          const isCorrect = has && Math.abs(p - answer) <= tolerance;
          onAnswerChange?.({ answered: has, correct: isCorrect });
        }
      }}
      disabled={quiz ? submitted : result !== null}
      class={questionInputBase}
    />
    {#if unit}<Ark as="span" class={questionUnitBase}>{unit}</Ark>{/if}
  </div>
  {#if !quiz && result === null}
    <Ark
      as="button"
      type="button"
      onclick={handleCheck}
      disabled={value.trim() === '' || Number.isNaN(parsed)}
      class={questionCheckButtonBase}
    >
      Check
    </Ark>
  {/if}
  {#if displayResult !== null}
    <div aria-live="polite" role="status" class="mt-3">
      <div
        class={cn('flex items-center gap-2 text-sm font-medium', displayResult ? feedbackCorrectBase : feedbackIncorrectBase)}
      >
        {#if displayResult}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            class="size-4 shrink-0"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="m9 12 2 2 4-4"></path>
          </svg>
          <span>Correct</span>
        {:else}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            class="size-4 shrink-0"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="m15 9-6 6"></path>
            <path d="m9 9 6 6"></path>
          </svg>
          <span>Incorrect</span>
        {/if}
      </div>
      {#if explanation}<p class={feedbackExplanationBase}>{explanation}</p>{/if}
    </div>
  {/if}
</div>
