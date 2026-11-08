<!-- libs/helical-svelte/src/toast/ToastActionTrigger.svelte -->
<!-- Closely based on: Shark UI toast (@ark-ui/svelte/toast), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { ToastActionTrigger as ArkToastActionTrigger, type ToastActionTriggerProps } from '@ark-ui/svelte/toast';
  import { cn, toastActionTriggerBase } from '@cloudvoyant/helical-ui';

  type Props = ToastActionTriggerProps & { class?: string; className?: string };

  let { class: className = '', className: reactClassName = '', children, ...rest }: Props = $props();
</script>

<ArkToastActionTrigger
  data-slot="toast-action-trigger"
  class={cn(toastActionTriggerBase, className, reactClassName)}
  {...rest}
>
  {@render children?.()}
</ArkToastActionTrigger>
