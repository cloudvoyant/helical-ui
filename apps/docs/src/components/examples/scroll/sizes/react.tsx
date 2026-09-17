// apps/docs/src/components/examples/scroll/sizes/react.tsx
import { Scroll } from '@cloudvoyant/helical-react';

const items = Array.from({ length: 12 }).map((_, i) => `Item ${i + 1}`);

export default function ReactScrollSizes() {
  return (
    <div className="flex gap-4">
      <Scroll className="h-40 w-48 rounded-md border border-border [--scrollbar-size:0.25rem]">
        <div className="p-4">
          {items.map((item) => (
            <div key={item} className="py-1 text-sm">
              {item}
            </div>
          ))}
        </div>
      </Scroll>
      <Scroll className="h-40 w-48 rounded-md border border-border [--scrollbar-size:0.75rem]">
        <div className="p-4">
          {items.map((item) => (
            <div key={item} className="py-1 text-sm">
              {item}
            </div>
          ))}
        </div>
      </Scroll>
    </div>
  );
}
