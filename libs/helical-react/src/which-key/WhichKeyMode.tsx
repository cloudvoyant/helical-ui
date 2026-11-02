// libs/helical-react/src/which-key/WhichKeyMode.tsx
import { forwardRef, type HTMLAttributes } from 'react';
import {
  cn,
  whichKeyModeBadgeVariants,
  type WhichKeyModeProps as CoreWhichKeyModeProps,
} from '@cloudvoyant/helical-ui';
import { useWhichKey } from './context';

export type WhichKeyModeProps = CoreWhichKeyModeProps &
  Omit<HTMLAttributes<HTMLSpanElement>, 'children'>;

export const WhichKeyMode = forwardRef<HTMLSpanElement, WhichKeyModeProps>(function WhichKeyMode(
  { mode: modeProp, sticky: stickyProp, showPreset = false, size = 'sm', className, ...props },
  ref,
) {
  const ctx = useWhichKey();
  const resolvedMode = modeProp ?? ctx.mode;
  const resolvedSticky = stickyProp ?? ctx.sticky;
  const modeLabel = resolvedSticky ? `${resolvedMode}·lock` : resolvedMode;
  const label = showPreset ? `${ctx.preset} · ${modeLabel}` : modeLabel;

  return (
    <span
      ref={ref}
      data-slot="which-key-mode"
      data-testid="which-key-mode-badge"
      data-mode={resolvedMode}
      data-sticky={resolvedSticky ? 'true' : 'false'}
      data-preset={ctx.preset}
      className={cn(whichKeyModeBadgeVariants({ mode: resolvedMode, size }), className)}
      {...props}
    >
      {label}
    </span>
  );
});
