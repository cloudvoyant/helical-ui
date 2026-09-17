// libs/helical-react/src/item.tsx
// Closely based on: helical-ui example-item primitive, built on @ark-ui/react/factory (Ark UI)
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import { itemVariants, cn } from '@cloudvoyant/helical-ui';
import type { ItemProps as ItemPropsBase } from '@cloudvoyant/helical-ui';

export type ItemProps = HTMLArkProps<'div'> & ItemPropsBase;

export function Item({ className, variant, ...props }: ItemProps) {
  return <ark.div className={cn(itemVariants({ variant }), className)} {...props} />;
}
