<!-- libs/helical-svelte/src/SidebarSeparator.svelte -->
<!-- Source: @ark-ui/svelte/factory (Ark UI), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import { sidebarStyles, cn } from '@cloudvoyant/helical-ui';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    class?: string;
  } & HTMLAttributes<HTMLDivElement>;

  let { class: className = '', ...rest }: Props = $props();
</script>

<Ark
  as="div"
  data-slot="sidebar-separator"
  data-sidebar="separator"
  role="separator"
  class={cn(sidebarStyles.separatorClass, className)}
  {...rest}
/>
