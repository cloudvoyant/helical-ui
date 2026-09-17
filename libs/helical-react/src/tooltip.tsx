// libs/helical-react/src/tooltip.tsx
// Closely based on: Ark UI tooltip (@ark-ui/react/tooltip)
import {
  TooltipRoot as ArkTooltipRoot,
  TooltipRootProvider as ArkTooltipRootProvider,
  TooltipTrigger as ArkTooltipTrigger,
  TooltipPositioner as ArkTooltipPositioner,
  TooltipArrow as ArkTooltipArrow,
  TooltipArrowTip as ArkTooltipArrowTip,
  TooltipContent as ArkTooltipContent,
  useTooltip,
  useTooltipContext,
  type TooltipRootProps,
  type TooltipRootProviderProps,
  type TooltipTriggerProps,
  type TooltipContentProps,
} from '@ark-ui/react/tooltip';
import { Portal } from '@ark-ui/react/portal';
import { tooltipPositionerBase, tooltipArrowBase, tooltipContentBase, cn } from '@cloudvoyant/helical-ui';

export function Tooltip(props: TooltipRootProps) {
  return <ArkTooltipRoot {...props} />;
}

export function TooltipProvider(props: TooltipRootProviderProps) {
  return <ArkTooltipRootProvider {...props} />;
}

export function TooltipTrigger({ className, ...props }: TooltipTriggerProps) {
  return <ArkTooltipTrigger className={cn(className)} {...props} />;
}

export type TooltipContentPropsWithArrow = TooltipContentProps & { arrow?: boolean };

export function TooltipContent({ arrow = true, className, ...props }: TooltipContentPropsWithArrow) {
  const tooltip = useTooltipContext();
  return (
    <Portal>
      <ArkTooltipPositioner className={tooltipPositionerBase}>
        {arrow && tooltip.open ? (
          <ArkTooltipArrow className={tooltipArrowBase}>
            <ArkTooltipArrowTip />
          </ArkTooltipArrow>
        ) : null}
        <ArkTooltipContent className={cn(tooltipContentBase, className)} {...props} />
      </ArkTooltipPositioner>
    </Portal>
  );
}

export { useTooltip, useTooltipContext };
