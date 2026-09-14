// apps/docs/src/components/examples/listbox/default/react.tsx
import { Listbox, ListboxContent, ListboxItem, ListboxItemText, ListboxItemIndicator } from '@cloudvoyant/vortex-react';
import { Check } from 'lucide-react';

const items = [
  { value: 'react', label: 'React' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'vue', label: 'Vue' },
  { value: 'solid', label: 'Solid' },
];

export default function ReactListboxDefault() {
  return (
    <Listbox items={items} defaultValue={['svelte']}>
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
