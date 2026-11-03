// libs/helical-ui/src/which-key/controller.ts
// Framework-neutral modal keybinding controller wrapping @tanstack/hotkeys and @zag-js/* primitives.
import { isModifierKey, normalizeKeyName, parseKeyboardEvent } from '@tanstack/hotkeys';
import { trackDismissableBranch } from '@zag-js/dismissable';
import { getFirstFocusable, getFocusables, isEditableElement, isInView } from '@zag-js/dom-query';
import { setInteractionModality, trackInteractionModality } from '@zag-js/focus-visible';
import { createLiveRegion, type LiveRegion } from '@zag-js/live-region';
import {
  buildWhichKeyTree,
  createJumplist,
  DEFAULT_JUMP_ALPHABET,
  findDirectionalPane,
  flattenKeymapEntries,
  generateJumpLabels,
  getNodeChildren,
  isGroupNode,
  nodeMatchesMode,
  resolveNode,
} from './core';
import { getPresetKeymap } from './presets';
import {
  getModalEditor,
  notifyAllModalEditors,
  type JumpAction,
  type JumpTarget,
  type KeybindingPreset,
  type KeymapCommandContext,
  type KeymapExplorerEntry,
  type KeymapHandler,
  type KeymapMode,
  type ModalMotion,
  type ModalOperator,
  type ModalSelectionTransform,
  type ModalTextObjectSpec,
  type PaneDirection,
  type PaneRect,
  type PaneRegistration,
  type WhichKeyController,
  type WhichKeyControllerOptions,
  type WhichKeyNode,
  type WhichKeyState,
} from './types';

interface RegisteredKeymapLayer {
  id: string;
  nodes: Record<string, WhichKeyNode>;
  scope?: string;
  enabled: boolean;
}

function mergeKeymapTrees(
  base: Record<string, WhichKeyNode>,
  overlay: Record<string, WhichKeyNode>,
): Record<string, WhichKeyNode> {
  const result: Record<string, WhichKeyNode> = { ...base };
  for (const [key, node] of Object.entries(overlay)) {
    const existing = result[key];
    if (existing && existing.children && node.children) {
      result[key] = {
        ...existing,
        ...node,
        children: mergeKeymapTrees(existing.children, node.children),
      };
    } else {
      result[key] = node;
    }
  }
  return result;
}

function isElementLike(value: unknown): value is Element {
  if (!value || typeof value !== 'object') return false;
  if (typeof Element !== 'undefined' && value instanceof Element) return true;
  return 'parentElement' in value || 'tagName' in value;
}

function isHTMLElementLike(value: unknown): value is HTMLElement {
  if (!value || typeof value !== 'object') return false;
  if (typeof HTMLElement !== 'undefined' && value instanceof HTMLElement) {
    return true;
  }
  return 'parentElement' in value || 'tagName' in value;
}

function isTextEntryElement(el: Element | null): boolean {
  if (!el || !isHTMLElementLike(el)) return false;
  if (el.closest?.('[data-modal-ignore-pointer]')) return false;
  const tag = typeof el.tagName === 'string' ? el.tagName.toLowerCase() : '';
  if (getModalEditor(el)) {
    const nonEditableIsland = el.closest?.('[contenteditable="false"]');
    if (nonEditableIsland) {
      return tag === 'input' || tag === 'textarea';
    }
    return true;
  }
  if (el.isContentEditable || el.getAttribute?.('contenteditable') === 'true') {
    return true;
  }
  if (tag === 'textarea') {
    return !(el as HTMLTextAreaElement).disabled && !(el as HTMLTextAreaElement).readOnly;
  }
  if (tag === 'input') {
    const input = el as HTMLInputElement;
    if (input.disabled || input.readOnly) return false;
    const nonTextTypes = new Set([
      'button',
      'checkbox',
      'color',
      'file',
      'hidden',
      'image',
      'radio',
      'range',
      'reset',
      'submit',
    ]);
    return !nonTextTypes.has((input.type || 'text').toLowerCase());
  }
  try {
    return isEditableElement(el);
  } catch {
    return false;
  }
}

export function eventToChordKeys(event: KeyboardEvent): string[] {
  const rawKey = event.key;
  if (!rawKey) return [];
  const normalizedName = normalizeKeyName(rawKey);
  if (
    isModifierKey(normalizedName) ||
    rawKey === 'Shift' ||
    rawKey === 'Control' ||
    rawKey === 'Alt' ||
    rawKey === 'Meta'
  ) {
    return [];
  }

  const hasCtrl = event.ctrlKey;
  const hasAlt = event.altKey;
  const hasMeta = event.metaKey;
  const hasShift = event.shiftKey;

  const baseKey = rawKey === ' ' || event.code === 'Space' ? 'Space' : rawKey;

  // When Control, Alt, or Meta is held, produce canonical modifier chord(s)
  if (hasCtrl || hasAlt || hasMeta) {
    const mods: string[] = [];
    if (hasCtrl) mods.push('Control');
    if (hasAlt) mods.push('Alt');
    if (hasShift && baseKey.length > 1) mods.push('Shift');
    if (hasMeta) mods.push('Meta');

    const candidates: string[] = [];
    const primaryKey = baseKey.length === 1 ? baseKey : normalizedName;
    candidates.push([...mods, primaryKey].join('+'));
    if (baseKey.length === 1 && baseKey.toLowerCase() !== baseKey) {
      candidates.push([...mods, baseKey.toLowerCase()].join('+'));
    }
    try {
      const parsed = parseKeyboardEvent(event);
      if (parsed?.key) {
        const parsedMods: string[] = [];
        if (parsed.ctrl) parsedMods.push('Control');
        if (parsed.alt) parsedMods.push('Alt');
        if (parsed.shift) parsedMods.push('Shift');
        if (parsed.meta) parsedMods.push('Meta');
        const fromTanstack = [...parsedMods, parsed.key].join('+');
        if (!candidates.includes(fromTanstack)) {
          candidates.push(fromTanstack);
        }
      }
    } catch {
      // Fallback to direct candidates above
    }
    return candidates;
  }

  // No Ctrl/Alt/Meta: preserve exact case for single characters ('g' vs 'G', 'z' vs 'Z', '?' etc.)
  const candidates: string[] = [baseKey];
  if (hasShift && baseKey.length === 1) {
    candidates.push(`Shift+${baseKey.toUpperCase()}`);
    candidates.push(`Shift+${baseKey}`);
  } else if (baseKey.length > 1 && normalizedName !== baseKey) {
    candidates.push(normalizedName);
  }
  return candidates;
}

function getTopMostModalDialog(doc: Document): HTMLElement | null {
  const dialogs = Array.from(
    doc.querySelectorAll<HTMLElement>(
      '[data-scope="dialog"][data-part="content"][data-state="open"], [role="dialog"][aria-modal="true"]:not([data-state="closed"]), [role="alertdialog"][aria-modal="true"]:not([data-state="closed"])',
    ),
  ).filter((el) => !el.hasAttribute('data-which-key-explorer'));

  if (dialogs.length === 0) return null;
  for (let i = dialogs.length - 1; i >= 0; i -= 1) {
    const candidate = dialogs[i]!;
    if (candidate.style.pointerEvents !== 'none') {
      return candidate;
    }
  }
  return dialogs[dialogs.length - 1] ?? null;
}

function getVisibleTreeItems(root: HTMLElement): HTMLElement[] {
  if (typeof root.querySelectorAll !== 'function') return [];
  const candidates = Array.from(
    root.querySelectorAll<HTMLElement>(
      '[data-part="branch-control"]:not([disabled]):not([data-disabled]):not([aria-disabled="true"]), ' +
        '[role="treeitem"]:not([disabled]):not([data-disabled]):not([aria-disabled="true"]), ' +
        '[data-which-key-target]:not([disabled]):not([data-disabled]):not([aria-disabled="true"])',
    ),
  );
  return candidates.filter((el) => {
    // When a branch wrapper ([data-part="branch"][role="treeitem"]) has an inner [data-part="branch-control"],
    // target the branch-control row rather than the outer branch wrapper.
    if (
      el.getAttribute('role') === 'treeitem' &&
      el.getAttribute('data-part') === 'branch' &&
      el.querySelector('[data-part="branch-control"]')
    ) {
      return false;
    }
    if (el.closest('[hidden], [data-part="branch-content"][data-state="closed"]')) {
      return false;
    }
    const closedBranch = el.closest('[role="treeitem"][aria-expanded="false"]');
    if (closedBranch && closedBranch !== el) {
      const isControlForClosedBranch =
        el.getAttribute('data-part') === 'branch-control' && el.closest('[data-part="branch"]') === closedBranch;
      if (!isControlForClosedBranch) {
        return false;
      }
    }
    return true;
  });
}

function mergeElementsInDomOrder(lists: HTMLElement[][]): HTMLElement[] {
  const seen = new Set<HTMLElement>();
  const combined: HTMLElement[] = [];
  for (const list of lists) {
    for (const el of list) {
      if (el instanceof HTMLElement && !seen.has(el)) {
        seen.add(el);
        combined.push(el);
      }
    }
  }
  if (combined.length > 1 && typeof combined[0]!.compareDocumentPosition === 'function') {
    combined.sort((a, b) => {
      if (a === b) return 0;
      const pos = a.compareDocumentPosition(b);
      if (pos & 4) return -1;
      if (pos & 2) return 1;
      return 0;
    });
  }
  return combined;
}

function getPaneFocusableItems(container: HTMLElement, ownScope?: HTMLElement | null): HTMLElement[] {
  const doc = container.ownerDocument;
  const activeEl = doc?.activeElement instanceof HTMLElement ? doc.activeElement : null;
  const enteredExample =
    !ownScope && activeEl && !activeEl.hasAttribute('data-example')
      ? activeEl.closest<HTMLElement>('[data-example]')
      : null;
  const searchRoot =
    enteredExample && container.contains(enteredExample)
      ? (enteredExample.querySelector<HTMLElement>('[data-example-preview]') ?? enteredExample)
      : container;

  const raw = mergeElementsInDomOrder([
    getFocusables(searchRoot, { includeContainer: false }) as HTMLElement[],
    getVisibleTreeItems(searchRoot),
  ]);
  return raw.filter((el) => {
    if (!(el instanceof HTMLElement)) return false;
    if (el.closest('[data-which-key-root], [data-which-key-explorer], [data-which-key-jump-overlay]')) {
      return false;
    }
    const fwEl = el.closest('[data-fw]');
    const activeFw = doc?.documentElement?.getAttribute('data-framework');
    if (fwEl && activeFw && fwEl.getAttribute('data-fw') !== activeFw) {
      return false;
    }
    if (!ownScope) {
      if (!enteredExample) {
        const parentExample = el.parentElement?.closest('[data-example]');
        if (parentExample) return false;
      }
      const nestedScope = el.closest('[data-which-key-scope]');
      if (nestedScope) return false;
    }
    if (el.getAttribute('aria-hidden') === 'true' || el.hasAttribute('inert')) {
      return false;
    }
    return true;
  });
}

