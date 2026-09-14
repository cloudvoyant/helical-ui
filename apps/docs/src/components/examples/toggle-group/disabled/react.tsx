// apps/docs/src/components/examples/toggle-group/disabled/react.tsx
import { ToggleGroup, ToggleGroupItem } from '@cloudvoyant/vortex-react';

export default function ReactToggleGroupDisabled() {
  return (
    <ToggleGroup defaultValue={['a']} disabled>
      <ToggleGroupItem value="a">Option A</ToggleGroupItem>
      <ToggleGroupItem value="b">Option B</ToggleGroupItem>
      <ToggleGroupItem value="c">Option C</ToggleGroupItem>
    </ToggleGroup>
  );
}
