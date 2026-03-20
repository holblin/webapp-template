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
import type { SelectionOption } from 'src/features/tags/components/BookSelectionField/BookSelectionField.types';
import { TagFiltersPanel } from 'src/features/tags/filters/TagFiltersPanel';
import {
  TAG_FILTER_OPTIONS_QUERY,
  TAGS_PAGE_QUERY,
} from 'src/features/tags/queries/tagsPage.graphql';
import {
  clearTagFiltersPatch,
  defaultTagPageSearch,
  getTagActiveFilters,
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
    defaultSearchState: defaultTagPageSearch,
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
  const booksForFilters = (optionsData?.bookList.edges ?? []).map((edge) => edge.node);
  const bookOptions: SelectionOption[] = booksForFilters.map((book) => ({
    id: book.id,
    label: book.title,
  }));

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
      getActiveFilters={(state) => getTagActiveFilters(state, booksForFilters)}
      clearFiltersPatch={clearTagFiltersPatch}
      renderFilterPanel={(filters, onFiltersChange) => (
        <TagFiltersPanel
          filters={filters}
          books={booksForFilters}
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
        <CreateTagDialog onCompleted={onCompleted} books={bookOptions} />
      )}
      renderUpdateDialog={(tagId, onCompleted) => (
        <UpdateTagDialog tagId={tagId} onCompleted={onCompleted} books={bookOptions} />
      )}
      renderDeleteDialog={(tagId, onCompleted) => (
        <DeleteTagDialog tagId={tagId} onCompleted={onCompleted} />
      )}
    />
  );
};
