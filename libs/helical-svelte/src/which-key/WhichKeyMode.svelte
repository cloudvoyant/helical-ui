<!-- libs/helical-svelte/src/which-key/WhichKeyMode.svelte -->
<script lang="ts">
  import {
    cn,
    whichKeyModeBadgeVariants,
    type WhichKeyModeProps as CoreWhichKeyModeProps,
  } from '@cloudvoyant/helical-ui';
  import type { HTMLAttributes } from 'svelte/elements';
  import { useWhichKey } from './context.svelte';

  type Props = Omit<CoreWhichKeyModeProps, 'className'> &
    Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
      class?: string;
      className?: string;
    };

  let {
    mode: modeProp,
    sticky: stickyProp,
    showPreset = false,
    size = 'sm',
    class: className = '',
    className: reactClassName = '',
    ...rest
  }: Props = $props();

  const wk = useWhichKey();
  const resolvedMode = $derived(modeProp ?? wk.mode);
  const resolvedSticky = $derived(stickyProp ?? wk.sticky);
  const modeLabel = $derived(resolvedSticky ? `${resolvedMode}·lock` : resolvedMode);
  const label = $derived(showPreset ? `${wk.preset} · ${modeLabel}` : modeLabel);
</script>

<span
  data-slot="which-key-mode"
  data-testid="which-key-mode-badge"
  data-mode={resolvedMode}
  data-sticky={resolvedSticky ? 'true' : 'false'}
  data-preset={wk.preset}
  class={cn(whichKeyModeBadgeVariants({ mode: resolvedMode, size }), className, reactClassName)}
  {...rest}
>
  {label}
</span>
