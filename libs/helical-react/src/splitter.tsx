// libs/helical-react/src/splitter.tsx
// Closely based on: @ark-ui/react/splitter (Ark UI), Chakra UI Splitter
import {
  SplitterRoot as ArkSplitterRoot,
  SplitterPanel as ArkSplitterPanel,
  SplitterResizeTrigger as ArkSplitterResizeTrigger,
  SplitterResizeTriggerIndicator as ArkSplitterResizeTriggerIndicator,
  type SplitterRootProps,
  type SplitterPanelProps,
  type SplitterResizeTriggerProps,
  type SplitterResizeTriggerIndicatorProps,
} from '@ark-ui/react/splitter';
import {
  splitterRootBase,
  splitterPanelBase,
  splitterResizeTriggerBase,
  splitterResizeTriggerSeparatorBase,
  splitterResizeTriggerIndicatorBase,
  cn,
} from '@cloudvoyant/helical-ui';

export function Splitter({ className, ...props }: SplitterRootProps) {
  return <ArkSplitterRoot className={cn(splitterRootBase, className)} {...props} />;
}

export function SplitterPanel({ className, ...props }: SplitterPanelProps) {
  return <ArkSplitterPanel className={cn(splitterPanelBase, className)} {...props} />;
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
  SplitterPanelProps,
  SplitterResizeTriggerProps,
  SplitterResizeTriggerIndicatorProps,
};
