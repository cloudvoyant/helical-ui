<!-- libs/helical-svelte/src/toast/ToastCloseTrigger.svelte -->
<!-- Closely based on: Shark UI toast (@ark-ui/svelte/toast), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { ToastCloseTrigger as ArkToastCloseTrigger, type ToastCloseTriggerProps } from '@ark-ui/svelte/toast';
  import { X } from 'lucide-svelte';
  import { cn, toastCloseTriggerBase } from '@cloudvoyant/helical-ui';

  type Props = ToastCloseTriggerProps & { class?: string; className?: string };

  let { class: className = '', className: reactClassName = '', children, ...rest }: Props = $props();
</script>

<ArkToastCloseTrigger
  aria-label="Close"
  data-slot="toast-close-trigger"
  class={cn(toastCloseTriggerBase, className, reactClassName)}
  {...rest}
>
  {#if children}
    {@render children()}
  {:else}
    <X aria-hidden="true" />
  {/if}
</ArkToastCloseTrigger>
