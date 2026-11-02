// libs/helical-ui/src/kbd.ts
// Closely based on: Chakra UI Kbd recipe + @tanstack/hotkeys formatForDisplay (inverted).
import { cva, type VariantProps } from 'class-variance-authority';
import { formatForDisplay, type DisplayHotkeyChord } from '@tanstack/hotkeys';

export const kbdVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-0.5 rounded border font-mono font-medium leading-none tracking-tight select-none',
  {
    variants: {
      variant: {
        outline: 'border-border border-b-2 bg-muted/70 text-foreground shadow-2xs',
        subtle: 'border-transparent bg-muted text-muted-foreground',
        solid: 'border-transparent bg-primary text-primary-foreground shadow-2xs',
      },
      size: {
        sm: 'min-h-4 min-w-4 px-1 py-0.5 text-[10px]',
        md: 'min-h-5 min-w-5 px-1.5 py-0.5 text-xs',
        lg: 'min-h-6 min-w-6 px-2 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'outline',
      size: 'md',
    },
  },
);

export const kbdGroupBase = 'inline-flex items-center gap-1';

export type KbdVariants = VariantProps<typeof kbdVariants>;

export interface KbdProps {
  variant?: KbdVariants['variant'];
  size?: KbdVariants['size'];
  /**
   * Optional hotkey chord or sequence string (e.g. `'Mod+K'`, `'Control+w'`, `'Space'`).
   * When provided without children, `<Kbd>` formats the chord for the target platform.
   */
  hotkey?: string | string[];
  platform?: 'mac' | 'windows' | 'linux';
  useSymbols?: boolean;
  className?: string;
}

const KEY_LABEL_OVERRIDES: Record<string, string> = {
  Space: 'Space',
  ' ': 'Space',
  Escape: 'Esc',
  Backspace: '⌫',
  Enter: '↵',
  ArrowUp: '↑',
  ArrowDown: '↓',
  ArrowLeft: '←',
  ArrowRight: '→',
};

export function formatKeyChord(
  chord: string,
  options?: { platform?: 'mac' | 'windows' | 'linux'; useSymbols?: boolean },
): string {
  const trimmed = chord.trim();
  if (!trimmed) return '';
  if (KEY_LABEL_OVERRIDES[trimmed]) {
    return KEY_LABEL_OVERRIDES[trimmed]!;
  }
  // Preserve single-character case sensitivity for modal bindings like 'g' vs 'G' or 'v' vs 'V'
  if (trimmed.length === 1) {
    return trimmed;
  }
  if (/^Shift\+([a-zA-Z])$/.test(trimmed)) {
    return trimmed.slice(-1).toUpperCase();
  }
  try {
    const formatted = formatForDisplay(trimmed as DisplayHotkeyChord, {
      platform: options?.platform,
      useSymbols: options?.useSymbols ?? true,
    });
    return formatted || trimmed;
  } catch {
    return trimmed;
  }
}

export function formatKeySequence(
  hotkey: string | string[],
  options?: { platform?: 'mac' | 'windows' | 'linux'; useSymbols?: boolean },
): string[] {
  const steps = Array.isArray(hotkey) ? hotkey : hotkey.trim().split(/\s+/).filter(Boolean);
  return steps.map((step) => formatKeyChord(step, options));
}
