<!-- libs/helical-svelte/src/questions/SingleChoiceQuestion.svelte -->
<!-- Closely based on: diffbook Quiz, mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import RadioGroup from '../radio-group/RadioGroup.svelte';
  import RadioGroupItem from '../radio-group/RadioGroupItem.svelte';
  import {
    questionCardBase,
    questionPromptBase,
    questionGroupBase,
    questionOptionBase,
    questionOptionCorrectBase,
    questionOptionIncorrectBase,
    questionCheckButtonBase,
    feedbackCorrectBase,
    feedbackIncorrectBase,
    feedbackExplanationBase,
    cn,
  } from '@cloudvoyant/helical-ui';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    id: string;
    prompt: string;
    choices: string[];
    correct: number;
    explanation?: string;
    quiz?: boolean;
    submitted?: boolean;
    onAnswerChange?: (state: { answered: boolean; correct: boolean }) => void;
    onGraded?: (correct: boolean) => void;
    class?: string;
  } & HTMLAttributes<HTMLDivElement>;

  let {
    prompt,
    choices,
    correct,
    explanation = undefined,
    quiz = false,
    submitted = false,
    onAnswerChange,
    onGraded,
    class: className = '',
    ...rest
  }: Props = $props();

  let selected = $state<number | null>(null);
  let result = $state<boolean | null>(null);

  const displayResult = $derived(quiz ? (submitted ? selected === correct : null) : result);

  function handleCheck() {
    if (selected === null) return;
    const isCorrect = selected === correct;
    result = isCorrect;
    onGraded?.(isCorrect);
  }
</script>

<div class={cn(questionCardBase, className)} {...rest}>
  <p class={questionPromptBase}>{prompt}</p>
  <RadioGroup
    orientation="vertical"
    value={selected !== null ? String(selected) : null}
    onValueChange={(details) => {
      if (quiz ? submitted : result !== null) return;
      selected = details.value != null ? Number(details.value) : null;
      if (quiz) {
        const has = selected !== null;
        onAnswerChange?.({ answered: has, correct: has && selected === correct });
      }
    }}
    disabled={quiz ? submitted : result !== null}
    class={questionGroupBase}
  >
    {#each choices as choice, i (i)}
      <RadioGroupItem
        value={String(i)}
        class={cn(
          questionOptionBase,
          displayResult !== null && i === correct && questionOptionCorrectBase,
          displayResult !== null && i === selected && i !== correct && questionOptionIncorrectBase,
        )}
      >
        {choice}
      </RadioGroupItem>
    {/each}
  </RadioGroup>
  {#if !quiz && result === null}
    <Ark as="button" type="button" onclick={handleCheck} disabled={selected === null} class={questionCheckButtonBase}>
      Check
    </Ark>
  {/if}
  {#if displayResult !== null}
    <div aria-live="polite" role="status" class="mt-3">
      <div
        class={cn(
          'flex items-center gap-2 text-sm font-medium',
          displayResult ? feedbackCorrectBase : feedbackIncorrectBase,
        )}
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
