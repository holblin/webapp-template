import { describe, expect, it, vi } from 'vitest';

const renderMock = vi.fn();
const createRootMock = vi.fn(() => ({ render: renderMock }));
const createRouterMock = vi.fn((config: Record<string, unknown>) => ({ ...config, mocked: true }));

vi.mock('react-dom/client', () => ({
  createRoot: createRootMock,
}));

vi.mock('@tanstack/react-router', () => ({
  createRouter: createRouterMock,
  RouterProvider: () => null,
}));

vi.mock('../__generated__/tanstack/routeTree.gen', () => ({
  routeTree: { routes: [] },
}));

vi.mock('../index.css', () => ({}));

describe('main entrypoint', () => {
  it('creates router and mounts the app root', async () => {
    const rootElement = { id: 'root' };
    const documentStub = {
      getElementById: vi.fn().mockReturnValue(rootElement),
    };
    Object.defineProperty(globalThis, 'document', {
      value: documentStub,
      configurable: true,
      writable: true,
    });

    const module = await import('../main');

    expect(createRouterMock).toHaveBeenCalledWith({
      routeTree: { routes: [] },
      defaultPreload: 'intent',
    });
    expect(createRootMock).toHaveBeenCalledWith(rootElement);
    expect(renderMock).toHaveBeenCalled();
    expect(module.router).toBeDefined();
  });
});
