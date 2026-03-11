import { createFileRoute } from '@tanstack/react-router'
import { SortDirection, TagListSortBy } from 'src/__generated__/gql/graphql'
import { parseBoolean, parseEnum, parsePositiveInt, parseString } from 'src/features/inventory/searchParams'
import { defaultTagPageSearch, type TagPageSearch, type TagSortBy } from 'src/features/tags/tagInventory'
import { TagsPage } from 'src/pages/Tags/TagsPage'

export const Route = createFileRoute('/tags')({
  validateSearch: (search): TagPageSearch => ({
    offset: parsePositiveInt(search.offset, defaultTagPageSearch.offset),
    limit: parsePositiveInt(search.limit, defaultTagPageSearch.limit),
    search: parseString(search.search, defaultTagPageSearch.search),
    sortBy: parseEnum<TagSortBy>(
      search.sortBy,
      [TagListSortBy.Id, TagListSortBy.Name, TagListSortBy.BookCount],
      defaultTagPageSearch.sortBy,
    ),
    sortDirection: parseEnum(
      search.sortDirection,
      [SortDirection.Asc, SortDirection.Desc],
      defaultTagPageSearch.sortDirection,
    ),
    filterNameContains: parseString(search.filterNameContains, defaultTagPageSearch.filterNameContains),
    filterBookId: parseString(search.filterBookId, defaultTagPageSearch.filterBookId),
    showFilters: parseBoolean(search.showFilters, defaultTagPageSearch.showFilters),
  }),
  component: TagsPage,
})
