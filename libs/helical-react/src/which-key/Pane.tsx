// libs/helical-react/src/which-key/Pane.tsx
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import { cn, paneVariants, type PaneProps as CorePaneProps } from '@cloudvoyant/helical-ui';
import { useOptionalPaneRegistration } from './context';

export type PaneProps = HTMLArkProps<'div'> & CorePaneProps;

export function Pane({
  paneId,
  paneTitle = 'Pane',
  paneDisabled = false,
  paneOrder,
  className,
  children,
  ...props
}: PaneProps) {
  const pane = useOptionalPaneRegistration({
    paneId,
    paneTitle,
    paneDisabled,
    paneOrder,
    defaultTitle: paneTitle,
  });

  return (
    <ark.div
      ref={pane.ref}
      data-slot="pane"
      {...pane.dataAttributes}
      className={cn(paneVariants({ active: pane.isActive }), className)}
      {...props}
    >
      {children}
    </ark.div>
  );
}
