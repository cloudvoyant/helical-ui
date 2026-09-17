// libs/helical-ui/src/button.ts
// Closely based on: @cloudvoyant/helical-ui (shared buttonVariants cva — shadcn-style variants)
import { cva, type VariantProps } from 'class-variance-authority';

type VariantName = 'solid' | 'outline' | 'text';
type ColorName = 'primary' | 'secondary' | 'success' | 'danger' | 'warn' | 'info';

const fills: Record<VariantName, Record<ColorName, string>> = {
  solid: {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    success: 'bg-success text-success-foreground hover:bg-success/90',
    danger: 'bg-danger text-danger-foreground hover:bg-danger/90',
    warn: 'bg-warn text-warn-foreground hover:bg-warn/90',
    info: 'bg-info text-info-foreground hover:bg-info/90',
  },
  outline: {
    primary: 'border border-primary/40 bg-background text-primary hover:bg-primary/10',
    secondary: 'border border-secondary-foreground/30 bg-background text-secondary-foreground hover:bg-secondary',
    success: 'border border-success/50 bg-background text-success hover:bg-success/10',
    danger: 'border border-danger/50 bg-background text-danger hover:bg-danger/10',
    warn: 'border border-warn/60 bg-background text-warn hover:bg-warn/15',
    info: 'border border-info/50 bg-background text-info hover:bg-info/10',
  },
  text: {
    primary: 'bg-transparent text-primary hover:bg-primary/10',
    secondary: 'bg-transparent text-secondary-foreground hover:bg-secondary',
    success: 'bg-transparent text-success hover:bg-success/10',
    danger: 'bg-transparent text-danger hover:bg-danger/10',
    warn: 'bg-transparent text-warn hover:bg-warn/15',
    info: 'bg-transparent text-info hover:bg-info/10',
  },
};

const compoundVariants = (Object.entries(fills) as [VariantName, Record<ColorName, string>][]).flatMap(
  ([variant, colors]) =>
    (Object.entries(colors) as [ColorName, string][]).map(([color, className]) => ({ variant, color, className })),
);

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        solid: '',
        outline: '',
        text: '',
      },
      color: {
        primary: '',
        secondary: '',
        success: '',
        danger: '',
        warn: '',
        info: '',
      },
      size: {
        sm: 'h-9 px-3',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 px-8',
        icon: 'size-10',
      },
    },
    compoundVariants,
    defaultVariants: {
      variant: 'solid',
      color: 'primary',
      size: 'md',
    },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

export interface ButtonProps {
  variant?: ButtonVariants['variant'];
  color?: ButtonVariants['color'];
  size?: ButtonVariants['size'];
  className?: string;
}
