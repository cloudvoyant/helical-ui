// libs/helical-react/src/toc/internal/toc-title.tsx
// Vendored from Ark UI (chakra-ui/ark, packages/react/src/components/toc/toc-title.tsx).
import { type HTMLProps, type PolymorphicProps, ark } from '@ark-ui/react/factory';
import { mergeProps } from '@zag-js/react';
import { forwardRef } from 'react';
import { useTocContext } from './use-toc-context';

export type TocTitleBaseProps = PolymorphicProps;
export interface TocTitleProps extends HTMLProps<'h2'>, TocTitleBaseProps {}

export const TocTitle = forwardRef<HTMLHeadingElement, TocTitleProps>((props, ref) => {
  const toc = useTocContext();
  const mergedProps = mergeProps(toc.getTitleProps(), props);

  return <ark.h2 {...mergedProps} ref={ref} />;
});

TocTitle.displayName = 'TocTitle';
