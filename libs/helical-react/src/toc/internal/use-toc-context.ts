// libs/helical-react/src/toc/internal/use-toc-context.ts
// Vendored from Ark UI (chakra-ui/ark, packages/react/src/components/toc/use-toc-context.ts).
import { createContext } from './utils/create-context';
import type { UseTocReturn } from './use-toc';

export type UseTocContext = UseTocReturn;

export const [TocProvider, useTocContext] = createContext<UseTocContext>({
  name: 'TocContext',
  hookName: 'useTocContext',
  providerName: '<TocProvider />',
});
