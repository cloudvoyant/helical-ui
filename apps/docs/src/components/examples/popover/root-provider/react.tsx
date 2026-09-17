// apps/docs/src/components/examples/popover/root-provider/react.tsx
import {
  usePopover,
  PopoverProvider,
  PopoverTrigger,
  PopoverTitle,
  PopoverDescription,
  PopoverContent,
} from '@cloudvoyant/helical-react';

export default function ReactPopoverRootProvider() {
  const popover = usePopover({ positioning: { placement: 'bottom-start' } });
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-muted-foreground">Popover is {popover.open ? 'open' : 'closed'}</p>
      <PopoverProvider value={popover}>
        <PopoverTrigger className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
          Toggle Popover
        </PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Controlled Externally</PopoverTitle>
          <PopoverDescription>This popover is controlled via the usePopover hook.</PopoverDescription>
        </PopoverContent>
      </PopoverProvider>
    </div>
  );
}
