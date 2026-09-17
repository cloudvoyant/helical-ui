// libs/helical-ui/src/badge.ts
// Closely based on: @cloudvoyant/helical-ui (shared badgeVariants cva — Chakra-inspired API, colors mirror button)
import { cva, type VariantProps } from 'class-variance-authority';

type VariantName = 'solid' | 'subtle' | 'outline' | 'surface' | 'plain';
type ColorName = 'primary' | 'secondary' | 'success' | 'danger' | 'warn' | 'info';

const fills: Record<VariantName, Record<ColorName, string>> = {
  solid: {
    primary: 'border-transparent bg-primary text-primary-foreground',
    secondary: 'border-transparent bg-secondary text-secondary-foreground',
    success: 'border-transparent bg-success text-success-foreground',
    danger: 'border-transparent bg-danger text-danger-foreground',
    warn: 'border-transparent bg-warn text-warn-foreground',
    info: 'border-transparent bg-info text-info-foreground',
  },
  subtle: {
    primary: 'border-transparent bg-primary/10 text-primary',
    secondary: 'border-transparent bg-secondary/10 text-secondary-foreground',
    success: 'border-transparent bg-success/10 text-success',
    danger: 'border-transparent bg-danger/10 text-danger',
    warn: 'border-transparent bg-warn/10 text-warn',
    info: 'border-transparent bg-info/10 text-info',
  },
  outline: {
    primary: 'border-primary/40 bg-transparent text-primary',
    secondary: 'border-secondary-foreground/30 bg-transparent text-secondary-foreground',
    success: 'border-success/50 bg-transparent text-success',
    danger: 'border-danger/50 bg-transparent text-danger',
    warn: 'border-warn/50 bg-transparent text-warn',
    info: 'border-info/50 bg-transparent text-info',
  },
  surface: {
    primary: 'border-primary/40 bg-primary/10 text-primary',
    secondary: 'border-secondary-foreground/30 bg-secondary text-secondary-foreground',
    success: 'border-success/50 bg-success/10 text-success',
    danger: 'border-danger/50 bg-danger/10 text-danger',
    warn: 'border-warn/50 bg-warn/10 text-warn',
    info: 'border-info/50 bg-info/10 text-info',
  },
  plain: {
    primary: 'border-transparent bg-transparent text-primary',
    secondary: 'border-transparent bg-transparent text-secondary-foreground',
    success: 'border-transparent bg-transparent text-success',
    danger: 'border-transparent bg-transparent text-danger',
    warn: 'border-transparent bg-transparent text-warn',
    info: 'border-transparent bg-transparent text-info',
  },
};

const compoundVariants = (Object.entries(fills) as [VariantName, Record<ColorName, string>][]).flatMap(
  ([variant, colors]) =>
    (Object.entries(colors) as [ColorName, string][]).map(([color, className]) => ({ variant, color, className })),
);

export const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-md border font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        solid: '',
        subtle: '',
        outline: '',
        surface: '',
        plain: '',
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
        xs: 'px-1.5 py-0.5 text-[10px]',
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    compoundVariants,
    defaultVariants: {
      variant: 'subtle',
      color: 'primary',
      size: 'sm',
    },
  },
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;

export interface BadgeProps {
  variant?: BadgeVariants['variant'];
  color?: BadgeVariants['color'];
  size?: BadgeVariants['size'];
  className?: string;
}
