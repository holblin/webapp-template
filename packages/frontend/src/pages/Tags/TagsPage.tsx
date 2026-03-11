import { useQuery } from '@apollo/client/react';
import { getRouteApi } from '@tanstack/react-router';
import { type SortDescriptor } from '@react-spectrum/s2';
import {
  TagListSortBy,
  type TagsPageQueryQuery,
  type TagsPageQueryQueryVariables,
} from 'src/__generated__/gql/graphql';
import { InventoryCrudLayout } from 'src/components/Inventory/InventoryCrudLayout';
import {
  createTagInventoryColumns,
  type TagInventoryRow,
} from 'src/features/tags/columns/tagInventoryColumns';
import { TagFiltersPanel } from 'src/features/tags/filters/TagFiltersPanel';
import {
  TAG_FILTER_OPTIONS_QUERY,
  TAGS_PAGE_QUERY,
} from 'src/features/tags/queries/tagsPage.graphql';
import {
  getTagFilters,
  toTagsQueryVariables,
  type TagFilters,
  type TagPageSearch,
  type TagSortBy,
} from 'src/features/tags/tagInventory';
import { useInventoryPageQuery } from 'src/features/inventory/hooks/useInventoryPageQuery';
import { applyInventorySortPatch, buildTableSortDescriptor } from 'src/features/inventory/sorting';
import { CreateTagDialog } from './dialogs/CreateTagDialog';
import { DeleteTagDialog } from './dialogs/DeleteTagDialog';
import { UpdateTagDialog } from './dialogs/UpdateTagDialog';

const tagsRouteApi = getRouteApi('/tags');
const tagColumnBySortBy: Partial<Record<TagSortBy, string>> = {
  [TagListSortBy.Id]: 'id',
  [TagListSortBy.BookCount]: 'booksCount',
  [TagListSortBy.Name]: 'name',
};

export const TagsPage = () => {
  const {
    searchState,
    onStateChange,
    rows: tags,
    totalCount,
    loadingState,
    onLoadMore,
    refresh,
  } = useInventoryPageQuery<
    TagPageSearch,
    TagsPageQueryQueryVariables,
    TagsPageQueryQuery,
    TagsPageQueryQuery['tagList']['edges'][number]
  >({
    routeApi: tagsRouteApi,
    toVariables: toTagsQueryVariables,
    query: TAGS_PAGE_QUERY,
    getConnection: (data) => data?.tagList,
  });

  const tableSortDescriptor: SortDescriptor = buildTableSortDescriptor(
    searchState.sortBy,
    searchState.sortDirection,
    tagColumnBySortBy,
    'name',
  );

  const { data: optionsData } = useQuery(TAG_FILTER_OPTIONS_QUERY);
  const books = (optionsData?.bookList.edges ?? []).map((edge) => edge.node);

  return (
    <InventoryCrudLayout<TagInventoryRow, TagPageSearch, TagFilters, string>
      title="Tags"
      createLabel="New tag"
      totalCount={totalCount}
      state={searchState}
      onStateChange={onStateChange}
      createColumns={createTagInventoryColumns}
      rows={tags}
      getRowId={(row) => row.cursor}
      ariaLabel="Tags table"
      getFilters={getTagFilters}
      renderFilterPanel={(filters, onFiltersChange) => (
        <TagFiltersPanel
          filters={filters}
          books={books}
          onFiltersChange={onFiltersChange}
        />
      )}
      loadingState={loadingState}
      onLoadMore={onLoadMore}
      sortDescriptor={tableSortDescriptor}
      onSortChange={(descriptor, column, onStatePatch) => {
        applyInventorySortPatch<TagPageSearch, TagSortBy, TagInventoryRow>(
          descriptor,
          column,
          onStatePatch,
        );
      }}
      onRefresh={refresh}
      renderCreateDialog={(onCompleted) => (
        <CreateTagDialog onCompleted={onCompleted} />
      )}
      renderUpdateDialog={(tagId, onCompleted) => (
        <UpdateTagDialog tagId={tagId} onCompleted={onCompleted} />
      )}
      renderDeleteDialog={(tagId, onCompleted) => (
        <DeleteTagDialog tagId={tagId} onCompleted={onCompleted} />
      )}
    />
  );
};
