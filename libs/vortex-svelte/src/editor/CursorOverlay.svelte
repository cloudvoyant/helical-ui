<!-- libs/vortex-svelte/src/editor/CursorOverlay.svelte -->
<script lang="ts">
  import type { Editor } from '@tiptap/core';
  import type { Snippet } from 'svelte';

  interface OverlayPosition {
    left: number;
    top: number;
  }

  interface Props {
    editor: Editor;
    position: number;
    width: number;
    height: number;
    gap?: number;
    viewportGap?: number;
    lockScroll?: boolean;
    children: Snippet;
  }

  let {
    editor,
    position,
    width,
    height,
    gap,
    viewportGap,
    lockScroll = true,
    children,
  }: Props = $props();
  let surface = $state<HTMLDivElement | null>(null);
  let coords = $state<OverlayPosition>({ left: 0, top: 0 });

  // These small helpers mirror vortex-ui's shared core because Svelte package tooling can retain
  // stale declarations for newly-added workspace exports until after a full package rebuild.
  function updatePosition() {
    const rect = editor.view.coordsAtPos(position);
    const resolvedGap = gap ?? 8;
    const resolvedViewportGap = viewportGap ?? 16;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const preferredTop =
      spaceBelow < height && spaceAbove > spaceBelow ? rect.top - height - resolvedGap : rect.bottom + resolvedGap;
    coords = {
      left: Math.min(
        Math.max(rect.left, resolvedViewportGap),
        Math.max(window.innerWidth - width - resolvedViewportGap, resolvedViewportGap),
      ),
      top: Math.min(
        Math.max(preferredTop, resolvedViewportGap),
        Math.max(window.innerHeight - height - resolvedViewportGap, resolvedViewportGap),
      ),
    };
  }

  function findScrollContainer(): HTMLElement | null {
    let current = editor.view.dom.parentElement;
    while (current && current !== document.body) {
      const overflowY = window.getComputedStyle(current).overflowY;
      if (/(auto|scroll)/.test(overflowY) && current.scrollHeight > current.clientHeight) return current;
      current = current.parentElement;
    }
    return null;
  }

  $effect(() => {
    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  });

  $effect(() => {
    if (!lockScroll) return;
    const container = findScrollContainer();
    if (!container) return;
    const preventWheel = (event: WheelEvent) => {
      const target = event.target;
      if (target instanceof Node && surface?.contains(target)) return;
      event.preventDefault();
    };
    container.addEventListener('wheel', preventWheel, { passive: false });
    return () => container.removeEventListener('wheel', preventWheel);
  });
</script>

<div
  bind:this={surface}
  data-cursor-overlay
  class="fixed z-50"
  style:left="{coords.left}px"
  style:top="{coords.top}px"
>
  {@render children()}
</div>
