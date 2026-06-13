import type { SortDescriptor } from '@react-spectrum/s2';
import type { ComponentProps, ReactNode } from 'react';
import type { ResizableColumn } from 'src/components/Table/ResizableColumn';

export type InventoryLayoutColumn<TRow extends object> = {
  id: string;
  header: ReactNode;
  isRowHeader?: boolean;
  allowsSorting?: boolean;
  sortField?: string;
  allowsResizing?: boolean;
  width?: ComponentProps<typeof ResizableColumn>['width'];
  defaultWidth?: ComponentProps<typeof ResizableColumn>['defaultWidth'];
  minWidth?: ComponentProps<typeof ResizableColumn>['minWidth'];
  maxWidth?: ComponentProps<typeof ResizableColumn>['maxWidth'];
  renderCell: (row: TRow) => ReactNode;
};

export type InventoryLayoutState = {
  offset: number;
  search: string;
  showFilters: boolean;
};

export type InventoryLayoutProps<
  TRow extends object,
  TState extends InventoryLayoutState,
  TFilters extends Record<string, unknown>,
> = {
  title: string;
  totalCount: number;
  state: TState;
  onStateChange: (nextState: TState) => void;
  topRight?: ReactNode;
  columns: InventoryLayoutColumn<TRow>[];
  rows: TRow[];
  getRowId: (row: TRow) => string;
  ariaLabel: string;
  getFilters: (state: TState) => TFilters;
  getActiveFilters?: (state: TState, filters: TFilters) => Array<{
    id: string;
    label: string;
    patch: Partial<TState>;
  }>;
  clearFiltersPatch?: Partial<TState>;
  renderFilterPanel: (filters: TFilters, onFiltersChange: (patch: Partial<TFilters>) => void) => ReactNode;
  loadingState?: 'loading' | 'loadingMore' | 'sorting' | 'filtering' | 'idle';
  onLoadMore?: () => void;
  sortDescriptor?: SortDescriptor;
  onSortChange?: (
    descriptor: SortDescriptor,
    column: InventoryLayoutColumn<TRow> | undefined,
    onStatePatch: (patch: Partial<TState>, resetOffset?: boolean) => void,
  ) => void;
};
