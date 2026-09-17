<!-- apps/docs/src/components/examples/code-block/default/svelte.svelte -->
<script lang="ts">
  import { CodeBlock, CodeBlockHeader, CodeBlockTitle, CodeBlockContent, CodeBlockCopyButton } from '@cloudvoyant/helical-svelte';

  const code = `export function greet(name: string): string {
  return \`Hello, \${name}!\`;
}`;
</script>

<CodeBlock {code} language="ts">
  <CodeBlockHeader>
    <CodeBlockTitle>greet.ts</CodeBlockTitle>
    <div class="ml-auto">
      <CodeBlockCopyButton />
    </div>
  </CodeBlockHeader>
  <CodeBlockContent />
</CodeBlock>
