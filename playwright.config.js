import { defineConfig, devices } from '@playwright/test';

// VB_TEST_PORT lets parallel checkouts (git worktrees) run the suite side by
// side; reuseExistingServer would otherwise pick up another checkout's server.
const PORT = Number(process.env.VB_TEST_PORT) || 4331;

export default defineConfig({
  testDir: 'tests/components',
  use: {
    baseURL: `http://127.0.0.1:${PORT}/vb-project-planning/`,
  },
  webServer: {
    command: 'node tests/serve-docs.mjs',
    url: `http://127.0.0.1:${PORT}/vb-project-planning/`,
    reuseExistingServer: true,
    timeout: 30000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
