// libs/helical-react/src/toc/internal/toc-list.tsx
// Vendored from Ark UI (chakra-ui/ark, packages/react/src/components/toc/toc-list.tsx).
import { type HTMLProps, type PolymorphicProps, ark } from '@ark-ui/react/factory';
import { mergeProps } from '@zag-js/react';
import { forwardRef } from 'react';
import { useTocContext } from './use-toc-context';

export type TocListBaseProps = PolymorphicProps;
export interface TocListProps extends HTMLProps<'ul'>, TocListBaseProps {}

export const TocList = forwardRef<HTMLUListElement, TocListProps>((props, ref) => {
  const toc = useTocContext();
  const mergedProps = mergeProps(toc.getListProps(), props);

  return <ark.ul {...mergedProps} ref={ref} />;
});

TocList.displayName = 'TocList';
