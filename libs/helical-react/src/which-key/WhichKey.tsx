// libs/helical-react/src/which-key/WhichKey.tsx
// Helix-inspired floating command panel + 2D JumpOverlay + Explorer mount.
// Uses Ark UI <Portal> and <Presence lazyMount unmountOnExit> and @zag-js/dismissable trackDismissableBranch.
import { useEffect, useRef } from 'react';
import { Portal } from '@ark-ui/react/portal';
import { Presence } from '@ark-ui/react/presence';
import {
  cn,
  isGroupNode,
  jumpBadgeMatchedPrefixBase,
  jumpBadgeVariants,
  jumpOverlayRootBase,
  whichKeyBodyVariants,
  whichKeyBreadcrumbBase,
  whichKeyFooterBase,
  whichKeyHeaderBase,
  whichKeyItemBase,
  whichKeyItemLabelBase,
  whichKeyModeBadgeVariants,
  whichKeyTitleBase,
  whichKeyVariants,
  type WhichKeyProps as CoreWhichKeyProps,
} from '@cloudvoyant/helical-ui';
import { Kbd } from '../kbd';
import { Row } from '../row';
import { useOptionalWhichKeyController, useWhichKey } from './context';
import { WhichKeyExplorer } from './WhichKeyExplorer';

export type WhichKeyProps = CoreWhichKeyProps;

export function WhichKey(props: WhichKeyProps) {
  const controller = useOptionalWhichKeyController();
  if (!controller) return null;
  return <WhichKeyInner {...props} />;
}

function WhichKeyInner({
  variant = 'helix',
  showModeBadge = true,
  showExplorer = true,
  className,
}: WhichKeyProps) {
  const {
    preset,
    mode,
    breadcrumb,
    title,
    items,
    isOpen,
    sticky,
    countBuffer,
    jumpAction,
    jumpTargets,
    triggerKey,
    stepBackPrefix,
    closePrefix,
    controller,
  } = useWhichKey();

  const panelRef = useRef<HTMLDivElement | null>(null);
  const jumpOverlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    return controller.trackBranchElement(() => panelRef.current);
  }, [controller, isOpen]);

  useEffect(() => {
    if (mode !== 'jump') return;
    return controller.trackBranchElement(() => jumpOverlayRef.current);
  }, [controller, mode]);

  return (
    <>
      <Portal>
        <Presence present={isOpen} lazyMount unmountOnExit>
          <div
            ref={panelRef}
            role="region"
            aria-label={title || 'WhichKey commands'}
            data-which-key-root="true"
            data-testid="which-key-panel"
            data-variant={variant}
            data-preset={preset}
            data-mode={mode}
            data-sticky={sticky ? 'true' : 'false'}
            className={cn(whichKeyVariants({ variant }), className)}
          >
            <div className={whichKeyHeaderBase}>
              <div className={whichKeyTitleBase}>
                {showModeBadge && (
                  <span
                    data-testid="which-key-mode-badge"
                    className={whichKeyModeBadgeVariants({ mode })}
                  >
                    {sticky ? `${mode}·lock` : mode}
                  </span>
                )}
                <span data-testid="which-key-title">{title}</span>
                {countBuffer && (
                  <span
                    data-testid="which-key-count"
                    className="rounded bg-muted px-1 font-mono text-[10px]"
                  >
                    {countBuffer}×
                  </span>
                )}
              </div>
              <div
                data-testid="which-key-breadcrumb"
                className={whichKeyBreadcrumbBase}
              >
                <span>{ breadcrumb.join(' » ') }</span>
              </div>
            </div>

            <div
              data-testid="which-key-items"
              className={whichKeyBodyVariants({ variant })}
            >
              {items.map((node) => {
                const isGroup = Boolean(
                  node.children || node.proxy || node.expand || node.label.startsWith('+'),
                );
                return (
                  <button
                    key={node.key}
                    type="button"
                    data-testid="which-key-item"
                    data-key={node.key}
                    data-group={isGroup ? 'true' : 'false'}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      triggerKey(node.key);
                    }}
                    className={whichKeyItemBase}
                  >
                    <span
                      data-group={isGroup ? 'true' : 'false'}
                      className={whichKeyItemLabelBase}
                    >
                      {node.label}
                    </span>
                    <Kbd
                      size="sm"
                      variant={isGroup ? 'subtle' : 'outline'}
                      hotkey={node.key}
                    />
                  </button>
                );
              })}
            </div>

            <div className={whichKeyFooterBase}>
              <Row className="items-center gap-2">
                {breadcrumb.length > 1 && (
                  <button
                    type="button"
                    onClick={() => stepBackPrefix()}
                    className="inline-flex items-center gap-1 hover:text-foreground"
                  >
                    <Kbd size="sm">⌫</Kbd>
                    <span>Back</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => closePrefix()}
                  className="inline-flex items-center gap-1 hover:text-foreground"
                >
                  <Kbd size="sm">Esc</Kbd>
                  <span>Close</span>
                </button>
              </Row>
              <span className="font-mono uppercase opacity-75">
                {preset}
              </span>
            </div>
          </div>
        </Presence>
      </Portal>

      <Portal>
        <Presence
          present={mode === 'jump' && jumpTargets.length > 0}
          lazyMount
          unmountOnExit
        >
          <div
            ref={jumpOverlayRef}
            data-which-key-jump-overlay="true"
            data-testid="which-key-jump-overlay"
            data-jump-action={jumpAction}
            className={jumpOverlayRootBase}
          >
            {jumpTargets.map((target) => (
              <span
                key={target.id}
                data-testid="which-key-jump-badge"
                data-jump-label={target.label}
                style={{
                  top: `${Math.max(4, target.rect.top - 4)}px`,
                  left: `${Math.max(4, target.rect.left - 4)}px`,
                }}
                className={jumpBadgeVariants({ action: jumpAction })}
              >
                {target.matchedPrefix && (
                  <span className={jumpBadgeMatchedPrefixBase}>
                    {target.matchedPrefix}
                  </span>
                )}
                <span>{target.remainingLabel}</span>
              </span>
            ))}
          </div>
        </Presence>
      </Portal>

      {showExplorer && <WhichKeyExplorer />}
    </>
  );
}

export { isGroupNode };
