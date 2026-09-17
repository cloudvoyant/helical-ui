<!-- libs/helical-svelte/src/Textarea.svelte -->
<!-- Closely based on: Shark UI textarea (@ark-ui/svelte/field), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { FieldTextarea, type FieldTextareaProps } from '@ark-ui/svelte/field';
  import { textareaBase, cn } from '@cloudvoyant/helical-ui';

  let { class: className = '', children, ...rest }: FieldTextareaProps = $props();

  const classes = $derived(cn(textareaBase, className));
</script>

<FieldTextarea class={classes} {...rest}>
  {@render children?.()}
</FieldTextarea>
