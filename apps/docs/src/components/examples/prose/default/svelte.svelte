<!-- apps/docs/src/components/examples/prose/default/svelte.svelte -->
<script lang="ts">
  import { Prose } from '@cloudvoyant/vortex-svelte';
</script>

<Prose>
  <h1>The Art of Typography</h1>
  <p>
    Good typography is <strong>invisible</strong>. It guides the reader without
    calling attention to itself. Learn more at
    <a href="https://example.com">the type foundry</a>.
  </p>
  <h2>Principles</h2>
  <ul>
    <li>Establish a clear hierarchy</li>
    <li>Keep line length readable</li>
  </ul>
  <blockquote>Whitespace is not empty space.</blockquote>
  <p>Inline <code>code</code> stays legible inside body copy.</p>
</Prose>
