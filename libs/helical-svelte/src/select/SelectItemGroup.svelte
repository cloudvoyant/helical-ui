<!-- libs/helical-svelte/src/select/SelectItemGroup.svelte -->
<!-- Closely based on: Shark UI select (@ark-ui/svelte/select), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { SelectItemGroup, type SelectItemGroupProps } from '@ark-ui/svelte/select';

  let { class: className = '', children, ...rest }: SelectItemGroupProps = $props();
</script>

<SelectItemGroup class={className} {...rest}>
  {@render children?.()}
</SelectItemGroup>
