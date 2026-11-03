# CommandPalette and ColonCommand

## Overview

`CommandPalette` (`⌘K` / `Ctrl+K`) and `ColonCommand` (`:menu`) provide two keyboard-first navigation surfaces for `@cloudvoyant/helical-react` and `@cloudvoyant/helical-svelte`, powered by a shared hierarchical command tree (`TreeCollection<CommandNode>`) and fuzzy subsequence ranker (`fzf`) in `@cloudvoyant/helical-ui`.

- **`CommandPalette`**: A traditional shadcn-style modal (or inline) command palette with fuzzy search, grouped items, keyboard shortcut badges (`<Kbd>`), and multi-level nested submenu drill-down with breadcrumb pills.
- **`ColonCommand`**: A Helix/Vim-inspired `:` command-line prompt and completion popup supporting `:command <subcommand> <arg>` token parsing, aliases, `Tab` completion, nested subcommand menus, and inline error diagnostics.

## Design

### Layout

```text
CommandPalette (Modal or Inline):
+-----------------------------------------------------------------------+
| [Search Icon]  [Breadcrumb ›]  Type a command or search...     [Esc]  |
|-----------------------------------------------------------------------|
| Navigation                                                            |
|   Search Docs                                       [Future]  :search |
|   View GitHub                                                 :github |
| Appearance                                                            |
|   Change Theme                                          :theme    [›] |
|   Change Light/Dark Mode                                :mode     [›] |
|-----------------------------------------------------------------------|
| ↑↓ Navigate   ↵ Select / Drill in   ⌫ Back   Esc Close                |
+-----------------------------------------------------------------------+

ColonCommand (placement="bottom" | "center" | "top"):
+-----------------------------------------------------------------------+
| :theme catppuccin        Change Theme › Catppuccin           [Active] |
| :theme dracula           Change Theme › Dracula                       |
| :theme nord              Change Theme › Nord                          |
|-----------------------------------------------------------------------|
| : [theme ›] cat                                   [Tab Complete] [↵]  |
+-----------------------------------------------------------------------+
```

```mermaid
flowchart TD
  subgraph Core["@cloudvoyant/helical-ui/command (Framework-Agnostic)"]
    Tree["createCommandTree(items)\n(@zag-js/collection TreeCollection<CommandNode>)"]
    PalRes["resolveCommandLevel(tree, activePath, query)\n(Submenu children, breadcrumbs, deep root fzf search)"]
    ColRes["resolveColonCommandState(tree, rawInput)\n(Tokenize ':cmd sub', alias lookup, fzf completions, error state)"]
    Fzf["fzf (Fzf + byLengthAsc)\nSubsequence scoring & matchPositions"]
  end

  subgraph Wrappers["@cloudvoyant/helical-react & @cloudvoyant/helical-svelte"]
    Palette["CommandPalette\n(Dialog + Listbox + Highlight + Kbd + Badge)"]
    Colon["ColonCommand\n(Dialog + ':' Prompt ListboxInput + Popup ListboxContent)"]
  end

  Tree --> PalRes
  Tree --> ColRes
  Fzf --> PalRes
  Fzf --> ColRes
  PalRes --> Palette
  ColRes --> Colon
```

### Behavior

