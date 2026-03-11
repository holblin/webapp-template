import { describe, expect, it, vi } from 'vitest';
import type { PropsWithChildren } from 'react';

const routerMocks = vi.hoisted(() => ({
  createRootRouteMock: vi.fn((config: Record<string, unknown>) => config),
  createFileRouteMock: vi.fn(() => (config: Record<string, unknown>) => config),
}));

vi.mock('@tanstack/react-router', () => ({
  createRootRoute: routerMocks.createRootRouteMock,
  createFileRoute: routerMocks.createFileRouteMock,
  Outlet: () => null,
}));

vi.mock('src/components/Layout/Layout', () => ({
  Layout: ({ children }: PropsWithChildren) => children,
}));

vi.mock('src/providers/AppProviders', () => ({
  AppProviders: ({ children }: PropsWithChildren) => children,
}));

vi.mock('src/pages/Homepage/Homepage', () => ({
  HomePage: () => null,
}));
vi.mock('src/pages/About/About', () => ({
  About: () => null,
}));
vi.mock('src/pages/Authors/AuthorsPage', () => ({
  AuthorsPage: () => null,
}));
vi.mock('src/pages/Books/BooksPage', () => ({
  BooksPage: () => null,
}));
vi.mock('src/pages/Tags/TagsPage', () => ({
  TagsPage: () => null,
}));

import { defaultAuthorPageSearch } from 'src/features/authors/authorInventory';
import { defaultBookPageSearch } from 'src/features/books/bookInventory';
import { defaultTagPageSearch } from 'src/features/tags/tagInventory';
import { Route as RootRoute } from '../__root';
import { Route as AboutRoute } from '../about';
import { Route as AuthorsRoute } from '../authors';
import { Route as BooksRoute } from '../books';
import { Route as HomeRoute } from '../index';
import { Route as TagsRoute } from '../tags';

type RouteWithComponent = { component: unknown };
type RouteWithValidateSearch<TSearch> = { validateSearch: (search: unknown) => TSearch };
type ComponentRoute = { component: () => unknown };

describe('routes', () => {
  it('creates file and root routes', () => {
    expect(routerMocks.createRootRouteMock).toHaveBeenCalled();
    expect(routerMocks.createFileRouteMock).toHaveBeenCalledWith('/');
    expect(routerMocks.createFileRouteMock).toHaveBeenCalledWith('/about');
    expect(routerMocks.createFileRouteMock).toHaveBeenCalledWith('/authors');
    expect(routerMocks.createFileRouteMock).toHaveBeenCalledWith('/books');
    expect(routerMocks.createFileRouteMock).toHaveBeenCalledWith('/tags');
    expect((RootRoute as unknown as RouteWithComponent).component).toBeTypeOf('function');
    expect((HomeRoute as unknown as RouteWithComponent).component).toBeTypeOf('function');
    expect((AboutRoute as unknown as RouteWithComponent).component).toBeTypeOf('function');
    expect((RootRoute as unknown as ComponentRoute).component()).toBeTruthy();
  });

  it('validates author search params with defaults', () => {
    const value = (AuthorsRoute as unknown as RouteWithValidateSearch<typeof defaultAuthorPageSearch>).validateSearch({});
    expect(value).toMatchObject(defaultAuthorPageSearch);
  });

  it('validates book search params with defaults', () => {
    const value = (BooksRoute as unknown as RouteWithValidateSearch<typeof defaultBookPageSearch>).validateSearch({});
    expect(value).toMatchObject(defaultBookPageSearch);
  });

  it('validates tag search params with defaults', () => {
    const value = (TagsRoute as unknown as RouteWithValidateSearch<typeof defaultTagPageSearch>).validateSearch({});
    expect(value).toMatchObject(defaultTagPageSearch);
  });
});
