# Package Layout

One component spans four packages. Each aspect has a fixed home — never cross the line.

## `@cloudvoyant/helical-ui` — shared, framework-agnostic

Everything both frameworks need, defined once:

- **Shared types/interfaces** — the component's prop shape that React and Svelte both import.
- **cva variants** — `{component}Variants` with the `variant` / `color` / `size` axes.
- **`cn`** — the `clsx` + `tailwind-merge` helper used for every class merge.
- **Layout primitives** — `Container`, `Row`, `Col`, `Stack`, `HStack`, `VStack`, `Center` (see `layout.ts`); compose components with these, not raw flex divs.
- **Theme** — the shadcn CSS-variable theme (`theme.css`), light and dark.

No framework imports (`react`, `svelte`, `@ark-ui/*`) belong here.

## `@cloudvoyant/helical-react` — thin Ark factory wrappers

One file per component. Each part re-exports or lightly wraps its `@ark-ui/react` counterpart:

```tsx
export function TooltipContent({ className, ...props }: TooltipContentProps) {
  return <ArkTooltipContent className={cn(tooltipContentVariants(), className)} {...props} />;
}
```

Rules: apply `cn(variants(...), className)`, spread the rest, zero logic. Simple parts are pure re-exports.

## `@cloudvoyant/helical-svelte` — one `.svelte` per Ark part

Mirrors the React wrapper's parts and variants, written in Svelte 5 runes (`$props`, `$derived`). One file per part (e.g. `TooltipContent.svelte`). Same thin-wrapper rule: apply `cn(variants(...), class)`, forward the rest.

## `apps/docs` — demos, docs, E2E

- **Demo examples** — `src/components/examples/{component}/{name}/{index.astro,react.tsx,svelte.svelte}`; the `?raw` source of `react.tsx`/`svelte.svelte` is the code snippet (colocated, no drift).
- **MDX page** — `src/content/components/{component}.mdx`, following `component-docs-template.md`.
- **E2E spec** — `e2e/{component}.spec.ts`, matrixed across both frameworks.
