<!-- libs/helical-svelte/src/toast/ToastTitle.svelte -->
<!-- Closely based on: Shark UI toast (@ark-ui/svelte/toast), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { ToastTitle as ArkToastTitle, type ToastTitleProps } from '@ark-ui/svelte/toast';
  import { cn, toastTitleBase } from '@cloudvoyant/helical-ui';

  type Props = ToastTitleProps & { class?: string; className?: string };

  let { class: className = '', className: reactClassName = '', children, ...rest }: Props = $props();
</script>

<ArkToastTitle
  data-slot="toast-title"
  class={cn(toastTitleBase, className, reactClassName)}
  {...rest}
>
  {@render children?.()}
</ArkToastTitle>
