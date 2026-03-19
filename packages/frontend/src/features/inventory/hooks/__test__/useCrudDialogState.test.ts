import { act, createElement, useEffect } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { useCrudDialogState } from '../useCrudDialogState';

type CrudDialogState = ReturnType<typeof useCrudDialogState<string>>;

let root: Root | null = null;
let container: HTMLDivElement | null = null;
let latestState: CrudDialogState | null = null;

const TestHarness = () => {
  const state = useCrudDialogState<string>();

  useEffect(() => {
    latestState = state;
  }, [state]);

  return null;
};

const getState = () => {
  if (!latestState) {
    throw new Error('Hook state is not initialized.');
  }
  return latestState;
};

const renderHarness = () => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => {
    if (!root) {
      throw new Error('Root is not initialized.');
    }
    root.render(createElement(TestHarness));
  });
};

afterEach(() => {
  act(() => {
    root?.unmount();
  });
  container?.remove();
  root = null;
  container = null;
  latestState = null;
});

describe('useCrudDialogState', () => {
  it('increments create open cycle only on false-to-true transitions', () => {
    renderHarness();

    expect(getState().isCreateDialogOpen).toBe(false);
    expect(getState().createDialogOpenCycle).toBe(0);

    act(() => {
      getState().openCreateDialog();
    });

    expect(getState().isCreateDialogOpen).toBe(true);
    expect(getState().createDialogOpenCycle).toBe(1);

    act(() => {
      getState().openCreateDialog();
    });

    expect(getState().isCreateDialogOpen).toBe(true);
    expect(getState().createDialogOpenCycle).toBe(1);

    act(() => {
      getState().setEditingId('author-1');
      getState().setDeletingId('author-2');
    });

    expect(getState().editingId).toBe('author-1');
    expect(getState().deletingId).toBe('author-2');

    act(() => {
      getState().closeAllDialogs();
    });

    expect(getState().isCreateDialogOpen).toBe(false);
    expect(getState().editingId).toBeNull();
    expect(getState().deletingId).toBeNull();
    expect(getState().createDialogOpenCycle).toBe(1);

    act(() => {
      getState().openCreateDialog();
    });

    expect(getState().isCreateDialogOpen).toBe(true);
    expect(getState().createDialogOpenCycle).toBe(2);
  });
});
