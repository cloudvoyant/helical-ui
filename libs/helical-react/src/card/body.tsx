// libs/helical-react/src/card/body.tsx
// Closely based on: Chakra UI Card, built on @ark-ui/react/factory (Ark UI)
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import { cardBodyBase, cn } from '@cloudvoyant/helical-ui';

export type CardBodyProps = HTMLArkProps<'div'>;

export function CardBody({ className, ...props }: CardBodyProps) {
  return <ark.div className={cn(cardBodyBase, className)} {...props} />;
}
