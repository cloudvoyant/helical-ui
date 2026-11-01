# Repository Guidance

## Hard Rules

- Prefer the repository's existing task-runner tasks via `mise run <task>`. See [mise.toml](mise.toml), [mise-tasks/](mise-tasks/), and [package.json](package.json).
- Manage workspace packages and dependencies with `pnpm` and the shared catalog in [pnpm-workspace.yaml](pnpm-workspace.yaml).
- Scaffold architecture, planning, and component design documents with `difflab templates scaffold`.
- Use Conventional Commits with imperative subjects of at most 72 characters, no trailing period, and no AI self-attribution. See [.releaserc.json](.releaserc.json).
- Keep `@cloudvoyant/helical-ui` framework-agnostic with no `react`, `svelte`, or `@ark-ui/*` imports.
- Do not override template scripts (`mise-tasks/utils`, `mise-tasks/upversion`, `version.txt`).

## Organization

### Repository layout

- Put shared types, `cva` variants, `cn`, layout primitives, and theme CSS in `libs/helical-ui/src/`. See [docs/architecture.md](docs/architecture.md).
- Put React Ark UI component wrappers in `libs/helical-react/src/<component>/` and Svelte 5 wrappers in `libs/helical-svelte/src/<component>/`.
- Put docs pages in `apps/docs/src/content/components/<component>.mdx` and framework demo pairs in `apps/docs/src/components/examples/<component>/<example>/{react.tsx,svelte.svelte}`.
- Put repository and component architecture docs under `docs/`.
- Use kebab-case for file and directory paths and PascalCase for exported component names and MDX titles.

### File layout

- Record the upstream source in a brief header comment at the top of each component file.
- Place imports first, then module constants and types, then local helpers or hooks, and finally exported components.
- Start every script in `mise-tasks/` with `set -euo pipefail` and source `mise-tasks/utils`.

## Style

### TypeScript and CSS

- Merge component classes with `cn(variants(...), className)` from `@cloudvoyant/helical-ui` so user overrides win.
- Reference shadcn theme tokens in `@cloudvoyant/helical-ui/src/theme.css` rather than hard-coded colors, and keep every component light-and-dark capable.
- Split `cva` variants into orthogonal axes (`variant`, `color`, `size`) and reserve `compoundVariants` for axis intersections.
- [Proposed] Keep inline comments terse and last-resort; express intent through self-descriptive identifier names and move implementation rationale into component architecture docs under `docs/`.
- [Proposed] Document complex UI components with the Difflab `ui-component-architecture` template, using Mermaid flowcharts for state transitions and conceptual implementation.
- [Proposed] Prefer Tailwind utilities and `cva` variants in `libs/helical-ui/src/` over raw rules in `libs/helical-ui/src/components.css`, using `components.css` only for constructs Tailwind utilities cannot define directly (such as `@keyframes` or third-party selector overrides).

### React and Svelte

- Keep React and Svelte component wrappers thin: apply `cn`, forward props to Ark UI primitives, and rely on Ark state machines for roles, focus, and keyboard accessibility.
- Maintain API parity across `@cloudvoyant/helical-react` and `@cloudvoyant/helical-svelte`, writing Svelte 5 components with runes (`$props`, `$derived`, `$state`).
- Compose layouts with helical-ui primitives (`Container`, `Row`, `Col`, `Stack`, `HStack`, `VStack`, `Center`) instead of redundant `div` wrappers.

## Testing

- Place unit tests in `libs/*/tests/*.test.ts` and component behavior/accessibility end-to-end specs in `apps/docs/e2e/<component>.spec.ts`.
- Test observable behavior, ARIA state, and keyboard navigation across both React and Svelte demo islands rather than asserting generated class strings.
- Validate changes with `mise run build`, `mise run test`, `mise run lint`, `mise run format:check`, and `mise run e2e`. See [docs/development-guide.md](docs/development-guide.md).
