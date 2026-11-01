# Docs app guidance

Keep end-to-end tests in `e2e/` and name them `*.spec.ts`. Tests must cover real user-visible behavior: interaction, navigation, visibility, current state, and accessibility. Do not add tests that merely assert source composition or internal implementation details.

Use shared browser helpers from `@cloudvoyant/testing`; do not duplicate preview-frame setup in individual specs. Keep framework matrices consistent and isolate iframe assertions to the active preview island.
