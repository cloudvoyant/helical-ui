# WhichKey, WhichKeyExplorer, WhichKeyMode, and Kbd

## Overview

`WhichKey` is a Helix-inspired floating chord discovery panel that displays active multi-key prefix chords (`Space`, `g`, `z`, `m`, `Ctrl-w`) and their available child bindings in `@cloudvoyant/helical-react` and `@cloudvoyant/helical-svelte`. It is decoupled from keyboard mode concerns: keyboard mode and chord execution live in `WhichKeyController` (and are optionally surfaced via `<WhichKeyMode />`), whereas `<WhichKey />` is a purely visual chord menu and jump-label overlay.

- **`WhichKey`**: Portaled floating chord menu (`variant="helix" | "modern" | "classic"`), plus the 2D `JumpOverlay` when `mode === 'jump'`. Supports `leaderOnly` so consumers or users can choose whether the popup appears on all chord prefixes (`Space`, `g`, `z`, `m`) or only when the chord starts with `leaderKey` (`Space`).
- **`WhichKeyExplorer`**: Searchable `<leader>?` (`?`) modal (`Dialog` + `Listbox` + `Highlight`) listing all active bindings grouped by category with `<Kbd>` chord sequences.
- **`WhichKeyMode`**: Standalone status badge displaying the active modal state (`normal`, `select`, `insert`, `jump`, or `·lock`).
- **`Kbd`**: Semantic `<kbd>` keycap and multi-step sequence primitive powered by `formatKeycap` and `formatHotkeySequence`.

## Design

### Layout

```text
WhichKey (variant="helix", bottom-right floating panel):
+-----------------------------------------------------------+
| Leader   Space » w                            [⌫]   [Esc] |
|-----------------------------------------------------------|
| Focus Left          [h]   | Focus Down                [j] |
| Focus Up            [k]   | Focus Right               [l] |
| Go to >             [g]   | Window >                  [w] |
|-----------------------------------------------------------|
|               (scroll-fade bottom edge)                   |
+-----------------------------------------------------------+

WhichKeyExplorer (? / Space ? modal):
+-----------------------------------------------------------+
| Keybindings                                 18 bindings   |
| [Search keybindings...                                  ] |
|-----------------------------------------------------------|
| GOTO                                                      |
|   Go to top                                       [g] [g] |
|   Go to bottom                                    [g] [e] |
|   Jump to 2-char label                            [g] [w] |
+-----------------------------------------------------------+
```

```mermaid
flowchart TD
  subgraph Core["@cloudvoyant/helical-ui (Framework-Agnostic)"]
    Ctrl["createWhichKeyController\n(Trie state, activePath, leaderOnly, jumpTargets)"]
    Fmt["formatWhichKeyLabel / formatHotkeySequence\n(Clean submenu labels & platform keycap glyphs)"]
    Variants["whichKeyVariants / kbdVariants\n(cva orthogonal layout & size axes)"]
  end

  subgraph UI["@cloudvoyant/helical-react & @cloudvoyant/helical-svelte"]
    WK["WhichKey\n(Portal + Presence + Scroll fade + ChevronRight submenus + JumpOverlay)"]
    Exp["WhichKeyExplorer\n(Dialog + Listbox + Highlight + Kbd)"]
    Mode["WhichKeyMode\n(Standalone mode/preset badge)"]
    KbdComp["Kbd\n(<kbd> keycap & sequence renderer)"]
  end

  Ctrl --> WK
  Ctrl --> Exp
  Ctrl --> Mode
  Fmt --> WK
  Fmt --> KbdComp
  Variants --> WK
  Variants --> KbdComp
```

### Behavior

