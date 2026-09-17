// libs/helical-react/src/card/footer.tsx
// Closely based on: Chakra UI Card, built on @ark-ui/react/factory (Ark UI)
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import { cardFooterBase, cn } from '@cloudvoyant/helical-ui';

export type CardFooterProps = HTMLArkProps<'div'>;

export function CardFooter({ className, ...props }: CardFooterProps) {
  return <ark.div className={cn(cardFooterBase, className)} {...props} />;
}
