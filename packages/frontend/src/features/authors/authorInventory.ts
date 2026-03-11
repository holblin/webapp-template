import type { CalendarDate } from '@internationalized/date';
import {
  AuthorCountry,
  AuthorListSortBy,
  type AuthorsPageQueryQueryVariables,
  SortDirection,
} from 'src/__generated__/gql/graphql';
import { toCalendarDate } from 'src/features/inventory/date';

type Defined<T> = Exclude<T, null | undefined>;
export type AuthorSortBy = Defined<Defined<AuthorsPageQueryQueryVariables['sort']>['by']>;
export type AuthorSortDirection = Defined<Defined<AuthorsPageQueryQueryVariables['sort']>['direction']>;

export type AuthorPageSearch = {
  offset: number;
  limit: number;
  search: string;
  sortBy: AuthorSortBy;
  sortDirection: AuthorSortDirection;
  filterNameContains: string;
  filterCountry: '' | AuthorCountry;
  filterIsActive: 'all' | 'active' | 'inactive';
  filterBirthDateFrom: string;
  filterBirthDateTo: string;
  filterHasBookTagId: string;
  filterHasBookGenre: string;
  filterMinBookCount: number;
  filterPublishedAfterYear: number;
  filterMinAverageBookRating: number;
  showFilters: boolean;
};

export type AuthorFilters = Pick<
  AuthorPageSearch,
  | 'filterNameContains'
  | 'filterCountry'
  | 'filterIsActive'
  | 'filterBirthDateFrom'
  | 'filterBirthDateTo'
  | 'filterHasBookTagId'
  | 'filterHasBookGenre'
  | 'filterMinBookCount'
  | 'filterPublishedAfterYear'
  | 'filterMinAverageBookRating'
>;

export const defaultAuthorPageSearch: AuthorPageSearch = {
  offset: 0,
  limit: 20,
  search: '',
  sortBy: AuthorListSortBy.Name,
  sortDirection: SortDirection.Asc,
  filterNameContains: '',
  filterCountry: '',
  filterIsActive: 'all',
  filterBirthDateFrom: '',
  filterBirthDateTo: '',
  filterHasBookTagId: '',
  filterHasBookGenre: '',
  filterMinBookCount: 0,
  filterPublishedAfterYear: 0,
  filterMinAverageBookRating: 0,
  showFilters: true,
};

export const authorCountryOptions: AuthorCountry[] = [
  AuthorCountry.Us,
  AuthorCountry.Gb,
  AuthorCountry.Fr,
  AuthorCountry.De,
  AuthorCountry.Jp,
  AuthorCountry.Ca,
];

export const authorGenreOptions = ['Literary Fiction', 'Mystery', 'Sci-Fi', 'Fantasy', 'Historical', 'Nonfiction'] as const;

export const getAuthorFilters = (state: AuthorPageSearch): AuthorFilters => ({
  filterNameContains: state.filterNameContains,
  filterCountry: state.filterCountry,
  filterIsActive: state.filterIsActive,
  filterBirthDateFrom: state.filterBirthDateFrom,
  filterBirthDateTo: state.filterBirthDateTo,
  filterHasBookTagId: state.filterHasBookTagId,
  filterHasBookGenre: state.filterHasBookGenre,
  filterMinBookCount: state.filterMinBookCount,
  filterPublishedAfterYear: state.filterPublishedAfterYear,
  filterMinAverageBookRating: state.filterMinAverageBookRating,
});

export const toAuthorsQueryVariables = (state: AuthorPageSearch): AuthorsPageQueryQueryVariables => ({
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
    country: state.filterCountry || undefined,
    isActive: state.filterIsActive === 'all'
      ? undefined
      : state.filterIsActive === 'active',
    birthDateFrom: state.filterBirthDateFrom || undefined,
    birthDateTo: state.filterBirthDateTo || undefined,
    hasBookTagId: state.filterHasBookTagId || undefined,
    hasBookGenre: state.filterHasBookGenre || undefined,
    minBookCount: state.filterMinBookCount > 0 ? state.filterMinBookCount : undefined,
    publishedAfterYear: state.filterPublishedAfterYear > 0 ? state.filterPublishedAfterYear : undefined,
    minAverageBookRating: state.filterMinAverageBookRating > 0 ? state.filterMinAverageBookRating : undefined,
  },
});

export const toCalendarDateRange = (
  from: string,
  to: string,
): { start: CalendarDate; end: CalendarDate } | null => {
  const start = toCalendarDate(from);
  const end = toCalendarDate(to);

  if (!start || !end) {
    return null;
  }

  return { start, end };
};
