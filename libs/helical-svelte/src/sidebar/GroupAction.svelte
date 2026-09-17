<!-- libs/helical-svelte/src/SidebarGroupAction.svelte -->
<!-- Source: @ark-ui/svelte/factory (Ark UI), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import { sidebarStyles, cn } from '@cloudvoyant/helical-ui';
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes, HTMLAttributes } from 'svelte/elements';

  type Props = {
    asChild?: Snippet<[(props: HTMLButtonAttributes) => HTMLAttributes<HTMLElement>]>;
    class?: string;
    children?: Snippet;
  } & HTMLButtonAttributes;

  let { asChild, class: className = '', children, ...rest }: Props = $props();
</script>

<Ark
  as="button"
  data-slot="sidebar-group-action"
  data-sidebar="group-action"
  {asChild}
  type="button"
  class={cn(sidebarStyles.groupActionClass, className)}
  {...rest}
>
  {@render children?.()}
</Ark>
