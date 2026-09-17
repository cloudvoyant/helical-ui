// libs/helical-ui/src/notice.ts
// Closely based on: diffbook Notice (packages/diffbook-ui/src/components/Notice.tsx + ui/alert.tsx).
import { cva, type VariantProps } from 'class-variance-authority';

export const noticeVariants = cva(
  'not-prose relative my-4 grid w-full items-center gap-y-0.5 rounded-lg border px-3 py-2.5 text-sm grid-cols-[0_1fr] has-[>svg]:grid-cols-[calc(var(--spacing)*3)_1fr] has-[>svg]:gap-x-2.5 [&>svg]:size-4',
  {
    variants: {
      variant: {
        none: 'bg-card text-card-foreground',
        info: 'border-info/30 bg-info/5 [&>svg]:text-info',
        success: 'border-success/30 bg-success/5 [&>svg]:text-success',
        warning: 'border-warn/30 bg-warn/5 [&>svg]:text-warn',
        error: 'border-danger/30 bg-danger/5 [&>svg]:text-danger',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  },
);

export type NoticeVariants = VariantProps<typeof noticeVariants>;

export const noticeTitleBase = 'col-start-2 min-h-4 font-semibold tracking-tight';

export const noticeDescriptionBase = 'col-start-2 text-sm text-foreground [&_p]:leading-relaxed';

export interface NoticeProps {
  variant?: NoticeVariants['variant'];
  title?: string;
  className?: string;
}
