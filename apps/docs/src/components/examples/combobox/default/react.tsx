// apps/docs/src/components/examples/combobox/default/react.tsx
import {
  Combobox,
  ComboboxControl,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxItemText,
} from '@cloudvoyant/helical-react';
import { ChevronsUpDown } from 'lucide-react';

const items = [
  { value: 'react', label: 'React' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'vue', label: 'Vue' },
];

export default function ReactComboboxDefault() {
  return (
    <Combobox items={items} className="max-w-xs">
      <ComboboxControl>
        <ComboboxInput placeholder="Search framework…" />
        <ComboboxTrigger>
          <ChevronsUpDown />
        </ComboboxTrigger>
      </ComboboxControl>
      <ComboboxContent>
        <ComboboxList>
          {items.map((item) => (
            <ComboboxItem key={item.value} item={item}>
              <ComboboxItemText>{item.label}</ComboboxItemText>
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
