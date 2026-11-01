# PreviewFrame

## Design

`PreviewFrame` is the docs shell for examples that need an isolated viewport, such as layout components that depend on viewport units or sticky positioning.

```text
+---------------------- PreviewFrame ----------------------+
|                                                          |
|  +-------------- preview viewport --------------------+  |
|  |  +------- preview window -------+                  |  |
|  |  | iframe: /preview/<component> |                  |  |
|  |  |        /<example>/           |                  |  |
|  |  +------------------------------+                  |  |
|  +-----------------------------------------------------+  |
|                                  [Desktop] [Mobile]      |
+----------------------------------------------------------+
             ^                         ^
             |                         |
       lazy navigation          width/aspect toggle

Docs shell ---------------- postMessage ----------------> iframe
             framework, theme, dark mode
```

The component renders a card containing a horizontally scrollable viewport, a window, and an iframe. The iframe owns the example's document and receives the active framework, theme, and color mode from the docs shell. The toolbar switches between a full-width 16:9 desktop window and a 375px 9:16 mobile window.

## Implementation

- `component` and `example` build the preview URL as `/preview/<component>/<example>/`. The iframe source is assigned only when the frame intersects a 600px root margin; `loading="lazy"` remains enabled after navigation.
- The inline script uses `define:vars` for the base URL because it is emitted as a non-module script. It posts messages to the same origin and listens for framework changes and document-class mutations.
- Each frame has a generated `data-preview-frame` id so the inline script scopes DOM queries to one preview instance. Width state is stored in `data-preview-mode`, inline width, and aspect-ratio styles.
- The iframe's `load` event sends the current shell state. This matters because a preview can load after the shell has already selected a framework or theme.
- The `IntersectionObserver` fallback assigns the source immediately when the browser does not support observation.
