// apps/docs/src/components/ThemeSelector.tsx
// Theme button + modal: Light/Dark/System color-mode toggle and a grid of
// live-preview theme swatches. Ported from diffbook's settings-dialog as a
// self-contained component (no shadcn Dialog dependency yet). Each swatch
// applies its own `theme-{name}` class so its preview renders in that theme.
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { Settings2, Sun, Moon, Monitor, X, type LucideIcon } from 'lucide-react';
import { THEMES, type ThemeMeta } from '@cloudvoyant/helical-ui';
import {
  applyColorMode,
  getInitialColorMode,
  resolveColorMode,
  applyTheme,
  getInitialTheme,
  type ColorMode,
} from '../lib/theme';

const MODES: { value: ColorMode; label: string; Icon: LucideIcon }[] = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
  { value: 'system', label: 'System', Icon: Monitor },
];

/**
 * Light/Dark/System segmented button group. Owns the color-mode state and drives
 * it through applyColorMode; reports the resolved dark/light back up so the
 * theme previews can mirror it.
 */
function ColorModeToggle({ onResolvedDarkChange }: { onResolvedDarkChange: (isDark: boolean) => void }) {
  const [mode, setMode] = useState<ColorMode>(() => getInitialColorMode());

  function selectMode(m: ColorMode) {
    applyColorMode(m);
    setMode(m);
  }

  useEffect(() => {
    onResolvedDarkChange(resolveColorMode(mode) === 'dark');
    if (mode !== 'system' || typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => onResolvedDarkChange(resolveColorMode('system') === 'dark');
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [mode, onResolvedDarkChange]);

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

/**
 * A single theme swatch: applies its own `theme-{name}` class (plus `dark` when
 * the effective mode is dark) so its mini preview renders in that theme's actual
 * colors, and applies the theme on click.
 */
function ThemeSwatch({
  theme,
  active,
  isDark,
  onSelect,
}: {
  theme: ThemeMeta;
  active: boolean;
  isDark: boolean;
  onSelect: (name: string) => void;
}) {
  return (
    <button
      type="button"
      title={theme.label}
      onClick={() => onSelect(theme.name)}
      aria-pressed={active}
      data-theme-swatch={theme.name}
      className={[
        `theme-${theme.name}`,
        isDark && 'dark',
        'relative flex flex-col gap-1.5 overflow-hidden rounded-md border bg-background p-1.5 text-left text-foreground transition-colors',
        active ? 'border-foreground' : 'border-border hover:border-muted-foreground',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {active && <span className="absolute right-1 top-1 size-1.5 rounded-full bg-green-500" />}
      {/* Mini preview rendered in the theme's own colors. */}
      <div className="flex h-9 flex-col justify-center gap-1 rounded-sm bg-foreground/10 p-1.5">
        <div className="h-1.5 w-4/5 rounded-full bg-primary" />
        <div className="h-1.5 w-3/5 rounded-full bg-foreground/40" />
      </div>
      <span className="truncate text-[11px] font-medium" style={{ fontFamily: 'var(--font-sans)' }}>
        {theme.label}
      </span>
    </button>
  );
}

/**
 * Scrollable grid of live-preview theme swatches. Owns the selected-theme state
 * and drives it through applyTheme; each swatch mirrors the current dark/light.
 */
function ThemeGrid({ isDark }: { isDark: boolean }) {
  const [theme, setTheme] = useState<string>(() => getInitialTheme());

  function selectTheme(name: string) {
    applyTheme(name);
    setTheme(name);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="text-xs font-medium text-muted-foreground">Theme</div>
      <div className="max-h-64 overflow-y-auto rounded-md border p-2">
        {/* Neutral --font-sans so swatches whose theme doesn't define one fall back
            here (not to the active theme's font), preventing font bleed. Each
            theme's own class overrides this for its swatch. */}
        <div
          className="grid grid-cols-2 gap-2"
          style={
            {
              ['--font-sans']: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
            } as CSSProperties
          }
        >
          {THEMES.map((t) => (
            <ThemeSwatch key={t.name} theme={t} active={theme === t.name} isDark={isDark} onSelect={selectTheme} />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * ThemeSelector — a button that opens a centered modal with appearance controls:
 * a Light/Dark/System segmented toggle, and a scrollable grid of theme swatches.
 */
export default function ThemeSelector() {
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => resolveColorMode(getInitialColorMode()) === 'dark');
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

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

              <ColorModeToggle onResolvedDarkChange={setIsDark} />
              <ThemeGrid isDark={isDark} />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
