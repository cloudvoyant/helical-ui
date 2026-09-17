<!-- libs/helical-svelte/src/navbar/NavbarProvider.svelte -->
<!-- Source: @cloudvoyant/helical-react navbar provider (shadcnblocks navbar6/7, re-based on Ark UI) -->
<script module lang="ts">
  let navbarIdCounter = 0;
</script>

<script lang="ts">
  import { setNavbarContext } from './NavbarContext.svelte';
  import type { NavbarDensity, NavbarVariant } from '@cloudvoyant/helical-ui';
  import type { Snippet } from 'svelte';

  type Props = {
    defaultOpen?: boolean;
    children?: Snippet;
  };

  let { defaultOpen = false, children }: Props = $props();

  let id = $state(`helical-ui-navbar-${++navbarIdCounter}`);
  let open = $state(defaultOpen);
  let scrolled = $state(false);
  let hovered = $state(false);
  let slots = $state<{ brand?: Snippet; actions?: Snippet }>({});
  let portalEl = $state<HTMLElement>();

  function setOpen(value: boolean) {
    open = value;
  }

  function setScrolled(value: boolean) {
    scrolled = value;
  }

  function setHovered(value: boolean) {
    hovered = value;
  }

  function setSlot(key: 'brand' | 'actions', node: Snippet | undefined) {
    slots[key] = node;
  }

  function setPortalEl(el: HTMLElement | undefined) {
    portalEl = el;
  }

  setNavbarContext({
    get id() {
      return id;
    },
    get open() {
      return open;
    },
    setOpen,
    get scrolled() {
      return scrolled;
    },
    setScrolled,
    get hovered() {
      return hovered;
    },
    setHovered,
    get slots() {
      return slots;
    },
    setSlot,
    get portalEl() {
      return portalEl;
    },
    setPortalEl,
    // Baseline config; NavbarRoot overrides these with its props.
    get variant() {
      return 'sticky' as NavbarVariant;
    },
    get floating() {
      return false;
    },
    get density() {
      return 'relaxed' as NavbarDensity;
    },
  });
</script>

{@render children?.()}
