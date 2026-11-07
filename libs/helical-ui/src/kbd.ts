// libs/helical-ui/src/kbd.ts

// 1. Imports
import { cva, type VariantProps } from 'class-variance-authority';
import {
  ALL_KEYS,
  formatForDisplay,
  hasNonModifierKey,
  isModifierKey,
  normalizeKeyName,
  validateHotkey,
  type DisplayHotkeyChord,
  type LetterKey,
  type LogicalKey,
  type Modifier,
  type ValidationResult,
} from '@tanstack/hotkeys';

// 2. Module constants & types
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
      invalid: {
        true: 'border-destructive/70 bg-destructive/10 text-destructive line-through decoration-destructive/70',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'outline',
      size: 'md',
      invalid: false,
    },
  },
);

export const kbdGroupBase = 'inline-flex items-center gap-1';

export type KbdVariants = VariantProps<typeof kbdVariants>;

type LowerLetterKey = Lowercase<LetterKey>;
type CommonKeyAlias = 'Esc' | 'Return' | 'Spacebar' | 'Del' | 'Ins' | 'PgUp' | 'PgDn';
type CoreModifier = 'Control' | 'Ctrl' | 'Shift' | 'Alt' | 'Option' | 'Meta' | 'Cmd' | 'Mod';
type KbdKey = LogicalKey | LowerLetterKey | CommonKeyAlias;
type SequencePrefixChord = LowerLetterKey | LetterKey | 'Space' | `${CoreModifier}+${LowerLetterKey | LetterKey}`;

/**
 * Type-safe single key or modifier chord backed by `@tanstack/hotkeys`'s `LogicalKey` and `Modifier`,
 * extended with lowercase modal letter bindings (`'g'`, `'Control+w'`) and common aliases.
 */
export type KbdChord = KbdKey | Modifier | `${CoreModifier}+${KbdKey}` | `${CoreModifier}+Shift+${KbdKey}`;

/**
 * Type-safe hotkey prop accepting a single chord (`'Mod+K'`), a space-separated
 * multi-chord command string (`'Space w v'`, `'Control+w l'`), or a sequence array (`['Space', '?']`).
 */
export type KbdHotkey = KbdChord | `${SequencePrefixChord} ${string}` | ReadonlyArray<KbdChord>;

