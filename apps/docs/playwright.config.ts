// apps/docs/playwright.config.ts
import { defineConfig } from '@playwright/test';

const PORT = process.env.E2E_PORT ?? '4321';
const SERVER_URL = `http://localhost:${PORT}/helical-ui/`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: 2,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? SERVER_URL,
  },
  webServer: {
    // `astro preview` daemonizes when stdout is not a TTY (Playwright pipes it),
    // so the wrapper stays alive polling the URL and stops the daemon on exit.
    // Stale daemons would otherwise be reused by Playwright (stale build).
    command:
      'pnpm run preview stop >/dev/null 2>&1 || true; ' +
      `pnpm run build && pnpm run preview --port ${PORT} --background >/dev/null 2>&1 || true; ` +
      `for i in $(seq 1 120); do curl -fsS -o /dev/null ${SERVER_URL} && break; sleep 1; done; ` +
      "trap 'pnpm run preview stop >/dev/null 2>&1 || true' EXIT; " +
      'while true; do sleep 5; done',
    url: SERVER_URL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
