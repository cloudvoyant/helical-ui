// libs/helical-react/src/field.tsx
// Closely based on: Shark UI field (@ark-ui/react/field, @ark-ui/react/fieldset)
import {
  FieldRoot as ArkFieldRoot,
  FieldLabel as ArkFieldLabel,
  FieldHelperText as ArkFieldHelperText,
  FieldErrorText as ArkFieldErrorText,
  FieldRequiredIndicator as ArkFieldRequiredIndicator,
  useFieldContext,
  type FieldRootProps,
} from '@ark-ui/react/field';
import type {
  FieldLabelProps,
  FieldHelperTextProps,
  FieldErrorTextProps,
  FieldRequiredIndicatorProps,
} from '@ark-ui/react/field';
import {
  FieldsetRoot as ArkFieldsetRoot,
  FieldsetLegend as ArkFieldsetLegend,
  FieldsetHelperText as ArkFieldsetHelperText,
  FieldsetErrorText as ArkFieldsetErrorText,
  type FieldsetRootProps,
} from '@ark-ui/react/fieldset';
import type { FieldsetLegendProps, FieldsetHelperTextProps, FieldsetErrorTextProps } from '@ark-ui/react/fieldset';
import {
  fieldRootBase,
  fieldLabelBase,
  fieldHelperBase,
  fieldErrorBase,
  fieldRequiredIndicatorBase,
  fieldsetRootBase,
  fieldsetLegendBase,
  fieldsetHelperBase,
  fieldsetErrorBase,
  cn,
} from '@cloudvoyant/helical-ui';

export type FieldProps = FieldRootProps;

export function Field({ className, ...props }: FieldProps) {
  return <ArkFieldRoot className={cn(fieldRootBase, className)} {...props} />;
}

export function FieldLabel({ className, ...props }: FieldLabelProps) {
  return <ArkFieldLabel className={cn(fieldLabelBase, className)} {...props} />;
}

export function FieldHelper({ className, ...props }: FieldHelperTextProps) {
  return <ArkFieldHelperText className={cn(fieldHelperBase, className)} {...props} />;
}

export function FieldError({ className, ...props }: FieldErrorTextProps) {
  return <ArkFieldErrorText className={cn(fieldErrorBase, className)} {...props} />;
}

export function FieldRequiredIndicator({ className, ...props }: FieldRequiredIndicatorProps) {
  return <ArkFieldRequiredIndicator className={cn(fieldRequiredIndicatorBase, className)} {...props} />;
}

export type FieldSetProps = FieldsetRootProps;

export function FieldSet({ className, ...props }: FieldSetProps) {
  return <ArkFieldsetRoot className={cn(fieldsetRootBase, className)} {...props} />;
}

export function FieldSetLegend({ className, ...props }: FieldsetLegendProps) {
  return <ArkFieldsetLegend className={cn(fieldsetLegendBase, className)} {...props} />;
}

export function FieldSetHelper({ className, ...props }: FieldsetHelperTextProps) {
  return <ArkFieldsetHelperText className={cn(fieldsetHelperBase, className)} {...props} />;
}

export function FieldSetError({ className, ...props }: FieldsetErrorTextProps) {
  return <ArkFieldsetErrorText className={cn(fieldsetErrorBase, className)} {...props} />;
}

export const useField = useFieldContext;

export type { FieldLabelProps, FieldHelperTextProps, FieldErrorTextProps, FieldRequiredIndicatorProps };
export type { FieldsetLegendProps, FieldsetHelperTextProps, FieldsetErrorTextProps };
