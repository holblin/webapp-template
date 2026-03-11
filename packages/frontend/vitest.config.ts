import { fileURLToPath, URL } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { defineConfig } from 'vitest/config';

const storybookConfigDir = process.env.STORYBOOK_CONFIG_DIR;
const hasStorybookConfigDir = typeof storybookConfigDir === 'string' && storybookConfigDir.length > 0;

export default defineConfig({
  resolve: {
    alias: {
      src: fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    ...(
      hasStorybookConfigDir
        ? {
          projects: [
            {
              test: {
                name: 'unit',
                environment: 'node',
                include: ['src/**/__test__/**/*.test.ts', 'src/**/__test__/**/*.test.tsx'],
                setupFiles: ['./src/__test__/vitest.unit.setup.ts'],
              },
            },
            {
              plugins: [
                storybookTest({
                  configDir: storybookConfigDir,
                }),
              ],
              test: {
                name: `storybook:${storybookConfigDir}`,
                browser: {
                  enabled: true,
                  headless: true,
                  provider: 'playwright',
                  instances: [{ browser: 'chromium' }],
                },
                setupFiles: ['./.storybook/vitest.setup.ts'],
              },
            },
          ],
        }
        : {
          name: 'unit',
          environment: 'node',
          include: ['src/**/__test__/**/*.test.ts', 'src/**/__test__/**/*.test.tsx'],
          setupFiles: ['./src/__test__/vitest.unit.setup.ts'],
        }
    ),
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'src/**/*.ts',
        'src/**/*.tsx',
      ],
      exclude: [
        'src/**/__generated__/**',
        'src/**/__test__/**',
        'src/storybook/**',
        'src/**/*.stories.ts',
        'src/**/*.stories.tsx',
        'src/**/*.d.ts',
        'src/**/*.graphql.ts',
        'stories/**',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
