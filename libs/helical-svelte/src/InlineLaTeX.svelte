<!-- libs/helical-svelte/src/InlineLaTeX.svelte -->
<!-- Inline LaTeX equation (displayMode: false), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import { latexRootBase, latexInlineBase, latexErrorBase, toLaTeX, cn } from '@cloudvoyant/helical-ui';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    latex: string;
    html?: string;
    class?: string;
  } & HTMLAttributes<HTMLSpanElement>;

  let { latex, html = undefined, class: className = '', ...rest }: Props = $props();

  let markup = $derived.by(() => {
    if (html !== undefined) return html;
    try {
      return toLaTeX(latex);
    } catch {
      return latex;
    }
  });

  const classes = $derived(cn(latexRootBase, latexInlineBase, className));
</script>

<Ark as="span" {...rest} data-latex-state="done" class={classes}>
  {#if markup === latex && html === undefined}
    <code class={latexErrorBase}>{latex}</code>
  {:else}
    <span>{@html markup}</span>
  {/if}
</Ark>
