// libs/vortex-react/src/toggle-group.tsx
// Closely based on: Shark UI toggle-group (https://shark.vini.one/docs/components/toggle-group,
// @ark-ui/react/toggle-group)
import {
  ToggleGroupRoot,
  ToggleGroupItem as ArkToggleGroupItem,
  type ToggleGroupRootProps,
  type ToggleGroupItemProps as ArkToggleGroupItemProps,
} from '@ark-ui/react/toggle-group';
import {
  toggleGroupRootVariants,
  toggleButtonVariants,
  cn,
  type ToggleGroupRootVariants,
  type ToggleButtonProps,
} from '@cloudvoyant/vortex-ui';

export type ToggleGroupProps = ToggleGroupRootProps & ToggleGroupRootVariants;

export function ToggleGroup({ orientation, attached, className, ...props }: ToggleGroupProps) {
  return (
    <ToggleGroupRoot
      orientation={orientation ?? 'horizontal'}
      className={cn(toggleGroupRootVariants({ orientation, attached }), className)}
      {...props}
    />
  );
}

export type ToggleGroupItemProps = ArkToggleGroupItemProps & Pick<ToggleButtonProps, 'variant' | 'size'>;

export function ToggleGroupItem({ variant, size, className, ...props }: ToggleGroupItemProps) {
  return <ArkToggleGroupItem className={cn(toggleButtonVariants({ variant, size }), className)} {...props} />;
}
