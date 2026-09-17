# Infrastructure

## Overview

`helical-ui` is a [`mise`](https://mise.jdx.dev/)-powered project with automated versioning, testing, and GitHub Actions CI/CD.

## Design

- Mise manages environment, dev tools, and tasks
- GitHub Actions drives CI/CD using mise tasks
- Org-level secrets avoid per-project secret configuration
- The build system is project-structure agnostic — only mise tasks need to work

## Implementation

### Mise For Environment & Tasks

Mise is the environment management tool and task runner. Since mise can manage a large array of languages and tools, it is a sensible choice for a language-agnostic build system that hooks into CI/CD and can be modified for any language.

Environment is configured in `mise.toml` under `[env]`:

```toml
[env]
_.path  = ['{{config_root}}/node_modules/.bin']
PROJECT = "helical-ui"
```

### GitHub Actions For CI/CD

The `ci` workflow runs on feature branch commits and publishes pre-release packages (`mise run publish:rc`) for testing. The `release` workflow runs on merge to main, where `semantic-release` bumps the lockstep `version.txt` version and `mise run publish` publishes the public workspace packages.

### CI/CD Secrets

Org-level secrets are utilized to avoid the need for setting up secrets for every new project. This means setup is only needed once.

- `NPM_TOKEN` — npm publish token; exposed to CI as `NODE_AUTH_TOKEN`

### Cross-Platform Support

The project works on macOS, Linux, and Windows (via WSL) without requiring platform-specific tools.

Key compatibility measures:

- Mise handles installation of tools across host platforms
- Line endings enforced to LF via `.editorconfig`
- Bash 3.2+ required (macOS ships with Bash 3.2)

## References

- [mise - the dev tool manager](https://mise.jdx.dev/)
- [semantic-release](https://semantic-release.gitbook.io/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [pnpm workspaces](https://pnpm.io/workspaces)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Template**: mise-lib-template v2.15.0