export interface KbdStepResult {
  raw: string;
  label: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface KbdProps {
  variant?: KbdVariants['variant'];
  size?: KbdVariants['size'];
  /**
   * Hotkey chord or multi-chord command string/array (e.g. `'Mod+K'`, `'Control+w l'`, `['Space', '?']`).
   * Validated via `@tanstack/hotkeys`; broken commands trigger a console warning and render with invalid styling.
   */
  hotkey?: KbdHotkey;
  platform?: 'mac' | 'windows' | 'linux';
  useSymbols?: boolean;
  className?: string;
}

const KEY_LABEL_OVERRIDES: Record<string, string> = {
  Space: 'Space',
  Spacebar: 'Space',
  ' ': 'Space',
  Escape: 'Esc',
  Esc: 'Esc',
  Backspace: '⌫',
  Delete: '⌦',
  Del: '⌦',
  Enter: '↵',
  Return: '↵',
  Tab: 'Tab',
  ArrowUp: '↑',
  ArrowDown: '↓',
  ArrowLeft: '←',
  ArrowRight: '→',
};

const ALL_KEYS_SET = ALL_KEYS as ReadonlySet<string>;

// 3. Local helpers
function isKnownSingleKey(keyPart: string): boolean {
  if (!keyPart) return false;
  if (Object.hasOwn(KEY_LABEL_OVERRIDES, keyPart)) return true;
  if (ALL_KEYS_SET.has(keyPart)) return true;
  if (keyPart.length === 1 && ALL_KEYS_SET.has(normalizeKeyName(keyPart))) return true;
  if (/^\[[A-Za-z][A-Za-z0-9]*\]$/.test(keyPart)) {
    return validateHotkey(keyPart).valid;
  }
  return false;
}

// 4. Exported functions
export function validateKbdChord(chord: string): ValidationResult {
  const trimmed = chord.trim();
  if (!trimmed) {
    return { valid: false, warnings: [], errors: ['Hotkey cannot be empty'] };
  }

  if (
    trimmed.length > 1 &&
    (trimmed.startsWith('+') || /[^+]\+$/.test(trimmed) || (trimmed.includes('++') && !trimmed.endsWith('++')))
  ) {
    return {
      valid: false,
      warnings: [],
      errors: [`Invalid hotkey format in '${trimmed}': empty modifier or key part`],
    };
  }

  const baseResult = validateHotkey(trimmed);
  if (!baseResult.valid) {
    return baseResult;
  }

  if (trimmed.includes('+') && trimmed.length > 1) {
    if (!hasNonModifierKey(trimmed)) {
      return {
        valid: false,
        warnings: baseResult.warnings,
        errors: [...baseResult.errors, `Modifier-only chord '${trimmed}' is missing an action key`],
      };
    }
    const rawParts = trimmed.endsWith('++') ? [...trimmed.slice(0, -2).split('+'), '+'] : trimmed.split('+');
    const keyPart = rawParts[rawParts.length - 1]?.trim() ?? '';
    if (!isKnownSingleKey(keyPart)) {
      return {
        valid: false,
        warnings: baseResult.warnings,
        errors: [...baseResult.errors, `Unknown key: '${keyPart}'`],
      };
    }
    return baseResult;
  }

  if (trimmed.length === 1 || isKnownSingleKey(trimmed) || isModifierKey(trimmed)) {
    return baseResult;
  }

  return {
    valid: false,
    warnings: baseResult.warnings,
    errors: [...baseResult.errors, `Unknown key: '${trimmed}'`],
  };
}

export function validateKbdHotkey(hotkey: string | ReadonlyArray<string>): ValidationResult {
  const rawSteps = Array.isArray(hotkey)
    ? hotkey
    : typeof hotkey === 'string'
      ? hotkey.trim().split(/\s+/).filter(Boolean)
      : [];

  if (rawSteps.length === 0) {
    return { valid: false, warnings: [], errors: ['Hotkey cannot be empty'] };
  }

  if (rawSteps.length === 1) {
    return validateKbdChord(rawSteps[0]!);
  }

  const results = rawSteps.map((step) => validateKbdChord(step));
  return {
    valid: results.every((r) => r.valid),
    warnings: results.flatMap((r, idx) => r.warnings.map((w) => `Step ${idx + 1}: ${w}`)),
    errors: results.flatMap((r, idx) => r.errors.map((e) => `Step ${idx + 1}: ${e}`)),
  };
}

export function formatKeyChord(
  chord: string,
  options?: { platform?: 'mac' | 'windows' | 'linux'; useSymbols?: boolean },
): string {
  const trimmed = chord.trim();
  if (!trimmed) return '';
  if (Object.hasOwn(KEY_LABEL_OVERRIDES, trimmed)) {
    return KEY_LABEL_OVERRIDES[trimmed]!;
  }
  if (trimmed.length === 1) {
    return trimmed;
  }
  if (/^Shift\+([a-zA-Z])$/.test(trimmed)) {
    return trimmed.slice(-1).toUpperCase();
  }
  const validation = validateKbdChord(trimmed);
  if (!validation.valid) {
    return trimmed;
  }
  try {
    const formatted = formatForDisplay(trimmed as DisplayHotkeyChord, {
      platform: options?.platform ?? 'mac',
      useSymbols: options?.useSymbols ?? true,
    });
    return formatted || trimmed;
  } catch {
    return trimmed;
  }
}

export function formatKeySequence(
  hotkey: string | ReadonlyArray<string>,
  options?: { platform?: 'mac' | 'windows' | 'linux'; useSymbols?: boolean },
): string[] {
  const steps: ReadonlyArray<string> = typeof hotkey === 'string' ? hotkey.trim().split(/\s+/).filter(Boolean) : hotkey;
  return steps.map((step: string) => formatKeyChord(step, options));
}

export function resolveKbdSteps(
  hotkey: string | ReadonlyArray<string>,
  options?: { platform?: 'mac' | 'windows' | 'linux'; useSymbols?: boolean; warn?: boolean },
): { steps: KbdStepResult[]; valid: boolean; message: string | undefined } {
  const rawSteps = Array.isArray(hotkey)
    ? [...hotkey]
    : typeof hotkey === 'string'
      ? hotkey.trim().split(/\s+/).filter(Boolean)
      : [];

  if (rawSteps.length === 0) {
    const msg = 'Hotkey cannot be empty';
    if (options?.warn !== false) {
      console.warn(`[helical-ui/Kbd] Invalid hotkey "${String(hotkey)}": ${msg}`);
    }
    return {
      steps: [{ raw: '', label: '?', valid: false, errors: [msg], warnings: [] }],
      valid: false,
      message: msg,
    };
  }

  const steps: KbdStepResult[] = rawSteps.map((raw) => {
    const validation = validateKbdChord(raw);
    const label = validation.valid ? formatKeyChord(raw, options) : raw.trim() || '?';
    return {
      raw,
      label,
      valid: validation.valid,
      errors: validation.errors,
      warnings: validation.warnings,
    };
  });

  const valid = steps.every((s) => s.valid);
  const allMessages = steps.flatMap((s, idx) => {
    const prefix = steps.length > 1 ? `Step ${idx + 1} (${s.raw}): ` : '';
    return [...s.errors, ...s.warnings].map((m) => `${prefix}${m}`);
  });
  const message = allMessages.length > 0 ? allMessages.join('; ') : undefined;

  if (!valid && options?.warn !== false) {
    const rawDisplay = Array.isArray(hotkey) ? hotkey.join(' ') : hotkey;
    console.warn(`[helical-ui/Kbd] Invalid hotkey "${rawDisplay}": ${message}`);
  }

  return { steps, valid, message };
}

/**
 * Checks whether a plain string child passed to `<Kbd>{children}</Kbd>` should be parsed
 * as a hotkey chord/sequence (e.g. `'Mod+K'`, `'Shift+Z'`, `'Space w v'`).
 */
export function isChordCommandString(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length <= 1) return false;
  if (trimmed.includes('+')) return true;
  if (/\s+/.test(trimmed)) {
    const tokens = trimmed.split(/\s+/).filter(Boolean);
    return tokens.length > 1 && tokens.every((t) => validateKbdChord(t).valid);
  }
  return false;
}
