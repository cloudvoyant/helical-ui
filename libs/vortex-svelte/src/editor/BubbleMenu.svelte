<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { Editor } from '@tiptap/core';
  import FontColorPicker from './FontColorPicker.svelte';
  import LinkEditPopover from './LinkEditPopover.svelte';
  import {
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Link2,
  } from 'lucide-svelte';

  interface Props {
    editor: Editor;
  }

  let props: Props = $props();

  let menu: HTMLDivElement = $state() as HTMLDivElement;
  let showLinkInput = $state(false);
  let linkUrl = $state('');
  let showFontColorPicker = $state(false);
  let showHighlightPicker = $state(false);
  let isVisible = $state(false);
  let currentTextColor = $state<string | null>(null);
  let currentHighlight = $state<string | null>(null);
  let dismissedSelection = $state<string | null>(null);

  // Reset picker states when menu closes
  $effect(() => {
    if (!isVisible) {
      showFontColorPicker = false;
      showHighlightPicker = false;
      showLinkInput = false;
    }
  });

  function findEditorScrollContainer(editorElement: HTMLElement): HTMLElement | null {
    let current = editorElement.parentElement;
    while (current && current !== document.body) {
      const overflowY = window.getComputedStyle(current).overflowY;
      if (/(auto|scroll)/.test(overflowY) && current.scrollHeight > current.clientHeight) return current;
      current = current.parentElement;
    }
    return null;
  }

  $effect(() => {
    if (!showLinkInput) return;
    const container = findEditorScrollContainer(props.editor.view.dom);
    if (!container) return;
    const preventWheel = (event: WheelEvent) => event.preventDefault();
    container.addEventListener('wheel', preventWheel, { passive: false });
    return () => container.removeEventListener('wheel', preventWheel);
  });

  function updateColors() {
    if (!props.editor) return;
    currentTextColor = props.editor.getAttributes('textStyle')?.color || null;
    currentHighlight = props.editor.getAttributes('highlight')?.color || null;
  }

  function updatePosition() {
    if (!props.editor) return;

    const { from, to, empty } = props.editor.state.selection;
    const selectionKey = `${from}:${to}`;

    if (dismissedSelection === selectionKey) {
      isVisible = false;
      return;
    }
    if (dismissedSelection && dismissedSelection !== selectionKey) dismissedSelection = null;

    // Image node selections use their own controls; the text bubble menu must stay hidden.
    if (props.editor.isActive('imageNode')) {
      isVisible = false;
      showLinkInput = false;
      return;
    }

    // Hide if the editor is blurred or there is no text selection.
    if ((!props.editor.isFocused && !showLinkInput) || empty || from === to) {
      isVisible = false;
      showLinkInput = false;
      return;
    }

    isVisible = true;
    updateColors();

    // Auto-show link popover when selecting a link
    const isLinkActive = props.editor.isActive('link');
    const isInternalMentionActive = props.editor.isActive('internalMention');

    if (isLinkActive && !isInternalMentionActive) {
      showLinkInput = true;
      const { href } = props.editor.getAttributes('link');
      linkUrl = href || '';
    }

    // Defer positioning so the browser has time to finalize the native
    // selection — necessary for double-click which fires the transaction
    // event before the DOM selection is updated.
    requestAnimationFrame(() => {
      if (!menu || !isVisible) return;

      const nativeSelection = window.getSelection();
      let rect: DOMRect | null = null;
      if (nativeSelection && nativeSelection.rangeCount > 0) {
        rect = nativeSelection.getRangeAt(0).getBoundingClientRect();
      }

      let left: number;
      let top: number;
      let selectionBottom: number;

      if (!rect || rect.width === 0) {
        // Fall back to coordsAtPos
        const { view } = props.editor;
        const start = view.coordsAtPos(from);
        const end = view.coordsAtPos(to);
        left = Math.round((start.left + end.left) / 2 - menu.offsetWidth / 2);
        top = Math.round(start.top - menu.offsetHeight - 8);
        selectionBottom = end.bottom;
      } else {
        left = Math.round(rect.left + rect.width / 2 - menu.offsetWidth / 2);
        top = Math.round(rect.top - menu.offsetHeight - 8);
        selectionBottom = rect.bottom;
      }

      // Mirror the React BubbleMenu, which uses floating-ui with `placement: 'top'` and flips to
      // the opposite side when the preferred side has no room. Without the flip a selection near
      // the top of the viewport parks the menu at a negative offset: offscreen and unclickable.
      const GAP = 8;
      if (top < GAP) {
        top = Math.round(selectionBottom + GAP);
      }

      // Same reasoning horizontally — a menu overflowing a viewport edge is partly unreachable.
      const maxLeft = window.innerWidth - menu.offsetWidth - GAP;
      left = Math.min(Math.max(left, GAP), Math.max(maxLeft, GAP));

      menu.style.left = `${left}px`;
      menu.style.top = `${top}px`;
      menu.style.transform = 'translateZ(0)';
    });
  }

  onMount(() => {
    if (!props.editor) return;

    // Update on selection change
    props.editor.on('selectionUpdate', updatePosition);
    props.editor.on('transaction', updatePosition);

    // Update on scroll, dismiss outside both interactive surfaces, and keep Escape dismissal
    // tied to the current selection. A raw editor blur cannot be used here because toolbar
    // pointerdown blurs ProseMirror before the button click runs.
    const handleScroll = () => requestAnimationFrame(updatePosition);
    const handlePointerDown = (event: PointerEvent) => {
      if (!(event.target instanceof Node)) return;
      if (menu.contains(event.target) || props.editor.view.dom.contains(event.target)) return;
      isVisible = false;
      showLinkInput = false;
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || props.editor.state.selection.empty) return;
      dismissedSelection = `${props.editor.state.selection.from}:${props.editor.state.selection.to}`;
      isVisible = false;
    };
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('pointerdown', handlePointerDown, true);
    window.addEventListener('keydown', handleEscape, true);

    // Initial update
    requestAnimationFrame(updatePosition);

    return () => {
      props.editor.off('selectionUpdate', updatePosition);
      props.editor.off('transaction', updatePosition);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('pointerdown', handlePointerDown, true);
      window.removeEventListener('keydown', handleEscape, true);
    };
  });

  onDestroy(() => {
    // Cleanup handled by onMount return
  });

  function toggleBold() {
    props.editor.chain().focus().toggleBold().run();
  }

  function toggleItalic() {
    props.editor.chain().focus().toggleItalic().run();
  }

  function toggleUnderline() {
    props.editor.chain().focus().toggleUnderline().run();
  }

  function toggleStrike() {
    props.editor.chain().focus().toggleStrike().run();
  }

  function toggleLink() {
    // Always show input to add or edit link
    showLinkInput = true;
    const { href } = props.editor.getAttributes('link');
    linkUrl = href || '';
  }

  function setTextAlign(alignment: 'left' | 'center' | 'right' | 'justify') {
    props.editor.chain().focus().setTextAlign(alignment).run();
  }

