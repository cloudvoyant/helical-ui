// libs/helical-react/src/checkbox.tsx
// Closely based on: Shark UI checkbox (@ark-ui/react/checkbox)
import { createContext, useContext } from 'react';
import {
  CheckboxRoot as ArkCheckboxRoot,
  CheckboxControl as ArkCheckboxControl,
  CheckboxIndicator as ArkCheckboxIndicator,
  CheckboxLabel as ArkCheckboxLabel,
  CheckboxGroup as ArkCheckboxGroup,
  CheckboxHiddenInput as ArkCheckboxHiddenInput,
  useCheckboxContext,
  type CheckboxRootProps,
} from '@ark-ui/react/checkbox';
import type {
  CheckboxControlProps,
  CheckboxIndicatorProps,
  CheckboxLabelProps,
  CheckboxGroupProps,
} from '@ark-ui/react/checkbox';
import {
  checkboxVariants,
  checkboxIndicatorBase,
  checkboxLabelBase,
  checkboxGroupBase,
  cn,
} from '@cloudvoyant/helical-ui';
import type { CheckboxProps as CheckboxBaseProps } from '@cloudvoyant/helical-ui';

export type CheckboxProps = CheckboxRootProps & CheckboxBaseProps;

const CheckboxSizeContext = createContext<CheckboxBaseProps['size']>('md');

export function Checkbox({ className, size = 'md', children, ...props }: CheckboxProps) {
  return (
    <CheckboxSizeContext.Provider value={size}>
      <ArkCheckboxRoot className={cn('flex items-center gap-2', className)} {...props}>
        {children}
        <ArkCheckboxHiddenInput />
      </ArkCheckboxRoot>
    </CheckboxSizeContext.Provider>
  );
}

export function CheckboxControl({ className, ...props }: CheckboxControlProps) {
  const size = useContext(CheckboxSizeContext);
  return <ArkCheckboxControl className={cn(checkboxVariants({ size }), className)} {...props} />;
}

export function CheckboxIndicator({ className, ...props }: CheckboxIndicatorProps) {
  return <ArkCheckboxIndicator className={cn(checkboxIndicatorBase, className)} {...props} />;
}

export function CheckboxLabel({ className, ...props }: CheckboxLabelProps) {
  return <ArkCheckboxLabel className={cn(checkboxLabelBase, className)} {...props} />;
}

export function CheckboxGroup({ className, ...props }: CheckboxGroupProps) {
  return <ArkCheckboxGroup className={cn(checkboxGroupBase, className)} {...props} />;
}

export const useCheckbox = useCheckboxContext;

export type { CheckboxControlProps, CheckboxIndicatorProps, CheckboxLabelProps, CheckboxGroupProps };
