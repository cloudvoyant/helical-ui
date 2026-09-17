// apps/docs/src/components/examples/scroll/thumb-styling/react.tsx
import { Scroll } from '@cloudvoyant/helical-react';

export default function ReactScrollThumbStyling() {
  return (
    <Scroll className="h-64 w-64 rounded-md border border-border" thumbClassName="bg-primary">
      <div className="p-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="py-1 text-sm">
            Item {i + 1}
          </div>
        ))}
      </div>
    </Scroll>
  );
}
