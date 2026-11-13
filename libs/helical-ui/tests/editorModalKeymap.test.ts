import { afterEach, describe, expect, it } from 'vitest';
import { Editor } from '@tiptap/core';
import { NodeSelection, TextSelection } from '@tiptap/pm/state';
import { buildExtensions, getEditorModalTarget, modalKeymapPluginKey } from '@cloudvoyant/helical-ui';

// =============================================================================
// Setup & Helpers
// =============================================================================

const noopNodeView = () => () => ({}) as never;
const nodeViews = {
  image: noopNodeView,
  urlMention: noopNodeView,
  linkPreview: noopNodeView,
  codeBlock: noopNodeView,
  notice: noopNodeView,
};

const activeEditors: Editor[] = [];

function createTestEditor(content: Record<string, unknown>, enforceTitle = true): Editor {
  const editor = new Editor({
    extensions: buildExtensions({ nodeViews, enforceTitle }),
    content,
  });
  activeEditors.push(editor);
  const target = getEditorModalTarget(editor);
  target?.setModalState({ mode: 'normal', preset: 'helix' });
  return editor;
}

function getSelectedText(editor: Editor): string {
  const { from, to } = editor.state.selection;
  return editor.state.doc.textBetween(from, to, '\n');
}

afterEach(() => {
  while (activeEditors.length > 0) {
    activeEditors.pop()?.destroy();
  }
});

// =============================================================================
// Tests
// =============================================================================

