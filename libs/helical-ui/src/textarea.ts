// libs/helical-ui/src/textarea.ts
// Closely based on: Shark UI textarea (https://shark.vini.one/docs/components/textarea, @ark-ui/react/field).
export const textareaBase =
  'field-sizing-content flex min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/24 data-invalid:border-destructive data-invalid:ring-[3px] data-invalid:ring-destructive/24';

export interface TextareaProps {
  className?: string;
}
