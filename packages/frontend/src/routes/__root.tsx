import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Layout } from 'src/components/Layout/Layout'
import { AppProviders } from 'src/providers/AppProviders'

export const Route = createRootRoute({
  component: () => <AppProviders>
    <Layout>
      <Outlet />
    </Layout>
  </AppProviders>
})
