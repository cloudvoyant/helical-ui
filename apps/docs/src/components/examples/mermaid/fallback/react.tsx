// apps/docs/src/components/examples/mermaid/fallback/react.tsx
import { Mermaid } from '@cloudvoyant/helical-react/mermaid';

const code = 'This is not a valid mermaid diagram.';

export default function ReactMermaidFallback() {
  return <Mermaid code={code} />;
}
