// libs/helical-ui/src/reveal.ts
// Closely based on: diffbook QA (packages/diffbook-ui/src/components/QA.tsx), renamed Reveal,
// rebuilt on Ark UI Collapsible.

export const revealRootBase = 'not-prose my-4 overflow-hidden rounded-lg border border-border bg-muted/40';

export const revealTriggerBase = 'flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 text-sm font-semibold';

export const revealChevronBase =
  'size-4 shrink-0 text-muted-foreground transition-transform duration-200 data-[state=open]:rotate-90';

export const revealContentBase = 'border-t border-border px-3 py-2.5 text-sm text-foreground';

export interface RevealProps {
  question: string;
  className?: string;
}
