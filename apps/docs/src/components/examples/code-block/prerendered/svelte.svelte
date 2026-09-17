<!-- apps/docs/src/components/examples/code-block/prerendered/svelte.svelte -->
<script lang="ts">
  import { CodeBlock } from '@cloudvoyant/helical-svelte';

  const code = `const answer = 42;`;
  const html = `<pre class="shiki" tabindex="-1"><code><span class="line line-highlighted"><span style="color:#0550ae">const</span><span style="color:#24292f"> answer </span><span style="color:#cf222e">=</span><span style="color:#24292f"> </span><span style="color:#0550ae">42</span><span style="color:#24292f">;</span></span></code></pre>`;
</script>

<CodeBlock {code} language="ts" {html} showLineNumbers highlightLines={[1]} />
