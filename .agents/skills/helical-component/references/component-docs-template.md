# Component Docs Template

Every component page in `apps/docs/src/content/components/{component}.mdx` follows this anatomy. Write each paragraph as one continuous line; newlines only separate paragraphs, list items, headings, and code fences.

## Frontmatter

```yaml
---
title: <ComponentName>
description: <one sentence, e.g. "A tooltip that appears on hover, for React and Svelte.">
order: <n>
---
```

`title` is the **PascalCase** component name (e.g. `ToggleButton`, `NavigationMenu`) — never a lowercase form. The MDX file path stays kebab-case (`toggle-button.mdx`).

## Intro

One or two sentences explaining what the component does, noting it is built on Ark UI's `<primitive>` (sourced from [Shark UI](https://shark.vini.one/docs/components) or [Tark UI](https://www.tarkui.com/) where available) and shares the `{component}Variants` cva + theme from `@cloudvoyant/helical-ui`. Follow with **exactly one example** — a single component instance, not a row of variants — and nothing else. **No variant tables, no color lists, no size lists, no multi-variant rows** here:

```mdx
import Demo from '../../components/Demo.astro';

<Demo component="{component}" example="default" />
```

The `default` example shows one instance of the component in its default state. All variants/sizes/usages live in the Examples section below, never in the intro.

If the component is a **simple passthrough** of a headless Ark primitive, link it here in the intro — e.g. "This is a thin wrapper over [Ark UI `toggle`](https://ark-ui.com/docs/components/toggle)." When the parts are closely based on Shark UI or Tark UI, also link their component docs as the styling reference.

## Examples

Walk through the variants and usages, each under an `###` subheading. This is where variants, colors, sizes, icon usage, and states live as **rendered demos**:

```mdx
import Examples from '../../components/Examples.astro';

## Examples

<Examples component="{component}" exclude="default" />
```

- **Variants/colors/sizes are never their own headings** — no `## Variants`, `## Colors`, or `## Sizes` section, ever. They appear only as `###` demo subheadings inside `## Examples`.
- Each example's code snippet is the `?raw` source of its colocated `react.tsx` / `svelte.svelte` — hard-code variants, no loops, so the snippet reads cleanly.
- A simple passthrough with only one variant may have no `## Examples` section at all — the intro example suffices, and the upstream Ark link carries the rest.

## Guides (optional)

Include only when the component has enough complexity that usage needs explanation — e.g. a code block needs a guide on registering new languages, or a toast needs a setup guide for the toaster. Omit for components whose usage is self-evident.

## API Reference (mandatory)

One heading per **public component**, then sub-headings for each thing that constitutes its API — `Props`, `Slots` (Svelte), `CSS` variables, or anything else:

```markdown
### Button

#### Props

| Prop      | Type                             | Default   | Description |
| --------- | -------------------------------- | --------- | ----------- |
| `variant` | `'solid' \| 'outline' \| 'text'` | `'solid'` | Fill style. |

#### Slots

| Slot      | Description           |
| --------- | --------------------- |
| `default` | The button's content. |
```

Rules:

- Each public component gets its own `###` heading; the sub-headings under it cover every part of its API — props, slots, CSS variables, context, whatever applies — not just props.
- Re-exported/passthrough parts may say "accepts all Ark `XxxProps` plus `className`/`class`".
- No code snippets in the API section — the Examples section already shows usage.
- **Link passthrough APIs.** When a part's API is a passthrough to Ark/Chakra (thin wrapper, pure re-export, or "accepts all Ark `XxxProps`"), link the relevant upstream doc — e.g. `accepts all [Ark \`TooltipContent\` props](<https://ark-ui.com/docs/components/tooltip)`>. Link at the part level so a reader can find the full prop reference for anything helical-ui doesn't document itself. If the component is closely based on Shark UI or Tark UI, link those docs too.

## Accessibility (optional)

State the WAI-ARIA pattern the component follows and a `Keyboard support` list, or note that Ark handles it (native button, `aria-pressed`, live region, etc.).

## Theme extensions

If the component required extending the theme (new token/variant/theme-driven color), add an explicit note near the top or in a `## Theming` section: what was added, where (light and dark), and why. Never add theme tokens without documenting them here.
