import {
  ActionButton,
  Cell,
  Column,
  Divider,
  Row,
  SearchField,
  TableBody,
  TableHeader,
  TableView,
  type SortDescriptor,
} from '@react-spectrum/s2';
import { style } from '@react-spectrum/s2/style' with { type: 'macro' };
import type { ReactNode } from 'react';

export type InventoryLayoutColumn<TRow extends object> = {
  id: string;
  header: ReactNode;
  isRowHeader?: boolean;
  allowsSorting?: boolean;
  sortField?: string;
  allowsResizing?: boolean;
  renderCell: (row: TRow) => ReactNode;
};

export type InventoryLayoutState = {
  offset: number;
  search: string;
  showFilters: boolean;
};

export type InventoryLayoutProps<TRow extends object, TState extends InventoryLayoutState, TFilters extends Record<string, unknown>> = {
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

export const InventoryLayout = <
  TRow extends object,
  TState extends InventoryLayoutState,
  TFilters extends Record<string, unknown>,
>({
  title,
  totalCount,
  state,
  onStateChange,
  topRight,
  columns,
  rows,
  getRowId,
  ariaLabel,
  getFilters,
  getActiveFilters,
  clearFiltersPatch,
  renderFilterPanel,
  loadingState = 'idle',
  onLoadMore,
  sortDescriptor,
  onSortChange,
}: InventoryLayoutProps<TRow, TState, TFilters>) => {
  const onStatePatch = (patch: Partial<TState>, resetOffset = false) => {
    const nextState: TState = {
      ...state,
      ...patch,
      offset: resetOffset ? 0 : (patch.offset ?? state.offset),
    };

    onStateChange(nextState);
  };

  const filters = getFilters(state);
  const activeFilters = getActiveFilters ? getActiveFilters(state, filters) : [];

  return (
    <div
      className={style({
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        flexGrow: 1,
        minHeight: 0,
      })}
    >
      <h1 className={style({ marginY: 0, font: 'heading-lg' })}>{title}</h1>
      <div className={style({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 })}>
        <div className={style({ display: 'flex', alignItems: 'center', gap: 8 })}>
          <ActionButton onPress={() => onStatePatch({ showFilters: !state.showFilters } as Partial<TState>)}>
            {state.showFilters ? 'Hide filters' : 'Show filters'}
          </ActionButton>
          <SearchField
            aria-label={`Search ${title}`}
            placeholder={`Search ${title.toLowerCase()}`}
            value={state.search}
            onChange={(value) => onStatePatch({ search: value } as Partial<TState>, true)}
            styles={style({ width: 320 })}
          />
          <div className={style({ color: 'gray-700', font: 'body-sm' })}>{totalCount} item(s)</div>
        </div>
        {topRight}
      </div>
      {activeFilters.length > 0 ? (
        <div
          className={style({
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
          })}
        >
          {activeFilters.map((activeFilter) => (
            <ActionButton
              key={activeFilter.id}
              onPress={() => onStatePatch(activeFilter.patch, true)}
            >
              {activeFilter.label} ✕
            </ActionButton>
          ))}
          {clearFiltersPatch ? (
            <>
              <Divider orientation="vertical" />
              <ActionButton onPress={() => onStatePatch(clearFiltersPatch, true)}>
                Clear all
              </ActionButton>
            </>
          ) : null}
        </div>
      ) : null}
      <div className={style({ display: 'flex', gap: 12, flexGrow: 1, minHeight: 0 })}>
        {state.showFilters ? (
          <div
            className={style({
              width: 280,
              flexShrink: 0,
              borderWidth: 1,
              borderColor: 'gray-300',
              borderStyle: 'solid',
              borderRadius: 'lg',
              padding: 12,
              overflow: 'auto',
              backgroundColor: 'gray-50',
            })}
          >
            {renderFilterPanel(filters, (patch) => onStatePatch(patch as Partial<TState>, true))}
          </div>
        ) : null}
        <div
          className={style({
            flexGrow: 1,
            minWidth: 0,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          })}
        >
          <div className={style({ display: 'flex', flexDirection: 'column', gap: 8, flexGrow: 1, minHeight: 0 })}>
            <TableView
              aria-label={ariaLabel}
              styles={style({ width: 'full', height: 'full' })}
              loadingState={loadingState}
              onLoadMore={onLoadMore}
              sortDescriptor={sortDescriptor}
              onSortChange={onSortChange
                ? (descriptor) => {
                  const column = columns.find((entry) => entry.id === String(descriptor.column));
                  onSortChange(descriptor, column, onStatePatch);
                }
                : undefined}
            >
              <TableHeader>
                {columns.map((column) => (
                  <Column
                    key={column.id}
                    id={column.id}
                    isRowHeader={column.isRowHeader}
                    allowsSorting={column.allowsSorting ?? Boolean(column.sortField)}
                    allowsResizing={column.allowsResizing ?? true}
                  >
                    {column.header}
                  </Column>
                ))}
              </TableHeader>
              <TableBody items={rows}>
                {(row) => (
                  <Row id={getRowId(row)}>
                    {columns.map((column) => (
                      <Cell key={column.id}>{column.renderCell(row)}</Cell>
                    ))}
                  </Row>
                )}
              </TableBody>
            </TableView>
          </div>
        </div>
      </div>
    </div>
  );
};
