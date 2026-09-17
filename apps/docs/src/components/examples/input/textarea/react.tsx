// apps/docs/src/components/examples/input/textarea/react.tsx
import { Field, FieldLabel, Textarea } from '@cloudvoyant/helical-react';

export default function ReactInputTextarea() {
  return (
    <Field className="max-w-sm">
      <FieldLabel>Message</FieldLabel>
      <Textarea placeholder="Type your message…" rows={4} />
    </Field>
  );
}
