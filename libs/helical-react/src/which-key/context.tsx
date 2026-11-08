// libs/helical-react/src/which-key/context.tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useSyncExternalStore,
  type ReactNode,
  type RefCallback,
} from 'react';
import { useEnvironmentContext } from '@ark-ui/react/environment';
import { HotkeysProvider } from '@tanstack/react-hotkeys';
import {
  createWhichKeyController,
  getDocumentWhichKeyController,
  subscribeDocumentWhichKeyController,
  type JumpAction,
  type KeybindingPreset,
  type KeymapCommandContext,
  type KeymapMode,
  type WhichKeyController,
  type WhichKeyControllerOptions,
  type WhichKeyNode,
  type WhichKeyState,
} from '@cloudvoyant/helical-ui';

const WhichKeyContext = createContext<WhichKeyController | null>(null);

export interface WhichKeyProviderProps extends WhichKeyControllerOptions {
  /**
   * Whether this provider is scoped to its own DOM subtree when multiple
   * WhichKeyProviders are mounted on the same page.
   * @default true
   */
  scoped?: boolean;
  children?: ReactNode;
}

export function WhichKeyProvider({
  preset,
  defaultMode = 'normal',
  leaderKey = 'Space',
  leaderOnly,
  jumpAction,
  jumpAlphabet,
  storageKey,
  keymap,
  commands,
  enabled = true,
  disableOnMobile = true,
  scoped = true,
  onPresetChange,
  onModeChange,
  onLeaderOnlyChange,
  onJumpActionChange,
  onCommand,
  onYank,
  children,
}: WhichKeyProviderProps) {
  const env = useEnvironmentContext();
  const scopeRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<WhichKeyController | null>(null);

  if (!controllerRef.current) {
    controllerRef.current = createWhichKeyController({
      preset,
      defaultMode,
      leaderKey,
      leaderOnly,
      jumpAction,
      jumpAlphabet,
      storageKey,
      keymap,
      commands,
      enabled,
      disableOnMobile,
      getDocument: () => env.getDocument(),
      getScopeElement: () => (scoped ? scopeRef.current : null),
      onPresetChange,
      onModeChange,
      onLeaderOnlyChange,
      onJumpActionChange,
      onCommand,
      onYank,
    });
  }

  const controller = controllerRef.current;

  useEffect(() => {
    if (preset !== undefined) {
      controller.setPreset(preset);
    }
  }, [controller, preset]);

  useEffect(() => {
    if (leaderOnly !== undefined) {
      controller.setLeaderOnly(leaderOnly);
    }
  }, [controller, leaderOnly]);

  useEffect(() => {
    if (jumpAction !== undefined) {
      controller.setJumpAction(jumpAction);
    }
  }, [controller, jumpAction]);

  useEffect(() => {
    if (!enabled) return;
    const doc = env.getDocument();
    return controller.attach(doc);
  }, [controller, enabled, env]);

  useEffect(() => {
    if (!keymap) return;
    return controller.registerKeymap('__provider_keymap__', keymap, {
      enabled: true,
    });
  }, [controller, keymap]);

  useEffect(() => {
    if (!commands) return;
    const cleanups = Object.entries(commands).map(([cmdId, handler]) =>
      controller.registerCommand(cmdId, handler),
    );
    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [controller, commands]);

  return (
    <HotkeysProvider>
      <WhichKeyContext.Provider value={controller}>
        {scoped ? (
          <div ref={scopeRef} data-which-key-scope className="contents">
            {children}
          </div>
        ) : (
          children
        )}
      </WhichKeyContext.Provider>
    </HotkeysProvider>
  );
}

export function useOptionalWhichKeyController(): WhichKeyController | null {
  const contextController = useContext(WhichKeyContext);
  const docController = useSyncExternalStore(
    (listener) =>
      contextController
        ? () => {}
        : subscribeDocumentWhichKeyController(
            typeof document !== 'undefined' ? document : undefined,
            listener,
          ),
    () => (contextController ? null : getDocumentWhichKeyController()),
    () => null,
  );
  return contextController ?? docController;
}

export function useWhichKeyController(): WhichKeyController {
  const controller = useOptionalWhichKeyController();
  const fallbackRef = useRef<WhichKeyController | null>(null);
  if (controller) return controller;
  if (!fallbackRef.current) {
    fallbackRef.current = createWhichKeyController();
  }
  return fallbackRef.current;
}

export interface UseWhichKeyReturn extends WhichKeyState {
  controller: WhichKeyController;
  setPreset: (preset: KeybindingPreset) => void;
  setMode: (mode: KeymapMode) => void;
  setLeaderOnly: (leaderOnly: boolean) => void;
  setJumpAction: (action: JumpAction) => void;
  openExplorer: () => void;
  closeExplorer: () => void;
  setExplorerQuery: (query: string) => void;
  openPrefix: (path: string[], options?: { sticky?: boolean }) => void;
  closePrefix: () => void;
  stepBackPrefix: () => boolean;
  triggerKey: (key: string) => boolean;
  focusPane: (paneIdOrIndex: string | number) => boolean;
  startJumpMode: (action?: JumpAction) => void;
  cancelJumpMode: () => void;
  jumpBack: () => boolean;
  jumpForward: () => boolean;
  executeCommand: (
    commandId: string,
    partialCtx?: Partial<KeymapCommandContext>,
  ) => boolean;
}

export function useWhichKey(): UseWhichKeyReturn {
  const controller = useWhichKeyController();
  const state = useSyncExternalStore(
    controller.subscribe,
    controller.getState,
    controller.getState,
  );

  return {
    ...state,
    controller,
    setPreset: controller.setPreset,
    setMode: controller.setMode,
    setLeaderOnly: controller.setLeaderOnly,
    setJumpAction: controller.setJumpAction,
    openExplorer: controller.openExplorer,
    closeExplorer: controller.closeExplorer,
    setExplorerQuery: controller.setExplorerQuery,
    openPrefix: controller.openPrefix,
    closePrefix: controller.closePrefix,
    stepBackPrefix: controller.stepBackPrefix,
    triggerKey: controller.triggerKey,
    focusPane: controller.focusPane,
    startJumpMode: controller.startJumpMode,
    cancelJumpMode: controller.cancelJumpMode,
    jumpBack: controller.jumpBack,
    jumpForward: controller.jumpForward,
    executeCommand: controller.executeCommand,
  };
}

export function useKeymap(
  nodes: Record<string, WhichKeyNode>,
  options?: { scope?: string; enabled?: boolean },
): void {
  const controller = useOptionalWhichKeyController();
  const layerId = useId();

  useEffect(() => {
    if (!controller || options?.enabled === false) return;
    return controller.registerKeymap(layerId, nodes, options);
  }, [controller, layerId, nodes, options]);
}

export function useKeymapScope(
  scopeId: string,
  nodes: Record<string, WhichKeyNode>,
  enabled = true,
): void {
  useKeymap(nodes, { scope: scopeId, enabled });
}

export interface UsePaneRegistrationOptions {
  paneId?: string;
  paneTitle?: string;
  paneDisabled?: boolean;
  paneOrder?: number;
  defaultTitle: string;
}

export interface UsePaneRegistrationResult {
  ref: RefCallback<HTMLElement>;
  paneId: string;
  isActive: boolean;
  dataAttributes: {
    'data-pane-id'?: string;
    'data-pane-title'?: string;
    'data-pane-order'?: string;
    'data-pane-active'?: 'true' | 'false';
  };
}

export function useOptionalPaneRegistration(
  options: UsePaneRegistrationOptions,
): UsePaneRegistrationResult {
  const controller = useOptionalWhichKeyController();
  const reactId = useId();
  const resolvedId = options.paneId ?? `pane-${reactId.replace(/:/g, '')}`;
  const resolvedTitle = options.paneTitle ?? options.defaultTitle;
  const elementRef = useRef<HTMLElement | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const activePaneId = useSyncExternalStore(
    controller ? controller.subscribe : () => () => {},
    () => (controller ? controller.getState().activePaneId : null),
    () => null,
  );

  const setRef: RefCallback<HTMLElement> = useCallback((node) => {
    elementRef.current = node;
  }, []);

  useEffect(() => {
    if (!controller || !elementRef.current || options.paneDisabled) {
      cleanupRef.current?.();
      cleanupRef.current = null;
      return;
    }
    cleanupRef.current?.();
    cleanupRef.current = controller.registerPane({
      id: resolvedId,
      title: resolvedTitle,
      element: elementRef.current,
      disabled: options.paneDisabled,
      order: options.paneOrder,
    });
    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [
    controller,
    resolvedId,
    resolvedTitle,
    options.paneDisabled,
    options.paneOrder,
  ]);

  if (options.paneDisabled) {
    return {
      ref: () => {},
      paneId: resolvedId,
      isActive: false,
      dataAttributes: {},
    };
  }

  if (!controller) {
    return {
      ref: () => {},
      paneId: resolvedId,
      isActive: false,
      dataAttributes: options.paneId
        ? {
            'data-pane-id': options.paneId,
            'data-pane-title': resolvedTitle,
            ...(options.paneOrder !== undefined
              ? { 'data-pane-order': String(options.paneOrder) }
              : {}),
          }
        : {},
    };
  }

  const isActive = activePaneId === resolvedId;
  return {
    ref: setRef,
    paneId: resolvedId,
    isActive,
    dataAttributes: {
      'data-pane-id': resolvedId,
      'data-pane-title': resolvedTitle,
      ...(options.paneOrder !== undefined
        ? { 'data-pane-order': String(options.paneOrder) }
        : {}),
      'data-pane-active': isActive ? 'true' : 'false',
    },
  };
}
