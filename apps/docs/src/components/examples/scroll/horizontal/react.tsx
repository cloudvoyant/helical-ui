// apps/docs/src/components/examples/scroll/horizontal/react.tsx
import { Scroll } from '@cloudvoyant/helical-react';

export default function ReactScrollHorizontal() {
  return (
    <Scroll orientation="horizontal" className="h-24 w-full rounded-md border border-border">
      <div className="flex gap-2 p-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="shrink-0 rounded-md bg-muted px-3 py-1 text-sm">
            Item {i + 1}
          </div>
        ))}
      </div>
    </Scroll>
  );
}
