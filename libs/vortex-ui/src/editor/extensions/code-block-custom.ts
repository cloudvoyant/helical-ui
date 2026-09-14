// libs/vortex-ui/src/editor/extensions/code-block-custom.ts
// Lift from ~/Projects/readership/libs/editor/src/extensions/code-block-custom.ts.
// Adaptation: the Svelte node-view renderer is INJECTED (NodeViewFactory) instead of imported,
// so vortex-ui stays framework-free. `lowlight` is passed by the caller.
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import type { createLowlight } from 'lowlight';
import type { NodeViewFactory } from '../types';

export const createCodeBlockCustom = (lowlight: ReturnType<typeof createLowlight>, nodeView: NodeViewFactory) =>
  CodeBlockLowlight.extend({
    addNodeView() {
      return nodeView();
    },

    addKeyboardShortcuts() {
      return {
        Tab: () => {
          if (this.editor.isActive('codeBlock')) {
            return this.editor.commands.insertContent('\t');
          }
          return false;
        },
        'Shift-Tab': () => {
          if (this.editor.isActive('codeBlock')) {
            // Remove indent if at start of line
            const { state } = this.editor;
            const { selection } = state;
            const { $from } = selection;
            const textBefore = $from.parent.textBetween(0, $from.parentOffset);

            if (textBefore.endsWith('\t')) {
              return this.editor.commands.deleteRange({
                from: $from.pos - 1,
                to: $from.pos,
              });
            }
          }
          return false;
        },
      };
    },
  }).configure({
    lowlight,
    defaultLanguage: 'javascript',
  });
