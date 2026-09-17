// apps/docs/src/components/examples/scroll/both/react.tsx
import { Scroll } from '@cloudvoyant/helical-react';

export default function ReactScrollBoth() {
  return (
    <Scroll orientation="both" className="h-64 w-64 rounded-md border border-border">
      <div className="h-[600px] w-[400px] p-4">
        <p className="text-sm">Content that overflows both horizontally and vertically.</p>
      </div>
    </Scroll>
  );
}
