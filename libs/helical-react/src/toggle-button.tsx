// libs/helical-react/src/toggle-button.tsx
// Closely based on: @ark-ui/react/toggle (Ark UI)
import { ToggleRoot, ToggleIndicator, type ToggleRootProps, type ToggleIndicatorProps } from '@ark-ui/react/toggle';
import { toggleButtonVariants, cn } from '@cloudvoyant/helical-ui';
import type { ToggleButtonProps as ToggleButtonPropsBase } from '@cloudvoyant/helical-ui';

export type ToggleButtonProps = ToggleRootProps & ToggleButtonPropsBase;

export function ToggleButton({ className, variant, size, ...props }: ToggleButtonProps) {
  return <ToggleRoot className={cn(toggleButtonVariants({ variant, size }), className)} {...props} />;
}

export function ToggleButtonIndicator(props: ToggleIndicatorProps) {
  return <ToggleIndicator {...props} />;
}
