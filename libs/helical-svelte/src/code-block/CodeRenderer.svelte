<!-- libs/helical-svelte/src/code-block/CodeRenderer.svelte -->
<!-- Shared shiki renderer for the code-block family, mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import {
    codeBlockBodyBase,
    codeBlockBodyScrollableBase,
    codeBlockContentBase,
    codeBlockLineNumbersBase,
    codeBlockHighlightBase,
    codeBlockLoadingBase,
    codeBlockSpinnerBase,
    injectCodeBlockStyles,
    renderCodeToHtml,
    cn,
  } from '@cloudvoyant/helical-ui';

  type Props = {
    code: string;
    language: string;
    html?: string;
    showLineNumbers: boolean;
    scrollable: boolean;
    maxHeight: number;
    highlightLines?: number[];
  };

  let {
    code,
    language,
    html = undefined,
    showLineNumbers,
    scrollable,
    maxHeight,
    highlightLines = undefined,
  }: Props = $props();

  let rendered = $state<string | null>(html ?? null);

  const highlightKey = $derived(highlightLines?.join(',') ?? '');

  // The scoped `.hx-cb`/`.cbln`/`.cbhl` styles must be present for both the client
  // highlight path and the prerendered `html` path, so inject them on mount (idempotent).
  $effect(() => {
    injectCodeBlockStyles();
  });

  $effect(() => {
    if (html !== undefined) return;
    let cancelled = false;
    rendered = null;
    renderCodeToHtml(code, language, highlightLines).then((h) => {
      if (!cancelled) rendered = h;
    });
    return () => {
      cancelled = true;
    };
  });

  const classes = $derived(cn(codeBlockBodyBase, scrollable && codeBlockBodyScrollableBase));
  const contentClasses = $derived(
    cn(
      codeBlockContentBase,
      showLineNumbers && codeBlockLineNumbersBase,
      highlightLines?.length && codeBlockHighlightBase,
    ),
  );
  const styles = $derived(scrollable ? `max-height: ${maxHeight}px;` : undefined);
</script>

<div class={classes} style={styles}>
  {#if rendered !== null}
    <div class={contentClasses}>{@html rendered}</div>
  {:else}
    <div class={codeBlockLoadingBase}>
      <div class={codeBlockSpinnerBase}></div>
    </div>
  {/if}
</div>
