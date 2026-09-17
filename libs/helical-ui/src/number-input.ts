// libs/helical-ui/src/number-input.ts
// Closely based on: Shark UI number input (https://shark.vini.one/docs/components/number-input, @ark-ui/react/number-input).
export const numberInputRootBase = 'flex w-full flex-col items-start gap-2';

export const numberInputControlBase =
  'flex w-full items-center justify-between rounded-md border border-input bg-transparent shadow-xs transition-[box-shadow] outline-none focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/30 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/24 data-invalid:border-destructive data-invalid:ring-[3px] data-invalid:ring-destructive/24';

export const numberInputInputBase =
  'h-9 w-full min-w-0 flex-1 border-0 bg-transparent px-3 text-center text-sm tabular-nums shadow-none outline-none ring-0 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50';

export const numberInputTriggerBase =
  'flex size-9 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0';

export interface NumberInputProps {
  className?: string;
}