- **Default:** `<WhichKey />` stays unmounted (`<Presence present={effectiveOpen} lazyMount unmountOnExit>`) while `activePath` is empty. When a prefix key with child bindings is pressed, `WhichKey` mounts in a `<Portal>` without stealing DOM focus.
- **Leader-Only Mode (`leaderOnly`):** When `leaderOnly` is `true` (via `WhichKeyProvider`, `controller.setLeaderOnly(true)`, or `<WhichKey leaderOnly />`), pressing non-leader prefixes such as `g`, `z`, or `m` keeps `isOpen` false so the popup does not appear, while `activePath` still advances and executes multi-key chords (`gg`, `ge`, `gw`, `zt`, `zz`). Pressing `leaderKey` (`Space`) opens the `WhichKey` popup as usual.
- **Interaction:** Submenu items render a clean label (`Go to`, `Window`, `View`, `Match`) followed by a `<ChevronRight />` icon (`data-group="true"`). Clicking an item or pressing its key advances `activePath` (for submenus) or invokes the leaf command and closes the prefix. Clicking `<Kbd>⌫</Kbd>` or pressing `Backspace` pops one prefix level (`stepBackPrefix()`); clicking `<Kbd>Esc</Kbd>` in the top-right header or pressing `Escape` closes the popup (`closePrefix()`).
- **Loading, empty, and error:** If a chord path has no matching items for the current mode, `isOpen` evaluates to `false` and the popup closes cleanly. In `WhichKeyExplorer`, unmatched queries render `<ListboxEmpty>` (`No keybindings found.`).
- **Accessibility:** `WhichKey` renders `role="region"` with `aria-label={title || 'WhichKey commands'}` and registers with `@zag-js/dismissable` (`trackDismissableBranch`) so pressing `Escape` dismisses `WhichKey` first without closing an underlying modal `Dialog`. State transitions are announced via a polite `@zag-js/live-region`.

## Implementation

### Public API

- **`@cloudvoyant/helical-ui`**: `whichKeyVariants`, `whichKeyBodyVariants`, `whichKeyHeaderBase`, `whichKeyTitleBase`, `whichKeyBreadcrumbBase`, `whichKeyItemBase`, `whichKeyItemLabelBase`, `whichKeyFooterBase`, `formatWhichKeyLabel`, `kbdVariants`, `kbdSequenceBase`, `formatKeycap`, `formatHotkeySequence`, `WhichKeyProps`, `WhichKeyModeProps`, `WhichKeyExplorerProps`, `KbdProps`.
- **`@cloudvoyant/helical-react` & `@cloudvoyant/helical-svelte`**: `WhichKey`, `WhichKeyExplorer`, `WhichKeyMode`, `WhichKeyProvider`, `Pane`, `Kbd`, `useWhichKey`, `useWhichKeyController`, `useKeymap`, `useKeymapCommand`, `useRegisterPane`.

### State and Data Flow

```mermaid
stateDiagram-v2
  [*] --> Idle: activePath = [] (isOpen = false)
  Idle --> NonLeaderPrefix: Press 'g' / 'z' / 'm'
  NonLeaderPrefix -->PopupOpen: leaderOnly === false
  NonLeaderPrefix --> SilentChord: leaderOnly === true (isOpen = false)
  Idle --> PopupOpen: Press leaderKey ('Space')

  state PopupOpen {
    [*] --> RootPrefix
    RootPrefix --> NestedSubmenu: Press group key ('w', 'g')
    NestedSubmenu --> RootPrefix: Backspace / Click [⌫]
  }

  SilentChord --> Idle: Press leaf key ('g' -> gg, 'e' -> ge) / Escape
  PopupOpen --> Idle: Press leaf key / Escape / Click [Esc]
```

### Styling and Responsiveness

- Uses semantic tokens (`--popover`, `--popover-foreground`, `--primary`, `--muted`, `--accent`, `--border`) from `libs/helical-ui/src/theme.css`.
- Body uses `<Scroll viewportClassName="scroll-fade scroll-fade-12 no-scrollbar max-h-72">` with an empty `h-2` footer spacer (`whichKeyFooterBase`) for a subtle bottom scroll fade.
- Automatically disables keyboard interception on coarse-pointer / mobile viewports (`disableOnMobile = true` by default).

### Maintainer Notes

- **Separation of concerns:** `WhichKey` never renders mode badges or preset names; keyboard mode belongs to the hotkey controller and `<WhichKeyMode />`.
- **Dismissable layering:** Both the `WhichKey` panel and the `JumpOverlay` register with `controller.trackBranchElement` (`@zag-js/dismissable`) while visible so nested `Escape` handling respects open Ark `Dialog` layers.
