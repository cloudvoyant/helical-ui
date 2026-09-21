// libs/helical-react/src/toc/internal/toc-root.tsx
// Vendored from Ark UI (chakra-ui/ark, packages/react/src/components/toc/toc-root.tsx).
import { type HTMLProps, type PolymorphicProps, ark } from '@ark-ui/react/factory';
import { mergeProps } from '@zag-js/react';
import { forwardRef } from 'react';
import type { Assign } from './utils/types';
import { createSplitProps } from './utils/create-split-props';
import { type UseTocProps, useToc } from './use-toc';
import { TocProvider } from './use-toc-context';

export type TocRootBaseProps = UseTocProps & PolymorphicProps;
export type TocRootProps = Assign<HTMLProps<'div'>, TocRootBaseProps>;

const splitRootProps = createSplitProps<UseTocProps>();

export const TocRoot = forwardRef<HTMLDivElement, TocRootProps>((props, ref) => {
  const [useTocProps, localProps] = splitRootProps(props, [
    'activeIds',
    'autoScroll',
    'defaultActiveIds',
    'scrollEl',
    'id',
    'ids',
    'items',
    'onActiveChange',
    'rootMargin',
    'scrollBehavior',
    'threshold',
  ]);
  const toc = useToc(useTocProps);
  const mergedProps = mergeProps(toc.getRootProps(), localProps);

  return (
    <TocProvider value={toc}>
      <ark.div {...mergedProps} ref={ref} />
    </TocProvider>
  );
});

TocRoot.displayName = 'TocRoot';
