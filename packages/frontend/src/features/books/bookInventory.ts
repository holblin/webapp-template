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

export const clearBookFiltersPatch: Partial<BookPageSearch> = {
  filterTitleContains: defaultBookPageSearch.filterTitleContains,
  filterAuthorId: defaultBookPageSearch.filterAuthorId,
  filterTagId: defaultBookPageSearch.filterTagId,
};

export const getBookActiveFilters = (
  state: BookPageSearch,
  options: {
    authors: Array<{ id: string; name: string }>;
    tags: Array<{ id: string; name: string }>;
  },
): Array<{ id: string; label: string; patch: Partial<BookPageSearch> }> => {
  const authorNameById = new Map(options.authors.map((author) => [author.id, author.name]));
  const tagNameById = new Map(options.tags.map((tag) => [tag.id, tag.name]));
  const activeFilters: Array<{ id: string; label: string; patch: Partial<BookPageSearch> }> = [];

  if (state.filterTitleContains.trim()) {
    activeFilters.push({
      id: 'filterTitleContains',
      label: `Title: ${state.filterTitleContains.trim()}`,
      patch: { filterTitleContains: defaultBookPageSearch.filterTitleContains },
    });
  }

  if (state.filterAuthorId) {
    activeFilters.push({
      id: 'filterAuthorId',
      label: `Author: ${authorNameById.get(state.filterAuthorId) ?? state.filterAuthorId}`,
      patch: { filterAuthorId: defaultBookPageSearch.filterAuthorId },
    });
  }

  if (state.filterTagId) {
    activeFilters.push({
      id: 'filterTagId',
      label: `Tag: ${tagNameById.get(state.filterTagId) ?? state.filterTagId}`,
      patch: { filterTagId: defaultBookPageSearch.filterTagId },
    });
  }

  return activeFilters;
};

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
