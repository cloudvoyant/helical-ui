// libs/helical-ui/src/select.ts
// Closely based on: Shark UI select + native-select (https://shark.vini.one/docs/components/select, @ark-ui/react/select).
import { cva, type VariantProps } from 'class-variance-authority';

export interface SelectItemData {
  value: string;
  label: string;
  disabled?: boolean;
}

export const selectTriggerBase =
  'flex w-fit cursor-default items-center gap-2 whitespace-nowrap data-[placeholder-shown]:text-muted-foreground data-[state=open]:border-ring data-[state=open]:ring-[3px] data-[state=open]:ring-ring/30 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground';

export const selectValueBase = 'flex min-w-0 items-center gap-2 truncate';

export const selectIndicatorBase = 'flex items-center justify-center text-muted-foreground';

export const selectClearTriggerBase =
  'flex items-center justify-center text-muted-foreground opacity-60 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0';

export const selectPositionerBase = 'z-50 [--z-index:50]!';

export const selectContentBase =
  'relative z-50 max-h-96 min-w-(--reference-width) overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none';

export const selectItemGroupLabelBase = 'px-2 py-1.5 text-xs font-semibold text-muted-foreground';

export const selectItemBase =
  'relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 pe-8 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground';

export const selectItemTextBase = 'flex w-full flex-1 items-center gap-2';

export const selectItemIndicatorBase = 'absolute inset-y-0 end-2 flex items-center justify-center text-foreground';

export const nativeSelectVariants = cva(
  'appearance-none w-full min-w-0 rounded-md border border-input bg-transparent pe-8 ps-2.5 text-sm shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/24',
  {
    variants: {
      size: {
        sm: 'h-8',
        md: 'h-9',
        lg: 'h-10',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export type NativeSelectVariants = VariantProps<typeof nativeSelectVariants>;

export const nativeSelectWrapperBase =
  'relative w-fit [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground';

export const nativeSelectIconBase =
  'pointer-events-none absolute inset-y-0 end-2.5 flex items-center justify-center text-muted-foreground';

export interface SelectProps {
  className?: string;
}
