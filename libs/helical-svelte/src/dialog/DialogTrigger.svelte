<!-- libs/helical-svelte/src/dialog/DialogTrigger.svelte -->
<!-- Closely based on: Ark UI dialog (@ark-ui/svelte/dialog), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { Trigger as DialogTrigger, type DialogTriggerProps } from '@ark-ui/svelte/dialog';

  type Props = DialogTriggerProps & { class?: string };

  let { class: className = '', children, ...rest }: Props = $props();
</script>

<DialogTrigger class={className} {...rest}>
  {@render children?.()}
</DialogTrigger>
