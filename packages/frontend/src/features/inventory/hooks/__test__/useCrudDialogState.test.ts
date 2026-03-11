import { describe, expect, it, vi } from 'vitest';

const setCreateDialogOpen = vi.fn();
const setEditingId = vi.fn();
const setDeletingId = vi.fn();

let useStateCall = 0;
vi.mock('react', () => ({
  useState: <TValue,>(initialValue: TValue) => {
    useStateCall += 1;
    if (useStateCall === 1) {
      return [initialValue, setCreateDialogOpen] as const;
    }
    if (useStateCall === 2) {
      return [null, setEditingId] as const;
    }
    return [null, setDeletingId] as const;
  },
}));

import { useCrudDialogState } from '../useCrudDialogState';

describe('useCrudDialogState', () => {
  it('exposes state and dialog open/close handlers', () => {
    const state = useCrudDialogState<string>();

    expect(state.isCreateDialogOpen).toBe(false);
    expect(state.editingId).toBeNull();
    expect(state.deletingId).toBeNull();
    expect(state.setIsCreateDialogOpen).toBe(setCreateDialogOpen);
    expect(state.setEditingId).toBe(setEditingId);
    expect(state.setDeletingId).toBe(setDeletingId);

    state.openCreateDialog();
    expect(setCreateDialogOpen).toHaveBeenCalledWith(true);

    state.closeAllDialogs();
    expect(setCreateDialogOpen).toHaveBeenCalledWith(false);
    expect(setEditingId).toHaveBeenCalledWith(null);
    expect(setDeletingId).toHaveBeenCalledWith(null);
  });
});
