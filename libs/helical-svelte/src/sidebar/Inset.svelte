<!-- libs/helical-svelte/src/sidebar/Inset.svelte -->
<!-- Source: @ark-ui/svelte/factory (Ark UI), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import { sidebarStyles, cn } from '@cloudvoyant/helical-ui';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    class?: string;
    children?: Snippet;
  } & HTMLAttributes<HTMLElement>;

  let { class: className = '', children, ...rest }: Props = $props();
</script>

<Ark as="main" data-slot="sidebar-inset" class={cn(sidebarStyles.insetClass, className)} {...rest}>
  {@render children?.()}
</Ark>
