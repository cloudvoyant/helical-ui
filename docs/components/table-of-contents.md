# TableOfContents

`TableOfContents` renders navigation for existing `h2`–`h6` headings. It collects heading ids and labels when `items` is omitted, and supports `default`, `indicator`, `hover`, `rail`, `tree`, and `collapsible` presentations.

## Construction and behavior

The framework wrappers collect headings, create one TOC machine, and render the shared component contract. Pass `value` when a caller owns a machine; the wrapper then renders it and never creates another. The active range may contain several visible headings, but the last item in document order receives `data-current` and `aria-current="location"`.

`TableOfContents` renders a labelled `nav`. The `hover` and `collapsible` presentations keep their title visually hidden rather than leaving `aria-labelledby` pointing at a missing element. In the root-provider composition, the provider is only a context/styling wrapper; root machine attributes are emitted once by the nested navigation.

## Implementation

Framework-independent item collection, current-item selection, tree derivation/pruning, rail geometry, types, and class variants live in `@cloudvoyant/helical-ui`. React and Svelte keep only machine adapters, Ark-compatible DOM parts, and framework rendering. The internal Ark-compatible parts are private and may be replaced by published Ark TOC exports without changing the public `TableOfContents` API.

Use the framework package root for `TableOfContents`, `TocVariant`, `useToc`, and `TocActiveChangeDetails`.
