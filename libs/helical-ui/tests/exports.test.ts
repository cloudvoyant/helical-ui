import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const pkgRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkgJson = JSON.parse(fs.readFileSync(path.join(pkgRoot, 'package.json'), 'utf8')) as {
  exports: Record<string, string | Record<string, string>>;
  peerDependencies?: Record<string, string>;
  peerDependenciesMeta?: Record<string, { optional?: boolean }>;
};

const FORBIDDEN_ROOT_IMPORT_PATTERNS = [
  /['"]manim-web(?:\/[^'"]*)?['"]/,
  /['"]mermaid(?:\/[^'"]*)?['"]/,
  /['"]shiki(?:\/[^'"]*)?['"]/,
  /['"]katex(?:\/[^'"]*)?['"]/,
  /['"]@tanstack\/charts(?:\/[^'"]*)?['"]/,
  /['"]@tiptap\/[^'"]*['"]/,
  /['"]lowlight(?:\/[^'"]*)?['"]/,
];

describe('given built @cloudvoyant/helical-ui dist artifacts', () => {
  it('when inspecting dist/index.js and dist/index.cjs, then zero heavy optional dependencies are imported', () => {
    for (const file of ['dist/index.js', 'dist/index.cjs']) {
      const content = fs.readFileSync(path.join(pkgRoot, file), 'utf8');
      for (const pattern of FORBIDDEN_ROOT_IMPORT_PATTERNS) {
        expect(content, `${file} must not reference ${pattern}`).not.toMatch(pattern);
      }
    }
  });

  it('when inspecting package.json peerDependencies, then manim-web, mermaid, and shiki are optional', () => {
    for (const peer of ['manim-web', 'mermaid', 'shiki']) {
      expect(pkgJson.peerDependencies?.[peer], `peerDependencies.${peer}`).toBeDefined();
      expect(pkgJson.peerDependenciesMeta?.[peer]?.optional, `peerDependenciesMeta.${peer}.optional`).toBe(true);
    }
  });

  it('when checking every subpath in package.json exports, then all declared ESM, CJS, and type files exist', () => {
    for (const [subpath, target] of Object.entries(pkgJson.exports)) {
      if (typeof target === 'string') {
        expect(fs.existsSync(path.join(pkgRoot, target)), `${subpath} -> ${target}`).toBe(true);
        continue;
      }
      for (const [condition, relPath] of Object.entries(target)) {
        expect(fs.existsSync(path.join(pkgRoot, relPath)), `${subpath} (${condition}) -> ${relPath}`).toBe(true);
      }
    }
    for (const heavySubpath of ['./editor', './chart', './mermaid', './code-block', './latex', './manim']) {
      expect(pkgJson.exports[heavySubpath], `missing export ${heavySubpath}`).toBeDefined();
    }
  });
});
