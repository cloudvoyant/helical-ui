<!-- libs/helical-svelte/src/tabs/Tabs.svelte -->
<!-- Closely based on: Shark UI tabs (@ark-ui/svelte/tabs), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { TabsRoot, type TabsRootProps } from '@ark-ui/svelte/tabs';
  import { tabsRootBase, cn } from '@cloudvoyant/helical-ui';

  let {
    value,
    defaultValue,
    onValueChange,
    orientation = 'horizontal',
    lazyMount = true,
    unmountOnExit = true,
    class: className = '',
    children,
    ...rest
  }: TabsRootProps = $props();

  const classes = $derived(cn(tabsRootBase, className));
</script>

<TabsRoot {value} {defaultValue} {onValueChange} {orientation} {lazyMount} {unmountOnExit} class={classes} {...rest}>
  {@render children?.()}
</TabsRoot>
