// libs/helical-react/src/clipboard.tsx
// Closely based on: Shark UI clipboard (@ark-ui/react/clipboard)
import { ClipboardRoot, ClipboardTrigger, ClipboardIndicator, type ClipboardRootProps } from '@ark-ui/react/clipboard';
import { clipboardTriggerBase, cn } from '@cloudvoyant/helical-ui';

function CopyIcon() {
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
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function CheckIcon() {
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
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export interface CopyButtonProps extends Omit<ClipboardRootProps, 'value' | 'className'> {
  /** Text copied to the clipboard when clicked. */
  value: string;
  /** Accessible label for the trigger (default `Copy`). */
  label?: string;
  /** Extra classes for the trigger. */
  className?: string;
}

/** Icon button that copies `value` to the clipboard, swapping to a check while copied. */
export function CopyButton({ value, label = 'Copy', className, ...props }: CopyButtonProps) {
  return (
    <ClipboardRoot value={value} {...props}>
      <ClipboardTrigger className={cn(clipboardTriggerBase, className)} aria-label={label}>
        <ClipboardIndicator copied={<CheckIcon />}>
          <CopyIcon />
        </ClipboardIndicator>
      </ClipboardTrigger>
    </ClipboardRoot>
  );
}
