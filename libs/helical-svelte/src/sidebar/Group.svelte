<!-- libs/helical-svelte/src/sidebar/Group.svelte -->
<!-- Source: @ark-ui/svelte/factory (Ark UI), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { sidebarStyles, cn } from '@cloudvoyant/helical-ui';
  import Col from '../Col.svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    label?: string;
    class?: string;
    children?: Snippet;
  } & HTMLAttributes<HTMLDivElement>;

  let { label, class: className = '', children, ...rest }: Props = $props();
</script>

<Col data-slot="sidebar-group" data-sidebar="group" class={cn(sidebarStyles.groupClass, className)} {...rest}>
  {#if label}
    <div data-slot="sidebar-group-label" data-sidebar="group-label" class={cn(sidebarStyles.groupLabelClass)}>
      {label}
    </div>
  {/if}
  <div data-slot="sidebar-group-content" data-sidebar="group-content" class={cn(sidebarStyles.groupContentClass)}>
    {@render children?.()}
  </div>
</Col>
