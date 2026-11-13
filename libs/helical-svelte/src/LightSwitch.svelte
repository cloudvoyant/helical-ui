<!-- libs/helical-svelte/src/LightSwitch.svelte -->
<script lang="ts">
  // 1. Imports
  import {
    cn,
    cycleThemeModeValue,
    lightSwitchButtonVariants,
    readDocumentDarkMode,
    readSystemDarkMode,
    subscribeDocumentTheme,
    subscribeSystemDarkMode,
    syncDocumentDarkMode,
    type LightSwitchBaseProps,
    type ThemeMode,
  } from '@cloudvoyant/helical-ui';
  import { Monitor, Moon, Sun } from 'lucide-svelte';
  import Button from './Button.svelte';

  // 2. Module constants & types
  export interface LightSwitchProps extends LightSwitchBaseProps {
    class?: string;
  }

  // --- State ---
  let {
    mode: controlledMode,
    defaultMode,
    onModeChange,
    class: className,
  }: LightSwitchProps = $props();

  // svelte-ignore state_referenced_locally
  let uncontrolledMode = $state<ThemeMode>(
    defaultMode ?? (readDocumentDarkMode() ? 'dark' : 'light'),
  );
  let systemDark = $state<boolean>(readSystemDarkMode());
  const currentMode = $derived(controlledMode ?? uncontrolledMode);

  // --- Effects ---
  $effect(() => {
    const dark = currentMode === 'system' ? systemDark : currentMode === 'dark';
    syncDocumentDarkMode(dark);
  });

  $effect(() => subscribeSystemDarkMode((dark) => (systemDark = dark)));

  $effect(() => {
    if (controlledMode !== undefined) return;
    return subscribeDocumentTheme(({ dark }) => {
      const prevDark = uncontrolledMode === 'system' ? readSystemDarkMode() : uncontrolledMode === 'dark';
      if (prevDark !== dark) {
        uncontrolledMode = dark ? 'dark' : 'light';
      }
    });
  });

  // --- Methods ---
  function handleClick(): void {
    const next = cycleThemeModeValue(currentMode);
    if (controlledMode === undefined) {
      uncontrolledMode = next;
    }
    onModeChange?.(next);
  }
</script>

<Button
  variant="text"
  size="sm"
  class={cn(lightSwitchButtonVariants(), className)}
  aria-label={`Theme: ${currentMode}`}
  title={`Theme: ${currentMode}`}
  data-light-switch
  onclick={handleClick}
>
  {#if currentMode === 'light'}
    <Sun size={14} strokeWidth={1.5} />
  {:else if currentMode === 'dark'}
    <Moon size={14} strokeWidth={1.5} />
  {:else}
    <Monitor size={14} strokeWidth={1.5} />
  {/if}
</Button>
