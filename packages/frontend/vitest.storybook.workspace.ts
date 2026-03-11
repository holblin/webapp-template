import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import { defineWorkspace } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

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

export default defineWorkspace([
  './vitest.config.ts',
  {
    extends: './vitest.config.ts',
    plugins: [
      storybookTest({
        configDir: path.join(dirname, '.storybook'),
      }),
    ],
    test: {
      name: storybookProjectName,
      browser: {
        enabled: true,
        headless: true,
        provider: 'playwright',
        instances: [{ browser: 'chromium' }],
      },
      setupFiles: ['./.storybook/vitest.setup.ts'],
    },
  },
]);
