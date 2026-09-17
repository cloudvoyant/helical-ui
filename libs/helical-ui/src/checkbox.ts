// libs/helical-ui/src/checkbox.ts
// Closely based on: Shark UI checkbox (https://shark.vini.one/docs/components/checkbox, @ark-ui/react/checkbox).
import { cva, type VariantProps } from 'class-variance-authority';

export const checkboxVariants = cva(
  'relative inline-flex size-4 shrink-0 items-center justify-center rounded-sm border border-input bg-transparent shadow-xs transition-shadow focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 focus-visible:ring-offset-1 focus-visible:ring-offset-background data-invalid:border-destructive data-invalid:ring-[3px] data-invalid:ring-destructive/24 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'size-3.5',
        md: 'size-4',
        lg: 'size-5',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export type CheckboxVariants = VariantProps<typeof checkboxVariants>;

export interface CheckboxProps {
  size?: CheckboxVariants['size'];
  className?: string;
}

export const checkboxIndicatorBase =
  'flex size-full items-center justify-center text-primary-foreground data-[state=unchecked]:hidden [&_svg]:pointer-events-none [&_svg]:size-3 [&_svg]:shrink-0';

export const checkboxLabelBase = 'select-none text-sm font-medium leading-none';

export const checkboxGroupBase = 'flex flex-col gap-2';