function getJumpableItems(container: HTMLElement, ownScope?: HTMLElement | null): HTMLElement[] {
  const doc = container.ownerDocument;
  const rawFocusables = getFocusables(container, { includeContainer: false }) as HTMLElement[];
  const rawTabs = Array.from(
    container.querySelectorAll<HTMLElement>(
      '[role="tab"]:not([disabled]):not([data-disabled]):not([aria-disabled="true"])',
    ),
  );
  const rawTreeItems = getVisibleTreeItems(container);
  const merged = mergeElementsInDomOrder([rawFocusables, rawTabs, rawTreeItems]);
  const combined: HTMLElement[] = [];
  for (const el of merged) {
    if (!(el instanceof HTMLElement)) continue;
    if (el.closest('[data-which-key-root], [data-which-key-explorer], [data-which-key-jump-overlay]')) {
      continue;
    }
    const fwEl = el.closest('[data-fw]');
    const activeFw = doc?.documentElement?.getAttribute('data-framework');
    if (fwEl && activeFw && fwEl.getAttribute('data-fw') !== activeFw) {
      continue;
    }
    if (!ownScope) {
      const nestedScope = el.closest('[data-which-key-scope]');
      if (nestedScope) continue;
    }
    if (el.getAttribute('aria-hidden') === 'true' || el.hasAttribute('inert')) {
      continue;
    }
    combined.push(el);
  }
  return combined;
}

interface AttachedControllerEntry {
  getScopeElement: () => HTMLElement | null;
  isBusy: () => boolean;
}

const globalWhichKeyState = globalThis as typeof globalThis & {
  __helicalAttachedEntriesByDoc__?: WeakMap<Document, Set<AttachedControllerEntry>>;
  __helicalLastInteractedScopeByDoc__?: WeakMap<Document, HTMLElement | null>;
  __helicalRootControllerByDoc__?: WeakMap<Document, WhichKeyController>;
  __helicalRootControllerListenersByDoc__?: WeakMap<Document, Set<() => void>>;
};

const attachedEntriesByDoc = (globalWhichKeyState.__helicalAttachedEntriesByDoc__ ??= new WeakMap<
  Document,
  Set<AttachedControllerEntry>
>());
const lastInteractedScopeByDoc = (globalWhichKeyState.__helicalLastInteractedScopeByDoc__ ??= new WeakMap<
  Document,
  HTMLElement | null
>());
const rootControllerByDoc = (globalWhichKeyState.__helicalRootControllerByDoc__ ??= new WeakMap<
  Document,
  WhichKeyController
>());
const rootControllerListenersByDoc = (globalWhichKeyState.__helicalRootControllerListenersByDoc__ ??= new WeakMap<
  Document,
  Set<() => void>
>());

function notifyRootControllerListeners(doc: Document): void {
  const set = rootControllerListenersByDoc.get(doc);
  if (!set) return;
  for (const fn of set) {
    fn();
  }
}

export function getDocumentWhichKeyController(doc?: Document): WhichKeyController | null {
  const resolved = doc ?? (typeof document !== 'undefined' ? document : undefined);
  if (!resolved) return null;
  return rootControllerByDoc.get(resolved) ?? null;
}

export function subscribeDocumentWhichKeyController(doc: Document | undefined, listener: () => void): () => void {
  const resolved = doc ?? (typeof document !== 'undefined' ? document : undefined);
  if (!resolved) return () => {};
  let set = rootControllerListenersByDoc.get(resolved);
  if (!set) {
    set = new Set();
    rootControllerListenersByDoc.set(resolved, set);
  }
  set.add(listener);
  return () => {
    set?.delete(listener);
  };
}

function isScopeElementActive(scopeEl: HTMLElement | null, doc: Document): boolean {
  if (!scopeEl) return true;
  if (!scopeEl.isConnected) return false;
  const fwEl = scopeEl.closest?.('[data-fw]');
  const activeFw = doc.documentElement?.getAttribute('data-framework');
  if (fwEl && activeFw && fwEl.getAttribute('data-fw') !== activeFw) {
    return false;
  }
  return true;
}

function shouldEntryHandleEvent(entry: AttachedControllerEntry, doc: Document): boolean {
  const ownScope = entry.getScopeElement();
  if (!isScopeElementActive(ownScope, doc)) {
    return false;
  }

  const allEntries = attachedEntriesByDoc.get(doc);
  if (!allEntries || allEntries.size <= 1) {
    return true;
  }

  const visibleEntries = Array.from(allEntries).filter((e) => isScopeElementActive(e.getScopeElement(), doc));
  if (visibleEntries.length <= 1) {
    return visibleEntries[0] === entry;
  }

  const busyEntry = visibleEntries.find((e) => e.isBusy());
  if (busyEntry) {
    return busyEntry === entry;
  }

  const activeEl =
    doc.activeElement &&
    doc.activeElement !== doc.body &&
    doc.activeElement !== doc.documentElement &&
    isElementLike(doc.activeElement)
      ? doc.activeElement
      : null;

  const focusedScope = activeEl ? ((activeEl.closest?.('[data-which-key-scope]') as HTMLElement | null) ?? null) : null;

  const rememberedScope = lastInteractedScopeByDoc.get(doc) ?? null;

  const targetScope =
    focusedScope && isScopeElementActive(focusedScope, doc)
      ? focusedScope
      : rememberedScope && isScopeElementActive(rememberedScope, doc)
        ? rememberedScope
        : null;

  if (targetScope) {
    const scopedMatch = visibleEntries.find((e) => e.getScopeElement() === targetScope);
    if (scopedMatch) {
      return scopedMatch === entry;
    }
  }

  const rootEntry = visibleEntries.find((e) => e.getScopeElement() === null);
  if (rootEntry) {
    return rootEntry === entry;
  }

  return visibleEntries[0] === entry;
}

