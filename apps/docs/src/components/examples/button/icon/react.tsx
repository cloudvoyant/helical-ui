// apps/docs/src/components/examples/button/icon/react.tsx
import { Button } from '@cloudvoyant/helical-react';
import { Plus } from 'lucide-react';

export default function ReactButtonIcon() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="icon" className="rounded-full" aria-label="Add">
        <Plus className="size-4" />
      </Button>
      <Button size="icon" variant="outline" aria-label="Add">
        <Plus className="size-4" />
      </Button>
    </div>
  );
}
