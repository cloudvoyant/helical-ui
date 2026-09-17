// apps/docs/src/components/examples/toggle-button/indicator/react.tsx
import { ToggleButton, ToggleButtonIndicator } from '@cloudvoyant/helical-react';
import { Bookmark } from 'lucide-react';

export default function ReactToggleButtonIndicator() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ToggleButton aria-label="Toggle bookmark" defaultPressed>
        <ToggleButtonIndicator fallback={<Bookmark className="size-4" />}>
          <Bookmark className="size-4" fill="currentColor" />
        </ToggleButtonIndicator>
      </ToggleButton>
    </div>
  );
}
