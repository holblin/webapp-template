import { Tab, TabList, Tabs, Tooltip, TooltipTrigger } from "@react-spectrum/s2";
import {
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
import { iconStyle, style } from "@react-spectrum/s2/style" with { type: "macro" };
import { useMemo } from "react";
import type { FileRouteTypes } from 'src/__generated__/tanstack/routeTree.gen'
import Bookmark from '@react-spectrum/s2/icons/Bookmark';
import Code from '@react-spectrum/s2/icons/Code';
import Home from '@react-spectrum/s2/icons/Home';
import InfoCircle from '@react-spectrum/s2/icons/InfoCircle';
import Tag from '@react-spectrum/s2/icons/Tag';
import UserGroup from '@react-spectrum/s2/icons/UserGroup';

type AppRoute = FileRouteTypes['to']

const menus: ReadonlyArray<{
  path: AppRoute | string;
  name: string;
  Icon: typeof Home;
  external?: true;
}> = [
  { path: '/', name: 'Home', Icon: Home },
  { path: '/authors', name: 'Authors', Icon: UserGroup },
  { path: '/books', name: 'Books', Icon: Bookmark },
  { path: '/tags', name: 'Tags', Icon: Tag },
  { path: '/about', name: 'About', Icon: InfoCircle },
  { path: '/graphql', name: 'GraphQL', Icon: Code, external: true },
] as const

type NavigationProps = {
  compact?: boolean;
  onNavigate?: () => void;
};

export const Navigation = ({ compact = false, onNavigate }: NavigationProps) => {

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const regularTabContentClassName = style({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  });
  const compactTabContentClassName = style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

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
        onNavigate?.();
        window.location.assign(selectedPath)
        return
      }

      navigate({ to: selectedPath as AppRoute })
      onNavigate?.();
    }}
    selectedKey={selectedRoute}
  >
    <TabList aria-label="Tabs">
      {menus.map((menu) => (
        <Tab key={menu.path} id={menu.path} aria-label={menu.name}>
          {compact ? (
            <TooltipTrigger>
              <span className={compactTabContentClassName}>
                <menu.Icon styles={iconStyle({ size: 'M' })} />
              </span>
              <Tooltip>{menu.name}</Tooltip>
            </TooltipTrigger>
          ) : (
            <span className={regularTabContentClassName}>
              <menu.Icon styles={iconStyle({ size: 'M' })} />
              <span>{menu.name}</span>
            </span>
          )}
        </Tab>
      ))}
    </TabList>
  </Tabs>
}
