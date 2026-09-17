// apps/docs/src/components/examples/code-block/multi-file/react.tsx
import { MultiFileCodeBlock } from '@cloudvoyant/helical-react';

export default function ReactCodeBlockMultiFile() {
  return (
    <MultiFileCodeBlock
      files={[
        { filename: 'index.ts', code: `export { sum } from './sum';`, language: 'ts' },
        { filename: 'sum.ts', code: `export function sum(a: number, b: number) {\n  return a + b;\n}`, language: 'ts' },
      ]}
    />
  );
}
