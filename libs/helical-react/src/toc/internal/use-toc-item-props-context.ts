// libs/helical-react/src/toc/internal/use-toc-item-props-context.ts
// Vendored from Ark UI (chakra-ui/ark, packages/react/src/components/toc/use-toc-item-props-context.ts).
import type { ItemProps } from '@zag-js/toc';
import { createContext } from './utils/create-context';

export type UseTocItemPropsContext = ItemProps;

export const [TocItemPropsProvider, useTocItemPropsContext] = createContext<UseTocItemPropsContext>({
  name: 'TocItemPropsContext',
  hookName: 'useTocItemPropsContext',
  providerName: '<TocItemPropsProvider />',
});
