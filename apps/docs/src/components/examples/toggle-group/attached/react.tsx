// apps/docs/src/components/examples/toggle-group/attached/react.tsx
import { ToggleGroup, ToggleGroupItem } from '@cloudvoyant/vortex-react';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

export default function ReactToggleGroupAttached() {
  return (
    <ToggleGroup attached defaultValue={['left']}>
      <ToggleGroupItem value="left" variant="outline" aria-label="Align left">
        <AlignLeft />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" variant="outline" aria-label="Align center">
        <AlignCenter />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" variant="outline" aria-label="Align right">
        <AlignRight />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
