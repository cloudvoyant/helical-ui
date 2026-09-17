# helical-ui architecture

## Monorepo layout

helical-ui is a pnpm workspace monorepo:

- `libs/helical-ui` — shared interfaces, cva variants (`buttonVariants`, `toggleButtonVariants`, `badgeVariants`), `cn` utility, and the shadcn-style theme (CSS variables, light + dark). Publishes to npm.
- `libs/helical-react` — React UI components built on Ark UI (Button, ToggleButton, Badge). Publishes to npm.
- `libs/helical-svelte` — Svelte UI components built on Ark UI (Button, ToggleButton, Badge), packaged with `@sveltejs/package`. Publishes to npm.
- `apps/docs` — Astro docs/demo app, `private: true` (never published). MDX content collection, shadcn-style shell, React/Svelte framework selector, live component demos.

## Workspace config

- `pnpm-workspace.yaml` — workspace globs (`apps/*`, `libs/*`), shared dependency catalog (`catalogMode: manual`).
- `tsconfig.base.json` — shared strict TypeScript base; each package extends it.
- `version.txt` — single source of truth for the lockstep version shared by all packages.
- `mise-tasks/set-version` — fans a version out to every `libs/*/package.json` and `apps/*/package.json`.

## Docs app conventions

- `apps/docs` uses Astro 7 with `@astrojs/react`, `@astrojs/svelte`, `@astrojs/mdx`, and Tailwind v4 via `@tailwindcss/vite`.
- The theme lives in `@cloudvoyant/helical-ui/src/theme.css` and matches shadcn/ui's implementation exactly at this stage (CSS variables under `:root`/`.dark`, `@theme inline`, `@custom-variant dark`).
- The framework selector persists to `localStorage` (`vortex:framework`) and sets `data-framework` on `<html>`; `Demo.astro` is an auto-generated monolithic switcher that renders both framework islands and CSS shows the active one.
- To add a new demo, create a folder under `apps/docs/src/components/examples/{component}/{name}` containing `react.tsx` and `svelte.svelte`. The `Demo.astro` and `registry.json` files are automatically updated by `pnpm gen` (run during `predev`/`prebuild`).

## Component pattern

Every component follows the Button pattern: a shared cva variant function lives in `@cloudvoyant/helical-ui`, and `@cloudvoyant/helical-react`/`@cloudvoyant/helical-svelte` expose thin wrappers that apply `cn(<variants>, className)` over an Ark UI primitive. Composite components (ToggleButton) are composed from per-part exports matching Ark's anatomy.

The overlay components (Popover, Dialog, Window, Tooltip) extend this pattern: their shared Tailwind base classes live in `@cloudvoyant/helical-ui` (e.g. `popoverContentBase`), the framework wrappers are thin `cn(base, className)` pass-throughs, and the content/backdrop parts swallow the Ark `Portal` + `Positioner` internally so consumers never compose them (`Window` goes furthest — its root swallows the positioner and content, so children are the window parts directly). Ark's `CloseTrigger` is exported as `Dismiss` with a baked-in `aria-label`, and the arrow is an internal detail toggled via an `arrow` prop on content. A `Portal` layout primitive is exported by `@cloudvoyant/helical-react`/`@cloudvoyant/helical-svelte` (documented under Layout) for escaping ancestors in user compositions. Overlay components reuse the existing shadcn theme tokens — no `theme.css` additions.

## Release pipeline

- `.releaserc.json` — semantic-release. Release rules cap every bump at `minor` (stay-at-v0).
- `mise-tasks/upversion` — runs semantic-release.
- `mise-tasks/publish` / `publish:rc` — publish public workspace packages to npm (skips private, idempotent).
- `.github/workflows/ci.yml` — CI (install, test, format, lint, RC publish on non-main pushes).
- `.github/workflows/release.yml` — release on main.

## CI secrets

- `NPM_TOKEN` — used as `NODE_AUTH_TOKEN` for publishing to npm.
