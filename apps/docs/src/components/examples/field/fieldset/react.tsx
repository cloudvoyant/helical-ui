// apps/docs/src/components/examples/field/fieldset/react.tsx
import { FieldSet, FieldSetLegend, Field, FieldLabel, Input } from '@cloudvoyant/helical-react';

export default function ReactFieldFieldset() {
  return (
    <FieldSet className="max-w-sm">
      <FieldSetLegend>Billing address</FieldSetLegend>
      <Field>
        <FieldLabel>Street</FieldLabel>
        <Input placeholder="123 Main St" />
      </Field>
      <Field>
        <FieldLabel>City</FieldLabel>
        <Input placeholder="Springfield" />
      </Field>
    </FieldSet>
  );
}
