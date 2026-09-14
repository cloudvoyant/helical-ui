<script lang="ts">
  import { generateHTML } from '@tiptap/core';
  import { buildExtensions, type EditorNodeViews } from '@cloudvoyant/vortex-ui';

  // The Reader renders static HTML via generateHTML, which only ever calls renderHTML — node
  // views are never instantiated, so inert factories are correct here.
  const noopNodeView = () => () => ({}) as never;
  const inertNodeViews: EditorNodeViews = {
    image: noopNodeView,
    urlMention: noopNodeView,
    linkPreview: noopNodeView,
    codeBlock: noopNodeView,
  };

  // Same extension set as the Editor, plus heading ids so headings are anchor-linkable.
  const extensions = buildExtensions({ headingWithId: true, nodeViews: inertNodeViews });

  let { content, style = '' }: { content: string; style?: string } = $props();

  let html = $derived.by(() => {
    if (!content) return '';
    try {
      const json = JSON.parse(content);
      // Strip the title node (first H1) — the page renders it separately in the header
      if (json.content?.[0]?.type === 'heading' && json.content[0].attrs?.level === 1) {
        json.content = json.content.slice(1);
      }
      return generateHTML(json, extensions);
    } catch {
      return '';
    }
  });
</script>

<div class="prose prose-lg dark:prose-invert max-w-none reader-content" {style}>
  {@html html}
</div>

<style>
  /* Bookmark links */
  :global(.reader-content .bookmark-link) {
    text-decoration: none !important;
    color: inherit !important;
    transition: all 0.2s;
    background-color: var(--bookmark-bg) !important;
  }

  :global(.reader-content .bookmark-link:hover) {
    background-color: var(--bookmark-bg-hover) !important;
    border-color: oklch(var(--border));
  }

  :global(.reader-content .bookmark-link h3),
  :global(.reader-content .bookmark-link p),
  :global(.reader-content .bookmark-link span) {
    text-decoration: none !important;
  }

  :global(.reader-content .bookmark-link p) {
    line-height: 1.375 !important;
  }

  /* Link preview images */
  :global(.reader-content .link-preview img) {
    display: block;
  }

  :global(.reader-content .link-preview img[src='']),
  :global(.reader-content .link-preview img:not([src])) {
    display: none;
  }

  /* Text alignment */
  :global(.reader-content [data-text-align='left']) {
    text-align: left !important;
  }

  :global(.reader-content [data-text-align='center']) {
    text-align: center !important;
  }

  :global(.reader-content [data-text-align='right']) {
    text-align: right !important;
  }

  :global(.reader-content [data-text-align='justify']) {
    text-align: justify !important;
  }

  /* Code blocks */
  :global(.reader-content .code-block-wrapper) {
    position: relative;
    background-color: var(--code-block-bg);
    min-height: 80px;
    margin: 1rem 0;
  }

  :global(.reader-content .code-block-content) {
    padding: 2.5rem 1rem 1rem 1rem;
    overflow-x: auto;
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
    font-size: calc(var(--base-font-size, 16px) * 0.875);
    line-height: var(--line-height, 1.5);
    margin: 0;
    background: transparent;
    color: #24292f;
    border: none;
    outline: none;
    min-height: 60px;
  }

  :global(.dark .reader-content .code-block-content) {
    color: #c9d1d9;
  }

  :global(.reader-content .code-block-content code) {
    background: none !important;
    color: inherit !important;
  }

  :global(.reader-content .code-block-language-label) {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.25rem 0.5rem;
    background-color: var(--lang-label-bg);
    color: var(--lang-label-text);
    letter-spacing: 0.05em;
    z-index: 10;
    border: 1px solid var(--lang-label-border);
    border-radius: 0.25rem;
  }

  /* Lists */
  :global(.reader-content ul),
  :global(.reader-content ol) {
    list-style-position: outside;
    padding-left: 1.625rem;
  }

  :global(.reader-content ul li),
  :global(.reader-content ol li) {
    display: list-item !important;
    margin: 0;
  }

  :global(.reader-content ul li > p),
  :global(.reader-content ol li > p) {
    display: inline;
    margin: 0;
  }

  /* Task lists */
  :global(.reader-content ul[data-type='taskList']) {
    list-style: none;
    padding-left: 0;
  }

  :global(.reader-content ul[data-type='taskList'] li[data-type='taskItem']) {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    margin: 0.25rem 0;
  }

  :global(.reader-content ul[data-type='taskList'] li[data-type='taskItem'] label) {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    cursor: default;
  }

  :global(.reader-content ul[data-type='taskList'] li[data-type='taskItem'] input[type='checkbox']) {
    margin-top: 0.25rem;
    flex-shrink: 0;
  }

  /* Indentation */
  :global(.reader-content .tt-indent-1) {
    padding-left: 2rem;
  }
  :global(.reader-content .tt-indent-2) {
    padding-left: 4rem;
  }
  :global(.reader-content .tt-indent-3) {
    padding-left: 6rem;
  }
  :global(.reader-content .tt-indent-4) {
    padding-left: 8rem;
  }
  :global(.reader-content .tt-indent-5) {
    padding-left: 10rem;
  }
  :global(.reader-content .tt-indent-6) {
    padding-left: 12rem;
  }
  :global(.reader-content .tt-indent-7) {
    padding-left: 14rem;
  }
  :global(.reader-content .tt-indent-8) {
    padding-left: 16rem;
  }

  /* URL Mention Pills */
  :global(.reader-content a.url-mention-pill) {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.125rem 0.375rem;
    margin: 0 0.125rem -0.125rem 0.125rem;
    border-radius: 0.375rem;
    background-color: var(--url-pill-bg);
    color: inherit;
    text-decoration: none !important;
    font-size: 0.875rem;
    line-height: 1.25;
    transition: background-color 0.15s;
    vertical-align: text-bottom;
  }

  :global(.reader-content a.url-mention-pill:hover) {
    background-color: #e5e7eb;
  }

  :global(.dark .reader-content a.url-mention-pill:hover) {
    background-color: #6b7280;
  }

  :global(.reader-content a.url-mention-pill svg),
  :global(.reader-content a.url-mention-pill img) {
    width: 0.875rem;
    height: 0.875rem;
    flex-shrink: 0;
  }

  /* Internal Mention */
  :global(.reader-content a.internal-mention) {
    color: inherit;
    text-decoration: underline;
    cursor: pointer;
  }

  :global(.reader-content a.internal-mention:hover) {
    opacity: 0.8;
  }

  /* Text colors - theme-aware */
  :global(.reader-content span[data-color='red']) {
    color: var(--text-red);
  }
  :global(.reader-content span[data-color='orange']) {
    color: var(--text-orange);
  }
  :global(.reader-content span[data-color='yellow']) {
    color: var(--text-yellow);
  }
  :global(.reader-content span[data-color='green']) {
    color: var(--text-green);
  }
  :global(.reader-content span[data-color='cyan']) {
    color: var(--text-cyan);
  }
  :global(.reader-content span[data-color='blue']) {
    color: var(--text-blue);
  }
  :global(.reader-content span[data-color='violet']) {
    color: var(--text-violet);
  }
  :global(.reader-content span[data-color='fuchsia']) {
    color: var(--text-fuchsia);
  }
  :global(.reader-content span[data-color='slate']) {
    color: var(--text-slate);
  }

  /* Tiptap writes selected highlight colors inline. This non-important default is only the
     fallback for highlights without an explicit color. */
  :global(.reader-content mark) {
    background-color: var(--highlight-yellow);
    color: inherit !important;
  }
</style>
