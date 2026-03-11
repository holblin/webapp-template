import { NetworkStatus, type OperationVariables, type TypedDocumentNode } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

export type InventoryConnectionState<TEdge> = {
  edges: TEdge[];
  totalCount: number;
  hasNextPage: boolean;
  endCursor: string | null;
};

export type InventoryConnectionLoadingState = 'loading' | 'loadingMore' | 'idle';

type UseInventoryConnectionQueryParams<TData, TVariables extends OperationVariables, TEdge, TRow> = {
  query: TypedDocumentNode<TData, TVariables>;
  variables: TVariables;
  getConnectionState: (data: TData | undefined) => InventoryConnectionState<TEdge>;
  mapRows: (edges: TEdge[]) => TRow[];
  getFetchMoreVariables: (baseVariables: TVariables, endCursor: string) => TVariables;
};

export const useInventoryConnectionQuery = <TData, TVariables extends OperationVariables, TEdge, TRow>({
  query,
  variables,
  getConnectionState,
  mapRows,
  getFetchMoreVariables,
}: UseInventoryConnectionQueryParams<TData, TVariables, TEdge, TRow>) => {
  const { data, loading, error, networkStatus, refetch, fetchMore } = useQuery(query, {
    variables,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const connection = getConnectionState(data as TData | undefined);
  const rows = mapRows(connection.edges);

  const endCursor = connection.endCursor;
  const onLoadMore = connection.hasNextPage && typeof endCursor === 'string' && networkStatus !== NetworkStatus.fetchMore
    ? async () => {
      await fetchMore({
        variables: getFetchMoreVariables(variables, endCursor),
      });
    }
    : undefined;

  const loadingState: InventoryConnectionLoadingState = networkStatus === NetworkStatus.fetchMore
    ? 'loadingMore'
    : loading
      ? (rows.length > 0 ? 'loadingMore' : 'loading')
      : 'idle';

  return {
    rows,
    totalCount: connection.totalCount,
    hasNextPage: connection.hasNextPage,
    endCursor: connection.endCursor,
    loading,
    error,
    refetch,
    onLoadMore,
    loadingState,
  };
};
