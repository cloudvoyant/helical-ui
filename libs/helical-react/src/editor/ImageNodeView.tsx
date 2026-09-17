// libs/helical-react/src/editor/ImageNodeView.tsx
// React parity of ImageNodeView.svelte. Must render the exact classes the helical-ui ProseMirror
// plugins target: figure[data-type="image-node"], .caption-input, and it must tolerate the
// .image-node-pending-delete decoration added by the two-step backspace plugin.
import { useState } from 'react';
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react';

export function ImageNodeView({ node, updateAttributes, selected, editor, getPos }: NodeViewProps) {
  const [captionFocused, setCaptionFocused] = useState(false);
  const { src, srcset, alt, caption } = node.attrs as {
    src: string;
    srcset?: string;
    alt?: string;
    caption?: string;
  };

  return (
    <NodeViewWrapper as="figure" data-type="image-node" className="my-6 m-0 relative">
      <img
        src={src}
        srcSet={srcset || undefined}
        alt={alt || ''}
        sizes="(max-width: 768px) 100vw, 720px"
        className="w-full object-cover"
        data-selected={selected ? '' : undefined}
      />
      <input
        className="caption-input mt-2 w-full bg-transparent text-center text-sm italic text-muted-foreground outline-none"
        placeholder={captionFocused ? '' : 'Add a caption…'}
        value={caption || ''}
        onFocus={() => setCaptionFocused(true)}
        onBlur={() => setCaptionFocused(false)}
        onChange={(event) => updateAttributes({ caption: event.target.value })}
        onKeyDown={(event) => {
          if (typeof getPos !== 'function') return;
          const position = getPos();
          if (position === undefined) return;
          if (event.key === 'ArrowUp') {
            event.preventDefault();
            editor
              .chain()
              .focus()
              .setTextSelection(Math.max(position - 1, 0))
              .run();
          }
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            editor
              .chain()
              .focus()
              .setTextSelection(position + node.nodeSize)
              .run();
          }
          if (event.key === 'Enter') {
            event.preventDefault();
            editor
              .chain()
              .focus()
              .insertContentAt(position + node.nodeSize, { type: 'paragraph' })
              .setTextSelection(position + node.nodeSize + 1)
              .run();
          }
        }}
      />
    </NodeViewWrapper>
  );
}
