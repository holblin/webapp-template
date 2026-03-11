import {
  DateRangePicker,
  NumberField,
  Picker,
  PickerItem,
  TextField,
} from '@react-spectrum/s2';
import { style } from '@react-spectrum/s2/style' with { type: 'macro' };
import { AuthorCountry } from 'src/__generated__/gql/graphql';
import {
  authorCountryOptions,
  authorGenreOptions,
  toCalendarDateRange,
  type AuthorFilters,
} from 'src/features/authors/authorInventory';

type AuthorFiltersPanelProps = {
  filters: AuthorFilters;
  tags: Array<{
    id: string;
    name: string;
  }>;
  onFiltersChange: (patch: Partial<AuthorFilters>) => void;
};

export const AuthorFiltersPanel = ({
  filters,
  tags,
  onFiltersChange,
}: AuthorFiltersPanelProps) => (
  <div className={style({ display: 'flex', flexDirection: 'column', gap: 8 })}>
    <TextField
      label="Name contains"
      value={filters.filterNameContains}
      onChange={(value) => onFiltersChange({ filterNameContains: value })}
    />
    <Picker
      label="Country"
      value={filters.filterCountry || 'all'}
      onChange={(value) => onFiltersChange({ filterCountry: value === 'all' ? '' : (String(value) as AuthorCountry) })}
    >
      <PickerItem id="all">All countries</PickerItem>
      {authorCountryOptions.map((country) => (
        <PickerItem key={country} id={country}>{country}</PickerItem>
      ))}
    </Picker>
    <Picker
      label="Active status"
      value={filters.filterIsActive}
      onChange={(value) => onFiltersChange({ filterIsActive: String(value) as AuthorFilters['filterIsActive'] })}
    >
      <PickerItem id="all">All</PickerItem>
      <PickerItem id="active">Active</PickerItem>
      <PickerItem id="inactive">Inactive</PickerItem>
    </Picker>
    <DateRangePicker
      label="Birth date range"
      value={toCalendarDateRange(filters.filterBirthDateFrom, filters.filterBirthDateTo)}
      onChange={(value) => onFiltersChange({
        filterBirthDateFrom: value?.start.toString() ?? '',
        filterBirthDateTo: value?.end.toString() ?? '',
      })}
    />
    <Picker
      label="Has book with tag"
      value={filters.filterHasBookTagId || 'all'}
      onChange={(value) => onFiltersChange({ filterHasBookTagId: value === 'all' ? '' : String(value) })}
    >
      <PickerItem id="all">All tags</PickerItem>
      {tags.map((tag) => (
        <PickerItem key={tag.id} id={tag.id}>{tag.name}</PickerItem>
      ))}
    </Picker>
    <Picker
      label="Has book genre"
      value={filters.filterHasBookGenre || 'all'}
      onChange={(value) => onFiltersChange({ filterHasBookGenre: value === 'all' ? '' : String(value) })}
    >
      <PickerItem id="all">All genres</PickerItem>
      {authorGenreOptions.map((genre) => (
        <PickerItem key={genre} id={genre}>{genre}</PickerItem>
      ))}
    </Picker>
    <NumberField
      label="More than N books"
      value={filters.filterMinBookCount}
      minValue={0}
      onChange={(value) => onFiltersChange({ filterMinBookCount: Math.max(0, Math.trunc(value ?? 0)) })}
    />
    <NumberField
      label="Books published after year"
      value={filters.filterPublishedAfterYear}
      minValue={0}
      onChange={(value) => onFiltersChange({ filterPublishedAfterYear: Math.max(0, Math.trunc(value ?? 0)) })}
    />
    <NumberField
      label="Average rating above"
      value={filters.filterMinAverageBookRating}
      minValue={0}
      maxValue={5}
      step={0.1}
      onChange={(value) => onFiltersChange({ filterMinAverageBookRating: Math.max(0, Math.min(5, value ?? 0)) })}
    />
  </div>
);
