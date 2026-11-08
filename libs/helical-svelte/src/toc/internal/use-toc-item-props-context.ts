// libs/helical-svelte/src/toc/internal/use-toc-item-props-context.ts
// Vendored from Ark UI (chakra-ui/ark, packages/svelte/src/lib/components/toc/use-toc-item-props-context.ts).
import type { ItemProps } from '@zag-js/toc';
import { createContext } from './utils/create-context';

export const [TocItemPropsProvider, useTocItemPropsContext] = createContext<() => ItemProps>({
  name: 'TocItemPropsContext',
  hookName: 'useTocItemPropsContext',
  providerName: '<TocItemPropsProvider />',
});
