import {
  Column,
  Row,
  TableBody,
  TableHeader,
  TableView,
} from '@react-spectrum/s2';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CellText } from 'src/components/Table/CellText';

type DemoRow = {
  id: string;
  value: string;
};

const rows: DemoRow[] = [
  { id: '1', value: 'Selectable cell content' },
  { id: '2', value: 'Second row text' },
];

const meta = {
  title: 'Components/CellText',
  component: CellText,
  render: () => (
    <div style={{ height: 260 }}>
      <TableView aria-label="CellText demo">
        <TableHeader>
          <Column id="value" isRowHeader>
            Value
          </Column>
        </TableHeader>
        <TableBody items={rows}>
          {(row) => (
            <Row id={row.id}>
              <CellText>{row.value}</CellText>
            </Row>
          )}
        </TableBody>
      </TableView>
    </div>
  ),
} satisfies Meta<typeof CellText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Selectable cell content',
  },
};
