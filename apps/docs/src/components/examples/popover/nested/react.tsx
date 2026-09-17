// apps/docs/src/components/examples/popover/nested/react.tsx
import { Popover, PopoverTrigger, PopoverTitle, PopoverDescription, PopoverContent } from '@cloudvoyant/helical-react';

export default function ReactPopoverNested() {
  return (
    <Popover>
      <PopoverTrigger className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
        Open Popover
      </PopoverTrigger>
      <PopoverContent>
        <PopoverTitle>Settings</PopoverTitle>
        <PopoverDescription>Manage your preferences and account settings.</PopoverDescription>
        <Popover lazyMount unmountOnExit positioning={{ placement: 'right' }}>
          <PopoverTrigger className="mt-2 rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground">
            Advanced
          </PopoverTrigger>
          <PopoverContent>
            <PopoverTitle>Advanced Settings</PopoverTitle>
            <PopoverDescription>Configure advanced options for power users.</PopoverDescription>
          </PopoverContent>
        </Popover>
      </PopoverContent>
    </Popover>
  );
}
