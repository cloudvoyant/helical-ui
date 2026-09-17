# helical-ui Development Guide

Generated from mise-lib-template v2.15.0.

## Prerequisites

- [mise](https://mise.jdx.dev/) -- manages Node.js and pnpm versions
- Node.js LTS and pnpm are installed automatically by mise via `mise install`

## Getting Started

```bash
# Install all tools and dependencies
mise install
mise run install

# Run tests
mise run test

# Check code quality
mise run lint
mise run format:check
```

## Project Structure

```
apps/docs/     # Docs/demo app (private placeholder)
libs/helical-react/    # React UI lib (tsup: ESM + CJS + d.ts)
libs/helical-svelte/   # Svelte UI lib (svelte-package: ESM + d.ts)
version.txt            # Single source of truth for the lockstep version
mise.toml              # Task runner and tool versions
pnpm-workspace.yaml    # Workspace declaration (apps/*, libs/*)
tsconfig.base.json     # Shared strict TypeScript base
```

## Development Workflow

1. **Add a feature**: write code in `libs/<pkg>/src/`, add tests alongside it (`*.test.ts`)
2. **Check quality**: `mise run lint && mise run format:check` (`lint` runs ESLint + `tsc --noEmit`)
3. **Run tests**: `mise run test` (vitest across the workspace)
4. **Fix issues**: `mise run lint:fix && mise run format` (then fix any remaining type errors manually)
5. **Build**: `mise run build` (tsup emits ESM + CJS + d.ts for the TS libs; svelte-package bundles the Svelte lib)

## Adding Dependencies

```bash
pnpm --filter @cloudvoyant/helical-react add express            # runtime dep for one package
pnpm --filter @cloudvoyant/helical-react add -D @types/express  # dev-only dependency
pnpm add -w typescript                             # workspace root tooling
```

## Publishing to npm

### Prerequisites

1. Create an npm account at [npmjs.com](https://www.npmjs.com/)
2. Create a publish token: **npmjs.com -> Account -> Access Tokens -> Generate New Token -> Publish**
3. Set the token:
   - **Local**: `export NPM_TOKEN=npm_xxx...`
   - **CI**: Add `NPM_TOKEN` as a GitHub repository secret (Settings -> Secrets and variables -> Actions)

### Manual Publish

```bash
# Bump the lockstep version based on conventional commits
mise run upversion

# Build and publish every public workspace package to npm (idempotent)
mise run publish
```

### Automated CI Publish

On every push to `main`:

1. The release workflow runs `mise run upversion` — semantic-release bumps `version.txt` and fans it out to every `libs/*` and `apps/*` package.json, updates the changelog, and creates a git tag
2. If a new version was released: the workflow runs `mise run publish` — publishes every public workspace package to npm

### Scoped Packages

To publish as `@your-org/my-library`:

1. Update `"name"` in the relevant `libs/*/package.json`: `"@your-org/my-library"`
2. Ensure your npm account has publish access to the `@your-org` scope

### Pre-release (RC)

```bash
mise run publish:rc
# Publishes every public workspace package to npm as X.Y.Z-rc.<timestamp>.<sha> with tag "next"
# Consumers install with: pnpm add @cloudvoyant/helical-react@next
```

### Token Expiration and Trusted Publishing

npm Granular Access Tokens **expire after 90 days**. To avoid manual rotation, set up Trusted Publishing (OIDC) after your first release:

1. Go to your package on npmjs.com -> **Settings** -> **Publishing access**
2. Enable publishing from CI/CD with a generated token
3. Set repository owner, repo name, and workflow (`release.yml`)
4. Add `id-token: write` to `release.yml` permissions and `--provenance` to the publish command
5. Remove `NPM_TOKEN` from GitHub secrets -- no longer needed

See `docs/user-guide.md` -> npm Setup for full instructions.
