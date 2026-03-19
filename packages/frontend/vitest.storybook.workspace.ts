import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import { defineConfig, defineProject } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import react from '@vitejs/plugin-react';
import macros from 'unplugin-parcel-macros';

if (typeof (crypto as { hash?: unknown }).hash !== 'function') {
  (crypto as {
    hash: () => string;
  }).hash = (...values: unknown[]) => {
    const [algorithm, data, encoding] = values as [string, crypto.BinaryLike, crypto.BinaryToTextEncoding?];
    return crypto.createHash(algorithm).update(data).digest(encoding ?? 'hex');
  };
}

const dirname = path.dirname(fileURLToPath(import.meta.url));
const storybookProjectName = process.env.STORYBOOK_CONFIG_DIR
  ? `storybook:${process.env.STORYBOOK_CONFIG_DIR}`
  : 'storybook';

export default defineConfig({
  test: {
    projects: [
      defineProject({
        plugins: [
          macros.vite(),
          react(),
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        resolve: {
          alias: {
            src: path.join(dirname, 'src'),
          },
        },
        test: {
          name: storybookProjectName,
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
          setupFiles: ['./.storybook/vitest.setup.ts'],
          server: {
            deps: {
              inline: [/node_modules\/@react-spectrum/],
            },
          },
        },
      }),
    ],
  },
});
