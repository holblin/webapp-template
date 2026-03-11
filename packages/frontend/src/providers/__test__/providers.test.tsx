import type { PropsWithChildren } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  providerProps: null as null | {
    colorScheme: string;
    router: {
      navigate: (to: string, options?: { replace?: boolean }) => void;
      useHref: (href: string) => string;
    };
  },
}));

vi.mock('react', async () => {
  const actual = await vi.importActual<typeof import('react')>('react');
  return {
    ...actual,
    useLayoutEffect: (effect: () => void) => {
      if (typeof document !== 'undefined') {
        effect();
      }
    },
    useEffect: (effect: () => void) => {
      if (typeof window !== 'undefined') {
        effect();
      }
    },
  };
});

vi.mock('@react-spectrum/s2', () => ({
  Provider: ({
    children,
    colorScheme,
    router,
  }: PropsWithChildren<{
    colorScheme: string;
    router: {
      navigate: (to: string, options?: { replace?: boolean }) => void;
      useHref: (href: string) => string;
    };
  }>) => {
    mocks.providerProps = { colorScheme, router };
    return <div>{children}</div>;
  },
  ToastContainer: () => <div>ToastContainer</div>,
}));

vi.mock('@react-spectrum/s2/page.css', () => ({}));

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mocks.navigateMock,
}));

vi.mock('src/providers/Apollo', () => ({
  AppApolloProvider: ({ children }: PropsWithChildren) => <div>{children}</div>,
}));

import { AppProviders } from '../AppProviders';
import { themeContext, useTheme } from '../Theme';

const setBrowserEnvironment = (savedTheme: string | null) => {
  const getItem = vi.fn(() => savedTheme);
  const setItem = vi.fn();
  const assign = vi.fn();

  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    writable: true,
    value: {
      localStorage: { getItem, setItem },
      location: { assign },
    },
  });

  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    writable: true,
    value: { documentElement: { dataset: {} as Record<string, string> } },
  });

  return { getItem, setItem, assign };
};

afterEach(() => {
  mocks.providerProps = null;
  mocks.navigateMock.mockReset();
  Reflect.deleteProperty(globalThis, 'window');
  Reflect.deleteProperty(globalThis, 'document');
});

describe('providers', () => {
  it('throws when useTheme is used outside provider', () => {
    const Probe = () => {
      useTheme();
      return null;
    };

    expect(() => renderToStaticMarkup(<Probe />)).toThrowError('useTheme must be used inside a ThemeProvider');
  });

  it('returns theme context values when provider is present', () => {
    const Probe = () => {
      const { theme } = useTheme();
      return <span>{theme}</span>;
    };

    const html = renderToStaticMarkup(
      <themeContext.Provider value={{ theme: 'light', setTheme: vi.fn() }}>
        <Probe />
      </themeContext.Provider>,
    );

    expect(html).toContain('light');
  });

  it('renders AppProviders wrapper', () => {
    const html = renderToStaticMarkup(
      <AppProviders>
        <div>App child</div>
      </AppProviders>,
    );

    expect(html).toContain('App child');
    expect(html).toContain('ToastContainer');
  });

  it('sets and persists a valid saved theme and handles navigation helpers', () => {
    const { setItem, assign } = setBrowserEnvironment('light');

    renderToStaticMarkup(
      <AppProviders>
        <div>App child</div>
      </AppProviders>,
    );

    expect(mocks.providerProps?.colorScheme).toBe('light');
    expect(document.documentElement.dataset.colorScheme).toBe('light');
    expect(setItem).toHaveBeenCalledWith('theme', 'light');
    expect(mocks.providerProps?.router.useHref('https://example.com')).toBe('https://example.com');
    expect(mocks.providerProps?.router.useHref('/authors')).toBe('/authors');

    mocks.providerProps?.router.navigate('/authors', { replace: true });
    expect(mocks.navigateMock).toHaveBeenCalledWith({ to: '/authors', replace: true });

    mocks.providerProps?.router.navigate('https://example.com');
    mocks.providerProps?.router.navigate('mailto:test@example.com');
    expect(assign).toHaveBeenCalledTimes(2);
    expect(assign).toHaveBeenNthCalledWith(1, 'https://example.com');
    expect(assign).toHaveBeenNthCalledWith(2, 'mailto:test@example.com');
  });

  it('falls back to dark theme when saved value is invalid', () => {
    setBrowserEnvironment('sepia');

    renderToStaticMarkup(
      <AppProviders>
        <div>App child</div>
      </AppProviders>,
    );

    expect(mocks.providerProps?.colorScheme).toBe('dark');
    expect(document.documentElement.dataset.colorScheme).toBe('dark');
  });
});
