import {
  Button,
  ButtonGroup,
  Content,
  Dialog,
  Heading,
  Picker,
  PickerItem,
  type SortDescriptor,
} from '@react-spectrum/s2';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useMemo, useState } from 'react';
import { InventoryCrudLayout } from 'src/components/Inventory/InventoryCrudLayout';
import type { InventoryLayoutState } from 'src/components/Inventory/InventoryLayout';
import { SortDirection } from 'src/__generated__/gql/graphql';
import {
  applyInventorySortPatch,
  buildTableSortDescriptor,
} from 'src/features/inventory/sorting';

type DemoRow = {
  cursor: string;
  node: {
    id: string;
    name: string;
    status: 'active' | 'inactive';
  };
};

type DemoSortBy = 'name';
type DemoState = InventoryLayoutState & {
  sortBy: DemoSortBy;
  sortDirection: SortDirection;
  filterStatus: '' | 'active' | 'inactive';
};

type DemoFilters = Pick<DemoState, 'filterStatus'>;

const rows: DemoRow[] = [
  { cursor: 'cursor-1', node: { id: '1', name: 'Author One', status: 'active' } },
  { cursor: 'cursor-2', node: { id: '2', name: 'Author Two', status: 'inactive' } },
  { cursor: 'cursor-3', node: { id: '3', name: 'Author Three', status: 'active' } },
];

const defaultState: DemoState = {
  offset: 0,
  search: '',
  showFilters: true,
  sortBy: 'name',
  sortDirection: SortDirection.Asc,
  filterStatus: '',
};

type InventoryCrudLayoutStoryProps = {
  initialState?: DemoState;
};

const InventoryCrudLayoutStory = ({
  initialState = defaultState,
}: InventoryCrudLayoutStoryProps) => {
  const [state, setState] = useState<DemoState>(initialState);

  const filteredRows = useMemo(() => {
    const matches = rows.filter((row) => {
      const matchesSearch = state.search
        ? row.node.name.toLowerCase().includes(state.search.toLowerCase())
        : true;
      const matchesStatus = state.filterStatus ? row.node.status === state.filterStatus : true;
      return matchesSearch && matchesStatus;
    });

    return [...matches].sort((left, right) => {
      const base = left.node.name.localeCompare(right.node.name);
      return state.sortDirection === SortDirection.Desc ? -base : base;
    });
  }, [state]);

  const tableSortDescriptor: SortDescriptor = buildTableSortDescriptor(
    state.sortBy,
    state.sortDirection,
    { name: 'name' },
    'name',
  );

  return (
    <div style={{ height: '88vh' }}>
      <InventoryCrudLayout<DemoRow, DemoState, DemoFilters, string>
        title="Inventory CRUD Layout"
        createLabel="New item"
        totalCount={filteredRows.length}
        state={state}
        onStateChange={setState}
        rows={filteredRows}
        getRowId={(row) => row.cursor}
        ariaLabel="Inventory CRUD layout story"
        getFilters={(currentState) => ({
          filterStatus: currentState.filterStatus,
        })}
        renderFilterPanel={(filters, onFiltersChange) => (
          <Picker
            label="Status"
            value={filters.filterStatus || 'all'}
            onChange={(value) => {
              onFiltersChange({
                filterStatus: value === 'all' ? '' : (String(value) as 'active' | 'inactive'),
              });
            }}
          >
            <PickerItem id="all">All statuses</PickerItem>
            <PickerItem id="active">Active</PickerItem>
            <PickerItem id="inactive">Inactive</PickerItem>
          </Picker>
        )}
        createColumns={({ onEditPress, onDeletePress }) => [
          {
            id: 'name',
            header: 'Name',
            sortField: 'name',
            isRowHeader: true,
            renderCell: (row) => row.node.name,
          },
          {
            id: 'status',
            header: 'Status',
            renderCell: (row) => row.node.status,
          },
          {
            id: 'actions',
            header: 'Actions',
            renderCell: (row) => (
              <div style={{ display: 'flex', gap: 8 }}>
                <Button variant="secondary" onPress={() => onEditPress(row.node.id)}>
                  Edit
                </Button>
                <Button variant="negative" onPress={() => onDeletePress(row.node.id)}>
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
        sortDescriptor={tableSortDescriptor}
        onSortChange={(descriptor, column, onStatePatch) => {
          applyInventorySortPatch<DemoState, DemoSortBy, DemoRow>(descriptor, column, onStatePatch);
        }}
        onRefresh={async () => Promise.resolve()}
        renderCreateDialog={(onCompleted) => (
          <Dialog>
            {({ close }) => (
              <>
                <Heading slot="title">Create item</Heading>
                <Content>Storybook dialog to test the create flow.</Content>
                <ButtonGroup>
                  <Button variant="secondary" onPress={close}>
                    Cancel
                  </Button>
                  <Button
                    variant="accent"
                    onPress={() => {
                      onCompleted();
                      close();
                    }}
                  >
                    Confirm
                  </Button>
                </ButtonGroup>
              </>
            )}
          </Dialog>
        )}
        renderUpdateDialog={(id, onCompleted) => (
          <Dialog>
            {({ close }) => (
              <>
                <Heading slot="title">Update item {id}</Heading>
                <Content>Storybook dialog to test the update flow.</Content>
                <ButtonGroup>
                  <Button variant="secondary" onPress={close}>
                    Cancel
                  </Button>
                  <Button
                    variant="accent"
                    onPress={() => {
                      onCompleted();
                      close();
                    }}
                  >
                    Save
                  </Button>
                </ButtonGroup>
              </>
            )}
          </Dialog>
        )}
        renderDeleteDialog={(id, onCompleted) => (
          <Dialog>
            {({ close }) => (
              <>
                <Heading slot="title">Delete item {id}</Heading>
                <Content>This action cannot be undone.</Content>
                <ButtonGroup>
                  <Button variant="secondary" onPress={close}>
                    Cancel
                  </Button>
                  <Button
                    variant="negative"
                    onPress={() => {
                      onCompleted();
                      close();
                    }}
                  >
                    Delete
                  </Button>
                </ButtonGroup>
              </>
            )}
          </Dialog>
        )}
      />
    </div>
  );
};

const meta = {
  title: 'Inventory/InventoryCrudLayout',
  render: (args) => <InventoryCrudLayoutStory {...args} />,
} satisfies Meta<InventoryCrudLayoutStoryProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
