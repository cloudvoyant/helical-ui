<!-- apps/docs/src/components/examples/code-block/diff/svelte.svelte -->
<script lang="ts">
  import { CodeBlock } from '@cloudvoyant/helical-svelte';

  const code = `--- a/src/greet.ts
+++ b/src/greet.ts
@@ -1,4 +1,4 @@
 export function greet(name: string): string {
-  return \`Hello, \${name}!\`;
+  return \`Hi there, \${name}!\`;
}
`;
</script>

<CodeBlock {code} language="diff" filename="greet.ts.diff" />
