// libs/vortex-react/src/prose.tsx
// Closely based on: Shark UI prose (https://shark.vini.one/docs/components/prose)
import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';
import { proseVariants, cn, type ProseVariants } from '@cloudvoyant/vortex-ui';

export type ProseProps = {
  as?: ElementType;
  size?: ProseVariants['size'];
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<'div'>, 'className' | 'children'>;

export function Prose({ as: Tag = 'div', size, className, children, ...props }: ProseProps) {
  return (
    <Tag className={cn(proseVariants({ size }), 'prose', className)} {...props}>
      {children}
    </Tag>
  );
}
