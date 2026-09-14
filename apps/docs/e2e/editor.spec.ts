/*
 * apps/docs/e2e/editor.spec.ts
 * Behavior and parity coverage for the Editor through both framework demos.
 */
import { selectFramework } from './helpers';
import { test, expect, type Locator, type Page } from '@playwright/test';

const FRAMEWORKS = ['react', 'svelte'] as const;

function island(page: Page, framework: string, example: string) {
  return page.locator(`[data-example-id="${example}"] [data-example-preview] [data-fw="${framework}"]`);
}

function surface(page: Page, framework: string, example: string) {
  return island(page, framework, example).locator('.ProseMirror').first();
}

async function caretRect(page: Page) {
  return page.evaluate(() => {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return null;
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    return { left: rect.left, top: rect.top, bottom: rect.bottom };
  });
}

async function expectCompactValidation(input: Locator, error: Locator) {
  await expect(error).toBeVisible();
  await expect(error).toHaveCSS('margin-bottom', '0px');
  const [inputBox, errorBox] = await Promise.all([input.boundingBox(), error.boundingBox()]);
  expect(inputBox).not.toBeNull();
  expect(errorBox).not.toBeNull();
  const gap = errorBox!.y - (inputBox!.y + inputBox!.height);
  expect(gap).toBeGreaterThanOrEqual(0);
  expect(gap).toBeLessThanOrEqual(5);
}

