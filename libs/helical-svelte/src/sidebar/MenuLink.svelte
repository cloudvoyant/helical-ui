<!-- libs/helical-svelte/src/sidebar/MenuLink.svelte -->
<!-- Source: @cloudvoyant/helical-react sidebar shorthand (shadcn/ui sidebar, re-based on Ark UI) -->
<!-- Renders a single menu item: <li> > <a|button>, with icon, label, active state,
     and (in the collapsed icon-rail state) a tooltip. Composes SidebarMenuButton
     for the button styles + tooltip behavior. -->
<script lang="ts">
  import { sidebarStyles, cn } from '@cloudvoyant/helical-ui';
  import MenuButton from './MenuButton.svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';

  type MenuButtonProps = {
    isActive?: boolean;
    variant?: 'default' | 'outline';
    size?: 'default' | 'sm' | 'lg';
    tooltip?: string | { class?: string; children?: Snippet };
    class?: string;
  };

  type Props = MenuButtonProps & {
    icon?: Snippet;
    href?: string;
    onclick?: (event: MouseEvent) => void;
    children?: Snippet;
  } & HTMLAttributes<HTMLLIElement>;

  let {
    icon,
    href,
    onclick,
    isActive = false,
    variant = 'default',
    size = 'default',
    tooltip,
    class: className = '',
    children,
    ...rest
  }: Props = $props();
</script>

{#snippet content()}
  {#if icon}
    {@render icon()}
  {/if}
  {#if children}
    <span>{@render children()}</span>
  {/if}
{/snippet}

{#snippet anchor(propsFn: (props?: HTMLButtonAttributes) => HTMLAttributes<HTMLElement>)}
  <a
    href={href}
    onclick={onclick}
    {...propsFn()}
  >
    {@render content()}
  </a>
{/snippet}

<li data-slot="sidebar-menu-item" data-sidebar="menu-item" class={cn(sidebarStyles.menuItemClass)} {...rest}>
  {#if href != null}
    <MenuButton asChild={anchor} {isActive} {variant} {size} {tooltip} class={className} />
  {:else}
    <MenuButton {onclick} {isActive} {variant} {size} {tooltip} class={className}>{@render content()}</MenuButton>
  {/if}
</li>
