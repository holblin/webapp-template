/* eslint-disable react/display-name */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { SortDirection } from 'src/__generated__/gql/graphql';

vi.mock('@react-spectrum/s2/style', () => ({
  style: () => '',
  iconStyle: () => '',
}));

vi.mock('@react-spectrum/s2', () => {
  const component = (tag: string) => {
    return ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const renderProp = children as unknown;
      if (typeof renderProp === 'function') {
        return React.createElement(tag, props, (renderProp as (args: { close: () => void }) => React.ReactNode)({ close: () => {} }));
      }
      return React.createElement(tag, props, children);
    };
  };

  return {
    ActionButton: component('button'),
    Button: component('button'),
    DialogContainer: component('div'),
    SearchField: component('input'),
    TableView: component('table'),
    TableHeader: component('thead'),
    Column: component('th'),
    TableBody: component('tbody'),
    Row: component('tr'),
    Cell: component('td'),
    DateRangePicker: component('div'),
    NumberField: component('div'),
    Picker: component('div'),
    PickerItem: component('option'),
    TextField: component('input'),
    TextArea: component('textarea'),
  };
});

vi.mock('@tanstack/react-router', () => ({
  getRouteApi: () => ({}),
}));

const mocks = vi.hoisted(() => ({
  useInventoryPageQueryMock: vi.fn(),
  useQueryMock: vi.fn(),
  inventoryCrudLayoutProps: [] as Array<Record<string, unknown>>,
}));

vi.mock('@apollo/client/react', () => ({
  useQuery: mocks.useQueryMock,
}));

vi.mock('src/features/inventory/hooks/useInventoryPageQuery', () => ({
  useInventoryPageQuery: mocks.useInventoryPageQueryMock,
}));

vi.mock('src/components/Inventory/InventoryCrudLayout', () => ({
  InventoryCrudLayout: (props: { title: string }) => {
    mocks.inventoryCrudLayoutProps.push(props as unknown as Record<string, unknown>);
    return <div>{props.title}</div>;
  },
}));

vi.mock('src/features/authors/columns/authorInventoryColumns', () => ({
  createAuthorInventoryColumns: () => [],
}));
vi.mock('src/features/books/columns/bookInventoryColumns', () => ({
  createBookInventoryColumns: () => [],
}));
vi.mock('src/features/tags/columns/tagInventoryColumns', () => ({
  createTagInventoryColumns: () => [],
}));

vi.mock('src/features/authors/filters/AuthorFiltersPanel', () => ({
  AuthorFiltersPanel: () => <div>Author filters</div>,
}));
vi.mock('src/features/books/filters/BookFiltersPanel', () => ({
  BookFiltersPanel: () => <div>Book filters</div>,
}));
vi.mock('src/features/tags/filters/TagFiltersPanel', () => ({
  TagFiltersPanel: () => <div>Tag filters</div>,
}));

vi.mock('src/pages/Authors/dialogs/CreateAuthorDialog', () => ({
  CreateAuthorDialog: () => <div>Create author</div>,
}));
vi.mock('src/pages/Authors/dialogs/UpdateAuthorDialog', () => ({
  UpdateAuthorDialog: () => <div>Update author</div>,
}));
vi.mock('src/pages/Authors/dialogs/DeleteAuthorDialog', () => ({
  DeleteAuthorDialog: () => <div>Delete author</div>,
}));
vi.mock('src/pages/Books/dialogs/CreateBookDialog', () => ({
  CreateBookDialog: () => <div>Create book</div>,
}));
vi.mock('src/pages/Books/dialogs/UpdateBookDialog', () => ({
  UpdateBookDialog: () => <div>Update book</div>,
}));
vi.mock('src/pages/Books/dialogs/DeleteBookDialog', () => ({
  DeleteBookDialog: () => <div>Delete book</div>,
}));
vi.mock('src/pages/Tags/dialogs/CreateTagDialog', () => ({
  CreateTagDialog: () => <div>Create tag</div>,
}));
vi.mock('src/pages/Tags/dialogs/UpdateTagDialog', () => ({
  UpdateTagDialog: () => <div>Update tag</div>,
}));
vi.mock('src/pages/Tags/dialogs/DeleteTagDialog', () => ({
  DeleteTagDialog: () => <div>Delete tag</div>,
}));

import { defaultAuthorPageSearch } from 'src/features/authors/authorInventory';
import { defaultBookPageSearch } from 'src/features/books/bookInventory';
import { defaultTagPageSearch } from 'src/features/tags/tagInventory';
import { AuthorsPage } from '../Authors/AuthorsPage';
import { BooksPage } from '../Books/BooksPage';
import { TagsPage } from '../Tags/TagsPage';

