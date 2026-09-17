// libs/helical-react/src/prevnext.tsx
// Closely based on: diffbook PrevNext (packages/diffbook-ui/src/components/PrevNext.tsx)
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import {
  prevNextRootBase,
  prevNextLinkBase,
  prevNextLinkNextBase,
  prevNextDirectionBase,
  prevNextTitleBase,
  prevNextSpacerBase,
  cn,
} from '@cloudvoyant/helical-ui';
import type { PrevNextProps as PrevNextPropsBase } from '@cloudvoyant/helical-ui';

export type PrevNextProps = HTMLArkProps<'nav'> & PrevNextPropsBase;

export function PrevNext({ prev, next, className, ...props }: PrevNextProps) {
  if (!prev && !next) return null;
  return (
    <ark.nav className={cn(prevNextRootBase, className)} aria-label="Previous and next pages" {...props}>
      {prev ? (
        <ark.a href={prev.href} className={prevNextLinkBase}>
          <ark.span className={prevNextDirectionBase}>Previous</ark.span>
          <ark.span className={prevNextTitleBase}>← {prev.title}</ark.span>
        </ark.a>
      ) : (
        <ark.span className={prevNextSpacerBase} />
      )}
      {next ? (
        <ark.a href={next.href} className={cn(prevNextLinkBase, prevNextLinkNextBase)}>
          <ark.span className={prevNextDirectionBase}>Next</ark.span>
          <ark.span className={prevNextTitleBase}>{next.title} →</ark.span>
        </ark.a>
      ) : (
        <ark.span className={prevNextSpacerBase} />
      )}
    </ark.nav>
  );
}
