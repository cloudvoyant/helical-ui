<!-- libs/helical-svelte/src/tags-input/TagInputClearTrigger.svelte -->
<!-- Closely based on: Shark UI tags input (@ark-ui/svelte/tags-input), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { TagsInputClearTrigger, type TagsInputClearTriggerProps } from '@ark-ui/svelte/tags-input';
  import { tagsInputClearTriggerBase, cn } from '@cloudvoyant/helical-ui';

  let { class: className = '', children, ...rest }: TagsInputClearTriggerProps = $props();

  const classes = $derived(cn(tagsInputClearTriggerBase, className));
</script>

<TagsInputClearTrigger aria-label="Clear all tags" class={classes} {...rest}>
  {@render children?.()}
</TagsInputClearTrigger>
