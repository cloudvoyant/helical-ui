// libs/helical-ui/src/editor/extensions/slash-commands.ts
// Lift from ~/Projects/readership/libs/editor/src/extensions/slash-commands.ts.
// Adaptations: `SlashCommandItem` now lives in ../types; everything else (the command
// registry and the Suggestion plugin) is unchanged. Framework-free.
import { Extension } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import Suggestion from '@tiptap/suggestion';
import type { SlashCommandItem } from '../types';

type InsertCallback = (position: number) => void;

interface SlashCommandsStorage {
  onInsertImage?: InsertCallback;
  onInsertYouTube?: InsertCallback;
}

// The image command must set the framework editor's reactive state across the Tiptap boundary
// (Tiptap storage mutations are not tracked by Svelte 5 runes or React state). The callback
// lives in this extension's per-editor storage rather than a module-level slot, so two editors
// on one page keep separate callbacks instead of clobbering each other.
export function registerImageInsertCallback(editor: import('@tiptap/core').Editor, cb: InsertCallback): void {
  // SAFETY: Tiptap storage is an open, untyped per-extension bag; `addStorage` below owns the
  // `slashCommands` key.
  (editor.storage as unknown as { slashCommands: SlashCommandsStorage }).slashCommands.onInsertImage = cb;
}

export function unregisterImageInsertCallback(editor: import('@tiptap/core').Editor): void {
  // SAFETY: same per-extension storage bag as registerImageInsertCallback.
  (editor.storage as unknown as { slashCommands: SlashCommandsStorage }).slashCommands.onInsertImage = undefined;
}

export function registerYouTubeInsertCallback(editor: import('@tiptap/core').Editor, cb: InsertCallback): void {
  // SAFETY: Tiptap storage is an open bag; `addStorage` below owns `slashCommands` and its
  // `onInsertYouTube` callback for this editor instance.
  (editor.storage as unknown as { slashCommands: SlashCommandsStorage }).slashCommands.onInsertYouTube = cb;
}

export function unregisterYouTubeInsertCallback(editor: import('@tiptap/core').Editor): void {
  // SAFETY: same per-editor storage invariant as registerYouTubeInsertCallback.
  (editor.storage as unknown as { slashCommands: SlashCommandsStorage }).slashCommands.onInsertYouTube = undefined;
}

export const slashCommands = Extension.create({
  name: 'slashCommands',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        pluginKey: new PluginKey('slashCommands'),
        command: ({
          editor,
          range,
          props,
        }: {
          editor: import('@tiptap/core').Editor;
          range: { from: number; to: number };
          props: SlashCommandItem;
        }) => {
          props.command({ editor, range });
        },
        items: ({ query }: { query: string }): SlashCommandItem[] => {
          const commands: SlashCommandItem[] = [
            {
              title: 'Heading 1',
              description: 'Large section heading',
              icon: 'Heading1',
              category: 'suggested',
              shortcut: '#',
              command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
              },
            },
            {
              title: 'Heading 2',
              description: 'Medium section heading',
              icon: 'Heading2',
              category: 'suggested',
              shortcut: '##',
              command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
              },
            },
            {
              title: 'Heading 3',
              description: 'Small section heading',
              icon: 'Heading3',
              category: 'suggested',
              shortcut: '###',
              command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).setNode('heading', { level: 4 }).run();
              },
            },
            {
              title: 'Heading 4',
              description: 'Minor section heading',
              icon: 'Heading4',
              category: 'suggested',
              shortcut: '####',
              command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).setNode('heading', { level: 5 }).run();
              },
            },
            {
              title: 'Quote',
              description: 'Insert a blockquote',
              icon: 'Quote',
              category: 'basic',
              shortcut: '>',
              command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).toggleBlockquote().run();
              },
            },
            {
              title: 'Notice',
              description: 'Insert a styled callout',
              icon: 'MessageSquareWarning',
              category: 'basic',
              command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).insertNotice({ variant: 'info', title: 'Note' }).run();
              },
            },
            {
              title: 'Bullet List',
              description: 'Create a bulleted list',
              icon: 'List',
              category: 'suggested',
              shortcut: '-',
              command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).toggleBulletList().run();
              },
            },
            {
              title: 'Numbered List',
              description: 'Create a numbered list',
              icon: 'ListOrdered',
              category: 'suggested',
              shortcut: '1.',
              command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).toggleOrderedList().run();
              },
            },
            {
              title: 'Todo List',
              description: 'Create a task list with checkboxes',
              icon: 'ListTodo',
              category: 'suggested',
              shortcut: '[]',
              command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).toggleTaskList().run();
              },
            },
            {
              title: 'Divider',
              description: 'Insert a horizontal divider',
              icon: 'Minus',
              category: 'basic',
              shortcut: '---',
              command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).setHorizontalRule().run();
              },
            },
            {
              title: 'Code Block',
              description: 'Insert a code block with syntax highlighting',
              icon: 'Code',
              category: 'advanced',
              shortcut: '```',
              command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).setCodeBlock({ language: 'plaintext' }).run();
              },
            },
            {
              title: 'YouTube',
              description: 'Embed a YouTube video',
              icon: 'YouTube',
              category: 'media',
              command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).run();
                // SAFETY: `addStorage` owns this per-editor callback; the framework editor
                // registers and clears it for its own lifecycle.
                (editor.storage as unknown as { slashCommands: SlashCommandsStorage }).slashCommands.onInsertYouTube?.(
                  range.from,
                );
              },
            },
            {
              title: 'Image',
              description: 'Upload an image from your computer',
              icon: 'Image',
              category: 'media',
              command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).run();
                // SAFETY: same per-extension storage bag as registerImageInsertCallback.
                (editor.storage as unknown as { slashCommands: SlashCommandsStorage }).slashCommands.onInsertImage?.(
                  range.from,
                );
              },
            },
            {
              title: 'Bookmark',
              description: 'Create a rich link preview card',
              icon: 'Bookmark',
              category: 'media',
              command: ({ editor, range }) => {
                // Delete the slash command
                editor.chain().focus().deleteRange(range).run();

                // Signal to show bookmark input
                // SAFETY: Tiptap storage is an open, untyped per-extension bag; the framework
                // editor reads this same key back, and it is not part of any typed contract.
                (editor.storage as unknown as Record<string, unknown>)['bookmarkInput'] = {
                  active: true,
                  position: range.from,
                };
              },
            },
          ];

          return commands.filter((item) => item.title.toLowerCase().startsWith(query.toLowerCase()));
        },
      },
    };
  },

  addStorage(): SlashCommandsStorage {
    return { onInsertImage: undefined, onInsertYouTube: undefined };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
