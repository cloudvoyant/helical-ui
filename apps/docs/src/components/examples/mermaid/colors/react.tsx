// apps/docs/src/components/examples/mermaid/colors/react.tsx
// Per-node colors in the diagram source: a reusable classDef + explicit style statements.
// Colors are chosen to stay legible on both light and dark backgrounds (the component
// already resolves themeVariables from the active color mode for the diagram chrome).
import { Mermaid } from '@cloudvoyant/helical-react';

const code = `flowchart LR
  classDef success fill:#16a34a,stroke:#16a34a,color:#ffffff,stroke-width:2px
  classDef warn fill:#d97706,stroke:#d97706,color:#ffffff,stroke-width:2px
  classDef info fill:#2563eb,stroke:#2563eb,color:#ffffff,stroke-width:2px
  A[Start] --> B[Process]
  B --> C[Done]
  B --> D[Retry]
  C:::success
  D:::warn
  A:::info
  style E fill:#9333ea,stroke:#9333ea,color:#ffffff,stroke-width:2px
  E[Note]`;

export default function ReactMermaidColors() {
  return <Mermaid code={code} />;
}
