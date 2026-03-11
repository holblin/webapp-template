import {
  Button,
  DialogContainer,
} from '@react-spectrum/s2';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { useCrudDialogState } from 'src/features/inventory/hooks/useCrudDialogState';
import {
  InventoryLayout,
  type InventoryLayoutColumn,
  type InventoryLayoutProps,
  type InventoryLayoutState,
} from './InventoryLayout';

type InventoryCrudLayoutProps<
  TRow extends object,
  TState extends InventoryLayoutState,
  TFilters extends Record<string, unknown>,
  TId extends string,
> = Omit<InventoryLayoutProps<TRow, TState, TFilters>, 'topRight' | 'columns'> & {
  createLabel: string;
  createColumns: (handlers: {
    onEditPress: (id: TId) => void;
    onDeletePress: (id: TId) => void;
  }) => InventoryLayoutColumn<TRow>[];
  renderCreateDialog: (onCompleted: () => void) => ReactNode;
  renderUpdateDialog: (id: TId, onCompleted: () => void) => ReactNode;
  renderDeleteDialog: (id: TId, onCompleted: () => void) => ReactNode;
  onRefresh: () => Promise<void> | void;
};

export const InventoryCrudLayout = <
  TRow extends object,
  TState extends InventoryLayoutState,
  TFilters extends Record<string, unknown>,
  TId extends string,
>({
  title,
  createLabel,
  totalCount,
  state,
  onStateChange,
  rows,
  getRowId,
  ariaLabel,
  getFilters,
  renderFilterPanel,
  loadingState = 'idle',
  onLoadMore,
  sortDescriptor,
  onSortChange,
  createColumns,
  renderCreateDialog,
  renderUpdateDialog,
  renderDeleteDialog,
  onRefresh,
}: InventoryCrudLayoutProps<TRow, TState, TFilters, TId>) => {
  const {
    isCreateDialogOpen,
    openCreateDialog,
    editingId,
    setEditingId,
    deletingId,
    setDeletingId,
    closeAllDialogs,
  } = useCrudDialogState<TId>();

  const columns = useMemo(() => createColumns({
    onEditPress: setEditingId,
    onDeletePress: setDeletingId,
  }), [createColumns, setDeletingId, setEditingId]);

  const onCompleted = () => {
    void onRefresh();
  };

  return (
    <>
      <InventoryLayout<TRow, TState, TFilters>
        title={title}
        totalCount={totalCount}
        state={state}
        onStateChange={onStateChange}
        topRight={(
          <Button variant="accent" onPress={openCreateDialog}>
            {createLabel}
          </Button>
        )}
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        ariaLabel={ariaLabel}
        getFilters={getFilters}
        renderFilterPanel={renderFilterPanel}
        loadingState={loadingState}
        onLoadMore={onLoadMore}
        sortDescriptor={sortDescriptor}
        onSortChange={onSortChange}
      />

      <DialogContainer onDismiss={closeAllDialogs}>
        {isCreateDialogOpen ? renderCreateDialog(onCompleted) : null}
        {editingId ? renderUpdateDialog(editingId, onCompleted) : null}
        {deletingId ? renderDeleteDialog(deletingId, onCompleted) : null}
      </DialogContainer>
    </>
  );
};
