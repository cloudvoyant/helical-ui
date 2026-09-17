// libs/helical-react/src/figure.tsx
// Closely based on: diffbook Figure (packages/diffbook-ui/src/components/Figure.tsx)
import type { ReactNode } from 'react';
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import { figureRootBase, figureImageBase, figureCaptionBase, cn } from '@cloudvoyant/helical-ui';
import type { FigureProps as FigurePropsBase } from '@cloudvoyant/helical-ui';

export type FigureProps = HTMLArkProps<'figure'> &
  FigurePropsBase & {
    /** A custom image element (e.g. `<img srcSet="…" sizes="…">`). When provided it replaces
     *  the default `<img>` built from `src`/`alt`. */
    img?: ReactNode;
  };

export function Figure({ src, alt, img, caption, className, ...props }: FigureProps) {
  return (
    <ark.figure className={cn(figureRootBase, className)} {...props}>
      {img ?? (src ? <ark.img src={src} alt={alt} loading="lazy" className={figureImageBase} /> : null)}
      {caption ? <ark.figcaption className={figureCaptionBase}>{caption}</ark.figcaption> : null}
    </ark.figure>
  );
}
