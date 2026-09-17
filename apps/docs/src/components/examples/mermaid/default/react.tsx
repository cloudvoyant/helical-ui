// apps/docs/src/components/examples/mermaid/default/react.tsx
import { Mermaid } from '@cloudvoyant/helical-react';

const code = `flowchart LR
  A[Source] --> B[Placeholder]
  B --> C{Client}
  C -->|loaded| D[Render SVG]
  C -->|failed| E[Keep source visible]`;

export default function ReactMermaidDefault() {
  return <Mermaid code={code} />;
}
