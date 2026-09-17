// libs/helical-ui/src/card.ts
// Closely based on: Chakra UI Card slot recipe — adapted to the cva/Tailwind approach.
// Themed via the shadcn --card/--card-foreground/--muted/--border variables.
import { cva, type VariantProps } from 'class-variance-authority';

export const cardVariants = cva('flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground', {
  variants: {
    variant: {
      outline: 'border-border shadow-xs',
      elevated: 'border-transparent shadow-md',
      subtle: 'border-transparent bg-muted',
    },
    size: {
      sm: 'gap-3 p-3 [--card-padding:0.75rem]',
      md: 'gap-4 p-4 [--card-padding:1rem]',
      lg: 'gap-6 p-6 [--card-padding:1.5rem]',
    },
    orientation: {
      vertical: '',
      horizontal: 'flex-row',
    },
  },
  defaultVariants: {
    variant: 'outline',
    size: 'md',
    orientation: 'vertical',
  },
});

export type CardVariants = VariantProps<typeof cardVariants>;

export interface CardProps {
  variant?: CardVariants['variant'];
  size?: CardVariants['size'];
  orientation?: CardVariants['orientation'];
  className?: string;
}

export const cardCoverVariants = cva('shrink-0 overflow-hidden', {
  variants: {
    variant: {
      flush: '',
      inset: 'rounded-md',
    },
    orientation: {
      vertical: '',
      horizontal: '',
    },
  },
  compoundVariants: [
    {
      variant: 'flush',
      orientation: 'vertical',
      className: '-mx-[var(--card-padding)] -mt-[var(--card-padding)]',
    },
    {
      variant: 'flush',
      orientation: 'horizontal',
      className: '-ml-[var(--card-padding)] -mt-[var(--card-padding)] -mb-[var(--card-padding)]',
    },
  ],
  defaultVariants: {
    variant: 'flush',
    orientation: 'vertical',
  },
});

export type CardCoverVariants = VariantProps<typeof cardCoverVariants>;

export interface CardCoverProps {
  variant?: CardCoverVariants['variant'];
  orientation?: CardCoverVariants['orientation'];
  className?: string;
}

export const cardHeaderBase = 'flex flex-col gap-1';

export const cardBodyBase = '';

export const cardFooterBase = 'flex items-center gap-2';

export const cardTitleBase = 'font-semibold leading-tight';

export const cardDescriptionBase = 'text-sm text-muted-foreground';
