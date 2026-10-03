# Vendored Ark UI TOC primitives (private)

This folder is **not** part of the public API of `@cloudvoyant/helical-react`. It exists so the public high-level `TableOfContents` can be composed from Ark's TOC primitives before Ark publishes them to npm.

## Why this exists

Ark UI's TOC source ships on `chakra-ui/ark@main` for React, but it is **not** reachable from the published `@ark-ui/react` package: the built `dist/components/toc` files are present in some versions yet `package.json#exports` has no `./toc` subpath, so `import { Toc } from '@ark-ui/react/toc'` fails. Because `exports` blocks deep imports, there is no supported way to consume the primitives today. helical-ui therefore vendors them here.

## Provenance

- Upstream repository: `chakra-ui/ark`
- Upstream path: `packages/react/src/components/toc`
- Captured revision: `main`, captured 2026-09-20 into `.codevoyant/spec/toc/research/ark-react-toc/` and `.codevoyant/spec/toc/research/ark-react-utils/`
- Machine: `@zag-js/toc@1.43.1` via `@zag-js/react@1.43.1`
- Supported `@ark-ui/react` used for published helpers: `5.38.2`

## Local import adaptations

Only imports that pointed at unpublished Ark monorepo internals were changed. Everything else — component names, `forwardRef` usage, split-prop key lists, context boundaries, prop-getter calls, polymorphic rendering, and emitted `data-*` attributes — is upstream behavior.

| Upstream import                                                 | Local adaptation                                                                                         |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `../factory`                                                    | `@ark-ui/react/factory` (published `ark`, `HTMLProps`, `PolymorphicProps`)                               |
| `../../types` (`Assign`, `Optional`)                            | `./utils/types` — minimal copies; no published equivalent                                                |
| `../../utils/create-split-props`                                | `./utils/create-split-props` — minimal copy; no published equivalent                                     |
| `../../utils/create-context`                                    | `./utils/create-context` — re-exports the identical published `createContext` from `@ark-ui/react/utils` |
| `../../providers` (`useEnvironmentContext`, `useLocaleContext`) | `@ark-ui/react/environment` and `@ark-ui/react/locale`                                                   |

Both published providers (`@ark-ui/react/environment`, `@ark-ui/react/locale`) are non-strict with SSR-safe defaults — `getRootNode: () => document` and `dir: 'ltr'` — so no local fallback is needed. Direction and root node therefore still resolve through Ark's own context when an `EnvironmentProvider` / `LocaleProvider` is mounted, and degrade safely when one is not.

File extensions in upstream's `./x.ts` / `./x.tsx` specifiers were dropped to match this repository's `moduleResolution: "Bundler"` import style.

## Rules

- No helical-ui styles or variant logic belong in this folder. `toc.*` files here are behavior and props only; all classes come from `@cloudvoyant/helical-ui` and are applied by the high-level component.
- Nothing in this folder may be exported from `libs/helical-react/src/index.ts`. The only public surface is `TableOfContents`, `useToc`, `TableOfContentsProps`, `UseTocProps`, and `UseTocReturn` via `../index.ts`.
- Keep the barrel shape (`index.ts`, `toc.ts`) identical to upstream so the swap below is a barrel replacement.

## Stable migration steps

When Ark publishes a stable TOC export:

1. Confirm `@ark-ui/react/toc` resolves (add `@ark-ui/react` at the version that exports `./toc`).
2. Replace the internals of `../internal/index.ts` and `../internal/toc.ts` with re-exports from `@ark-ui/react/toc`.
3. Delete every other file in this folder, including `utils/` and this README.
4. Run `pnpm -C libs/helical-react lint` and the TOC docs e2e suite. No public `TableOfContents` / `useToc` API change, and no change to variant code, should be required.
