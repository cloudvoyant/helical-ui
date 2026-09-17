// apps/docs/src/components/examples/input/default/react.tsx
import { Field, FieldLabel, FieldHelper, Input } from '@cloudvoyant/helical-react';

export default function ReactInputDefault() {
  return (
    <Field className="max-w-sm">
      <FieldLabel>Email</FieldLabel>
      <Input type="email" placeholder="you@example.com" />
      <FieldHelper>We'll never share your email.</FieldHelper>
    </Field>
  );
}
