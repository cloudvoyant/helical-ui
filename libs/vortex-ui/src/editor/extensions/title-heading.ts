// libs/vortex-ui/src/editor/extensions/title-heading.ts
// Verbatim lift from ~/Projects/readership/libs/editor/src/extensions/title-heading.ts.
// Framework-free: imports only @tiptap/core and @tiptap/pm/state.
// Enforces an H1 as the document's first node — it is auto-created when missing and
// replaced (preserving content) when the first node is anything else, so the title
// cannot be deleted or demoted.
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';

export const TitleHeading = Extension.create({
  name: 'titleHeading',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('titleHeading'),

        appendTransaction: (transactions, oldState, newState) => {
          const tr = newState.tr;
          let modified = false;

          // Check if the first node is a heading level 1
          const firstNode = newState.doc.firstChild;

          if (!firstNode) {
            // If document is empty, insert heading
            tr.insert(0, newState.schema.nodes.heading.create({ level: 1 }));
            modified = true;
          } else if (firstNode.type.name !== 'heading' || firstNode.attrs.level !== 1) {
            // If first node is not H1, replace it with H1
            const h1 = newState.schema.nodes.heading.create({ level: 1 }, firstNode.content);
            tr.replaceWith(0, firstNode.nodeSize, h1);
            modified = true;
          }

          return modified ? tr : null;
        },
      }),
    ];
  },
});
