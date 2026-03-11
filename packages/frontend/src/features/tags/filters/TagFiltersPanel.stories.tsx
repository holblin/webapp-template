import type { Meta, StoryObj } from '@storybook/react-vite';
import { style } from '@react-spectrum/s2/style' with { type: 'macro' };
import type { TagFilters } from 'src/features/tags/tagInventory';
import { defaultTagPageSearch } from 'src/features/tags/tagInventory';
import { TagFiltersPanel } from 'src/features/tags/filters/TagFiltersPanel';
import { useEffect, useState } from 'react';

type TagFiltersStoryArgs = {
  initialFilters: TagFilters;
  books: Array<{
    id: string;
    title: string;
  }>;
};

const canvasLayoutClassName = style({
  display: 'flex',
  justifyContent: 'center',
  minHeight: 420,
  padding: 24,
  width: 'full',
});

const contentRowClassName = style({
  display: 'flex',
  alignItems: 'start',
  gap: 16,
  width: 'full',
  maxWidth: 920,
});

const panelClassName = style({
  width: 360,
  flexShrink: 0,
});

const jsonPreviewClassName = style({
  marginY: 0,
  padding: 12,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: 'gray-400',
  borderRadius: 'lg',
  overflow: 'auto',
  maxHeight: 420,
  flexGrow: 1,
});

const StatefulTagFiltersPanel = ({ initialFilters, books }: TagFiltersStoryArgs) => {
  const [filters, setFilters] = useState<TagFilters>(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  return (
    <div className={canvasLayoutClassName}>
      <div className={contentRowClassName}>
        <div className={panelClassName}>
          <TagFiltersPanel
            filters={filters}
            books={books}
            onFiltersChange={(patch) => setFilters((previous) => ({ ...previous, ...patch }))}
          />
        </div>
        <pre className={jsonPreviewClassName}>
          {JSON.stringify(filters, null, 2)}
        </pre>
      </div>
    </div>
  );
};

const meta = {
  title: 'Features/Filters/Tags/Filters Panel',
  args: {
    initialFilters: {
      filterNameContains: defaultTagPageSearch.filterNameContains,
      filterBookId: defaultTagPageSearch.filterBookId,
    },
    books: [
      { id: 'book-1', title: 'A Wizard of Earthsea' },
      { id: 'book-2', title: 'Parable of the Sower' },
      { id: 'book-3', title: 'The Fifth Season' },
    ],
  },
  argTypes: {
    initialFilters: { control: 'object' },
    books: { control: 'object' },
  },
  render: (args) => <StatefulTagFiltersPanel {...args} />,
} satisfies Meta<TagFiltersStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Prefilled: Story = {
  args: {
    initialFilters: {
      filterNameContains: 'award',
      filterBookId: 'book-2',
    },
  },
};
