// apps/docs/src/components/examples/popover/default/react.tsx
import {
  Popover,
  PopoverTrigger,
  PopoverTitle,
  PopoverDescription,
  PopoverDismiss,
  PopoverContent,
} from '@cloudvoyant/helical-react';
import { X } from 'lucide-react';

export default function ReactPopoverDefault() {
  return (
    <Popover>
      <PopoverTrigger className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
        Open Popover
      </PopoverTrigger>
      <PopoverContent>
        <PopoverDismiss>
          <X />
        </PopoverDismiss>
        <PopoverTitle>Favorite Frameworks</PopoverTitle>
        <PopoverDescription>Tell us what is your favorite framework and why you love to use it.</PopoverDescription>
      </PopoverContent>
    </Popover>
  );
}
