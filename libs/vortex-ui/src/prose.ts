// libs/vortex-ui/src/prose.ts
// Closely based on: Shark UI prose (https://shark.vini.one/docs/components/prose).
// Scoped long-form typography: applies to a subtree via a `prose` class, driven by
// theme vars, so no global prose stylesheet import is required. Descendant rules use
// low-specificity `[&_x]` utilities so editor/consumer overrides win.
import { cva, type VariantProps } from 'class-variance-authority';

export const proseVariants = cva(
  [
    'text-foreground',
    'max-w-none',
    // Top spacing scales WITH the heading — a bigger heading gets more space above it — and the
    // first child never carries a top margin (otherwise a leading heading opens a large gap).
    // Previously h1 had mt-0 while h2 had mt-8, so a smaller heading had more top padding than a
    // larger one.
    '[&>*:first-child]:mt-0',
    '[&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:mt-10 [&_h1]:mb-4',
    '[&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:mt-8 [&_h2]:mb-3',
    '[&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2',
    '[&_h4]:font-semibold [&_h4]:mt-4 [&_h4]:mb-2',
    '[&_h5]:font-semibold [&_h5]:mt-4 [&_h5]:mb-1',
    '[&_h6]:font-semibold [&_h6]:mt-4 [&_h6]:mb-1 [&_h6]:text-muted-foreground',
    '[&_p]:my-4 [&_p]:leading-7',
    '[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:opacity-80',
    '[&_strong]:font-semibold',
    '[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6',
    '[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6',
    '[&_li]:my-1',
    '[&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground',
    '[&_hr]:my-8 [&_hr]:border-border',
    '[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.875em]',
    '[&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:overflow-x-auto',
    '[&_pre_code]:bg-transparent [&_pre_code]:p-0',
    '[&_img]:rounded-lg [&_img]:my-6',
    '[&_figure]:my-6',
    '[&_figcaption]:mt-2 [&_figcaption]:text-center [&_figcaption]:text-sm [&_figcaption]:italic [&_figcaption]:text-muted-foreground',
  ],
  {
    variants: {
      size: {
        sm: 'text-sm [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg [&_h4]:text-base [&_h5]:text-sm',
        base: 'text-base [&_h1]:text-4xl [&_h2]:text-2xl [&_h3]:text-xl [&_h4]:text-lg [&_h5]:text-base',
        lg: 'text-lg [&_h1]:text-5xl [&_h2]:text-3xl [&_h3]:text-2xl [&_h4]:text-xl [&_h5]:text-lg',
      },
    },
    defaultVariants: { size: 'base' },
  },
);

export type ProseVariants = VariantProps<typeof proseVariants>;

export interface ProseProps {
  size?: ProseVariants['size'];
  className?: string;
}
