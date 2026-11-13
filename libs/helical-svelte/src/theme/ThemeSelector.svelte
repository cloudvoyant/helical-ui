<!-- libs/helical-svelte/src/theme/ThemeSelector.svelte -->
<script lang="ts">
  // 1. Imports
  import {
    THEMES,
    cn,
    readDocumentDarkMode,
    readDocumentTheme,
    registerCustomThemes,
    subscribeDocumentTheme,
    syncDocumentTheme,
    themeSelectorStyles,
    type ThemeMeta,
    type ThemeName,
  } from '@cloudvoyant/helical-ui';
  import { themeService } from './theme-service.svelte';
  import type { ThemeSelectorProps } from './types';

  // --- State ---
  let {
    theme = themeService,
    value: controlledValue,
    defaultValue,
    themes,
    customThemes,
    onValueChange,
    class: className,
  }: ThemeSelectorProps = $props();

  // svelte-ignore state_referenced_locally
  let uncontrolledValue = $state<ThemeName>(defaultValue ?? readDocumentTheme());
  let isDark = $state<boolean>(readDocumentDarkMode());
  let storeThemes = $state<readonly ThemeMeta[]>(THEMES);

  const resolvedThemes = $derived.by(() => {
    if (themes && themes.length > 0) {
      registerCustomThemes(themes);
      return themes;
    }
    if (customThemes && customThemes.length > 0) {
      return registerCustomThemes(customThemes);
    }
    return storeThemes;
  });

  const activeTheme = $derived(controlledValue ?? uncontrolledValue);

  // --- Effects ---
  $effect(() => {
    if (customThemes && customThemes.length > 0) {
      theme.registerCustomThemes(customThemes);
    } else if (themes && themes.length > 0) {
      theme.registerCustomThemes(themes);
    }
  });

  $effect(() => {
    if (defaultValue && controlledValue === undefined) {
      const applied = syncDocumentTheme(defaultValue);
      uncontrolledValue = applied;
    }
  });

  $effect(() => {
    return subscribeDocumentTheme(({ theme: docTheme, dark, themes: nextThemes }) => {
      isDark = dark;
      storeThemes = nextThemes;
      if (controlledValue === undefined) {
        uncontrolledValue = docTheme;
      }
    });
  });

  // --- Methods ---
  function handleSelect(name: ThemeName): void {
    const applied = syncDocumentTheme(name);
    if (controlledValue === undefined) {
      uncontrolledValue = applied;
    }
    theme.setTheme(applied);
    onValueChange?.(applied);
  }
</script>

<div class={cn(themeSelectorStyles.container, className)} data-theme-selector-grid>
  {#each resolvedThemes as t (`css-${t.name}`)}
    {#if t.css}
      {@html `<style data-helical-custom-theme="${t.name}">${t.css}</style>`}
    {/if}
  {/each}
  <div
    class={themeSelectorStyles.grid}
    style="--font-sans: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;"
  >
    {#each resolvedThemes as t (t.name)}
      {@const active = activeTheme === t.name}
      <button
        type="button"
        title={t.label}
        aria-pressed={active}
        data-theme-swatch={t.name}
        onclick={() => handleSelect(t.name)}
        class={cn(
          `theme-${t.name}`,
          isDark && 'dark',
          themeSelectorStyles.swatch({ active }),
        )}
      >
        {#if active}
          <span class="absolute right-1 top-1 size-1.5 rounded-full bg-green-500"></span>
        {/if}
        <div class="flex h-9 flex-col justify-center gap-1 rounded-sm bg-foreground/10 p-1.5">
          <div class="h-1.5 w-4/5 rounded-full bg-primary"></div>
          <div class="h-1.5 w-3/5 rounded-full bg-foreground/40"></div>
        </div>
        <span class="truncate text-[11px] font-medium" style="font-family: var(--font-sans);">
          {t.label}
        </span>
      </button>
    {/each}
  </div>
</div>
