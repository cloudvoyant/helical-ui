// apps/docs/src/components/examples/code-block/default/react.tsx
import {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockTitle,
  CodeBlockContent,
  CodeBlockCopyButton,
} from '@cloudvoyant/helical-react';

const code = `export function greet(name: string): string {
  return \`Hello, \${name}!\`;
}`;

export default function ReactCodeBlockDefault() {
  return (
    <CodeBlock code={code} language="ts">
      <CodeBlockHeader>
        <CodeBlockTitle>greet.ts</CodeBlockTitle>
        <div className="ml-auto">
          <CodeBlockCopyButton />
        </div>
      </CodeBlockHeader>
      <CodeBlockContent />
    </CodeBlock>
  );
}
