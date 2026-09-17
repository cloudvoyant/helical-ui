# User Guide

> How to install and use helical-ui.

## Requirements

- [mise](https://mise.jdx.dev/) — manages Node.js and pnpm versions
- Node.js LTS and pnpm are installed automatically by mise via `mise install`

## Getting Started

```text
mise install
mise run install
mise run build
mise run dev   # opens the Astro docs site
```

## Workspace (pnpm monorepo)

helical-ui is a pnpm workspace monorepo:

- Install everything: `mise run install`
- Build all packages: `mise run build`
- Test all packages: `mise run test`
- Lint/format all packages: `mise run lint`, `mise run format:check`
- Run the docs site: `mise run dev` (Astro), then open the printed URL
- Show the current version: `mise run version`
- Set the lockstep version across all packages: `mise run set-version <version>`

## Using the packages

```text
pnpm add @cloudvoyant/helical-ui @cloudvoyant/helical-react
# or for Svelte
pnpm add @cloudvoyant/helical-ui @cloudvoyant/helical-svelte
```

Import the theme once in your global CSS:

```css
@import 'tailwindcss';
@import '@cloudvoyant/helical-ui/theme.css';
/* Registers the helical-ui component class strings (cva variants + framework
   classes) with Tailwind via @source self-scanning — no manual @source needed. */
@import '@cloudvoyant/helical-ui/components.css';
```

Components accept the same `variant` and `size` props across frameworks. Available components:

- `Button` — `variant` (`solid`/`outline`/`text`), `color`, `size`
- `ToggleButton` — `variant` (`default`/`outline`), `size`
- `Badge` — `variant` (`solid`/`subtle`/`outline`/`surface`/`plain`), `color`, `size`
- `Navbar` — `variant` (`sticky`/`floating`), composed parts for brand, menu, actions, and mobile trigger
- `NavbarMenu` — the Navbar's menu, with composed parts for dropdown panels
- `Tabs` — composed parts for tabbed content
- `Pagination` — composed parts for paging through content
- `Tooltip` — composed parts for trigger and content, with an optional arrow
- `Popover` — composed parts for anchor, trigger, title, description, and content, with an optional arrow
- `Dialog` — composed parts for backdrop, trigger, content, title, description, header, and footer
- `Window` — draggable, resizable floating panel with composed parts (header, title, body, resize trigger)
- `Portal` — layout primitive that escapes ancestors via a portal

Every component accepts `className`/`class` and merges it with the shared variant classes, so consumers can restyle individual instances and override the whole theme via CSS variables.

All packages share one lockstep version from `version.txt`; the project stays at v0 until the release-rule cap is deliberately removed.
