import {
  BookListSortBy,
  type BooksPageQueryQueryVariables,
  SortDirection,
} from 'src/__generated__/gql/graphql';

type Defined<T> = Exclude<T, null | undefined>;
export type BookSortBy = Defined<Defined<BooksPageQueryQueryVariables['sort']>['by']>;
export type BookSortDirection = Defined<Defined<BooksPageQueryQueryVariables['sort']>['direction']>;

export type BookPageSearch = {
  offset: number;
  limit: number;
  search: string;
  sortBy: BookSortBy;
  sortDirection: BookSortDirection;
  filterTitleContains: string;
  filterAuthorId: string;
  filterTagId: string;
  showFilters: boolean;
};

export type BookFilters = Pick<
  BookPageSearch,
  | 'filterTitleContains'
  | 'filterAuthorId'
  | 'filterTagId'
>;

export const defaultBookPageSearch: BookPageSearch = {
  offset: 0,
  limit: 20,
  search: '',
  sortBy: BookListSortBy.Title,
  sortDirection: SortDirection.Asc,
  filterTitleContains: '',
  filterAuthorId: '',
  filterTagId: '',
  showFilters: true,
};

export const getBookFilters = (state: BookPageSearch): BookFilters => ({
  filterTitleContains: state.filterTitleContains,
  filterAuthorId: state.filterAuthorId,
  filterTagId: state.filterTagId,
});

export const toBooksQueryVariables = (state: BookPageSearch): BooksPageQueryQueryVariables => ({
  offset: state.offset,
  limit: state.limit,
  after: undefined,
  search: state.search || undefined,
  sort: {
    by: state.sortBy,
    direction: state.sortDirection,
  },
  filter: {
    titleContains: state.filterTitleContains || undefined,
    authorId: state.filterAuthorId || undefined,
    tagId: state.filterTagId || undefined,
  },
});
