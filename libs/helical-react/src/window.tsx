// libs/helical-react/src/window.tsx
// Closely based on: Ark UI floating-panel (@ark-ui/react/floating-panel), exposed as "Window"
import {
  FloatingPanelRoot as ArkWindowRoot,
  FloatingPanelRootProvider as ArkWindowRootProvider,
  FloatingPanelPositioner as ArkWindowPositioner,
  FloatingPanelContent as ArkWindowContent,
  FloatingPanelHeader as ArkWindowHeader,
  FloatingPanelTitle as ArkWindowTitle,
  FloatingPanelControl as ArkWindowControl,
  FloatingPanelStageTrigger as ArkWindowStageTrigger,
  FloatingPanelCloseTrigger as ArkWindowCloseTrigger,
  FloatingPanelDragTrigger as ArkWindowDragTrigger,
  FloatingPanelBody as ArkWindowBody,
  FloatingPanelResizeTrigger as ArkWindowResizeTrigger,
  useFloatingPanel as useWindow,
  useFloatingPanelContext as useWindowContext,
  type FloatingPanelRootProps as WindowRootProps,
  type FloatingPanelRootProviderProps as WindowRootProviderProps,
  type FloatingPanelHeaderProps as WindowHeaderProps,
  type FloatingPanelTitleProps as WindowTitleProps,
  type FloatingPanelControlProps as WindowControlProps,
  type FloatingPanelStageTriggerProps as WindowStageTriggerProps,
  type FloatingPanelCloseTriggerProps as WindowCloseTriggerProps,
  type FloatingPanelDragTriggerProps as WindowDragTriggerProps,
  type FloatingPanelBodyProps as WindowBodyProps,
  type FloatingPanelResizeTriggerProps as ArkWindowResizeTriggerProps,
} from '@ark-ui/react/floating-panel';
import { Portal } from '@ark-ui/react/portal';
import {
  windowPositionerBase,
  windowContentBase,
  windowDragTriggerBase,
  windowHeaderBase,
  windowTitleBase,
  windowControlBase,
  windowStageTriggerBase,
  windowCloseTriggerBase,
  windowBodyBase,
  windowResizeTriggerBase,
  cn,
} from '@cloudvoyant/helical-ui';

export type WindowProps = WindowRootProps & {
  className?: string;
  positionerClassName?: string;
};

export function Window({ className, positionerClassName, children, ...props }: WindowProps) {
  return (
    <ArkWindowRoot {...props}>
      <Portal>
        <ArkWindowPositioner className={cn(windowPositionerBase, positionerClassName)}>
          <ArkWindowContent className={cn(windowContentBase, className)}>{children}</ArkWindowContent>
        </ArkWindowPositioner>
      </Portal>
    </ArkWindowRoot>
  );
}

export function WindowProvider(props: WindowRootProviderProps) {
  return <ArkWindowRootProvider {...props} />;
}

export function WindowDragTrigger({ className, ...props }: WindowDragTriggerProps) {
  return <ArkWindowDragTrigger className={cn(windowDragTriggerBase, className)} {...props} />;
}

export function WindowHeader({ className, ...props }: WindowHeaderProps) {
  return <ArkWindowHeader className={cn(windowHeaderBase, className)} {...props} />;
}

export function WindowTitle({ className, ...props }: WindowTitleProps) {
  return <ArkWindowTitle className={cn(windowTitleBase, className)} {...props} />;
}

export function WindowControl({ className, ...props }: WindowControlProps) {
  return <ArkWindowControl className={cn(windowControlBase, className)} {...props} />;
}

export function WindowStageTrigger({ className, ...props }: WindowStageTriggerProps) {
  return <ArkWindowStageTrigger className={cn(windowStageTriggerBase, className)} {...props} />;
}

export function WindowDismiss({ className, ...props }: WindowCloseTriggerProps) {
  return <ArkWindowCloseTrigger aria-label="Close" className={cn(windowCloseTriggerBase, className)} {...props} />;
}

export function WindowBody({ className, ...props }: WindowBodyProps) {
  return <ArkWindowBody className={cn(windowBodyBase, className)} {...props} />;
}

export type WindowResizeTriggerProps = Omit<ArkWindowResizeTriggerProps, 'axis'> & {
  axis?: ArkWindowResizeTriggerProps['axis'];
};

export function WindowResizeTrigger({ axis = 'se', className, ...props }: WindowResizeTriggerProps) {
  return <ArkWindowResizeTrigger axis={axis} className={cn(windowResizeTriggerBase, className)} {...props} />;
}

export { useWindow, useWindowContext };
