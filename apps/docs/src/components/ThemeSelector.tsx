// apps/docs/src/components/ThemeSelector.tsx
// Theme button + modal: Light/Dark/System color-mode toggle and a grid of
// live-preview theme swatches. Ported from diffbook's settings-dialog as a
// self-contained component (no shadcn Dialog dependency yet). Each swatch
// applies its own `theme-{name}` class so its preview renders in that theme.
// 1. Imports
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Settings2, Sun, Moon, Monitor, X, type LucideIcon } from 'lucide-react';
import { subscribeDocumentTheme, type KeybindingPreset } from '@cloudvoyant/helical-ui';
import { ThemeSelector as HelicalThemeSelector, useWhichKey } from '@cloudvoyant/helical-react';
import { APPEARANCE_CHANGE_EVENT, OPEN_SETTINGS_MODAL_EVENT } from '../lib/commands';
import {
  applyColorMode,
  getInitialColorMode,
  resolveColorMode,
  applyTheme,
  getInitialTheme,
  type ColorMode,
} from '../lib/theme';

// 2. Module constants & types
const MODES: { value: ColorMode; label: string; Icon: LucideIcon }[] = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
  { value: 'system', label: 'System', Icon: Monitor },
];

const KEYBINDING_PRESETS: { value: KeybindingPreset; label: string }[] = [
  { value: 'helix', label: 'Helix' },
  { value: 'vim', label: 'Vim' },
  { value: 'kakoune', label: 'Kakoune' },
];

