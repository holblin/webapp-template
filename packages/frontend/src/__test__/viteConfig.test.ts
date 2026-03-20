import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('vite config', () => {
  it('disables TanStack route generation to avoid dev reload loops', () => {
    const viteConfigPath = join(process.cwd(), 'vite.config.ts');
    const viteConfig = readFileSync(viteConfigPath, 'utf8');

    expect(viteConfig).toContain('enableRouteGeneration: false');
  });
});
