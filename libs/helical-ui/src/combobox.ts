// libs/helical-ui/src/combobox.ts
// Closely based on: Shark UI combobox (https://shark.vini.one/docs/components/combobox, @ark-ui/react/combobox).
import { cva, type VariantProps } from 'class-variance-authority';

export const comboboxControlBase = 'relative flex w-full flex-wrap items-center gap-1';

export const comboboxInputBase = 'pe-8';

export const comboboxTriggerBase =
  'absolute inset-y-0 end-1 flex w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0';

export const comboboxClearTriggerBase =
  'absolute inset-y-0 end-9 flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0';

export const comboboxPositionerBase = 'z-50 [--z-index:50]!';

export const comboboxContentBase =
  'relative z-50 max-h-96 min-w-48 overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none';

export const comboboxItemGroupLabelBase = 'px-2 py-1.5 text-xs font-semibold text-muted-foreground';

export const comboboxItemVariants = cva(
  'relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground',
  {
    variants: {
      showIndicator: {
        true: 'pe-8',
        false: 'pe-2',
      },
    },
    defaultVariants: {
      showIndicator: true,
    },
  },
);

export type ComboboxItemVariants = VariantProps<typeof comboboxItemVariants>;

export const comboboxItemIndicatorBase = 'absolute inset-y-0 end-2 flex items-center justify-center text-foreground';

export const comboboxListBase = 'flex flex-col';

export const comboboxEmptyBase = 'px-2 py-1.5 text-center text-sm text-muted-foreground';

export interface ComboboxProps {
  className?: string;
}