for (const framework of FRAMEWORKS) {
  test.describe(`Editor · ${framework}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('components/editor');
      await selectFramework(page, framework);
    });

    test('mounts with the seeded H1 title', async ({ page }) => {
      const h1 = surface(page, framework, 'default').locator('h1').first();
      await expect(h1).toHaveText(/Getting Started/);
    });

    test('enforces the H1 title and shows its placeholder', async ({ page }) => {
      const editor = surface(page, framework, 'heading-enforcement');
      await editor.click();
      await page.keyboard.press('ControlOrMeta+a');
      await page.keyboard.press('Delete');
      // The titleHeading plugin restores the H1, so the first child stays an H1.
      await expect(async () => {
        const firstTag = await editor.evaluate((el) => el.firstElementChild?.tagName ?? '');
        expect(firstTag).toBe('H1');
      }).toPass();
      const title = editor.locator('h1').first();
      await expect(title).toHaveAttribute('data-placeholder', 'Untitled');

      // Persistent title guidance is visible away from the title and hidden while it owns the cursor.
      await page.keyboard.press('Enter');
      await expect
        .poll(() => title.evaluate((element) => getComputedStyle(element, '::before').content))
        .toBe('"Untitled"');
      const [placeholderColor, titleColor] = await title.evaluate((element) => [
        getComputedStyle(element, '::before').color,
        getComputedStyle(element).color,
      ]);
      expect(placeholderColor).not.toBe(titleColor);
      await title.click();
      await expect.poll(() => title.evaluate((element) => getComputedStyle(element, '::before').content)).toBe('none');
    });

    test('shows the body placeholder only on the active empty block', async ({ page }) => {
      const editor = surface(page, framework, 'slash-menu');
      const emptyBlocks = editor.locator('p.is-empty[data-placeholder]');
      await emptyBlocks.nth(2).click();
      await expect
        .poll(() =>
          emptyBlocks.evaluateAll(
            (elements) => elements.filter((element) => getComputedStyle(element, '::before').content !== 'none').length,
          ),
        )
        .toBe(1);
      await expect
        .poll(() => emptyBlocks.nth(2).evaluate((element) => getComputedStyle(element, '::before').content))
        .toContain("Type '/' for commands");

      await emptyBlocks.nth(3).click();
      await expect
        .poll(() => emptyBlocks.nth(2).evaluate((element) => getComputedStyle(element, '::before').content))
        .toBe('none');
    });

    test('persists serialized body text across reload', async ({ page }) => {
      const editor = surface(page, framework, 'client-persistence');
      await editor.locator('p').first().click();
      await page.keyboard.press('End');
      await page.keyboard.type(' PERSISTED_TEXT');
      await expect(editor).toContainText('PERSISTED_TEXT');
      await expect
        .poll(() => page.evaluate(() => localStorage.getItem('vortex-editor-client-persistence-v1')))
        .toContain('PERSISTED_TEXT');

      await page.reload();
      await selectFramework(page, framework);
      await expect(surface(page, framework, 'client-persistence')).toContainText('PERSISTED_TEXT');
    });

    test('markdown input rule turns "# " into an h2', async ({ page }) => {
      const editor = surface(page, framework, 'slash-menu');
      await editor.locator('p').last().click();
      await page.keyboard.type('# Section');
      await expect(editor.locator('h2')).toContainText('Section');
      await expect(editor.locator('h1')).toHaveCount(1);
    });

    test('the bubble menu appears on selection', async ({ page }) => {
      const editor = surface(page, framework, 'bubble-menu');
      const para = editor.locator('p').first();
      await para.click();
      await para.evaluate((el) => {
        const range = document.createRange();
        range.selectNodeContents(el);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      });

      // Svelte's BubbleMenu is always in the DOM and hides with `opacity: 0`, which
      // toBeVisible() ignores — so an opacity assertion is the only one that proves the menu
      // actually opened. Assert the toolbar is both present AND opaque.
      const toolbar = island(page, framework, 'bubble-menu').getByLabel(/bold/i).first();
      const toolbarSurface = island(page, framework, 'bubble-menu')
        .getByRole('toolbar', { name: 'Text formatting' })
        .first();
      await expect(toolbar).toBeVisible();
      await expect(toolbarSurface).toHaveCSS('opacity', '1');

      // Stronger still: the toolbar must actually apply a mark.
      await toolbar.click();
      await expect(editor.locator('strong')).toHaveCount(1);

      await page.keyboard.press('Escape');
      if (framework === 'svelte') await expect(toolbarSurface).toHaveCSS('opacity', '0');
      else await expect(toolbarSurface).not.toBeVisible();

      await editor.click();
      if (framework === 'svelte') await expect(toolbarSurface).toHaveCSS('opacity', '0');
      else await expect(toolbarSurface).not.toBeVisible();
    });

    test('the slash menu scrolls, keeps keyboard selection stable, and locks only the demo', async ({ page }) => {
      const editor = surface(page, framework, 'slash-menu');
      const demoScroll = page.locator('[data-example-id="slash-menu"] [data-editor-demo-scroll]').first();
      await editor.locator('p').last().scrollIntoViewIfNeeded();
      await editor.locator('p').last().click();
      await page.keyboard.press('End');
      await page.keyboard.type('/');

      const menu = island(page, framework, 'slash-menu');
      for (const title of ['Heading 1', 'Quote', 'Notice', 'YouTube']) {
        await expect(menu.getByText(title, { exact: true }).first()).toBeVisible();
      }
      await expect(menu.getByText('Table', { exact: true })).toHaveCount(0);
      await expect(menu.getByText('Mermaid', { exact: true })).toHaveCount(0);
      await expect(menu.locator('[data-slash-icon="YouTube"] svg')).toBeVisible();

      const menuScroll = menu.locator('[data-slash-menu-scroll]').first();
      await expect.poll(() => menuScroll.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true);
      const demoBefore = await demoScroll.evaluate((element) => element.scrollTop);
      const menuBefore = await menuScroll.evaluate((element) => element.scrollTop);
      await menuScroll.hover();
      await page.mouse.wheel(0, 240);
      await expect.poll(() => menuScroll.evaluate((element) => element.scrollTop)).toBeGreaterThan(menuBefore);
      await expect.poll(() => demoScroll.evaluate((element) => element.scrollTop)).toBe(demoBefore);

      await page.mouse.move(0, 0);
      for (let i = 0; i < 30; i += 1) await page.keyboard.press('ArrowDown');
      const selected = menu.locator('[data-slash-selected]').first();
      await expect(selected).toContainText('Bookmark');
      await expect(selected).toBeInViewport();

      await demoScroll.hover({ position: { x: 4, y: 4 } });
      await page.mouse.wheel(0, -200);
      await expect.poll(() => demoScroll.evaluate((element) => element.scrollTop)).toBe(demoBefore);
    });

    test('keeps a filtered above-caret slash menu anchored to the caret', async ({ page }) => {
      const editor = surface(page, framework, 'slash-menu');
      await editor.locator('p').last().scrollIntoViewIfNeeded();
      await editor.locator('p').last().click();
      await page.keyboard.press('End');
      await page.keyboard.type('/');

      const menuSurface = island(page, framework, 'slash-menu').locator('[data-slash-menu-surface]');
      await expect(menuSurface).toBeVisible();
      const initialCaret = await caretRect(page);
      expect(initialCaret).not.toBeNull();
      await page.evaluate((caretTop) => window.scrollBy(0, caretTop - (window.innerHeight - 32)), initialCaret!.top);

      const fullBox = await menuSurface.boundingBox();
      const fullCaret = await caretRect(page);
      expect(fullBox).not.toBeNull();
      expect(fullCaret).not.toBeNull();
      expect(fullCaret!.top - (fullBox!.y + fullBox!.height)).toBeGreaterThanOrEqual(2);
      expect(fullCaret!.top - (fullBox!.y + fullBox!.height)).toBeLessThanOrEqual(8);
      expect(Math.abs(fullBox!.x - fullCaret!.left)).toBeLessThanOrEqual(8);

      await page.keyboard.type('you');
      await expect(island(page, framework, 'slash-menu').getByText('YouTube', { exact: true }).first()).toBeVisible();
      await expect
        .poll(() => menuSurface.evaluate((element) => (element as HTMLElement).offsetHeight))
        .toBeLessThan(fullBox!.height);
      const filteredBox = await menuSurface.boundingBox();
      const filteredCaret = await caretRect(page);
      expect(filteredBox).not.toBeNull();
      expect(filteredCaret).not.toBeNull();
      expect(filteredCaret!.top - (filteredBox!.y + filteredBox!.height)).toBeGreaterThanOrEqual(2);
      expect(filteredCaret!.top - (filteredBox!.y + filteredBox!.height)).toBeLessThanOrEqual(8);
    });

    test('edits both the notice title and body', async ({ page }) => {
      const editor = surface(page, framework, 'slash-menu');
      await editor.locator('p').last().click();
      await page.keyboard.press('End');
      await page.keyboard.type('/notice');
      await island(page, framework, 'slash-menu').getByText('Notice', { exact: true }).first().click();

      const title = editor.getByLabel('Notice title').last();
      await title.fill('Important');
      await expect(title).toHaveValue('Important');
      const notice = title.locator('xpath=ancestor::*[@data-node-view-wrapper][1]');
      const body = notice.locator('[data-node-view-content] p').first();
      await body.click();
      await page.keyboard.type('Read this body');
      await expect(body).toContainText('Read this body');
      await expect(body).toHaveCSS('margin-top', '0px');
      await expect(body).toHaveCSS('margin-bottom', '0px');
      await expect(notice.locator('[role="status"]')).toHaveCSS('padding-top', '4px');

      await page.keyboard.press('Home');
      await page.keyboard.press('ArrowUp');
      await expect(title).toBeFocused();
      await title.press('ArrowDown');
      await expect(editor).toBeFocused();
    });

    test('changes code language without a command placeholder or nested box', async ({ page }) => {
      const editor = surface(page, framework, 'slash-menu');
      await editor.locator('p').last().click();
      await page.keyboard.press('End');
      await page.keyboard.type('/code');
      await island(page, framework, 'slash-menu').getByText('Code Block', { exact: true }).first().click();

      const codeBlock = editor.locator('[data-code-block]').last();
      const code = codeBlock.locator('pre.editor-code-content');
      await expect(codeBlock.locator('[data-placeholder="Type \'/\' for commands"]')).toHaveCount(0);
      await expect(code).toHaveCSS('margin-top', '0px');
      await expect(code).toHaveCSS('border-top-width', '0px');

      const language = codeBlock.locator('[data-scope="select"][data-part="trigger"]');
      await language.click();
      await page.getByRole('option', { name: 'Python', exact: true }).click();
      await expect(language).toContainText('Python');

      await code.locator('code').click();
      await page.keyboard.type('def answer(): return "yes"');
      await expect(code.locator('.hljs-keyword').first()).toBeVisible();
      await expect(code.locator('.hljs-string').first()).toBeVisible();
      await expect(code.locator('.hljs-keyword').first()).not.toHaveCSS('color', 'rgb(0, 0, 0)');
    });

    test('anchors bookmark input to the cursor and locks the demo scroll', async ({ page }) => {
      const editor = surface(page, framework, 'slash-menu');
      const demoScroll = page.locator('[data-example-id="slash-menu"] [data-editor-demo-scroll]').first();
      await editor.locator('p').last().scrollIntoViewIfNeeded();
      await editor.locator('p').last().click();
      await page.keyboard.press('End');
      await page.keyboard.type('/bookmark');
      await island(page, framework, 'slash-menu').getByText('Bookmark', { exact: true }).first().click();

      const dialog = island(page, framework, 'slash-menu')
        .getByRole('dialog', { name: /bookmark/i })
        .first();
      await expect(dialog).toBeVisible();
      const beforeScroll = await demoScroll.evaluate((element) => element.scrollTop);
      const beforeBox = await dialog.boundingBox();
      expect(beforeBox).not.toBeNull();

      await demoScroll.hover({ position: { x: 4, y: 4 } });
      await page.mouse.wheel(0, -120);
      await expect.poll(() => demoScroll.evaluate((element) => element.scrollTop)).toBe(beforeScroll);

      await demoScroll.evaluate((element) => {
        element.scrollTop = Math.max(0, element.scrollTop - 20);
      });
      const afterBox = await dialog.boundingBox();
      expect(afterBox).not.toBeNull();
      // The surface may flip from above to below the cursor as viewport space changes. What must
      // never happen is a stale fixed position: it moves and remains fully reachable.
      expect(Math.abs(afterBox!.y - beforeBox!.y)).toBeGreaterThan(1);
      expect(afterBox!.y).toBeGreaterThanOrEqual(0);
      expect(afterBox!.y + afterBox!.height).toBeLessThanOrEqual(await page.evaluate(() => window.innerHeight));

      const bookmarkUrl = dialog.locator('input');
      await bookmarkUrl.fill('https://example.com/bookmark');
      await bookmarkUrl.press('Enter');
      await expect(editor).toContainText('Vortex bookmark');
    });

    test('places insertion overlays flush with the caret', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 1200 });
      await page.reload();
      await selectFramework(page, framework);

      const editor = surface(page, framework, 'slash-menu');
      const example = island(page, framework, 'slash-menu');
      const body = editor.locator('p.is-empty').first();

      for (const [query, title] of [
        ['bookmark', 'Bookmark'],
        ['image', 'Image'],
        ['youtube', 'YouTube'],
      ] as const) {
        await body.click();
        await page.keyboard.press('Home');
        await page.keyboard.type(`/${query}`);
        const caret = await caretRect(page);
        expect(caret).not.toBeNull();

        await example.getByText(title, { exact: true }).first().click();
        const dialog = example.getByRole('dialog').first();
        const box = await dialog.boundingBox();
        expect(box).not.toBeNull();
        const belowGap = box!.y - caret!.bottom;
        const aboveGap = caret!.top - (box!.y + box!.height);
        const gap = belowGap >= 0 ? belowGap : aboveGap;
        expect(gap).toBeGreaterThanOrEqual(0);
        expect(gap).toBeLessThanOrEqual(5);
        await dialog.getByRole('button', { name: /cancel/i }).click();
      }
    });

    test('keeps block overlay validation flush with its input', async ({ page }) => {
      const editor = surface(page, framework, 'slash-menu');
      const example = island(page, framework, 'slash-menu');
      const openBlock = async (query: string, title: string) => {
        await editor.locator('p').last().click();
        await page.keyboard.press('End');
        await page.keyboard.type(`/${query}`);
        await example.getByText(title, { exact: true }).first().click();
      };

      await openBlock('bookmark', 'Bookmark');
      const bookmark = example.getByRole('dialog', { name: /bookmark/i });
      const bookmarkUrl = bookmark.locator('input');
      await bookmarkUrl.fill('not-a-url');
      await bookmarkUrl.press('Enter');
      await expectCompactValidation(bookmarkUrl, bookmark.getByRole('alert'));
      await bookmark.getByRole('button', { name: /cancel/i }).click();

      await openBlock('image', 'Image');
      const image = example.getByRole('dialog', { name: 'Insert image' });
      await image.getByRole('button', { name: 'URL', exact: true }).click();
      const imageUrl = image.locator('input[type="url"]');
      await imageUrl.fill('not-a-url');
      await imageUrl.press('Enter');
      await expectCompactValidation(imageUrl, image.getByRole('alert'));
      await image.getByRole('button', { name: /cancel/i }).click();

      await openBlock('youtube', 'YouTube');
      const youTube = example.getByRole('dialog', { name: 'Embed YouTube video' });
      const youTubeUrl = youTube.getByLabel('YouTube URL');
      await youTubeUrl.fill('not-a-url');
      await youTubeUrl.press('Enter');
      await expectCompactValidation(youTubeUrl, youTube.getByRole('alert'));
    });

    test('anchors the link editor below the bubble menu and locks the demo scroll', async ({ page }) => {
      const editor = surface(page, framework, 'bubble-menu');
      const paragraph = editor.locator('p').first();
      await paragraph.click();
      await paragraph.evaluate((element) => {
        const range = document.createRange();
        range.selectNodeContents(element);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      });

      const example = island(page, framework, 'bubble-menu');
      await example.getByLabel('Link', { exact: true }).first().click();
      const toolbar = example.getByRole('toolbar', { name: 'Text formatting' }).first();
      const dialog = example.getByRole('dialog', { name: 'Edit link' }).first();
      await expect(dialog).toBeVisible();
      const [toolbarBox, dialogBox] = await Promise.all([toolbar.boundingBox(), dialog.boundingBox()]);
      expect(toolbarBox).not.toBeNull();
      expect(dialogBox).not.toBeNull();
      expect(dialogBox!.y).toBeGreaterThanOrEqual(toolbarBox!.y + toolbarBox!.height - 1);
      expect(dialogBox!.y).toBeLessThanOrEqual(toolbarBox!.y + toolbarBox!.height + 24);

      const demoScroll = page.locator('[data-example-id="bubble-menu"] [data-editor-demo-scroll]').first();
      const before = await demoScroll.evaluate((element) => element.scrollTop);
      await demoScroll.hover({ position: { x: 4, y: 4 } });
      await page.mouse.wheel(0, 200);
      await expect.poll(() => demoScroll.evaluate((element) => element.scrollTop)).toBe(before);
    });

    test('applies an actual highlight color and marks the control active', async ({ page }) => {
      const editor = surface(page, framework, 'bubble-menu');
      const para = editor.locator('p').first();
      await para.click();
      await para.evaluate((element) => {
        const range = document.createRange();
        range.selectNodeContents(element);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      });

      const highlight = island(page, framework, 'bubble-menu')
        .getByLabel(/highlight/i)
        .first();
      await highlight.click();
      // React portals Ark Popover content to document.body; Svelte renders its picker in place.
      // getByRole excludes the hidden framework, so the visible swatch is unambiguous.
      await page
        .getByRole('button', { name: /^blue$/i })
        .first()
        .click();
      await expect(editor.locator('mark').first()).toHaveCSS('background-color', 'rgb(219, 234, 254)');
      await expect(highlight).toHaveAttribute('data-state', 'on');
    });

    test('uploads, previews, inserts, and exits an image caption', async ({ page }) => {
      const editor = surface(page, framework, 'slash-menu');
      await editor.locator('p').last().scrollIntoViewIfNeeded();
      await editor.locator('p').last().click();
      await page.keyboard.press('End');
      await page.keyboard.type('/');
      await island(page, framework, 'slash-menu').getByText('Image', { exact: true }).first().click();

      const upload = island(page, framework, 'slash-menu');
      const imageDialog = upload.getByRole('dialog', { name: 'Insert image' });
      await expect(imageDialog).toBeVisible();
      const demoScroll = page.locator('[data-example-id="slash-menu"] [data-editor-demo-scroll]').first();
      const before = await demoScroll.evaluate((element) => element.scrollTop);
      await demoScroll.hover({ position: { x: 4, y: 4 } });
      await page.mouse.wheel(0, -200);
      await expect.poll(() => demoScroll.evaluate((element) => element.scrollTop)).toBe(before);

      await upload.locator('input[type="file"]').setInputFiles({
        name: 'tiny.png',
        mimeType: 'image/png',
        buffer: Buffer.from(
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
          'base64',
        ),
      });
      await expect(upload.getByRole('img', { name: 'tiny.png' })).toBeVisible();
      await upload
        .getByRole('button', { name: /^upload$/i })
        .last()
        .click();

      const caption = editor.locator('.caption-input').last();
      await expect(caption).toBeVisible();
      await expect(caption).toHaveAttribute('placeholder', 'Add a caption…');
      await caption.focus();
      await expect(caption).toHaveAttribute('placeholder', '');
      const paragraphCount = await editor.locator('p').count();
      await caption.fill('A tiny image');
      await caption.press('Enter');
      await expect(editor.locator('p')).toHaveCount(paragraphCount + 1);
      await expect(caption).toHaveValue('A tiny image');
    });

    test('the link editing example renders without a forced title', async ({ page }) => {
      const editor = surface(page, framework, 'link-editing');
      await expect(editor.locator('h1')).toHaveCount(0);
      await expect(editor.locator('p')).toContainText('Paste a URL');
    });

    test('pastes a bare URL as a normal link without a choice menu', async ({ page }) => {
      const editor = surface(page, framework, 'link-editing');
      await editor.locator('p').click();
      await page.keyboard.press('End');
      const url = 'https://example.com/pasted-link';
      const handled = await editor.evaluate((element, pastedUrl) => {
        const clipboardData = new DataTransfer();
        clipboardData.setData('text/plain', pastedUrl);
        const event = new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData });
        element.dispatchEvent(event);
        return event.defaultPrevented;
      }, url);

      expect(handled).toBe(true);
      await expect(editor.locator(`a[href="${url}"]`)).toHaveText(url);
      await expect(island(page, framework, 'link-editing').locator('[role="menu"]')).toHaveCount(0);
    });

    test('the mention menu opens without a forced title', async ({ page }) => {
      const editor = surface(page, framework, 'mentions');
      await expect(editor.locator('h1')).toHaveCount(0);
      await expect(editor.locator('p')).toHaveCount(1);
      await editor.click();
      await page.keyboard.type('@a');
      // The mention menu mounts into document.body (it follows the caret), NOT inside the
      // framework island — so it must be queried unscoped. Both frameworks use .mention-list.
      // Assert the count first: a menu leaked by the OTHER framework would otherwise satisfy
      // the visibility check and mask a broken one.
      const menu = page.locator('.mention-list');
      await expect(menu).toHaveCount(1);
      // The static mentionSource supplies these people; seeing one proves the seam is wired.
      await expect(
        menu
          .first()
          .getByText(/Ada Lovelace|Alan Turing/)
          .first(),
      ).toBeVisible();
    });
  });
}

test('server pre-population ships readable HTML before hydration', async ({ request }) => {
  const response = await request.get('components/editor');
  expect(response.ok()).toBe(true);
  const html = await response.text();
  expect(html).toContain('data-editor-server-prepopulation');
  expect(html).toContain('Server-populated draft');
  expect(html).toContain('This content is present in the server HTML before the editor hydrates.');
});
