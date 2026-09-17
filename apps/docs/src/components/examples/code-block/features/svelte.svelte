<!-- apps/docs/src/components/examples/code-block/features/svelte.svelte -->
<script lang="ts">
  import { CodeBlock } from '@cloudvoyant/helical-svelte';

  const code = `function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`;
</script>

<CodeBlock {code} language="ts" showLineNumbers highlightLines={[2, 3]} />
