// apps/docs/src/components/examples/code-block/features/react.tsx
import { CodeBlock } from '@cloudvoyant/helical-react';

const code = `function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`;

export default function ReactCodeBlockFeatures() {
  return <CodeBlock code={code} language="ts" showLineNumbers highlightLines={[2, 3]} />;
}
