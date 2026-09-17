// libs/helical-react/src/editor/SlashMenu.tsx
// React parity of SlashMenu.svelte: renders the slash commands through helical Listbox and
// exposes `onKeyDown` for the suggestion bridge. Keyboard nav mirrors the Svelte version.
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion';
import { Listbox, ListboxContent, ListboxItem, ListboxItemText } from '..';
import type { SlashCommandItem } from '@cloudvoyant/helical-ui';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface SlashMenuHandle {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
}

export const SlashMenu = forwardRef<SlashMenuHandle, SuggestionProps<SlashCommandItem>>(function SlashMenu(
  { items, command },
  ref,
) {
  const [index, setIndex] = useState(0);
  const itemRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const itemsKey = items.map((item) => item.title).join('\u0000');

  // Reset only when the command titles change. Suggestion can replace the items array during
  // keyboard navigation even when its contents are identical.
  useEffect(() => setIndex(0), [itemsKey]);
  useEffect(() => {
    const item = itemRefs.current[index]?.closest('[data-part="item"]');
    const viewport = item?.closest('[data-slash-menu-scroll]');
    if (!(viewport instanceof HTMLElement) || !(item instanceof HTMLElement)) return;
    const viewportRect = viewport.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    if (itemRect.top < viewportRect.top) viewport.scrollTop -= viewportRect.top - itemRect.top;
    else if (itemRect.bottom > viewportRect.bottom) viewport.scrollTop += itemRect.bottom - viewportRect.bottom;
  }, [index]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (items.length === 0) return false;
      if (event.key === 'ArrowUp') {
        setIndex((i) => Math.max(0, i - 1));
        return true;
      }
      if (event.key === 'ArrowDown') {
        setIndex((i) => Math.min(items.length - 1, i + 1));
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

  const listItems = items.map((item) => ({ value: item.title, label: item.title }));

  return (
    <Listbox
      items={listItems}
      highlightedValue={items[index]?.title ?? null}
      onHighlightChange={(details) => {
        if (details.highlightedIndex >= 0) setIndex(details.highlightedIndex);
      }}
      loopFocus={false}
    >
      <ListboxContent data-slash-menu-scroll>
        {items.map((item, i) => {
          // SAFETY: slash-command icon names are looked up dynamically; missing Lucide exports
          // intentionally resolve to undefined and render no icon rather than being invoked.
          const Icon = (LucideIcons as unknown as Record<string, LucideIcon | undefined>)[item.icon];
          return (
            <ListboxItem
              key={item.title}
              item={{ value: item.title, label: item.title }}
              className={i === index ? 'bg-accent text-accent-foreground' : undefined}
              data-slash-selected={i === index ? '' : undefined}
              onClick={() => command(item)}
            >
              <ListboxItemText>
                <span
                  ref={(node) => {
                    itemRefs.current[i] = node;
                  }}
                  className="inline-flex w-5 justify-center opacity-70"
                  data-slash-icon={item.icon}
                  aria-hidden="true"
                >
                  {item.icon === 'YouTube' ? (
                    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
                      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12l-6.2 3.6Z" />
                    </svg>
                  ) : Icon ? (
                    <Icon className="size-4" />
                  ) : null}
                </span>
                <span>{item.title}</span>
              </ListboxItemText>
            </ListboxItem>
          );
        })}
      </ListboxContent>
    </Listbox>
  );
});
