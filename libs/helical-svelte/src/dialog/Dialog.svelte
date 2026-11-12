<!-- libs/helical-svelte/src/dialog/Dialog.svelte -->
<!-- Closely based on: Ark UI dialog (@ark-ui/svelte/dialog), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  // 1. Imports
  import { Root as DialogRoot, type DialogRootProps } from '@ark-ui/svelte/dialog';
  import { captureDialogFocusTarget, restoreDialogFocusTarget } from '@cloudvoyant/helical-ui';

  // --- State ---
  let {
    children,
    open = $bindable(undefined),
    defaultOpen = false,
    restoreFocus = true,
    onOpenChange,
    ...rest
  }: DialogRootProps = $props();

  // svelte-ignore state_referenced_locally
  let uncontrolledOpen = $state(Boolean(defaultOpen));
  let previousFocusEl: HTMLElement | null = null;
  let wasOpen = false;

  const isOpen = $derived(open ?? uncontrolledOpen);

  // --- Effects ---
  $effect.pre(() => {
    if (isOpen && !wasOpen) {
      const captured = captureDialogFocusTarget();
      if (captured) {
        previousFocusEl = captured;
      }
      wasOpen = true;
    } else if (!isOpen && wasOpen) {
      wasOpen = false;
      const target = previousFocusEl;
      previousFocusEl = null;
      if (restoreFocus) {
        restoreDialogFocusTarget(target);
      }
    }
  });

  // --- Methods ---
  function handleOpenChange(details: { open: boolean }) {
    if (details.open && !isOpen) {
      const captured = captureDialogFocusTarget();
      if (captured) {
        previousFocusEl = captured;
      }
    }
    if (open !== undefined) {
      open = details.open;
    } else {
      uncontrolledOpen = details.open;
    }
    if (!details.open && wasOpen) {
      wasOpen = false;
      const target = previousFocusEl;
      previousFocusEl = null;
      if (restoreFocus) {
        restoreDialogFocusTarget(target);
      }
    }
    onOpenChange?.(details);
  }
</script>

<DialogRoot open={isOpen} restoreFocus={false} onOpenChange={handleOpenChange} {...rest}>
  {@render children?.()}
</DialogRoot>
