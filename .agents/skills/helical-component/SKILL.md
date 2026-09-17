---
description: 'Create, update, or review helical-ui components. Triggers on: "create component", "new component", "add a {X} component", "update component", "review component", "wrap {X} from ark ui", "/helical-component".'
name: helical-component
license: MIT
compatibility: 'Designed for Claude Code. On OpenCode and VS Code Copilot, AskUserQuestion falls back to numbered list.'
argument-hint: 'new|update|review <component...> [--shark|--tark|--ark|--chakra|--shadcn]'
---

> **Compatibility**: AskUserQuestion falls back to numbered list on non-Claude-Code platforms.

## Skill Requirements

```bash
command -v npx >/dev/null 2>&1 || echo "MISSING: npx"
command -v mise >/dev/null 2>&1 || echo "NOTE: mise not available — validation step will be skipped"
```

## Critical Rules

- Dispatch on the first non-flag argument: `new` (default) | `update` | `review`
- Support multiple components in one invocation — run them as parallel blocking subagents, one per component, then aggregate
- Always source before writing: Shark UI → Tark UI → Ark UI → Chakra UI → shadcn, in that order (see `references/sourcing.md`)
- First pass of a component is a working copy from an external source (Shark/Tark skill, Ark/Chakra MCP snippet, or shadcn) — never written from scratch
- Copy first, adapt after: land the copied component with e2e green at a clear commit breakpoint before restyling, so adaptations can be reverted and diffed (see `references/sourcing.md`)
- Bring over any tests, fixtures, or a11y checks the external source ships, adapted to the testing standards (see `references/guidelines.md`)
- Check the Shark UI skill / LLMs.txt and the Ark/Chakra MCP servers are set up before sourcing; if one is missing, search its docs and surface the setup instructions (see `references/reference-index.md`)
- Shared interfaces, cva variants, `cn`, and the theme live in `@cloudvoyant/helical-ui` — never in a framework package (see `references/package-layout.md`)
- Framework wrappers stay thin — apply `cn(variants(...))`, pass through Ark props, zero logic
- Every component is light-and-dark capable, accessible, and themeable; accessibility comes from Ark's state machine — never hand-roll roles/keyboard/focus (see `references/guidelines.md`)
- E2E must cover keyboard navigability when applicable — arrow-key navigation, `Enter`/`Space` activation, `Escape` dismissal, no extra-tab traps (see `references/guidelines.md` → Testing)
- Use helical-ui layout primitives (`Container`, `Stack`/`HStack`/`VStack`, `Row`/`Col`, `Center`) as heavily as possible and reduce unnecessary nesting — a deliberate difference from the shadcn approach (see `references/guidelines.md`)
- Component names are PascalCase (`ToggleButton`, `NavigationMenu`) in exports, parts, and MDX titles; file paths stay kebab-case (see `references/guidelines.md`)
- Translate React → Svelte last, not in parallel
- Every component ships docs per `references/component-docs-template.md`; theme extensions must be explicit in those docs
- Validate with `mise run build`, `mise run test`, `mise run lint`, `mise run format:check`, `mise run e2e`

## Step 0: Parse arguments

```bash
VERB="[first non-flag argument; default 'new']"    # new | update | review
COMPONENTS="[remaining non-flag arguments]"        # one or more component names
FORCE_SHARK=false; FORCE_TARK=false; FORCE_ARK=false; FORCE_CHAKRA=false; FORCE_SHADCN=false
[[ "$*" =~ --shark ]] && FORCE_SHARK=true
[[ "$*" =~ --tark ]] && FORCE_TARK=true
[[ "$*" =~ --ark ]] && FORCE_ARK=true
[[ "$*" =~ --chakra ]] && FORCE_CHAKRA=true
[[ "$*" =~ --shadcn ]] && FORCE_SHADCN=true
```

Normalise aliases: `add`/`create` → `new`. If `COMPONENTS` is empty, ask for the name(s) (free-text via Other, space-separated).

## Step 0.5: Check retrieval paths

Before sourcing, confirm the preferred retrieval paths are available:

- **Shark UI** — install the skill (`pnpm dlx skills add sharkui-inc/shark-ui`) or use its LLMs.txt (<https://shark.vini.one/llms.txt>); Tark UI is browsed via its docs.
- **Ark / Chakra UI MCP servers** — the fallback retrieval paths for Ark/Chakra sourcing. If one is unavailable, search its docs (links in `references/reference-index.md`) and report the setup instructions in your output.

Do not silently proceed docs-only for the step you land on — surface the setup instructions when a path is missing.

## Step 1: Dispatch per verb

- **`new`** — create each component from scratch: source → package layout → guidelines → docs → validate.
- **`update`** — modify each existing component: re-check sourcing, re-apply package-layout/guidelines/docs standards to the existing files, sync docs (including theme-extension notes), re-validate.
- **`review`** — audit each existing component against the standards using `references/review-checklist.md`; report findings per component. No writes.

## Step 2: Run components in parallel

For each component in `COMPONENTS`, spawn a **blocking subagent** (see `agents/component-agent.md`) with the verb and component name. Run them in parallel (one message, one agent call each), then wait for all.

Each agent follows the verb's steps below and returns a terse per-component report (files touched, or review findings).

## Step 3 (new): Source → layout → guidelines → docs

- Source per `references/sourcing.md`.
- Lay out packages per `references/package-layout.md`.
- Apply `references/guidelines.md`.
- Write docs per `references/component-docs-template.md`.

## Step 3 (update): Re-apply standards to existing files

- Confirm sourcing origin still matches the component (Shark → Tark → Ark → Chakra → shadcn); re-source only if the current wrapper diverges.
- Check each package's files against `references/package-layout.md`; fix misplaced code.
- Re-apply `references/guidelines.md` (light/dark, accessible, themeable, `cn`, cva axes).
- Sync the MDX page and demo examples to `references/component-docs-template.md`, including any theme-extension notes.

## Step 3 (review): Audit against the standards

Run `references/review-checklist.md` against the component and report:

- Sourcing origin correctness
- Package placement (core vs react vs svelte vs docs)
- Thin-wrapper rule, light/dark, accessibility, themeability, `cn`/cva usage
- Docs anatomy conformance + theme-extension explicitness
- Validation status (build/test/lint/format/e2e)

Return findings as a list, severity-tagged (BLOCKING / CONSIDER / NOTE), each citing `file:line`. Do not edit files.

## Step 4: Validate

For `new` and `update`, run in the repo root:

```bash
mise run build && mise run test && mise run lint && mise run format:check && mise run e2e
```

## Step 5: Report

Aggregate the per-component reports: files touched (new/update) or findings (review), plus validation status.

## Agent Index

- **component-agent** (`agents/component-agent.md`) — runs one verb against one component

## Reference Index

- `references/sourcing.md` — Shark → Tark → Ark → Chakra → shadcn decision tree and commands
- `references/package-layout.md` — which package owns what
- `references/guidelines.md` — cn/tailwind/theme/cva/accessibility rules
- `references/component-docs-template.md` — MDX page anatomy
- `references/review-checklist.md` — the audit checklist for `review`
- `references/reference-index.md` — external docs and MCP server links
