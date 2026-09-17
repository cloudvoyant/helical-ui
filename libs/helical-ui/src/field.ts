// libs/helical-ui/src/field.ts
// Closely based on: Shark UI field (https://shark.vini.one/docs/components/field, @ark-ui/react/field, @ark-ui/react/fieldset).
// Shared class strings for Field/FieldSet parts. No framework imports.

export const fieldRootBase = 'flex w-full flex-col gap-2 data-invalid:text-destructive';

export const fieldLabelBase =
  'flex w-fit select-none items-center gap-1 text-sm font-medium leading-none text-foreground';

export const fieldHelperBase = 'text-sm text-muted-foreground';

export const fieldErrorBase = 'text-sm text-destructive';

export const fieldRequiredIndicatorBase = 'text-destructive';

export const fieldsetRootBase = 'flex flex-col gap-6';

export const fieldsetLegendBase = 'mb-3 text-base font-medium';

export const fieldsetHelperBase = 'text-sm text-muted-foreground';

export const fieldsetErrorBase = 'text-sm text-destructive';
