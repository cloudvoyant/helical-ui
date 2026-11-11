<!-- libs/helical-svelte/src/theme/ThemeToggle.svelte -->
<script lang="ts">
  // 1. Imports
  import {
    cn,
    cycleThemeModeValue,
    themeToggleButtonVariants,
  } from '@cloudvoyant/helical-ui';
  import { Monitor, Moon, Sun } from 'lucide-svelte';
  import Button from '../Button.svelte';
  import { themeService } from './theme-service.svelte';
  import type { ThemeToggleProps } from './types';

  // --- State ---
  let {
    theme = themeService,
    mode: controlledMode,
    defaultMode,
    onModeChange,
    class: className,
  }: ThemeToggleProps = $props();

  const currentMode = $derived(controlledMode ?? theme.themeMode);

  // --- Effects ---
  $effect(() => {
    if (defaultMode && controlledMode === undefined) {
      theme.setThemeMode(defaultMode, false);
    }
  });

  // --- Methods ---
  function handleClick(): void {
    const next = cycleThemeModeValue(currentMode);
    if (controlledMode === undefined) {
      theme.setThemeMode(next);
    }
    onModeChange?.(next);
  }
</script>

<Button
  variant="text"
  size="sm"
  class={cn(themeToggleButtonVariants(), className)}
  aria-label={`Theme: ${currentMode}`}
  title={`Theme: ${currentMode}`}
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
