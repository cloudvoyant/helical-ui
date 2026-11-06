<!-- libs/helical-svelte/src/which-key/WhichKey.svelte -->
<script lang="ts">
  import { Portal } from '@ark-ui/svelte/portal';
  import { Presence } from '@ark-ui/svelte/presence';
  import { ChevronRight } from 'lucide-svelte';
  import {
    cn,
    formatWhichKeyLabel,
    jumpBadgeMatchedPrefixBase,
    jumpBadgeVariants,
    jumpOverlayRootBase,
    whichKeyBodyVariants,
    whichKeyBreadcrumbBase,
    whichKeyFooterBase,
    whichKeyHeaderBase,
    whichKeyItemBase,
    whichKeyItemLabelBase,
    whichKeyTitleBase,
    whichKeyVariants,
    type WhichKeyProps as CoreWhichKeyProps,
  } from '@cloudvoyant/helical-ui';
  import Kbd from '../Kbd.svelte';
  import Row from '../Row.svelte';
  import Scroll from '../Scroll.svelte';
  import { getOptionalWhichKeyContext } from './context.svelte';
  import WhichKeyExplorer from './WhichKeyExplorer.svelte';

  type Props = Omit<CoreWhichKeyProps, 'className'> & {
    class?: string;
    className?: string;
  };

  let {
    variant = 'helix',
    leaderOnly: leaderOnlyProp,
    showExplorer = true,
    class: className = '',
    className: reactClassName = '',
  }: Props = $props();

  const ctx = getOptionalWhichKeyContext();

  const effectiveLeaderOnly = $derived(leaderOnlyProp ?? Boolean(ctx?.state.leaderOnly));
  const effectiveOpen = $derived(
    ctx
      ? leaderOnlyProp !== undefined
        ? ctx.state.activePath.length > 0 &&
          ctx.state.items.length > 0 &&
          (!leaderOnlyProp || ctx.state.activePath[0] === ctx.state.leaderKey)
        : ctx.state.isOpen
      : false,
  );

  let panelRef: HTMLDivElement | null = $state(null);
  let jumpOverlayRef: HTMLDivElement | null = $state(null);

  $effect(() => {
    if (!effectiveOpen || !ctx) return;
    return ctx.controller.trackBranchElement(() => panelRef);
  });

  $effect(() => {
    if (ctx?.state.mode !== 'jump') return;
    return ctx.controller.trackBranchElement(() => jumpOverlayRef);
  });
</script>

{#if ctx}
  <Portal>
    <Presence present={effectiveOpen} lazyMount unmountOnExit>
      <div
        bind:this={panelRef}
        role="region"
        aria-label={ctx.state.title || 'WhichKey commands'}
        data-which-key-root="true"
        data-testid="which-key-panel"
        data-variant={variant}
        data-leader-only={effectiveLeaderOnly ? 'true' : 'false'}
        data-sticky={ctx.state.sticky ? 'true' : 'false'}
        class={cn(whichKeyVariants({ variant }), className, reactClassName)}
      >
        <div class={whichKeyHeaderBase}>
          <div class={whichKeyTitleBase}>
            <span data-testid="which-key-title">
              {ctx.state.title === 'Space' ? 'Leader' : formatWhichKeyLabel(ctx.state.title)}
            </span>
            <div
              data-testid="which-key-breadcrumb"
              class={whichKeyBreadcrumbBase}
            >
              <span>{ctx.state.breadcrumb.join(' » ')}</span>
            </div>
            {#if ctx.state.countBuffer}
              <span
                data-testid="which-key-count"
                class="rounded bg-muted px-1 font-mono text-[10px]"
              >
                {ctx.state.countBuffer}×
              </span>
            {/if}
          </div>
          <Row class="shrink-0 items-center gap-1.5 text-muted-foreground">
            {#if ctx.state.breadcrumb.length > 1}
              <button
                type="button"
                aria-label="Back"
                onclick={() => ctx.controller.stepBackPrefix()}
                class="inline-flex items-center gap-1 hover:text-foreground"
              >
                <Kbd size="sm">⌫</Kbd>
              </button>
            {/if}
            <button
              type="button"
              aria-label="Close"
              data-testid="which-key-close"
              onclick={() => ctx.controller.closePrefix()}
              class="inline-flex items-center gap-1 hover:text-foreground"
            >
              <Kbd size="sm">Esc</Kbd>
            </button>
          </Row>
        </div>

        <Scroll
          class="max-h-72"
          viewportClass="scroll-fade scroll-fade-12 no-scrollbar max-h-72"
        >
          <div
            data-testid="which-key-items"
            class={whichKeyBodyVariants({ variant })}
          >
            {#each ctx.state.items as node (node.key)}
              {@const isGroup = Boolean(
                node.children || node.proxy || node.expand || node.label.startsWith('+'),
              )}
              <button
                type="button"
                data-testid="which-key-item"
                data-key={node.key}
                data-group={isGroup ? 'true' : 'false'}
                onclick={(e: MouseEvent) => {
                  e.preventDefault();
                  e.stopPropagation();
                  ctx.controller.triggerKey(node.key);
                }}
                class={whichKeyItemBase}
              >
                <span
                  data-group={isGroup ? 'true' : 'false'}
                  class={whichKeyItemLabelBase}
                >
                  <span class="truncate">{formatWhichKeyLabel(node.label)}</span>
                  {#if isGroup}
                    <ChevronRight
                      class="size-3.5 shrink-0"
                      aria-hidden="true"
                    />
                  {/if}
                </span>
                <Kbd
                  size="sm"
                  variant={isGroup ? 'subtle' : 'outline'}
                  hotkey={node.key}
                />
              </button>
            {/each}
          </div>
        </Scroll>

        <div
          data-testid="which-key-footer"
          class={whichKeyFooterBase}
          aria-hidden="true"
        ></div>
      </div>
    </Presence>
  </Portal>

  <Portal>
    <Presence
      present={ctx.state.mode === 'jump' && ctx.state.jumpTargets.length > 0}
      lazyMount
      unmountOnExit
    >
      <div
        bind:this={jumpOverlayRef}
        data-which-key-jump-overlay="true"
        data-testid="which-key-jump-overlay"
        data-jump-action={ctx.state.jumpAction}
        class={jumpOverlayRootBase}
      >
        {#each ctx.state.jumpTargets as target (target.id)}
          <span
            data-testid="which-key-jump-badge"
            data-jump-label={target.label}
            style={`top: ${Math.max(4, target.rect.top - 4)}px; left: ${Math.max(4, target.rect.left - 4)}px;`}
            class={jumpBadgeVariants({ action: ctx.state.jumpAction })}
          >
            {#if target.matchedPrefix}
              <span class={jumpBadgeMatchedPrefixBase}>
                {target.matchedPrefix}
              </span>
            {/if}
            <span>{target.remainingLabel}</span>
          </span>
        {/each}
      </div>
    </Presence>
  </Portal>

  {#if showExplorer}
    <WhichKeyExplorer />
  {/if}
{/if}
