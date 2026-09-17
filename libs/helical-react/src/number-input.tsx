// libs/helical-react/src/number-input.tsx
// Closely based on: Shark UI number input (@ark-ui/react/number-input)
import {
  NumberInputRoot as ArkNumberInputRoot,
  NumberInputControl as ArkNumberInputControl,
  NumberInputInput as ArkNumberInputInput,
  NumberInputIncrementTrigger as ArkNumberInputIncrementTrigger,
  NumberInputDecrementTrigger as ArkNumberInputDecrementTrigger,
  useNumberInputContext,
  type NumberInputRootProps,
} from '@ark-ui/react/number-input';
import type {
  NumberInputControlProps,
  NumberInputInputProps,
  NumberInputIncrementTriggerProps,
  NumberInputDecrementTriggerProps,
} from '@ark-ui/react/number-input';
import {
  numberInputRootBase,
  numberInputControlBase,
  numberInputInputBase,
  numberInputTriggerBase,
  cn,
} from '@cloudvoyant/helical-ui';

export type NumberInputProps = NumberInputRootProps;

export function NumberInput({ className, ...props }: NumberInputProps) {
  return <ArkNumberInputRoot className={cn(numberInputRootBase, className)} {...props} />;
}

export function NumberInputControl({ className, ...props }: NumberInputControlProps) {
  return <ArkNumberInputControl className={cn(numberInputControlBase, className)} {...props} />;
}

export function NumberInputInput({ className, ...props }: NumberInputInputProps) {
  return <ArkNumberInputInput className={cn(numberInputInputBase, className)} {...props} />;
}

export function NumberInputDecrement({ className, ...props }: NumberInputDecrementTriggerProps) {
  return (
    <ArkNumberInputDecrementTrigger
      aria-label="Decrement"
      className={cn(numberInputTriggerBase, className)}
      {...props}
    />
  );
}

export function NumberInputIncrement({ className, ...props }: NumberInputIncrementTriggerProps) {
  return (
    <ArkNumberInputIncrementTrigger
      aria-label="Increment"
      className={cn(numberInputTriggerBase, className)}
      {...props}
    />
  );
}

export const useNumberInput = useNumberInputContext;

export type {
  NumberInputControlProps,
  NumberInputInputProps,
  NumberInputIncrementTriggerProps,
  NumberInputDecrementTriggerProps,
};
