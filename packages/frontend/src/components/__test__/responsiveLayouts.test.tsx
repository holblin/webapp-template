/* eslint-disable react/display-name */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { InventoryLayout } from 'src/components/Inventory/InventoryLayout';
import { Layout } from 'src/components/Layout/Layout';

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  setTheme: vi.fn(),
  useIsSmallViewport: vi.fn((maxWidth: number) => maxWidth >= 900),
}));

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mocks.navigate,
  useLocation: () => ({ pathname: '/authors' }),
}));

vi.mock('src/providers/Theme', () => ({
  useTheme: () => ({ theme: 'light', setTheme: mocks.setTheme }),
}));

vi.mock('src/components/Responsive/useIsSmallViewport', () => ({
  useIsSmallViewport: (maxWidth: number) => mocks.useIsSmallViewport(maxWidth),
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
    ButtonGroup: component('div'),
    Content: component('div'),
    Dialog: component('div'),
    DialogContainer: component('div'),
    TooltipTrigger: component('div'),
    Tooltip: component('div'),
    Heading: component('h2'),
    Popover: component('div'),
    DialogTrigger: component('div'),
    Divider: component('hr'),
    LinkButton: component('a'),
    Avatar: component('img'),
    Tabs: component('div'),
    TabList: component('div'),
    Tab: component('div'),
    Cell: component('td'),
    SearchField: component('input'),
    TableView: component('table'),
    TableHeader: component('thead'),
    Column: component('th'),
    TableBody: ({ children, items }: { children: (item: unknown) => React.ReactNode; items: unknown[] }) => (
      <tbody>{items.map((item, index) => <React.Fragment key={index}>{children(item)}</React.Fragment>)}</tbody>
    ),
    Row: component('tr'),
  };
});

describe('responsive layout behavior', () => {
  it('shows desktop sidebar collapse control on non-mobile viewports', () => {
    mocks.useIsSmallViewport.mockImplementation((maxWidth: number) => maxWidth < 900);

    const html = renderToStaticMarkup(
      <Layout>
        <div>Page content</div>
      </Layout>,
    );

    expect(html).toContain('Collapse navigation');
    expect(html).not.toContain('Menu');
  });

  it('shows mobile menu button and hides desktop collapse control on small viewports', () => {
    mocks.useIsSmallViewport.mockImplementation(() => true);

    const html = renderToStaticMarkup(
      <Layout>
        <div>Page content</div>
      </Layout>,
    );

    expect(html).toContain('Menu');
    expect(html).not.toContain('Collapse');
  });

  it('renders inline filters on desktop inventory when showFilters is enabled', () => {
    mocks.useIsSmallViewport.mockImplementation((maxWidth: number) => maxWidth < 680);

    const html = renderToStaticMarkup(
      <InventoryLayout
        title="Books"
        totalCount={1}
        state={{ offset: 0, search: '', showFilters: true }}
        onStateChange={() => {}}
        columns={[{ id: 'name', header: 'Name', renderCell: () => <>Row</> }]}
        rows={[{ id: 'row-1' }]}
        getRowId={(row) => (row as { id: string }).id}
        ariaLabel="Books table"
        getFilters={() => ({ title: '' })}
        renderFilterPanel={() => <div>Desktop filters panel</div>}
      />,
    );

    expect(html).toContain('Desktop filters panel');
  });

  it('keeps filters collapsed by default on phone inventory layout', () => {
    mocks.useIsSmallViewport.mockImplementation(() => true);

    const html = renderToStaticMarkup(
      <InventoryLayout
        title="Books"
        totalCount={1}
        state={{ offset: 0, search: '', showFilters: true }}
        onStateChange={() => {}}
        columns={[{ id: 'name', header: 'Name', renderCell: () => <>Row</> }]}
        rows={[{ id: 'row-1' }]}
        getRowId={(row) => (row as { id: string }).id}
        ariaLabel="Books table"
        getFilters={() => ({ title: '' })}
        renderFilterPanel={() => <div>Phone filters panel</div>}
      />,
    );

    expect(html).toContain('Filters');
    expect(html).not.toContain('Phone filters panel');
  });
});
