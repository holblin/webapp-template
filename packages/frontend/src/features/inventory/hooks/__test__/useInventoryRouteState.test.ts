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

    const { searchState, onStateChange } = useInventoryRouteState(routeApi);
    expect(searchState).toBe(state);

    const nextState = {
      ...state,
      search: 'author',
      offset: 0,
    };

    onStateChange(nextState);
    expect(navigate).toHaveBeenCalledWith({ search: nextState, replace: true });
  });
});
