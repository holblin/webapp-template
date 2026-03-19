import '@storybook/addon-vitest/internal/setup-file';

if (typeof (globalThis as { process?: unknown }).process === 'undefined') {
  (globalThis as { process: { env: Record<string, string> } }).process = {
    env: {
      NODE_ENV: 'test',
    },
  };
}
