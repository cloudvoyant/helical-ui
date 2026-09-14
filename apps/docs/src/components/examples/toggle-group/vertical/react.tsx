// apps/docs/src/components/examples/toggle-group/vertical/react.tsx
import { ToggleGroup, ToggleGroupItem } from '@cloudvoyant/vortex-react';

export default function ReactToggleGroupVertical() {
  return (
    <ToggleGroup orientation="vertical" defaultValue={['a']}>
      <ToggleGroupItem value="a">Option A</ToggleGroupItem>
      <ToggleGroupItem value="b">Option B</ToggleGroupItem>
      <ToggleGroupItem value="c">Option C</ToggleGroupItem>
    </ToggleGroup>
  );
}
