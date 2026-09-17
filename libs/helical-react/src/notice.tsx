// libs/helical-react/src/notice.tsx
// Closely based on: diffbook Notice (packages/diffbook-ui/src/components/Notice.tsx + ui/alert.tsx)
import type { ReactNode } from 'react';
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import { noticeVariants, noticeTitleBase, noticeDescriptionBase, cn } from '@cloudvoyant/helical-ui';
import type { NoticeProps as NoticePropsBase } from '@cloudvoyant/helical-ui';

function InfoIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function TriangleAlertIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function CircleXIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}

const noticeIcons = {
  info: InfoIcon,
  success: CheckCircleIcon,
  warning: TriangleAlertIcon,
  error: CircleXIcon,
} as const;

export type NoticeProps = HTMLArkProps<'div'> & NoticePropsBase & { children?: ReactNode };

export function Notice({ variant = 'info', title, children, className, ...props }: NoticeProps) {
  const Icon = variant !== null && variant !== undefined && variant !== 'none' ? noticeIcons[variant] : null;
  const role = variant === 'error' ? 'alert' : variant === 'none' ? undefined : 'status';
  return (
    <ark.div role={role} className={cn(noticeVariants({ variant }), className)} {...props}>
      {Icon ? <Icon /> : null}
      {title ? <ark.div className={noticeTitleBase}>{title}</ark.div> : null}
      {children ? <ark.div className={noticeDescriptionBase}>{children}</ark.div> : null}
    </ark.div>
  );
}
