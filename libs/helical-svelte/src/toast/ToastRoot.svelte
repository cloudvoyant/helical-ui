<!-- libs/helical-svelte/src/toast/ToastRoot.svelte -->
<!-- Closely based on: Shark UI toast (@ark-ui/svelte/toast), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { ToastRoot as ArkToastRoot, type ToastRootProps } from '@ark-ui/svelte/toast';
  import { cn, toastVariants } from '@cloudvoyant/helical-ui';

  type Props = ToastRootProps & { class?: string; className?: string };

  let { class: className = '', className: reactClassName = '', children, ...rest }: Props = $props();
</script>

<ArkToastRoot
  data-slot="toast"
  class={cn(toastVariants(), className, reactClassName)}
  {...rest}
>
  {@render children?.()}
</ArkToastRoot>
