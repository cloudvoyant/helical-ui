// apps/docs/src/components/examples/select/default/react.tsx
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectIndicator,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectItemIndicator,
} from '@cloudvoyant/helical-react';
import { Check, ChevronsUpDown } from 'lucide-react';

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

export default function ReactSelectDefault() {
  return (
    <Select items={items} defaultValue={['apple']} className="max-w-xs">
      <SelectTrigger>
        <SelectValue />
        <SelectIndicator>
          <ChevronsUpDown />
        </SelectIndicator>
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} item={item}>
            <SelectItemText>{item.label}</SelectItemText>
            <SelectItemIndicator>
              <Check />
            </SelectItemIndicator>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
