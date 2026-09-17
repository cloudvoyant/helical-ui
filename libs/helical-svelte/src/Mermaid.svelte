<!-- libs/helical-svelte/src/Mermaid.svelte -->
<!-- Closely based on: diffbook Mermaid (packages/diffbook-ui/src/components/Mermaid.tsx placeholder +
     apps/book/src/components/article-body.tsx client renderer), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import {
    mermaidRootBase,
    mermaidSourceBase,
    mermaidSvgBase,
    mermaidLoadingBase,
    renderMermaidSource,
    mermaidSvgAspectRatio,
    cn,
  } from '@cloudvoyant/helical-ui';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    /** Mermaid diagram source. */
    code: string;
    /** Pre-rendered SVG markup. When provided the component renders it immediately and never
     *  imports `mermaid` client-side — the server-side rendering path. The SVG should carry a
     *  `viewBox` so its aspect ratio can be reserved (no layout shift). */
    svg?: string;
    /** Extra classes for the root container. */
    class?: string;
  } & HTMLAttributes<HTMLDivElement>;

  let { code, svg = undefined, class: className = '', ...rest }: Props = $props();

  type Status = 'loading' | 'done' | 'error';
  let status = $state<Status>(svg !== undefined ? 'done' : 'loading');
  let rendered = $state<string | null>(svg ?? null);

  $effect(() => {
    if (svg !== undefined) return; // prerendered — nothing to load client-side
    let cancelled = false;
    status = 'loading';
    rendered = null;
    renderMermaidSource(code)
      .then((markup) => {
        if (!cancelled) {
          rendered = markup;
          status = 'done';
        }
      })
      .catch(() => {
        if (!cancelled) status = 'error';
      });
    return () => {
      cancelled = true;
    };
  });

  const aspectRatio = $derived(rendered !== null ? mermaidSvgAspectRatio(rendered) : undefined);
  const classes = $derived(cn(mermaidRootBase, className));
  // Svelte style is a string; append aspect-ratio last so the diagram's ratio wins over
  // any caller style and the swap never shifts layout (matches the React wrapper).
  const styles = $derived(
    aspectRatio !== undefined
      ? `${rest.style ? `${rest.style.trim().replace(/;?\s*$/, '')};` : ''}aspect-ratio: ${aspectRatio};`
      : rest.style,
  );
</script>

<Ark
  as="div"
  {...rest}
  data-mermaid-code={JSON.stringify(code)}
  data-mermaid-src={rendered !== null ? code : undefined}
  data-mermaid-state={status}
  style={styles}
  class={classes}
>
  {#if rendered !== null}
    <div class={mermaidSvgBase}>{@html rendered}</div>
  {:else if status === 'error'}
    <pre class={mermaidSourceBase}>{code}</pre>
  {:else}
    <div class={mermaidLoadingBase} role="status" aria-label="Rendering diagram" data-mermaid-loading>
      <span
        aria-hidden="true"
        class="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-muted-foreground/25 border-t-muted-foreground"></span>
      <span class="text-sm text-muted-foreground">Rendering diagram</span>
    </div>
    <noscript>
      <!-- Only active with JS disabled: hide the loading spinner, which can never resolve,
           and show the raw source instead. -->
      <style>[data-mermaid-loading]{display:none}</style>
      <pre class={mermaidSourceBase}>{code}</pre>
    </noscript>
  {/if}
</Ark>
