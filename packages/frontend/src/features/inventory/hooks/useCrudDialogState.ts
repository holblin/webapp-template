import { useState } from 'react';

export const useCrudDialogState = <TId extends string = string>() => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createDialogOpenCycle, setCreateDialogOpenCycle] = useState(0);
  const [editingId, setEditingId] = useState<TId | null>(null);
  const [deletingId, setDeletingId] = useState<TId | null>(null);

  const openCreateDialog = () => {
    if (!isCreateDialogOpen) {
      setCreateDialogOpenCycle((current) => current + 1);
    }
    setIsCreateDialogOpen(true);
  };

  const closeAllDialogs = () => {
    setIsCreateDialogOpen(false);
    setEditingId(null);
    setDeletingId(null);
  };

  return {
    isCreateDialogOpen,
    createDialogOpenCycle,
    setIsCreateDialogOpen,
    openCreateDialog,
    editingId,
    setEditingId,
    deletingId,
    setDeletingId,
    closeAllDialogs,
  };
};
