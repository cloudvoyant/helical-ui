<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Editor, type EditorOptions } from '@tiptap/core';
  import { SvelteNodeViewRenderer } from 'svelte-tiptap';
  import {
    buildExtensions,
    registerImageInsertCallback,
    unregisterImageInsertCallback,
    insertPastedUrlAsLink,
    type SlashCommandItem,
    type MentionItem,
    type MentionListElement,
    type EditorCounts,
    type ImageUploadResult,
    type LinkPreviewAttributes,
  } from '@cloudvoyant/vortex-ui';
  import BubbleMenuContent from './BubbleMenu.svelte';
  import SlashMenu from './SlashMenu.svelte';
  import BookmarkInput from './BookmarkInput.svelte';
  import ImageInput from './ImageInput.svelte';
  import YouTubeInput from './YouTubeInput.svelte';
  import ImageNodeView from './ImageNodeView.svelte';
  import UrlMentionPill from './UrlMentionPill.svelte';
  import LinkPreviewCard from './LinkPreviewCard.svelte';
  import CodeBlockComponent from './CodeBlockComponent.svelte';
  import NoticeNodeView from './NoticeNodeView.svelte';
  import MentionList from './MentionList.svelte';
  import CursorOverlay from './CursorOverlay.svelte';
  import type { SuggestionProps } from '@tiptap/suggestion';
  import type { JSONContent } from '@tiptap/core';

  let {
    content = '',
    editable = true,
    enforceTitle = true,
    onchange,
    mentionSource,
    hrefBuilder,
    onUpload,
    fetchLinkPreview,
  }: {
    content?: string;
    editable?: boolean;
    /** Keep the required first H1 title. Disable for compact inputs such as mentions. */
    enforceTitle?: boolean;
    onchange?: (data: { content: string; title: string }) => void;
    /** Seam: replaces the source editor's hardcoded internal-search endpoint. */
    mentionSource?: (query: string) => Promise<MentionItem[]>;
    /** Seam: replaces the source editor's hardcoded /read/... hrefs. */
    hrefBuilder?: (item: MentionItem) => string;
    /** Seam: replaces the source editor's app-specific image upload. */
    onUpload?: (file: File) => Promise<ImageUploadResult>;
    /** Resolve Open Graph or SEO metadata for bookmark cards. */
    fetchLinkPreview?: (url: string) => Promise<Omit<LinkPreviewAttributes, 'url' | 'type'>>;
  } = $props();

  let editor = $state<Editor | null>(null);
  let element: HTMLDivElement;
  let slashMenuProps = $state<SuggestionProps<SlashCommandItem> | null>(null);
  // The mention menu renders from the template (like the slash menu) rather than being mounted
  // into document.body: that is the pattern already proven to work in this component, and it
  // keeps keydown delegation on a bound element instead of a detached mount.
  let mentionMenuProps = $state<SuggestionProps<MentionItem> | null>(null);
  let mentionMenuCoords = $state({ left: 0, top: 0 });
  let mentionMenuEl = $state<HTMLElement | null>(null);
  let slashMenuCoords = $state({ left: 0, top: 0 });
  let slashMenuSurface = $state<HTMLDivElement | null>(null);
  let bookmarkInputActive = $state(false);
  let bookmarkInputPosition = $state(0);
  let imageInputActive = $state(false);
  let imageInputPosition = $state(0);
  let youTubeInputActive = $state(false);
  let youTubeInputPosition = $state(0);

  type SlashCommandInsertStorage = {
    slashCommands: { onInsertYouTube?: (position: number) => void };
  };

  function registerYouTubeInsert(editorInstance: Editor, callback: (position: number) => void) {
    // SAFETY: the shared slashCommands extension owns this per-editor storage object and
    // initializes `onInsertYouTube`; Tiptap exposes extension storage as an open bag.
    (editorInstance.storage as unknown as SlashCommandInsertStorage).slashCommands.onInsertYouTube = callback;
  }

  function unregisterYouTubeInsert(editorInstance: Editor) {
    // SAFETY: same extension-owned storage invariant as registerYouTubeInsert.
    (editorInstance.storage as unknown as SlashCommandInsertStorage).slashCommands.onInsertYouTube = undefined;
  }

  type OverlayPlacementOptions = { width: number; height: number; gap?: number; viewportGap?: number };

  // Mirror vortex-ui's placement helpers locally because this package's editor source is checked
  // before newly-built vortex-ui declarations are always available in workspace tooling.
  function placeEditorOverlay(
    rect: Pick<DOMRect, 'left' | 'top' | 'bottom'>,
    { width, height, gap = 8, viewportGap = 16 }: OverlayPlacementOptions,
  ) {
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const preferredTop =
      spaceBelow < height && spaceAbove > spaceBelow ? rect.top - height - gap : rect.bottom + gap;
    return {
      left: Math.min(
        Math.max(rect.left, viewportGap),
        Math.max(window.innerWidth - width - viewportGap, viewportGap),
      ),
      top: Math.min(
        Math.max(preferredTop, viewportGap),
        Math.max(window.innerHeight - height - viewportGap, viewportGap),
      ),
    };
  }

  function findEditorScrollContainer(editorElement: HTMLElement): HTMLElement | null {
    let current = editorElement.parentElement;
    while (current && current !== document.body) {
      const overflowY = window.getComputedStyle(current).overflowY;
      if (/(auto|scroll)/.test(overflowY) && current.scrollHeight > current.clientHeight) return current;
      current = current.parentElement;
    }
    return null;
  }

  const SLASH_OVERLAY = { width: 288, height: 288 };
  const IMAGE_OVERLAY = { width: 320, height: 480, gap: 4 };
  const BOOKMARK_OVERLAY = { width: 320, height: 240, gap: 4 };
  const YOUTUBE_OVERLAY = { width: 320, height: 220, gap: 4 };

  function updateSlashMenuPosition() {
    const props = slashMenuProps;
    if (!props) return;
    const rect = props.editor.view.coordsAtPos(props.range.to);
    const itemCount = props.items?.length || 0;
    slashMenuCoords = placeEditorOverlay(rect, {
      width: slashMenuSurface?.offsetWidth || SLASH_OVERLAY.width,
      height:
        slashMenuSurface?.offsetHeight || Math.min(Math.max(itemCount, 1) * 32 + 8, SLASH_OVERLAY.height),
      gap: 4,
    });
  }

  // Reposition on every suggestion update and while any ancestor scrolls, so a fixed menu remains
  // attached to the slash cursor rather than being left behind in the viewport.
  $effect(() => {
    if (slashMenuProps) updateSlashMenuPosition();
  });

  $effect(() => {
    if (!slashMenuProps) return;
    const surface = slashMenuSurface;
    const observer = surface ? new ResizeObserver(updateSlashMenuPosition) : null;
    if (surface) observer?.observe(surface);
    updateSlashMenuPosition();
    window.addEventListener('scroll', updateSlashMenuPosition, true);
    window.addEventListener('resize', updateSlashMenuPosition);
    return () => {
      observer?.disconnect();
      window.removeEventListener('scroll', updateSlashMenuPosition, true);
      window.removeEventListener('resize', updateSlashMenuPosition);
    };
  });

  // The slash suggestion is not a cursor-overlay component, so keep its equivalent lock here.
  // Insertion forms use CursorOverlay below.
  $effect(() => {
    const activeMenu = slashMenuProps;
    const editorInstance = editor;
    if (!activeMenu || !editorInstance) return;
    const container = findEditorScrollContainer(editorInstance.view.dom);
    if (!container) return;
    const preventWheel = (event: WheelEvent) => {
      const target = event.target;
      if (target instanceof Node && slashMenuSurface?.contains(target)) return;
      event.preventDefault();
    };
    container.addEventListener('wheel', preventWheel, { passive: false });
    return () => container.removeEventListener('wheel', preventWheel);
  });

  // Extract title from content (first H1)
  function extractTitle(json: JSONContent): string {
    if (json && json.content && json.content[0]?.type === 'heading' && json.content[0]?.attrs?.level === 1) {
      return json.content[0]?.content?.[0]?.text || '';
    }
    return '';
  }

  onMount(() => {
    // Cleanup any existing editor first (helps with hot reload)
    if (editor) {
      editor.destroy();
      editor = null;
    }

    const nodeViews = {
      image: () => SvelteNodeViewRenderer(ImageNodeView),
      urlMention: () => SvelteNodeViewRenderer(UrlMentionPill),
      linkPreview: () => SvelteNodeViewRenderer(LinkPreviewCard),
      codeBlock: () => SvelteNodeViewRenderer(CodeBlockComponent),
      notice: () => SvelteNodeViewRenderer(NoticeNodeView),
    };

    editor = new Editor({
      element,
      ...({ immediatelyRender: false } as unknown as Partial<EditorOptions>),
      extensions: buildExtensions({
        mentionSource,
        hrefBuilder,
        enforceTitle,
        nodeViews,
        mentionRender: () => ({
          onStart: (props: SuggestionProps<MentionItem>) => {
            mentionMenuProps = props;
            const rect = props.clientRect?.();
            if (rect) mentionMenuCoords = { left: rect.left, top: rect.bottom + 8 };
          },
          onUpdate: (props: SuggestionProps<MentionItem>) => {
            mentionMenuProps = props;
            const rect = props.clientRect?.();
            if (rect) mentionMenuCoords = { left: rect.left, top: rect.bottom + 8 };
          },
          onKeyDown: (props: { event: KeyboardEvent }) => {
            if (props.event.key === 'Escape') {
              props.event.preventDefault();
              props.event.stopPropagation();
              return true;
            }
            // MentionList exposes its handler on the element (see its $effect).
            const child = mentionMenuEl?.firstElementChild as MentionListElement | null;
            return child?.__mentionListKeyDown?.(props.event) ?? false;
          },
          onExit: () => {
            mentionMenuProps = null;
          },
        }),
        // The slash menu is rendered from this component's template (see `slashMenuProps`).
        slashRender: () => ({
          onStart: (props: SuggestionProps<SlashCommandItem>) => {
            slashMenuProps = props;
          },
          onUpdate: (props: SuggestionProps<SlashCommandItem>) => {
            slashMenuProps = props;
          },
          onExit: () => {
            slashMenuProps = null;
          },
        }),
      }),
      content: content
        ? JSON.parse(content)
        : {
            type: 'doc',
            content: enforceTitle
              ? [
                  {
                    type: 'heading',
                    attrs: { level: 1 },
                    content: [],
                  },
                  {
                    type: 'paragraph',
                    content: [],
                  },
                ]
              : [
                  {
                    type: 'paragraph',
                    content: [],
                  },
                ],
          },
      editable,
      onUpdate: ({ editor }) => {
        const json = editor.getJSON();
        const title = extractTitle(json);
        const contentStr = JSON.stringify(json);
        onchange?.({ content: contentStr, title });
      },
      editorProps: {
        attributes: {
          class: 'prose prose-lg focus:outline-none max-w-none min-h-[500px]',
        },
        handlePaste: insertPastedUrlAsLink,
      },
    });

    // Register callback so the image slash command can directly set Svelte state
    // (editor.storage mutations are not tracked by Svelte 5 $effect)
    registerImageInsertCallback(editor!, (position) => {
      imageInputPosition = position;
      imageInputActive = true;
    });

    registerYouTubeInsert(editor!, (position: number) => {
      youTubeInputPosition = position;
      youTubeInputActive = true;
    });
    editor!.on('transaction', syncBookmarkInput);
  });

  interface BookmarkInputState {
    active: boolean;
    position: number;
  }

  function isBookmarkInputState(v: unknown): v is BookmarkInputState {
    return typeof v === 'object' && v !== null && 'active' in v;
  }

  // Tiptap storage is not reactive, so observe transactions just like the React editor.
  function syncBookmarkInput() {
    if (!editor?.view) return;

    const storage = editor.storage as unknown as Record<string, unknown>;
    const bookmarkInput = storage['bookmarkInput'];
    if (isBookmarkInputState(bookmarkInput) && bookmarkInput.active) {
      bookmarkInputPosition = bookmarkInput.position;
      bookmarkInputActive = true;
      storage['bookmarkInput'] = { active: false };
    }
  }

  onDestroy(() => {
    if (editor) {
      unregisterImageInsertCallback(editor);
      unregisterYouTubeInsert(editor);
      editor.off('transaction', syncBookmarkInput);
      editor.destroy();
    }
  });

  // Update editable state
  $effect(() => {
    if (editor) {
      editor.setEditable(editable);
    }
  });

  // Expose method to update content externally
  export function updateContent(newContent: string) {
    if (editor && newContent !== JSON.stringify(editor.getJSON())) {
      try {
        const parsed = JSON.parse(newContent);
        editor.commands.setContent(parsed);
      } catch (e) {
        console.error('Failed to parse content:', e);
      }
    }
  }

  // Expose focus method
  export function focus() {
    if (editor) {
      editor.commands.focus('start');
    }
  }

  // Expose method to get analytics counts
  export function getCounts(): EditorCounts {
    if (!editor) {
      return { wordCount: 0, charCount: 0, pageCount: 0, readDuration: 0 };
    }

    const wordCount = editor.storage.characterCount?.words() || 0;
    const charCount = editor.storage.characterCount?.characters() || 0;
    const pageCount = Math.max(1, Math.ceil(wordCount / 300));
    const readDuration = Math.max(1, Math.ceil(wordCount / 250));

    return { wordCount, charCount, pageCount, readDuration };
  }
