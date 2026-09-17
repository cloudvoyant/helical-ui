<!-- libs/helical-svelte/src/window/WindowStageTrigger.svelte -->
<!-- Closely based on: Ark UI window (@ark-ui/svelte/floating-panel), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { FloatingPanelStageTrigger, type FloatingPanelStageTriggerProps } from '@ark-ui/svelte/floating-panel';
  import { windowStageTriggerBase, cn } from '@cloudvoyant/helical-ui';

  type Props = FloatingPanelStageTriggerProps & { class?: string };

  let { class: className = '', children, ...rest }: Props = $props();

  const classes = $derived(cn(windowStageTriggerBase, className));
</script>

<FloatingPanelStageTrigger class={classes} {...rest}>
  {@render children?.()}
</FloatingPanelStageTrigger>
