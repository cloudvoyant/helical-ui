// apps/docs/src/components/examples/combobox/multiple/react.tsx
import {
  Combobox,
  ComboboxControl,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxItemText,
  ComboboxItemIndicator,
} from '@cloudvoyant/helical-react';
import { Check } from 'lucide-react';

const items = [
  { value: 'react', label: 'React' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'vue', label: 'Vue' },
];

export default function ReactComboboxMultiple() {
  return (
    <Combobox multiple defaultValue={['react', 'svelte']} items={items} className="max-w-xs">
      <ComboboxControl>
        <ComboboxInput placeholder="Select frameworks…" />
      </ComboboxControl>
      <ComboboxContent>
        <ComboboxList>
          {items.map((item) => (
            <ComboboxItem key={item.value} item={item}>
              <ComboboxItemText>{item.label}</ComboboxItemText>
              <ComboboxItemIndicator>
                <Check />
              </ComboboxItemIndicator>
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
