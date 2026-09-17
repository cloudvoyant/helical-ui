// apps/docs/src/components/examples/field/default/react.tsx
import { Field, FieldLabel, FieldRequiredIndicator, FieldHelper, FieldError, Input } from '@cloudvoyant/helical-react';

export default function ReactFieldDefault() {
  return (
    <Field invalid className="max-w-sm">
      <FieldLabel>
        Username
        <FieldRequiredIndicator />
      </FieldLabel>
      <Input defaultValue="jane" />
      <FieldHelper>Pick something memorable.</FieldHelper>
      <FieldError>Username is already taken.</FieldError>
    </Field>
  );
}
