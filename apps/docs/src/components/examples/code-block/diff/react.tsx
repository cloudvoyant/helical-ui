// apps/docs/src/components/examples/code-block/diff/react.tsx
import { CodeBlock } from '@cloudvoyant/helical-react';

const code = `--- a/src/greet.ts
+++ b/src/greet.ts
@@ -1,4 +1,4 @@
 export function greet(name: string): string {
-  return \`Hello, \${name}!\`;
+  return \`Hi there, \${name}!\`;
 }
`;

export default function ReactCodeBlockDiff() {
  return <CodeBlock code={code} language="diff" filename="greet.ts.diff" />;
}
