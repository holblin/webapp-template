import type { SortDescriptor } from '@react-spectrum/s2';
import { SortDirection } from 'src/__generated__/gql/graphql';
import type { InventoryLayoutColumn } from 'src/components/Inventory/InventoryLayout';

type SortByState<TSortBy extends string> = {
  sortBy: TSortBy;
  sortDirection: SortDirection;
};

export const buildTableSortDescriptor = <TSortBy extends string>(
  sortBy: TSortBy,
  sortDirection: SortDirection,
  columnBySortBy: Partial<Record<TSortBy, string>>,
  fallbackColumn: string,
): SortDescriptor => ({
  column: columnBySortBy[sortBy] ?? fallbackColumn,
  direction: sortDirection === SortDirection.Desc ? 'descending' : 'ascending',
});

export const applyInventorySortPatch = <
  TState extends SortByState<TSortBy>,
  TSortBy extends string,
  TRow extends object,
>(
  descriptor: SortDescriptor,
  column: InventoryLayoutColumn<TRow> | undefined,
  onStatePatch: (patch: Partial<TState>, resetOffset?: boolean) => void,
) => {
  if (!column?.sortField) {
    return;
  }

  onStatePatch({
    sortBy: column.sortField as TSortBy,
    sortDirection: descriptor.direction === 'descending' ? SortDirection.Desc : SortDirection.Asc,
  } as Partial<TState>, true);
};
