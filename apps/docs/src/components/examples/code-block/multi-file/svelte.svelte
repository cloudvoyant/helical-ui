<!-- apps/docs/src/components/examples/code-block/multi-file/svelte.svelte -->
<script lang="ts">
  import { MultiFileCodeBlock } from '@cloudvoyant/helical-svelte';
</script>

<MultiFileCodeBlock
  files={[
    { filename: 'index.ts', code: `export { sum } from './sum';`, language: 'ts' },
    { filename: 'sum.ts', code: `export function sum(a: number, b: number) {\n  return a + b;\n}`, language: 'ts' },
  ]}
/>
