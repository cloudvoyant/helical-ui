# Repository Guidance

## Source organization

Keep framework-neutral code in shared libraries. Put reusable utilities in `libs/utils` and reusable test helpers in `libs/testing`; expose only narrow public APIs through each library's `src/index.ts`. Keep framework-specific components in their framework library.

## Tests

Use `.test.ts` for unit tests and `.spec.ts` for integration or end-to-end tests. Keep browser tests in `apps/docs/e2e`, and keep them behavior-oriented: assert user-visible state, navigation, accessibility, and interaction rather than implementation details. Shared Playwright helpers belong in `libs/testing`, not individual spec files.

Organize tests with setup, tests, cleanup, and helpers sections where applicable. Use Arrange, Act, Assert steps and keep helpers small.

## Commands

Use `mise tasks` to inspect available tasks, then run checks with `mise run <task>`. Do not commit changes unless requested.
