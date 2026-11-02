// libs/helical-ui/src/editor/extensions/modal-keymap.ts
// Self-contained Tiptap/ProseMirror extension implementing Helix/Vim/Kakoune modal editing
// behind the ProseMirror-free ModalEditorTarget seam from ../../which-key/types.
// Designed to lift and shift intact with libs/helical-ui/src/editor/.
import { Extension, type Editor } from '@tiptap/core';
import { undo, redo } from '@tiptap/pm/history';
import { Slice, type Node as PMNode } from '@tiptap/pm/model';
import { NodeSelection, Plugin, PluginKey, Selection, TextSelection, type Transaction } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import {
  registerModalEditor,
  type KeybindingPreset,
  type KeymapMode,
  type ModalEditorTarget,
  type ModalMotion,
  type ModalOperator,
  type ModalSelectionTransform,
  type ModalTextObjectSpec,
} from '../../which-key/types';

export interface ModalKeymapOptions {
  enforceTitle?: boolean;
}

export interface SecondaryCursorRange {
  from: number;
  to: number;
  head: number;
}

export interface ModalKeymapPluginState {
  mode: KeymapMode;
  preset: KeybindingPreset;
  secondaryRanges: SecondaryCursorRange[];
  goalColumn: number | null;
}

export interface ModalKeymapStorage {
  target: ModalEditorTarget | null;
  mode: KeymapMode;
  preset: KeybindingPreset;
  registerSlice: Slice | null;
  cleanupDomRegistration?: () => void;
}

export const modalKeymapPluginKey = new PluginKey<ModalKeymapPluginState>('modalKeymap');

interface BlockDescriptor {
  node: PMNode;
  pos: number;
  start: number;
  end: number;
  isTextblock: boolean;
  isAtom: boolean;
}

interface WordToken {
  start: number;
  end: number;
  text: string;
  blockStart: number;
  blockEnd: number;
}

function collectLeafBlocks(doc: PMNode): BlockDescriptor[] {
  const blocks: BlockDescriptor[] = [];
  doc.descendants((node, pos) => {
    if (node.isTextblock) {
      blocks.push({
        node,
        pos,
        start: pos + 1,
        end: pos + 1 + node.content.size,
        isTextblock: true,
        isAtom: false,
      });
      return false;
    }
    if (node.isAtom && !node.isText) {
      blocks.push({
        node,
        pos,
        start: pos,
        end: pos + node.nodeSize,
        isTextblock: false,
        isAtom: true,
      });
      return false;
    }
    return true;
  });
  return blocks;
}

function collectWords(doc: PMNode): WordToken[] {
  const tokens: WordToken[] = [];
  doc.descendants((node, pos) => {
    if (!node.isTextblock) return true;
    const blockStart = pos + 1;
    const blockEnd = pos + 1 + node.content.size;
    let offset = 0;

    node.forEach((child) => {
      if (child.isText && child.text) {
        const regex = /\w+|[^\w\s]+/g;
        let match: RegExpExecArray | null = regex.exec(child.text);
        while (match !== null) {
          tokens.push({
            start: blockStart + offset + match.index,
            end: blockStart + offset + match.index + match[0].length,
            text: match[0],
            blockStart,
            blockEnd,
          });
          match = regex.exec(child.text);
        }
      } else if (child.isAtom) {
        tokens.push({
          start: blockStart + offset,
          end: blockStart + offset + child.nodeSize,
          text: '\uFFFC',
          blockStart,
          blockEnd,
        });
      }
      offset += child.nodeSize;
    });

    return false;
  });
  return tokens;
}

function dispatchTransaction(editor: Editor, tr: Transaction): void {
  editor.view.dispatch(tr);
}

export function isEditorInInsertMode(editor: Editor): boolean {
  const storage = (editor.storage as unknown as { modalKeymap?: ModalKeymapStorage }).modalKeymap;
  if (!storage) return true;
  return storage.mode === 'insert';
}

export function getEditorModalTarget(editor: Editor): ModalEditorTarget | undefined {
  const storage = (editor.storage as unknown as { modalKeymap?: ModalKeymapStorage }).modalKeymap;
  if (!storage) return undefined;
  if (editor.state.plugins.length === 0 && editor.extensionManager?.plugins?.length) {
    editor.view.updateState(editor.state.reconfigure({ plugins: editor.extensionManager.plugins }));
  }
  if (!storage.target) {
    storage.target = createModalTargetForEditor(editor, { enforceTitle: true });
  }
  return storage.target;
}

let sharedRegisterSlice: Slice | null = null;

function getCharEnd(doc: PMNode, pos: number): number {
  if (pos < 0 || pos >= doc.content.size) return pos;
  const $pos = doc.resolve(pos);
  if ($pos.parent.isTextblock && pos < $pos.end()) {
    const after = $pos.nodeAfter;
    if (after && after.isAtom && !after.isText) {
      return pos + after.nodeSize;
    }
    return pos + 1;
  }
  return pos;
}

