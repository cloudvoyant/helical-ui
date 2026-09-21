<!-- apps/docs/src/components/examples/toc/tree-view/svelte.svelte -->
<!-- Mirrors Ark UI's TOC "With Tree View" example. The section hierarchy drives
     article content; Toc collects the rendered heading depths and derives the
     TreeView collection and its expansion state. -->
<script lang="ts">
  import { Page, PageContent, PageGutter, Toc } from '@cloudvoyant/helical-svelte';

  let pageEl = $state<HTMLDivElement | null>(null);

  type Section = {
    id: string;
    name: string;
    lines: number;
    children?: Section[];
  };

  const sections: Section[] = [
    {
      id: 'svelte-09-guides',
      name: 'Guides',
      lines: 10,
      children: [
        { id: 'svelte-09-quick-start', name: 'Quick Start', lines: 6 },
        { id: 'svelte-09-manual-setup', name: 'Manual Setup', lines: 5 },
      ],
    },
    {
      id: 'svelte-09-core-concepts',
      name: 'Core Concepts',
      lines: 9,
      children: [
        { id: 'svelte-09-toc-props', name: 'Props', lines: 7 },
        { id: 'svelte-09-toc-events', name: 'Events', lines: 6 },
        { id: 'svelte-09-toc-context', name: 'Context', lines: 8 },
      ],
    },
    {
      id: 'svelte-09-advanced',
      name: 'Advanced',
      lines: 11,
      children: [
        { id: 'svelte-09-root-api', name: 'Root Provider', lines: 7 },
        { id: 'svelte-09-custom-rendering', name: 'Custom Rendering', lines: 6 },
      ],
    },
  ];

</script>

<div bind:this={pageEl} data-toc-scroll-root class="h-svh overflow-y-auto overscroll-y-auto">
  <Page class="bg-background text-foreground">
  <PageContent data-toc-scroll class="px-8 py-10">
    <div class="mx-auto flex max-w-2xl flex-col gap-10">
      {#each sections as section (section.id)}
        <section class="scroll-mt-8">
          <h2 id={section.id} class="text-lg font-semibold">{section.name}</h2>
          <div class="mt-3 flex flex-col gap-2">
            {#each Array.from({ length: section.lines }) as _, i (i)}
              <div class="h-2.5 rounded bg-muted"></div>
            {/each}
          </div>
          {#each section.children ?? [] as child (child.id)}
            <div class="mt-6 scroll-mt-8 ps-6">
              <h3 id={child.id} class="text-base font-semibold">{child.name}</h3>
              <div class="mt-3 flex flex-col gap-2">
                {#each Array.from({ length: child.lines }) as _, i (i)}
                  <div class="h-2.5 rounded bg-muted"></div>
                {/each}
              </div>
            </div>
          {/each}
        </section>
      {/each}
    </div>
  </PageContent>
  <PageGutter side="right" class="border-s border-border">
    <Toc variant="tree" scrollEl={() => pageEl} />
  </PageGutter>
  </Page>
</div>
