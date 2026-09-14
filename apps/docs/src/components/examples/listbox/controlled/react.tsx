// apps/docs/src/components/examples/listbox/controlled/react.tsx
import { useState } from 'react';
import { Listbox, ListboxContent, ListboxItem, ListboxItemText, ListboxItemIndicator } from '@cloudvoyant/vortex-react';
import { Check } from 'lucide-react';

const items = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
];

export default function ReactListboxValueText() {
  const [value, setValue] = useState<string[]>(['md']);
  const selected = items.find((item) => item.value === value[0]);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">Selected: {selected?.label ?? 'None'}</p>
      <Listbox items={items} value={value} onValueChange={(details) => setValue(details.value)}>
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
    </div>
  );
}
