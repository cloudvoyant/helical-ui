// libs/helical-react/src/card/cover.tsx
// Closely based on: Chakra UI Card, built on @ark-ui/react/factory (Ark UI)
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import { cardCoverVariants, cn } from '@cloudvoyant/helical-ui';
import type { CardCoverProps as CardCoverBaseProps } from '@cloudvoyant/helical-ui';
import { useCardOrientation } from './context';

export type CardCoverProps = HTMLArkProps<'div'> & CardCoverBaseProps;

export function CardCover({ className, variant, orientation, ...props }: CardCoverProps) {
  const contextOrientation = useCardOrientation();
  return (
    <ark.div
      className={cn(cardCoverVariants({ variant, orientation: orientation ?? contextOrientation }), className)}
      {...props}
    />
  );
}
