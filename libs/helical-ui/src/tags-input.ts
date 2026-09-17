// libs/helical-ui/src/tags-input.ts
// Closely based on: Shark UI tags input (https://shark.vini.one/docs/components/tags-input, @ark-ui/react/tags-input).
export const tagsInputRootBase = 'flex w-full flex-col gap-2';

export const tagsInputControlBase =
  'flex w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent p-1.5 shadow-xs transition-[box-shadow] outline-none focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/30 data-invalid:border-destructive data-invalid:ring-[3px] data-invalid:ring-destructive/24 data-disabled:pointer-events-none data-disabled:opacity-50';

export const tagsInputInputBase =
  'min-w-12 flex-1 border-0 bg-transparent px-1 text-sm outline-none ring-0 placeholder:text-muted-foreground focus-visible:ring-0';

export const tagsInputItemBase =
  'inline-flex h-6 max-w-full shrink-0 items-center gap-1 rounded-md border bg-secondary px-1.5 text-xs text-secondary-foreground outline-none data-[highlighted]:border-primary/30 data-[highlighted]:bg-primary/10';

export const tagsInputItemTextBase = 'truncate';

export const tagsInputItemInputBase = 'w-16 border-0 bg-transparent text-xs outline-none';

export const tagsInputItemDeleteTriggerBase =
  'flex size-4 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none [&_svg]:pointer-events-none [&_svg]:size-3 [&_svg]:shrink-0';

export const tagsInputClearTriggerBase =
  'ms-auto flex shrink-0 items-center justify-center self-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0';

export interface TagsInputProps {
  className?: string;
}
