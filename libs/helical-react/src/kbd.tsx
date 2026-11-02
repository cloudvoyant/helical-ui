// libs/helical-react/src/kbd.tsx
// Thin React wrapper for semantic <kbd> keycaps and multi-chord sequences.
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import {
  cn,
  formatKeyChord,
  formatKeySequence,
  kbdGroupBase,
  kbdVariants,
  type KbdProps as CoreKbdProps,
} from '@cloudvoyant/helical-ui';

export type KbdProps = HTMLArkProps<'kbd'> & CoreKbdProps;

export function Kbd({
  variant = 'outline',
  size = 'md',
  hotkey,
  platform,
  useSymbols = true,
  className,
  children,
  ...props
}: KbdProps) {
  if (hotkey && !children) {
    if (Array.isArray(hotkey) || (typeof hotkey === 'string' && /\s+/.test(hotkey.trim()))) {
      const steps = formatKeySequence(hotkey, { platform, useSymbols });
      return (
        <span data-slot="kbd-sequence" className={cn(kbdGroupBase, className)}>
          {steps.map((step, idx) => (
            <ark.kbd
              key={`${step}-${idx}`}
              data-slot="kbd"
              data-variant={variant}
              data-size={size}
              className={cn(kbdVariants({ variant, size }))}
              {...props}
            >
              {step}
            </ark.kbd>
          ))}
        </span>
      );
    }

    const formatted = formatKeyChord(hotkey, { platform, useSymbols });
    return (
      <ark.kbd
        data-slot="kbd"
        data-variant={variant}
        data-size={size}
        className={cn(kbdVariants({ variant, size }), className)}
        {...props}
      >
        {formatted}
      </ark.kbd>
    );
  }

  return (
    <ark.kbd
      data-slot="kbd"
      data-variant={variant}
      data-size={size}
      className={cn(kbdVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </ark.kbd>
  );
}
