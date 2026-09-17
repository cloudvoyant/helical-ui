<!-- libs/helical-svelte/src/SidebarMenuButton.svelte -->
<!-- Source: @ark-ui/svelte/factory + tooltip (Ark UI), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import { TooltipRoot, TooltipTrigger, TooltipPositioner, TooltipContent } from '@ark-ui/svelte/tooltip';
  import { sidebarMenuButtonVariants, sidebarStyles, cn } from '@cloudvoyant/helical-ui';
  import { getSidebarContext } from './context.svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes, HTMLAttributes } from 'svelte/elements';

  type TooltipContentProps = {
    class?: string;
    children?: Snippet;
  };

  type Props = {
    asChild?: Snippet<[(props?: HTMLButtonAttributes) => HTMLAttributes<HTMLElement>]>;
    isActive?: boolean;
    variant?: 'default' | 'outline';
    size?: 'default' | 'sm' | 'lg';
    tooltip?: string | TooltipContentProps;
    class?: string;
    children?: Snippet;
  } & HTMLButtonAttributes;

  let {
    asChild,
    isActive = false,
    variant = 'default',
    size = 'default',
    tooltip,
    class: className = '',
    children,
    ...rest
  }: Props = $props();

  const sidebar = getSidebarContext();
  const state = $derived(sidebar.state);
  const isMobile = $derived(sidebar.isMobile);

  const classes = $derived(cn(sidebarMenuButtonVariants({ variant, size }), className));

  const showTooltip = $derived(Boolean(tooltip) && state === 'collapsed' && !isMobile);
</script>

{#snippet button(propsFn: (props?: HTMLButtonAttributes) => HTMLAttributes<HTMLElement> = () => ({}))}
  <Ark
    as="button"
    data-slot="sidebar-menu-button"
    data-sidebar="menu-button"
    data-size={size}
    data-active={isActive}
    {asChild}
    type="button"
    class={classes}
    {...propsFn ? propsFn() : {}}
    {...rest}
  >
    {@render children?.()}
  </Ark>
{/snippet}

{#if showTooltip}
  <TooltipRoot openDelay={0} positioning={{ placement: 'right', gutter: 8 }}>
    <TooltipTrigger asChild={button} />
    <TooltipPositioner>
      <TooltipContent
        class={cn(sidebarStyles.tooltipContentClass, typeof tooltip === 'object' ? tooltip.class : undefined)}
      >
        {#if typeof tooltip === 'string'}
          {tooltip}
        {:else}
          {@render tooltip?.children?.()}
        {/if}
      </TooltipContent>
    </TooltipPositioner>
  </TooltipRoot>
{:else}
  {@render button()}
{/if}
