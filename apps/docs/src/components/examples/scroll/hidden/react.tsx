// apps/docs/src/components/examples/scroll/hidden/react.tsx
import { Scroll } from '@cloudvoyant/helical-react';

const lines = Array.from({ length: 40 }).map((_, i) => `Item ${i + 1}`);

export default function ReactScrollHidden() {
  return (
    <Scroll variant="hidden" className="h-56 w-64 rounded-md border border-border">
      <div className="p-4">
        {lines.map((line) => (
          <div key={line} className="border-t border-border py-2 text-sm text-muted-foreground">
            {line}
          </div>
        ))}
      </div>
    </Scroll>
  );
}
