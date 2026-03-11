import { NetworkStatus } from '@apollo/client';
import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  useQueryMock: vi.fn(),
}));

vi.mock('@apollo/client/react', () => ({
  useQuery: mocks.useQueryMock,
}));

import { useInventoryConnectionQuery } from '../useInventoryConnectionQuery';

type TestNode = { id: string };
type TestEdge = { cursor: string; node: TestNode };
type TestData = {
  list: {
    edges: TestEdge[];
    totalCount: number;
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
};
type TestVariables = { offset: number; limit?: number; after?: string };

describe('useInventoryConnectionQuery', () => {
  it('maps loading and connection state to inventory shape', () => {
    const refetch = vi.fn();
    const fetchMore = vi.fn();
    mocks.useQueryMock.mockReturnValue({
      data: {
        list: {
          edges: [{ cursor: 'c1', node: { id: '1' } }],
          totalCount: 1,
          pageInfo: { hasNextPage: false, endCursor: null },
        },
      },
      loading: true,
      error: undefined,
      networkStatus: NetworkStatus.loading,
      refetch,
      fetchMore,
    });

    const result = useInventoryConnectionQuery<TestData, TestVariables, TestEdge, TestNode>({
      query: {} as never,
      variables: { offset: 0 },
      getConnectionState: (data) => ({
        edges: data?.list.edges ?? [],
        totalCount: data?.list.totalCount ?? 0,
        hasNextPage: data?.list.pageInfo.hasNextPage ?? false,
        endCursor: data?.list.pageInfo.endCursor ?? null,
      }),
      mapRows: (edges) => edges.map((edge) => edge.node),
      getFetchMoreVariables: (baseVariables, endCursor) => ({ ...baseVariables, after: endCursor }),
    });

    expect(result.rows).toEqual([{ id: '1' }]);
    expect(result.totalCount).toBe(1);
    expect(result.hasNextPage).toBe(false);
    expect(result.endCursor).toBeNull();
    expect(result.loadingState).toBe('loadingMore');
    expect(result.onLoadMore).toBeUndefined();
    expect(result.refetch).toBe(refetch);
    expect(result.error).toBeUndefined();
  });

  it('creates onLoadMore callback when next page is available', async () => {
    const fetchMore = vi.fn().mockResolvedValue(undefined);
    mocks.useQueryMock.mockReturnValue({
      data: {
        list: {
          edges: [{ cursor: 'c1', node: { id: '1' } }],
          totalCount: 2,
          pageInfo: { hasNextPage: true, endCursor: 'cursor-1' },
        },
      },
      loading: false,
      error: undefined,
      networkStatus: NetworkStatus.ready,
      refetch: vi.fn(),
      fetchMore,
    });

    const result = useInventoryConnectionQuery<TestData, TestVariables, TestEdge, TestNode>({
      query: {} as never,
      variables: { offset: 10, limit: 20 },
      getConnectionState: (data) => ({
        edges: data?.list.edges ?? [],
        totalCount: data?.list.totalCount ?? 0,
        hasNextPage: data?.list.pageInfo.hasNextPage ?? false,
        endCursor: data?.list.pageInfo.endCursor ?? null,
      }),
      mapRows: (edges) => edges.map((edge) => edge.node),
      getFetchMoreVariables: (baseVariables, endCursor) => ({ ...baseVariables, after: endCursor }),
    });

    expect(result.loadingState).toBe('idle');
    expect(result.onLoadMore).toBeTypeOf('function');

    await result.onLoadMore?.();
    expect(fetchMore).toHaveBeenCalledWith({
      variables: { offset: 10, limit: 20, after: 'cursor-1' },
    });
  });

  it('reports loadingMore while fetchMore is in progress', () => {
    mocks.useQueryMock.mockReturnValue({
      data: {
        list: {
          edges: [],
          totalCount: 0,
          pageInfo: { hasNextPage: true, endCursor: 'cursor-1' },
        },
      },
      loading: false,
      error: undefined,
      networkStatus: NetworkStatus.fetchMore,
      refetch: vi.fn(),
      fetchMore: vi.fn(),
    });

    const result = useInventoryConnectionQuery<TestData, TestVariables, TestEdge, TestEdge>({
      query: {} as never,
      variables: { offset: 0 },
      getConnectionState: (data) => ({
        edges: data?.list.edges ?? [],
        totalCount: data?.list.totalCount ?? 0,
        hasNextPage: data?.list.pageInfo.hasNextPage ?? false,
        endCursor: data?.list.pageInfo.endCursor ?? null,
      }),
      mapRows: (edges) => edges,
      getFetchMoreVariables: (baseVariables, endCursor) => ({ ...baseVariables, after: endCursor }),
    });

    expect(result.loadingState).toBe('loadingMore');
    expect(result.onLoadMore).toBeUndefined();
  });

  it('reports loading when there are no rows yet', () => {
    mocks.useQueryMock.mockReturnValue({
      data: {
        list: {
          edges: [],
          totalCount: 0,
          pageInfo: { hasNextPage: false, endCursor: null },
        },
      },
      loading: true,
      error: undefined,
      networkStatus: NetworkStatus.loading,
      refetch: vi.fn(),
      fetchMore: vi.fn(),
    });

    const result = useInventoryConnectionQuery<TestData, TestVariables, TestEdge, TestEdge>({
      query: {} as never,
      variables: { offset: 0 },
      getConnectionState: (data) => ({
        edges: data?.list.edges ?? [],
        totalCount: data?.list.totalCount ?? 0,
        hasNextPage: data?.list.pageInfo.hasNextPage ?? false,
        endCursor: data?.list.pageInfo.endCursor ?? null,
      }),
      mapRows: (edges) => edges,
      getFetchMoreVariables: (baseVariables, endCursor) => ({ ...baseVariables, after: endCursor }),
    });

    expect(result.loadingState).toBe('loading');
    expect(result.rows).toEqual([]);
  });
});
