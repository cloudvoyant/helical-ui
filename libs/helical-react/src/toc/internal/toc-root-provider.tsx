// libs/helical-react/src/toc/internal/toc-root-provider.tsx
// Vendored from Ark UI (chakra-ui/ark, packages/react/src/components/toc/toc-root-provider.tsx).
import { type HTMLProps, type PolymorphicProps, ark } from '@ark-ui/react/factory';
import { forwardRef } from 'react';
import type { Assign } from './utils/types';
import { createSplitProps } from './utils/create-split-props';
import type { UseTocReturn } from './use-toc';
import { TocProvider } from './use-toc-context';

interface RootProviderProps {
  value: UseTocReturn;
}

export type TocRootProviderBaseProps = RootProviderProps & PolymorphicProps;
export type TocRootProviderProps = Assign<HTMLProps<'div'>, TocRootProviderBaseProps>;

const splitRootProviderProps = createSplitProps<RootProviderProps>();

export const TocRootProvider = forwardRef<HTMLDivElement, TocRootProviderProps>((props, ref) => {
  const [{ value: toc }, localProps] = splitRootProviderProps(props, ['value']);

  return (
    <TocProvider value={toc}>
      <ark.div {...localProps} ref={ref} />
    </TocProvider>
  );
});

TocRootProvider.displayName = 'TocRootProvider';
