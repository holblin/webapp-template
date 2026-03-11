import { useQuery } from '@apollo/client/react';
import { getRouteApi } from '@tanstack/react-router';
import { type SortDescriptor } from '@react-spectrum/s2';
import {
  BookListSortBy,
  type BooksPageQueryQuery,
  type BooksPageQueryQueryVariables,
} from 'src/__generated__/gql/graphql';
import { InventoryCrudLayout } from 'src/components/Inventory/InventoryCrudLayout';
import {
  getBookFilters,
  toBooksQueryVariables,
  type BookFilters,
  type BookPageSearch,
  type BookSortBy,
} from 'src/features/books/bookInventory';
import { createBookInventoryColumns, type BookInventoryRow } from 'src/features/books/columns/bookInventoryColumns';
import { BookFiltersPanel } from 'src/features/books/filters/BookFiltersPanel';
import { BOOK_FILTER_OPTIONS_QUERY, BOOKS_PAGE_QUERY } from 'src/features/books/queries/booksPage.graphql';
import { useInventoryPageQuery } from 'src/features/inventory/hooks/useInventoryPageQuery';
import { applyInventorySortPatch, buildTableSortDescriptor } from 'src/features/inventory/sorting';
import { CreateBookDialog } from './dialogs/CreateBookDialog';
import { DeleteBookDialog } from './dialogs/DeleteBookDialog';
import { UpdateBookDialog } from './dialogs/UpdateBookDialog';

const booksRouteApi = getRouteApi('/books');
const bookColumnBySortBy: Partial<Record<BookSortBy, string>> = {
  [BookListSortBy.Id]: 'id',
  [BookListSortBy.AuthorName]: 'author',
  [BookListSortBy.Title]: 'title',
};

export const BooksPage = () => {
  const {
    searchState,
    onStateChange,
    rows: books,
    totalCount,
    loadingState,
    onLoadMore,
    refresh,
  } = useInventoryPageQuery<
    BookPageSearch,
    BooksPageQueryQueryVariables,
    BooksPageQueryQuery,
    BooksPageQueryQuery['bookList']['edges'][number]
  >({
    routeApi: booksRouteApi,
    toVariables: toBooksQueryVariables,
    query: BOOKS_PAGE_QUERY,
    getConnection: (data) => data?.bookList,
  });

  const tableSortDescriptor: SortDescriptor = buildTableSortDescriptor(
    searchState.sortBy,
    searchState.sortDirection,
    bookColumnBySortBy,
    'title',
  );

  const { data: optionsData } = useQuery(BOOK_FILTER_OPTIONS_QUERY);
  const authors = (optionsData?.authorList.edges ?? []).map((edge) => edge.node);
  const tags = (optionsData?.tagList.edges ?? []).map((edge) => edge.node);

  return (
    <InventoryCrudLayout<BookInventoryRow, BookPageSearch, BookFilters, string>
      title="Books"
      createLabel="New book"
      totalCount={totalCount}
      state={searchState}
      onStateChange={onStateChange}
      createColumns={createBookInventoryColumns}
      rows={books}
      getRowId={(row) => row.cursor}
      ariaLabel="Books table"
      getFilters={getBookFilters}
      renderFilterPanel={(filters, onFiltersChange) => (
        <BookFiltersPanel
          filters={filters}
          authors={authors}
          tags={tags}
          onFiltersChange={onFiltersChange}
        />
      )}
      loadingState={loadingState}
      onLoadMore={onLoadMore}
      sortDescriptor={tableSortDescriptor}
      onSortChange={(descriptor, column, onStatePatch) => {
        applyInventorySortPatch<BookPageSearch, BookSortBy, BookInventoryRow>(
          descriptor,
          column,
          onStatePatch,
        );
      }}
      onRefresh={refresh}
      renderCreateDialog={(onCompleted) => (
        <CreateBookDialog onCompleted={onCompleted} />
      )}
      renderUpdateDialog={(bookId, onCompleted) => (
        <UpdateBookDialog bookId={bookId} onCompleted={onCompleted} />
      )}
      renderDeleteDialog={(bookId, onCompleted) => (
        <DeleteBookDialog bookId={bookId} onCompleted={onCompleted} />
      )}
    />
  );
};
