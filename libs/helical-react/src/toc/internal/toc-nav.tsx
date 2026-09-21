// libs/helical-react/src/toc/internal/toc-nav.tsx
// Vendored from Ark UI (chakra-ui/ark, packages/react/src/components/toc/toc-nav.tsx).
import { type HTMLProps, type PolymorphicProps, ark } from '@ark-ui/react/factory';
import { mergeProps } from '@zag-js/react';
import { forwardRef } from 'react';
import { useTocContext } from './use-toc-context';

export interface TocNavBaseProps extends PolymorphicProps {
  placement?: 'left' | 'right';
}
export interface TocNavProps extends HTMLProps<'nav'>, TocNavBaseProps {}

export const TocNav = forwardRef<HTMLElement, TocNavProps>((props, ref) => {
  const { placement, ...rest } = props;
  const toc = useTocContext();
  const mergedProps = mergeProps(toc.getRootProps(), rest);

  return <ark.nav {...mergedProps} data-placement={placement} ref={ref} />;
});

TocNav.displayName = 'TocNav';
