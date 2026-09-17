// apps/docs/src/components/examples/popover/close-behavior/react.tsx
import {
  Popover,
  PopoverTrigger,
  PopoverTitle,
  PopoverDescription,
  PopoverDismiss,
  PopoverContent,
} from '@cloudvoyant/helical-react';
import { X } from 'lucide-react';

export default function ReactPopoverCloseBehavior() {
  return (
    <Popover closeOnEscape={false} closeOnInteractOutside={false}>
      <PopoverTrigger className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
        Open Popover
      </PopoverTrigger>
      <PopoverContent>
        <PopoverDismiss>
          <X />
        </PopoverDismiss>
        <PopoverTitle>Sticky Popover</PopoverTitle>
        <PopoverDescription>
          This popover ignores Escape and outside clicks. Use the dismiss button to close it.
        </PopoverDescription>
      </PopoverContent>
    </Popover>
  );
}
