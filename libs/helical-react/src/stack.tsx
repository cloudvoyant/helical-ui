// libs/helical-react/src/stack.tsx
// Closely based on: Chakra UI Stack/HStack/VStack, built on @ark-ui/react/factory (Ark UI)
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import { stackBase, hstackBase, vstackBase, cn } from '@cloudvoyant/helical-ui';

export type StackProps = HTMLArkProps<'div'>;
export type HStackProps = HTMLArkProps<'div'>;
export type VStackProps = HTMLArkProps<'div'>;

export function Stack({ className, ...props }: StackProps) {
  return <ark.div className={cn(stackBase, className)} {...props} />;
}

export function HStack({ className, ...props }: HStackProps) {
  return <ark.div className={cn(hstackBase, className)} {...props} />;
}

export function VStack({ className, ...props }: VStackProps) {
  return <ark.div className={cn(vstackBase, className)} {...props} />;
}
