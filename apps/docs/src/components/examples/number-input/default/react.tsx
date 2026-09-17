// apps/docs/src/components/examples/number-input/default/react.tsx
import {
  NumberInput,
  NumberInputControl,
  NumberInputInput,
  NumberInputDecrement,
  NumberInputIncrement,
} from '@cloudvoyant/helical-react';
import { Minus, Plus } from 'lucide-react';

export default function ReactNumberInputDefault() {
  return (
    <NumberInput min={0} max={10} defaultValue="5" className="max-w-xs">
      <NumberInputControl>
        <NumberInputDecrement>
          <Minus />
        </NumberInputDecrement>
        <NumberInputInput />
        <NumberInputIncrement>
          <Plus />
        </NumberInputIncrement>
      </NumberInputControl>
    </NumberInput>
  );
}
