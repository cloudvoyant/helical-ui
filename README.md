# helical-ui

[![npm version](https://img.shields.io/npm/v/@cloudvoyant/helical-react.svg)](https://www.npmjs.com/package/@cloudvoyant/helical-react)

helical-ui is a pnpm workspace monorepo for a cross-framework UI component library (React + Svelte) with an Astro docs/demo site.

## Docs

The docs site is published to GitHub Pages at [https://cloudvoyant.github.io/helical-ui/](https://cloudvoyant.github.io/helical-ui/).

## Structure

- `libs/helical-ui` — shared interfaces, cva variants (`buttonVariants`, `toggleButtonVariants`, `badgeVariants`), `cn`, and the shadcn-style theme (light + dark)
- `libs/helical-react` — React components built on Ark UI (Button, ToggleButton, Badge)
- `libs/helical-svelte` — Svelte components built on Ark UI (Button, ToggleButton, Badge)
- `apps/docs` — Astro docs/demo site with MDX docs, framework selector, and live demos

## Getting started

```text
mise run install   # install all workspace deps
mise run build     # build every package
mise run test      # run vitest across the workspace
mise run lint      # eslint + tsc/svelte-check across the workspace
mise run format:check
```

Run the docs site:

```text
mise run dev       # Astro dev server (docs + demos)
```

## Component Organization

Every component file follows a strict top-level and internal section order with explicit section headers so any reader can scan state, effects, methods, helpers, and render output immediately.

### 1. Top-level file layout

Order every component module from top to bottom:

1. `// 1. Imports`
2. `// 2. Module constants & types`
3. `// 3. Local helpers` (optional pure module-scope functions)
4. `// 4. Exported component`

Only include a `// Source:` or `// Closely based on:` attribution comment when a file is a near-direct copy of an upstream reference implementation.

### 2. Internal component section headers

Inside every stateful component or example (`React` function body or `Svelte` `<script lang="ts">` block), group logic in this exact order using explicit section headers (omit empty sections):

1. `// --- State ---` — props, refs, local state (`useState` / `$state`), and derived state (`useMemo` / `$derived`)
2. `// --- Effects ---` — side effects and lifecycle subscriptions (`useEffect` / `$effect`)
3. `// --- Methods ---` — event handlers, actions, and state mutators
4. `// --- Helpers ---` — component-scoped DOM lookup or formatting helpers
5. `// --- Render ---` — JSX return value (or Svelte template below `</script>`)

#### Example: Stateless wrapper (React & Svelte 5)

```tsx
// libs/helical-react/src/badge.tsx

// 1. Imports
import { forwardRef, type HTMLAttributes } from 'react';
import { badgeVariants, cn, type BadgeProps as CoreBadgeProps } from '@cloudvoyant/helical-ui';

// 2. Module constants & types
export interface BadgeProps extends CoreBadgeProps, Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {}

// 4. Exported component
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant, color, size, className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant, color, size }), className)}
      {...props}
    />
  ),
);

Badge.displayName = 'Badge';
```

```svelte
<!-- libs/helical-svelte/src/Badge.svelte -->
<script lang="ts">
  // 1. Imports
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { badgeVariants, cn, type BadgeProps as CoreBadgeProps } from '@cloudvoyant/helical-ui';

  // 2. Module constants & types
  interface Props extends CoreBadgeProps, Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
    children?: Snippet;
  }

  // --- State ---
  let { variant, color, size, class: className, children, ...rest }: Props = $props();
</script>

<span class={cn(badgeVariants({ variant, color, size }), className)} {...rest}>
  {@render children?.()}
</span>
```

#### Example: Stateful component (React)

```tsx
// libs/helical-react/src/command-palette.tsx

// 1. Imports
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import {
  cn,
  commandPaletteVariants,
  createCommandTree,
  resolveCommandPaletteView,
  type CommandPaletteProps as CoreCommandPaletteProps,
} from '@cloudvoyant/helical-ui';
import { Dialog, DialogBackdrop, DialogContent } from './dialog';

// 2. Module constants & types
export type CommandPaletteProps = CoreCommandPaletteProps;

// 3. Local helpers
function formatBreadcrumb(labels: string[]): string {
  return labels.join(' / ');
}

// 4. Exported component
export const CommandPalette = forwardRef<HTMLDivElement, CommandPaletteProps>(
  ({ items, open: controlledOpen, defaultOpen = false, onOpenChange, className }, ref) => {
    // --- State ---
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const [query, setQuery] = useState('');
    const [activePath, setActivePath] = useState<string[]>([]);
    const rootRef = useRef<HTMLDivElement | null>(null);

    const isOpen = controlledOpen ?? uncontrolledOpen;
    const tree = useMemo(() => createCommandTree(items ?? []), [items]);
    const view = useMemo(
      () => resolveCommandPaletteView(tree, activePath, query),
      [tree, activePath, query],
    );

    // --- Effects ---
    useEffect(() => {
      if (!isOpen) return;
      getInputElement()?.focus();
    }, [isOpen]);

    // --- Methods ---
    const handleOpenChange = (nextOpen: boolean) => {
      if (controlledOpen === undefined) {
        setUncontrolledOpen(nextOpen);
      }
      if (!nextOpen) {
        setQuery('');
        setActivePath([]);
      }
      onOpenChange?.(nextOpen);
    };

    // --- Helpers ---
    function getInputElement(): HTMLInputElement | null {
      return rootRef.current?.querySelector<HTMLInputElement>('input') ?? null;
    }

    // --- Render ---
    return (
      <Dialog open={isOpen} onOpenChange={(d) => handleOpenChange(d.open)}>
        <DialogBackdrop />
        <DialogContent ref={ref} className={cn(commandPaletteVariants(), className)}>
          {/* ... */}
        </DialogContent>
      </Dialog>
    );
  },
);
```

#### Example: Stateful component (Svelte 5)

```svelte
<!-- libs/helical-svelte/src/command-palette/CommandPalette.svelte -->
<script lang="ts">
  // 1. Imports
  import {
    cn,
    commandPaletteVariants,
    createCommandTree,
    resolveCommandPaletteView,
    type CommandPaletteProps as CoreCommandPaletteProps,
  } from '@cloudvoyant/helical-ui';
  import { Dialog, DialogBackdrop, DialogContent } from '../dialog';

  // 2. Module constants & types
  type Props = Omit<CoreCommandPaletteProps, 'className'> & {
    class?: string;
  };

  // --- State ---
  let {
    items,
    open: controlledOpen = $bindable(undefined),
    defaultOpen = false,
    onOpenChange,
    class: className = '',
  }: Props = $props();

  let uncontrolledOpen = $state(Boolean(defaultOpen));
  let query = $state('');
  let activePath = $state<string[]>([]);
  let rootEl = $state<HTMLDivElement | null>(null);

  const isOpen = $derived(controlledOpen ?? uncontrolledOpen);
  const tree = $derived(createCommandTree(items ?? []));
  const view = $derived(resolveCommandPaletteView(tree, activePath, query));

  // --- Effects ---
  $effect(() => {
    if (!isOpen) return;
    getInputElement()?.focus();
  });

  // --- Methods ---
  function handleOpenChange(nextOpen: boolean) {
    if (controlledOpen !== undefined) {
      controlledOpen = nextOpen;
    } else {
      uncontrolledOpen = nextOpen;
    }
    if (!nextOpen) {
      query = '';
      activePath = [];
    }
    onOpenChange?.(nextOpen);
  }

  // --- Helpers ---
  function getInputElement(): HTMLInputElement | null {
    return rootEl?.querySelector<HTMLInputElement>('input') ?? null;
  }
</script>

<Dialog open={isOpen} onOpenChange={(d) => handleOpenChange(d.open)}>
  <DialogBackdrop />
  <DialogContent class={cn(commandPaletteVariants(), className)}>
    <!-- ... -->
  </DialogContent>
</Dialog>
```

#### Example: Multi-concern core module (`@cloudvoyant/helical-ui`)

Split multi-concern components in `libs/helical-ui/src/<component>/` into focused files:

```text
libs/helical-ui/src/command/
├── types.ts   # Shared interfaces, variant prop types, state contracts
├── core.ts    # Framework-agnostic trees, fuzzy matching, state resolution
├── styles.ts  # Tailwind base classes and cva variants
└── index.ts   # Public barrel re-export
```

## Versioning

All packages share one lockstep version sourced from `version.txt` (`mise run set-version <version>` fans it out). The project intentionally stays at v0 — release rules cap every bump at minor, so the first publish is 0.x. See `docs/architecture.md`.

## Credits

`helical-ui` builds on and draws inspiration from the following open-source projects:

- **[Ark UI](https://ark-ui.com/)** — headless, accessible UI components and state machines for React and Svelte
- **[Tailwind CSS](https://tailwindcss.com/)** — utility-first CSS framework and design token foundation
- **[class-variance-authority (`cva`)](https://cva.style/)**, **[clsx](https://github.com/lukeed/clsx)**, and **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** — composable variant definitions and conflict-free Tailwind class merging (`cn`)
- **[TanStack Hotkeys](https://tanstack.com/hotkeys)** — cross-platform hotkey parsing, chord matching, and display formatting
- **[which-key.nvim](https://github.com/folke/which-key.nvim)** — inspiration for the `WhichKey` chord popup and keybinding discovery UI
- **[Helix](https://helix-editor.com/)**, **[Vim](https://www.vim.org/)**, and **[Kakoune](https://kakoune.org/)** — inspiration for modal keyboard navigation, keybinding presets, and the `:` command menu

