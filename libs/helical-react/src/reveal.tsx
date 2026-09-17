// libs/helical-react/src/reveal.tsx
// Closely based on: diffbook QA (packages/diffbook-ui/src/components/QA.tsx), renamed Reveal,
// rebuilt on Ark UI Collapsible.
import type { ReactNode } from 'react';
import type { HTMLArkProps } from '@ark-ui/react/factory';
import { CollapsibleRoot, CollapsibleTrigger, CollapsibleContent } from '@ark-ui/react/collapsible';
import { revealRootBase, revealTriggerBase, revealChevronBase, revealContentBase, cn } from '@cloudvoyant/helical-ui';
import type { RevealProps as RevealPropsBase } from '@cloudvoyant/helical-ui';

export type RevealProps = HTMLArkProps<'div'> & RevealPropsBase & { children?: ReactNode };

function ChevronRightIcon({ className }: { className?: string }) {
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
      className={className}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function Reveal({ question, children, className, ...props }: RevealProps) {
  return (
    <CollapsibleRoot className={cn(revealRootBase, className)} {...props}>
      <CollapsibleTrigger className={revealTriggerBase}>
        <ChevronRightIcon className={revealChevronBase} />
        <span>{question}</span>
      </CollapsibleTrigger>
      <CollapsibleContent className={revealContentBase}>{children}</CollapsibleContent>
    </CollapsibleRoot>
  );
}
