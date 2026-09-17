// libs/helical-ui/src/tabs.ts
// Closely based on: Shark UI tabs (https://shark.vini.one/docs/components/tabs, @ark-ui/react/tabs).
// Shared class strings / cva / types. No framework imports.
import { cva, type VariantProps } from 'class-variance-authority';

export const tabsRootBase = 'flex flex-col gap-2 data-[orientation=vertical]:flex-row';

export const tabsListBase =
  'relative z-0 flex w-fit items-center justify-center gap-x-0.5 text-muted-foreground data-[orientation=vertical]:flex-col';

export const tabsListVariants = cva('', {
  variants: {
    variant: {
      default: 'rounded-lg',
      underline: 'data-[orientation=vertical]:px-1 data-[orientation=horizontal]:py-1',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const tabsIndicatorBase =
  'absolute inset-x-0 bottom-0 h-(--height) w-(--width) transition-[width,translate] duration-200 ease-in-out motion-reduce:transition-none';

export const tabsIndicatorVariants = cva('', {
  variants: {
    variant: {
      default: '-z-1 rounded-lg bg-accent',
      underline: 'z-10 bg-primary data-[orientation=horizontal]:h-0.5 data-[orientation=vertical]:w-0.5',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const tabsTriggerBase =
  'relative flex h-9 shrink-0 grow items-center justify-center gap-1.5 rounded-lg border border-transparent px-[calc(--spacing(2.5)-1px)] text-sm font-medium whitespace-nowrap transition-[color,background-color,box-shadow] data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-start hover:text-foreground/72 aria-selected:text-foreground outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/30 data-disabled:pointer-events-none data-disabled:opacity-50 motion-reduce:transition-none sm:h-8 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0';

export const tabsContentBase = 'flex-1 outline-none';

export type TabsListVariants = VariantProps<typeof tabsListVariants>;
export type TabsIndicatorVariants = VariantProps<typeof tabsIndicatorVariants>;
