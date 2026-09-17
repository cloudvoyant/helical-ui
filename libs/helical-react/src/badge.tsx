// libs/helical-react/src/badge.tsx
// Closely based on: @ark-ui/react/factory (Ark UI)
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import { badgeVariants, cn } from '@cloudvoyant/helical-ui';
import type { BadgeProps as BadgePropsBase } from '@cloudvoyant/helical-ui';

export type BadgeProps = HTMLArkProps<'span'> & BadgePropsBase;

export function Badge({ className, variant, color, size, ...props }: BadgeProps) {
  return <ark.span className={cn(badgeVariants({ variant, color, size }), className)} {...props} />;
}
