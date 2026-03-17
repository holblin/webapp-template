import {
  ActionButton,
  Button,
  ButtonGroup,
  Cell,
  Column,
  Content,
  Divider,
  Dialog,
  DialogContainer,
  Heading,
  Row,
  SearchField,
  TableBody,
  TableHeader,
  TableView,
  type SortDescriptor,
} from '@react-spectrum/s2';
import { style } from '@react-spectrum/s2/style' with { type: 'macro' };
import type { ReactNode } from 'react';
import { useState } from 'react';
import { useIsSmallViewport } from 'src/components/Responsive/useIsSmallViewport';

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
  const isPhoneViewport = useIsSmallViewport(680);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
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
  const isInlineFilterVisible = !isPhoneViewport && state.showFilters;
  const controlsContainerClassName = isPhoneViewport
    ? style({ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'stretch' })
    : style({ display: 'flex', alignItems: 'center', gap: 8 });
  const controlsTopBarClassName = isPhoneViewport
    ? style({ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 8 })
    : style({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 });
  const searchFieldClassName = isPhoneViewport
    ? style({ width: 'full' })
    : style({ width: 320 });
  const filterButtonLabel = activeFilters.length > 0
    ? `Filters (${activeFilters.length})`
    : 'Filters';
  const tableContainerClassName = isPhoneViewport
    ? style({ display: 'flex', flexDirection: 'column', gap: 8, flexGrow: 1, minHeight: 0, overflow: 'auto' })
    : style({ display: 'flex', flexDirection: 'column', gap: 8, flexGrow: 1, minHeight: 0 });
  const tableStyles = isPhoneViewport
    ? style({ width: 'full', height: 'full', minWidth: 720 })
    : style({ width: 'full', height: 'full' });
  const layoutContainerClassName = isPhoneViewport
    ? style({
      padding: 12,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      flexGrow: 1,
      minHeight: 0,
    })
    : style({
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      flexGrow: 1,
      minHeight: 0,
    });

  return (
    <div className={layoutContainerClassName}>
      <h1 className={style({ marginY: 0, font: 'heading-lg' })}>{title}</h1>
      <div className={controlsTopBarClassName}>
        <div className={controlsContainerClassName}>
          <ActionButton
            onPress={() => {
              if (isPhoneViewport) {
                setIsFilterDialogOpen(true);
                return;
              }

              onStatePatch({ showFilters: !state.showFilters } as Partial<TState>);
            }}
          >
            {isPhoneViewport ? filterButtonLabel : (state.showFilters ? 'Hide filters' : 'Show filters')}
          </ActionButton>
          <SearchField
            aria-label={`Search ${title}`}
            placeholder={`Search ${title.toLowerCase()}`}
            value={state.search}
            onChange={(value) => onStatePatch({ search: value } as Partial<TState>, true)}
            styles={searchFieldClassName}
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
        {isInlineFilterVisible ? (
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
          <div className={tableContainerClassName}>
            <TableView
              aria-label={ariaLabel}
              styles={tableStyles}
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
      <DialogContainer onDismiss={() => setIsFilterDialogOpen(false)}>
        {isFilterDialogOpen ? (
          <Dialog>
            {({ close }) => (
              <>
                <Heading slot="title">Filters</Heading>
                <Content>
                  <div className={style({ display: 'flex', flexDirection: 'column', gap: 12 })}>
                    {renderFilterPanel(filters, (patch) => onStatePatch(patch as Partial<TState>, true))}
                  </div>
                </Content>
                <ButtonGroup>
                  <Button
                    variant="secondary"
                    onPress={() => {
                      close();
                      setIsFilterDialogOpen(false);
                    }}
                  >
                    Close
                  </Button>
                </ButtonGroup>
              </>
            )}
          </Dialog>
        ) : null}
      </DialogContainer>
    </div>
  );
};
