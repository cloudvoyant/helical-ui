<!-- libs/helical-svelte/src/select/SelectItemText.svelte -->
<!-- Closely based on: Shark UI select (@ark-ui/svelte/select), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { SelectItemText, type SelectItemTextProps } from '@ark-ui/svelte/select';
  import { selectItemTextBase, cn } from '@cloudvoyant/helical-ui';

  let { class: className = '', children, ...rest }: SelectItemTextProps = $props();

  const classes = $derived(cn(selectItemTextBase, className));
</script>

<SelectItemText class={classes} {...rest}>
  {@render children?.()}
</SelectItemText>
