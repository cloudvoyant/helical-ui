// libs/helical-react/src/popover.tsx
// Closely based on: Ark UI popover (@ark-ui/react/popover)
import {
  PopoverRoot as ArkPopoverRoot,
  PopoverRootProvider as ArkPopoverRootProvider,
  PopoverTrigger as ArkPopoverTrigger,
  PopoverAnchor as ArkPopoverAnchor,
  PopoverPositioner as ArkPopoverPositioner,
  PopoverArrow as ArkPopoverArrow,
  PopoverArrowTip as ArkPopoverArrowTip,
  PopoverContent as ArkPopoverContent,
  PopoverTitle as ArkPopoverTitle,
  PopoverDescription as ArkPopoverDescription,
  PopoverCloseTrigger as ArkPopoverCloseTrigger,
  PopoverIndicator as ArkPopoverIndicator,
  usePopover,
  usePopoverContext,
  type PopoverRootProps,
  type PopoverRootProviderProps,
  type PopoverTriggerProps,
  type PopoverAnchorProps,
  type PopoverContentProps,
  type PopoverTitleProps,
  type PopoverDescriptionProps,
  type PopoverCloseTriggerProps,
  type PopoverIndicatorProps,
} from '@ark-ui/react/popover';
import { Portal } from '@ark-ui/react/portal';
import {
  popoverPositionerBase,
  popoverArrowBase,
  popoverContentBase,
  popoverTitleBase,
  popoverDescriptionBase,
  popoverCloseTriggerBase,
  popoverIndicatorBase,
  cn,
} from '@cloudvoyant/helical-ui';

export function Popover(props: PopoverRootProps) {
  return <ArkPopoverRoot {...props} />;
}

export function PopoverProvider(props: PopoverRootProviderProps) {
  return <ArkPopoverRootProvider {...props} />;
}

export function PopoverTrigger({ className, ...props }: PopoverTriggerProps) {
  return <ArkPopoverTrigger className={cn(className)} {...props} />;
}

export function PopoverAnchor({ className, ...props }: PopoverAnchorProps) {
  return <ArkPopoverAnchor className={cn(className)} {...props} />;
}

export type PopoverContentPropsWithArrow = PopoverContentProps & { arrow?: boolean };

export function PopoverContent({ arrow = false, className, ...props }: PopoverContentPropsWithArrow) {
  const popover = usePopoverContext();
  return (
    <Portal>
      <ArkPopoverPositioner className={popoverPositionerBase}>
        {arrow && popover.open ? (
          <ArkPopoverArrow className={popoverArrowBase}>
            <ArkPopoverArrowTip />
          </ArkPopoverArrow>
        ) : null}
        <ArkPopoverContent className={cn(popoverContentBase, className)} {...props} />
      </ArkPopoverPositioner>
    </Portal>
  );
}

export function PopoverTitle({ className, ...props }: PopoverTitleProps) {
  return <ArkPopoverTitle className={cn(popoverTitleBase, className)} {...props} />;
}

export function PopoverDescription({ className, ...props }: PopoverDescriptionProps) {
  return <ArkPopoverDescription className={cn(popoverDescriptionBase, className)} {...props} />;
}

export function PopoverDismiss({ className, ...props }: PopoverCloseTriggerProps) {
  return <ArkPopoverCloseTrigger aria-label="Close" className={cn(popoverCloseTriggerBase, className)} {...props} />;
}

export function PopoverIndicator({ className, ...props }: PopoverIndicatorProps) {
  return <ArkPopoverIndicator className={cn(popoverIndicatorBase, className)} {...props} />;
}

export { usePopover, usePopoverContext };
