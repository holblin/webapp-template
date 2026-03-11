import type { Meta, StoryObj } from '@storybook/react-vite';
import { style } from '@react-spectrum/s2/style' with { type: 'macro' };
import type { BookFilters } from 'src/features/books/bookInventory';
import { defaultBookPageSearch } from 'src/features/books/bookInventory';
import { BookFiltersPanel } from 'src/features/books/filters/BookFiltersPanel';
import { useEffect, useState } from 'react';

type BookFiltersStoryArgs = {
  initialFilters: BookFilters;
  authors: Array<{
    id: string;
    name: string;
  }>;
  tags: Array<{
    id: string;
    name: string;
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

const StatefulBookFiltersPanel = ({ initialFilters, authors, tags }: BookFiltersStoryArgs) => {
  const [filters, setFilters] = useState<BookFilters>(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  return (
    <div className={canvasLayoutClassName}>
      <div className={contentRowClassName}>
        <div className={panelClassName}>
          <BookFiltersPanel
            filters={filters}
            authors={authors}
            tags={tags}
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
  title: 'Features/Filters/Books/Filters Panel',
  args: {
    initialFilters: {
      filterTitleContains: defaultBookPageSearch.filterTitleContains,
      filterAuthorId: defaultBookPageSearch.filterAuthorId,
      filterTagId: defaultBookPageSearch.filterTagId,
    },
    authors: [
      { id: 'author-1', name: 'Ursula K. Le Guin' },
      { id: 'author-2', name: 'Octavia E. Butler' },
      { id: 'author-3', name: 'N. K. Jemisin' },
    ],
    tags: [
      { id: 'tag-1', name: 'Classic' },
      { id: 'tag-2', name: 'Sci-Fi' },
      { id: 'tag-3', name: 'Fantasy' },
    ],
  },
  argTypes: {
    initialFilters: { control: 'object' },
    authors: { control: 'object' },
    tags: { control: 'object' },
  },
  render: (args) => <StatefulBookFiltersPanel {...args} />,
} satisfies Meta<BookFiltersStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Prefilled: Story = {
  args: {
    initialFilters: {
      filterTitleContains: 'Earth',
      filterAuthorId: 'author-1',
      filterTagId: 'tag-2',
    },
  },
};
