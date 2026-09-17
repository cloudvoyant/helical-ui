// libs/helical-react/src/radio-group.tsx
// Closely based on: Shark UI radio group (@ark-ui/react/radio-group)
import {
  RadioGroupRoot,
  RadioGroupItem as ArkRadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemText,
  RadioGroupItemHiddenInput,
  useRadioGroupContext,
  useRadioGroupItemContext,
  type RadioGroupRootProps,
  type RadioGroupItemProps as ArkRadioGroupItemProps,
} from '@ark-ui/react/radio-group';
import { radioGroupRootBase, radioGroupItemControlBase, radioGroupItemTextBase, cn } from '@cloudvoyant/helical-ui';

export type RadioGroupProps = RadioGroupRootProps;

export function RadioGroup({ className, ...props }: RadioGroupProps) {
  return <RadioGroupRoot className={cn(radioGroupRootBase, className)} {...props} />;
}

export type RadioGroupItemProps = ArkRadioGroupItemProps;

export function RadioGroupItem({ className, children, ...props }: RadioGroupItemProps) {
  return (
    <ArkRadioGroupItem className={cn('flex cursor-pointer items-center gap-2.5', className)} {...props}>
      <RadioGroupItemControl className={radioGroupItemControlBase}>
        <span className="size-1.5 rounded-full bg-current hidden [[data-state=checked]>&]:block" />
      </RadioGroupItemControl>
      <RadioGroupItemText className={radioGroupItemTextBase}>{children}</RadioGroupItemText>
      <RadioGroupItemHiddenInput />
    </ArkRadioGroupItem>
  );
}

export const useRadioGroup = useRadioGroupContext;
export const useRadioGroupItem = useRadioGroupItemContext;
