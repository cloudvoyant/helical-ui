// libs/helical-react/src/kbd.tsx

// 1. Imports
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import {
  cn,
  isChordCommandString,
  kbdGroupBase,
  kbdVariants,
  resolveKbdSteps,
  type KbdProps as CoreKbdProps,
} from '@cloudvoyant/helical-ui';

// 2. Module constants & types
export type KbdProps = HTMLArkProps<'kbd'> & CoreKbdProps;

// 4. Exported component
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
  // --- State ---
  const rawHotkey: string | ReadonlyArray<string> | undefined =
    hotkey !== undefined
      ? hotkey
      : typeof children === 'string' && isChordCommandString(children)
        ? children
        : undefined;

  // --- Render ---
  if (rawHotkey !== undefined) {
    const resolved = resolveKbdSteps(rawHotkey, { platform, useSymbols });

    if (resolved.steps.length > 1) {
      return (
        <span
          data-slot="kbd-sequence"
          data-invalid={!resolved.valid ? 'true' : undefined}
          title={!resolved.valid ? resolved.message : undefined}
          className={cn(kbdGroupBase, className)}
        >
          {resolved.steps.map((step, idx) => (
            <ark.kbd
              key={`${step.raw}-${idx}`}
              data-slot="kbd"
              data-variant={variant}
              data-size={size}
              data-invalid={!step.valid ? 'true' : undefined}
              aria-invalid={!step.valid ? 'true' : undefined}
              title={!step.valid ? [...step.errors, ...step.warnings].join('; ') : undefined}
              className={cn(kbdVariants({ variant, size, invalid: !step.valid }))}
              {...props}
            >
              {step.label}
            </ark.kbd>
          ))}
        </span>
      );
    }

    const single = resolved.steps[0]!;
    return (
      <ark.kbd
        data-slot="kbd"
        data-variant={variant}
        data-size={size}
        data-invalid={!single.valid ? 'true' : undefined}
        aria-invalid={!single.valid ? 'true' : undefined}
        title={!single.valid ? resolved.message : undefined}
        className={cn(kbdVariants({ variant, size, invalid: !single.valid }), className)}
        {...props}
      >
        {single.label}
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
