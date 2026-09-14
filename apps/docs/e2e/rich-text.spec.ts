// apps/docs/e2e/rich-text.spec.ts
// Coverage for the remaining rich-text components, matrixed over React and Svelte via
// the docs demo islands: static components (Notice, Figure, Reveal, PrevNext), LaTeX
// (synchronous + prerendered + no-JS), the code-block family (client highlight + prerendered),
// Chart (React-only), YouTube facade, and the question/quiz interactions.
import { selectFramework } from './helpers';
import { test, expect } from '@playwright/test';

const FRAMEWORKS = ['react', 'svelte'] as const;

for (const framework of FRAMEWORKS) {
  test.describe(`Rich text static components · ${framework}`, () => {
    test('Notice renders variants with error-reserved assertive role', async ({ page }) => {
      await page.goto('components/notice');
      await selectFramework(page, framework);
      const variants = page.locator('[data-example-id="variants"]').locator(`[data-fw="${framework}"]`);
      // variants example: info (status), success (status), warning (status), error (alert)
      await expect(variants.getByRole('status')).toHaveCount(3);
      await expect(variants.getByRole('alert')).toHaveCount(1);
      await expect(variants.getByRole('alert')).toContainText('Build failed');
      await expect(variants.getByRole('status').first()).toContainText('Heads up');
    });

    test('plain notice has no live-region role', async ({ page }) => {
      await page.goto('components/notice');
      await selectFramework(page, framework);
      const def = page
        .locator('[data-example-id="default"] [data-example-preview]')
        .locator(`[data-fw="${framework}"]`);
      await expect(def.locator('[role="status"], [role="alert"]')).toHaveCount(0);
      await expect(def.getByText('A plain notice with just a body.')).toBeVisible();
    });

    test('Reveal reveals its answer via the Ark collapsible', async ({ page }) => {
      await page.goto('components/reveal');
      await selectFramework(page, framework);
      const root = page.locator(`[data-demo] [data-fw="${framework}"] [data-scope="collapsible"]`).first();
      await expect(root).toHaveAttribute('data-state', 'closed');
      await root.locator('[data-part="trigger"]').click();
      await expect(root).toHaveAttribute('data-state', 'open');
    });

    test('PrevNext renders both links', async ({ page }) => {
      await page.goto('components/prev-next');
      await selectFramework(page, framework);
      const nav = page.locator(`[data-demo] [data-fw="${framework}"] nav[aria-label="Previous and next pages"]`);
      await expect(nav.locator('a')).toHaveCount(2);
      await expect(nav.locator('a').first()).toContainText('Introduction');
      await expect(nav.locator('a').nth(1)).toContainText('Theming');
    });
  });

  test.describe(`LaTeX · ${framework}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('components/latex');
      await selectFramework(page, framework);
    });

    test('renders KaTeX output synchronously (no client import)', async ({ page }) => {
      const root = page.locator(`[data-demo] [data-fw="${framework}"] [data-latex-state]`).first();
      await expect(root).toHaveAttribute('data-latex-state', 'done');
      await expect(root.locator('.katex').first()).toBeVisible();
    });

    test('inline toLaTeX renders KaTeX inline', async ({ page }) => {
      const inline = page.locator('[data-example-id="inline"]').locator(`[data-fw="${framework}"] .katex`);
      await expect(inline.first()).toBeVisible();
    });

    test('prerendered LaTeX renders immediately', async ({ page }) => {
      const prerendered = page
        .locator('[data-example-id="prerendered"]')
        .locator(`[data-fw="${framework}"] [data-latex-state]`);
      await expect(prerendered).toHaveAttribute('data-latex-state', 'done');
      await expect(prerendered.locator('.katex')).toBeVisible();
    });
  });

  test.describe(`Code block · ${framework}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('components/code-block');
      await selectFramework(page, framework);
    });

    test('highlights code with shiki after client load', async ({ page }) => {
      const root = page.locator(`[data-demo] [data-fw="${framework}"] [data-code-block]`).first();
      await expect(root.locator('.shiki')).toBeVisible({ timeout: 15_000 });
      await expect(root.locator('.line').first()).toBeVisible();
    });

    test('multi-file and language-tabs switchers render their code', async ({ page }) => {
      const multiFile = page
        .locator('[data-example-id="multi-file"]')
        .locator(`[data-fw="${framework}"] [data-code-block]`);
      await expect(multiFile.locator('.shiki')).toBeVisible({ timeout: 15_000 });
      await expect(multiFile.locator('[role="tab"]')).toHaveCount(2);

      const languageTabs = page
        .locator('[data-example-id="language-tabs"]')
        .locator(`[data-fw="${framework}"] [data-code-block]`);
      await expect(languageTabs.locator('.shiki')).toBeVisible({ timeout: 15_000 });
      // Language selector is the Ark-based vortex-ui Select (visible Ark trigger, not a visible
      // native <select> — Ark's SelectHiddenSelect is always present but visually hidden).
      await expect(languageTabs.locator('[data-scope="select"][data-part="trigger"]')).toHaveCount(1);
      await expect(languageTabs.locator('select')).toHaveCount(1);
      await languageTabs.locator('[data-scope="select"][data-part="trigger"]').click();
      await expect(page.locator('[role="listbox"]:visible [role="option"]')).toHaveCount(8);
    });

    test('prerendered code block renders line numbers and highlights without importing shiki', async ({ page }) => {
      await page.route(/shiki[^/]*\.js$/, (route) => route.abort());
      await page.goto('components/code-block');
      await selectFramework(page, framework);
      const prerendered = page
        .locator('[data-example-id="prerendered"]')
        .locator(`[data-fw="${framework}"] [data-code-block]`);
      await expect(prerendered.locator('.shiki')).toBeVisible();
      // The scoped styles must be injected even on the prerendered `html` path; otherwise
      // line-number counters and highlights silently disappear.
      await expect(page.locator('style#hx-code-block')).toHaveCount(1);
      await expect(prerendered.locator('.cbln')).toHaveCount(1);
      await expect(prerendered.locator('.line-highlighted')).toBeVisible();
    });
  });

  test.describe(`YouTube · ${framework}`, () => {
    test('facade swaps to an iframe on click', async ({ page }) => {
      await page.goto('components/youtube');
      await selectFramework(page, framework);
      const root = page.locator(`[data-demo] [data-fw="${framework}"] [data-youtube-id]`).first();
      await expect(root.locator('[data-youtube-logo]')).toBeVisible();
      await expect(root.locator('button').first()).toBeVisible();
      await expect(root.locator('iframe')).toHaveCount(0);
      await root.locator('button').first().click();
      await expect(root.locator('iframe')).toBeVisible();
      await expect(root.locator('iframe')).toHaveAttribute('src', /youtube-nocookie\.com\/embed\/dQw4w9WgXcQ/);
    });
  });

  test.describe(`Questions · ${framework}`, () => {
    test('single choice grades correctly', async ({ page }) => {
      await page.goto('components/questions');
      await selectFramework(page, framework);
      const single = page.locator('[data-example-id="single"]').locator(`[data-fw="${framework}"]`);
      await single.getByText('Node.js', { exact: true }).click();
      await single.getByRole('button', { name: 'Check' }).click();
      await expect(single.getByText('Correct', { exact: true })).toBeVisible();
      await expect(single.getByText('Node.js runs JavaScript outside the browser.', { exact: true })).toBeVisible();
    });

    test('numeric grades correctly', async ({ page }) => {
      await page.goto('components/questions');
      await selectFramework(page, framework);
      const numeric = page.locator('[data-example-id="numeric"]').locator(`[data-fw="${framework}"]`);
      await numeric.locator('input').fill('4');
      await numeric.getByRole('button', { name: 'Check' }).click();
      await expect(numeric.getByText('Correct', { exact: true })).toBeVisible();
    });
  });

  test.describe(`Quiz · ${framework}`, () => {
    test('grades all questions on a single submit with accurate score', async ({ page }) => {
      await page.goto('components/quiz');
      await selectFramework(page, framework);
      const quiz = page.locator(`[data-demo] [data-fw="${framework}"] [data-quiz-id]`).first();
      // No per-question Check buttons before submit.
      await expect(quiz.getByRole('button', { name: 'Check' })).toHaveCount(0);
      // Submit is disabled until every question is answered.
      const submit = quiz.getByRole('button', { name: 'Submit' });
      await expect(submit).toBeDisabled();
      // Answer 1 wrong (Python is index 0, correct is Node.js index 1) and 1 right (9) -> 1/2 (50%)
      await quiz.getByText('Python', { exact: true }).click();
      await quiz.locator('input[type="text"]').fill('9');
      await expect(submit).toBeEnabled();
      await submit.click();
      await expect(quiz.getByText('1/2 (50%)').first()).toBeVisible();
      await expect(quiz.getByText('Keep studying and try again.')).toBeVisible();

      // Reset and answer 2/2 right -> 2/2 (100%)
      await quiz.getByRole('button', { name: 'Reset' }).click();
      await expect(submit).toBeDisabled();
      await quiz.getByText('Node.js', { exact: true }).click();
      await quiz.locator('input[type="text"]').fill('9');
      await expect(submit).toBeEnabled();
      await submit.click();
      await expect(quiz.getByText('2/2 (100%)').first()).toBeVisible();
      await expect(quiz.getByText('Well done!')).toBeVisible();
    });
  });
}

