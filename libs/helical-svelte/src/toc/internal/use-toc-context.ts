// libs/helical-svelte/src/toc/internal/use-toc-context.ts
// Vendored from Ark UI (chakra-ui/ark, packages/svelte/src/lib/components/toc/use-toc-context.ts).
import { createContext } from './utils/create-context';
import type { UseTocReturn } from './use-toc.svelte';

export type UseTocContext = UseTocReturn;

export const [TocProvider, useTocContext, TocContextId] = createContext<UseTocContext>({
  name: 'TocContext',
  hookName: 'useTocContext',
  providerName: '<TocProvider />',
});
