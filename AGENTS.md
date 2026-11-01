# Repository Guidance

## Hard Rules

- Run tasks via `mise run <task>` ([mise.toml](mise.toml), [mise-tasks/](mise-tasks/), [package.json](package.json)).
- Manage packages and shared catalog versions in [pnpm-workspace.yaml](pnpm-workspace.yaml) with `pnpm`.
- Scaffold architecture, planning, and component design docs with `difflab templates scaffold`.
- Format commits as Conventional Commits (`<= 72` chars, imperative, no trailing period, no AI self-attribution; see [.releaserc.json](.releaserc.json)).
- Keep `@cloudvoyant/helical-ui` framework-agnostic (no `react`, `svelte`, or `@ark-ui/*` imports).
- Never modify template scripts (`mise-tasks/utils`, `mise-tasks/upversion`, `version.txt`).

## Organization

### Repository layout

```mermaid
flowchart LR
    UI["@cloudvoyant/helical-ui\n(cva, cn, tokens, CSS)"] --> React["@cloudvoyant/helical-react\n(React 19 + Ark UI)"]
    UI --> Svelte["@cloudvoyant/helical-svelte\n(Svelte 5 + Ark UI)"]
    React --> Docs["apps/docs\n(Astro + MDX + Playwright)"]
    Svelte --> Docs
```

```text
.
├── libs/
│   ├── helical-ui/src/
│   │   ├── <component>.ts            # Shared types, constants, cva variants
│   │   ├── theme.css                 # Shadcn design tokens (light/dark)
│   │   └── components.css            # Keyframes & third-party selector overrides
│   ├── helical-react/src/<component>/ # Thin React Ark UI wrappers (PascalCase.tsx)
│   └── helical-svelte/src/<component>/# Thin Svelte 5 runes wrappers (PascalCase.svelte)
├── apps/docs/
│   ├── src/content/components/<component>.mdx
│   ├── src/components/examples/<component>/<example>/{react.tsx,svelte.svelte}
│   └── e2e/<component>.spec.ts
└── docs/
    ├── architecture.md
    └── components/<component>.md     # Component architecture docs
```

- Use `kebab-case` for directories and shared `.ts`/`.mdx` files; use `PascalCase` for component files and exports. See [docs/architecture.md](docs/architecture.md).

### File layout

Order every component file from top to bottom:

```tsx
// Source: https://ui.shadcn.com/docs/components/radix/<component>

// 1. Imports
import { forwardRef } from 'react';
import { cn, widgetVariants, type WidgetVariantProps } from '@cloudvoyant/helical-ui';

// 2. Module constants & types
export interface WidgetProps extends WidgetVariantProps { ... }

// 3. Local helpers / hooks
function resolveState(...) { ... }

// 4. Exported component
export const Widget = forwardRef<HTMLDivElement, WidgetProps>(...);
```

- Start every script in `mise-tasks/` with `set -euo pipefail` and `source "${MISE_PROJECT_ROOT}/mise-tasks/utils"`.

## Style

### TypeScript and CSS

- Split `cva` variants into orthogonal axes (`variant`, `color`, `size`), use theme tokens from [theme.css](libs/helical-ui/src/theme.css), and merge user `className` last with `cn`:

```ts
export const badgeVariants = cva('inline-flex items-center', {
  variants: {
    variant: { solid: 'bg-primary text-primary-foreground', outline: 'border border-border' },
    size: { sm: 'px-2 py-0.5 text-xs', md: 'px-2.5 py-1 text-sm' },
  },
  defaultVariants: { variant: 'solid', size: 'md' },
});
```

- [Proposed] Keep inline comments terse and last-resort; express intent through self-descriptive identifiers and move rationale into `docs/components/<component>.md`.
- [Proposed] Document complex UI components with `difflab templates scaffold ui-component-architecture`, using Mermaid diagrams for state transitions and data flow.
- [Proposed] Prefer Tailwind utilities and `cva` variants in `libs/helical-ui/src/<component>.ts` over raw rules in [components.css](libs/helical-ui/src/components.css), reserving `components.css` for `@keyframes` or third-party selector overrides.

### React and Svelte

- Keep wrappers thin, maintain prop parity across React and Svelte 5 runes (`$props`, `$derived`, `$state`), and compose layouts with helical-ui primitives (`Container`, `Row`, `Col`, `Stack`, `HStack`, `VStack`, `Center`):

```tsx
// React (libs/helical-react/src/<component>/Root.tsx)
export const Widget = forwardRef<HTMLDivElement, WidgetProps>(
  ({ variant, size, className, ...props }, ref) => (
    <ArkWidget.Root ref={ref} className={cn(widgetVariants({ variant, size }), className)} {...props} />
  ),
);
```

```svelte
<!-- Svelte 5 (libs/helical-svelte/src/<component>/Root.svelte) -->
<script lang="ts">
  let { variant, size, class: className, children, ...rest }: WidgetProps = $props();
</script>
<ArkWidget.Root class={cn(widgetVariants({ variant, size }), className)} {...rest}>
  {@render children?.()}
</ArkWidget.Root>
```

## Testing

| Layer | Location | Focus |
| :--- | :--- | :--- |
| Unit (`vitest`) | `libs/*/tests/*.test.ts` | Variant output, helpers, and pure state logic |
| E2E (`playwright`) | `apps/docs/e2e/<component>.spec.ts` | ARIA state, keyboard navigation, and parity across React & Svelte islands |

Validate before committing (see [docs/development-guide.md](docs/development-guide.md)):

```sh
mise run build && mise run test && mise run lint && mise run format:check && mise run e2e
```
