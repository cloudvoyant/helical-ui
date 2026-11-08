<!-- libs/helical-svelte/src/toast/ToastDescription.svelte -->
<!-- Closely based on: Shark UI toast (@ark-ui/svelte/toast), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { ToastDescription as ArkToastDescription, type ToastDescriptionProps } from '@ark-ui/svelte/toast';
  import { cn, toastDescriptionBase } from '@cloudvoyant/helical-ui';

  type Props = ToastDescriptionProps & { class?: string; className?: string };

  let { class: className = '', className: reactClassName = '', children, ...rest }: Props = $props();
</script>

<ArkToastDescription
  data-slot="toast-description"
  class={cn(toastDescriptionBase, className, reactClassName)}
  {...rest}
>
  {@render children?.()}
</ArkToastDescription>
