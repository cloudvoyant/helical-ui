<!-- libs/helical-svelte/src/Kbd.svelte -->
<!-- Closely based on: @ark-ui/svelte/factory (Ark UI), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import {
    cn,
    formatKeyChord,
    formatKeySequence,
    kbdGroupBase,
    kbdVariants,
    type KbdProps as CoreKbdProps,
  } from '@cloudvoyant/helical-ui';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = Omit<CoreKbdProps, 'className' | 'children'> & {
    class?: string;
    children?: Snippet;
  } & HTMLAttributes<HTMLElement>;

  let {
    variant = 'outline',
    size = 'md',
    hotkey,
    platform,
    useSymbols = true,
    class: className = '',
    children,
    ...rest
  }: Props = $props();

  const isMultiStep = $derived(
    Boolean(
      hotkey &&
        !children &&
        (Array.isArray(hotkey) || (typeof hotkey === 'string' && /\s+/.test(hotkey.trim()))),
    ),
  );
  const steps = $derived(isMultiStep && hotkey ? formatKeySequence(hotkey, { platform, useSymbols }) : []);
  const formattedChord = $derived(
    hotkey && !children && !isMultiStep && typeof hotkey === 'string'
      ? formatKeyChord(hotkey, { platform, useSymbols })
      : null,
  );
  const itemClasses = $derived(cn(kbdVariants({ variant, size })));
  const singleClasses = $derived(cn(kbdVariants({ variant, size }), className));
</script>

{#if isMultiStep}
  <span data-slot="kbd-sequence" class={cn(kbdGroupBase, className)}>
    {#each steps as step, idx (`${step}-${idx}`)}
      <Ark
        as="kbd"
        data-slot="kbd"
        data-variant={variant}
        data-size={size}
        class={itemClasses}
        {...rest}
      >
        {step}
      </Ark>
    {/each}
  </span>
{:else if formattedChord !== null}
  <Ark
    as="kbd"
    data-slot="kbd"
    data-variant={variant}
    data-size={size}
    class={singleClasses}
    {...rest}
  >
    {formattedChord}
  </Ark>
{:else}
  <Ark
    as="kbd"
    data-slot="kbd"
    data-variant={variant}
    data-size={size}
    class={singleClasses}
    {...rest}
  >
    {@render children?.()}
  </Ark>
{/if}
