<!-- libs/helical-svelte/src/tabs/TabsList.svelte -->
<!-- Closely based on: Shark UI tabs (@ark-ui/svelte/tabs), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { TabList, TabIndicator, type TabListProps } from '@ark-ui/svelte/tabs';
  import { tabsListBase, tabsListVariants, tabsIndicatorBase, tabsIndicatorVariants, cn } from '@cloudvoyant/helical-ui';

  type Props = TabListProps & {
    variant?: 'default' | 'underline';
  };

  let { variant = 'default', class: className = '', children, ...rest }: Props = $props();

  const classes = $derived(cn(tabsListBase, tabsListVariants({ variant }), className));
  const indicatorClasses = $derived(cn(tabsIndicatorBase, tabsIndicatorVariants({ variant })));
</script>

<TabList class={classes} {...rest}>
  {@render children?.()}
  <TabIndicator class={indicatorClasses} />
</TabList>
