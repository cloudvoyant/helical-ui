<!-- libs/helical-svelte/src/navbar/NavbarActivationArea.svelte -->
<!-- Source: @cloudvoyant/helical-react navbar activation area (hover reveal for variant="hide") -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import { navbarActivationAreaBase, cn } from '@cloudvoyant/helical-ui';
  import { getNavbarContext } from './NavbarContext.svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    class?: string;
    children?: Snippet;
  } & HTMLAttributes<HTMLDivElement>;

  let { class: className = '', children, ...rest }: Props = $props();

  const navbar = getNavbarContext();
  const classes = $derived(cn(navbarActivationAreaBase, className));
</script>

<Ark
  as="div"
  data-slot="navbar-activation-area"
  class={classes}
  onmouseenter={() => navbar.setHovered(true)}
  onmouseleave={() => navbar.setHovered(false)}
  {...rest}
>
  {@render children?.()}
</Ark>
