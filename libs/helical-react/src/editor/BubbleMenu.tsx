// libs/helical-react/src/editor/BubbleMenu.tsx
// React parity of BubbleMenu.svelte: the selection toolbar. Renders through Tiptap's React
// BubbleMenu and composes helical ToggleGroup + FontColorPicker with matching mark and
// alignment actions in each framework.
import { useEffect, useState } from 'react';
import { BubbleMenu as TiptapBubbleMenu } from '@tiptap/react/menus';
import type { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Link2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '..';
import { FontColorPicker } from './FontColorPicker';
import { LinkEditPopover } from './LinkEditPopover';
import { findEditorScrollContainer } from '@cloudvoyant/helical-ui';

export interface BubbleMenuProps {
  editor: Editor;
  onUpload?: (file: File) => Promise<{ src: string; srcset?: string }>;
}

export function BubbleMenu({ editor }: BubbleMenuProps) {
  const [isEditingLink, setIsEditingLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [dismissedSelection, setDismissedSelection] = useState<string | null>(null);
  const currentAlign = ['left', 'center', 'right', 'justify'].find((a) => editor.isActive({ textAlign: a }));

  useEffect(() => {
    if (!isEditingLink) return;
    const container = findEditorScrollContainer(editor.view.dom);
    if (!container) return;
    const preventWheel = (event: WheelEvent) => event.preventDefault();
    container.addEventListener('wheel', preventWheel, { passive: false });
    return () => container.removeEventListener('wheel', preventWheel);
  }, [editor, isEditingLink]);

  useEffect(() => {
    const selectionKey = () => `${editor.state.selection.from}:${editor.state.selection.to}`;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !editor.state.selection.empty) setDismissedSelection(selectionKey());
    };
    const handleSelectionUpdate = () => {
      const next = selectionKey();
      setDismissedSelection((current) => (current && current !== next ? null : current));
    };
    document.addEventListener('keydown', handleEscape);
    editor.on('selectionUpdate', handleSelectionUpdate);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      editor.off('selectionUpdate', handleSelectionUpdate);
    };
  }, [editor]);

  return (
    <TiptapBubbleMenu
      editor={editor}
      options={{ placement: 'top' }}
      shouldShow={({ editor: currentEditor, state, from, to }) =>
        currentEditor.isEditable &&
        currentEditor.isFocused &&
        !state.selection.empty &&
        from !== to &&
        dismissedSelection !== `${from}:${to}` &&
        !currentEditor.isActive('imageNode')
      }
      role="toolbar"
      aria-label="Text formatting"
      tabIndex={-1}
      className="flex items-center gap-1 rounded-md border border-border bg-popover p-1 shadow-md"
    >
      <ToggleGroup multiple defaultValue={[]}>
        <ToggleGroupItem
          value="bold"
          size="sm"
          aria-label="Bold"
          data-state={editor.isActive('bold') ? 'on' : 'off'}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="italic"
          size="sm"
          aria-label="Italic"
          data-state={editor.isActive('italic') ? 'on' : 'off'}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="underline"
          size="sm"
          aria-label="Underline"
          data-state={editor.isActive('underline') ? 'on' : 'off'}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="strike"
          size="sm"
          aria-label="Strikethrough"
          data-state={editor.isActive('strike') ? 'on' : 'off'}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough />
        </ToggleGroupItem>
      </ToggleGroup>

      <FontColorPicker editor={editor} mode="text" />
      <FontColorPicker editor={editor} mode="highlight" />

      <ToggleGroup defaultValue={currentAlign ? [currentAlign] : []}>
        {(
          [
            ['left', AlignLeft],
            ['center', AlignCenter],
            ['right', AlignRight],
            ['justify', AlignJustify],
          ] as const
        ).map(([align, Icon]) => (
          <ToggleGroupItem
            key={align}
            value={align}
            size="sm"
            aria-label={`Align ${align}`}
            onClick={() => editor.chain().focus().setTextAlign(align).run()}
          >
            <Icon />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <div className="relative">
        <ToggleGroup defaultValue={[]}>
          <ToggleGroupItem
            value="link"
            size="sm"
            aria-label="Link"
            onClick={() => {
              setLinkUrl((editor.getAttributes('link').href as string | undefined) ?? '');
              setIsEditingLink(true);
            }}
          >
            <Link2 />
          </ToggleGroupItem>
        </ToggleGroup>
        {isEditingLink ? (
          <LinkEditPopover editor={editor} initialUrl={linkUrl} onClose={() => setIsEditingLink(false)} />
        ) : null}
      </div>
    </TiptapBubbleMenu>
  );
}
