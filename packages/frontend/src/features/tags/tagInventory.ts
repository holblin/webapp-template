import {
  SortDirection,
  TagListSortBy,
  type TagsPageQueryQueryVariables,
} from 'src/__generated__/gql/graphql';

type Defined<T> = Exclude<T, null | undefined>;
export type TagSortBy = Defined<Defined<TagsPageQueryQueryVariables['sort']>['by']>;
export type TagSortDirection = Defined<Defined<TagsPageQueryQueryVariables['sort']>['direction']>;

export type TagPageSearch = {
  offset: number;
  limit: number;
  search: string;
  sortBy: TagSortBy;
  sortDirection: TagSortDirection;
  filterNameContains: string;
  filterBookId: string;
  showFilters: boolean;
};

export type TagFilters = Pick<
  TagPageSearch,
  | 'filterNameContains'
  | 'filterBookId'
>;

export const defaultTagPageSearch: TagPageSearch = {
  offset: 0,
  limit: 20,
  search: '',
  sortBy: TagListSortBy.Name,
  sortDirection: SortDirection.Asc,
  filterNameContains: '',
  filterBookId: '',
  showFilters: true,
};

export const getTagFilters = (state: TagPageSearch): TagFilters => ({
  filterNameContains: state.filterNameContains,
  filterBookId: state.filterBookId,
});

export const clearTagFiltersPatch: Partial<TagPageSearch> = {
  filterNameContains: defaultTagPageSearch.filterNameContains,
  filterBookId: defaultTagPageSearch.filterBookId,
};

export const getTagActiveFilters = (
  state: TagPageSearch,
  books: Array<{ id: string; title: string }>,
): Array<{ id: string; label: string; patch: Partial<TagPageSearch> }> => {
  const bookTitleById = new Map(books.map((book) => [book.id, book.title]));
  const activeFilters: Array<{ id: string; label: string; patch: Partial<TagPageSearch> }> = [];

  if (state.filterNameContains.trim()) {
    activeFilters.push({
      id: 'filterNameContains',
      label: `Name: ${state.filterNameContains.trim()}`,
      patch: { filterNameContains: defaultTagPageSearch.filterNameContains },
    });
  }

  if (state.filterBookId) {
    activeFilters.push({
      id: 'filterBookId',
      label: `Book: ${bookTitleById.get(state.filterBookId) ?? state.filterBookId}`,
      patch: { filterBookId: defaultTagPageSearch.filterBookId },
    });
  }

  return activeFilters;
};

export const toTagsQueryVariables = (state: TagPageSearch): TagsPageQueryQueryVariables => ({
  offset: state.offset,
  limit: state.limit,
  after: undefined,
  search: state.search || undefined,
  sort: {
    by: state.sortBy,
    direction: state.sortDirection,
  },
  filter: {
    nameContains: state.filterNameContains || undefined,
    bookId: state.filterBookId || undefined,
  },
});
