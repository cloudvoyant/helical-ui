// libs/helical-react/src/toc/internal/toc-indicator.tsx
// Vendored from Ark UI (chakra-ui/ark, packages/react/src/components/toc/toc-indicator.tsx).
import { type HTMLProps, type PolymorphicProps, ark } from '@ark-ui/react/factory';
import { mergeProps } from '@zag-js/react';
import { forwardRef } from 'react';
import { useTocContext } from './use-toc-context';

export type TocIndicatorBaseProps = PolymorphicProps;
export interface TocIndicatorProps extends HTMLProps<'div'>, TocIndicatorBaseProps {}

export const TocIndicator = forwardRef<HTMLDivElement, TocIndicatorProps>((props, ref) => {
  const toc = useTocContext();
  const mergedProps = mergeProps(toc.getIndicatorProps(), props);

  return <ark.div {...mergedProps} ref={ref} />;
});

TocIndicator.displayName = 'TocIndicator';