function getCursorCharPos(doc: PMNode, sel: Selection): number {
  if (sel.empty) return sel.head;
  if (sel.head > sel.anchor) {
    const $head = doc.resolve(sel.head);
    if ($head.parent.isTextblock && sel.head > $head.start() && sel.head - 1 >= sel.from) {
      return sel.head - 1;
    }
  }
  return sel.head;
}

function getAnchorCharPos(doc: PMNode, sel: Selection): number {
  if (sel.empty) return sel.anchor;
  if (sel.head < sel.anchor) {
    const $anchor = doc.resolve(sel.anchor);
    if ($anchor.parent.isTextblock && sel.anchor > $anchor.start() && sel.anchor - 1 >= sel.from) {
      return sel.anchor - 1;
    }
  }
  return sel.anchor;
}

function createExtendedSelection(doc: PMNode, sel: Selection, nextCursorChar: number): TextSelection {
  const anchorChar = getAnchorCharPos(doc, sel);
  if (nextCursorChar >= anchorChar) {
    return TextSelection.create(doc, anchorChar, getCharEnd(doc, nextCursorChar));
  }
  return TextSelection.create(doc, getCharEnd(doc, anchorChar), nextCursorChar);
}

function createModalTargetForEditor(editor: Editor, options: ModalKeymapOptions): ModalEditorTarget {
  const getStorage = (): ModalKeymapStorage =>
    (editor.storage as unknown as { modalKeymap: ModalKeymapStorage }).modalKeymap;

  const updateMeta = (tr: Transaction, patch: Partial<ModalKeymapPluginState>): Transaction => {
    const prev = modalKeymapPluginKey.getState(editor.state) ?? {
      mode: getStorage().mode,
      preset: getStorage().preset,
      secondaryRanges: [],
      goalColumn: null,
    };
    return tr.setMeta(modalKeymapPluginKey, {
      ...prev,
      ...patch,
    });
  };

  return {
    move(motion: ModalMotion, { preset, mode, count }): boolean {
      const state = editor.state;
      const doc = state.doc;
      const sel = state.selection;
      const steps = Math.max(1, count);
      const isSelectionFirst = (preset === 'helix' || preset === 'kakoune') && mode === 'normal';
      const isExtend = mode === 'select';

      let tr = state.tr;
      const pluginState = modalKeymapPluginKey.getState(state);

      if (motion === 'wordForward' || motion === 'wordBackward' || motion === 'wordEnd') {
        const words = collectWords(doc);
        if (words.length === 0) return false;

        const cursor = sel.head;
        let targetWord: WordToken | undefined;

        if (motion === 'wordForward') {
          const idx = words.findIndex((w) => w.start > cursor);
          if (idx === -1) {
            targetWord = words[words.length - 1];
          } else {
            // In Helix, `w` selects from current word/cursor to next word start or selects the target word span
            const currentWord = words.find((w) => cursor >= w.start && cursor < w.end);
            if (isSelectionFirst && currentWord && sel.empty) {
              targetWord = words[Math.min(words.length - 1, words.indexOf(currentWord) + (steps - 1))];
            } else {
              targetWord = words[Math.min(words.length - 1, idx + steps - 1)];
            }
          }
        } else if (motion === 'wordEnd') {
          const idx = words.findIndex((w) => w.end > cursor);
          targetWord = idx === -1 ? words[words.length - 1] : words[Math.min(words.length - 1, idx + steps - 1)];
        } else {
          // wordBackward
          const backRef = sel.empty ? cursor : sel.from;
          let idx = -1;
          for (let i = words.length - 1; i >= 0; i -= 1) {
            if (words[i]!.start < backRef) {
              idx = i;
              break;
            }
          }
          targetWord = idx === -1 ? words[0] : words[Math.max(0, idx - (steps - 1))];
        }

        if (!targetWord) return false;

        if (isExtend) {
          const nextCursor =
            motion === 'wordBackward' ? targetWord.start : Math.max(targetWord.start, targetWord.end - 1);
          tr = tr.setSelection(createExtendedSelection(doc, sel, nextCursor));
        } else if (isSelectionFirst) {
          if (motion === 'wordBackward') {
            tr = tr.setSelection(TextSelection.create(doc, targetWord.end, targetWord.start));
          } else {
            tr = tr.setSelection(TextSelection.create(doc, targetWord.start, targetWord.end));
          }
        } else {
          // Vim normal mode: collapsed cursor movement
          const destPos = motion === 'wordEnd' ? Math.max(targetWord.start, targetWord.end - 1) : targetWord.start;
          tr = tr.setSelection(TextSelection.create(doc, destPos));
        }

        tr = updateMeta(tr, { goalColumn: null });
        dispatchTransaction(editor, tr.scrollIntoView());
        return true;
      }

      if (motion === 'lineSelect') {
        const blocks = collectLeafBlocks(doc).filter((b) => b.isTextblock);
        if (blocks.length === 0) return false;

        const currentBlockIdx = blocks.findIndex((b) => sel.from >= b.start && sel.from <= b.end);
        const startIdx = currentBlockIdx === -1 ? 0 : currentBlockIdx;
        const startBlock = blocks[startIdx]!;

        const alreadyCoversCurrent = sel.from <= startBlock.start && sel.to >= startBlock.end && !sel.empty;

        let endBlockIdx = startIdx + (steps - 1);
        if (alreadyCoversCurrent) {
          const currentEndIdx = blocks.findIndex((b) => sel.to >= b.start && sel.to <= b.end);
          endBlockIdx = (currentEndIdx === -1 ? startIdx : currentEndIdx) + steps;
        }
        const endBlock = blocks[Math.min(blocks.length - 1, endBlockIdx)]!;

        tr = tr.setSelection(TextSelection.create(doc, startBlock.start, endBlock.end));
        tr = updateMeta(tr, { goalColumn: null });
        dispatchTransaction(editor, tr.scrollIntoView());
        return true;
      }

      if (motion === 'lineStart' || motion === 'lineEnd') {
        const cursorPos = getCursorCharPos(doc, sel);
        const $head = doc.resolve(cursorPos);
        if (isExtend) {
          const dest = motion === 'lineStart' ? $head.start() : Math.max($head.start(), $head.end() - 1);
          tr = tr.setSelection(createExtendedSelection(doc, sel, dest));
        } else {
          const dest = motion === 'lineStart' ? $head.start() : $head.end();
          tr = tr.setSelection(TextSelection.create(doc, dest));
        }
        tr = updateMeta(tr, { goalColumn: null });
        dispatchTransaction(editor, tr.scrollIntoView());
        return true;
      }

      if (motion === 'docStart' || motion === 'docEnd') {
        const edgeSel = motion === 'docStart' ? Selection.atStart(doc) : Selection.atEnd(doc);
        if (isExtend) {
          const dest = motion === 'docStart' ? edgeSel.head : Math.max(edgeSel.$head.start(), edgeSel.head - 1);
          tr = tr.setSelection(createExtendedSelection(doc, sel, dest));
        } else {
          tr = tr.setSelection(edgeSel);
        }
        tr = updateMeta(tr, { goalColumn: null });
        dispatchTransaction(editor, tr.scrollIntoView());
        return true;
      }

      if (motion === 'paragraphForward' || motion === 'paragraphBackward') {
        const dir = motion === 'paragraphForward' ? 1 : -1;
        const blocks = collectLeafBlocks(doc);
        if (blocks.length === 0) return false;

        const cursorPos = getCursorCharPos(doc, sel);
        let currentIdx = blocks.findIndex((b) =>
          b.isTextblock ? cursorPos >= b.start && cursorPos <= b.end : sel.from === b.pos,
        );
        if (currentIdx === -1) {
          currentIdx = 0;
        }
        const targetIdx = Math.max(0, Math.min(blocks.length - 1, currentIdx + dir * steps));
        const targetBlock = blocks[targetIdx]!;

        if (targetBlock.isAtom && NodeSelection.isSelectable(targetBlock.node)) {
          tr = tr.setSelection(NodeSelection.create(doc, targetBlock.pos));
        } else if (isExtend) {
          const dest = dir > 0 ? Math.max(targetBlock.start, targetBlock.end - 1) : targetBlock.start;
          tr = tr.setSelection(createExtendedSelection(doc, sel, dest));
        } else if (isSelectionFirst) {
          tr = tr.setSelection(TextSelection.create(doc, targetBlock.start, targetBlock.end));
        } else {
          tr = tr.setSelection(TextSelection.create(doc, targetBlock.start));
        }

        tr = updateMeta(tr, { goalColumn: null });
        dispatchTransaction(editor, tr.scrollIntoView());
        return true;
      }

      if (motion === 'left' || motion === 'right') {
        const dir = motion === 'left' ? -1 : 1;
        const blocks = collectLeafBlocks(doc);
        if (blocks.length === 0) return false;

        let targetPos = getCursorCharPos(doc, sel);
        for (let i = 0; i < steps; i += 1) {
          const $pos = doc.resolve(targetPos);
          const nextInBlock = targetPos + dir;
          if ($pos.parent.isTextblock && nextInBlock >= $pos.start() && nextInBlock <= $pos.end()) {
            const childNode = dir > 0 ? $pos.nodeAfter : $pos.nodeBefore;
            if (childNode && childNode.isAtom && !childNode.isText && NodeSelection.isSelectable(childNode)) {
              const atomPos = dir > 0 ? targetPos : targetPos - childNode.nodeSize;
              tr = tr.setSelection(NodeSelection.create(doc, atomPos));
              tr = updateMeta(tr, { goalColumn: null });
              dispatchTransaction(editor, tr.scrollIntoView());
              return true;
            }
            targetPos = nextInBlock;
          } else {
            const found = Selection.findFrom(
              doc.resolve(Math.max(0, Math.min(doc.content.size, targetPos + dir))),
              dir,
              true,
            );
            if (found) {
              targetPos = found.head;
            }
          }
        }

        tr = tr.setSelection(
          isExtend ? createExtendedSelection(doc, sel, targetPos) : TextSelection.create(doc, targetPos),
        );
        tr = updateMeta(tr, { goalColumn: null });
        dispatchTransaction(editor, tr.scrollIntoView());
        return true;
      }

      if (motion === 'down' || motion === 'up') {
        const dir = motion === 'down' ? 1 : -1;
        const blocks = collectLeafBlocks(doc);
        if (blocks.length === 0) return false;

        const cursorPos = getCursorCharPos(doc, sel);
        let currentIdx = blocks.findIndex((b) =>
          b.isTextblock ? cursorPos >= b.start && cursorPos <= b.end : sel.from === b.pos,
        );
        if (currentIdx === -1) {
          currentIdx = 0;
        }
        const currentBlock = blocks[currentIdx]!;
        const currentColumn = currentBlock.isTextblock ? cursorPos - currentBlock.start : 0;
        const goalCol = pluginState?.goalColumn ?? currentColumn;

        const targetIdx = Math.max(0, Math.min(blocks.length - 1, currentIdx + dir * steps));
        const targetBlock = blocks[targetIdx]!;

        if (targetBlock.isAtom && NodeSelection.isSelectable(targetBlock.node)) {
          tr = tr.setSelection(NodeSelection.create(doc, targetBlock.pos));
        } else {
          const maxTargetPos = targetBlock.end > targetBlock.start ? targetBlock.end - 1 : targetBlock.start;
          const nextHead = Math.min(targetBlock.start + goalCol, isExtend ? maxTargetPos : targetBlock.end);
          tr = tr.setSelection(
            isExtend ? createExtendedSelection(doc, sel, nextHead) : TextSelection.create(doc, nextHead),
          );
        }

        tr = updateMeta(tr, { goalColumn: goalCol });
        dispatchTransaction(editor, tr.scrollIntoView());
        return true;
      }

      return false;
    },

    selectTextObject(spec: ModalTextObjectSpec): boolean {
      const state = editor.state;
      const doc = state.doc;
      const sel = state.selection;
      const isInner = spec.startsWith('i');
      const kind = spec.slice(1);

      if (kind === 'w') {
        const words = collectWords(doc);
        if (words.length === 0) return false;
        const cursor = sel.head;
        const matched =
          words.find((w) => cursor >= w.start && cursor <= w.end) ??
          words.find((w) => w.start >= cursor) ??
          words[words.length - 1]!;

        let from = matched.start;
        let to = matched.end;

        if (!isInner) {
          // Include trailing whitespace in the same block, or leading whitespace if at end of line
          const $end = doc.resolve(to);
          const afterText = doc.textBetween(to, $end.end(), '');
          const trailingWs = /^\s+/.exec(afterText);
          if (trailingWs) {
            to += trailingWs[0].length;
          } else {
            const $start = doc.resolve(from);
            const beforeText = doc.textBetween($start.start(), from, '');
            const leadingWs = /\s+$/.exec(beforeText);
            if (leadingWs) {
              from -= leadingWs[0].length;
            }
          }
        }

        const tr = state.tr.setSelection(TextSelection.create(doc, from, to));
        dispatchTransaction(editor, tr.scrollIntoView());
        return true;
      }

      const matchesNodeType = (typeName: string): boolean => {
        switch (kind) {
          case 'p':
            return typeName === 'paragraph' || typeName === 'heading';
          case 'c':
            return typeName === 'codeBlock';
          case 'n':
            return typeName === 'notice' || typeName === 'blockquote';
          case 'l':
            return typeName === 'listItem' || typeName === 'taskItem';
          default:
            return false;
        }
      };

      const $head = sel.$head;
      let targetNode: PMNode | null = null;
      let targetPos = -1;

      if (kind === 'p') {
        for (let d = $head.depth; d >= 1; d -= 1) {
          const ancestor = $head.node(d);
          if (ancestor.type.name === 'paragraph') {
            targetNode = ancestor;
            targetPos = $head.before(d);
            break;
          }
        }
        if (!targetNode) {
          doc.descendants((node, pos) => {
            if (targetNode) return false;
            if (node.type.name === 'paragraph') {
              targetNode = node;
              targetPos = pos;
              return false;
            }
            return true;
          });
        }
      }

      if (!targetNode) {
        for (let d = $head.depth; d >= 1; d -= 1) {
          const ancestor = $head.node(d);
          if (matchesNodeType(ancestor.type.name)) {
            targetNode = ancestor;
            targetPos = $head.before(d);
            break;
          }
        }
      }

      if (!targetNode) {
        doc.descendants((node, pos) => {
          if (targetNode) return false;
          if (matchesNodeType(node.type.name)) {
            targetNode = node;
            targetPos = pos;
            return false;
          }
          return true;
        });
      }

      if (!targetNode || targetPos < 0) return false;

      const foundNode: PMNode = targetNode;
      let firstTextStart = -1;
      let lastTextEnd = -1;

      foundNode.descendants((child, relPos) => {
        if (child.isTextblock) {
          const absStart = targetPos + 1 + relPos + 1;
          const absEnd = absStart + child.content.size;
          if (firstTextStart === -1) firstTextStart = absStart;
          lastTextEnd = absEnd;
          return false;
        }
        return true;
      });

      if (foundNode.isTextblock) {
        firstTextStart = targetPos + 1;
        lastTextEnd = targetPos + 1 + foundNode.content.size;
      }

      if (firstTextStart === -1 || lastTextEnd === -1) return false;

      if (isInner) {
        const tr = state.tr.setSelection(TextSelection.create(doc, firstTextStart, lastTextEnd));
        dispatchTransaction(editor, tr.scrollIntoView());
        return true;
      }

      // Around ('a*'): include full node range or surrounding block boundaries
      const nodeStart = Selection.findFrom(doc.resolve(targetPos), 1, true)?.from ?? firstTextStart;
      const nodeEnd = Selection.findFrom(doc.resolve(targetPos + foundNode.nodeSize), -1, true)?.to ?? lastTextEnd;
      const tr = state.tr.setSelection(
        TextSelection.create(doc, Math.min(nodeStart, firstTextStart), Math.max(nodeEnd, lastTextEnd)),
      );
      dispatchTransaction(editor, tr.scrollIntoView());
      return true;
    },

    transformSelection(action: ModalSelectionTransform): boolean {
      const state = editor.state;
      const doc = state.doc;
      const sel = state.selection;
      const pluginState = modalKeymapPluginKey.getState(state);
      const currentSecondary = pluginState?.secondaryRanges ?? [];

      if (action === 'collapse') {
        let tr = state.tr.setSelection(TextSelection.create(doc, getCursorCharPos(doc, sel)));
        tr = updateMeta(tr, { secondaryRanges: [] });
        dispatchTransaction(editor, tr);
        return true;
      }

      if (action === 'flip') {
        if (sel.empty) return false;
        const tr = state.tr.setSelection(TextSelection.create(doc, sel.head, sel.anchor));
        dispatchTransaction(editor, tr);
        return true;
      }

      if (action === 'keepPrimary') {
        const tr = updateMeta(state.tr, { secondaryRanges: [] });
        dispatchTransaction(editor, tr);
        return true;
      }

      if (action === 'addCursorBelow' || action === 'addCursorAbove') {
        const dir = action === 'addCursorBelow' ? 1 : -1;
        const blocks = collectLeafBlocks(doc).filter((b) => b.isTextblock);
        if (blocks.length < 2) return false;

        const referenceHead =
          currentSecondary.length > 0 ? currentSecondary[currentSecondary.length - 1]!.head : sel.head;
        const currentIdx = blocks.findIndex((b) => referenceHead >= b.start && referenceHead <= b.end);
        if (currentIdx === -1) return false;
        const nextIdx = currentIdx + dir;
        if (nextIdx < 0 || nextIdx >= blocks.length) return false;

        const currBlock = blocks[currentIdx]!;
        const nextBlock = blocks[nextIdx]!;
        const colOffset = referenceHead - currBlock.start;
        const selLength = Math.max(0, sel.to - sel.from);

        const nextFrom = Math.min(nextBlock.start + colOffset, nextBlock.end);
        const nextTo = Math.min(nextFrom + selLength, nextBlock.end);
        const nextRange: SecondaryCursorRange = {
          from: nextFrom,
          to: nextTo,
          head: nextTo,
        };

        const tr = updateMeta(state.tr, {
          secondaryRanges: [...currentSecondary, nextRange],
        });
        dispatchTransaction(editor, tr);
        return true;
      }

      return false;
    },

    execOperator(op: ModalOperator, { count }): { enterInsert?: boolean; yankedText?: string } | boolean {
      const state = editor.state;
      const doc = state.doc;
      const sel = state.selection;
      const storage = getStorage();
      const pluginState = modalKeymapPluginKey.getState(state);
      const secondaryRanges = pluginState?.secondaryRanges ?? [];

      if (op === 'undo') {
        if (typeof editor.commands?.undo === 'function') {
          const ok = editor.commands.undo();
          if (ok) return true;
        }
        return undo(state, (tr) => dispatchTransaction(editor, tr));
      }

      if (op === 'redo') {
        if (typeof editor.commands?.redo === 'function') {
          const ok = editor.commands.redo();
          if (ok) return true;
        }
        return redo(state, (tr) => dispatchTransaction(editor, tr));
      }

      if (op === 'insertStart') {
        let tr = state.tr.setSelection(TextSelection.create(doc, sel.from));
        tr = updateMeta(tr, { mode: 'insert', secondaryRanges: [] });
        storage.mode = 'insert';
        dispatchTransaction(editor, tr);
        return { enterInsert: true };
      }

      if (op === 'appendEnd') {
        const dest = sel.empty ? Math.min(sel.$head.end(), sel.to + 1) : sel.to;
        let tr = state.tr.setSelection(TextSelection.create(doc, dest));
        tr = updateMeta(tr, { mode: 'insert', secondaryRanges: [] });
        storage.mode = 'insert';
        dispatchTransaction(editor, tr);
        return { enterInsert: true };
      }

      if (op === 'openBelow' || op === 'openAbove') {
        const $pos = sel.$head;
        const blockDepth = Math.max(1, $pos.depth);
        const beforeBlock = $pos.before(blockDepth);
        const afterBlock = $pos.after(blockDepth);

        const enforceH1 = options.enforceTitle !== false;
        const isFirstTitle =
          enforceH1 && beforeBlock === 0 && doc.firstChild?.type.name === 'heading' && doc.firstChild.attrs.level === 1;

        const insertPos = op === 'openBelow' || isFirstTitle ? afterBlock : beforeBlock;
        const paragraphType = state.schema.nodes.paragraph;
        if (!paragraphType) return false;

        const newParagraph = paragraphType.create();
        let tr = state.tr.insert(insertPos, newParagraph);
        tr = tr.setSelection(TextSelection.create(tr.doc, insertPos + 1));
        tr = updateMeta(tr, { mode: 'insert', secondaryRanges: [] });
        storage.mode = 'insert';
        dispatchTransaction(editor, tr.scrollIntoView());
        return { enterInsert: true };
      }

      // Resolve effective range for yank / delete / change
      let primaryFrom = sel.from;
      let primaryTo = sel.to;
      if (primaryFrom === primaryTo) {
        const $head = sel.$head;
        if ($head.parent.isTextblock) {
          if (op === 'yank') {
            primaryFrom = $head.start();
            primaryTo = $head.end();
          } else {
            primaryTo = Math.min($head.end(), primaryFrom + Math.max(1, count));
          }
        }
      }

      if (op === 'yank') {
        const slice = doc.slice(primaryFrom, primaryTo);
        storage.registerSlice = slice;
        sharedRegisterSlice = slice;
        const yankedText = doc.textBetween(primaryFrom, primaryTo, '\n');
        if (yankedText && typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
          void navigator.clipboard.writeText(yankedText).catch(() => {});
        }
        const tr = state.tr.setSelection(TextSelection.create(doc, primaryFrom));
        dispatchTransaction(editor, tr);
        return { enterInsert: false, yankedText };
      }

      if (op === 'delete' || op === 'change') {
        const enforceH1 = options.enforceTitle !== false;
        const firstChild = doc.firstChild;
        const hasTitleH1 = enforceH1 && firstChild?.type.name === 'heading' && firstChild.attrs.level === 1;
        const titleEnd = hasTitleH1 ? 1 + firstChild!.content.size : -1;

        const clampRange = (from: number, to: number): { from: number; to: number } => {
          if (hasTitleH1 && from <= titleEnd) {
            const clampedFrom = Math.max(1, from);
            const clampedTo = to <= titleEnd + 1 ? Math.min(titleEnd, to) : to;
            return { from: clampedFrom, to: Math.max(clampedFrom, clampedTo) };
          }
          return { from, to };
        };

        const primaryClamped = clampRange(primaryFrom, primaryTo);
        const slice = doc.slice(primaryClamped.from, primaryClamped.to);
        storage.registerSlice = slice;
        sharedRegisterSlice = slice;

        const allRanges = [
          primaryClamped,
          ...secondaryRanges.map((r) =>
            clampRange(r.from, r.to > r.from ? r.to : Math.min(doc.content.size, r.from + 1)),
          ),
        ].sort((a, b) => b.from - a.from);

        let tr = state.tr;
        for (const r of allRanges) {
          if (r.to > r.from) {
            tr = tr.delete(r.from, r.to);
          }
        }

        const nextPos = Math.min(tr.doc.content.size, primaryClamped.from);
        const resolved = Selection.near(tr.doc.resolve(nextPos));
        tr = tr.setSelection(resolved);
        const nextMode: KeymapMode = op === 'change' ? 'insert' : storage.mode;
        storage.mode = nextMode;
        tr = updateMeta(tr, { mode: nextMode, secondaryRanges: [] });
        dispatchTransaction(editor, tr.scrollIntoView());
        return { enterInsert: op === 'change' };
      }

      if (op === 'pasteAfter' || op === 'pasteBefore') {
        const slice = storage.registerSlice ?? sharedRegisterSlice;
        if (!slice || slice.size === 0) return false;

        let insertPos = op === 'pasteAfter' ? sel.to : sel.from;
        // If pasting a block slice or pasting after a collapsed cursor in normal mode
        if (op === 'pasteAfter' && sel.empty && sel.$head.parent.isTextblock && insertPos < sel.$head.end()) {
          insertPos += 1;
        }

        let tr = state.tr;
        for (let i = 0; i < Math.max(1, count); i += 1) {
          tr = tr.replaceRange(insertPos, insertPos, slice);
        }
        dispatchTransaction(editor, tr.scrollIntoView());
        return true;
      }

      return false;
    },

    setModalState({ mode: nextMode, preset: nextPreset }): void {
      const storage = getStorage();
      const prev = modalKeymapPluginKey.getState(editor.state);
      if (
        storage.mode === nextMode &&
        storage.preset === nextPreset &&
        prev?.mode === nextMode &&
        prev?.preset === nextPreset
      ) {
        return;
      }
      storage.mode = nextMode;
      storage.preset = nextPreset;
      if (prev && prev.mode === nextMode && prev.preset === nextPreset && prev.secondaryRanges.length === 0) {
        return;
      }
      try {
        const tr = updateMeta(editor.state.tr, {
          mode: nextMode,
          preset: nextPreset,
          ...(nextMode === 'insert' ? { secondaryRanges: [] } : {}),
        });
        dispatchTransaction(editor, tr);
      } catch {
        // Ignore if editor is mid-destruction
      }
    },

    hasActiveSuggestion(): boolean {
      const doc = typeof document !== 'undefined' ? document : null;
      if (!doc) return false;
      const activePopup = doc.querySelector(
        '[data-slash-menu-surface], [data-mention-menu-surface], [data-editor-slash-menu], [data-editor-mention-menu], .tippy-box[data-state="visible"]',
      );
      if (activePopup) return true;

      let root: Element | Document = doc;
      try {
        root = editor.view.dom.parentElement ?? doc;
      } catch {
        root = doc;
      }
      if (root.querySelector('[role="dialog"]')) return true;

      const toolbars = Array.from(root.querySelectorAll<HTMLElement>('[role="toolbar"]'));
      for (const tb of toolbars) {
        const style = doc.defaultView?.getComputedStyle(tb);
        if (style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0') {
          return true;
        }
      }
      return false;
    },
  };
}

