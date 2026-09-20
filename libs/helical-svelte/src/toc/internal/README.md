# Vendored Ark UI TOC primitives (private, Svelte)

This folder is **not** part of the public API of `@cloudvoyant/helical-svelte`. It exists so the public high-level `Toc` can be composed from Ark's Svelte TOC primitives before Ark publishes them to npm.

## Why this exists

Ark UI's TOC source ships on `chakra-ui/ark@main` for Svelte, but it is **not** reachable from the published `@ark-ui/svelte` package: `package.json#exports` has no `./toc` subpath, so `import { Toc } from '@ark-ui/svelte/toc'` fails, and `exports` blocks deep imports into `dist/components/toc`. helical-ui therefore vendors the primitives here.

## Provenance

- Upstream repository: `chakra-ui/ark`
- Upstream path: `packages/svelte/src/lib/components/toc`
- Captured revision: `main`, captured 2026-09-20 into `.codevoyant/spec/toc/research/ark-svelte-toc/`
- Machine: `@zag-js/toc@1.43.1` via `@zag-js/svelte@1.43.1`
- Supported `@ark-ui/svelte` used for published helpers: `5.23.1`

## Local import adaptations

Only imports that pointed at unpublished Ark monorepo internals were changed. Everything else — component names, Svelte 5 runes, `$props`/`$derived`/`bind:ref` behavior, context providers, split-prop key lists, getter calls, polymorphic `asChild` rendering, and emitted `data-*` attributes — is upstream behavior.

| Upstream import                              | Local adaptation                                                                                                                       |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `../factory` (`Ark`)                         | `@ark-ui/svelte/factory`                                                                                                               |
| `$lib/providers/environment`                 | `@ark-ui/svelte/environment`                                                                                                           |
| `$lib/providers/locale`                      | `@ark-ui/svelte/locale`                                                                                                                |
| `$lib/types`                                 | `./utils/types` (`Assign`/`Optional` are also published, but the rest are not)                                                         |
| `../../utils/create-context`                 | `./utils/create-context` — re-exports the identical published `createContext` from `@ark-ui/svelte/utils`                              |
| `../../utils/create-split-props`             | `./utils/create-split-props` — minimal copy; no published equivalent                                                                   |
| `@zag-js/utils` (`MaybeFunction`, `runIfFn`) | `./utils/functions` — minimal copies; `@zag-js/utils` is only a transitive dependency and is deliberately not declared as a direct one |

Both published providers (`@ark-ui/svelte/environment`, `@ark-ui/svelte/locale`) are non-strict with SSR-safe defaults — `getRootNode: () => document` and `dir: 'ltr'` — so direction and root node still resolve through Ark's own context when a provider is mounted, and degrade safely when one is not.

## Structural adaptations

Three deliberate departures from the captured source, required by this repository's toolchain and by the high-level API contract:

1. **Part prop types live in `types.ts`, not in `<script module>` blocks.** Ark declares `TocXProps` inside each component's module script and the published build turns them into `.svelte.d.ts` files. `svelte-check` resolves those, but plain `tsc`/the TS language service cannot: a `.ts` module importing `./toc-content.svelte` sees only the bare `*.svelte` wildcard module, which has no type members, producing TS2614 for every type export. Declaring the types in `types.ts` keeps every exported name and shape identical while making them resolvable by both `svelte-check` and `tsc`.
2. **`toc-nav.svelte` creates its fallback machine lazily.** Ark calls `useToc` unconditionally, which starts a machine even when a parent TOC context exists; `useMachine` runs entry effects on mount, so that unused machine would still install an `IntersectionObserver`. The fallback is now created only when `hasContext(TocContextId)` is false, which is what lets the high-level `Toc` guarantee exactly one machine per nav.
3. **`toc-root-provider.svelte` does not merge `getRootProps()`.** Upstream spreads the root props on both the provider's wrapper div and the nested `toc-nav.svelte`, so the machine's `id`, `data-part="root"`, and `aria-labelledby` appear twice in the DOM. React's equivalent part does not, so the duplicate is also a cross-framework difference. Dropping the merge here keeps the root attributes on the nav only, which is where React puts them.

## Rules

- No helical-ui styles or variant logic belong in this folder. `toc.*` files here are behavior and props only; all classes come from `@cloudvoyant/helical-ui` and are applied by the high-level components.
- Nothing in this folder may be exported from `libs/helical-svelte/src/index.ts`. The only public surface is `Toc`, `useToc`, `TocProps`, `UseTocProps`, and `UseTocReturn` via `../index.ts`.
- Keep the barrel shape (`index.ts`, `toc.ts`) identical to upstream so the swap below is a barrel replacement.

## Stable migration steps

When Ark publishes a stable TOC export:

1. Confirm `@ark-ui/svelte/toc` resolves (add `@ark-ui/svelte` at the version that exports `./toc`).
2. Replace the internals of `../internal/index.ts` and `../internal/toc.ts` with re-exports from `@ark-ui/svelte/toc`.
3. Re-check the deviation in `toc-root-provider.svelte` (adaptation 3): if upstream still merges `getRootProps()` there, `TocView.svelte` will emit the root attributes twice again. Fix it in `TocView.svelte` rather than re-vendoring.
4. Delete every other file in this folder, including `utils/`, `types.ts`, and this README.
5. Run `pnpm -C libs/helical-svelte lint` and the TOC docs e2e suite. No public `Toc` / `useToc` API change, and no change to variant code, should be required.