describe('Given a Tiptap/ProseMirror Editor instance built with buildExtensions (including ModalKeymap)', () => {
  describe('When move("wordForward" | "wordBackward" | "wordEnd" | "lineSelect") is called in Helix normal mode', () => {
    it('Then sets a ProseMirror TextSelection spanning the target word or line', () => {
      // Arrange
      const editor = createTestEditor({
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'Helix Modal Title' }],
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'First line of prose.' }],
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Second line below.' }],
          },
        ],
      });
      const target = getEditorModalTarget(editor)!;

      // Act & Assert: w selects first word
      target.move('docStart', { preset: 'helix', mode: 'normal', count: 1 });
      target.move('wordForward', { preset: 'helix', mode: 'normal', count: 1 });
      expect(editor.state.selection).toBeInstanceOf(TextSelection);
      expect(getSelectedText(editor)).toBe('Helix');

      // Act & Assert: next w selects second word
      target.move('wordForward', { preset: 'helix', mode: 'normal', count: 1 });
      expect(getSelectedText(editor)).toBe('Modal');

      // Act & Assert: b selects previous word
      target.move('wordBackward', { preset: 'helix', mode: 'normal', count: 1 });
      expect(getSelectedText(editor)).toBe('Helix');

      // Act & Assert: x selects full line, and repeated x extends to next line
      target.move('lineSelect', { preset: 'helix', mode: 'normal', count: 1 });
      expect(getSelectedText(editor)).toBe('Helix Modal Title');
      target.move('lineSelect', { preset: 'helix', mode: 'normal', count: 1 });
      expect(getSelectedText(editor)).toBe('Helix Modal Title\nFirst line of prose.');

      // Act & Assert: } (paragraphForward) and { (paragraphBackward) jump between paragraphs without selecting the whole paragraph in normal mode
      target.move('docStart', { preset: 'helix', mode: 'normal', count: 1 });
      target.move('paragraphForward', { preset: 'helix', mode: 'normal', count: 1 });
      expect(editor.state.selection.empty).toBe(true);
      expect(editor.state.selection.$head.parent.textContent).toBe('First line of prose.');
      target.move('paragraphForward', { preset: 'helix', mode: 'normal', count: 1 });
      expect(editor.state.selection.empty).toBe(true);
      expect(editor.state.selection.$head.parent.textContent).toBe('Second line below.');
      target.move('paragraphBackward', { preset: 'helix', mode: 'normal', count: 1 });
      expect(editor.state.selection.empty).toBe(true);
      expect(editor.state.selection.$head.parent.textContent).toBe('First line of prose.');
    });
  });

  describe('When move("down" | "up") crosses an atom node (image / linkPreview / urlMention)', () => {
    it('Then creates a ProseMirror NodeSelection on the atom node', () => {
      // Arrange
      const editor = createTestEditor({
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'Title' }],
          },
          {
            type: 'imageNode',
            attrs: { src: 'https://example.com/photo.png', alt: 'Photo' },
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'After image' }],
          },
        ],
      });
      const target = getEditorModalTarget(editor)!;

      // Act
      target.move('docStart', { preset: 'helix', mode: 'normal', count: 1 });
      target.move('down', { preset: 'helix', mode: 'normal', count: 1 });

      // Assert
      expect(editor.state.selection).toBeInstanceOf(NodeSelection);
      expect((editor.state.selection as NodeSelection).node.type.name).toBe('imageNode');
    });
  });

  describe('When selectTextObject("iw" | "ip" | "ic" | "in" | "il") is called', () => {
    it('Then selects the inner/outer ResolvedPos range of the word, paragraph, codeBlock, notice, or listItem', () => {
      // Arrange
      const editor = createTestEditor({
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'Title' }],
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Paragraph target text' }],
          },
          {
            type: 'codeBlock',
            attrs: { language: 'ts' },
            content: [{ type: 'text', text: 'const x = 42;' }],
          },
          {
            type: 'notice',
            attrs: { variant: 'info', title: 'Info' },
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Inside callout notice' }],
              },
            ],
          },
        ],
      });
      const target = getEditorModalTarget(editor)!;

      // Act & Assert: move to paragraph and select ip
      target.move('docStart', { preset: 'helix', mode: 'normal', count: 1 });
      target.move('down', { preset: 'helix', mode: 'normal', count: 1 });
      target.selectTextObject('ip', { preset: 'helix', mode: 'normal' });
      expect(getSelectedText(editor)).toBe('Paragraph target text');

      // Act & Assert: select iw inside paragraph
      target.move('lineStart', { preset: 'helix', mode: 'normal', count: 1 });
      target.selectTextObject('iw', { preset: 'helix', mode: 'normal' });
      expect(getSelectedText(editor)).toBe('Paragraph');

      // Act & Assert: select ic on codeBlock
      target.move('down', { preset: 'helix', mode: 'normal', count: 1 });
      target.selectTextObject('ic', { preset: 'helix', mode: 'normal' });
      expect(getSelectedText(editor)).toBe('const x = 42;');

      // Act & Assert: select in on notice
      target.move('down', { preset: 'helix', mode: 'normal', count: 1 });
      target.selectTextObject('in', { preset: 'helix', mode: 'normal' });
      expect(getSelectedText(editor)).toBe('Inside callout notice');
    });
  });

  describe('When transformSelection("flip" | "collapse" | "addCursorBelow" | "keepPrimary") is called', () => {
    it('Then flips anchor/head, collapses to head, or updates multi-cursor DecorationSet ranges', () => {
      // Arrange
      const editor = createTestEditor({
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'Alpha Beta' }],
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Gamma Delta' }],
          },
        ],
      });
      const target = getEditorModalTarget(editor)!;

      // Act & Assert: select word then flip anchor/head
      target.move('docStart', { preset: 'helix', mode: 'normal', count: 1 });
      target.move('wordForward', { preset: 'helix', mode: 'normal', count: 1 });
      const { anchor: initialAnchor, head: initialHead } = editor.state.selection;
      expect(initialAnchor).toBeLessThan(initialHead);

      target.transformSelection('flip');
      expect(editor.state.selection.anchor).toBe(initialHead);
      expect(editor.state.selection.head).toBe(initialAnchor);

      // Act & Assert: addCursorBelow (C) and keepPrimary (,)
      target.transformSelection('addCursorBelow');
      const pluginStateAfterAdd = modalKeymapPluginKey.getState(editor.state);
      expect(pluginStateAfterAdd?.secondaryRanges).toHaveLength(1);

      target.transformSelection('keepPrimary');
      const pluginStateAfterClear = modalKeymapPluginKey.getState(editor.state);
      expect(pluginStateAfterClear?.secondaryRanges).toHaveLength(0);

      // Act & Assert: collapse (;)
      target.transformSelection('collapse');
      expect(editor.state.selection.empty).toBe(true);
    });
  });

  describe('When execOperator("yank" | "delete" | "change" | "pasteAfter" | "undo" | "redo") is called', () => {
    it('Then preserves rich Slice marks/nodes across yank and paste and clamps enforced H1 title deletions', () => {
      // Arrange
      const editor = createTestEditor({
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'Protected Title' }],
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                marks: [{ type: 'bold' }],
                text: 'BoldWord',
              },
              { type: 'text', text: ' tail' },
            ],
          },
        ],
      });
      const target = getEditorModalTarget(editor)!;

      // Act & Assert: deleting the enforced H1 title line clears its text but preserves the H1 node
      target.move('docStart', { preset: 'helix', mode: 'normal', count: 1 });
      target.move('lineSelect', { preset: 'helix', mode: 'normal', count: 1 });
      target.execOperator('delete', { preset: 'helix', mode: 'normal', count: 1 });
      expect(editor.state.doc.firstChild?.type.name).toBe('heading');
      expect(editor.state.doc.firstChild?.attrs.level).toBe(1);
      expect(editor.state.doc.firstChild?.textContent).toBe('');

      // Act & Assert: yank bold word in paragraph and paste it
      target.move('down', { preset: 'helix', mode: 'normal', count: 1 });
      target.move('lineStart', { preset: 'helix', mode: 'normal', count: 1 });
      target.move('wordForward', { preset: 'helix', mode: 'normal', count: 1 });
      expect(getSelectedText(editor)).toBe('BoldWord');

      target.execOperator('yank', { preset: 'helix', mode: 'normal', count: 1 });
      target.move('lineEnd', { preset: 'helix', mode: 'normal', count: 1 });
      target.execOperator('pasteAfter', { preset: 'helix', mode: 'normal', count: 1 });

      const jsonStr = JSON.stringify(editor.getJSON());
      expect(editor.state.doc.textContent).toContain('BoldWord tailBoldWord');
      expect(jsonStr).toContain('"type":"bold"');
    });

    it('Then undoes and redoes transactions via ProseMirror history', () => {
      // Arrange
      const editor = createTestEditor(
        {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Hello World' }],
            },
          ],
        },
        false,
      );
      const target = getEditorModalTarget(editor)!;

      // Act
      target.move('docStart', { preset: 'helix', mode: 'normal', count: 1 });
      target.move('wordForward', { preset: 'helix', mode: 'normal', count: 1 });
      target.execOperator('delete', { preset: 'helix', mode: 'normal', count: 1 });
      const textAfterDelete = editor.state.doc.textContent;

      target.execOperator('undo', { preset: 'helix', mode: 'normal', count: 1 });
      const textAfterUndo = editor.state.doc.textContent;

      target.execOperator('redo', { preset: 'helix', mode: 'normal', count: 1 });
      const textAfterRedo = editor.state.doc.textContent;

      // Assert
      expect(textAfterDelete).toBe(' World');
      expect(textAfterUndo).toBe('Hello World');
      expect(textAfterRedo).toBe(' World');
    });

    it('Then expands selection characterwise in select mode on the first cursor motion (right, left, down, up)', () => {
      // Arrange
      const editor = createTestEditor({
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'Alpha' }],
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Bravo' }],
          },
        ],
      });
      const target = getEditorModalTarget(editor)!;

      // Act & Assert: at 'A' (pos 1), moving right once in select mode selects 'Al' (2 chars)
      target.move('docStart', { preset: 'helix', mode: 'normal', count: 1 });
      target.setModalState({ mode: 'select', preset: 'helix' });
      target.move('right', { preset: 'helix', mode: 'select', count: 1 });
      expect(getSelectedText(editor)).toBe('Al');

      // Moving right again selects 'Alp' (3 chars)
      target.move('right', { preset: 'helix', mode: 'select', count: 1 });
      expect(getSelectedText(editor)).toBe('Alp');

      // Moving left once shrinks back to 'Al'
      target.move('left', { preset: 'helix', mode: 'select', count: 1 });
      expect(getSelectedText(editor)).toBe('Al');

      // Collapse on 'l' (pos 2) and move left once in select mode -> selects 'Al'
      target.transformSelection('collapse');
      target.move('left', { preset: 'helix', mode: 'select', count: 1 });
      expect(getSelectedText(editor)).toBe('Al');
    });

    it('Then distinguishes "in" (inner notice body) from "an" (full notice block) and yanks/deletes/pastes notices, images, and link previews cleanly', () => {
      // Arrange
      const editor = createTestEditor({
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'Article Title' }],
          },
          {
            type: 'notice',
            attrs: { variant: 'warning', title: 'Watch out' },
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Careful inside notice' }],
              },
            ],
          },
          {
            type: 'imageNode',
            attrs: { src: 'https://example.com/diagram.png', alt: 'Architecture diagram' },
          },
          {
            type: 'linkPreview',
            attrs: { url: 'https://example.com/guide', kind: 'bookmark', title: 'Guide' },
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Closing paragraph' }],
          },
        ],
      });
      const target = getEditorModalTarget(editor)!;

      // Act & Assert: m i n + delete clears only the notice text while keeping the notice block
      target.move('docStart', { preset: 'helix', mode: 'normal', count: 1 });
      target.move('down', { preset: 'helix', mode: 'normal', count: 1 });
      target.selectTextObject('in', { preset: 'helix', mode: 'normal' });
      target.execOperator('delete', { preset: 'helix', mode: 'normal', count: 1 });
      expect(editor.state.doc.child(1).type.name).toBe('notice');
      expect(editor.state.doc.child(1).attrs.title).toBe('Watch out');
      expect(editor.state.doc.child(1).textContent).toBe('');

      // Undo to restore notice body
      target.execOperator('undo', { preset: 'helix', mode: 'normal', count: 1 });
      expect(editor.state.doc.child(1).textContent).toBe('Careful inside notice');

      // Act & Assert: m a n + yank + pasteAfter duplicates the entire notice block with attrs preserved
      target.selectTextObject('an', { preset: 'helix', mode: 'normal' });
      const yankNoticeRes = target.execOperator('yank', { preset: 'helix', mode: 'normal', count: 1 });
      expect(typeof yankNoticeRes === 'object' && yankNoticeRes.yankedText).toContain('Watch out');
      target.execOperator('pasteAfter', { preset: 'helix', mode: 'normal', count: 1 });
      expect(editor.state.doc.child(1).type.name).toBe('notice');
      expect(editor.state.doc.child(2).type.name).toBe('notice');
      expect(editor.state.doc.child(2).attrs).toMatchObject({ variant: 'warning', title: 'Watch out' });
      expect(editor.state.doc.child(2).textContent).toBe('Careful inside notice');

      // Act & Assert: m a n + delete removes the duplicate notice block without leaving an empty shell
      target.selectTextObject('an', { preset: 'helix', mode: 'normal' });
      target.execOperator('delete', { preset: 'helix', mode: 'normal', count: 1 });
      let noticeCount = 0;
      editor.state.doc.forEach((child) => {
        if (child.type.name === 'notice') noticeCount += 1;
      });
      expect(noticeCount).toBe(1);

      // Act & Assert: navigate to imageNode, yank, pasteAfter, and delete
      target.move('docStart', { preset: 'helix', mode: 'normal', count: 1 });
      target.move('down', { preset: 'helix', mode: 'normal', count: 2 });
      expect(editor.state.selection).toBeInstanceOf(NodeSelection);
      expect((editor.state.selection as NodeSelection).node.type.name).toBe('imageNode');

      const yankImgRes = target.execOperator('yank', { preset: 'helix', mode: 'normal', count: 1 });
      expect(typeof yankImgRes === 'object' && yankImgRes.yankedText).toBe(
        '![Architecture diagram](https://example.com/diagram.png)',
      );

      target.execOperator('pasteAfter', { preset: 'helix', mode: 'normal', count: 1 });
      let imageCount = 0;
      editor.state.doc.forEach((child) => {
        if (child.type.name === 'imageNode') imageCount += 1;
      });
      expect(imageCount).toBe(2);

      // Delete the pasted imageNode
      target.execOperator('delete', { preset: 'helix', mode: 'normal', count: 1 });
      imageCount = 0;
      editor.state.doc.forEach((child) => {
        if (child.type.name === 'imageNode') imageCount += 1;
      });
      expect(imageCount).toBe(1);
    });
  });
});
