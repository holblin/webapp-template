import {
  Picker,
  PickerItem,
  TextField,
} from '@react-spectrum/s2';
import { style } from '@react-spectrum/s2/style' with { type: 'macro' };
import type { BookFilters } from 'src/features/books/bookInventory';

type Option = {
  id: string;
  name: string;
};

type BookFiltersPanelProps = {
  filters: BookFilters;
  authors: Option[];
  tags: Option[];
  onFiltersChange: (patch: Partial<BookFilters>) => void;
};

export const BookFiltersPanel = ({
  filters,
  authors,
  tags,
  onFiltersChange,
}: BookFiltersPanelProps) => (
  <div className={style({ display: 'flex', flexDirection: 'column', gap: 8 })}>
    <TextField
      label="Title contains"
      value={filters.filterTitleContains}
      onChange={(value) => onFiltersChange({ filterTitleContains: value })}
    />
    <Picker
      label="Author"
      value={filters.filterAuthorId || 'all'}
      onChange={(value) => onFiltersChange({ filterAuthorId: value === 'all' ? '' : String(value) })}
    >
      <PickerItem id="all">All authors</PickerItem>
      {authors.map((author) => (
        <PickerItem key={author.id} id={author.id}>{author.name}</PickerItem>
      ))}
    </Picker>
    <Picker
      label="Tag"
      value={filters.filterTagId || 'all'}
      onChange={(value) => onFiltersChange({ filterTagId: value === 'all' ? '' : String(value) })}
    >
      <PickerItem id="all">All tags</PickerItem>
      {tags.map((tag) => (
        <PickerItem key={tag.id} id={tag.id}>{tag.name}</PickerItem>
      ))}
    </Picker>
  </div>
);
