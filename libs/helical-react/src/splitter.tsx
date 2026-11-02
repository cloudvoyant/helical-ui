// libs/helical-react/src/splitter.tsx
// Closely based on: @ark-ui/react/splitter (Ark UI), Chakra UI Splitter
import {
  SplitterRoot as ArkSplitterRoot,
  SplitterPanel as ArkSplitterPanel,
  SplitterResizeTrigger as ArkSplitterResizeTrigger,
  SplitterResizeTriggerIndicator as ArkSplitterResizeTriggerIndicator,
  type SplitterRootProps,
  type SplitterPanelProps as ArkSplitterPanelProps,
  type SplitterResizeTriggerProps,
  type SplitterResizeTriggerIndicatorProps,
} from '@ark-ui/react/splitter';
import {
  splitterRootBase,
  splitterPanelBase,
  splitterResizeTriggerBase,
  splitterResizeTriggerSeparatorBase,
  splitterResizeTriggerIndicatorBase,
  type SplitterPanelPaneRegistrationProps,
  cn,
} from '@cloudvoyant/helical-ui';
import { useOptionalPaneRegistration } from './which-key/context';

export type SplitterPanelProps = ArkSplitterPanelProps & SplitterPanelPaneRegistrationProps;

export function Splitter({ className, ...props }: SplitterRootProps) {
  return <ArkSplitterRoot className={cn(splitterRootBase, className)} {...props} />;
}

export function SplitterPanel({
  paneId,
  paneTitle,
  paneDisabled,
  className,
  ...props
}: SplitterPanelProps) {
  const pane = useOptionalPaneRegistration({
    paneId: paneId ?? (typeof props.id === 'string' ? `splitter-${props.id}` : undefined),
    paneTitle: paneTitle ?? (typeof props.id === 'string' ? `Panel ${props.id}` : 'Splitter Panel'),
    paneDisabled,
    defaultTitle: 'Splitter Panel',
  });

  return (
    <ArkSplitterPanel
      ref={pane.ref}
      {...pane.dataAttributes}
      className={cn(splitterPanelBase, className)}
      {...props}
    />
  );
}

export function SplitterResizeTrigger({ className, children, ...props }: SplitterResizeTriggerProps) {
  return (
    <ArkSplitterResizeTrigger className={cn(splitterResizeTriggerBase, className)} {...props}>
      <span aria-hidden data-part="separator" className={splitterResizeTriggerSeparatorBase} />
      {children}
    </ArkSplitterResizeTrigger>
  );
}

export function SplitterResizeTriggerIndicator({ className, ...props }: SplitterResizeTriggerIndicatorProps) {
  return <ArkSplitterResizeTriggerIndicator className={cn(splitterResizeTriggerIndicatorBase, className)} {...props} />;
}

export type {
  SplitterRootProps as SplitterProps,
  SplitterResizeTriggerProps,
  SplitterResizeTriggerIndicatorProps,
};
