// libs/helical-react/src/col.tsx
// Closely based on: Chakra UI Flex (direction="column"), built on @ark-ui/react/factory (Ark UI)
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import { colBase, cn } from '@cloudvoyant/helical-ui';

export type ColProps = HTMLArkProps<'div'>;

export function Col({ className, ...props }: ColProps) {
  return <ark.div className={cn(colBase, className)} {...props} />;
}
