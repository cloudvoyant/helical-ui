<!-- libs/helical-svelte/src/SidebarFooter.svelte -->
<!-- Source: @ark-ui/svelte/factory (Ark UI), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { sidebarStyles, cn } from '@cloudvoyant/helical-ui';
  import Col from '../Col.svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    class?: string;
    children?: Snippet;
  } & HTMLAttributes<HTMLDivElement>;

  let { class: className = '', children, ...rest }: Props = $props();
</script>

<Col data-slot="sidebar-footer" data-sidebar="footer" class={cn(sidebarStyles.footerClass, className)} {...rest}>
  {@render children?.()}
</Col>