describe('inventory pages', () => {
  it('renders AuthorsPage, BooksPage and TagsPage', () => {
    mocks.inventoryCrudLayoutProps.length = 0;
    mocks.useInventoryPageQueryMock
      .mockReturnValueOnce({
        searchState: { ...defaultAuthorPageSearch, sortDirection: SortDirection.Asc },
        onStateChange: vi.fn(),
        rows: [{ cursor: 'a1', node: { id: 'author-1' } }],
        totalCount: 1,
        loadingState: 'idle',
        onLoadMore: vi.fn(),
        refresh: vi.fn(),
      })
      .mockReturnValueOnce({
        searchState: { ...defaultBookPageSearch, sortDirection: SortDirection.Asc },
        onStateChange: vi.fn(),
        rows: [{ cursor: 'b1', node: { id: 'book-1' } }],
        totalCount: 1,
        loadingState: 'idle',
        onLoadMore: vi.fn(),
        refresh: vi.fn(),
      })
      .mockReturnValueOnce({
        searchState: { ...defaultTagPageSearch, sortDirection: SortDirection.Asc },
        onStateChange: vi.fn(),
        rows: [{ cursor: 't1', node: { id: 'tag-1' } }],
        totalCount: 1,
        loadingState: 'idle',
        onLoadMore: vi.fn(),
        refresh: vi.fn(),
      });

    mocks.useQueryMock.mockReturnValue({
      data: {
        tagList: { edges: [{ node: { id: 'tag-1', name: 'Tag' } }] },
        authorList: { edges: [{ node: { id: 'author-1', name: 'Author' } }] },
        bookList: { edges: [{ node: { id: 'book-1', title: 'Book' } }] },
      },
    });

    const html = renderToStaticMarkup(
      <div>
        <AuthorsPage />
        <BooksPage />
        <TagsPage />
      </div>,
    );

    expect(html).toContain('Authors');
    expect(html).toContain('Books');
    expect(html).toContain('Tags');
  });

  it('provides functional callbacks to InventoryCrudLayout for all pages', () => {
    mocks.inventoryCrudLayoutProps.length = 0;
    const authorOnLoadMore = vi.fn();
    const authorRefresh = vi.fn();
    const bookOnLoadMore = vi.fn();
    const bookRefresh = vi.fn();
    const tagOnLoadMore = vi.fn();
    const tagRefresh = vi.fn();

    mocks.useInventoryPageQueryMock
      .mockReturnValueOnce({
        searchState: { ...defaultAuthorPageSearch, sortDirection: SortDirection.Asc },
        onStateChange: vi.fn(),
        rows: [{ cursor: 'a1', node: { id: 'author-1' } }],
        totalCount: 1,
        loadingState: 'idle',
        onLoadMore: authorOnLoadMore,
        refresh: authorRefresh,
      })
      .mockReturnValueOnce({
        searchState: { ...defaultBookPageSearch, sortDirection: SortDirection.Asc },
        onStateChange: vi.fn(),
        rows: [{ cursor: 'b1', node: { id: 'book-1' } }],
        totalCount: 1,
        loadingState: 'idle',
        onLoadMore: bookOnLoadMore,
        refresh: bookRefresh,
      })
      .mockReturnValueOnce({
        searchState: { ...defaultTagPageSearch, sortDirection: SortDirection.Asc },
        onStateChange: vi.fn(),
        rows: [{ cursor: 't1', node: { id: 'tag-1' } }],
        totalCount: 1,
        loadingState: 'idle',
        onLoadMore: tagOnLoadMore,
        refresh: tagRefresh,
      });

    mocks.useQueryMock.mockReturnValue({
      data: {
        tagList: { edges: [{ node: { id: 'tag-1', name: 'Tag' } }] },
        authorList: { edges: [{ node: { id: 'author-1', name: 'Author' } }] },
        bookList: { edges: [{ node: { id: 'book-1', title: 'Book' } }] },
      },
    });

    renderToStaticMarkup(
      <div>
        <AuthorsPage />
        <BooksPage />
        <TagsPage />
      </div>,
    );

    expect(mocks.inventoryCrudLayoutProps).toHaveLength(3);

    for (const props of mocks.inventoryCrudLayoutProps) {
      const onStatePatch = vi.fn();
      const sortDescriptor = { column: 'name', direction: 'descending' as const };
      const column = { sortField: 'name' };

      (props.getRowId as (row: { cursor: string }) => string)({ cursor: 'cursor-1' });
      (props.onLoadMore as () => void)();
      void (props.onRefresh as () => Promise<void> | void)();

      (props.renderFilterPanel as (filters: unknown, onFiltersChange: (patch: unknown) => void) => React.ReactNode)(
        {},
        vi.fn(),
      );
      (props.onSortChange as (
        descriptor: { column: string; direction: 'ascending' | 'descending' },
        col: { sortField?: string },
        onPatch: (patch: unknown, resetOffset?: boolean) => void,
      ) => void)(sortDescriptor, column, onStatePatch);
      (props.renderCreateDialog as (onCompleted: () => void) => React.ReactNode)(vi.fn());
      (props.renderUpdateDialog as (id: string, onCompleted: () => void) => React.ReactNode)('id-1', vi.fn());
      (props.renderDeleteDialog as (id: string, onCompleted: () => void) => React.ReactNode)('id-1', vi.fn());

      expect(onStatePatch).toHaveBeenCalled();
    }

    expect(authorOnLoadMore).toHaveBeenCalled();
    expect(authorRefresh).toHaveBeenCalled();
    expect(bookOnLoadMore).toHaveBeenCalled();
    expect(bookRefresh).toHaveBeenCalled();
    expect(tagOnLoadMore).toHaveBeenCalled();
    expect(tagRefresh).toHaveBeenCalled();
  });
});
