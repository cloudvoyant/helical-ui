// libs/helical-react/src/which-key/WhichKey.tsx

// 1. Imports
import { useEffect, useRef } from 'react';
import { Portal } from '@ark-ui/react/portal';
import { Presence } from '@ark-ui/react/presence';
import { ChevronRight } from 'lucide-react';
import {
  cn,
  formatWhichKeyLabel,
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
  whichKeyTitleBase,
  whichKeyVariants,
  type KbdHotkey,
  type WhichKeyProps as CoreWhichKeyProps,
} from '@cloudvoyant/helical-ui';
import { Kbd } from '../kbd';
import { Row } from '../row';
import { Scroll } from '../scroll';
import { useOptionalWhichKeyController, useWhichKey } from './context';
import { WhichKeyExplorer } from './WhichKeyExplorer';

// 2. Module constants & types
export type WhichKeyProps = CoreWhichKeyProps;

// 3. Local helpers / inner components
function WhichKeyInner({
  variant = 'helix',
  leaderOnly: leaderOnlyProp,
  showExplorer = true,
  className,
}: WhichKeyProps) {
  // --- State ---
  const {
    mode,
    leaderKey,
    leaderOnly: controllerLeaderOnly,
    activePath,
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

  const effectiveLeaderOnly = leaderOnlyProp ?? controllerLeaderOnly;
  const effectiveOpen =
    leaderOnlyProp !== undefined
      ? activePath.length > 0 && items.length > 0 && (!leaderOnlyProp || activePath[0] === leaderKey)
      : isOpen;

  const panelRef = useRef<HTMLDivElement | null>(null);
  const jumpOverlayRef = useRef<HTMLDivElement | null>(null);

  // --- Effects ---
  useEffect(() => {
    if (!effectiveOpen) return;
    return controller.trackBranchElement(() => panelRef.current);
  }, [controller, effectiveOpen]);

  useEffect(() => {
    if (mode !== 'jump') return;
    return controller.trackBranchElement(() => jumpOverlayRef.current);
  }, [controller, mode]);

  // --- Render ---
  return (
    <>
      <Portal>
        <Presence present={effectiveOpen} lazyMount unmountOnExit>
          <div
            ref={panelRef}
            role="region"
            aria-label={title || 'WhichKey commands'}
            data-which-key-root="true"
            data-testid="which-key-panel"
            data-variant={variant}
            data-leader-only={effectiveLeaderOnly ? 'true' : 'false'}
            data-sticky={sticky ? 'true' : 'false'}
            className={cn(whichKeyVariants({ variant }), className)}
          >
            <div className={whichKeyHeaderBase}>
              <div className={whichKeyTitleBase}>
                <span data-testid="which-key-title">
                  {title === 'Space' ? 'Leader' : formatWhichKeyLabel(title)}
                </span>
                <div
                  data-testid="which-key-breadcrumb"
                  className={whichKeyBreadcrumbBase}
                >
                  <span>{breadcrumb.join(' » ')}</span>
                </div>
                {countBuffer && (
                  <span
                    data-testid="which-key-count"
                    className="rounded bg-muted px-1 font-mono text-[10px]"
                  >
                    {countBuffer}×
                  </span>
                )}
              </div>
              <Row className="shrink-0 items-center gap-1.5 text-muted-foreground">
                {breadcrumb.length > 1 && (
                  <button
                    type="button"
                    aria-label="Back"
                    onClick={() => stepBackPrefix()}
                    className="inline-flex items-center gap-1 hover:text-foreground"
                  >
                    <Kbd size="sm">⌫</Kbd>
                  </button>
                )}
                <button
                  type="button"
                  aria-label="Close"
                  data-testid="which-key-close"
                  onClick={() => closePrefix()}
                  className="inline-flex items-center gap-1 hover:text-foreground"
                >
                  <Kbd size="sm">Esc</Kbd>
                </button>
              </Row>
            </div>

            <Scroll
              className="max-h-72"
              viewportClassName="scroll-fade scroll-fade-12 no-scrollbar max-h-72"
            >
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
                        <span className="truncate">{formatWhichKeyLabel(node.label)}</span>
                        {isGroup && (
                          <ChevronRight
                            className="size-3.5 shrink-0"
                            aria-hidden="true"
                          />
                        )}
                      </span>
                      <Kbd
                        size="sm"
                        variant={isGroup ? 'subtle' : 'outline'}
                        hotkey={node.key as KbdHotkey}
                      />
                    </button>
                  );
                })}
              </div>
            </Scroll>

            <div
              data-testid="which-key-footer"
              className={whichKeyFooterBase}
              aria-hidden="true"
            />
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

// 4. Exported component
export function WhichKey(props: WhichKeyProps) {
  // --- State ---
  const controller = useOptionalWhichKeyController();

  // --- Render ---
  if (!controller) return null;
  return <WhichKeyInner {...props} />;
}

export { isGroupNode };