- **Default:** Both components accept `items?: CommandNode[]` or a prebuilt `collection?: TreeCollection<CommandNode>`. When opened at the root, `CommandPalette` renders top-level commands grouped by `group`, and `ColonCommand` focuses the monospaced `:` input and lists top-level commands.
- **Interaction (`CommandPalette`):** Typing filters commands via `fzf` (`byLengthAsc` tie-breaker) and highlights matched character indices (`matchPositions`) with `<mark>`. Selecting a branch item (`children.length > 0`) pushes `node.value` onto `activePath`, renders a clickable breadcrumb pill, and clears the filter input. Pressing `Backspace` on an empty input (or `Escape` inside a submenu) pops `activePath`. Selecting a leaf item invokes `node.onSelect` and `onSelectCommand`.
- **Interaction (`ColonCommand`):** Typing `:cmd sub` walks `TreeCollection` branches by `command`, `value`, or `aliases`, and ranks child completions for the trailing partial token with `fzf`. Pressing `Tab` autocompletes the highlighted suggestion (`:<command> ` for branch nodes). Pressing `Enter` on a branch node drills into `:<command> `; pressing `Enter` on a leaf node executes it and closes the prompt.
- **Loading, empty, and error:**
  - When zero commands are registered in the tree (`hasCommands === false`), both `CommandPalette` and `ColonCommand` render `"No commands registered."` (`noCommandsText`) in the UI.
  - When commands are registered (`hasCommands === true`) but a query matches zero items, both render `"No matching commands."` (`emptyText`).
  - Submitting an unrecognized command in `ColonCommand` renders an inline error banner (`Unknown command: ...`) without closing the prompt.
- **Accessibility:** Built on Ark UI's `Dialog` and `Listbox` (`ListboxInput autoHighlight`, `ListboxContent`, `ListboxItem`, `ListboxEmpty`) for `role="combobox"` / `role="listbox"` ARIA relationships, `aria-activedescendant` keyboard navigation, focus trapping, and polite `@zag-js/live-region` announcements.

## Implementation

### Public API

- **`@cloudvoyant/helical-ui`**: `createCommandTree`, `resolveCommandLevel`, `resolveColonCommandState`, `splitHighlightSegments`, `commandPaletteVariants`, `colonCommandVariants`, `CommandNode`, `CommandSelectContext`, `CommandBreadcrumb`, `CommandFlatItem`, `CommandLevelResolution`, `ColonCommandResolution`, `CommandPaletteProps`, `ColonCommandProps`, `CommandStyle`.
- **`@cloudvoyant/helical-react` & `@cloudvoyant/helical-svelte`**: `CommandPalette` and `ColonCommand`.

### State and Data Flow

```mermaid
stateDiagram-v2
  [*] --> Closed
  Closed --> RootOpen: Open (Mod+K / ':' / Trigger)

  state RootOpen {
    [*] --> CheckEmpty
    CheckEmpty --> NoCommandsUI: hasCommands === false ("No commands registered.")
    CheckEmpty --> BrowsingRoot: hasCommands === true
    BrowsingRoot --> FilteringRoot: Type search query / partial token
    FilteringRoot --> BrowsingRoot: Clear query
    BrowsingRoot --> SubmenuDrill: Select branch node (activePath.push / ':cmd ')
    FilteringRoot --> SubmenuDrill: Select branch node
    SubmenuDrill --> BrowsingRoot: Backspace on empty / Click root breadcrumb / Escape
  }

  RootOpen --> Closed: Execute leaf command (closeOnSelect !== false) / Escape at root
```

### Styling and Responsiveness

- Uses semantic tokens from `@cloudvoyant/helical-ui/src/theme.css` (`--popover`, `--popover-foreground`, `--muted`, `--accent`, `--border`, `--destructive`, `--primary`).
- `commandPaletteVariants` supports `size: 'sm' | 'md' | 'lg'`.
- `colonCommandVariants` supports `placement: 'bottom' | 'center' | 'top'` and `size: 'sm' | 'md' | 'lg'`.

### Maintainer Notes

- **Dependency inversion:** `fzf`, `@zag-js/collection`, `@zag-js/i18n-utils`, `@zag-js/live-region`, and `@tanstack/hotkeys` are inverted inside `@cloudvoyant/helical-ui/src/command.ts`. Third-party types from `fzf` are never re-exported from public entry points.
- **Interaction with `WhichKeyController`:** Both `CommandPalette` and `ColonCommand` render inside an open Ark `Dialog` (or focus a text `<input>`), which `WhichKeyController` automatically bypasses so typing inside command prompts never triggers single-key normal-mode bindings.
