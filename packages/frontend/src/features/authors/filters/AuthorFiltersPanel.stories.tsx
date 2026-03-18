import type { Meta, StoryObj } from '@storybook/react-vite';
import { style } from '@react-spectrum/s2/style' with { type: 'macro' };
import { AuthorCountry } from 'src/__generated__/gql/graphql';
import type { AuthorFilters } from 'src/features/authors/authorInventory';
import { defaultAuthorPageSearch } from 'src/features/authors/authorInventory';
import { AuthorFiltersPanel } from 'src/features/authors/filters/AuthorFiltersPanel';
import { useEffect, useState } from 'react';

type AuthorFiltersStoryArgs = {
  initialFilters: AuthorFilters;
  tags: Array<{
    id: string;
    name: string;
  }>;
};

const StatefulAuthorFiltersPanel = ({ initialFilters, tags }: AuthorFiltersStoryArgs) => {
  const [filters, setFilters] = useState<AuthorFilters>(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  return (
    <div className={style({ display: 'flex', justifyContent: 'center', minHeight: 420, padding: 24, width: 'full' })}>
      <div className={style({ display: 'flex', alignItems: 'start', gap: 16, width: 'full', maxWidth: 920 })}>
        <div className={style({ width: 360, flexShrink: 0 })}>
          <AuthorFiltersPanel
            filters={filters}
            tags={tags}
            onFiltersChange={(patch) => setFilters((previous) => ({ ...previous, ...patch }))}
          />
        </div>
        <pre
          className={style({
            marginY: 0,
            padding: 12,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: 'gray-400',
            borderRadius: 'lg',
            overflow: 'auto',
            maxHeight: 420,
            flexGrow: 1,
          })}
        >
          {JSON.stringify(filters, null, 2)}
        </pre>
      </div>
    </div>
  );
};

const meta = {
  title: 'Features/Filters/Authors/Filters Panel',
  args: {
    initialFilters: {
      filterNameContains: defaultAuthorPageSearch.filterNameContains,
      filterCountry: defaultAuthorPageSearch.filterCountry,
      filterIsActive: defaultAuthorPageSearch.filterIsActive,
      filterBirthDateFrom: defaultAuthorPageSearch.filterBirthDateFrom,
      filterBirthDateTo: defaultAuthorPageSearch.filterBirthDateTo,
      filterHasBookTagId: defaultAuthorPageSearch.filterHasBookTagId,
      filterHasBookGenre: defaultAuthorPageSearch.filterHasBookGenre,
      filterMinBookCount: defaultAuthorPageSearch.filterMinBookCount,
      filterPublishedAfterYear: defaultAuthorPageSearch.filterPublishedAfterYear,
      filterMinAverageBookRating: defaultAuthorPageSearch.filterMinAverageBookRating,
    },
    tags: [
      { id: 'tag-1', name: 'Classic' },
      { id: 'tag-2', name: 'Sci-Fi' },
      { id: 'tag-3', name: 'History' },
    ],
  },
  argTypes: {
    initialFilters: { control: 'object' },
    tags: { control: 'object' },
  },
  render: (args) => <StatefulAuthorFiltersPanel {...args} />,
} satisfies Meta<AuthorFiltersStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Prefilled: Story = {
  args: {
    initialFilters: {
      filterNameContains: 'Le Guin',
      filterCountry: AuthorCountry.Us,
      filterIsActive: 'active',
      filterBirthDateFrom: '1900-01-01',
      filterBirthDateTo: '1970-12-31',
      filterHasBookTagId: 'tag-2',
      filterHasBookGenre: 'Sci-Fi',
      filterMinBookCount: 2,
      filterPublishedAfterYear: 1960,
      filterMinAverageBookRating: 4.2,
    },
  },
};
