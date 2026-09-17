# Guidelines

## Non-negotiables

- **Light and dark capable** — every component must render correctly in both themes.
- **Accessible** — accessibility comes from Ark's state machine; do not hand-roll roles, keyboard handlers, or focus management. Add `aria-label` for icon-only controls.
- **Themeable** — all styling references shadcn CSS variables; never hard-code a color.
- **Sourced, never home-made** — use Shark UI → Tark UI → Ark UI → Chakra UI → shadcn sources in that order; never hand-roll a component one of them already provides. Record the source in each file header (see `references/sourcing.md`).
- **PascalCase component names** — public exports, part names, and MDX titles are PascalCase (`ToggleButton`, `NavigationMenu`); only file paths stay kebab-case per repo convention (`toggle-button.tsx` exporting `ToggleButton`, `toggle-button.mdx` titled `ToggleButton`). No lowercase component names in the public API or docs.

## Copy first, adapt after

The first pass is a working copy of the source, not an adaptation. Land it across all four packages with behavior and e2e green **before** changing styling or structure:

1. Copy the source parts across the packages (see `package-layout.md`) with minimal changes — parts, API, behavior intact.
2. Wire up the docs demo islands and e2e spec; get `mise run e2e` green on the copied behavior.
3. Commit the working copy as a clear breakpoint.
4. Only now apply helical-ui adaptations — layout primitives, nesting reduction, Tailwind/token swaps, theme extensions — each in its own commit so a bad change can be reverted.

This keeps copied-vs-modified behavior inspectable: when a bug shows up, diff against the breakpoint commit instead of guessing whether the source or the adaptation introduced it.

## `cn` for every class merge

Use `@cloudvoyant/helical-ui`'s `cn` (clsx + tailwind-merge) to combine variant classes with user `className`/`class`:

```tsx
className={cn(buttonVariants({ variant, color, size }), className)}
```

This makes conflicting utilities resolve last-wins and keeps shadcn-style overrides working.

## Tailwind + shadcn theme

- Style with Tailwind utilities that reference theme tokens (`bg-primary`, `text-muted-foreground`, `border-input`, `bg-primary/90`).
- The theme is the shadcn CSS-variable model in `@cloudvoyant/helical-ui/src/theme.css`: `@theme inline` maps `--color-*` to `--background`/`--primary`/etc., with `:root` and `.dark` blocks. Do not diverge from shadcn's implementation.
- New color tokens (e.g. `success`, `danger`, `warn`, `info`) follow shadcn's "adding new tokens" pattern — add the `--color-*` mapping in `@theme inline` and the values in both `:root` and `.dark`.

## Layout primitives

helical-ui ships layout primitives in `@cloudvoyant/helical-ui` (`layout.ts`) with thin React/Svelte wrappers: `Container`, `Row`, `Col`, `Stack`, `HStack`, `VStack`, `Center`. Use them **as heavily as possible** for readability and maintainability — this is a deliberate difference from the shadcn approach of raw `div` + utility soup. Prefer composing with named primitives over hand-rolled `flex` classes.

At the same time **reduce unnecessary nesting**: don't wrap a single element in a container just to add spacing or padding, and drop wrapper layers the source created purely for styling. Readability comes from named composition, not extra divs.

## cva variant axes

Split props into orthogonal axes, never compound variants:

- `variant` — fill style (`solid` | `outline` | `text`).
- `color` — palette (`primary` | `secondary` | `success` | `danger` | `warn` | `info`).
- `size` — dimensions.

Every color works with every variant. Use `compoundVariants` in cva only for the (variant × color) class matrix.

## Extending the theme

When a component needs a theme token that does not exist, extending `theme.css` is allowed but must be explicit: add the token, and call it out in the component's docs (see `component-docs-template.md`). Do not add tokens silently.

A theme extension means any change that affects theming — new tokens, new variants that add theme-driven colors, or any styling that depends on the CSS variables. In all cases:

- Update the component's docs to state the extension explicitly — what token/variant was added, where (light and dark), and why.
- Check the available themes (light, dark) and any user-defined theme overrides still resolve the new token. If a token is missing from a theme, the component falls back to the base shadcn value — surface that, don't leave it implicit.
- Never require a consumer to add CSS themselves; the extension ships in `@cloudvoyant/helical-ui`'s `theme.css`.

## React → Svelte parity

The Svelte wrapper exposes the same parts and prop names as React. Translate last, mirror exactly.

## Testing

- **Test behavior and accessibility, never appearance.** Unit tests must not assert on generated cva class strings — that is appearance testing, already covered by `format:check`/lint and the e2e specs. Keep test files header-comment free.
- **Bring over tests from the source.** If the external source (Shark/Tark/Ark/Chakra/shadcn) ships tests, fixtures, or a11y checks for the component, copy them over and adapt them to these standards (see `references/sourcing.md`).
- **e2e specs are the behavior surface.** One spec per component at `apps/docs/e2e/{component}.spec.ts`, matrixed over both React and Svelte via the docs demo islands. Cover:
  - **role / aria state** — native element type (`button`/`span`), `aria-pressed` on toggles, `aria-label` on icon-only controls; non-interactive parts stay non-focusable (no `tabindex`, no button role)
  - **events** — click toggles state; keyboard `Enter`/`Space` activates
  - **inertness** — disabled controls are not activatable (`toBeDisabled`)
  - **a11y violations** — when the axe harness is available, scan for violations instead of hand-rolling role checks
  - **keyboard navigability** — when the component exposes focusable structure (menus, command palettes, sidebars, dialogs, toggles), assert full keyboard operation: arrow keys move focus, `Enter`/`Space` activates, `Escape` dismisses, and no unexpected `Tab` presses are needed to reach items (no focus traps, no skipped items)
    Do not assert demo-shell presence, example-card UI, or generated classes.
- **Example** — a behavior/a11y e2e test follows this pattern (the shipped `e2e/button.spec.ts`, `e2e/toggle-button.spec.ts`, and `e2e/badge.spec.ts` are the canonical full specs):

  ```ts
  const toggle = page.locator(`[data-demo] [data-fw="${framework}"] button:has-text("Bold")`).first();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await expect(async () => {
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  }).toPass();
  ```

- **Keyboard example** — keyboard navigability is asserted from the focused element after key presses. For a command palette/menu: open with `Enter`, type to filter, arrow + `Enter` to pick, `Escape` to dismiss; for a sidebar: tab once into the nav and arrow through items without extra `Tab`s:

  ```ts
  const palette = page.locator(`[data-demo] [data-fw="${framework}"] [role="dialog"]`).first();
  await page.locator(`[data-demo] [data-fw="${framework}"] button:has-text("Open")`).first().focus();
  await page.keyboard.press('Enter');
  await expect(palette).toBeVisible();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(palette).toBeHidden();
  ```

- A theme/registry cross-check is redundant — lint/format CI (e.g. prettier on malformed CSS like an unterminated comment) already catches it; do not ship one.