test.describe('Chart', () => {
  for (const framework of FRAMEWORKS) {
    test(`renders an SVG · ${framework}`, async ({ page }) => {
      await page.goto('components/chart');
      await selectFramework(page, framework);
      const chart = page.locator(`[data-demo] [data-fw="${framework}"] [data-chart-state]`).first();
      await expect(chart).toHaveAttribute('data-chart-state', 'ready');
      await expect(chart.locator('svg').first()).toBeVisible();
    });
  }

  test('prerendered chart ships SVG in the server HTML', async ({ page }) => {
    await page.goto('components/chart');
    const prerendered = page.locator('[data-example-id="prerendered"]').locator('[data-fw="react"] [data-chart-state]');
    await expect(prerendered).toHaveAttribute('data-chart-state', 'prerendered');
    await expect(prerendered.locator('svg')).toBeVisible();
  });
});

test.describe('Manim', () => {
  for (const framework of FRAMEWORKS) {
    test(`mounts the player from the inline scene builder · ${framework}`, async ({ page }) => {
      await page.goto('components/manim');
      await selectFramework(page, framework);
      const root = page.locator(`[data-demo] [data-fw="${framework}"] [data-manim-state]`).first();
      await expect(root).toHaveAttribute('data-manim-state', 'ready', { timeout: 20_000 });
      await expect(root.locator('canvas').first()).toBeVisible();
    });
  }
});

