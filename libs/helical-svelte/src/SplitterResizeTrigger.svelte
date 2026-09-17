<!-- libs/helical-svelte/src/SplitterResizeTrigger.svelte -->
<!-- Closely based on: @ark-ui/svelte/splitter (Ark UI), Chakra UI Splitter, mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { SplitterResizeTrigger, type SplitterResizeTriggerProps } from '@ark-ui/svelte/splitter';
  import { splitterResizeTriggerBase, splitterResizeTriggerSeparatorBase, cn } from '@cloudvoyant/helical-ui';

  let { class: className = '', children, ...rest }: SplitterResizeTriggerProps = $props();

  const classes = $derived(cn(splitterResizeTriggerBase, className));
</script>

<SplitterResizeTrigger class={classes} {...rest}>
  <span aria-hidden data-part="separator" class={splitterResizeTriggerSeparatorBase}></span>
  {@render children?.()}
</SplitterResizeTrigger>
