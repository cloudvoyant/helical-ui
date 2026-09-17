<!-- libs/helical-svelte/src/switch/SwitchThumb.svelte -->
<!-- Closely based on: Shark UI switch (@ark-ui/svelte/switch), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { SwitchThumb, type SwitchThumbProps } from '@ark-ui/svelte/switch';
  import { switchThumbBase, cn } from '@cloudvoyant/helical-ui';

  let { class: className = '', ...rest }: SwitchThumbProps = $props();

  const classes = $derived(cn(switchThumbBase, className));
</script>

<SwitchThumb class={classes} {...rest} />
