// libs/helical-react/src/center.tsx
// Closely based on: Chakra UI Center, built on @ark-ui/react/factory (Ark UI)
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import { centerBase, cn } from '@cloudvoyant/helical-ui';

export type CenterProps = HTMLArkProps<'div'>;

export function Center({ className, ...props }: CenterProps) {
  return <ark.div className={cn(centerBase, className)} {...props} />;
}
