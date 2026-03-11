import { RouterContextProvider, createMemoryHistory, createRouter } from '@tanstack/react-router';
import type { PropsWithChildren } from 'react';
import { useMemo, useState } from 'react';
import { routeTree } from 'src/__generated__/tanstack/routeTree.gen';
import { themeContext, type ThemeOptions } from 'src/providers/Theme';

export const StoryThemeProvider = ({ children }: PropsWithChildren) => {
  const [theme, setTheme] = useState<ThemeOptions>('dark');
  const ThemeProvider = themeContext.Provider;

  return <ThemeProvider value={{ theme, setTheme }}>{children}</ThemeProvider>;
};

type StoryRouterProviderProps = PropsWithChildren<{
  initialPath?: string;
}>;

export const StoryRouterProvider = ({
  children,
  initialPath = '/',
}: StoryRouterProviderProps) => {
  const router = useMemo(() => createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [initialPath] }),
    defaultPreload: 'intent',
  }), [initialPath]);

  return <RouterContextProvider router={router}>{children}</RouterContextProvider>;
};
