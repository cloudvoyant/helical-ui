// apps/docs/src/components/examples/scroll/default/react.tsx
import { Scroll } from '@cloudvoyant/helical-react';

const tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`);

export default function ReactScrollDefault() {
  return (
    <Scroll className="h-72 w-64 rounded-md border border-border">
      <div className="p-4">
        <p className="mb-4 text-sm font-medium">Tags</p>
        {tags.map((tag) => (
          <div key={tag} className="border-t border-border py-2 text-sm text-muted-foreground">
            {tag}
          </div>
        ))}
      </div>
    </Scroll>
  );
}
