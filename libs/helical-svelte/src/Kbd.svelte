<!-- libs/helical-svelte/src/Kbd.svelte -->
<script lang="ts">
  // 1. Imports
  import { Ark } from '@ark-ui/svelte/factory';
  import {
    cn,
    kbdGroupBase,
    kbdVariants,
    resolveKbdSteps,
    type KbdProps as CoreKbdProps,
  } from '@cloudvoyant/helical-ui';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  // 2. Module constants & types
  type Props = Omit<CoreKbdProps, 'className' | 'children'> & {
    class?: string;
    children?: Snippet;
  } & HTMLAttributes<HTMLElement>;

  // --- State ---
  let {
    variant = 'outline',
    size = 'md',
    hotkey,
    useSymbols = true,
    class: className = '',
    children,
    ...rest
  }: Props = $props();

  // --- Helpers ---
  const resolved = $derived(
    hotkey !== undefined && !children
      ? resolveKbdSteps(hotkey, { useSymbols })
      : null,
  );
  const singleStep = $derived(
    resolved && resolved.steps.length === 1 ? resolved.steps[0]! : null,
  );
  const defaultClasses = $derived(cn(kbdVariants({ variant, size }), className));
</script>

{#if resolved && resolved.steps.length > 1}
  <span
    data-slot="kbd-sequence"
    data-invalid={!resolved.valid ? 'true' : undefined}
    title={!resolved.valid ? resolved.message : undefined}
    class={cn(kbdGroupBase, className)}
  >
    {#each resolved.steps as step, idx (`${step.raw}-${idx}`)}
      <Ark
        as="kbd"
        data-slot="kbd"
        data-variant={variant}
        data-size={size}
        data-invalid={!step.valid ? 'true' : undefined}
        aria-invalid={!step.valid ? 'true' : undefined}
        title={!step.valid ? [...step.errors, ...step.warnings].join('; ') : undefined}
        class={cn(kbdVariants({ variant, size, invalid: !step.valid }))}
        {...rest}
      >
        {step.label}
      </Ark>
    {/each}
  </span>
{:else if singleStep}
  <Ark
    as="kbd"
    data-slot="kbd"
    data-variant={variant}
    data-size={size}
    data-invalid={!singleStep.valid ? 'true' : undefined}
    aria-invalid={!singleStep.valid ? 'true' : undefined}
    title={!singleStep.valid && resolved ? resolved.message : undefined}
    class={cn(kbdVariants({ variant, size, invalid: !singleStep.valid }), className)}
    {...rest}
  >
    {singleStep.label}
  </Ark>
{:else}
  <Ark
    as="kbd"
    data-slot="kbd"
    data-variant={variant}
    data-size={size}
    class={defaultClasses}
    {...rest}
  >
    {@render children?.()}
  </Ark>
{/if}
