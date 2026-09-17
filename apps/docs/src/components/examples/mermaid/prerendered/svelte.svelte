<!-- apps/docs/src/components/examples/mermaid/prerendered/svelte.svelte -->
<script lang="ts">
  import { Mermaid } from '@cloudvoyant/helical-svelte';

  const code = `flowchart LR
  A[Source] --> B[Prerendered]
  B --> C[SVG]`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 180" width="480" height="180" font-family="ui-monospace, monospace" font-size="14">
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
    </marker>
  </defs>
  <rect x="10" y="60" width="130" height="60" rx="8" fill="var(--card)" stroke="var(--border)" />
  <text x="75" y="95" text-anchor="middle" fill="var(--foreground)">Source</text>
  <rect x="175" y="60" width="130" height="60" rx="8" fill="var(--card)" stroke="var(--border)" />
  <text x="240" y="95" text-anchor="middle" fill="var(--foreground)">Prerendered</text>
  <rect x="340" y="60" width="130" height="60" rx="8" fill="var(--card)" stroke="var(--border)" />
  <text x="405" y="95" text-anchor="middle" fill="var(--foreground)">SVG</text>
  <path d="M 140 90 L 175 90" stroke="var(--muted-foreground)" fill="none" marker-end="url(#arrow)" />
  <path d="M 305 90 L 340 90" stroke="var(--muted-foreground)" fill="none" marker-end="url(#arrow)" />
</svg>`;
</script>

<Mermaid {code} {svg} />
