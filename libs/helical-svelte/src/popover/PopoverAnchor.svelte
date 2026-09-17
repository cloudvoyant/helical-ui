<!-- libs/helical-svelte/src/popover/PopoverAnchor.svelte -->
<!-- Closely based on: Ark UI popover (@ark-ui/svelte/popover), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { PopoverAnchor, type PopoverAnchorProps } from '@ark-ui/svelte/popover';

  type Props = PopoverAnchorProps & { class?: string };

  let { class: className = '', children, ...rest }: Props = $props();
</script>

<PopoverAnchor class={className} {...rest}>
  {@render children?.()}
</PopoverAnchor>
