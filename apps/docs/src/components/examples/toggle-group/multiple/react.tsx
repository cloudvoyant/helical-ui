// apps/docs/src/components/examples/toggle-group/multiple/react.tsx
import { ToggleGroup, ToggleGroupItem } from '@cloudvoyant/vortex-react';
import { Bold, Italic, Underline } from 'lucide-react';

export default function ReactToggleGroupMultiple() {
  return (
    <ToggleGroup multiple defaultValue={['bold', 'italic']}>
      <ToggleGroupItem value="bold" aria-label="Bold">
        <Bold />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <Italic />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <Underline />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
