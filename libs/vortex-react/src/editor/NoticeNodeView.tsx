// libs/vortex-react/src/editor/NoticeNodeView.tsx
import { NodeViewContent, NodeViewWrapper, type NodeViewProps } from '@tiptap/react';
import type { NoticeVariants } from '@cloudvoyant/vortex-ui';
import { Notice } from '../notice';

type NoticeType = Exclude<NoticeVariants['variant'], null | undefined | 'none'>;

const VARIANTS: NoticeType[] = ['info', 'success', 'warning', 'error'];

export function NoticeNodeView({ node, editor, getPos, updateAttributes }: NodeViewProps) {
  const variant = (node.attrs.variant as NoticeType | undefined) ?? 'info';
  const title = (node.attrs.title as string | undefined) ?? 'Note';

  const bodyStart = () => {
    const nodePosition = typeof getPos === 'function' ? getPos() : undefined;
    return typeof nodePosition === 'number' ? nodePosition + 2 : null;
  };

  const focusBody = () => {
    const position = bodyStart();
    if (position !== null) editor.chain().focus().setTextSelection(position).run();
  };

  return (
    <NodeViewWrapper>
      <Notice variant={variant} className="editor-notice-node relative my-1 px-2 py-1">
        <div className="flex items-center gap-2" contentEditable={false}>
          <input
            aria-label="Notice title"
            value={title}
            onChange={(event) => updateAttributes({ title: event.target.value })}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown' || event.key === 'Enter') {
                event.preventDefault();
                focusBody();
              }
            }}
            className="min-w-0 flex-1 bg-transparent font-semibold tracking-tight outline-none placeholder:text-muted-foreground"
            placeholder="Notice title"
          />
          <select
            aria-label="Notice type"
            value={variant}
            onChange={(event) => updateAttributes({ variant: event.target.value })}
            className="rounded border border-input bg-background px-1.5 py-0.5 text-xs"
          >
            {VARIANTS.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <NodeViewContent className="[&_p]:m-0" />
      </Notice>
    </NodeViewWrapper>
  );
}
