import http from 'node:http';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import express from 'express';
import { afterEach, describe, expect, it } from 'vitest';
import { registerStaticAssets } from '../staticAssets';

const tempDirs: string[] = [];

const createTempDistDir = (name: string, html: string) => {
  const dir = mkdtempSync(join(tmpdir(), `webapp-template-${name}-`));
  tempDirs.push(dir);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html, 'utf8');
  return dir;
};

const startServer = async (app: express.Express) => {
  const server = http.createServer(app);

  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve());
  });

  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('Failed to get ephemeral port from test server');
  }

  return {
    server,
    baseUrl: `http://127.0.0.1:${address.port}`,
  };
};

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) {
      rmSync(dir, { recursive: true, force: true });
    }
  }
});

describe('registerStaticAssets', () => {
  it('serves /storybook and /storybook/ without redirect loops', async () => {
    const app = express();
    const frontendDistPath = createTempDistDir('frontend', '<html><body>frontend</body></html>');
    const storybookDistPath = createTempDistDir('storybook', '<html><body>storybook</body></html>');

    registerStaticAssets({
      app,
      frontendDistPath,
      storybookDistPath,
    });

    const { server, baseUrl } = await startServer(app);

    try {
      const storybookWithoutSlash = await fetch(`${baseUrl}/storybook`, { redirect: 'manual' });
      expect(storybookWithoutSlash.status).toBe(200);
      expect(storybookWithoutSlash.headers.get('location')).toBeNull();
      expect(await storybookWithoutSlash.text()).toContain('storybook');

      const storybookWithSlash = await fetch(`${baseUrl}/storybook/`, { redirect: 'manual' });
      expect(storybookWithSlash.status).toBe(200);
      expect(storybookWithSlash.headers.get('location')).toBeNull();
      expect(await storybookWithSlash.text()).toContain('storybook');
    } finally {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      });
    }
  });
});