test.describe('Rich text SSR placeholders', () => {
  test.use({ javaScriptEnabled: false });

  test('LaTeX ships KaTeX output in the server HTML (synchronous render)', async ({ page }) => {
    await page.goto('components/latex');
    const root = page.locator('[data-demo] [data-fw="react"] [data-latex-state]').first();
    await expect(root).toBeVisible();
    await expect(root.locator('.katex')).toBeVisible();
  });

  test('prerendered LaTeX ships KaTeX output in the server HTML', async ({ page }) => {
    await page.goto('components/latex');
    const prerendered = page.locator('[data-example-id="prerendered"]').locator('[data-fw="react"] [data-latex-state]');
    await expect(prerendered).toHaveAttribute('data-latex-state', 'done');
    await expect(prerendered.locator('.katex')).toBeVisible();
  });

  test('prerendered CodeBlock ships highlighted HTML with line numbers in the server HTML', async ({ page }) => {
    await page.goto('components/code-block');
    const prerendered = page.locator('[data-example-id="prerendered"]').locator('[data-fw="react"] [data-code-block]');
    await expect(prerendered.locator('.shiki')).toBeVisible();
    await expect(prerendered.locator('.cbln')).toHaveCount(1);
    await expect(prerendered.locator('.line-highlighted')).toBeVisible();
  });
});
