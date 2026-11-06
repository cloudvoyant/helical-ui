// Source: https://shark.vini.one/docs/components/toast
// Closely based on: Shark UI toast (@ark-ui/react/toast)

// 1. Imports
import { forwardRef, type CSSProperties, type ReactNode } from 'react';
import { Portal } from '@ark-ui/react/portal';
import {
  Toast as ArkToast,
  Toaster as ArkToaster,
  ToastActionTrigger as ArkToastActionTrigger,
  ToastCloseTrigger as ArkToastCloseTrigger,
  ToastContext as ArkToastContext,
  ToastDescription as ArkToastDescription,
  ToastRoot as ArkToastRoot,
  ToastTitle as ArkToastTitle,
  createToaster,
  useToastContext,
  type CreateToasterProps,
  type CreateToasterReturn,
  type ToastActionTriggerProps,
  type ToastCloseTriggerProps,
  type ToastContextProps,
  type ToastDescriptionProps,
  type ToasterProps as ArkToasterProps,
  type ToastOptions,
  type ToastRootProps,
  type ToastTitleProps,
} from '@ark-ui/react/toast';
import {
  CircleAlert,
  CircleCheck,
  Info,
  Loader2,
  TriangleAlert,
  X,
} from 'lucide-react';
import {
  cn,
  toastActionTriggerBase,
  toastCloseTriggerBase,
  toastDescriptionBase,
  toasterBase,
  toastIconBase,
  toastTitleBase,
  toastVariants,
} from '@cloudvoyant/helical-ui';
import { Col } from './col';
import { Row } from './row';

// 2. Module constants & types
export const useToast = useToastContext;
export { createToaster, useToastContext };
export type {
  CreateToasterProps,
  CreateToasterReturn,
  ToastActionTriggerProps,
  ToastCloseTriggerProps,
  ToastContextProps,
  ToastDescriptionProps,
  ToastOptions,
  ToastRootProps,
  ToastTitleProps,
};

export const toast = createToaster({
  placement: 'bottom-end',
  overlap: true,
  max: 5,
});

export interface ToasterProps
  extends Omit<ArkToasterProps, 'toaster' | 'children'> {
  toaster?: CreateToasterReturn;
  children?: (toast: ToastOptions) => ReactNode;
}

export interface ToastItemProps extends ToastRootProps {
  toast: ToastOptions;
}

// 3. Local helpers
function renderToastIcon(type?: string) {
  switch (type) {
    case 'success':
      return <CircleCheck aria-hidden="true" />;
    case 'error':
      return <CircleAlert aria-hidden="true" />;
    case 'warning':
      return <TriangleAlert aria-hidden="true" />;
    case 'info':
      return <Info aria-hidden="true" />;
    case 'loading':
      return <Loader2 className="animate-spin" aria-hidden="true" />;
    default:
      return null;
  }
}

// 4. Exported components
export const ToastRoot = forwardRef<HTMLDivElement, ToastRootProps>(
  ({ className, ...props }, ref) => (
    <ArkToastRoot
      ref={ref}
      data-slot="toast"
      className={cn(toastVariants(), className)}
      {...props}
    />
  ),
);
ToastRoot.displayName = 'ToastRoot';

export const ToastTitle = forwardRef<HTMLDivElement, ToastTitleProps>(
  ({ className, ...props }, ref) => (
    <ArkToastTitle
      ref={ref}
      data-slot="toast-title"
      className={cn(toastTitleBase, className)}
      {...props}
    />
  ),
);
ToastTitle.displayName = 'ToastTitle';

export const ToastDescription = forwardRef<
  HTMLDivElement,
  ToastDescriptionProps
>(({ className, ...props }, ref) => (
  <ArkToastDescription
    ref={ref}
    data-slot="toast-description"
    className={cn(toastDescriptionBase, className)}
    {...props}
  />
));
ToastDescription.displayName = 'ToastDescription';

export const ToastActionTrigger = forwardRef<
  HTMLButtonElement,
  ToastActionTriggerProps
>(({ className, ...props }, ref) => (
  <ArkToastActionTrigger
    ref={ref}
    data-slot="toast-action-trigger"
    className={cn(toastActionTriggerBase, className)}
    {...props}
  />
));
ToastActionTrigger.displayName = 'ToastActionTrigger';

export const ToastCloseTrigger = forwardRef<
  HTMLButtonElement,
  ToastCloseTriggerProps
>(({ className, children, ...props }, ref) => (
  <ArkToastCloseTrigger
    ref={ref}
    aria-label="Close"
    data-slot="toast-close-trigger"
    className={cn(toastCloseTriggerBase, className)}
    {...props}
  >
    {children ?? <X aria-hidden="true" />}
  </ArkToastCloseTrigger>
));
ToastCloseTrigger.displayName = 'ToastCloseTrigger';

export const ToastDismiss = ToastCloseTrigger;

export function ToastContext(props: ToastContextProps) {
  return <ArkToastContext {...props} />;
}

export const ToastItem = forwardRef<HTMLDivElement, ToastItemProps>(
  ({ toast: toastData, className, ...rest }, ref) => {
    const icon = renderToastIcon(toastData.type);
    const isClosable = toastData.closable !== false;

    return (
      <ToastRoot
        ref={ref}
        data-testid="toast-item"
        className={className}
        {...rest}
      >
        <Row className="min-w-0 flex-1 items-start gap-2.5">
          {icon && (
            <div data-slot="toast-icon" className={toastIconBase}>
              {icon}
            </div>
          )}
          <Col className="min-w-0 flex-1 gap-0.5">
            {toastData.title && (
              <ToastTitle data-testid="toast-title">
                {toastData.title}
              </ToastTitle>
            )}
            {toastData.description && (
              <ToastDescription data-testid="toast-description">
                {toastData.description}
              </ToastDescription>
            )}
          </Col>
        </Row>

        <Row className="shrink-0 items-center gap-1.5">
          {toastData.action && (
            <ToastActionTrigger
              data-testid="toast-action"
              onClick={toastData.action.onClick}
            >
              {toastData.action.label}
            </ToastActionTrigger>
          )}
          {isClosable && <ToastCloseTrigger data-testid="toast-close" />}
        </Row>
      </ToastRoot>
    );
  },
);
ToastItem.displayName = 'ToastItem';

export const Toaster = forwardRef<HTMLDivElement, ToasterProps>(
  ({ toaster: toasterInstance = toast, children, className, style, ...rest }, ref) => (
    <Portal>
      <ArkToaster
        ref={ref}
        data-testid="toaster"
        toaster={toasterInstance}
        className={cn(toasterBase, className)}
        style={{ '--width': '356px', ...style } as CSSProperties}
        {...rest}
      >
        {(toastItem) =>
          children ? children(toastItem) : <ToastItem toast={toastItem} />
        }
      </ArkToaster>
    </Portal>
  ),
);
Toaster.displayName = 'Toaster';

export { ArkToast as Toast };