// 3. Local helpers / hooks
function KeybindingPresetToggle() {
  const { preset, setPreset } = useWhichKey();

  return (
    <div className="flex flex-col gap-1.5">
      <div className="text-xs font-medium text-muted-foreground">Keybinding mode</div>
      <div
        role="group"
        className="flex w-full items-stretch"
        aria-label="Keybinding preset"
        data-keybinding-selector
        data-ready="true"
      >
        {KEYBINDING_PRESETS.map((p, i) => {
          const active = preset === p.value;
          return (
            <button
              key={p.value}
              type="button"
              onClick={() => setPreset(p.value)}
              aria-pressed={active}
              data-preset={p.value}
              className={[
                'relative flex flex-1 items-center justify-center gap-1.5 border bg-card px-3 py-2 text-xs transition-colors',
                i === 0 && 'rounded-l-md',
                i === KEYBINDING_PRESETS.length - 1 && 'rounded-r-md',
                i > 0 && '-ml-px',
                active
                  ? 'z-10 border-foreground text-foreground'
                  : 'border-border text-muted-foreground hover:border-muted-foreground',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {active && <span className="absolute right-1 top-1 size-1.5 rounded-full bg-green-500" />}
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Light/Dark/System segmented button group. Owns the color-mode state and drives
 * it through applyColorMode; reports the resolved dark/light back up so the
 * theme previews can mirror it.
 */
function ColorModeToggle({ onResolvedDarkChange }: { onResolvedDarkChange: (isDark: boolean) => void }) {
  // --- State ---
  const [mode, setMode] = useState<ColorMode>(() => getInitialColorMode());

  // --- Effects ---
  useEffect(() => {
    const onAppearanceChange = () => {
      const next = getInitialColorMode();
      setMode(next);
      onResolvedDarkChange(resolveColorMode(next) === 'dark');
    };
    window.addEventListener(APPEARANCE_CHANGE_EVENT, onAppearanceChange);
    return () => window.removeEventListener(APPEARANCE_CHANGE_EVENT, onAppearanceChange);
  }, [onResolvedDarkChange]);

  useEffect(() => {
    onResolvedDarkChange(resolveColorMode(mode) === 'dark');
    if (mode !== 'system' || typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => onResolvedDarkChange(resolveColorMode('system') === 'dark');
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [mode, onResolvedDarkChange]);

  // --- Methods ---
  function selectMode(m: ColorMode) {
    applyColorMode(m);
    setMode(m);
  }

  // --- Render ---

  return (
    <div className="flex flex-col gap-1.5">
      <div className="text-xs font-medium text-muted-foreground">Color mode</div>
      <div role="group" className="flex w-full items-stretch" aria-label="Color mode">
        {MODES.map((m, i) => {
          const active = mode === m.value;
          return (
            <button
              key={m.value}
              type="button"
              onClick={() => selectMode(m.value)}
              aria-pressed={active}
              data-color-mode={m.value}
              className={[
                'relative flex flex-1 items-center justify-center gap-1.5 border bg-card px-3 py-2 text-xs transition-colors',
                i === 0 && 'rounded-l-md',
                i === MODES.length - 1 && 'rounded-r-md',
                i > 0 && '-ml-px',
                active
                  ? 'z-10 border-foreground text-foreground'
                  : 'border-border text-muted-foreground hover:border-muted-foreground',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {active && <span className="absolute right-1 top-1 size-1.5 rounded-full bg-green-500" />}
              <m.Icon className="size-3.5" aria-hidden />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ThemeGrid() {
  const [theme, setTheme] = useState<string>(() => getInitialTheme());

  useEffect(() => {
    const onAppearanceChange = () => {
      setTheme(getInitialTheme());
    };
    window.addEventListener(APPEARANCE_CHANGE_EVENT, onAppearanceChange);
    const unsubscribe = subscribeDocumentTheme(({ theme: docTheme }) => {
      setTheme(docTheme);
    });
    return () => {
      window.removeEventListener(APPEARANCE_CHANGE_EVENT, onAppearanceChange);
      unsubscribe();
    };
  }, []);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="text-xs font-medium text-muted-foreground">Theme</div>
      <HelicalThemeSelector
        value={theme}
        onValueChange={(name) => {
          applyTheme(name);
          setTheme(name);
        }}
      />
    </div>
  );
}

// 4. Exported component
/**
 * ThemeSelector — a button that opens a centered modal with appearance controls:
 * a Light/Dark/System segmented toggle, and a scrollable grid of theme swatches.
 */
export default function ThemeSelector() {
  const [open, setOpen] = useState(false);
  const [, setIsDark] = useState(() => resolveColorMode(getInitialColorMode()) === 'dark');
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onOpenSettings = () => setOpen(true);
    window.addEventListener(OPEN_SETTINGS_MODAL_EVENT, onOpenSettings);
    return () => window.removeEventListener(OPEN_SETTINGS_MODAL_EVENT, onOpenSettings);
  }, []);

  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
      if (event.key !== 'Tab') return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusables = dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKeydown);
    return () => window.removeEventListener('keydown', onKeydown);
  }, [open]);

  useEffect(() => {
    if (open) return;
    previousFocusRef.current?.focus();
    previousFocusRef.current = null;
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-accent hover:text-foreground"
        aria-label="Open theme settings"
        aria-haspopup="dialog"
        aria-expanded={open}
        data-theme-selector
        onClick={() => setOpen((v) => !v)}
      >
        <Settings2 className="h-4 w-4" aria-hidden />
      </button>

      {/* Portal to <body>: the topnav's backdrop-filter would otherwise become
          the containing block for the fixed overlay and clip the modal. */}
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 p-4"
            data-theme-modal
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label="Theme settings"
              tabIndex={-1}
              className="flex w-full max-w-md flex-col gap-5 rounded-lg border border-border bg-popover p-5 text-popover-foreground shadow-lg focus:outline-none"
            >
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-semibold">
                  <Settings2 className="size-4" aria-hidden />
                  Settings
                </h2>
                <button
                  type="button"
                  className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
                  aria-label="Close theme settings"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>

              <KeybindingPresetToggle />
              <ColorModeToggle onResolvedDarkChange={setIsDark} />
              <ThemeGrid />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
