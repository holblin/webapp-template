import { describe, expect, it, vi } from 'vitest';
import { SortDirection } from 'src/__generated__/gql/graphql';
import type { InventoryLayoutColumn } from 'src/components/Inventory/InventoryLayout';
import { applyInventorySortPatch, buildTableSortDescriptor } from '../sorting';

type SortBy = 'id' | 'name';

type TestState = {
  sortBy: SortBy;
  sortDirection: SortDirection;
  offset: number;
};

describe('buildTableSortDescriptor', () => {
  it('maps GraphQL sort direction to table descriptor', () => {
    const descriptor = buildTableSortDescriptor(
      'name',
      SortDirection.Desc,
      { name: 'authorName' },
      'fallback',
    );

    expect(descriptor).toEqual({
      column: 'authorName',
      direction: 'descending',
    });
  });

  it('uses fallback column when sort key is unmapped', () => {
    const descriptor = buildTableSortDescriptor<SortBy>('id', SortDirection.Asc, { name: 'authorName' }, 'id');
    expect(descriptor.column).toBe('id');
    expect(descriptor.direction).toBe('ascending');
  });
});

describe('applyInventorySortPatch', () => {
  it('calls state patch with mapped sort field and reset flag', () => {
    const onStatePatch = vi.fn();
    const column: InventoryLayoutColumn<object> = {
      id: 'name',
      header: 'Name',
      allowsSorting: true,
      sortField: 'name',
      renderCell: () => null,
    };

    applyInventorySortPatch<TestState, SortBy, object>(
      { column: 'name', direction: 'descending' },
      column,
      onStatePatch,
    );

    expect(onStatePatch).toHaveBeenCalledWith(
      { sortBy: 'name', sortDirection: SortDirection.Desc },
      true,
    );
  });

  it('does not patch state when column has no sortField', () => {
    const onStatePatch = vi.fn();
    const column: InventoryLayoutColumn<object> = {
      id: 'actions',
      header: 'Actions',
      renderCell: () => null,
    };

    applyInventorySortPatch<TestState, SortBy, object>(
      { column: 'actions', direction: 'ascending' },
      column,
      onStatePatch,
    );

    expect(onStatePatch).not.toHaveBeenCalled();
  });

  it('maps ascending table direction to Asc sort direction', () => {
    const onStatePatch = vi.fn();
    const column: InventoryLayoutColumn<object> = {
      id: 'id',
      header: 'ID',
      sortField: 'id',
      renderCell: () => null,
    };

    applyInventorySortPatch<TestState, SortBy, object>(
      { column: 'id', direction: 'ascending' },
      column,
      onStatePatch,
    );

    expect(onStatePatch).toHaveBeenCalledWith(
      { sortBy: 'id', sortDirection: SortDirection.Asc },
      true,
    );
  });
});
