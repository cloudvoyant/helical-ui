// apps/docs/src/components/examples/prose/sizes/react.tsx
import { Prose } from '@cloudvoyant/vortex-react';

export default function ReactProseSizes() {
  return (
    <div className="flex flex-col gap-6">
      {(['sm', 'base', 'lg'] as const).map((size) => (
        <Prose key={size} size={size}>
          <h2>Size: {size}</h2>
          <p>The quick brown fox jumps over the lazy dog.</p>
        </Prose>
      ))}
    </div>
  );
}
