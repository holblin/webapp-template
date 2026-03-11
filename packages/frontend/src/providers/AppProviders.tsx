import { Provider, ToastContainer } from '@react-spectrum/s2'
import '@react-spectrum/s2/page.css'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useLayoutEffect, useState, type PropsWithChildren } from 'react'
import type { FileRouteTypes } from 'src/__generated__/tanstack/routeTree.gen'
import { AppApolloProvider } from 'src/providers/Apollo'
import { themeContext, type ThemeOptions } from 'src/providers/Theme'

type AppRoutePath = FileRouteTypes['to']

type TanStackNavigateOptions = Omit<
  Parameters<ReturnType<typeof useNavigate>>[0],
  'to'
>

declare module '@react-spectrum/s2' {
  interface RouterConfig {
    routerOptions: TanStackNavigateOptions
  }
}

export function AppProviders({ children }: PropsWithChildren) {
  const navigate = useNavigate()
  const ThemeProvider = themeContext.Provider
  const [theme, setTheme] = useState<ThemeOptions>(() => {
    if (typeof window === 'undefined') {
      return 'dark'
    }

    const savedTheme = window.localStorage.getItem('theme')
    return savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : 'dark'
  })

  useLayoutEffect(() => {
    document.documentElement.dataset.colorScheme = theme
  }, [theme])

  useEffect(() => {
    window.localStorage.setItem('theme', theme)
  }, [theme])

  const useHref = (href: string) => {
    if (/^https?:\/\//.test(href) || /^mailto:/.test(href)) {
      return href
    }

    return href
  }

  const spectrumNavigate = (to: string, options?: TanStackNavigateOptions) => {
    if (/^https?:\/\//.test(to) || /^mailto:/.test(to)) {
      window.location.assign(to)
      return
    }

    navigate({ to: to as AppRoutePath, ...options })
  }

  return (
    <ThemeProvider value={{ theme, setTheme }}>
      <AppApolloProvider>
        <Provider
          background="base"
          router={{ navigate: spectrumNavigate, useHref }}
          colorScheme={theme}
        >
          {children}
          <ToastContainer />
        </Provider>
      </AppApolloProvider>
    </ThemeProvider>
  )
}
