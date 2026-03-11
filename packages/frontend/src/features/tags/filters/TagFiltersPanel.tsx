import {
  Picker,
  PickerItem,
  TextField,
} from '@react-spectrum/s2';
import { style } from '@react-spectrum/s2/style' with { type: 'macro' };
import type { TagFilters } from 'src/features/tags/tagInventory';

type BookOption = {
  id: string;
  title: string;
};

type TagFiltersPanelProps = {
  filters: TagFilters;
  books: BookOption[];
  onFiltersChange: (patch: Partial<TagFilters>) => void;
};

export const TagFiltersPanel = ({
  filters,
  books,
  onFiltersChange,
}: TagFiltersPanelProps) => (
  <div className={style({ display: 'flex', flexDirection: 'column', gap: 8 })}>
    <TextField
      label="Name contains"
      value={filters.filterNameContains}
      onChange={(value) => onFiltersChange({ filterNameContains: value })}
    />
    <Picker
      label="Book"
      value={filters.filterBookId || 'all'}
      onChange={(value) => onFiltersChange({ filterBookId: value === 'all' ? '' : String(value) })}
    >
      <PickerItem id="all">All books</PickerItem>
      {books.map((book) => (
        <PickerItem key={book.id} id={book.id}>{book.title}</PickerItem>
      ))}
    </Picker>
  </div>
);
