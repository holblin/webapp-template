import {
  Picker,
  PickerItem,
  type SortDescriptor,
} from '@react-spectrum/s2';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useMemo, useState } from 'react';
import {
  InventoryLayout,
  type InventoryLayoutColumn,
  type InventoryLayoutState,
} from 'src/components/Inventory/InventoryLayout';
import { SortDirection } from 'src/__generated__/gql/graphql';
import {
  applyInventorySortPatch,
  buildTableSortDescriptor,
} from 'src/features/inventory/sorting';

type DemoRow = {
  id: string;
  name: string;
  category: 'A' | 'B';
  stock: number;
};

type DemoSortBy = 'name' | 'stock';
type DemoState = InventoryLayoutState & {
  sortBy: DemoSortBy;
  sortDirection: SortDirection;
  filterCategory: '' | 'A' | 'B';
};

type DemoFilters = Pick<DemoState, 'filterCategory'>;

const allRows: DemoRow[] = Array.from({ length: 36 }, (_value, index) => ({
  id: `row-${index + 1}`,
  name: `Book ${index + 1}`,
  category: index % 2 === 0 ? 'A' : 'B',
  stock: (index * 7) % 23,
}));

const columns: InventoryLayoutColumn<DemoRow>[] = [
  {
    id: 'name',
    header: 'Name',
    isRowHeader: true,
    sortField: 'name',
    renderCell: (row) => row.name,
  },
  {
    id: 'category',
    header: 'Category',
    renderCell: (row) => row.category,
  },
  {
    id: 'stock',
    header: 'Stock',
    sortField: 'stock',
    renderCell: (row) => row.stock,
  },
];

const defaultState: DemoState = {
  offset: 0,
  search: '',
  showFilters: true,
  sortBy: 'name',
  sortDirection: SortDirection.Asc,
  filterCategory: '',
};

const sortColumnsByField: Partial<Record<DemoSortBy, string>> = {
  name: 'name',
  stock: 'stock',
};

type InventoryLayoutStoryProps = {
  initialState?: DemoState;
  loadingState?: 'loading' | 'loadingMore' | 'sorting' | 'filtering' | 'idle';
};

const InventoryLayoutStory = ({
  initialState = defaultState,
  loadingState = 'idle',
}: InventoryLayoutStoryProps) => {
  const [state, setState] = useState<DemoState>(initialState);

  const rows = useMemo(() => {
    const filteredRows = allRows.filter((row) => {
      const matchesSearch = state.search
        ? row.name.toLowerCase().includes(state.search.toLowerCase())
        : true;
      const matchesCategory = state.filterCategory ? row.category === state.filterCategory : true;
      return matchesSearch && matchesCategory;
    });

    return [...filteredRows].sort((left, right) => {
      const base = state.sortBy === 'stock'
        ? left.stock - right.stock
        : left.name.localeCompare(right.name);
      return state.sortDirection === SortDirection.Desc ? -base : base;
    });
  }, [state]);

  const tableSortDescriptor: SortDescriptor = buildTableSortDescriptor(
    state.sortBy,
    state.sortDirection,
    sortColumnsByField,
    'name',
  );

  return (
    <div style={{ height: '88vh' }}>
      <InventoryLayout<DemoRow, DemoState, DemoFilters>
        title="Inventory Layout"
        totalCount={rows.length}
        state={state}
        onStateChange={setState}
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        ariaLabel="Inventory layout story"
        getFilters={(currentState) => ({
          filterCategory: currentState.filterCategory,
        })}
        renderFilterPanel={(filters, onFiltersChange) => (
          <Picker
            label="Category"
            value={filters.filterCategory || 'all'}
            onChange={(value) => {
              onFiltersChange({
                filterCategory: value === 'all' ? '' : (String(value) as 'A' | 'B'),
              });
            }}
          >
            <PickerItem id="all">All categories</PickerItem>
            <PickerItem id="A">Category A</PickerItem>
            <PickerItem id="B">Category B</PickerItem>
          </Picker>
        )}
        loadingState={loadingState}
        sortDescriptor={tableSortDescriptor}
        onSortChange={(descriptor, column, onStatePatch) => {
          applyInventorySortPatch<DemoState, DemoSortBy, DemoRow>(descriptor, column, onStatePatch);
        }}
      />
    </div>
  );
};

const meta = {
  title: 'Inventory/InventoryLayout',
  render: (args) => <InventoryLayoutStory {...args} />,
  args: {
    loadingState: 'idle',
  },
  parameters: {
    controls: {
      include: ['loadingState'],
    },
  },
} satisfies Meta<InventoryLayoutStoryProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    loadingState: 'loading',
  },
};

export const FiltersHidden: Story = {
  args: {
    initialState: {
      ...defaultState,
      showFilters: false,
    },
  },
};
