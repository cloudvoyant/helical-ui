// libs/helical-ui/src/figure.ts
// Closely based on: diffbook Figure (packages/diffbook-ui/src/components/Figure.tsx).

export const figureRootBase = 'not-prose my-4 flex flex-col items-center';

export const figureImageBase = 'rounded-lg border border-border';

export const figureCaptionBase = 'mt-2 text-center text-sm text-muted-foreground';

export interface FigureProps {
  src?: string;
  alt?: string;
  caption?: string;
  className?: string;
}
