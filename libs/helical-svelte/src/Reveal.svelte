<!-- libs/helical-svelte/src/Reveal.svelte -->
<!-- Closely based on: diffbook QA (packages/diffbook-ui/src/components/QA.tsx), renamed Reveal,
     rebuilt on Ark UI Collapsible, mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { CollapsibleRoot, CollapsibleTrigger, CollapsibleContent } from '@ark-ui/svelte/collapsible';
  import { revealRootBase, revealTriggerBase, revealChevronBase, revealContentBase, cn } from '@cloudvoyant/helical-ui';
  import type { Snippet } from 'svelte';

  type Props = {
    question: string;
    children?: Snippet;
    class?: string;
  };

  let { question, children, class: className = '' }: Props = $props();

  const classes = $derived(cn(revealRootBase, className));
</script>

<CollapsibleRoot class={classes}>
  <CollapsibleTrigger class={revealTriggerBase}>
    <svg
      class={revealChevronBase}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6"></path>
    </svg>
    <span>{question}</span>
  </CollapsibleTrigger>
  <CollapsibleContent class={revealContentBase}>
    {#if children}{@render children()}{/if}
  </CollapsibleContent>
</CollapsibleRoot>
