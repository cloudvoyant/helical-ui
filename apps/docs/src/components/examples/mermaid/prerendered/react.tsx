// apps/docs/src/components/examples/mermaid/prerendered/react.tsx
// Demonstrates the server-side rendering path: a pre-rendered SVG is passed via the `svg`
// prop, so `mermaid` is never imported on the client and the diagram paints immediately.
import { Mermaid } from '@cloudvoyant/helical-react';

const code = `flowchart LR
  A[Source] --> B[Prerendered]
  B --> C[SVG]`;

// A hand-authored SVG carrying a viewBox. In a real app this would be produced at build
// time (e.g. a remark/rehype mermaid plugin) — the component just renders whatever string
// it receives, reserving the aspect ratio from the viewBox so there is no layout shift.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 180" width="480" height="180" font-family="ui-monospace, monospace" font-size="14">
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
    </marker>
  </defs>
  <rect x="10" y="60" width="130" height="60" rx="8" fill="var(--card)" stroke="var(--border)" />
  <text x="75" y="95" text-anchor="middle" fill="var(--foreground)">Source</text>
  <rect x="175" y="60" width="130" height="60" rx="8" fill="var(--card)" stroke="var(--border)" />
  <text x="240" y="95" text-anchor="middle" fill="var(--foreground)">Prerendered</text>
  <rect x="340" y="60" width="130" height="60" rx="8" fill="var(--card)" stroke="var(--border)" />
  <text x="405" y="95" text-anchor="middle" fill="var(--foreground)">SVG</text>
  <path d="M 140 90 L 175 90" stroke="var(--muted-foreground)" fill="none" marker-end="url(#arrow)" />
  <path d="M 305 90 L 340 90" stroke="var(--muted-foreground)" fill="none" marker-end="url(#arrow)" />
</svg>`;

export default function ReactMermaidPrerendered() {
  return <Mermaid code={code} svg={svg} />;
}
