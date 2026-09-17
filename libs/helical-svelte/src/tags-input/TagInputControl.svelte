<!-- libs/helical-svelte/src/tags-input/TagInputControl.svelte -->
<!-- Closely based on: Shark UI tags input (@ark-ui/svelte/tags-input), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { TagsInputControl, type TagsInputControlProps } from '@ark-ui/svelte/tags-input';
  import { tagsInputControlBase, cn } from '@cloudvoyant/helical-ui';

  let { class: className = '', children, ...rest }: TagsInputControlProps = $props();

  const classes = $derived(cn(tagsInputControlBase, className));
</script>

<TagsInputControl class={classes} {...rest}>
  {@render children?.()}
</TagsInputControl>
