import { useState } from 'react';

export const useCrudDialogState = <TId extends string = string>() => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<TId | null>(null);
  const [deletingId, setDeletingId] = useState<TId | null>(null);

  const openCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  const closeAllDialogs = () => {
    setIsCreateDialogOpen(false);
    setEditingId(null);
    setDeletingId(null);
  };

  return {
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    openCreateDialog,
    editingId,
    setEditingId,
    deletingId,
    setDeletingId,
    closeAllDialogs,
  };
};
