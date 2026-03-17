/* eslint-disable react/display-name */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { SortDirection } from 'src/__generated__/gql/graphql';

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  onThemeSet: vi.fn(),
  onCreateOpen: vi.fn(),
  setEditingId: vi.fn(),
  setDeletingId: vi.fn(),
  closeAllDialogs: vi.fn(),
}));

vi.mock('@react-spectrum/s2/style', () => ({
  style: () => '',
  iconStyle: () => '',
}));

vi.mock('@react-spectrum/s2/icons/App', () => ({ default: () => <span>AppIcon</span> }));
vi.mock('@react-spectrum/s2/icons/Contrast', () => ({ default: () => <span>LightIcon</span> }));
vi.mock('@react-spectrum/s2/icons/Lighten', () => ({ default: () => <span>DarkIcon</span> }));
vi.mock('@react-spectrum/s2/icons/Home', () => ({ default: () => <span>HomeIcon</span> }));
vi.mock('@react-spectrum/s2/icons/UserGroup', () => ({ default: () => <span>UserGroupIcon</span> }));
vi.mock('@react-spectrum/s2/icons/Bookmark', () => ({ default: () => <span>BookmarkIcon</span> }));
vi.mock('@react-spectrum/s2/icons/Tag', () => ({ default: () => <span>TagIcon</span> }));
vi.mock('@react-spectrum/s2/icons/InfoCircle', () => ({ default: () => <span>InfoCircleIcon</span> }));
vi.mock('@react-spectrum/s2/icons/Code', () => ({ default: () => <span>CodeIcon</span> }));
vi.mock('@react-spectrum/s2/icons/OpenIn', () => ({ default: () => <span>OpenInIcon</span> }));
vi.mock('@react-spectrum/s2/icons/ChevronDoubleLeft', () => ({ default: () => <span>CollapseIcon</span> }));
vi.mock('@react-spectrum/s2/icons/ChevronDoubleRight', () => ({ default: () => <span>ExpandIcon</span> }));
vi.mock('@react-spectrum/s2/icons/Home', () => ({ default: () => <span>HomeIcon</span> }));
vi.mock('@react-spectrum/s2/icons/UserGroup', () => ({ default: () => <span>AuthorsIcon</span> }));
vi.mock('@react-spectrum/s2/icons/Bookmark', () => ({ default: () => <span>BooksIcon</span> }));
vi.mock('@react-spectrum/s2/icons/Tag', () => ({ default: () => <span>TagsIcon</span> }));
vi.mock('@react-spectrum/s2/icons/InfoCircle', () => ({ default: () => <span>AboutIcon</span> }));
vi.mock('@react-spectrum/s2/icons/Code', () => ({ default: () => <span>GraphqlIcon</span> }));

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mocks.navigate,
  useLocation: () => ({ pathname: '/authors' }),
}));

vi.mock('src/providers/Theme', () => ({
  useTheme: () => ({ theme: 'light', setTheme: mocks.onThemeSet }),
}));

vi.mock('src/features/inventory/hooks/useCrudDialogState', () => ({
  useCrudDialogState: () => ({
    isCreateDialogOpen: false,
    openCreateDialog: mocks.onCreateOpen,
    editingId: null,
    setEditingId: mocks.setEditingId,
    deletingId: null,
    setDeletingId: mocks.setDeletingId,
    closeAllDialogs: mocks.closeAllDialogs,
  }),
}));

vi.mock('@react-spectrum/s2', () => {
  const component = (tag: string, invoke?: (props: Record<string, unknown>) => void) => {
    return ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      invoke?.(props);
      const renderProp = children as unknown;
      if (typeof renderProp === 'function') {
        return React.createElement(tag, props, (renderProp as (args: { close: () => void }) => React.ReactNode)({ close: () => {} }));
      }
      return React.createElement(tag, props, children);
    };
  };

  return {
    ActionButton: component('button', (props) => {
      const onPress = props.onPress as (() => void) | undefined;
      onPress?.();
    }),
    Button: component('button', (props) => {
      const onPress = props.onPress as (() => void) | undefined;
      onPress?.();
    }),
    DialogContainer: component('div'),
    TooltipTrigger: component('div'),
    Tooltip: component('div'),
    Popover: component('div'),
    DialogTrigger: component('div'),
    Divider: component('hr'),
    LinkButton: component('a'),
    Avatar: component('img'),
    Tabs: component('div', (props) => {
      const onSelectionChange = props.onSelectionChange as ((key: string) => void) | undefined;
      onSelectionChange?.('/authors');
    }),
    TabList: component('div'),
    Tab: component('div'),
    Cell: component('td'),
    SearchField: component('input', (props) => {
      const onChange = props.onChange as ((value: string) => void) | undefined;
      onChange?.('query');
    }),
    TableView: component('table', (props) => {
      const onSortChange = props.onSortChange as ((descriptor: { column: string; direction: string }) => void) | undefined;
      const onLoadMore = props.onLoadMore as (() => void) | undefined;
      onSortChange?.({ column: 'name', direction: 'descending' });
      onLoadMore?.();
    }),
    TableHeader: component('thead'),
    Column: component('th'),
    TableBody: ({ children, items }: { children: (item: unknown) => React.ReactNode; items: unknown[] }) => (
      <tbody>{items.map((item, index) => <React.Fragment key={index}>{children(item)}</React.Fragment>)}</tbody>
    ),
    Row: component('tr'),
  };
});