</script>

<div
  bind:this={menu}
  onmousedown={(event) => {
    const target = event.target;
    if (target instanceof Element && target.closest('[data-link-editor]')) return;
    event.preventDefault();
  }}
  role="toolbar"
  aria-label="Text formatting"
  tabindex="-1"
  class="fixed z-50 flex items-center gap-1 rounded-lg border bg-popover text-popover-foreground p-1 shadow-lg transition-opacity"
  style="opacity: {isVisible ? 1 : 0}; pointer-events: {isVisible ? 'auto' : 'none'}"
>
  <!-- Text formatting -->
  <button
    type="button"
    class="rounded px-3 py-1 hover:bg-accent hover:text-accent-foreground {props.editor.isActive('bold')
      ? 'bg-accent text-accent-foreground'
      : ''}"
    onclick={toggleBold}
    aria-label="Bold"
    title="Bold"
  >
    <strong>B</strong>
  </button>
  <button
    type="button"
    class="rounded px-3 py-1 hover:bg-accent hover:text-accent-foreground {props.editor.isActive('italic')
      ? 'bg-accent text-accent-foreground'
      : ''}"
    onclick={toggleItalic}
    aria-label="Italic"
    title="Italic"
  >
    <em>I</em>
  </button>
  <button
    type="button"
    class="rounded px-3 py-1 hover:bg-accent hover:text-accent-foreground {props.editor.isActive('underline')
      ? 'bg-accent text-accent-foreground'
      : ''}"
    onclick={toggleUnderline}
    aria-label="Underline"
    title="Underline"
  >
    <u>U</u>
  </button>
  <button
    type="button"
    class="rounded px-3 py-1 hover:bg-accent hover:text-accent-foreground {props.editor.isActive('strike')
      ? 'bg-accent text-accent-foreground'
      : ''}"
    onclick={toggleStrike}
    aria-label="Strikethrough"
    title="Strikethrough"
  >
    <s>S</s>
  </button>

  <!-- Divider -->
  <div class="w-px h-6 bg-border mx-1"></div>

  <!-- Color and Highlight -->
  <div class="relative">
    <button
      type="button"
      class="rounded px-3 py-1 hover:bg-accent hover:text-accent-foreground {currentHighlight
        ? 'bg-accent text-accent-foreground'
        : ''}"
      onclick={() => (showHighlightPicker = !showHighlightPicker)}
      data-state={currentHighlight ? 'on' : 'off'}
      aria-label="Highlight"
      title="Highlight"
    >
      <span class="relative inline-block">
        H
        {#if currentHighlight}
          <span
            class="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full"
            style="background-color: {currentHighlight}"
          ></span>
        {/if}
      </span>
    </button>
    <FontColorPicker editor={props.editor} bind:visible={showHighlightPicker} mode="highlight" />
  </div>
  <div class="relative">
    <button
      type="button"
      class="rounded px-3 py-1 hover:bg-accent hover:text-accent-foreground {props.editor.isActive('textColor')
        ? 'bg-accent text-accent-foreground'
        : ''}"
      onclick={() => (showFontColorPicker = !showFontColorPicker)}
      aria-label="Text Color"
      title="Text Color"
    >
      <span class="relative inline-block">
        A
        {#if currentTextColor}
          <span
            class="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full"
            style="background-color: {currentTextColor}"
          ></span>
        {/if}
      </span>
    </button>
    <FontColorPicker editor={props.editor} bind:visible={showFontColorPicker} mode="color" />
  </div>

  <!-- Link -->
  <div class="relative">
    <button
      type="button"
      class="rounded px-2 py-1 hover:bg-accent hover:text-accent-foreground {props.editor.isActive('link')
        ? 'bg-accent text-accent-foreground'
        : ''}"
      onclick={toggleLink}
      aria-label="Link"
      title="Link"
    >
      <Link2 size={16} />
    </button>
    {#if showLinkInput}
      <LinkEditPopover
        editor={props.editor}
        initialUrl={linkUrl}
        onClose={() => {
          showLinkInput = false;
          linkUrl = '';
        }}
      />
    {/if}
  </div>

  <!-- Divider -->
  <div class="w-px h-6 bg-border mx-1"></div>

  <!-- Alignment -->
  <button
    type="button"
    class="rounded px-2 py-1 hover:bg-accent hover:text-accent-foreground {props.editor.isActive({
      textAlign: 'left',
    })
      ? 'bg-accent text-accent-foreground'
      : ''}"
    onclick={() => setTextAlign('left')}
    aria-label="Align left"
    title="Align left"
  >
    <AlignLeft size={16} />
  </button>
  <button
    type="button"
    class="rounded px-2 py-1 hover:bg-accent hover:text-accent-foreground {props.editor.isActive({
      textAlign: 'center',
    })
      ? 'bg-accent text-accent-foreground'
      : ''}"
    onclick={() => setTextAlign('center')}
    aria-label="Align center"
    title="Align center"
  >
    <AlignCenter size={16} />
  </button>
  <button
    type="button"
    class="rounded px-2 py-1 hover:bg-accent hover:text-accent-foreground {props.editor.isActive({
      textAlign: 'right',
    })
      ? 'bg-accent text-accent-foreground'
      : ''}"
    onclick={() => setTextAlign('right')}
    aria-label="Align right"
    title="Align right"
  >
    <AlignRight size={16} />
  </button>
  <button
    type="button"
    class="rounded px-2 py-1 hover:bg-accent hover:text-accent-foreground {props.editor.isActive({
      textAlign: 'justify',
    })
      ? 'bg-accent text-accent-foreground'
      : ''}"
    onclick={() => setTextAlign('justify')}
    aria-label="Justify"
    title="Justify"
  >
    <AlignJustify size={16} />
  </button>
</div>
