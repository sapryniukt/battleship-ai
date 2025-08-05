import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

const chromiumGpuOnLinuxFlags = [
  '--use-angle=vulkan',
  '--enable-features=Vulkan',
  '--disable-vulkan-surface',
  '--enable-unsafe-webgpu'
];

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 100 * 1000,
  retries: 0,
  reporter: 'list',

  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 0,
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    contextOptions: {
      reducedMotion: 'reduce'
    }
  },

  expect: {
    timeout: 15000
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chromium',
        launchOptions: {
          args: ['--no-sandbox', '--enable-gpu', ...(process.platform === 'linux' ? chromiumGpuOnLinuxFlags : [])]
        }
      }
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        launchOptions: {
          firefoxUserPrefs: {
            'dom.webgpu.enabled': true,
            'webgl.force-enabled': true
          }
        }
      }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }
  ]
});
