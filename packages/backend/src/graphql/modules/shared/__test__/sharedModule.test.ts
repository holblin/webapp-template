import { afterEach, describe, expect, it, vi } from 'vitest';

describe('sharedModule', () => {
  afterEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
    vi.unmock('fs');
  });

  it('reads bundled schema when bundled path exists', async () => {
    const existsSync = vi.fn(() => true);
    const readFileSync = vi.fn(() => 'scalar Date');

    vi.doMock('fs', () => ({
      existsSync,
      readFileSync,
    }));

    const module = await import('../sharedModule.js');

    expect(module.typeDefs).toBe('scalar Date');
    expect(existsSync).toHaveBeenCalledTimes(1);
    const bundledPath = (existsSync.mock.calls as unknown[][])[0][0];
    expect(readFileSync).toHaveBeenCalledWith(
      bundledPath,
      { encoding: 'utf-8' },
    );
  });

  it('falls back to source schema path when bundled path is missing', async () => {
    const existsSync = vi.fn(() => false);
    const readFileSync = vi.fn(() => 'type Query { _: Boolean }');

    vi.doMock('fs', () => ({
      existsSync,
      readFileSync,
    }));

    const module = await import('../sharedModule.js');

    expect(module.typeDefs).toBe('type Query { _: Boolean }');
    expect(existsSync).toHaveBeenCalledTimes(1);
    const sourcePath = (readFileSync.mock.calls as unknown[][])[0][0] as string;
    expect(sourcePath).toContain('src');
    expect(sourcePath).toContain('graphql');
    expect(sourcePath).toContain('modules');
    expect(sourcePath).toContain('shared');
    expect(sourcePath).toContain('sharedModule.graphql');
    expect(readFileSync).toHaveBeenCalledWith(sourcePath, { encoding: 'utf-8' });
  });
});
