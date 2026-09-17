<!-- libs/helical-svelte/src/navbar/NavbarRoot.svelte -->
<!-- Source: @cloudvoyant/helical-react navbar root (shadcnblocks navbar6/7, re-based on Ark UI) -->
<script lang="ts">
  import {
    navbarVariants,
    navbarContainerBase,
    navbarDensityVariants,
    navbarShrunkBase,
    cn,
    type NavbarDensity,
    type NavbarVariant,
  } from '@cloudvoyant/helical-ui';
  import { getNavbarContext, setNavbarContext } from './NavbarContext.svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    variant?: NavbarVariant;
    floating?: boolean;
    density?: NavbarDensity;
    class?: string;
    children?: Snippet;
  } & HTMLAttributes<HTMLElement>;

  let {
    variant = 'sticky',
    floating = false,
    density = 'relaxed',
    class: className = '',
    children,
    ...rest
  }: Props = $props();

  const parent = getNavbarContext();
  let headerEl = $state<HTMLElement>();

  // Resolve the nearest scrollable ancestor (e.g. a demo container with
  // overflow-y-auto); null means the viewport itself scrolls.
  function resolveScrollContainer(el: HTMLElement | undefined): HTMLElement | null {
    if (!el) return null;
    for (let n: HTMLElement | null = el; n; n = n.parentElement) {
      const oy = getComputedStyle(n).overflowY;
      if (oy === 'auto' || oy === 'scroll' || oy === 'overlay') return n;
    }
    return null;
  }

  // Listen to the nearest scrollable ancestor (e.g. a demo container with
  // overflow-y-auto); fall back to the window. `position: sticky` sticks
  // relative to that same container, so data-scrolled stays in sync.
  $effect(() => {
    if (!headerEl) return;
    const target = resolveScrollContainer(headerEl) ?? window;
    const getY = () => (target === window ? window.scrollY : (target as Element).scrollTop);
    const onScroll = () => parent.setScrolled(getY() > 24);
    onScroll();
    (target as EventTarget).addEventListener('scroll', onScroll, { passive: true });
    return () => (target as EventTarget).removeEventListener('scroll', onScroll);
  });

  // Anchor the mobile overlay to the element that contains the bar (its
  // parent), so it covers the surrounding container rather than the window.
  $effect(() => {
    parent.setPortalEl(headerEl?.parentElement ?? undefined);
  });

  // The mobile overlay portals into the bar's scroll container. Lock that
  // container's scroll while the overlay is open so the background can't be
  // scrolled past it; Ark's body scroll lock is disabled. When no ancestor is
  // scrollable the viewport scrolls, so lock the documentElement instead.
  $effect(() => {
    if (!parent.open) return;
    const el = resolveScrollContainer(headerEl) ?? document.documentElement;
    const prev = el.style.overflow;
    el.style.overflow = 'hidden';
    return () => {
      el.style.overflow = prev;
    };
  });

  setNavbarContext({
    get id() {
      return parent.id;
    },
    get open() {
      return parent.open;
    },
    setOpen: parent.setOpen,
    get scrolled() {
      return parent.scrolled;
    },
    setScrolled: parent.setScrolled,
    get hovered() {
      return parent.hovered;
    },
    setHovered: parent.setHovered,
    get slots() {
      return parent.slots;
    },
    setSlot: parent.setSlot,
    get portalEl() {
      return parent.portalEl;
    },
    setPortalEl: parent.setPortalEl,
    get variant() {
      return variant;
    },
    get floating() {
      return floating;
    },
    get density() {
      return density;
    },
  });

  const scrolled = $derived(parent.scrolled);
  const hidden = $derived(variant === 'hide' && parent.scrolled && !parent.hovered);
  const shrunk = $derived(variant === 'shrink' && parent.scrolled);
  const classes = $derived(
    cn(
      navbarVariants({ variant, floating }),
      navbarContainerBase,
      navbarDensityVariants({ density }),
      shrunk && navbarShrunkBase,
      className,
    ),
  );
</script>

<header
  bind:this={headerEl}
  data-slot="navbar"
  data-scrolled={scrolled || undefined}
  data-hidden={hidden || undefined}
  data-shrunk={shrunk || undefined}
  class={classes}
  onmouseenter={() => parent.setHovered(true)}
  onmouseleave={() => parent.setHovered(false)}
  {...rest}
>
  {@render children?.()}
</header>
