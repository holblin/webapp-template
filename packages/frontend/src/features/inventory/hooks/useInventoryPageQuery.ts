import type { OperationVariables, TypedDocumentNode } from '@apollo/client';
import { useMemo } from 'react';
import { useInventoryConnectionQuery } from 'src/features/inventory/hooks/useInventoryConnectionQuery';
import { useErrorToast } from 'src/features/inventory/hooks/useErrorToast';
import type { InventoryRouteApi } from 'src/features/inventory/hooks/useInventoryRouteState';
import { useInventoryRouteState } from 'src/features/inventory/hooks/useInventoryRouteState';

type InventoryConnectionSource<TEdge> = {
  edges: TEdge[];
  totalCount: number;
  pageInfo: {
    hasNextPage: boolean;
    endCursor?: string | null;
  };
};

type InventoryCursorNodeEdge<TNode = unknown> = {
  cursor: string;
  node: TNode;
};

type UseInventoryPageQueryParams<
  TSearch extends Record<string, unknown>,
  TVariables extends OperationVariables & { after?: string | null | undefined },
  TData,
  TEdge extends InventoryCursorNodeEdge,
> = {
  routeApi: InventoryRouteApi<TSearch>;
  defaultSearchState: TSearch;
  toVariables: (searchState: TSearch) => TVariables;
  query: TypedDocumentNode<TData, TVariables>;
  getConnection: (data: TData | undefined) => InventoryConnectionSource<TEdge> | null | undefined;
};

export const useInventoryPageQuery = <
  TSearch extends Record<string, unknown>,
  TVariables extends OperationVariables & { after?: string | null | undefined } = OperationVariables & { after?: string | null | undefined },
  TData = unknown,
  TEdge extends InventoryCursorNodeEdge = InventoryCursorNodeEdge,
>({
  routeApi,
  defaultSearchState,
  toVariables,
  query,
  getConnection,
}: UseInventoryPageQueryParams<TSearch, TVariables, TData, TEdge>) => {
  const { searchState, onStateChange } = useInventoryRouteState(routeApi, defaultSearchState);
  const variables = useMemo(() => toVariables(searchState), [searchState, toVariables]);

  const queryState = useInventoryConnectionQuery({
    query,
    variables,
    getConnectionState: (data) => {
      const connection = getConnection(data);
      return {
        edges: connection?.edges ?? [],
        totalCount: connection?.totalCount ?? 0,
        hasNextPage: connection?.pageInfo.hasNextPage ?? false,
        endCursor: connection?.pageInfo.endCursor ?? null,
      };
    },
    mapRows: (edges) => edges.map((edge) => ({
      cursor: edge.cursor,
      node: edge.node,
    })),
    getFetchMoreVariables: (baseVariables, endCursor) => ({
      ...baseVariables,
      after: endCursor,
    }),
  });

  useErrorToast(queryState.error?.message);

  const refresh = async () => {
    await queryState.refetch(variables);
  };

  return {
    searchState,
    onStateChange,
    variables,
    rows: queryState.rows as Array<{ cursor: string; node: TEdge['node'] }>,
    totalCount: queryState.totalCount,
    loadingState: queryState.loadingState,
    onLoadMore: queryState.onLoadMore,
    refresh,
  };
};
