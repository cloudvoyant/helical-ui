// libs/vortex-react/src/editor/Editor.tsx
// React parity of the Svelte Editor: same props, same seams, same Tiptap JSON contract.
// Consumes the framework-agnostic buildExtensions from vortex-ui and injects the React node
// views.
//
// Menu rendering mirrors the Svelte editor: the suggestion renders only track state here, and
// the menus are rendered from this component's JSX. That keeps them inside the framework tree
// (no duplicate mounts) and lets us position them from the suggestion's clientRect.
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useEditor, EditorContent, ReactNodeViewRenderer, type Editor as TiptapEditor } from '@tiptap/react';
import type { JSONContent } from '@tiptap/core';
import type { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion';
import {
  buildExtensions,
  registerImageInsertCallback,
  unregisterImageInsertCallback,
  registerYouTubeInsertCallback,
  unregisterYouTubeInsertCallback,
  lockEditorOverlayScroll,
  placeEditorOverlay,
  insertPastedUrlAsLink,
  type EditorCounts,
  type MentionItem,
  type ImageUploadResult,
  type LinkPreviewFetcher,
  type SlashCommandItem,
} from '@cloudvoyant/vortex-ui';
import { ImageNodeView } from './ImageNodeView';
import { UrlMentionPill } from './UrlMentionPill';
import { LinkPreviewCard } from './LinkPreviewCard';
import { CodeBlockComponent } from './CodeBlockComponent';
import { NoticeNodeView } from './NoticeNodeView';
import { BubbleMenu } from './BubbleMenu';
import { SlashMenu, type SlashMenuHandle } from './SlashMenu';
import { MentionList, type MentionListHandle } from './MentionList';
import { ImageInput } from './ImageInput';
import { BookmarkInput } from './BookmarkInput';
import { YouTubeInput } from './YouTubeInput';
import { CursorOverlay } from './CursorOverlay';

export interface EditorHandle {
  focus: () => void;
  updateContent: (json: string) => void;
  getCounts: () => EditorCounts;
}

export interface EditorProps {
  content?: string;
  editable?: boolean;
  /** Keep the required first H1 title. Disable for compact inputs such as mentions. */
  enforceTitle?: boolean;
  onChange?: (data: { content: string; title: string }) => void;
  /** Seam: replaces the source editor's hardcoded internal-search endpoint. */
  mentionSource?: (query: string) => Promise<MentionItem[]>;
  /** Seam: replaces the source editor's hardcoded /read/... hrefs. */
  hrefBuilder?: (item: MentionItem) => string;
  /** Seam: replaces the source editor's app-specific image upload. */
  onUpload?: (file: File) => Promise<ImageUploadResult>;
  /** Resolve Open Graph or SEO metadata for bookmark cards. */
  fetchLinkPreview?: LinkPreviewFetcher;
}

function extractTitle(json: JSONContent): string {
  if (json?.content?.[0]?.type === 'heading' && json.content[0]?.attrs?.level === 1) {
    return json.content[0]?.content?.[0]?.text || '';
  }
  return '';
}

interface MenuState<T> {
  props: SuggestionProps<T> | null;
  coords: { left: number; top: number };
}

const SLASH_OVERLAY = { width: 288, height: 288 };
const IMAGE_OVERLAY = { width: 320, height: 480, gap: 4 };
const BOOKMARK_OVERLAY = { width: 320, height: 240, gap: 4 };
const YOUTUBE_OVERLAY = { width: 320, height: 220, gap: 4 };

/** Shared counts, matching the Svelte editor (300 words/page, 250 words/minute). */
export function getEditorCounts(editor: TiptapEditor | null): EditorCounts {
  const words = editor?.storage.characterCount?.words() ?? 0;
  const chars = editor?.storage.characterCount?.characters() ?? 0;
  return {
    wordCount: words,
    charCount: chars,
    pageCount: Math.max(1, Math.ceil(words / 300)),
    readDuration: Math.max(1, Math.ceil(words / 250)),
  };
}

export const Editor = forwardRef<EditorHandle, EditorProps>(function Editor(
  {
    content = '',
    editable = true,
    enforceTitle = true,
    onChange,
    mentionSource,
    hrefBuilder,
    onUpload,
    fetchLinkPreview,
  },
  ref,
) {
  const [slash, setSlash] = useState<MenuState<SlashCommandItem>>({ props: null, coords: { left: 0, top: 0 } });
  const [mention, setMention] = useState<MenuState<MentionItem>>({ props: null, coords: { left: 0, top: 0 } });

  const [imageInput, setImageInput] = useState<{ position: number } | null>(null);
  const [bookmarkInput, setBookmarkInput] = useState<{ position: number } | null>(null);
  const [youTubeInput, setYouTubeInput] = useState<{ position: number } | null>(null);

  const slashRef = useRef<SlashMenuHandle>(null);
  const slashSurfaceRef = useRef<HTMLDivElement>(null);
  const mentionRef = useRef<MentionListHandle>(null);

  const extensions = useMemo(
    () =>
      buildExtensions({
        mentionSource,
        hrefBuilder,
        enforceTitle,
        nodeViews: {
          image: () => ReactNodeViewRenderer(ImageNodeView),
          urlMention: () => ReactNodeViewRenderer(UrlMentionPill),
          linkPreview: () => ReactNodeViewRenderer(LinkPreviewCard),
          codeBlock: () => ReactNodeViewRenderer(CodeBlockComponent),
          notice: () => ReactNodeViewRenderer(NoticeNodeView),
        },
        // State-only renders; the menus are drawn from JSX below.
        mentionRender: () => ({
          onStart: (props: SuggestionProps<MentionItem>) => setMention(menuFrom(props)),
          onUpdate: (props: SuggestionProps<MentionItem>) => setMention(menuFrom(props)),
          onKeyDown: (props: SuggestionKeyDownProps) => mentionRef.current?.onKeyDown(props) ?? false,
          onExit: () => setMention({ props: null, coords: { left: 0, top: 0 } }),
        }),
        slashRender: () => ({
          onStart: (props: SuggestionProps<SlashCommandItem>) => setSlash(slashMenuFrom(props)),
          onUpdate: (props: SuggestionProps<SlashCommandItem>) => setSlash(slashMenuFrom(props)),
          onKeyDown: (props: SuggestionKeyDownProps) => slashRef.current?.onKeyDown(props) ?? false,
          onExit: () => setSlash({ props: null, coords: { left: 0, top: 0 } }),
        }),
      }),
    [mentionSource, hrefBuilder, enforceTitle],
  );

  // Re-anchor from the caret whenever the viewport or rendered menu size changes. Measuring the
  // surface keeps an above-caret menu's bottom edge fixed while filtering shrinks its contents.
  useEffect(() => {
    if (!slash.props) return;
    const updatePosition = () =>
      setSlash((current) =>
        current.props
          ? slashMenuFrom(current.props as SuggestionProps<SlashCommandItem>, slashSurfaceRef.current)
          : current,
      );
    const observer = slashSurfaceRef.current ? new ResizeObserver(updatePosition) : null;
    if (slashSurfaceRef.current) observer?.observe(slashSurfaceRef.current);
    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      observer?.disconnect();
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [slash.props]);

  const editor = useEditor({
    extensions,
    editable,
    content: content
      ? JSON.parse(content)
      : {
          type: 'doc',
          content: enforceTitle
            ? [
                { type: 'heading', attrs: { level: 1 }, content: [] },
                { type: 'paragraph', content: [] },
              ]
            : [{ type: 'paragraph', content: [] }],
        },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange?.({ content: JSON.stringify(json), title: extractTitle(json) });
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-lg min-h-[500px] max-w-none focus:outline-none [&_mark]:rounded-sm [&_mark]:bg-yellow-200 [&_mark]:px-0.5 dark:[&_mark]:bg-yellow-900/70',
      },
      handlePaste: insertPastedUrlAsLink,
    },
  });

  // The slash suggestion is not a cursor-overlay component, so it applies the same shared lock
  // directly. Insertion forms use CursorOverlay below.
  useEffect(() => {
    if (!editor || !slash.props) return;
    return lockEditorOverlayScroll(editor.view.dom, slashSurfaceRef.current);
  }, [editor, slash.props]);

  // The image slash command signals through this editor's own Tiptap storage (storage mutations
  // are not tracked by React state), so register it while mounted. Keyed per editor, so two
  // editors on one page no longer clobber each other's image command.
  useEffect(() => {
    if (!editor) return;
    const instance = editor;
    registerImageInsertCallback(instance, (position) => {
      setImageInput({ position });
    });
    return () => unregisterImageInsertCallback(instance);
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    const instance = editor;
    registerYouTubeInsertCallback(instance, (position) => {
      setYouTubeInput({ position });
    });
    return () => unregisterYouTubeInsertCallback(instance);
  }, [editor]);

  // The bookmark slash command writes a flag into editor.storage; poll it into React state.
  useEffect(() => {
    if (!editor) return;

    const sync = () => {
      // SAFETY: Tiptap storage is an open, untyped per-extension bag. The bookmark slash command
      // (in the framework-agnostic layer) writes this key and this effect is its only reader, so
      // there is no typed contract to rely on — the shape is asserted below by the guard.
      const storage = editor.storage as unknown as Record<string, unknown>;
      const flag = storage['bookmarkInput'] as { active?: boolean; position?: number } | undefined;
      if (flag?.active && typeof flag.position === 'number') {
        const position = flag.position;
        setBookmarkInput({ position });
        storage['bookmarkInput'] = { active: false };
      }
    };

    sync();
    editor.on('transaction', sync);
    return () => {
      editor.off('transaction', sync);
    };
  }, [editor]);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => editor?.commands.focus('start'),
      updateContent: (json: string) => {
        if (editor && json !== JSON.stringify(editor.getJSON())) {
          try {
            editor.commands.setContent(JSON.parse(json));
          } catch (e) {
            console.error('Failed to parse content:', e);
          }
        }
      },
      getCounts: () => getEditorCounts(editor),
    }),
    [editor],
  );

  return (
    <div className="relative">
      <EditorContent editor={editor} />

      {editor ? <BubbleMenu editor={editor} /> : null}

      {editor && slash.props ? (
        <div
          ref={slashSurfaceRef}
          data-slash-menu-surface
          className="fixed z-50"
          style={{ left: slash.coords.left, top: slash.coords.top }}
        >
          {/* slash.props is already SuggestionProps<SlashCommandItem> — spread it whole. */}
          <SlashMenu ref={slashRef} {...slash.props} />
        </div>
      ) : null}

      {editor && mention.props ? (
        <div className="fixed z-50" style={{ left: mention.coords.left, top: mention.coords.top }}>
          <MentionList ref={mentionRef} {...mention.props} />
        </div>
      ) : null}

      {editor && imageInput ? (
        <CursorOverlay editor={editor} position={imageInput.position} {...IMAGE_OVERLAY}>
          <ImageInput
            editor={editor}
            position={imageInput.position}
            onUpload={onUpload}
            onClose={() => setImageInput(null)}
          />
        </CursorOverlay>
      ) : null}

      {editor && bookmarkInput ? (
        <CursorOverlay editor={editor} position={bookmarkInput.position} {...BOOKMARK_OVERLAY}>
          <BookmarkInput
            editor={editor}
            position={bookmarkInput.position}
            fetchLinkPreview={fetchLinkPreview}
            onClose={() => setBookmarkInput(null)}
          />
        </CursorOverlay>
      ) : null}

      {editor && youTubeInput ? (
        <CursorOverlay editor={editor} position={youTubeInput.position} {...YOUTUBE_OVERLAY}>
          <YouTubeInput editor={editor} position={youTubeInput.position} onClose={() => setYouTubeInput(null)} />
        </CursorOverlay>
      ) : null}
    </div>
  );
});

/** Build menu state with the shared viewport-aware placement strategy. */
function menuFrom<T>(props: SuggestionProps<T>): MenuState<T> {
  const rect = props.clientRect?.();
  if (!rect) return { props, coords: { left: 0, top: 0 } };
  return { props, coords: placeEditorOverlay(rect, SLASH_OVERLAY) };
}

/** Anchor the slash surface to the query caret and use its measured size when available. */
function slashMenuFrom(
  props: SuggestionProps<SlashCommandItem>,
  surface?: HTMLDivElement | null,
): MenuState<SlashCommandItem> {
  const rect = props.editor.view.coordsAtPos(props.range.to);
  const estimatedHeight = Math.min(Math.max(props.items.length, 1) * 32 + 8, SLASH_OVERLAY.height);
  return {
    props,
    coords: placeEditorOverlay(rect, {
      width: surface?.offsetWidth || SLASH_OVERLAY.width,
      height: surface?.offsetHeight || estimatedHeight,
      gap: 4,
    }),
  };
}
