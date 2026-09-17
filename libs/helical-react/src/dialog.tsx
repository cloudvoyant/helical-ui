// libs/helical-react/src/dialog.tsx
// Closely based on: Ark UI dialog (@ark-ui/react/dialog)
import type { HTMLAttributes } from 'react';
import {
  DialogRoot as ArkDialogRoot,
  DialogRootProvider as ArkDialogRootProvider,
  DialogTrigger as ArkDialogTrigger,
  DialogBackdrop as ArkDialogBackdrop,
  DialogPositioner as ArkDialogPositioner,
  DialogContent as ArkDialogContent,
  DialogTitle as ArkDialogTitle,
  DialogDescription as ArkDialogDescription,
  DialogCloseTrigger as ArkDialogCloseTrigger,
  useDialog,
  useDialogContext,
  type DialogRootProps,
  type DialogRootProviderProps,
  type DialogTriggerProps,
  type DialogBackdropProps,
  type DialogContentProps,
  type DialogTitleProps,
  type DialogDescriptionProps,
  type DialogCloseTriggerProps,
} from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';
import {
  dialogBackdropBase,
  dialogPositionerBase,
  dialogContentBase,
  dialogTitleBase,
  dialogDescriptionBase,
  dialogHeaderBase,
  dialogFooterBase,
  dialogHeaderStickyBase,
  dialogFooterStickyBase,
  dialogFullscreenContentBase,
  dialogCloseTriggerBase,
  cn,
} from '@cloudvoyant/helical-ui';

export function Dialog(props: DialogRootProps) {
  return <ArkDialogRoot {...props} />;
}

export function DialogProvider(props: DialogRootProviderProps) {
  return <ArkDialogRootProvider {...props} />;
}

export function DialogTrigger({ className, ...props }: DialogTriggerProps) {
  return <ArkDialogTrigger className={cn(className)} {...props} />;
}

export function DialogBackdrop({ className, ...props }: DialogBackdropProps) {
  return (
    <Portal>
      <ArkDialogBackdrop className={cn(dialogBackdropBase, className)} {...props} />
    </Portal>
  );
}

export type DialogContentPropsWithPositioner = DialogContentProps & {
  positionerClassName?: string;
  fullscreen?: boolean;
};

export function DialogContent({
  positionerClassName,
  fullscreen,
  className,
  ...props
}: DialogContentPropsWithPositioner) {
  return (
    <Portal>
      <ArkDialogPositioner className={cn(dialogPositionerBase, fullscreen && 'p-0', positionerClassName)}>
        <ArkDialogContent
          className={cn(dialogContentBase, fullscreen && dialogFullscreenContentBase, className)}
          {...props}
        />
      </ArkDialogPositioner>
    </Portal>
  );
}

export function DialogTitle({ className, ...props }: DialogTitleProps) {
  return <ArkDialogTitle className={cn(dialogTitleBase, className)} {...props} />;
}

export function DialogDescription({ className, ...props }: DialogDescriptionProps) {
  return <ArkDialogDescription className={cn(dialogDescriptionBase, className)} {...props} />;
}

export type DialogHeaderProps = HTMLAttributes<HTMLDivElement> & { sticky?: boolean };

export function DialogHeader({ sticky, className, ...props }: DialogHeaderProps) {
  return <div className={cn(dialogHeaderBase, sticky && dialogHeaderStickyBase, className)} {...props} />;
}

export type DialogFooterProps = HTMLAttributes<HTMLDivElement> & { sticky?: boolean };

export function DialogFooter({ sticky, className, ...props }: DialogFooterProps) {
  return <div className={cn(dialogFooterBase, sticky && dialogFooterStickyBase, className)} {...props} />;
}

export function DialogDismiss({ className, ...props }: DialogCloseTriggerProps) {
  return <ArkDialogCloseTrigger aria-label="Close" className={cn(dialogCloseTriggerBase, className)} {...props} />;
}

export { useDialog, useDialogContext };
