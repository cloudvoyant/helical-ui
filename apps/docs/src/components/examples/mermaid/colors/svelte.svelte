<!-- apps/docs/src/components/examples/mermaid/colors/svelte.svelte -->
<script lang="ts">
  import { Mermaid } from '@cloudvoyant/helical-svelte';

  const code = `flowchart LR
  classDef success fill:#16a34a,stroke:#16a34a,color:#ffffff,stroke-width:2px
  classDef warn fill:#d97706,stroke:#d97706,color:#ffffff,stroke-width:2px
  classDef info fill:#2563eb,stroke:#2563eb,color:#ffffff,stroke-width:2px
  A[Start] --> B[Process]
  B --> C[Done]
  B --> D[Retry]
  C:::success
  D:::warn
  A:::info
  style E fill:#9333ea,stroke:#9333ea,color:#ffffff,stroke-width:2px
  E[Note]`;
</script>

<Mermaid {code} />
