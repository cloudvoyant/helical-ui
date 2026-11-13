// libs/helical-react/src/dialog.tsx
// Closely based on: Ark UI dialog (@ark-ui/react/dialog)

// 1. Imports
import { useEffect, useRef, useState, type HTMLAttributes } from 'react';
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
  captureDialogFocusTarget,
  cn,
  dialogStyles,
  restoreDialogFocusTarget,
} from '@cloudvoyant/helical-ui';

// 2. Module constants & types
export type DialogContentPropsWithPositioner = DialogContentProps & {
  positionerClassName?: string;
  fullscreen?: boolean;
};

export type DialogHeaderProps = HTMLAttributes<HTMLDivElement> & { sticky?: boolean };

export type DialogFooterProps = HTMLAttributes<HTMLDivElement> & { sticky?: boolean };

// 4. Exported components
/**
 * Modal dialog root that tracks and restores focus when opened via trigger, hotkey, or controlled state.
 */
export function Dialog({
  open: controlledOpen,
  defaultOpen = false,
  restoreFocus = true,
  finalFocusEl,
  onOpenChange,
  ...props
}: DialogRootProps) {
  // --- State ---
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);
  const isOpen = controlledOpen ?? uncontrolledOpen;

  if (isOpen && !wasOpenRef.current) {
    const captured = captureDialogFocusTarget();
    if (captured) {
      previousFocusRef.current = captured;
    }
  }

  // --- Effects ---
  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      if (!previousFocusRef.current) {
        previousFocusRef.current = captureDialogFocusTarget();
      }
      wasOpenRef.current = true;
    } else if (!isOpen && wasOpenRef.current) {
      wasOpenRef.current = false;
      const target = (finalFocusEl?.() as HTMLElement | null | undefined) ?? previousFocusRef.current;
      previousFocusRef.current = null;
      if (restoreFocus) {
        restoreDialogFocusTarget(target);
      }
    }
  }, [isOpen, restoreFocus, finalFocusEl]);

  // --- Methods ---
  const handleOpenChange: DialogRootProps['onOpenChange'] = (details) => {
    if (details.open && !isOpen) {
      const captured = captureDialogFocusTarget();
      if (captured) {
        previousFocusRef.current = captured;
      }
    }
    if (controlledOpen === undefined) {
      setUncontrolledOpen(details.open);
    }
    if (!details.open && wasOpenRef.current) {
      wasOpenRef.current = false;
      const target = (finalFocusEl?.() as HTMLElement | null | undefined) ?? previousFocusRef.current;
      previousFocusRef.current = null;
      if (restoreFocus) {
        restoreDialogFocusTarget(target);
      }
    }
    onOpenChange?.(details);
  };

  // --- Render ---
  return (
    <ArkDialogRoot
      open={isOpen}
      restoreFocus={false}
      finalFocusEl={finalFocusEl}
      onOpenChange={handleOpenChange}
      {...props}
    />
  );
}

/**
 * Provides an externally created `useDialog` machine instance to child dialog parts.
 */
export function DialogProvider(props: DialogRootProviderProps) {
  return <ArkDialogRootProvider {...props} />;
}

/**
 * Button or element that opens the dialog when activated.
 */
export function DialogTrigger({ className, ...props }: DialogTriggerProps) {
  return <ArkDialogTrigger className={cn(className)} {...props} />;
}

/**
 * Portaled backdrop overlay rendered behind an open dialog.
 */
export function DialogBackdrop({ className, ...props }: DialogBackdropProps) {
  return (
    <Portal>
      <ArkDialogBackdrop className={cn(dialogStyles.backdrop, className)} {...props} />
    </Portal>
  );
}

/**
 * Portaled dialog positioner and content container.
 */
export function DialogContent({
  positionerClassName,
  fullscreen,
  className,
  ...props
}: DialogContentPropsWithPositioner) {
  return (
    <Portal>
      <ArkDialogPositioner
        className={cn(dialogStyles.positioner, fullscreen && 'p-0', positionerClassName)}
      >
        <ArkDialogContent
          className={cn(
            dialogStyles.content,
            fullscreen && dialogStyles.fullscreenContent,
            className,
          )}
          {...props}
        />
      </ArkDialogPositioner>
    </Portal>
  );
}

/**
 * Accessible heading title for a dialog.
 */
export function DialogTitle({ className, ...props }: DialogTitleProps) {
  return <ArkDialogTitle className={cn(dialogStyles.title, className)} {...props} />;
}

/**
 * Accessible description paragraph for a dialog.
 */
export function DialogDescription({ className, ...props }: DialogDescriptionProps) {
  return <ArkDialogDescription className={cn(dialogStyles.description, className)} {...props} />;
}

/**
 * Header layout container for a dialog's title and description.
 */
export function DialogHeader({ sticky, className, ...props }: DialogHeaderProps) {
  return (
    <div
      className={cn(dialogStyles.header, sticky && dialogStyles.headerSticky, className)}
      {...props}
    />
  );
}

/**
 * Footer layout container for dialog action buttons.
 */
export function DialogFooter({ sticky, className, ...props }: DialogFooterProps) {
  return (
    <div
      className={cn(dialogStyles.footer, sticky && dialogStyles.footerSticky, className)}
      {...props}
    />
  );
}

/**
 * Close trigger button positioned in the top-right corner of the dialog.
 */
export function DialogDismiss({ className, ...props }: DialogCloseTriggerProps) {
  return (
    <ArkDialogCloseTrigger
      aria-label="Close"
      className={cn(dialogStyles.closeTrigger, className)}
      {...props}
    />
  );
}

export { useDialog, useDialogContext };
