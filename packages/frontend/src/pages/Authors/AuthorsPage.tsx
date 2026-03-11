import { useQuery } from '@apollo/client/react';
import { getRouteApi } from '@tanstack/react-router';
import { type SortDescriptor } from '@react-spectrum/s2';
import {
  AuthorListSortBy,
  type AuthorsPageQueryQuery,
  type AuthorsPageQueryQueryVariables,
} from 'src/__generated__/gql/graphql';
import { InventoryCrudLayout } from 'src/components/Inventory/InventoryCrudLayout';
import {
  getAuthorFilters,
  toAuthorsQueryVariables,
  type AuthorFilters,
  type AuthorPageSearch,
  type AuthorSortBy,
} from 'src/features/authors/authorInventory';
import { createAuthorInventoryColumns, type AuthorInventoryRow } from 'src/features/authors/columns/authorInventoryColumns';
import { AuthorFiltersPanel } from 'src/features/authors/filters/AuthorFiltersPanel';
import { AUTHORS_PAGE_QUERY, TAG_OPTIONS_QUERY } from 'src/features/authors/queries/authorsPage.graphql';
import { useInventoryPageQuery } from 'src/features/inventory/hooks/useInventoryPageQuery';
import { applyInventorySortPatch, buildTableSortDescriptor } from 'src/features/inventory/sorting';
import { CreateAuthorDialog } from './dialogs/CreateAuthorDialog';
import { DeleteAuthorDialog } from './dialogs/DeleteAuthorDialog';
import { UpdateAuthorDialog } from './dialogs/UpdateAuthorDialog';

const authorsRouteApi = getRouteApi('/authors');
const authorColumnBySortBy: Partial<Record<AuthorSortBy, string>> = {
  [AuthorListSortBy.Id]: 'id',
  [AuthorListSortBy.Name]: 'name',
};

export const AuthorsPage = () => {
  const {
    searchState,
    onStateChange,
    rows: authors,
    totalCount,
    loadingState,
    onLoadMore,
    refresh,
  } = useInventoryPageQuery<
    AuthorPageSearch,
    AuthorsPageQueryQueryVariables,
    AuthorsPageQueryQuery,
    AuthorsPageQueryQuery['authorList']['edges'][number]
  >({
    routeApi: authorsRouteApi,
    toVariables: toAuthorsQueryVariables,
    query: AUTHORS_PAGE_QUERY,
    getConnection: (data) => data?.authorList,
  });

  const tableSortDescriptor: SortDescriptor = buildTableSortDescriptor(
    searchState.sortBy,
    searchState.sortDirection,
    authorColumnBySortBy,
    'name',
  );

  const { data: tagsData } = useQuery(TAG_OPTIONS_QUERY);
  const tags = (tagsData?.tagList.edges ?? []).map((edge) => edge.node);

  return (
    <InventoryCrudLayout<AuthorInventoryRow, AuthorPageSearch, AuthorFilters, string>
      title="Authors"
      createLabel="New author"
      totalCount={totalCount}
      state={searchState}
      onStateChange={onStateChange}
      createColumns={createAuthorInventoryColumns}
      rows={authors}
      getRowId={(row) => row.cursor}
      ariaLabel="Authors table"
      getFilters={getAuthorFilters}
      renderFilterPanel={(filters, onFiltersChange) => (
        <AuthorFiltersPanel
          filters={filters}
          tags={tags}
          onFiltersChange={onFiltersChange}
        />
      )}
      loadingState={loadingState}
      onLoadMore={onLoadMore}
      sortDescriptor={tableSortDescriptor}
      onSortChange={(descriptor, column, onStatePatch) => {
        applyInventorySortPatch<AuthorPageSearch, AuthorSortBy, AuthorInventoryRow>(
          descriptor,
          column,
          onStatePatch,
        );
      }}
      onRefresh={refresh}
      renderCreateDialog={(onCompleted) => (
        <CreateAuthorDialog onCompleted={onCompleted} />
      )}
      renderUpdateDialog={(authorId, onCompleted) => (
        <UpdateAuthorDialog authorId={authorId} onCompleted={onCompleted} />
      )}
      renderDeleteDialog={(authorId, onCompleted) => (
        <DeleteAuthorDialog authorId={authorId} onCompleted={onCompleted} />
      )}
    />
  );
};
