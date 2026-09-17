<!-- libs/helical-svelte/src/questions/MultipleChoiceQuestion.svelte -->
<!-- Closely based on: diffbook Quiz, mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import Checkbox from '../checkbox/Checkbox.svelte';
  import CheckboxControl from '../checkbox/CheckboxControl.svelte';
  import CheckboxIndicator from '../checkbox/CheckboxIndicator.svelte';
  import CheckboxLabel from '../checkbox/CheckboxLabel.svelte';
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
    correct: number[];
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

  let selected = $state<Set<number>>(new Set());
  let result = $state<boolean | null>(null);

  function computeCorrect() {
    const correctSet = new Set(correct);
    return selected.size === correctSet.size && [...selected].every((v) => correctSet.has(v));
  }

  const displayResult = $derived(quiz ? (submitted ? computeCorrect() : null) : result);

  function toggleOption(index: number) {
    if (quiz ? submitted : result !== null) return;
    const next = new Set(selected);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    selected = next;
    if (quiz) {
      const has = selected.size > 0;
      const isCorrect = has && computeCorrect();
      onAnswerChange?.({ answered: has, correct: isCorrect });
    }
  }

  function handleCheck() {
    if (selected.size === 0) return;
    const isCorrect = computeCorrect();
    result = isCorrect;
    onGraded?.(isCorrect);
  }
</script>

<div class={cn(questionCardBase, className)} {...rest}>
  <p class={questionPromptBase}>{prompt}</p>
  <div role="group" class={questionGroupBase}>
    {#each choices as choice, i (i)}
      {@const isCorrectOption = correct.includes(i)}
      <Checkbox
        checked={selected.has(i)}
        onCheckedChange={() => toggleOption(i)}
        disabled={quiz ? submitted : result !== null}
        class={cn(
          questionOptionBase,
          displayResult !== null && isCorrectOption && questionOptionCorrectBase,
          displayResult !== null && selected.has(i) && !isCorrectOption && questionOptionIncorrectBase,
        )}
      >
        <CheckboxControl>
          <CheckboxIndicator>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5"></path>
            </svg>
          </CheckboxIndicator>
        </CheckboxControl>
        <CheckboxLabel>{choice}</CheckboxLabel>
      </Checkbox>
    {/each}
  </div>
  {#if !quiz && result === null}
    <Ark as="button" type="button" onclick={handleCheck} disabled={selected.size === 0} class={questionCheckButtonBase}>
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
