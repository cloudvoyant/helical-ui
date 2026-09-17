<!-- libs/helical-svelte/src/Notice.svelte -->
<!-- Closely based on: diffbook Notice (packages/diffbook-ui/src/components/Notice.tsx + ui/alert.tsx),
     mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import { noticeVariants, noticeTitleBase, noticeDescriptionBase, cn } from '@cloudvoyant/helical-ui';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  type Variant = 'info' | 'success' | 'warning' | 'error' | 'none';

  type Props = {
    variant?: Variant;
    title?: string;
    children?: Snippet;
    class?: string;
  } & HTMLAttributes<HTMLDivElement>;

  let { variant = 'info', title, children, class: className = '', ...rest }: Props = $props();

  const classes = $derived(cn(noticeVariants({ variant }), className));
</script>

<Ark as="div" role={variant === 'error' ? 'alert' : variant === 'none' ? undefined : 'status'} class={classes} {...rest}>
  {#if variant === 'success'}
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
      <circle cx="12" cy="12" r="10"></circle>
      <path d="m9 12 2 2 4-4"></path>
    </svg>
  {:else if variant === 'warning'}
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
      <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path>
      <path d="M12 9v4"></path>
      <path d="M12 17h.01"></path>
    </svg>
  {:else if variant === 'error'}
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
      <circle cx="12" cy="12" r="10"></circle>
      <path d="m15 9-6 6"></path>
      <path d="m9 9 6 6"></path>
    </svg>
  {:else if variant === 'info'}
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
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 16v-4"></path>
      <path d="M12 8h.01"></path>
    </svg>
  {/if}
  {#if title}<div class={noticeTitleBase}>{title}</div>{/if}
  {#if children}<div class={noticeDescriptionBase}>{@render children()}</div>{/if}
</Ark>
