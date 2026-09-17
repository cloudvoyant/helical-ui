<!-- libs/helical-svelte/src/CopyButton.svelte -->
<!-- Closely based on: Shark UI clipboard (@ark-ui/svelte/clipboard), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import {
    ClipboardRoot,
    ClipboardTrigger,
    ClipboardIndicator,
    type ClipboardRootProps,
  } from '@ark-ui/svelte/clipboard';
  import { clipboardTriggerBase, cn } from '@cloudvoyant/helical-ui';

  type Props = Omit<ClipboardRootProps, 'value' | 'class'> & {
    /** Text copied to the clipboard when clicked. */
    value: string;
    /** Accessible label for the trigger (default `Copy`). */
    label?: string;
    /** Extra classes for the trigger. */
    class?: string;
  };

  let { value, label = 'Copy', class: className = '', ...rest }: Props = $props();

  const classes = $derived(cn(clipboardTriggerBase, className));
</script>

<ClipboardRoot {value} {...rest}>
  <ClipboardTrigger class={classes} aria-label={label}>
    <ClipboardIndicator>
      {#snippet copied()}
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
      {/snippet}
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
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
      </svg>
    </ClipboardIndicator>
  </ClipboardTrigger>
</ClipboardRoot>
