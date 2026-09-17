# Sourcing — Shark UI → Tark UI → Ark UI → Chakra UI → shadcn

Every new component starts from an existing, accessibility-complete source. The order matters: prefer a pre-styled, Ark-based component library (Shark UI, then Tark UI), fall back to wrapping the Ark primitive itself, and only then translate a component built on different primitives (Chakra UI, then shadcn). The Svelte translation always happens last.

**The first pass is a working copy, never written from scratch** — pull a real, working implementation from Shark/Tark/Ark (skill, MCP snippet, or docs) or Chakra/shadcn, then adapt it to helical-ui standards.

**Why this order:** Shark UI and Tark UI are both built on Ark UI with Tailwind + semantic tokens — the closest match to how helical-ui wraps Ark parts with a shadcn-style theme — so their part composition and styling translate almost directly. Ark UI is the primitive helical-ui wraps. Chakra UI (Ark-based, but with its own styling system) and shadcn (radix/base-ui based) need the most translation.

## Retrieval paths

- Shark UI ships an Agent Skill (`pnpm dlx skills add sharkui-inc/shark-ui`) and an LLMs.txt index (<https://shark.vini.one/llms.txt>). Use those to pull component code.
- Tark UI's docs are client-rendered; browse the component pages directly.
- Ark UI and Chakra UI expose MCP servers. If one is unavailable, use its docs (links in `references/reference-index.md`) and surface the setup instructions in your report.

## Step 1 — Shark UI (preferred)

Shark UI is a 90+ component, Ark-based library with a shadcn-style registry and Tailwind v4 + semantic tokens — the closest upstream match to helical-ui. Check it first.

- Install the Shark UI skill: `pnpm dlx skills add sharkui-inc/shark-ui`
  - LLMs.txt: <https://shark.vini.one/llms.txt>
  - Component index: <https://shark.vini.one/docs/components>
- Its parts map directly onto Ark (`Menu`/`MenuTrigger`/`MenuContent`, `positioning`, etc.) — wrap them per `package-layout.md`, restyled with helical-ui's own tokens.
- `--shark` forces this path.

## Step 2 — Tark UI

If Shark has no matching component, check Tark UI — an Ark UI + Tailwind library with 40+ components and example-heavy docs.

- Component index: <https://www.tarkui.com/>
- Browse the component page for part anatomy and Tailwind styling, then adapt to helical-ui standards.
- `--tark` forces this path.

## Step 3 — Ark UI

If neither Shark nor Tark has it, wrap the Ark primitive directly.

- Query the Ark UI MCP server: `@ark-ui/mcp`
  - Setup reference: <https://ark-ui.com/docs/ai/mcp-server>
- If the component exists in Ark, wrap its parts directly per `package-layout.md`.
- `--ark` forces this path.

## Step 4 — Chakra UI (translate)

If Ark has no matching primitive, check Chakra UI — it is built on Ark, so a Chakra snippet is a close, accessible starting point, but it needs translation from Chakra's styling to helical-ui's `cn`/Tailwind/theme conventions.

- Query the Chakra MCP server: <https://chakra-ui.com/docs/get-started/ai/mcp-server>
- Pull a snippet with `@chakra-ui/cli`'s snippet command (`npx @chakra-ui/cli snippet add <name>`).
- Translate the snippet to helical-ui standards — Ark parts, `cn`, Tailwind, our theme — without sacrificing its accessibility.
- `--chakra` forces this path.

## Step 5 — shadcn (translate, last resort)

If none of the above has it, use shadcn as a design/starting point. shadcn is radix/base-ui based, so expect the most translation work.

- Install the shadcn skill: `npx skills add shadcn/ui`
  - Reference: <https://ui.shadcn.com/docs/skills>
- Swap its base (radix / base-ui / native) parts for the equivalent Ark UI components.
- `--shadcn` forces this path.

## Always — Svelte last, tests copied

Build and verify the React component first; only after it is finalized, translate it to Svelte. Never build both frameworks in parallel — the Svelte wrapper mirrors the React one's parts and variants.

If the external source (Shark/Tark/Ark/Chakra/shadcn) ships tests for the component, copy them over and adapt them to this skill's testing standards (see `references/guidelines.md` → Testing): behavior and accessibility across both frameworks, never appearance/class-string assertions.

## Copy first, then adapt

The working copy lands before any adaptation:

1. Copy the source component across the four packages (see `package-layout.md`) with minimal changes — parts, API, and behavior intact.
2. Wire up the docs demo islands and e2e spec; get `mise run e2e` green on the copied behavior.
3. Commit the working copy as a clear breakpoint.
4. Only now apply helical-ui adaptations — layout primitives (`Container`/`Stack`/`Center`/...), nesting reduction, Tailwind/token swaps, theme extensions — each in its own commit so a bad change can be reverted and copied-vs-modified behavior diffed.

## Record the source in file headers

Every component file records its origin in a header comment, so reviewers can verify the sourcing chain. Since helical-ui adapts components heavily to its own `cn`/Tailwind/theme conventions, phrase it as **closely based on** rather than a verbatim source:

```tsx
// @cloudvoyant/helical-react/src/tooltip.tsx
// Closely based on: Shark UI tooltip (@ark-ui/react/tooltip)
```

```svelte
<!-- @cloudvoyant/helical-svelte/src/TooltipContent.svelte -->
<!-- Closely based on: Shark UI tooltip (@ark-ui/svelte/tooltip), mirrored from @cloudvoyant/helical-react -->
```

Name the actual origin (`Shark UI <component>`, `Tark UI <component>`, `@ark-ui/react/...`, `@chakra-ui/...`, or `shadcn/ui <component>`). This makes it obvious when a component was home-made instead of adapted — which `review` flags.
