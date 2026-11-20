import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const pkgRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = path.join(pkgRoot, 'dist');
const uiDistRoot = path.resolve(pkgRoot, '../helical-ui/dist');
const lucideIconsDir = path.join(pkgRoot, 'node_modules/lucide-svelte/dist/icons');

const pkgJson = JSON.parse(fs.readFileSync(path.join(pkgRoot, 'package.json'), 'utf8')) as {
  exports: Record<string, string | { types: string; svelte: string; default: string }>;
  peerDependencies?: Record<string, string>;
  peerDependenciesMeta?: Record<string, { optional?: boolean }>;
};

const HEAVY_DEPENDENCIES = [
  /^manim-web(?:\/|$)/,
  /^mermaid(?:\/|$)/,
  /^shiki(?:\/|$)/,
  /^katex(?:\/|$)/,
  /^@tanstack\/charts(?:\/|$)/,
  /^@tiptap\//,
  /^svelte-tiptap(?:\/|$)/,
  /^lowlight(?:\/|$)/,
  /^lucide-svelte$/,
  /^@cloudvoyant\/helical-ui\/(?:editor|chart|mermaid|code-block|latex|manim)$/,
];

function walkFiles(dir: string, exts: Set<string>, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(full, exts, out);
    } else if (exts.has(path.extname(entry.name))) {
      out.push(full);
    }
  }
  return out;
}

function extractRuntimeSpecifiers(source: string): string[] {
  const withoutComments = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
  const specifiers: string[] = [];

  for (const match of withoutComments.matchAll(
    /(?:^|[;\n])\s*(?:import|export)\s+(?!type\b)(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]/g,
  )) {
    if (match[1]) specifiers.push(match[1]);
  }
  for (const match of withoutComments.matchAll(/\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g)) {
    if (match[1]) specifiers.push(match[1]);
  }
  return specifiers;
}

function resolveRelativeFile(fromFile: string, specifier: string): string | null {
  const base = path.resolve(path.dirname(fromFile), specifier);
  for (const candidate of [base, `${base}.js`, `${base}.svelte`, path.join(base, 'index.js')]) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  return null;
}

function collectReachableGraph(entryFiles: string[]): { files: Set<string>; externals: Set<string> } {
  const visited = new Set<string>();
  const externals = new Set<string>();
  const queue = [...entryFiles];

  while (queue.length > 0) {
    const file = queue.pop()!;
    if (visited.has(file)) continue;
    visited.add(file);

    const content = fs.readFileSync(file, 'utf8');
    for (const specifier of extractRuntimeSpecifiers(content)) {
      if (specifier.startsWith('.')) {
        const resolved = resolveRelativeFile(file, specifier);
        if (resolved) queue.push(resolved);
      } else if (specifier === '@cloudvoyant/helical-ui') {
        externals.add(specifier);
        const uiEntry = path.join(uiDistRoot, 'index.js');
        if (fs.existsSync(uiEntry)) queue.push(uiEntry);
      } else if (specifier === '@cloudvoyant/helical-ui/commands') {
        externals.add(specifier);
        const uiCmdEntry = path.join(uiDistRoot, 'command/index.js');
        if (fs.existsSync(uiCmdEntry)) queue.push(uiCmdEntry);
      } else {
        externals.add(specifier);
      }
    }
  }

  return { files: visited, externals };
}

