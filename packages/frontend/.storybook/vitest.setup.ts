import { setProjectAnnotations } from '@storybook/react-vite';
import { beforeAll } from 'vitest';
import '@storybook/addon-vitest/internal/setup-file';
import * as projectAnnotations from './preview';

if (typeof (globalThis as { process?: unknown }).process === 'undefined') {
  (globalThis as { process: { env: Record<string, string> } }).process = {
    env: {
      NODE_ENV: 'test',
    },
  };
}

const annotations = setProjectAnnotations(projectAnnotations);

beforeAll(async () => {
  await annotations.beforeAll?.();
});
