<!-- libs/helical-svelte/src/SidebarMenuAction.svelte -->
<!-- Source: @ark-ui/svelte/factory (Ark UI), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import { sidebarStyles, cn } from '@cloudvoyant/helical-ui';
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes, HTMLAttributes } from 'svelte/elements';

  type Props = {
    asChild?: Snippet<[(props: HTMLButtonAttributes) => HTMLAttributes<HTMLElement>]>;
    showOnHover?: boolean;
    class?: string;
    children?: Snippet;
  } & HTMLButtonAttributes;

  let { asChild, showOnHover = false, class: className = '', children, ...rest }: Props = $props();
</script>

<Ark
  as="button"
  data-slot="sidebar-menu-action"
  data-sidebar="menu-action"
  {asChild}
  type="button"
  class={cn(
    sidebarStyles.menuActionClass,
    showOnHover &&
      'group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground data-[state=open]:opacity-100 md:opacity-0',
    className,
  )}
  {...rest}
>
  {@render children?.()}
</Ark>
