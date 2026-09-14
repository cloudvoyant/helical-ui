// apps/docs/src/components/examples/listbox/filtering/react.tsx
// Filtering is consumer-owned: `visible` is filtered with vortex-ui's defaultListboxFilter and
// the SAME array is both passed to Listbox and rendered — so the collection and the children
// cannot diverge. Ark's ListboxInput is a typeahead input (zag exposes only autoHighlight /
// keyboardPriority — there is no controlled query prop on the root), so the consumer controls
// the query with plain HTML value/onChange on the input, while Ark keeps the list linkage.
// ListboxInput is a sibling of ListboxContent (never inside role="listbox"), while the
// styled Listbox root keeps both controls inside one visual surface.
import { useMemo, useState } from 'react';
import {
  Listbox,
  ListboxContent,
  ListboxItem,
  ListboxItemText,
  ListboxItemIndicator,
  ListboxInput,
  ListboxEmpty,
} from '@cloudvoyant/vortex-react';
import { defaultListboxFilter } from '@cloudvoyant/vortex-ui';
import { Check } from 'lucide-react';

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
];

export default function ReactListboxFiltering() {
  const [query, setQuery] = useState('');
  // Memoized so `items` keeps a stable identity across renders (the collection depends on it).
  const visible = useMemo(() => items.filter((item) => defaultListboxFilter(item, query)), [query]);

  return (
    <Listbox items={visible}>
      <ListboxInput
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        autoHighlight
        placeholder="Filter fruit…"
      />
      <ListboxContent>
        {visible.map((item) => (
          <ListboxItem key={item.value} item={item}>
            <ListboxItemText>{item.label}</ListboxItemText>
            <ListboxItemIndicator>
              <Check />
            </ListboxItemIndicator>
          </ListboxItem>
        ))}
        <ListboxEmpty>No fruit matches “{query}”.</ListboxEmpty>
      </ListboxContent>
    </Listbox>
  );
}