import { Header } from '../Header/Header';
import { InventoryCrudLayout } from '../Inventory/InventoryCrudLayout';
import { InventoryLayout } from '../Inventory/InventoryLayout';
import { Layout } from '../Layout/Layout';
import { Navigation } from '../Navigation/Navigation';
import { CellText } from '../Table/CellText';

describe('core layout components', () => {
  it('renders header, navigation, layout and cell text', () => {
    const html = renderToStaticMarkup(
      <div>
        <Header />
        <Navigation />
        <Layout>
          <div>Inner content</div>
        </Layout>
        <table>
          <tbody>
            <tr>
              <CellText>Hello</CellText>
            </tr>
          </tbody>
        </table>
      </div>,
    );

    expect(html).toContain('Template App');
    expect(html).toContain('Inner content');
    expect(mocks.navigate).toHaveBeenCalled();
    expect(mocks.onThemeSet).toHaveBeenCalled();
  });

  it('renders inventory layout and applies state/sort callbacks', () => {
    const onStateChange = vi.fn();
    const onSortChange = vi.fn();
    const onLoadMore = vi.fn();

    const html = renderToStaticMarkup(
      <InventoryLayout
        title="Authors"
        totalCount={1}
        state={{ offset: 10, search: '', showFilters: true }}
        onStateChange={onStateChange}
        columns={[
          { id: 'name', header: 'Name', sortField: 'name', renderCell: () => <>A</> },
        ]}
        rows={[{ id: 'row-1' }]}
        getRowId={(row) => (row as { id: string }).id}
        ariaLabel="Authors table"
        getFilters={() => ({ name: '' })}
        renderFilterPanel={() => <div>Filters</div>}
        loadingState="idle"
        onLoadMore={onLoadMore}
        sortDescriptor={{ column: 'name', direction: 'ascending' }}
        onSortChange={onSortChange}
      />,
    );

    expect(html).toContain('Authors');
    expect(html).toContain('Filters');
    expect(onStateChange).toHaveBeenCalled();
    expect(onSortChange).toHaveBeenCalled();
    expect(onLoadMore).toHaveBeenCalled();
  });

  it('renders inventory crud layout and wires create button', () => {
    const onStateChange = vi.fn();
    const onRefresh = vi.fn();
    const onSortChange = vi.fn();

    const html = renderToStaticMarkup(
      <InventoryCrudLayout
        title="Books"
        createLabel="Create"
        totalCount={1}
        state={{ offset: 0, search: '', showFilters: false, sortBy: 'id', sortDirection: SortDirection.Asc }}
        onStateChange={onStateChange}
        createColumns={() => [{ id: 'id', header: 'Id', renderCell: () => <>B</> }]}
        rows={[{ id: 'row-1' }]}
        getRowId={(row) => (row as { id: string }).id}
        ariaLabel="Books table"
        getFilters={() => ({})}
        renderFilterPanel={() => <div>Filters</div>}
        loadingState="idle"
        sortDescriptor={{ column: 'id', direction: 'ascending' }}
        onSortChange={onSortChange}
        renderCreateDialog={() => <div>Create dialog</div>}
        renderUpdateDialog={() => <div>Update dialog</div>}
        renderDeleteDialog={() => <div>Delete dialog</div>}
        onRefresh={onRefresh}
      />,
    );

    expect(html).toContain('Books');
    expect(mocks.onCreateOpen).toHaveBeenCalled();
    expect(onStateChange).toHaveBeenCalled();
  });
});
