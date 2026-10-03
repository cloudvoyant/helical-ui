// libs/helical-react/src/toc/internal/toc-content.tsx
// Vendored from Ark UI (chakra-ui/ark, packages/react/src/components/toc/toc-content.tsx).
import { type HTMLProps, type PolymorphicProps, ark } from '@ark-ui/react/factory';
import { forwardRef } from 'react';

export type TocContentBaseProps = PolymorphicProps;
export interface TocContentProps extends HTMLProps<'article'>, TocContentBaseProps {}

export const TocContent = forwardRef<HTMLElement, TocContentProps>((props, ref) => {
  return <ark.article {...props} ref={ref} />;
});

TocContent.displayName = 'TocContent';
