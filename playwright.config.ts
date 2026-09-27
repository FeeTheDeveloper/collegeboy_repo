import { existsSync } from 'node:fs';
import { defineConfig } from '@playwright/test';

// Cloud sessions ship Chromium at this path; elsewhere Playwright's own install is used.
const executablePath = existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined;

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 45_000,
  fullyParallel: true,
  reporter: [['list']],
  use: { baseURL: 'http://localhost:3100', launchOptions: { executablePath } },
  webServer: { command: 'npx next start -p 3100', url: 'http://localhost:3100', reuseExistingServer: true, timeout: 60_000 },
});
