import { Tab, TabList, Tabs } from "@react-spectrum/s2";
import {
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import { useMemo } from "react";
import type { FileRouteTypes } from 'src/__generated__/tanstack/routeTree.gen'

type AppRoute = FileRouteTypes['to']

const menus: ReadonlyArray<{ path: AppRoute; name: string; external?: false } | { path: string; name: string; external: true }> = [
  { path: '/', name: 'Home' },
  { path: '/authors', name: 'Authors' },
  { path: '/books', name: 'Books' },
  { path: '/tags', name: 'Tags' },
  { path: '/about', name: 'About' },
  { path: '/graphql', name: 'GraphQL', external: true },
] as const

export const Navigation = () => {

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const selectedRoute = useMemo(() => {
    const route = menus
      .map((menu) => menu.path)
      .filter((menuRoute) => pathname.startsWith(menuRoute))
      .sort((a, b) => b.length - a.length)[0]

    return route
  }, [pathname])

  return <Tabs
    aria-label="Main menu"
    orientation="vertical"
    styles={style({width: 'full'})}
    onSelectionChange={(key) => {
      const selectedPath = key.toString()
      const selectedMenu = menus.find((menu) => menu.path === selectedPath)

      if (selectedMenu?.external) {
        window.location.assign(selectedPath)
        return
      }

      navigate({ to: selectedPath as AppRoute })
    }}
    selectedKey={selectedRoute}
  >
    <TabList
      aria-label="Tabs"
      items={menus.map((menu) => ({ id: menu.path, name: menu.name }))}
    >
      {(item) => <Tab key={item.id} id={item.id}>{item.name}</Tab>}
    </TabList>
  </Tabs>
}
