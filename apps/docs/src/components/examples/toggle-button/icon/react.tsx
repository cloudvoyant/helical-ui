// apps/docs/src/components/examples/toggle-button/icon/react.tsx
import { ToggleButton } from '@cloudvoyant/helical-react';
import { Bold, Italic, Underline } from 'lucide-react';

export default function ReactToggleButtonIcon() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ToggleButton aria-label="Toggle bold">
        <Bold className="size-4" />
      </ToggleButton>
      <ToggleButton aria-label="Toggle italic">
        <Italic className="size-4" />
      </ToggleButton>
      <ToggleButton aria-label="Toggle underline">
        <Underline className="size-4" />
      </ToggleButton>
    </div>
  );
}
