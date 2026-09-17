// libs/helical-ui/src/switch.ts
// Closely based on: Shark UI switch (https://shark.vini.one/docs/components/switch, @ark-ui/react/switch).
import { cva, type VariantProps } from 'class-variance-authority';

export const switchVariants = cva(
  'inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-transparent bg-input p-0.5 shadow-xs transition-colors outline-none data-[state=checked]:bg-primary data-invalid:border-destructive data-invalid:ring-[3px] data-invalid:ring-destructive/24 focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-5 w-9',
        md: 'h-6 w-11',
        lg: 'h-7 w-12',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export type SwitchVariants = VariantProps<typeof switchVariants>;

export interface SwitchProps {
  size?: SwitchVariants['size'];
  className?: string;
}

export const switchControlBase = 'flex size-full items-center';

export const switchThumbBase =
  'pointer-events-none block aspect-square h-full w-auto rounded-full bg-background shadow-sm transition-transform data-[state=checked]:translate-x-[calc(100%-1px)] data-[state=unchecked]:translate-x-0 dark:data-[state=unchecked]:bg-foreground';

export const switchLabelBase = 'select-none text-sm font-medium leading-none';