</script>

<div class="relative">
  <div bind:this={element}></div>
  {#if editor}
    <BubbleMenuContent {editor} />
    {#if slashMenuProps}
      <div
        bind:this={slashMenuSurface}
        data-slash-menu-surface
        class="fixed z-50"
        style="left: {slashMenuCoords.left}px; top: {slashMenuCoords.top}px;"
      >
        <SlashMenu items={slashMenuProps.items || []} command={(item) => slashMenuProps?.command?.(item)} />
      </div>
    {/if}
    {#if mentionMenuProps}
      <div
        bind:this={mentionMenuEl}
        class="fixed z-50"
        style="left: {mentionMenuCoords.left}px; top: {mentionMenuCoords.top}px;"
      >
        <MentionList
          items={mentionMenuProps.items || []}
          command={(item) => mentionMenuProps?.command?.(item)}
          clientRect={mentionMenuProps.clientRect ?? null}
        />
      </div>
    {/if}
    {#if bookmarkInputActive}
      <CursorOverlay
        {editor}
        position={bookmarkInputPosition}
        width={BOOKMARK_OVERLAY.width}
        height={BOOKMARK_OVERLAY.height}
        gap={BOOKMARK_OVERLAY.gap}
      >
        <BookmarkInput
          {editor}
          {fetchLinkPreview}
          position={bookmarkInputPosition}
          onClose={() => {
            bookmarkInputActive = false;
          }}
        />
      </CursorOverlay>
    {/if}
    {#if imageInputActive}
      <CursorOverlay
        {editor}
        position={imageInputPosition}
        width={IMAGE_OVERLAY.width}
        height={IMAGE_OVERLAY.height}
        gap={IMAGE_OVERLAY.gap}
      >
        <ImageInput
          {editor}
          {onUpload}
          position={imageInputPosition}
          onClose={() => {
            imageInputActive = false;
          }}
        />
      </CursorOverlay>
    {/if}
    {#if youTubeInputActive}
      <CursorOverlay
        {editor}
        position={youTubeInputPosition}
        width={YOUTUBE_OVERLAY.width}
        height={YOUTUBE_OVERLAY.height}
        gap={YOUTUBE_OVERLAY.gap}
      >
        <YouTubeInput
          {editor}
          position={youTubeInputPosition}
          onClose={() => {
            youTubeInputActive = false;
          }}
        />
      </CursorOverlay>
    {/if}
  {/if}
</div>

<style>
  /* Text alignment - applies to both editor and read view */
  :global([data-text-align='left']),
  :global(.ProseMirror [data-text-align='left']) {
    text-align: left !important;
  }

  :global([data-text-align='center']),
  :global(.ProseMirror [data-text-align='center']) {
    text-align: center !important;
  }

  :global([data-text-align='right']),
  :global(.ProseMirror [data-text-align='right']) {
    text-align: right !important;
  }

  :global([data-text-align='justify']),
  :global(.ProseMirror [data-text-align='justify']) {
    text-align: justify !important;
  }

  /* Text colors - theme-aware */
  :global(.ProseMirror span[data-color='red']) {
    color: var(--text-red);
  }
  :global(.ProseMirror span[data-color='orange']) {
    color: var(--text-orange);
  }
  :global(.ProseMirror span[data-color='yellow']) {
    color: var(--text-yellow);
  }
  :global(.ProseMirror span[data-color='green']) {
    color: var(--text-green);
  }
  :global(.ProseMirror span[data-color='cyan']) {
    color: var(--text-cyan);
  }
  :global(.ProseMirror span[data-color='blue']) {
    color: var(--text-blue);
  }
  :global(.ProseMirror span[data-color='violet']) {
    color: var(--text-violet);
  }
  :global(.ProseMirror span[data-color='fuchsia']) {
    color: var(--text-fuchsia);
  }
  :global(.ProseMirror span[data-color='slate']) {
    color: var(--text-slate);
  }

  /* Tiptap writes selected highlight colors inline. Keep only a non-important default so the
     chosen color remains authoritative. */
  :global(.ProseMirror mark) {
    background-color: var(--highlight-yellow);
    color: inherit !important;
  }

  /* Code block syntax highlighting */
  :global(.ProseMirror pre) {
    background-color: var(--code-block-bg);
    border-radius: 0.5rem;
    padding: 1rem;
    overflow-x: auto;
    font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Courier New', monospace;
    font-size: calc(var(--base-font-size, 16px) * 0.875);
    line-height: var(--line-height, 1.5);
    border: 1px solid var(--code-block-border, #e5e5e5);
  }

  :global(.ProseMirror pre code) {
    background: none;
    padding: 0;
    border-radius: 0;
    font-size: inherit;
    font-family: inherit;
  }

  /* ProseMirror container */
  :global(.ProseMirror) {
    position: relative;
  }

  /* List styling fixes */
  :global(.ProseMirror ul),
  :global(.ProseMirror ol) {
    padding-left: 1.25rem !important;
    margin: 1rem 0 !important;
  }

  :global(.ProseMirror li) {
    display: list-item !important;
    list-style-position: outside !important;
    margin: 0.25rem 0 !important;
    padding-left: 0.25rem !important;
  }

  :global(.ProseMirror ul > li) {
    list-style-type: disc !important;
  }

  :global(.ProseMirror ol > li) {
    list-style-type: decimal !important;
  }

  :global(.ProseMirror li p) {
    display: inline !important;
    margin: 0 !important;
  }

  :global(.ProseMirror ul[data-type='taskList']) {
    list-style-type: none !important;
    padding-left: 0 !important;
  }

  :global(.ProseMirror ul[data-type='taskList'] li) {
    display: flex !important;
    align-items: flex-start !important;
    gap: 0.5rem !important;
    list-style-type: none !important;
  }

  :global(.ProseMirror ul[data-type='taskList'] li > label) {
    flex-shrink: 0 !important;
    margin-top: 0.2rem !important;
  }

  :global(.ProseMirror ul[data-type='taskList'] li > div) {
    flex: 1 !important;
  }

  :global(.ProseMirror ul[data-type='taskList'] li p) {
    display: inline !important;
    margin: 0 !important;
  }

  /* Indent styles */
  :global(.ProseMirror .tt-indent-1) {
    margin-left: 2rem !important;
  }

  :global(.ProseMirror .tt-indent-2) {
    margin-left: 4rem !important;
  }

  :global(.ProseMirror .tt-indent-3) {
    margin-left: 6rem !important;
  }

  :global(.ProseMirror .tt-indent-4) {
    margin-left: 8rem !important;
  }

  :global(.ProseMirror .tt-indent-5) {
    margin-left: 10rem !important;
  }

  :global(.ProseMirror .tt-indent-6) {
    margin-left: 12rem !important;
  }

  :global(.ProseMirror .tt-indent-7) {
    margin-left: 14rem !important;
  }

  :global(.ProseMirror .tt-indent-8) {
    margin-left: 16rem !important;
  }

  /* Internal Mention - styled like regular links */
  :global(.ProseMirror a.internal-mention) {
    color: inherit;
    text-decoration: underline;
    cursor: text;
    user-select: text;
    -webkit-user-select: text;
  }

  :global(.ProseMirror a.internal-mention:hover) {
    opacity: 0.8;
  }

  /* URL Mention Pills in Editor */
  :global(.ProseMirror .url-mention-pill-edit) {
    background-color: var(--url-pill-bg);
  }

  :global(.ProseMirror .url-mention-pill-edit:hover) {
    background-color: var(--bookmark-bg-hover);
  }
</style>