export const ModalKeymap = Extension.create<ModalKeymapOptions, ModalKeymapStorage>({
  name: 'modalKeymap',

  addOptions() {
    return {
      enforceTitle: true,
    };
  },

  addStorage() {
    return {
      target: null,
      mode: 'insert',
      preset: 'helix',
      registerSlice: null,
      cleanupDomRegistration: undefined,
    };
  },

  onCreate() {
    const target = this.storage.target ?? createModalTargetForEditor(this.editor, this.options);
    this.storage.target = target;

    try {
      const dom = this.editor.view.dom;
      if (typeof HTMLElement !== 'undefined' && dom instanceof HTMLElement) {
        this.storage.cleanupDomRegistration = registerModalEditor(dom, target);
      }
    } catch {
      // Headless editor without a mounted DOM view
    }
  },

  onDestroy() {
    this.storage.cleanupDomRegistration?.();
    this.storage.cleanupDomRegistration = undefined;
    this.storage.target = null;
  },

  addProseMirrorPlugins() {
    const { storage, editor, options } = this;
    if (!storage.target) {
      storage.target = createModalTargetForEditor(editor, options);
    }

    return [
      new Plugin<ModalKeymapPluginState>({
        key: modalKeymapPluginKey,
        state: {
          init(): ModalKeymapPluginState {
            return {
              mode: storage.mode,
              preset: storage.preset,
              secondaryRanges: [],
              goalColumn: null,
            };
          },
          apply(tr, prev): ModalKeymapPluginState {
            const meta = tr.getMeta(modalKeymapPluginKey) as Partial<ModalKeymapPluginState> | undefined;
            if (meta) {
              return {
                mode: meta.mode ?? prev.mode,
                preset: meta.preset ?? prev.preset,
                secondaryRanges: meta.secondaryRanges ?? prev.secondaryRanges,
                goalColumn: meta.goalColumn !== undefined ? meta.goalColumn : prev.goalColumn,
              };
            }
            if (tr.docChanged && prev.secondaryRanges.length > 0) {
              return {
                ...prev,
                secondaryRanges: prev.secondaryRanges.map((r) => ({
                  from: tr.mapping.map(r.from),
                  to: tr.mapping.map(r.to),
                  head: tr.mapping.map(r.head),
                })),
              };
            }
            return prev;
          },
        },
        view(editorView) {
          if (
            typeof HTMLElement !== 'undefined' &&
            editorView.dom instanceof HTMLElement &&
            storage.target &&
            !storage.cleanupDomRegistration
          ) {
            storage.cleanupDomRegistration = registerModalEditor(editorView.dom, storage.target);
          }
          return {
            destroy() {
              storage.cleanupDomRegistration?.();
              storage.cleanupDomRegistration = undefined;
            },
          };
        },
        props: {
          handleDOMEvents: {
            mousedown(view) {
              if (storage.mode !== 'insert') {
                storage.mode = 'insert';
                try {
                  const prev = modalKeymapPluginKey.getState(view.state);
                  if (prev && prev.mode !== 'insert') {
                    view.dispatch(
                      view.state.tr.setMeta(modalKeymapPluginKey, {
                        ...prev,
                        mode: 'insert',
                        secondaryRanges: [],
                      }),
                    );
                  }
                } catch {
                  // View may have been destroyed
                }
              }
              return false;
            },
          },
          attributes(state) {
            const pluginState = modalKeymapPluginKey.getState(state);
            const currentMode = pluginState?.mode ?? 'insert';
            const currentPreset = pluginState?.preset ?? 'helix';
            return {
              'data-modal-mode': currentMode,
              'data-modal-preset': currentPreset,
            };
          },
          decorations(state) {
            const pluginState = modalKeymapPluginKey.getState(state);
            if (!pluginState || pluginState.mode === 'insert') {
              return DecorationSet.empty;
            }

            const decos: Decoration[] = [];
            const { doc, selection } = state;
            const head = selection.head;

            const pushCursorDecoration = (pos: number, isMulti = false) => {
              if (pos < 0 || pos > doc.content.size) return;
              const $pos = doc.resolve(pos);
              const nodeAfter = $pos.nodeAfter;
              if (nodeAfter?.isText && nodeAfter.text && nodeAfter.text.length > 0 && pos + 1 <= doc.content.size) {
                decos.push(
                  Decoration.inline(
                    pos,
                    pos + 1,
                    isMulti
                      ? { class: 'pm-multi-cursor', 'data-pm-multi-cursor': 'true' }
                      : { class: 'pm-modal-cursor', 'data-pm-modal-cursor': pluginState.mode },
                  ),
                );
                return;
              }
              if (typeof document !== 'undefined') {
                decos.push(
                  Decoration.widget(
                    pos,
                    () => {
                      const span = document.createElement('span');
                      span.className = isMulti
                        ? 'pm-multi-cursor pm-modal-cursor-eol'
                        : 'pm-modal-cursor pm-modal-cursor-eol';
                      span.setAttribute(
                        isMulti ? 'data-pm-multi-cursor' : 'data-pm-modal-cursor',
                        isMulti ? 'true' : pluginState.mode,
                      );
                      span.setAttribute('aria-hidden', 'true');
                      span.textContent = '\u00a0';
                      return span;
                    },
                    {
                      side: 1,
                      key: isMulti ? `multi-cursor-${pos}` : `modal-cursor-${pos}-${pluginState.mode}`,
                    },
                  ),
                );
              }
            };

            if (selection.empty) {
              pushCursorDecoration(head, false);
            } else if (selection.from < selection.to) {
              decos.push(
                Decoration.inline(selection.from, selection.to, {
                  class: 'pm-modal-selection',
                  'data-pm-modal-selection': pluginState.mode,
                }),
              );
              const $head = doc.resolve(head);
              const cursorPos =
                selection.head > selection.anchor
                  ? $head.nodeBefore?.isText && head - 1 >= selection.from
                    ? head - 1
                    : head
                  : head;
              pushCursorDecoration(cursorPos, false);
            }

            for (const range of pluginState.secondaryRanges) {
              if (range.from >= 0 && range.to <= doc.content.size && range.from < range.to) {
                decos.push(
                  Decoration.inline(range.from, range.to, {
                    class: 'pm-multi-selection',
                    'data-pm-multi-selection': 'true',
                  }),
                );
              } else {
                pushCursorDecoration(range.head, true);
              }
            }

            return DecorationSet.create(doc, decos);
          },
        },
      }),
    ];
  },
});
