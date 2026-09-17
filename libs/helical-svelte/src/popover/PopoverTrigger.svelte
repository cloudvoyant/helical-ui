<!-- libs/helical-svelte/src/popover/PopoverTrigger.svelte -->
<!-- Closely based on: Ark UI popover (@ark-ui/svelte/popover), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { PopoverTrigger, type PopoverTriggerProps } from '@ark-ui/svelte/popover';

  type Props = PopoverTriggerProps & { class?: string };

  let { class: className = '', children, ...rest }: Props = $props();
</script>

<PopoverTrigger class={className} {...rest}>
  {@render children?.()}
</PopoverTrigger>
