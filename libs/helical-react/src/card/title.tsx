// libs/helical-react/src/card/title.tsx
// Closely based on: Chakra UI Card, built on @ark-ui/react/factory (Ark UI)
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import { cardTitleBase, cn } from '@cloudvoyant/helical-ui';

export type CardTitleProps = HTMLArkProps<'h3'>;

export function CardTitle({ className, ...props }: CardTitleProps) {
  return <ark.h3 className={cn(cardTitleBase, className)} {...props} />;
}
