// libs/vortex-react/src/editor/MentionList.tsx
// React parity of MentionList.svelte: the @-mention suggestion list. Renders through vortex
// Listbox and exposes `onKeyDown` for the suggestion bridge.
import { forwardRef, useImperativeHandle, useState } from 'react';
import type { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion';
import { Listbox, ListboxContent, ListboxItem, ListboxItemText } from '..';
import type { MentionItem } from '@cloudvoyant/vortex-ui';

export interface MentionListHandle {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
}

export const MentionList = forwardRef<MentionListHandle, SuggestionProps<MentionItem>>(function MentionList(
  { items, command },
  ref,
) {
  const [index, setIndex] = useState(0);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === 'ArrowUp') {
        setIndex((i) => (i + items.length - 1) % items.length);
        return true;
      }
      if (event.key === 'ArrowDown') {
        setIndex((i) => (i + 1) % items.length);
        return true;
      }
      if (event.key === 'Enter') {
        const item = items[index];
        if (item) command(item);
        return true;
      }
      return false;
    },
  }));

  if (items.length === 0) return null;

  const listItems = items.map((item) => ({ value: item.id, label: item.label }));

  return (
    <Listbox items={listItems} className="mention-list">
      <ListboxContent>
        {items.map((item, i) => (
          <ListboxItem
            key={item.id}
            item={{ value: item.id, label: item.label }}
            className={i === index ? 'bg-accent text-accent-foreground' : undefined}
            onMouseEnter={() => setIndex(i)}
            onClick={() => command(item)}
          >
            <ListboxItemText>{item.label}</ListboxItemText>
          </ListboxItem>
        ))}
      </ListboxContent>
    </Listbox>
  );
});
