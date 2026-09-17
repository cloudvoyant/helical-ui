// libs/helical-react/src/input.tsx
// Closely based on: Shark UI input (@ark-ui/react/field)
import { FieldInput, type FieldInputProps } from '@ark-ui/react/field';
import { inputVariants, cn } from '@cloudvoyant/helical-ui';
import type { InputProps as InputBaseProps } from '@cloudvoyant/helical-ui';

export type InputProps = Omit<FieldInputProps, 'size'> & InputBaseProps;

export function Input({ className, size, ...props }: InputProps) {
  return <FieldInput className={cn(inputVariants({ size }), className)} {...props} />;
}