export function createWhichKeyController(options: WhichKeyControllerOptions = {}): WhichKeyController {
  const storageKey = options.storageKey;

  function isMobileViewport(): boolean {
    if (options.disableOnMobile === false) return false;
    const doc = resolveDoc();
    const win = doc?.defaultView ?? (typeof window !== 'undefined' ? window : null);
    if (!win || typeof win.matchMedia !== 'function') return false;
    try {
      return (
        win.matchMedia('(pointer: coarse) and (hover: none)').matches ||
        win.matchMedia('(max-width: 767px) and (pointer: coarse)').matches
      );
    } catch {
      return false;
    }
  }

  function isControllerEnabled(): boolean {
    if (options.enabled === false) return false;
    if (isMobileViewport()) return false;
    return true;
  }

  function readStoredPreset(): KeybindingPreset | null {
    if (!storageKey || typeof window === 'undefined') return null;
    try {
      const raw = window.localStorage.getItem(`${storageKey}:keymap-preset`);
      if (raw === 'helix' || raw === 'vim' || raw === 'kakoune') return raw;
    } catch {
      // Ignore storage errors
    }
    return null;
  }

  function writeStoredPreset(next: KeybindingPreset): void {
    const doc = resolveDoc();
    if (doc?.documentElement && !options.getScopeElement?.()) {
      doc.documentElement.dataset.keymapPreset = next;
    }
    if (!storageKey || typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(`${storageKey}:keymap-preset`, next);
    } catch {
      // Ignore storage errors
    }
  }

  function readStoredJumpAction(): JumpAction | null {
    if (!storageKey || typeof window === 'undefined') return null;
    try {
      const raw = window.localStorage.getItem(`${storageKey}:jump-action`);
      if (raw === 'activate' || raw === 'focus') return raw;
    } catch {
      // Ignore storage errors
    }
    return null;
  }

  function writeStoredJumpAction(next: JumpAction): void {
    const doc = resolveDoc();
    if (doc?.documentElement && !options.getScopeElement?.()) {
      doc.documentElement.dataset.jumpAction = next;
    }
    if (!storageKey || typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(`${storageKey}:jump-action`, next);
    } catch {
      // Ignore storage errors
    }
  }

  let preset: KeybindingPreset = options.preset ?? readStoredPreset() ?? 'helix';
  let mode: KeymapMode = options.defaultMode ?? 'normal';
  const leaderKey = options.leaderKey ?? 'Space';
  let jumpAction: JumpAction = options.jumpAction ?? readStoredJumpAction() ?? 'activate';
  const jumpAlphabet = options.jumpAlphabet ?? DEFAULT_JUMP_ALPHABET;

  const listeners = new Set<(state: WhichKeyState) => void>();
  const keymapLayers = new Map<string, RegisteredKeymapLayer>();
  const commandHandlers = new Map<string, KeymapHandler>();
  const panes = new Map<string, PaneRegistration>();
  const jumplist = createJumplist(50);

  if (options.keymap) {
    keymapLayers.set('__initial__', {
      id: '__initial__',
      nodes: options.keymap,
      enabled: true,
    });
  }

  if (options.commands) {
    for (const [cmdId, handler] of Object.entries(options.commands)) {
      commandHandlers.set(cmdId, handler);
    }
  }

  let activePath: string[] = [];
  let sticky = false;
  let countBuffer = '';
  let explorerOpen = false;
  let explorerQuery = '';
  let activePaneId: string | null = null;
  let jumpQuery = '';
  let rawJumpTargets: Array<{
    id: string;
    label: string;
    element: HTMLElement;
    rect: { top: number; left: number; width: number; height: number };
  }> = [];
  let statusMessage = '';
  let programmaticFocusDepth = 0;
  let liveRegion: LiveRegion | null = null;
  let detachCleanups: Array<() => void> = [];

  function resolveDoc(): Document | null {
    if (options.getDocument) {
      try {
        return options.getDocument();
      } catch {
        // Fallback below
      }
    }
    return typeof document !== 'undefined' ? document : null;
  }

  function announce(message: string): void {
    statusMessage = message;
    try {
      liveRegion?.announce(message);
    } catch {
      // Safe no-op in headless environments
    }
  }

  function buildMergedTrie(): Record<string, WhichKeyNode> {
    let trie = getPresetKeymap(preset, leaderKey);
    for (const layer of keymapLayers.values()) {
      if (!layer.enabled) continue;
      if (layer.scope && layer.scope !== activePaneId) continue;
      trie = mergeKeymapTrees(trie, layer.nodes);
    }
    return trie;
  }

  function syncPaneActiveAttributes(): void {
    for (const pane of panes.values()) {
      if (pane.element && typeof pane.element.setAttribute === 'function') {
        pane.element.setAttribute('data-pane-active', pane.id === activePaneId ? 'true' : 'false');
      }
    }
  }

  function syncDomPanes(docOverride?: Document | null): void {
    const doc = docOverride ?? resolveDoc();
    if (!doc || typeof doc.querySelectorAll !== 'function') return;
    const ownScope = options.getScopeElement?.() ?? null;
    const root = ownScope ?? doc.body;
    if (!root || typeof root.querySelectorAll !== 'function') return;

    const elements = Array.from(root.querySelectorAll<HTMLElement>('[data-pane-id]'));
    for (const el of elements) {
      if (!ownScope && el.closest('[data-which-key-scope]')) continue;
      const id = el.getAttribute('data-pane-id');
      if (!id) continue;
      const existing = panes.get(id);
      if (existing && existing.element === el) continue;

      const title = el.getAttribute('data-pane-title') || existing?.title || id;
      const orderAttr = el.getAttribute('data-pane-order');
      const parsedOrder = orderAttr ? Number.parseInt(orderAttr, 10) : Number.NaN;
      const order = !Number.isNaN(parsedOrder) ? parsedOrder : (existing?.order ?? panes.size + 1);
      const disabled = el.getAttribute('data-pane-disabled') === 'true';

      panes.set(id, {
        id,
        title,
        element: el,
        disabled,
        order,
        lastFocusedElement: existing?.lastFocusedElement ?? null,
      });
      if (!activePaneId && !disabled) {
        activePaneId = id;
      }
    }
    syncPaneActiveAttributes();
  }

  function getOrderedPanes(): PaneRegistration[] {
    return Array.from(panes.values())
      .filter((p) => !p.disabled)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  function computeFilteredJumpTargets(): JumpTarget[] {
    if (mode !== 'jump') return [];
    return rawJumpTargets
      .filter((t) => t.label.startsWith(jumpQuery))
      .map((t) => ({
        ...t,
        matchedPrefix: jumpQuery,
        remainingLabel: t.label.slice(jumpQuery.length),
      }));
  }

  function computeState(): WhichKeyState {
    const rootTrie = buildMergedTrie();
    const effectiveMode: KeymapMode = mode === 'jump' ? 'normal' : mode;
    const tree = buildWhichKeyTree(rootTrie, activePath, effectiveMode);
    const allEntries = flattenKeymapEntries(rootTrie);
    const q = explorerQuery.trim().toLowerCase();
    const filteredEntries = q
      ? allEntries.filter(
          (entry) =>
            entry.label.toLowerCase().includes(q) ||
            (entry.description?.toLowerCase().includes(q) ?? false) ||
            entry.group.toLowerCase().includes(q) ||
            entry.sequenceText.toLowerCase().includes(q),
        )
      : allEntries;

    return {
      preset,
      mode,
      leaderKey,
      activePath: [...activePath],
      breadcrumb: tree.breadcrumb,
      title: tree.title,
      items: tree.items,
      isOpen: activePath.length > 0 && tree.items.length > 0,
      sticky: sticky || tree.sticky,
      countBuffer,
      explorerOpen,
      explorerQuery,
      explorerEntries: filteredEntries,
      activePaneId,
      panes: getOrderedPanes(),
      jumpQuery,
      jumpAction,
      jumpTargets: computeFilteredJumpTargets(),
      statusMessage,
    };
  }

  let cachedState: WhichKeyState = computeState();

  function emit(): void {
    syncPaneActiveAttributes();
    cachedState = computeState();
    for (const listener of listeners) {
      listener(cachedState);
    }
  }

  function runProgrammaticFocus(fn: () => void): void {
    programmaticFocusDepth += 1;
    try {
      setInteractionModality('keyboard');
    } catch {
      // Ignore if focus-visible not attached yet
    }
    try {
      fn();
    } finally {
      programmaticFocusDepth = Math.max(0, programmaticFocusDepth - 1);
    }
  }

  function getActiveContainer(): HTMLElement | null {
    const doc = resolveDoc();
    if (!doc) return null;
    const topModal = getTopMostModalDialog(doc);
    if (topModal) return topModal;

    if (activePaneId) {
      const activePane = panes.get(activePaneId);
      if (activePane?.element) return activePane.element;
    }

    const firstPane = getOrderedPanes().find((p) => p.element);
    if (firstPane?.element) {
      activePaneId = firstPane.id;
      return firstPane.element;
    }

    return options.getScopeElement?.() ?? doc.body;
  }

  function recordCurrentLocation(): void {
    const doc = resolveDoc();
    const activeEl = (doc?.activeElement as HTMLElement | null) ?? null;
    const paneId = activePaneId ?? getOrderedPanes()[0]?.id ?? 'root';
    jumplist.push({
      paneId,
      element: activeEl,
      scrollTop: getActiveContainer()?.scrollTop ?? 0,
    });
  }

  function setMode(nextMode: KeymapMode): void {
    if (mode === nextMode) return;
    mode = nextMode;
    if (nextMode !== 'jump') {
      jumpQuery = '';
      rawJumpTargets = [];
    }
    if (nextMode === 'insert') {
      activePath = [];
      sticky = false;
      countBuffer = '';
    }
    notifyAllModalEditors({ mode: nextMode, preset });
    options.onModeChange?.(nextMode);
    announce(`${nextMode.charAt(0).toUpperCase()}${nextMode.slice(1)} mode`);
    emit();
  }

  function setPreset(nextPreset: KeybindingPreset): void {
    if (preset === nextPreset) return;
    preset = nextPreset;
    activePath = [];
    sticky = false;
    countBuffer = '';
    writeStoredPreset(nextPreset);
    notifyAllModalEditors({ mode, preset: nextPreset });
    options.onPresetChange?.(nextPreset);
    announce(`Switched to ${nextPreset} preset`);
    emit();
  }

  function setJumpAction(action: JumpAction): void {
    if (jumpAction === action) return;
    jumpAction = action;
    writeStoredJumpAction(action);
    options.onJumpActionChange?.(action);
    emit();
  }

  function openPrefix(path: string[], opts?: { sticky?: boolean }): void {
    activePath = [...path];
    sticky = Boolean(opts?.sticky);
    emit();
  }

  function closePrefix(): void {
    if (activePath.length === 0 && !sticky && !countBuffer) return;
    activePath = [];
    sticky = false;
    countBuffer = '';
    emit();
  }

  function stepBackPrefix(): boolean {
    if (activePath.length === 0) return false;
    activePath = activePath.slice(0, -1);
    if (activePath.length === 0) {
      sticky = false;
    }
    emit();
    return true;
  }

  function openExplorer(): void {
    activePath = [];
    sticky = false;
    countBuffer = '';
    explorerQuery = '';
    explorerOpen = true;
    announce('Keybinding explorer opened');
    emit();
  }

  function closeExplorer(): void {
    if (!explorerOpen) return;
    explorerOpen = false;
    explorerQuery = '';
    emit();
  }

  function setExplorerQuery(query: string): void {
    explorerQuery = query;
    emit();
  }

  function enterExampleContainer(exampleEl: HTMLElement): boolean {
    const doc = resolveDoc();
    const activeFw = doc?.documentElement?.getAttribute('data-framework');
    const preview = exampleEl.querySelector<HTMLElement>('[data-example-preview]') ?? exampleEl;

    const scopes = Array.from(preview.querySelectorAll<HTMLElement>('[data-which-key-scope]'));
    const activeScope = doc ? (scopes.find((s) => isScopeElementActive(s, doc)) ?? null) : null;
    if (activeScope && doc) {
      lastInteractedScopeByDoc.set(doc, activeScope);
      const scopeFocusables = getPaneFocusableItems(activeScope, activeScope);
      const target = scopeFocusables[0] ?? preview;
      recordCurrentLocation();
      focusElementInActivePane(target);
      announce('Entered example preview');
      emit();
      return true;
    }

    const rawFocusables = getFocusables(preview, { includeContainer: false }).filter((el) => {
      if (!(el instanceof HTMLElement)) return false;
      const fwEl = el.closest('[data-fw]');
      if (fwEl && activeFw && fwEl.getAttribute('data-fw') !== activeFw) return false;
      if (el.getAttribute('aria-hidden') === 'true' || el.hasAttribute('inert')) return false;
      return true;
    });

    if (rawFocusables.length > 0) {
      recordCurrentLocation();
      focusElementInActivePane(rawFocusables[0]!);
      announce('Entered example preview');
      emit();
      return true;
    }

    const codeToggle = exampleEl.querySelector<HTMLButtonElement>('[data-example-toggle]');
    if (codeToggle) {
      codeToggle.click();
      announce('Toggled example code');
      return true;
    }
    return false;
  }

  function focusElementInActivePane(target: HTMLElement): void {
    runProgrammaticFocus(() => {
      target.focus({ preventScroll: true });
      if (typeof target.scrollIntoView === 'function') {
        try {
          target.scrollIntoView({
            block: 'nearest',
            inline: 'nearest',
            behavior: 'instant' as ScrollBehavior,
          });
        } catch {
          // Ignore in JSDOM/Node
        }
      }
    });
    if (activePaneId) {
      const pane = panes.get(activePaneId);
      if (pane) {
        pane.lastFocusedElement = target;
      }
    }
  }

  function stepFocusInPane(delta: number): boolean {
    const container = getActiveContainer();
    if (!container) return false;
    const items = getPaneFocusableItems(container, options.getScopeElement?.());
    if (items.length === 0) return false;

    const doc = resolveDoc();
    const activeEl = doc?.activeElement as HTMLElement | null;
    const currentIndex = activeEl ? items.indexOf(activeEl) : -1;

    let nextIndex = 0;
    if (currentIndex === -1) {
      const activePane = activePaneId ? panes.get(activePaneId) : undefined;
      if (activePane?.lastFocusedElement) {
        const rememberedIdx = items.indexOf(activePane.lastFocusedElement);
        if (rememberedIdx !== -1) {
          nextIndex =
            delta > 0 ? Math.min(items.length - 1, rememberedIdx + delta) : Math.max(0, rememberedIdx + delta);
        } else {
          nextIndex = delta >= 0 ? 0 : items.length - 1;
        }
      } else {
        nextIndex = delta >= 0 ? 0 : items.length - 1;
      }
    } else {
      nextIndex = Math.max(0, Math.min(items.length - 1, currentIndex + delta));
    }

    const target = items[nextIndex];
    if (!target) return false;
    focusElementInActivePane(target);
    emit();
    return true;
  }

  function isScrollableContainer(el: HTMLElement, doc: Document | null): boolean {
    if (!doc || el === doc.body || el === doc.documentElement) return false;
    if (el.scrollHeight <= el.clientHeight + 2) return false;
    const win = doc.defaultView;
    if (!win || typeof win.getComputedStyle !== 'function') return true;
    const overflowY = win.getComputedStyle(el).overflowY;
    return overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay';
  }

  function jumpToBoundary(boundary: 'start' | 'end' | 'first-in-group' | 'last-in-group'): boolean {
    const container = getActiveContainer();
    if (!container) return false;
    const items = getPaneFocusableItems(container, options.getScopeElement?.());
    if (items.length === 0) return false;

    const doc = resolveDoc();
    const win = doc?.defaultView ?? null;
    recordCurrentLocation();

    if (boundary === 'start' || boundary === 'first-in-group') {
      const target = items[0]!;
      focusElementInActivePane(target);
      if (boundary === 'start') {
        container.scrollTop = 0;
        if (win && !isScrollableContainer(container, doc)) {
          try {
            win.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
          } catch {
            win.scrollTo(0, 0);
          }
        }
      }
      recordCurrentLocation();
      emit();
      return true;
    }

    const target = items[items.length - 1]!;
    focusElementInActivePane(target);
    if (boundary === 'end') {
      container.scrollTop = container.scrollHeight;
      if (win && !isScrollableContainer(container, doc)) {
        const scrollMax = Math.max(
          doc?.documentElement?.scrollHeight ?? 0,
          doc?.body?.scrollHeight ?? 0,
          container.scrollHeight,
        );
        try {
          win.scrollTo({ top: scrollMax, behavior: 'instant' as ScrollBehavior });
        } catch {
          win.scrollTo(0, scrollMax);
        }
      }
    }
    recordCurrentLocation();
    emit();
    return true;
  }

  function scrollActivePane(action: 'center' | 'top' | 'bottom' | 'down' | 'up', count = 1): boolean {
    const container = getActiveContainer();
    if (!container) return false;
    const doc = resolveDoc();
    const activeEl = doc?.activeElement as HTMLElement | null;

    if (action === 'center' && activeEl && typeof activeEl.scrollIntoView === 'function') {
      try {
        activeEl.scrollIntoView({ block: 'center', behavior: 'instant' as ScrollBehavior });
      } catch {
        // Ignore in headless test
      }
      return true;
    }
    if (action === 'top' && activeEl && typeof activeEl.scrollIntoView === 'function') {
      try {
        activeEl.scrollIntoView({ block: 'start', behavior: 'instant' as ScrollBehavior });
      } catch {
        // Ignore
      }
      return true;
    }
    if (action === 'bottom' && activeEl && typeof activeEl.scrollIntoView === 'function') {
      try {
        activeEl.scrollIntoView({ block: 'end', behavior: 'instant' as ScrollBehavior });
      } catch {
        // Ignore
      }
      return true;
    }

    const stepPx = 120 * Math.max(1, count);
    const deltaY = action === 'down' ? stepPx : action === 'up' ? -stepPx : 0;
    if (deltaY !== 0) {
      if (typeof container.scrollBy === 'function') {
        container.scrollBy({ top: deltaY, behavior: 'instant' as ScrollBehavior });
      } else {
        container.scrollTop += deltaY;
      }
      return true;
    }
    return false;
  }

  function focusPane(paneIdOrIndex: string | number): boolean {
    const ordered = getOrderedPanes();
    if (ordered.length === 0) return false;

    let targetPane: PaneRegistration | undefined;
    if (typeof paneIdOrIndex === 'number') {
      targetPane = ordered[paneIdOrIndex - 1];
    } else {
      targetPane = panes.get(paneIdOrIndex);
      if (!targetPane || targetPane.disabled) {
        const numeric = Number.parseInt(paneIdOrIndex, 10);
        if (!Number.isNaN(numeric) && numeric >= 1) {
          targetPane = ordered[numeric - 1];
        }
      }
    }

    if (!targetPane || !targetPane.element) return false;

    recordCurrentLocation();
    activePaneId = targetPane.id;

    const ownScope = options.getScopeElement?.() ?? null;
    const hasTree =
      typeof targetPane.element.querySelector === 'function' &&
      Boolean(targetPane.element.querySelector('[role="tree"]'));
    const remembered =
      targetPane.lastFocusedElement &&
      targetPane.element.contains(targetPane.lastFocusedElement) &&
      (!hasTree || Boolean(targetPane.lastFocusedElement.closest('[role="tree"]'))) &&
      (ownScope || !targetPane.lastFocusedElement.closest('[data-which-key-scope]'))
        ? targetPane.lastFocusedElement
        : null;

    const preferredTarget =
      !remembered && typeof targetPane.element.querySelector === 'function'
        ? (targetPane.element.querySelector<HTMLElement>(
            '[data-pane-focus-target]:not([disabled]):not([data-disabled]):not([aria-disabled="true"]), ' +
              '[role="treeitem"][aria-selected="true"]:not([data-part="branch"]):not([disabled]):not([data-disabled]):not([aria-disabled="true"]), ' +
              '[data-part="branch"][aria-selected="true"] > [data-part="branch-control"]:not([disabled]):not([data-disabled]):not([aria-disabled="true"]), ' +
              '[data-part="branch-control"][tabindex="0"]:not([disabled]):not([data-disabled]):not([aria-disabled="true"]), ' +
              '[role="treeitem"][tabindex="0"]:not([data-part="branch"]):not([disabled]):not([data-disabled]):not([aria-disabled="true"])',
          ) ??
          getVisibleTreeItems(targetPane.element)[0] ??
          targetPane.element.querySelector<HTMLElement>(
            '[data-modal-editor="true"], .ProseMirror[contenteditable="true"]',
          ))
        : null;

    const firstFocusable =
      remembered ?? preferredTarget ?? getPaneFocusableItems(targetPane.element, ownScope)[0] ?? null;

    if (firstFocusable instanceof HTMLElement) {
      focusElementInActivePane(firstFocusable);
    } else {
      runProgrammaticFocus(() => {
        if (targetPane!.element!.tabIndex < 0) {
          targetPane!.element!.tabIndex = -1;
        }
        targetPane!.element!.focus({ preventScroll: false });
      });
    }

    if (mode === 'insert') {
      mode = 'normal';
      notifyAllModalEditors({ mode: 'normal', preset });
    }

    recordCurrentLocation();
    announce(`Focused pane ${targetPane.title}`);
    emit();
    return true;
  }

  function focusPaneDirection(direction: PaneDirection): boolean {
    const ordered = getOrderedPanes().filter((p) => p.element);
    if (ordered.length === 0) return false;

    const currentPane = (activePaneId ? panes.get(activePaneId) : undefined) ?? ordered[0]!;
    if (!currentPane?.element) return false;

    const toRect = (p: PaneRegistration): PaneRect => {
      const r = p.element!.getBoundingClientRect();
      return {
        id: p.id,
        x: r.left,
        y: r.top,
        width: r.width || p.element!.offsetWidth || 100,
        height: r.height || p.element!.offsetHeight || 100,
        disabled: p.disabled,
        order: p.order,
      };
    };

    const originRect = toRect(currentPane);
    const candidateRects = ordered.map(toRect);
    const matched = findDirectionalPane(originRect, candidateRects, direction);
    if (matched) {
      return focusPane(matched.id);
    }

    // Fallback when bounding rects are zeroed (e.g. unlayouted DOM in unit tests): cycle by order
    if (originRect.x === 0 && originRect.y === 0 && ordered.length > 1) {
      return cyclePane(direction === 'left' || direction === 'up');
    }
    return false;
  }

  function cyclePane(reverse = false): boolean {
    const ordered = getOrderedPanes().filter((p) => p.element);
    if (ordered.length === 0) return false;

    const currentIndex = ordered.findIndex((p) => p.id === activePaneId);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + (reverse ? -1 : 1) + ordered.length) % ordered.length;
    const target = ordered[nextIndex];
    return target ? focusPane(target.id) : false;
  }

  function startJumpMode(customAction?: JumpAction): void {
    const doc = resolveDoc();
    if (!doc) return;
    if (customAction) {
      jumpAction = customAction;
    }

    const ownScope = options.getScopeElement?.() ?? null;
    const scopeRoot = getTopMostModalDialog(doc) ?? ownScope ?? doc.body;
    const allFocusable = getJumpableItems(scopeRoot, ownScope);
    const visible = allFocusable.filter((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return false;
      if (ownScope) {
        return true;
      }
      const intersectsViewport =
        rect.bottom > 0 &&
        rect.right > 0 &&
        rect.top < (doc.defaultView?.innerHeight ?? 1080) &&
        rect.left < (doc.defaultView?.innerWidth ?? 1920);
      try {
        return isInView(el, doc.defaultView ?? scopeRoot) || intersectsViewport;
      } catch {
        return intersectsViewport;
      }
    });

    if (visible.length === 0) return;

    const labels = generateJumpLabels(visible.length, jumpAlphabet);
    rawJumpTargets = visible.map((el, idx) => {
      const r = el.getBoundingClientRect();
      return {
        id: `jump-${idx}-${labels[idx]}`,
        label: labels[idx]!,
        element: el,
        rect: {
          top: r.top,
          left: r.left,
          width: r.width,
          height: r.height,
        },
      };
    });
    jumpQuery = '';
    activePath = [];
    sticky = false;
    countBuffer = '';
    mode = 'jump';
    announce(`Jump mode (${rawJumpTargets.length} targets)`);
    emit();
  }

  function cancelJumpMode(): void {
    if (mode !== 'jump') return;
    jumpQuery = '';
    rawJumpTargets = [];
    mode = 'normal';
    emit();
  }

  function jumpBack(): boolean {
    const doc = resolveDoc();
    const activeEl = (doc?.activeElement as HTMLElement | null) ?? null;
    const currentPaneId = activePaneId ?? getOrderedPanes()[0]?.id ?? 'root';
    const target = jumplist.back({
      paneId: currentPaneId,
      element: activeEl,
    });
    if (!target) return false;

    if (target.paneId && panes.has(target.paneId)) {
      activePaneId = target.paneId;
    }
    if (target.element && target.element.isConnected) {
      focusElementInActivePane(target.element);
    } else if (target.paneId) {
      focusPane(target.paneId);
    }
    emit();
    return true;
  }

  function jumpForward(): boolean {
    const target = jumplist.forward();
    if (!target) return false;

    if (target.paneId && panes.has(target.paneId)) {
      activePaneId = target.paneId;
    }
    if (target.element && target.element.isConnected) {
      focusElementInActivePane(target.element);
    } else if (target.paneId) {
      focusPane(target.paneId);
    }
    emit();
    return true;
  }

  function stepFocusVerticalInPane(delta: number): boolean {
    const container = getActiveContainer();
    if (!container) return false;
    const items = getPaneFocusableItems(container, options.getScopeElement?.());
    if (items.length === 0) return false;

    const doc = resolveDoc();
    const activeEl = doc?.activeElement as HTMLElement | null;
    const currentIndex = activeEl ? items.indexOf(activeEl) : -1;
    if (currentIndex === -1) {
      return stepFocusInPane(delta);
    }

    const initialRect = items[currentIndex]!.getBoundingClientRect();
    if (initialRect.width <= 0 || initialRect.height <= 0) {
      return stepFocusInPane(delta);
    }

    const initialCenterX = initialRect.left + initialRect.width / 2;
    const initialCenterY = initialRect.top + initialRect.height / 2;
    const rowTolerance = Math.max(8, initialRect.height * 0.5);

    const hasSiblingInSameRow = items.some((el, idx) => {
      if (idx === currentIndex) return false;
      const r = el.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return false;
      const cy = r.top + r.height / 2;
      const cx = r.left + r.width / 2;
      return Math.abs(cy - initialCenterY) <= rowTolerance && Math.abs(cx - initialCenterX) > 8;
    });

    if (!hasSiblingInSameRow) {
      return stepFocusInPane(delta);
    }

    const dir = delta >= 0 ? 1 : -1;
    const steps = Math.max(1, Math.abs(delta));
    let currentEl = items[currentIndex]!;

    for (let s = 0; s < steps; s += 1) {
      const curRect = currentEl.getBoundingClientRect();
      const curCenterY = curRect.top + curRect.height / 2;
      const curTol = Math.max(8, curRect.height * 0.5);

      const candidates = items
        .map((el) => {
          const r = el.getBoundingClientRect();
          return {
            el,
            cx: r.left + r.width / 2,
            cy: r.top + r.height / 2,
            h: r.height,
            w: r.width,
          };
        })
        .filter((c) => {
          if (c.w <= 0 || c.h <= 0) return false;
          return dir > 0 ? c.cy > curCenterY + curTol : c.cy < curCenterY - curTol;
        });

      if (candidates.length === 0) {
        if (s === 0) {
          return stepFocusInPane(delta);
        }
        break;
      }

      let closestRowY = candidates[0]!.cy;
      for (const c of candidates) {
        if (Math.abs(c.cy - curCenterY) < Math.abs(closestRowY - curCenterY)) {
          closestRowY = c.cy;
        }
      }

      const rowCandidates = candidates.filter((c) => Math.abs(c.cy - closestRowY) <= curTol);
      let best = rowCandidates[0]!;
      for (const c of rowCandidates) {
        if (Math.abs(c.cx - initialCenterX) < Math.abs(best.cx - initialCenterX)) {
          best = c;
        }
      }
      currentEl = best.el;
    }

    focusElementInActivePane(currentEl);
    emit();
    return true;
  }

  function isElementInActiveFramework(el: HTMLElement, doc: Document | null): boolean {
    const fwEl = el.closest('[data-fw]');
    const activeFw = doc?.documentElement?.getAttribute('data-framework');
    if (fwEl && activeFw && fwEl.getAttribute('data-fw') !== activeFw) {
      return false;
    }
    if (el.getAttribute('aria-hidden') === 'true' || el.hasAttribute('inert')) {
      return false;
    }
    return true;
  }

  function findActiveTablist(activeEl: HTMLElement | null, container: HTMLElement | null): HTMLElement | null {
    const doc = resolveDoc();
    if (activeEl) {
      const directTablist = activeEl.closest<HTMLElement>('[role="tablist"]');
      if (directTablist && isElementInActiveFramework(directTablist, doc)) {
        return directTablist;
      }
      const tabsScope = activeEl.closest<HTMLElement>('[data-scope="tabs"]');
      if (tabsScope) {
        const list = Array.from(tabsScope.querySelectorAll<HTMLElement>('[role="tablist"]')).find((el) =>
          isElementInActiveFramework(el, doc),
        );
        if (list) return list;
      }
      const tabPanel = activeEl.closest<HTMLElement>('[role="tabpanel"]');
      if (tabPanel?.parentElement) {
        const list = Array.from(tabPanel.parentElement.querySelectorAll<HTMLElement>('[role="tablist"]')).find((el) =>
          isElementInActiveFramework(el, doc),
        );
        if (list) return list;
      }
      const exampleContainer = activeEl.hasAttribute('data-example')
        ? activeEl
        : activeEl.closest<HTMLElement>('[data-example]');
      if (exampleContainer) {
        const list = Array.from(exampleContainer.querySelectorAll<HTMLElement>('[role="tablist"]')).find((el) =>
          isElementInActiveFramework(el, doc),
        );
        if (list) return list;
      }
    }

    const searchRoot = container ?? doc?.body ?? null;
    if (!searchRoot) return null;
    const allLists = Array.from(searchRoot.querySelectorAll<HTMLElement>('[role="tablist"]')).filter((el) =>
      isElementInActiveFramework(el, doc),
    );
    return allLists[0] ?? null;
  }

  function stepTab(delta: number, boundary?: 'first' | 'last'): boolean {
    const doc = resolveDoc();
    const activeEl = (doc?.activeElement as HTMLElement | null) ?? null;
    const container = getActiveContainer();
    const tablist = findActiveTablist(activeEl, container);
    if (!tablist) return false;

    const tabs = Array.from(
      tablist.querySelectorAll<HTMLElement>(
        '[role="tab"]:not([disabled]):not([data-disabled]):not([aria-disabled="true"])',
      ),
    ).filter((el) => isElementInActiveFramework(el, doc));
    if (tabs.length === 0) return false;

    let currentIdx = activeEl ? tabs.findIndex((t) => t === activeEl || t.contains(activeEl)) : -1;
    if (currentIdx === -1) {
      currentIdx = tabs.findIndex(
        (t) =>
          t.getAttribute('aria-selected') === 'true' ||
          t.hasAttribute('data-selected') ||
          t.getAttribute('data-state') === 'active',
      );
    }
    if (currentIdx === -1) {
      currentIdx = 0;
    }

    let targetIdx: number;
    if (boundary === 'first') {
      targetIdx = 0;
    } else if (boundary === 'last') {
      targetIdx = tabs.length - 1;
    } else {
      targetIdx = (((currentIdx + delta) % tabs.length) + tabs.length) % tabs.length;
    }

    const targetTab = tabs[targetIdx];
    if (!targetTab) return false;

    recordCurrentLocation();
    focusElementInActivePane(targetTab);
    targetTab.click();
    recordCurrentLocation();
    announce(`Tab ${targetTab.textContent?.trim() || targetIdx + 1}`);
    emit();
    return true;
  }

  function stepSection(delta: number): boolean {
    const container = getActiveContainer();
    if (!container) return false;
    const sections = Array.from(
      container.querySelectorAll<HTMLElement>(
        '[data-page-section], [data-slot="page-section"], section[id], .docs-prose :is(h2, h3)',
      ),
    );
    if (sections.length === 0) {
      return stepFocusInPane(delta);
    }

    const doc = resolveDoc();
    const activeEl = doc?.activeElement as HTMLElement | null;
    const currentIdx = activeEl ? sections.findIndex((s) => s === activeEl || s.contains(activeEl)) : -1;
    const nextIdx =
      currentIdx === -1
        ? delta >= 0
          ? 0
          : sections.length - 1
        : Math.max(0, Math.min(sections.length - 1, currentIdx + delta));
    const targetSection = sections[nextIdx];
    if (!targetSection) return false;

    recordCurrentLocation();
    if (typeof targetSection.scrollIntoView === 'function') {
      try {
        targetSection.scrollIntoView({ block: 'start', behavior: 'instant' as ScrollBehavior });
      } catch {
        // Ignore
      }
    }
    const innerFocusable =
      getPaneFocusableItems(targetSection, options.getScopeElement?.())[0] ??
      getFirstFocusable(targetSection, { includeContainer: false });
    if (innerFocusable instanceof HTMLElement) {
      focusElementInActivePane(innerFocusable);
    } else {
      runProgrammaticFocus(() => {
        if (targetSection.tabIndex < 0) {
          targetSection.tabIndex = -1;
        }
        targetSection.style.outline = 'none';
        targetSection.focus({ preventScroll: true });
      });
    }
    recordCurrentLocation();
    emit();
    return true;
  }

  function handleGenericContentEditableMotion(el: HTMLElement, motion: ModalMotion, count: number): boolean {
    const win = el.ownerDocument?.defaultView;
    const sel = win?.getSelection?.();
    if (!sel || typeof sel.modify !== 'function') return false;

    const alter =
      mode === 'select' ||
      ((preset === 'helix' || preset === 'kakoune') &&
        (motion === 'wordForward' || motion === 'wordBackward' || motion === 'wordEnd' || motion === 'lineSelect'))
        ? 'extend'
        : 'move';

    for (let i = 0; i < Math.max(1, count); i += 1) {
      switch (motion) {
        case 'left':
          sel.modify(alter, 'backward', 'character');
          break;
        case 'right':
          sel.modify(alter, 'forward', 'character');
          break;
        case 'up':
          sel.modify(alter, 'backward', 'line');
          break;
        case 'down':
          sel.modify(alter, 'forward', 'line');
          break;
        case 'wordForward':
        case 'wordEnd':
          sel.modify(alter, 'forward', 'word');
          break;
        case 'wordBackward':
          sel.modify(alter, 'backward', 'word');
          break;
        case 'paragraphForward':
          sel.modify(alter, 'forward', 'paragraphboundary');
          break;
        case 'paragraphBackward':
          sel.modify(alter, 'backward', 'paragraphboundary');
          break;
        case 'lineStart':
          sel.modify(alter, 'backward', 'lineboundary');
          break;
        case 'lineEnd':
          sel.modify(alter, 'forward', 'lineboundary');
          break;
        case 'lineSelect':
          sel.modify('move', 'backward', 'lineboundary');
          sel.modify('extend', 'forward', 'lineboundary');
          break;
        case 'docStart':
          sel.modify(alter, 'backward', 'documentboundary');
          break;
        case 'docEnd':
          sel.modify(alter, 'forward', 'documentboundary');
          break;
      }
    }
    return true;
  }

  function executeBuiltInCommand(commandId: string, ctx: KeymapCommandContext): boolean {
    const doc = resolveDoc();
    const eventTarget = isElementLike(ctx.event?.target) ? (ctx.event.target as HTMLElement) : null;
    const activeEl = eventTarget ?? (doc?.activeElement as HTMLElement | null) ?? null;
    const editorTarget = getModalEditor(activeEl);

    if (commandId === 'whichKey.openExplorer') {
      openExplorer();
      return true;
    }
    if (commandId === 'preset.helix') {
      setPreset('helix');
      return true;
    }
    if (commandId === 'preset.vim') {
      setPreset('vim');
      return true;
    }
    if (commandId === 'preset.kakoune') {
      setPreset('kakoune');
      return true;
    }
    if (commandId === 'mode.toggleSelect') {
      const nextMode = mode === 'select' ? 'normal' : 'select';
      if (nextMode === 'normal' && editorTarget) {
        editorTarget.transformSelection('collapse');
      }
      setMode(nextMode);
      return true;
    }
    if (commandId === 'jump.start') {
      startJumpMode();
      return true;
    }
    if (commandId === 'jump.activate') {
      startJumpMode('activate');
      return true;
    }
    if (commandId === 'jump.focus') {
      startJumpMode('focus');
      return true;
    }
    if (commandId === 'jump.action.activate') {
      setJumpAction('activate');
      return true;
    }
    if (commandId === 'jump.action.focus') {
      setJumpAction('focus');
      return true;
    }
    if (commandId === 'jumplist.back') {
      return jumpBack();
    }
    if (commandId === 'jumplist.forward') {
      return jumpForward();
    }
    if (commandId.startsWith('pane.focus.')) {
      const idx = Number.parseInt(commandId.slice('pane.focus.'.length), 10);
      return focusPane(idx);
    }
    if (commandId === 'pane.left') return focusPaneDirection('left');
    if (commandId === 'pane.down') return focusPaneDirection('down');
    if (commandId === 'pane.up') return focusPaneDirection('up');
    if (commandId === 'pane.right') return focusPaneDirection('right');
    if (commandId === 'pane.next') return cyclePane(false);
    if (commandId === 'pane.prev') return cyclePane(true);

    if (commandId === 'view.center') return scrollActivePane('center', ctx.count);
    if (commandId === 'view.top') return scrollActivePane('top', ctx.count);
    if (commandId === 'view.bottom') return scrollActivePane('bottom', ctx.count);
    if (commandId === 'view.scrollDown') return scrollActivePane('down', ctx.count);
    if (commandId === 'view.scrollUp') return scrollActivePane('up', ctx.count);

    if (commandId === 'tab.next') return stepTab(ctx.count) || stepSection(ctx.count);
    if (commandId === 'tab.prev') return stepTab(-ctx.count) || stepSection(-ctx.count);
    if (commandId === 'section.next') return stepSection(ctx.count);
    if (commandId === 'section.prev') return stepSection(-ctx.count);
    if (commandId === 'focus.nextBlock') return stepFocusInPane(ctx.count);
    if (commandId === 'focus.prevBlock') return stepFocusInPane(-ctx.count);

    // Motion commands: delegate to ModalEditorTarget first if focused inside an Editor
    if (commandId.startsWith('motion.')) {
      const motion = commandId.slice('motion.'.length) as ModalMotion;
      if (editorTarget) {
        const handled = editorTarget.move(motion, {
          preset,
          mode,
          count: ctx.count,
        });
        if (motion === 'lineSelect' && mode === 'normal') {
          setMode('select');
        }
        return handled;
      }
      if (activeEl && (activeEl.isContentEditable || activeEl.getAttribute('contenteditable') === 'true')) {
        const handled = handleGenericContentEditableMotion(activeEl, motion, ctx.count);
        if (handled && motion === 'lineSelect' && mode === 'normal') {
          setMode('select');
        }
        return handled;
      }

      const activeTree = activeEl?.closest<HTMLElement>('[role="tree"]');
      if (
        activeTree &&
        (motion === 'down' ||
          motion === 'up' ||
          motion === 'left' ||
          motion === 'right' ||
          motion === 'docStart' ||
          motion === 'docEnd')
      ) {
        const ariaKey =
          motion === 'down'
            ? 'ArrowDown'
            : motion === 'up'
              ? 'ArrowUp'
              : motion === 'left'
                ? 'ArrowLeft'
                : motion === 'right'
                  ? 'ArrowRight'
                  : motion === 'docStart'
                    ? 'Home'
                    : 'End';
        const steps = motion === 'docStart' || motion === 'docEnd' ? 1 : Math.max(1, ctx.count);
        let movedOrHandled = false;
        runProgrammaticFocus(() => {
          for (let s = 0; s < steps; s += 1) {
            const currentTreeEl =
              (doc?.activeElement instanceof HTMLElement && activeTree.contains(doc.activeElement)
                ? doc.activeElement
                : activeEl) ?? null;
            if (!currentTreeEl) break;

            let prevented = false;
            if (typeof KeyboardEvent === 'function' && typeof currentTreeEl.dispatchEvent === 'function') {
              const synth = new KeyboardEvent('keydown', {
                key: ariaKey,
                code: ariaKey,
                bubbles: true,
                cancelable: true,
              });
              currentTreeEl.dispatchEvent(synth);
              prevented = synth.defaultPrevented;
            }

            if (prevented || (doc?.activeElement && doc.activeElement !== currentTreeEl)) {
              movedOrHandled = true;
              continue;
            }

            const treeItems = getVisibleTreeItems(activeTree);
            if (treeItems.length === 0) break;
            const currentIdx = treeItems.findIndex((t) => t === currentTreeEl || t.contains(currentTreeEl));
            if (motion === 'down' || motion === 'up') {
              const delta = motion === 'down' ? 1 : -1;
              const nextIdx =
                currentIdx === -1
                  ? delta > 0
                    ? 0
                    : treeItems.length - 1
                  : Math.max(0, Math.min(treeItems.length - 1, currentIdx + delta));
              const nextTarget = treeItems[nextIdx];
              if (nextTarget) {
                focusElementInActivePane(nextTarget);
                movedOrHandled = true;
              }
            } else if (motion === 'docStart' || motion === 'docEnd') {
              const nextTarget = motion === 'docStart' ? treeItems[0] : treeItems[treeItems.length - 1];
              if (nextTarget) {
                focusElementInActivePane(nextTarget);
                movedOrHandled = true;
              }
            } else if (motion === 'right' || motion === 'left') {
              const branchEl = currentTreeEl.closest<HTMLElement>('[role="treeitem"][aria-expanded]');
              const isExpanded = branchEl?.getAttribute('aria-expanded') === 'true';
              if (motion === 'right' && branchEl && !isExpanded) {
                currentTreeEl.click();
                movedOrHandled = true;
              } else if (motion === 'left' && branchEl && isExpanded) {
                currentTreeEl.click();
                movedOrHandled = true;
              }
            }
          }
        });
        if (movedOrHandled) {
          if (activePaneId && doc?.activeElement instanceof HTMLElement) {
            const pane = panes.get(activePaneId);
            if (pane && pane.element?.contains(doc.activeElement)) {
              pane.lastFocusedElement = doc.activeElement;
            }
          }
          emit();
          return true;
        }
      }

      const activeTab = activeEl?.closest<HTMLElement>('[role="tab"]');
      const activeTablist = activeTab?.closest<HTMLElement>('[role="tablist"]');
      if (activeTab && activeTablist) {
        const isVertical =
          activeTablist.getAttribute('aria-orientation') === 'vertical' ||
          activeTablist.getAttribute('data-orientation') === 'vertical';
        if (!isVertical) {
          if (motion === 'right' || motion === 'wordForward' || motion === 'wordEnd') {
            return stepTab(ctx.count);
          }
          if (motion === 'left' || motion === 'wordBackward') {
            return stepTab(-ctx.count);
          }
          if (motion === 'lineStart') {
            return stepTab(0, 'first');
          }
          if (motion === 'lineEnd') {
            return stepTab(0, 'last');
          }
        } else {
          if (motion === 'down') {
            return stepTab(ctx.count);
          }
          if (motion === 'up') {
            return stepTab(-ctx.count);
          }
          if (motion === 'lineStart') {
            return stepTab(0, 'first');
          }
          if (motion === 'lineEnd') {
            return stepTab(0, 'last');
          }
        }
      }

      switch (motion) {
        case 'down':
          return stepFocusVerticalInPane(ctx.count);
        case 'up':
          return stepFocusVerticalInPane(-ctx.count);
        case 'wordForward':
        case 'wordEnd':
        case 'right':
          return stepFocusInPane(ctx.count);
        case 'wordBackward':
        case 'left':
          return stepFocusInPane(-ctx.count);
        case 'paragraphForward':
          return stepSection(ctx.count);
        case 'paragraphBackward':
          return stepSection(-ctx.count);
        case 'docStart':
          return jumpToBoundary('start');
        case 'docEnd':
          return jumpToBoundary('end');
        case 'lineStart':
          return jumpToBoundary('first-in-group');
        case 'lineEnd':
          return jumpToBoundary('last-in-group');
        case 'lineSelect':
          setMode(mode === 'select' ? 'normal' : 'select');
          return true;
      }
    }

    // Text-object commands
    if (commandId.startsWith('textObject.')) {
      const spec = commandId.slice('textObject.'.length) as ModalTextObjectSpec;
      if (editorTarget) {
        return editorTarget.selectTextObject(spec, { preset, mode });
      }
      return false;
    }

    // Selection transform commands
    if (commandId.startsWith('selection.')) {
      const transform = commandId.slice('selection.'.length) as ModalSelectionTransform;
      if (editorTarget) {
        const handled = editorTarget.transformSelection(transform);
        if (transform === 'collapse' && mode === 'select') {
          setMode('normal');
        }
        return handled;
      }
      if (transform === 'collapse' && mode === 'select') {
        setMode('normal');
        return true;
      }
      return false;
    }

    // Operator commands
    if (commandId.startsWith('operator.')) {
      const op = commandId.slice('operator.'.length) as ModalOperator;
      const emitYankNotification = (yankedText: string) => {
        if (!yankedText) return;
        options.onYank?.(yankedText, ctx);
        if (typeof CustomEvent === 'function') {
          const dispatchTarget: EventTarget | null = activeEl ?? doc ?? null;
          dispatchTarget?.dispatchEvent?.(
            new CustomEvent('helical:yank', {
              bubbles: true,
              detail: {
                text: yankedText,
                preset: ctx.preset,
                mode: ctx.mode,
                count: ctx.count,
              },
            }),
          );
        }
      };

      if (editorTarget) {
        const res = editorTarget.execOperator(op, {
          preset,
          mode,
          count: ctx.count,
        });
        if (op === 'yank' && typeof res === 'object' && res !== null && typeof res.yankedText === 'string') {
          emitYankNotification(res.yankedText);
        }
        const shouldEnterInsert =
          (typeof res === 'object' && res !== null && res.enterInsert) ||
          op === 'change' ||
          op === 'insertStart' ||
          op === 'appendEnd' ||
          op === 'openBelow' ||
          op === 'openAbove';
        if (shouldEnterInsert) {
          setMode('insert');
        } else if ((op === 'delete' || op === 'yank') && mode === 'select') {
          setMode('normal');
        }
        return Boolean(res);
      }

      if (op === 'yank') {
        let selectedText = '';
        if (activeEl instanceof HTMLInputElement || activeEl instanceof HTMLTextAreaElement) {
          const start = activeEl.selectionStart ?? 0;
          const end = activeEl.selectionEnd ?? 0;
          selectedText = activeEl.value.slice(start, end);
        } else {
          selectedText = doc?.defaultView?.getSelection?.()?.toString() ?? '';
        }
        if (selectedText && typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
          void navigator.clipboard.writeText(selectedText).catch(() => {});
        }
        emitYankNotification(selectedText);
        if (mode === 'select') {
          setMode('normal');
        }
        return Boolean(selectedText);
      }

      if (op === 'insertStart' && activeEl?.hasAttribute('data-example')) {
        return enterExampleContainer(activeEl);
      }

      if (op === 'change' && activeEl && !isTextEntryElement(activeEl)) {
        const exampleCard = activeEl.closest<HTMLElement>('[data-example]');
        if (exampleCard) {
          const toggle = exampleCard.querySelector<HTMLButtonElement>('[data-example-toggle]');
          if (toggle) {
            toggle.click();
            announce('Toggled example code');
            return true;
          }
        }
      }

      if (op === 'insertStart' || op === 'appendEnd' || op === 'change') {
        if (isTextEntryElement(activeEl)) {
          if (activeEl instanceof HTMLInputElement || activeEl instanceof HTMLTextAreaElement) {
            try {
              const pos = op === 'insertStart' ? 0 : activeEl.value.length;
              activeEl.setSelectionRange(pos, pos);
            } catch {
              // Ignore for input types that do not support setSelectionRange
            }
          }
          setMode('insert');
          return true;
        }
        setMode('insert');
        return true;
      }
    }

    return false;
  }

  function executeCommand(commandId: string, partialCtx?: Partial<KeymapCommandContext>): boolean {
    const count = partialCtx?.count ?? (countBuffer ? Math.max(1, Number.parseInt(countBuffer, 10)) : 1);
    const ctx: KeymapCommandContext = {
      count,
      mode: partialCtx?.mode ?? mode,
      preset: partialCtx?.preset ?? preset,
      activePaneId: partialCtx?.activePaneId ?? activePaneId,
      event: partialCtx?.event,
    };

    const customHandler = commandHandlers.get(commandId);
    let handled = false;
    if (customHandler) {
      const res = customHandler(ctx);
      handled = res !== false;
    }
    if (!handled) {
      handled = executeBuiltInCommand(commandId, ctx);
    }
    options.onCommand?.(commandId, ctx);
    return handled;
  }

  function invokeNode(node: WhichKeyNode, event?: KeyboardEvent): boolean {
    const count = countBuffer ? Math.max(1, Number.parseInt(countBuffer, 10)) : 1;
    const ctx: KeymapCommandContext = {
      count,
      mode,
      preset,
      activePaneId,
      event,
    };

    let handled = false;
    if (node.action) {
      const res = node.action(ctx);
      handled = res !== false;
    }
    if (!handled && node.commandId) {
      handled = executeCommand(node.commandId, ctx);
    }

    countBuffer = '';
    if (!sticky) {
      activePath = [];
    }
    emit();
    return handled;
  }

  function executeExplorerEntry(entryOrId: KeymapExplorerEntry | string): boolean {
    const state = computeState();
    const entry =
      typeof entryOrId === 'string' ? state.explorerEntries.find((item) => item.id === entryOrId) : entryOrId;
    if (!entry) return false;

    closeExplorer();
    const ctx: KeymapCommandContext = {
      count: 1,
      mode,
      preset,
      activePaneId,
    };
    let handled = false;
    if (entry.action) {
      const res = entry.action(ctx);
      handled = res !== false;
    }
    if (!handled && entry.commandId) {
      handled = executeCommand(entry.commandId, ctx);
    }
    emit();
    return handled;
  }

  function handleJumpKeyDown(event: KeyboardEvent): boolean {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();
      cancelJumpMode();
      return true;
    }
    if (event.key === 'Backspace') {
      event.preventDefault();
      event.stopPropagation();
      if (jumpQuery.length > 0) {
        jumpQuery = jumpQuery.slice(0, -1);
        emit();
      } else {
        cancelJumpMode();
      }
      return true;
    }

    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const nextQuery = jumpQuery + event.key.toLowerCase();
      const matching = rawJumpTargets.filter((t) => t.label.startsWith(nextQuery));
      event.preventDefault();
      event.stopPropagation();

      if (matching.length === 0) {
        return true;
      }

      const exact = matching.find((t) => t.label === nextQuery);
      if (exact && matching.length === 1) {
        recordCurrentLocation();
        const targetEl = exact.element;
        const actionToRun = jumpAction;
        jumpQuery = '';
        rawJumpTargets = [];
        mode = 'normal';

        // Check if targetEl belongs to a registered pane
        for (const pane of panes.values()) {
          if (pane.element && pane.element.contains(targetEl)) {
            activePaneId = pane.id;
            break;
          }
        }

        focusElementInActivePane(targetEl);
        if (actionToRun === 'activate') {
          targetEl.click();
        }
        recordCurrentLocation();
        emit();
        return true;
      }

      jumpQuery = nextQuery;
      emit();
      return true;
    }

    return false;
  }

  function triggerKey(key: string, event?: KeyboardEvent): boolean {
    const rootTrie = buildMergedTrie();

    if (activePath.length > 0) {
      const currentParent = resolveNode(rootTrie, activePath, mode);
      if (!currentParent) {
        closePrefix();
        return false;
      }
      const children = getNodeChildren(currentParent, rootTrie);
      const child = children[key];
      if (!child || !nodeMatchesMode(child, mode)) {
        if (!sticky) {
          closePrefix();
        }
        return false;
      }

      if (isGroupNode(child, rootTrie)) {
        activePath = [...activePath, key];
        if (child.sticky || child.loop) {
          sticky = true;
        }
        announce(`${child.group ?? child.label} menu`);
        emit();
        return true;
      }

      return invokeNode(child, event);
    }

    // At root of normal / select mode:
    // Check numeric count prefix [1-9] or [0-9] when countBuffer is already non-empty
    if (/^[0-9]$/.test(key) && (countBuffer.length > 0 || key !== '0' || !rootTrie['0'])) {
      if (countBuffer.length > 0 || key !== '0') {
        countBuffer += key;
        emit();
        return true;
      }
    }

    const rootNode = rootTrie[key];
    if (!rootNode || !nodeMatchesMode(rootNode, mode)) {
      return false;
    }

    if (isGroupNode(rootNode, rootTrie)) {
      activePath = [key];
      sticky = Boolean(rootNode.sticky || rootNode.loop);
      announce(`${rootNode.group ?? rootNode.label} menu`);
      emit();
      return true;
    }

    return invokeNode(rootNode, event);
  }

  function handleKeyDown(event: KeyboardEvent): boolean {
    if (!isControllerEnabled()) return false;
    if (event.defaultPrevented && activePath.length === 0 && mode !== 'jump') {
      return false;
    }

    // 1. When the <leader>? Keybinding Explorer Dialog is open, let Ark Dialog + ListboxInput handle keys,
    // except Escape which closes the explorer cleanly.
    if (explorerOpen) {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        closeExplorer();
        return true;
      }
      return false;
    }

    const doc = resolveDoc();
    const targetEl = (isElementLike(event.target) ? event.target : null) ?? doc?.activeElement ?? null;
    const editorTarget = getModalEditor(targetEl);
    const inEditable = isTextEntryElement(targetEl);

    // 2. When in insert mode (or inside an editable input when mode === 'insert'):
    if (mode === 'insert') {
      if (event.key === 'Escape') {
        // If inside a ProseMirror editor with an open slash/mention suggestion popup or floating surface, let it close first
        if (editorTarget?.hasActiveSuggestion?.()) {
          return false;
        }
        const hasOpenInsertOverlay = Boolean(
          doc?.querySelector(
            '[data-editor-overlay], [data-slash-menu-surface], [data-mention-menu-surface], ' +
              '[data-editor-slash-menu], [data-editor-mention-menu], ' +
              '[data-scope="select"][data-state="open"], [data-scope="menu"][data-state="open"], ' +
              '[data-scope="popover"][data-state="open"], [data-scope="combobox"][data-state="open"], ' +
              '[role="alertdialog"]:not([data-state="closed"])',
          ),
        );
        if (hasOpenInsertOverlay) {
          return false;
        }
        if (isHTMLElementLike(targetEl) && targetEl.closest?.('[data-part="node-rename-input"]')) {
          setMode('normal');
          return false;
        }
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation?.();
        setMode('normal');
        if (isHTMLElementLike(targetEl) && editorTarget && targetEl.closest?.('[contenteditable="false"]')) {
          const pmRoot = targetEl.closest?.('.ProseMirror') as HTMLElement | null;
          if (pmRoot) {
            runProgrammaticFocus(() => {
              pmRoot.focus({ preventScroll: true });
            });
          }
        }
        return true;
      }
      return false;
    }

    // 3. When in Jump mode (gw / s):
    if (mode === 'jump') {
      return handleJumpKeyDown(event);
    }

    // 4. When a prefix menu (Space, g, z/v, m, Ctrl-w, [/]) is currently open:
    if (activePath.length > 0) {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation?.();
        closePrefix();
        return true;
      }
      if (event.key === 'Backspace') {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation?.();
        stepBackPrefix();
        return true;
      }

      const chordCandidates = eventToChordKeys(event);
      if (chordCandidates.length === 0) return false;

      const rootTrie = buildMergedTrie();
      const parentNode = resolveNode(rootTrie, activePath, mode);
      const children = parentNode ? getNodeChildren(parentNode, rootTrie) : {};
      const matchedChord = chordCandidates.find((c) => Boolean(children[c]));

      event.preventDefault();
      event.stopPropagation();
      if (matchedChord) {
        return triggerKey(matchedChord, event);
      }
      if (!sticky) {
        closePrefix();
      }
      return true;
    }

    // 5. At root of normal / select mode:
    if (event.key === 'Escape') {
      if (editorTarget && (mode === 'select' || !editorTarget.hasActiveSuggestion?.())) {
        event.preventDefault();
        event.stopPropagation();
        countBuffer = '';
        editorTarget.setModalState({ mode: 'normal', preset });
        if (mode === 'select') {
          editorTarget.transformSelection('collapse');
          setMode('normal');
        } else {
          emit();
        }
        return true;
      }
      if (countBuffer.length > 0 || mode === 'select') {
        event.preventDefault();
        event.stopPropagation();
        countBuffer = '';
        if (editorTarget) {
          editorTarget.transformSelection('collapse');
        }
        if (mode === 'select') {
          setMode('normal');
        } else {
          emit();
        }
        return true;
      }
      const parentExample =
        targetEl instanceof HTMLElement && !targetEl.hasAttribute('data-example')
          ? targetEl.closest<HTMLElement>('[data-example]')
          : null;
      const hasOpenFloatingSurface = Boolean(
        doc?.querySelector(
          '[data-scope="popover"][data-state="open"], [data-scope="menu"][data-state="open"], [data-scope="select"][data-state="open"], [data-scope="combobox"][data-state="open"], [role="dialog"]:not([hidden]):not([data-state="closed"]), [role="listbox"]:not([hidden]):not([data-state="closed"]), [aria-expanded="true"]',
        ),
      );
      if (parentExample && (!doc || (!getTopMostModalDialog(doc) && !hasOpenFloatingSurface))) {
        event.preventDefault();
        event.stopPropagation();
        if (doc) {
          lastInteractedScopeByDoc.set(doc, null);
        }
        focusElementInActivePane(parentExample);
        announce('Exited example preview');
        emit();
        return true;
      }
      return false;
    }

    // If Enter is pressed on a [data-example] container in normal mode, enter its preview (or toggle code if display-only).
    if (
      event.key === 'Enter' &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey &&
      targetEl instanceof HTMLElement &&
      targetEl.hasAttribute('data-example')
    ) {
      event.preventDefault();
      event.stopPropagation();
      return enterExampleContainer(targetEl);
    }

    // If Enter is pressed in normal mode on a text-editable input (and not a ProseMirror editor),
    // enter insert mode so the user can type into the focused input field.
    if (event.key === 'Enter' && !event.ctrlKey && !event.metaKey && !event.altKey && inEditable && !editorTarget) {
      event.preventDefault();
      event.stopPropagation();
      setMode('insert');
      return true;
    }

    // Preserve native Space key toggling on focused checkboxes, switches, radios, and component demo buttons.
    if (event.key === ' ' && !event.ctrlKey && !event.metaKey && !event.altKey && targetEl) {
      const role = targetEl.getAttribute('role');
      const isToggleControl =
        (targetEl instanceof HTMLInputElement && (targetEl.type === 'checkbox' || targetEl.type === 'radio')) ||
        role === 'checkbox' ||
        role === 'switch' ||
        role === 'radio';
      if (isToggleControl) {
        return false;
      }

      const isButtonControl = targetEl.tagName === 'BUTTON' || role === 'button';
      if (isButtonControl) {
        const previewAncestor = targetEl.closest('[data-example-preview]');
        const ownScope = options.getScopeElement?.() ?? null;
        if (previewAncestor && (!ownScope || !previewAncestor.contains(ownScope))) {
          return false;
        }
      }
    }

    if (
      editorTarget &&
      !editorTarget.hasActiveSuggestion?.() &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey &&
      (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'ArrowUp' || event.key === 'ArrowDown')
    ) {
      const arrowMotion: ModalMotion =
        event.key === 'ArrowLeft'
          ? 'left'
          : event.key === 'ArrowRight'
            ? 'right'
            : event.key === 'ArrowUp'
              ? 'up'
              : 'down';
      if (event.shiftKey && mode === 'normal') {
        setMode('select');
      }
      const effectiveMode: KeymapMode = event.shiftKey ? 'select' : mode;
      const count = countBuffer.length > 0 ? Math.max(1, Number.parseInt(countBuffer, 10)) : 1;
      countBuffer = '';
      event.preventDefault();
      event.stopPropagation();
      editorTarget.move(arrowMotion, { preset, mode: effectiveMode, count });
      emit();
      return true;
    }

    const chordCandidates = eventToChordKeys(event);
    if (chordCandidates.length === 0) return false;

    const rootTrie = buildMergedTrie();
    for (const candidate of chordCandidates) {
      if (/^[0-9]$/.test(candidate) && (countBuffer.length > 0 || candidate !== '0' || !rootTrie['0'])) {
        if (countBuffer.length > 0 || candidate !== '0') {
          event.preventDefault();
          event.stopPropagation();
          return triggerKey(candidate, event);
        }
      }
      if (rootTrie[candidate] && nodeMatchesMode(rootTrie[candidate]!, mode)) {
        event.preventDefault();
        event.stopPropagation();
        return triggerKey(candidate, event);
      }
    }

    // If focused inside a text input or ProseMirror in normal/select mode, block unbound printable keys
    // from mutating the input/document while in normal/select mode.
    if (inEditable && event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      event.stopPropagation();
      return true;
    }

    return false;
  }

  function attach(target?: Document | HTMLElement): () => void {
    detachCleanups.forEach((fn) => fn());
    detachCleanups = [];

    const doc = target instanceof Document ? target : (target?.ownerDocument ?? resolveDoc());
    if (!doc) return () => {};

    const eventTarget: Document | HTMLElement = target ?? doc;

    try {
      const cleanupModality = trackInteractionModality({
        root: doc,
        onChange: () => {},
      });
      detachCleanups.push(cleanupModality);
    } catch {
      // Safe fallback if DOM window listeners unavailable
    }

    try {
      liveRegion = createLiveRegion({
        level: 'polite',
        document: doc,
      });
      detachCleanups.push(() => {
        liveRegion?.destroy();
        liveRegion = null;
      });
    } catch {
      liveRegion = null;
    }

    const entry: AttachedControllerEntry = {
      getScopeElement: () => options.getScopeElement?.() ?? null,
      isBusy: () => activePath.length > 0 || sticky || explorerOpen || mode === 'jump' || countBuffer.length > 0,
    };

    let docEntries = attachedEntriesByDoc.get(doc);
    if (!docEntries) {
      docEntries = new Set();
      attachedEntriesByDoc.set(doc, docEntries);
    }
    docEntries.add(entry);
    detachCleanups.push(() => {
      docEntries?.delete(entry);
    });

    if (!options.getScopeElement?.()) {
      const storedPreset = readStoredPreset();
      if (storedPreset && !options.preset) {
        preset = storedPreset;
      }
      const storedJump = readStoredJumpAction();
      if (storedJump && !options.jumpAction) {
        jumpAction = storedJump;
      }
      if (doc.documentElement) {
        doc.documentElement.dataset.keymapPreset = preset;
        doc.documentElement.dataset.jumpAction = jumpAction;
      }
      rootControllerByDoc.set(doc, controllerApi);
      notifyRootControllerListeners(doc);
      detachCleanups.push(() => {
        if (rootControllerByDoc.get(doc) === controllerApi) {
          rootControllerByDoc.delete(doc);
          notifyRootControllerListeners(doc);
        }
      });
    }

    syncDomPanes(doc);
    emit();

    const onPointerDown = (e: Event) => {
      if (!isControllerEnabled()) return;
      const targetNode = e.target instanceof Element ? e.target : null;
      if (!targetNode) return;

      if (
        !targetNode.closest(
          '[data-which-key-root], [data-which-key-explorer], [data-which-key-jump-overlay], [data-scope="dialog"]',
        )
      ) {
        const clickedScope = (targetNode.closest('[data-which-key-scope]') as HTMLElement | null) ?? null;
        if (!clickedScope || isScopeElementActive(clickedScope, doc)) {
          lastInteractedScopeByDoc.set(doc, clickedScope);
        }
      }

      if (!shouldEntryHandleEvent(entry, doc)) return;

      // Update activePaneId when user clicks inside a registered pane
      for (const pane of panes.values()) {
        if (pane.element && pane.element.contains(targetNode)) {
          if (activePaneId !== pane.id) {
            activePaneId = pane.id;
            emit();
          }
          break;
        }
      }

      if (isTextEntryElement(targetNode) && (mode === 'normal' || mode === 'select')) {
        setMode('insert');
      }
    };

    const onFocusIn = (e: FocusEvent) => {
      if (!isControllerEnabled()) return;
      const targetNode = e.target instanceof HTMLElement ? e.target : null;
      if (!targetNode) return;

      if (
        programmaticFocusDepth === 0 &&
        !targetNode.closest(
          '[data-which-key-root], [data-which-key-explorer], [data-which-key-jump-overlay], [data-scope="dialog"]',
        )
      ) {
        const focusedScope = (targetNode.closest('[data-which-key-scope]') as HTMLElement | null) ?? null;
        if (!focusedScope || isScopeElementActive(focusedScope, doc)) {
          lastInteractedScopeByDoc.set(doc, focusedScope);
        }
      }

      if (!shouldEntryHandleEvent(entry, doc)) return;

      for (const pane of panes.values()) {
        if (pane.element && pane.element.contains(targetNode)) {
          const prevPaneId = activePaneId;
          activePaneId = pane.id;
          pane.lastFocusedElement = targetNode;
          if (prevPaneId !== pane.id) {
            emit();
          }
          break;
        }
      }

      if (programmaticFocusDepth > 0) {
        return;
      }

      // When focusing a ProseMirror modal editor via keyboard navigation in normal/select mode,
      // keep normal/select mode active so modal motions (h/j/k/l, w/b/e, v, x, d, c, y, i) work immediately.
      if (isTextEntryElement(targetNode) && !getModalEditor(targetNode)) {
        if (mode === 'normal' || mode === 'select') {
          setMode('insert');
        }
      }
    };

    const onKeyDown = (e: Event) => {
      if (!shouldEntryHandleEvent(entry, doc)) return;
      if (e instanceof KeyboardEvent || (e && typeof (e as KeyboardEvent).key === 'string')) {
        handleKeyDown(e as KeyboardEvent);
      }
    };

    eventTarget.addEventListener('pointerdown', onPointerDown, true);
    eventTarget.addEventListener('focusin', onFocusIn as EventListener, true);
    eventTarget.addEventListener('keydown', onKeyDown, true);

    detachCleanups.push(() => {
      eventTarget.removeEventListener('pointerdown', onPointerDown, true);
      eventTarget.removeEventListener('focusin', onFocusIn as EventListener, true);
      eventTarget.removeEventListener('keydown', onKeyDown, true);
    });

    return () => {
      detachCleanups.forEach((fn) => fn());
      detachCleanups = [];
    };
  }

  function destroy(): void {
    detachCleanups.forEach((fn) => fn());
    detachCleanups = [];
    listeners.clear();
    panes.clear();
    keymapLayers.clear();
  }

  function registerKeymap(
    id: string,
    nodes: Record<string, WhichKeyNode>,
    layerOptions?: { scope?: string; enabled?: boolean },
  ): () => void {
    keymapLayers.set(id, {
      id,
      nodes,
      scope: layerOptions?.scope,
      enabled: layerOptions?.enabled ?? true,
    });
    emit();
    return () => {
      keymapLayers.delete(id);
      emit();
    };
  }

  function registerCommand(commandId: string, handler: KeymapHandler): () => void {
    commandHandlers.set(commandId, handler);
    return () => {
      if (commandHandlers.get(commandId) === handler) {
        commandHandlers.delete(commandId);
      }
    };
  }

  function registerPane(pane: {
    id: string;
    title: string;
    element: HTMLElement | null;
    disabled?: boolean;
    order?: number;
  }): () => void {
    const existing = panes.get(pane.id);
    const registration: PaneRegistration = {
      id: pane.id,
      title: pane.title,
      element: pane.element,
      disabled: pane.disabled,
      order: pane.order ?? existing?.order ?? panes.size + 1,
      lastFocusedElement: existing?.lastFocusedElement ?? null,
    };
    panes.set(pane.id, registration);
    if (!activePaneId && !pane.disabled && pane.element) {
      activePaneId = pane.id;
    }
    emit();
    return () => {
      panes.delete(pane.id);
      if (activePaneId === pane.id) {
        const remaining = getOrderedPanes();
        activePaneId = remaining[0]?.id ?? null;
      }
      emit();
    };
  }

  function trackBranchElement(nodeOrFn: HTMLElement | null | (() => HTMLElement | null)): () => void {
    try {
      return trackDismissableBranch(nodeOrFn, { defer: true });
    } catch {
      return () => {};
    }
  }

  const controllerApi: WhichKeyController = {
    getState: () => cachedState,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    attach,
    destroy,
    handleKeyDown,
    setPreset,
    setMode,
    setJumpAction,
    openPrefix,
    closePrefix,
    stepBackPrefix,
    triggerKey: (key: string) => triggerKey(key),
    openExplorer,
    closeExplorer,
    setExplorerQuery,
    executeExplorerEntry,
    registerKeymap,
    registerCommand,
    executeCommand,
    registerPane,
    focusPane,
    focusPaneDirection,
    cyclePane,
    stepFocusInPane,
    jumpToBoundary,
    scrollActivePane,
    startJumpMode,
    cancelJumpMode,
    jumpBack,
    jumpForward,
    trackBranchElement,
  };

  return controllerApi;
}
