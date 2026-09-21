// libs/helical-react/src/toc/internal/toc-context.tsx
// Vendored from Ark UI (chakra-ui/ark, packages/react/src/components/toc/toc-context.tsx).
import type { ReactNode } from 'react';
import { type UseTocContext, useTocContext } from './use-toc-context';

export interface TocContextProps {
  children: (context: UseTocContext) => ReactNode;
}

export const TocContext = (props: TocContextProps) => props.children(useTocContext());
