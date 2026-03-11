import { describe, expect, it, vi } from 'vitest';
import { useInventoryRouteState, type InventoryRouteApi } from '../useInventoryRouteState';

describe('useInventoryRouteState', () => {
  it('returns current search state and writes updates via navigate', () => {
    const navigate = vi.fn();
    const state = {
      offset: 10,
      limit: 20,
      search: 'book',
    };

    const routeApi: InventoryRouteApi<typeof state> = {
      useSearch: () => state,
      useNavigate: () => navigate,
    };

    const defaultState = {
      offset: 0,
      limit: 20,
      search: '',
    };

    const { searchState, onStateChange } = useInventoryRouteState(routeApi, defaultState);
    expect(searchState).toBe(state);

    const nextState = {
      ...state,
      search: 'author',
      offset: 0,
    };

    onStateChange(nextState);
    expect(navigate).toHaveBeenCalledWith({
      search: {
        search: 'author',
      },
      replace: true,
    });
  });

  it('does not navigate when next state is unchanged', () => {
    const navigate = vi.fn();
    const state = {
      offset: 0,
      limit: 20,
      search: '',
    };

    const routeApi: InventoryRouteApi<typeof state> = {
      useSearch: () => state,
      useNavigate: () => navigate,
    };

    const { onStateChange } = useInventoryRouteState(routeApi, state);
    onStateChange({ ...state });

    expect(navigate).not.toHaveBeenCalled();
  });
});
