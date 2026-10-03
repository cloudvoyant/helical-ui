// libs/helical-react/src/toc/internal/toc-item.tsx
// Vendored from Ark UI (chakra-ui/ark, packages/react/src/components/toc/toc-item.tsx).
import { type HTMLProps, type PolymorphicProps, ark } from '@ark-ui/react/factory';
import { mergeProps } from '@zag-js/react';
import type { ItemProps } from '@zag-js/toc';
import { forwardRef } from 'react';
import { useTocContext } from './use-toc-context';
import { TocItemPropsProvider } from './use-toc-item-props-context';
import { createSplitProps } from './utils/create-split-props';

export interface TocItemBaseProps extends ItemProps, PolymorphicProps {}
export interface TocItemProps extends HTMLProps<'li'>, TocItemBaseProps {}

const splitItemProps = createSplitProps<ItemProps>();

export const TocItem = forwardRef<HTMLLIElement, TocItemProps>((props, ref) => {
  const [itemProps, localProps] = splitItemProps(props, ['item']);
  const toc = useTocContext();
  const mergedProps = mergeProps(toc.getItemProps(itemProps), localProps);

  return (
    <TocItemPropsProvider value={itemProps}>
      <ark.li {...mergedProps} ref={ref} />
    </TocItemPropsProvider>
  );
});

TocItem.displayName = 'TocItem';
