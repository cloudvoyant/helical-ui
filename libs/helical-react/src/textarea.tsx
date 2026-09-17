// libs/helical-react/src/textarea.tsx
// Closely based on: Shark UI textarea (@ark-ui/react/field)
import { FieldTextarea, type FieldTextareaProps } from '@ark-ui/react/field';
import { textareaBase, cn } from '@cloudvoyant/helical-ui';

export type TextareaProps = FieldTextareaProps;

export function Textarea({ className, ...props }: TextareaProps) {
  return <FieldTextarea className={cn(textareaBase, className)} {...props} />;
}
