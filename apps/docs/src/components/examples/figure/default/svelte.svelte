<!-- apps/docs/src/components/examples/figure/default/svelte.svelte -->
<script lang="ts">
  import { Figure } from '@cloudvoyant/helical-svelte';

  const src = `${import.meta.env.BASE_URL}figure-example.svg`;
</script>

<Figure caption="Sunrise over layered mountain ranges">
  {#snippet img()}
    <img
      {src}
      srcSet={`${src} 1x, ${src} 2x`}
      sizes="(min-width: 640px) 640px, 100vw"
      alt="Sunrise over layered mountain ranges"
      loading="lazy"
      class="rounded-lg border border-border"
    />
  {/snippet}
</Figure>
