<script lang="ts">
  import type { SlashCommandItem } from '@cloudvoyant/vortex-ui';
  import { onMount, tick } from 'svelte';
  import * as LucideIcons from 'lucide-svelte';
  import type { Component } from 'svelte';

  interface Props {
    items: SlashCommandItem[];
    command: (item: SlashCommandItem) => void;
  }

  let { items, command }: Props = $props();

  let selectedIndex = $state(0);
  let previousItemsKey = $state('');
  let menuScrollElement = $state<HTMLDivElement | undefined>();
  let itemElements = $state<Array<HTMLButtonElement | undefined>>([]);

  function getIcon(iconName: string): Component | undefined {
    return (LucideIcons as unknown as Record<string, Component | undefined>)[iconName];
  }

  function setSelectedIndex(index: number) {
    selectedIndex = index;
    void tick().then(() => {
      const viewport = menuScrollElement;
      const item = itemElements[index];
      if (!viewport || !item) return;
      const viewportRect = viewport.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      if (itemRect.top < viewportRect.top) viewport.scrollTop -= viewportRect.top - itemRect.top;
      else if (itemRect.bottom > viewportRect.bottom) viewport.scrollTop += itemRect.bottom - viewportRect.bottom;
    });
  }

  // Reset only when the command titles change. Suggestion can replace the items array during
  // keyboard navigation even when its contents are identical.
  $effect(() => {
    const itemsKey = items.map((item) => item.title).join('\u0000');
    if (itemsKey !== previousItemsKey) {
      previousItemsKey = itemsKey;
      setSelectedIndex(0);
    }
  });

  function selectItem(index: number) {
    const item = items[index];
    if (item) {
      command(item);
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (items.length === 0) return false;

    if (event.key === 'ArrowUp') {
      setSelectedIndex(Math.max(0, selectedIndex - 1));
      return true;
    }

    if (event.key === 'ArrowDown') {
      setSelectedIndex(Math.min(items.length - 1, selectedIndex + 1));
      return true;
    }

    if (event.key === 'Enter') {
      selectItem(selectedIndex);
      return true;
    }

    return false;
  }

  onMount(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (handleKeyDown(e)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Use capture phase to intercept before editor
    document.addEventListener('keydown', handleKey, true);
    return () => document.removeEventListener('keydown', handleKey, true);
  });
</script>

{#if items.length > 0}
  <div class="w-72 rounded-md border border-border bg-popover text-popover-foreground shadow-lg">
    <div
      bind:this={menuScrollElement}
      class="max-h-[320px] overflow-y-auto p-1"
      data-slash-menu-scroll
    >
      {#each items as item, index}
        {@const IconComponent = getIcon(item.icon)}
        <button
          type="button"
          class="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-popover-foreground hover:bg-accent hover:text-accent-foreground {index ===
          selectedIndex
            ? 'bg-accent text-accent-foreground'
            : ''}"
          bind:this={itemElements[index]}
          data-slash-selected={index === selectedIndex ? '' : undefined}
          onclick={() => selectItem(index)}
          onmousemove={() => setSelectedIndex(index)}
        >
          <span class="inline-flex w-5 justify-center opacity-70" data-slash-icon={item.icon} aria-hidden="true">
            {#if item.icon === 'YouTube'}
              <svg viewBox="0 0 24 24" class="size-4" fill="currentColor">
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12l-6.2 3.6Z" />
              </svg>
            {:else if IconComponent}
              <IconComponent size={16} />
            {/if}
          </span>
          <div class="flex-1 min-w-0">
            <span class="text-sm">{item.title}</span>
          </div>
        </button>
      {/each}
    </div>
  </div>
{/if}
