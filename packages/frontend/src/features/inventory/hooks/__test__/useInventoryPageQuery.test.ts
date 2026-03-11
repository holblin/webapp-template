import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  useInventoryRouteStateMock: vi.fn(),
  useInventoryConnectionQueryMock: vi.fn(),
  useErrorToastMock: vi.fn(),
}));

vi.mock('react', async () => {
  const actual = await vi.importActual<typeof import('react')>('react');
  return {
    ...actual,
    useMemo: <TValue,>(factory: () => TValue) => factory(),
  };
});

vi.mock('src/features/inventory/hooks/useInventoryRouteState', () => ({
  useInventoryRouteState: mocks.useInventoryRouteStateMock,
}));

vi.mock('src/features/inventory/hooks/useInventoryConnectionQuery', () => ({
  useInventoryConnectionQuery: mocks.useInventoryConnectionQueryMock,
}));

vi.mock('src/features/inventory/hooks/useErrorToast', () => ({
  useErrorToast: mocks.useErrorToastMock,
}));

import { useInventoryPageQuery } from '../useInventoryPageQuery';

type TestSearch = { offset: number; limit: number; search: string };
type TestVariables = TestSearch & { after?: string };
type TestNode = { id: string };
type TestEdge = { cursor: string; node: TestNode };
type TestConnection = {
  edges: TestEdge[];
  totalCount: number;
  pageInfo: {
    hasNextPage: boolean;
    endCursor?: string | null;
  };
};

describe('useInventoryPageQuery', () => {
  it('maps route/search/query state and exposes refresh', async () => {
    const onStateChange = vi.fn();
    const refetch = vi.fn().mockResolvedValue(undefined);
    const queryVariables = { offset: 0, limit: 20, search: '', after: undefined };

    mocks.useInventoryRouteStateMock.mockReturnValue({
      searchState: { offset: 0, limit: 20, search: '' },
      onStateChange,
    });
    mocks.useInventoryConnectionQueryMock.mockReturnValue({
      rows: [{ cursor: 'cursor-1', node: { id: '1' } }],
      totalCount: 1,
      loadingState: 'idle',
      onLoadMore: vi.fn(),
      refetch,
      error: { message: 'boom' },
    });

    const result = useInventoryPageQuery<TestSearch, TestVariables, TestConnection, TestEdge>({
      routeApi: {} as never,
      toVariables: () => queryVariables,
      query: {} as never,
      getConnection: (data: unknown) => data as never,
    });

    expect(result.searchState).toEqual({ offset: 0, limit: 20, search: '' });
    expect(result.onStateChange).toBe(onStateChange);
    expect(result.variables).toBe(queryVariables);
    expect(result.rows).toEqual([{ cursor: 'cursor-1', node: { id: '1' } }]);
    expect(result.totalCount).toBe(1);
    expect(result.loadingState).toBe('idle');
    expect(result.onLoadMore).toBeTypeOf('function');
    expect(mocks.useErrorToastMock).toHaveBeenCalledWith('boom');

    await result.refresh();
    expect(refetch).toHaveBeenCalledWith(queryVariables);
  });

  it('passes connection mappers that normalize edges and fetchMore variables', () => {
    mocks.useInventoryRouteStateMock.mockReturnValue({
      searchState: { offset: 0, limit: 20, search: '' },
      onStateChange: vi.fn(),
    });
    mocks.useInventoryConnectionQueryMock.mockReturnValue({
      rows: [],
      totalCount: 0,
      loadingState: 'idle',
      onLoadMore: undefined,
      refetch: vi.fn(),
      error: undefined,
    });

    useInventoryPageQuery<TestSearch, TestVariables, TestConnection, TestEdge>({
      routeApi: {} as never,
      toVariables: (state) => ({ ...state, after: undefined }),
      query: {} as never,
      getConnection: (data: unknown) => data as never,
    });

    const params = mocks.useInventoryConnectionQueryMock.mock.calls[0]?.[0] as {
      getConnectionState: (data: unknown) => {
        edges: unknown[];
        totalCount: number;
        hasNextPage: boolean;
        endCursor: string | null;
      };
      mapRows: (edges: Array<{ cursor: string; node: { id: string } }>) => Array<{ cursor: string; node: { id: string } }>;
      getFetchMoreVariables: (variables: { offset: number; limit: number; after?: string }, endCursor: string) => {
        offset: number;
        limit: number;
        after: string;
      };
    };

    expect(params.getConnectionState(undefined)).toEqual({
      edges: [],
      totalCount: 0,
      hasNextPage: false,
      endCursor: null,
    });
    expect(
      params.getConnectionState({
        edges: [{ cursor: 'c1', node: { id: '1' } }],
        totalCount: 1,
        pageInfo: { hasNextPage: true, endCursor: 'next' },
      }),
    ).toEqual({
      edges: [{ cursor: 'c1', node: { id: '1' } }],
      totalCount: 1,
      hasNextPage: true,
      endCursor: 'next',
    });
    expect(params.mapRows([{ cursor: 'c1', node: { id: '1' } }])).toEqual([{ cursor: 'c1', node: { id: '1' } }]);
    expect(params.getFetchMoreVariables({ offset: 0, limit: 20, after: undefined }, 'cursor-2')).toEqual({
      offset: 0,
      limit: 20,
      after: 'cursor-2',
    });
    expect(mocks.useErrorToastMock).toHaveBeenCalledWith(undefined);
  });
});
