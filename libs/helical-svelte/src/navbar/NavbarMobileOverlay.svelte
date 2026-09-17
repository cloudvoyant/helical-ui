<!-- libs/helical-svelte/src/navbar/NavbarMobileOverlay.svelte -->
<!-- Source: @cloudvoyant/helical-react navbar mobile (Ark UI dialog overlay), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import {
    Root,
    DialogBackdrop,
    Positioner,
    DialogContent,
    DialogCloseTrigger,
    Title,
    DialogDescription,
  } from '@ark-ui/svelte/dialog';
  import { Portal } from '@ark-ui/svelte/portal';
  import {
    navbarMobileContentBase,
    navbarMobileHeaderBase,
    navbarMobileMenuBase,
    navbarMobileActionsBase,
    navbarTriggerVariants,
    cn,
  } from '@cloudvoyant/helical-ui';
  import { getNavbarContext } from './NavbarContext.svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    class?: string;
    children?: Snippet;
  } & HTMLAttributes<HTMLDivElement>;

  let { class: className = '', children, ...rest }: Props = $props();

  const navbar = getNavbarContext();
  const open = $derived(navbar.open);

  const classes = $derived(cn(navbarMobileContentBase, className));

  // Ark's focus trap doesn't engage for a controlled dialog (no DialogTrigger),
  // so Escape isn't handled — add a minimal fallback.
  $effect(() => {
    if (!open) return;
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') navbar.setOpen(false);
    };
    document.addEventListener('keydown', onKeydown);
    return () => document.removeEventListener('keydown', onKeydown);
  });
</script>

<Portal container={navbar.portalEl}>
  <Root {open} lazyMount unmountOnExit onOpenChange={(d: { open: boolean }) => navbar.setOpen(d.open)} preventScroll={false}>
    <DialogBackdrop class="absolute inset-0 z-[100] bg-background/60 backdrop-blur-sm" />
    <Positioner class="absolute inset-0 z-[100]">
      <DialogContent id={navbar.id} data-slot="navbar-mobile-overlay" class={classes} {...rest}>
        <Title class="sr-only">Navigation menu</Title>
        <DialogDescription class="sr-only">Mobile navigation menu</DialogDescription>
        <div class={navbarMobileHeaderBase}>
          {@render navbar.slots.brand?.()}
          <DialogCloseTrigger class={cn(navbarTriggerVariants({ floating: navbar.floating }))} aria-label="Close navigation menu">
            <svg
              class="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12"></path>
            </svg>
          </DialogCloseTrigger>
        </div>
        <div class={navbarMobileMenuBase}>
          {@render children?.()}
        </div>
        {#if navbar.slots.actions}
          <div class={navbarMobileActionsBase}>
            {@render navbar.slots.actions()}
          </div>
        {/if}
      </DialogContent>
    </Positioner>
  </Root>
</Portal>
