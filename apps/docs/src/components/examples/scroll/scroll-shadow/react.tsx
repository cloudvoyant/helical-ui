// apps/docs/src/components/examples/scroll/scroll-shadow/react.tsx
import { Scroll } from '@cloudvoyant/helical-react';

export default function ReactScrollScrollShadow() {
  return (
    <Scroll
      className="h-64 w-64 rounded-md border border-border"
      contentClassName="data-[overflow-y]:[mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]"
    >
      <div className="p-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <p key={i} className="border-t border-border py-2 text-sm text-muted-foreground">
            Item {i + 1}
          </p>
        ))}
      </div>
    </Scroll>
  );
}
