// libs/helical-react/src/card/description.tsx
// Closely based on: Chakra UI Card, built on @ark-ui/react/factory (Ark UI)
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import { cardDescriptionBase, cn } from '@cloudvoyant/helical-ui';

export type CardDescriptionProps = HTMLArkProps<'p'>;

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return <ark.p className={cn(cardDescriptionBase, className)} {...props} />;
}
