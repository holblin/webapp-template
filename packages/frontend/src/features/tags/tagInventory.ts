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
