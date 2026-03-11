import { createFileRoute, stripSearchParams } from '@tanstack/react-router'
import { BookListSortBy, SortDirection } from 'src/__generated__/gql/graphql'
import { defaultBookPageSearch, type BookPageSearch, type BookSortBy } from 'src/features/books/bookInventory'
import { parseBoolean, parseEnum, parsePositiveInt, parseString } from 'src/features/inventory/searchParams'
import { BooksPage } from 'src/pages/Books/BooksPage'

export const Route = createFileRoute('/books')({
  search: {
    middlewares: [stripSearchParams(defaultBookPageSearch) as never],
  },
  validateSearch: (search): BookPageSearch => ({
    offset: parsePositiveInt(search.offset, defaultBookPageSearch.offset),
    limit: parsePositiveInt(search.limit, defaultBookPageSearch.limit),
    search: parseString(search.search, defaultBookPageSearch.search),
    sortBy: parseEnum<BookSortBy>(
      search.sortBy,
      [BookListSortBy.Id, BookListSortBy.Title, BookListSortBy.AuthorName],
      defaultBookPageSearch.sortBy,
    ),
    sortDirection: parseEnum(
      search.sortDirection,
      [SortDirection.Asc, SortDirection.Desc],
      defaultBookPageSearch.sortDirection,
    ),
    filterTitleContains: parseString(search.filterTitleContains, defaultBookPageSearch.filterTitleContains),
    filterAuthorId: parseString(search.filterAuthorId, defaultBookPageSearch.filterAuthorId),
    filterTagId: parseString(search.filterTagId, defaultBookPageSearch.filterTagId),
    showFilters: parseBoolean(search.showFilters, defaultBookPageSearch.showFilters),
  }),
  component: BooksPage,
})
