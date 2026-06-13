import {
  Cell,
  Row,
  TableBody,
  TableHeader,
  TableView,
} from '@react-spectrum/s2';
import Delete from '@react-spectrum/s2/icons/Delete';
import Edit from '@react-spectrum/s2/icons/Edit';
import Link from '@react-spectrum/s2/icons/Link';
import MagicWand from '@react-spectrum/s2/icons/MagicWand';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { NameActionsCell } from 'src/components/Table/NameActionsCell';
import { ResizableColumn } from 'src/components/Table/ResizableColumn';

type DemoRow = {
  id: string;
  name: string;
  slug: string;
};

const rows: DemoRow[] = [
  { id: '1', name: 'Octavia Butler', slug: 'octavia-butler' },
  { id: '2', name: 'Ursula K. Le Guin', slug: 'ursula-k-le-guin' },
];

const meta = {
  title: 'Components/NameActionsCell',
  component: NameActionsCell,
  render: () => (
    <div style={{ height: 280 }}>
      <TableView aria-label="NameActionsCell demo">
        <TableHeader>
          <ResizableColumn id="name" isRowHeader>
            Name
          </ResizableColumn>
          <ResizableColumn id="slug">Slug</ResizableColumn>
        </TableHeader>
        <TableBody items={rows}>
          {(row) => (
            <Row id={row.id}>
              <NameActionsCell
                name={row.name}
                nameHref={`/authors/${row.slug}`}
                actions={[
                  {
                    id: `${row.id}:open`,
                    label: 'Open details',
                    icon: <Link />,
                    onPress: () => {
                      console.info('Open details', row.id);
                    },
                  },
                  {
                    id: `${row.id}:feature`,
                    label: 'Feature author',
                    icon: <MagicWand />,
                    onPress: () => {
                      console.info('Feature author', row.id);
                    },
                  },
                  {
                    id: `${row.id}:edit`,
                    label: 'Edit',
                    icon: <Edit />,
                    onPress: () => {
                      console.info('Edit', row.id);
                    },
                  },
                  {
                    id: `${row.id}:delete`,
                    label: 'Delete',
                    icon: <Delete />,
                    onPress: () => {
                      console.info('Delete', row.id);
                    },
                  },
                ]}
              />
              <Cell>{row.slug}</Cell>
            </Row>
          )}
        </TableBody>
      </TableView>
    </div>
  ),
} satisfies Meta<typeof NameActionsCell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'Demo',
    actions: [],
  },
};
