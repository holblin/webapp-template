import { describe, expect, it } from 'vitest';
import { AuthorCountry, AuthorListSortBy, SortDirection } from 'src/__generated__/gql/graphql';
import {
  authorCountryOptions,
  defaultAuthorPageSearch,
  getAuthorFilters,
  toAuthorsQueryVariables,
  toCalendarDateRange,
} from '../authorInventory';

describe('authorInventory', () => {
  it('exposes expected country filter options', () => {
    expect(authorCountryOptions).toEqual([
      AuthorCountry.Us,
      AuthorCountry.Gb,
      AuthorCountry.Fr,
      AuthorCountry.De,
      AuthorCountry.Jp,
      AuthorCountry.Ca,
    ]);
  });

  it('returns only author filter fields from search state', () => {
    expect(getAuthorFilters(defaultAuthorPageSearch)).toEqual({
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
    });
  });

  it('maps search state to query variables with undefined empty values', () => {
    const variables = toAuthorsQueryVariables({
      ...defaultAuthorPageSearch,
      sortBy: AuthorListSortBy.Id,
      sortDirection: SortDirection.Desc,
      filterNameContains: 'kate',
      filterCountry: AuthorCountry.Us,
      filterIsActive: 'inactive',
      filterBirthDateFrom: '1900-01-01',
      filterBirthDateTo: '2000-12-31',
      filterHasBookTagId: 'tag-1',
      filterHasBookGenre: 'Mystery',
      filterMinBookCount: 2,
      filterPublishedAfterYear: 1999,
      filterMinAverageBookRating: 4.2,
    });

    expect(variables).toEqual({
      offset: 0,
      limit: 20,
      after: undefined,
      search: undefined,
      sort: { by: AuthorListSortBy.Id, direction: SortDirection.Desc },
      filter: {
        nameContains: 'kate',
        country: AuthorCountry.Us,
        isActive: false,
        birthDateFrom: '1900-01-01',
        birthDateTo: '2000-12-31',
        hasBookTagId: 'tag-1',
        hasBookGenre: 'Mystery',
        minBookCount: 2,
        publishedAfterYear: 1999,
        minAverageBookRating: 4.2,
      },
    });
  });

  it('maps active filter value to true and all to undefined', () => {
    expect(toAuthorsQueryVariables({
      ...defaultAuthorPageSearch,
      filterIsActive: 'active',
    }).filter?.isActive).toBe(true);

    expect(toAuthorsQueryVariables({
      ...defaultAuthorPageSearch,
      filterIsActive: 'all',
    }).filter?.isActive).toBeUndefined();
  });

  it('creates calendar date range only when both bounds are valid', () => {
    const range = toCalendarDateRange('2020-01-01', '2020-12-31');
    expect(range?.start.toString()).toBe('2020-01-01');
    expect(range?.end.toString()).toBe('2020-12-31');

    expect(toCalendarDateRange('', '2020-12-31')).toBeNull();
    expect(toCalendarDateRange('2020-01-01', 'invalid')).toBeNull();
  });
});
