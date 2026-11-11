<!-- libs/helical-svelte/src/theme/ThemeToggle.svelte -->
<script lang="ts">
  // 1. Imports
  import { cn, themeToggleButtonVariants } from '@cloudvoyant/helical-ui';
  import { Monitor, Moon, Sun } from 'lucide-svelte';
  import Button from '../Button.svelte';
  import { themeService } from './themeService.svelte';
  import type { ThemeToggleProps } from './types';

  // --- State ---
  let { theme = themeService, class: className }: ThemeToggleProps = $props();

  // --- Methods ---
  function handleClick(): void {
    theme.cycleThemeMode();
  }
</script>

<Button
  variant="text"
  size="sm"
  class={cn(themeToggleButtonVariants(), className)}
  aria-label={`Theme: ${theme.themeMode}`}
  title={`Theme: ${theme.themeMode}`}
  onclick={handleClick}
>
  {#if theme.themeMode === 'light'}
    <Sun size={14} strokeWidth={1.5} />
  {:else if theme.themeMode === 'dark'}
    <Moon size={14} strokeWidth={1.5} />
  {:else}
    <Monitor size={14} strokeWidth={1.5} />
  {/if}
</Button>