describe('given built @cloudvoyant/helical-svelte dist artifacts', () => {
  describe('when scanning all dist .svelte and .js files', () => {
    const distFiles = walkFiles(distRoot, new Set(['.svelte', '.js']));

    it('then zero files import from the root lucide-svelte barrel', () => {
      const offenders: string[] = [];
      for (const file of distFiles) {
        const specifiers = extractRuntimeSpecifiers(fs.readFileSync(file, 'utf8'));
        if (specifiers.some((spec) => spec === 'lucide-svelte' || spec === 'lucide-svelte/icons')) {
          offenders.push(path.relative(pkgRoot, file));
        }
      }
      expect(offenders).toEqual([]);
    });

    it('then every lucide-svelte/icons/* specifier resolves to a real icon with .js and .svelte.d.ts', () => {
      const missing: string[] = [];
      for (const file of distFiles) {
        const specifiers = extractRuntimeSpecifiers(fs.readFileSync(file, 'utf8'));
        for (const spec of specifiers) {
          if (!spec.startsWith('lucide-svelte/icons/')) continue;
          const iconName = spec.slice('lucide-svelte/icons/'.length);
          const hasJs = fs.existsSync(path.join(lucideIconsDir, `${iconName}.js`));
          const hasDts = fs.existsSync(path.join(lucideIconsDir, `${iconName}.svelte.d.ts`));
          if (!hasJs || !hasDts) {
            missing.push(`${path.relative(pkgRoot, file)} -> ${spec} (js=${hasJs}, dts=${hasDts})`);
          }
        }
      }
      expect(missing).toEqual([]);
    });
  });

  describe('when inspecting package.json exports and peerDependencies', () => {
    it('then manim-web, mermaid, and shiki are declared as optional peerDependencies', () => {
      for (const peer of ['manim-web', 'mermaid', 'shiki']) {
        expect(pkgJson.peerDependencies?.[peer], `peerDependencies.${peer}`).toBeDefined();
        expect(pkgJson.peerDependenciesMeta?.[peer]?.optional, `peerDependenciesMeta.${peer}.optional`).toBe(true);
      }
    });

    it('then every subpath export has types, svelte, and default entries pointing to existing dist files', () => {
      for (const [subpath, target] of Object.entries(pkgJson.exports)) {
        if (subpath === './package.json') continue;
        expect(typeof target, `${subpath} should be an export condition object`).toBe('object');
        const cond = target as { types: string; svelte: string; default: string };
        expect(cond.types, `${subpath}.types`).toBeDefined();
        expect(cond.svelte, `${subpath}.svelte`).toBeDefined();
        expect(cond.default, `${subpath}.default`).toBeDefined();
        for (const [key, relPath] of Object.entries(cond)) {
          expect(fs.existsSync(path.join(pkgRoot, relPath)), `${subpath} (${key}) -> ${relPath}`).toBe(true);
        }
      }
    });
  });

  describe('when walking the import graph from root "."', () => {
    const rootEntry = path.join(distRoot, 'index.js');
    const rootSource = fs.readFileSync(rootEntry, 'utf8');
    const { externals } = collectReachableGraph([rootEntry]);

    it('then Manim, Chart, Mermaid, LaTeX, CodeBlock, and Editor are excluded from root exports', () => {
      for (const forbidden of [
        './Manim.svelte',
        './Chart.svelte',
        './Mermaid.svelte',
        './LaTeX.svelte',
        './InlineLaTeX.svelte',
        './code-block',
        './editor',
      ]) {
        expect(rootSource).not.toContain(forbidden);
      }
    });

    it('then zero heavy optional dependencies are reachable', () => {
      const forbiddenHits = [...externals].filter((spec) => HEAVY_DEPENDENCIES.some((re) => re.test(spec)));
      expect(forbiddenHits).toEqual([]);
    });
  });

  describe('when walking the import graph from minimal shell subpaths', () => {
    const minimalSubpaths = [
      './which-key',
      './sidebar',
      './command',
      './command-palette',
      './command-menu',
      './layout',
    ];
    const entryFiles = minimalSubpaths.map((subpath) => {
      const cond = pkgJson.exports[subpath] as { svelte: string };
      return path.join(pkgRoot, cond.svelte);
    });
    const { files, externals } = collectReachableGraph(entryFiles);

    it('then reachable helical-svelte .svelte files stay strictly bounded to those families', () => {
      const svelteFiles = [...files]
        .filter((f) => f.startsWith(distRoot) && f.endsWith('.svelte'))
        .map((f) => path.relative(distRoot, f));
      expect(svelteFiles.length).toBeGreaterThan(0);
      expect(svelteFiles.length).toBeLessThan(85);
      for (const unrelated of [
        'Manim.svelte',
        'Chart.svelte',
        'Mermaid.svelte',
        'LaTeX.svelte',
        'editor/',
        'code-block/',
        'navbar/',
        'select/',
        'combobox/',
        'toast/',
        'window/',
      ]) {
        expect(
          svelteFiles.some((f) => f === unrelated || f.startsWith(unrelated)),
          `unexpected ${unrelated}`,
        ).toBe(false);
      }
    });

    it('then zero heavy optional dependencies or root lucide-svelte imports are reachable', () => {
      const forbiddenHits = [...externals].filter((spec) => HEAVY_DEPENDENCIES.some((re) => re.test(spec)));
      expect(forbiddenHits).toEqual([]);
    });
  });

  it('when resolving dedicated heavy subpaths, then each exports its expected components', () => {
    const expectations: Record<string, string[]> = {
      './manim': ['Manim'],
      './chart': ['Chart'],
      './mermaid': ['Mermaid'],
      './latex': ['LaTeX', 'InlineLaTeX'],
      './code-block': ['CodeBlock', 'MultiFileCodeBlock', 'LanguageTabsCodeBlock'],
      './editor': ['Editor', 'Reader', 'CursorOverlay'],
    };

    for (const [subpath, names] of Object.entries(expectations)) {
      const cond = pkgJson.exports[subpath] as { svelte: string };
      expect(cond, `missing export ${subpath}`).toBeDefined();
      const content = fs.readFileSync(path.join(pkgRoot, cond.svelte), 'utf8');
      for (const name of names) {
        expect(content, `${subpath} should export ${name}`).toContain(name);
      }
    }
  });
});
