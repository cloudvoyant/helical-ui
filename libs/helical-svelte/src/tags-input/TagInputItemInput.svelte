<!-- libs/helical-svelte/src/tags-input/TagInputItemInput.svelte -->
<!-- Closely based on: Shark UI tags input (@ark-ui/svelte/tags-input), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { TagsInputItemInput, type TagsInputItemInputProps } from '@ark-ui/svelte/tags-input';
  import { tagsInputItemInputBase, cn } from '@cloudvoyant/helical-ui';

  let { class: className = '', ...rest }: TagsInputItemInputProps = $props();

  const classes = $derived(cn(tagsInputItemInputBase, className));
</script>

<TagsInputItemInput class={classes} {...rest} />
