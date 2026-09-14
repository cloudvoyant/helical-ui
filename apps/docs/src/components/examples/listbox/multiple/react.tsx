// apps/docs/src/components/examples/listbox/multiple/react.tsx
import { Listbox, ListboxContent, ListboxItem, ListboxItemText, ListboxItemIndicator } from '@cloudvoyant/vortex-react';
import { Check } from 'lucide-react';

const items = [
  { value: 'red', label: 'Red' },
  { value: 'green', label: 'Green' },
  { value: 'blue', label: 'Blue' },
];

export default function ReactListboxMultiple() {
  return (
    <Listbox items={items} selectionMode="multiple" defaultValue={['red', 'blue']}>
      <ListboxContent>
        {items.map((item) => (
          <ListboxItem key={item.value} item={item}>
            <ListboxItemText>{item.label}</ListboxItemText>
            <ListboxItemIndicator>
              <Check />
            </ListboxItemIndicator>
          </ListboxItem>
        ))}
      </ListboxContent>
    </Listbox>
  );
}
