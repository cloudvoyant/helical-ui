<script lang="ts">
  import type { MentionItem, MentionListElement } from '@cloudvoyant/vortex-ui';

  let {
    items = [],
    command,
    clientRect,
  }: {
    items: MentionItem[];
    command: (item: Partial<MentionItem>) => void;
    clientRect: (() => DOMRect | null) | null;
  } = $props();

  let selectedIndex = $state(0);
  let element: HTMLElement;

  // Expose keyboard handler globally for TipTap
  $effect(() => {
    if (element) {
      (element as MentionListElement).__mentionListKeyDown = onKeyDown;
    }
  });

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      selectedIndex = Math.max(0, selectedIndex - 1);
      return true;
    }
    if (event.key === 'ArrowDown') {
      selectedIndex = Math.min(items.length - 1, selectedIndex + 1);
      return true;
    }
    if (event.key === 'Enter') {
      selectItem(selectedIndex);
      return true;
    }
    return false;
  }

  function selectItem(index: number) {
    const item = items[index];
    if (item) {
      command({
        id: item.id,
        // `label` is the display name; `title` is optional and undefined for user mentions.
        label: item.label,
        type: item.type,
        seriesId: item.seriesId || null,
      });
    }
  }

  // Position dropdown
  $effect(() => {
    if (element && clientRect) {
      const rect = clientRect();
      if (rect) {
        element.style.top = `${rect.bottom + window.scrollY}px`;
        element.style.left = `${rect.left + window.scrollX}px`;
      }
    }
  });

  // Reset selected index when items change
  $effect(() => {
    if (items.length > 0 && selectedIndex >= items.length) {
      selectedIndex = 0;
    }
  });

  // Expose onKeyDown for parent
  export function ref() {
    return { onKeyDown };
  }
</script>

<div bind:this={element} class="mention-list">
  {#if items.length === 0}
    <div class="empty">No results</div>
  {:else}
    <ul>
      {#each items as item, index}
        <li class:selected={index === selectedIndex}>
          <button type="button" class="mention-item-button" onclick={() => selectItem(index)}>
            <!-- `label` is the display name (id/label/type/seriesId/title); `title` is an
                 optional extra and is undefined for plain user mentions. -->
            <div class="title">{item.label}</div>
            <div class="type-label">{item.type}</div>
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .mention-list {
    position: absolute;
    z-index: 1000;
    max-height: 300px;
    overflow-y: auto;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    min-width: 280px;
  }

  :global(.dark) .mention-list {
    background: #1f2937;
    border-color: #374151;
  }

  ul {
    list-style: none;
    padding: 0.25rem;
    margin: 0;
  }

  li {
    padding: 0;
    margin: 0;
  }

  .mention-item-button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.375rem 0.5rem;
    border-radius: 0.25rem;
    cursor: pointer;
    color: #111827;
    transition: background-color 0.1s;
    background: none;
    border: none;
    text-align: left;
  }

  :global(.dark) .mention-item-button {
    color: #f9fafb;
  }

  .mention-item-button:hover,
  li.selected .mention-item-button {
    background: #f3f4f6;
  }

  :global(.dark) li:hover,
  :global(.dark) li.selected {
    background: #374151;
  }

  .title {
    flex: 1;
    font-size: 0.875rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .type-label {
    font-size: 0.75rem;
    font-style: italic;
    color: #6b7280;
    flex-shrink: 0;
  }

  :global(.dark) .type-label {
    color: #9ca3af;
  }

  .empty {
    padding: 0.75rem;
    text-align: center;
    font-size: 0.875rem;
    color: #9ca3af;
  }

  :global(.dark) .empty {
    color: #6b7280;
  }
</style>
