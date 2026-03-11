import { describe, expect, it } from 'vitest';
import { SortDirection, TagListSortBy } from 'src/__generated__/gql/graphql';
import {
  defaultTagPageSearch,
  getTagFilters,
  toTagsQueryVariables,
} from '../tagInventory';

describe('tagInventory', () => {
  it('returns only the tag filter fields', () => {
    expect(getTagFilters(defaultTagPageSearch)).toEqual({
      filterNameContains: '',
      filterBookId: '',
    });
  });

  it('maps page state to tags query variables', () => {
    const variables = toTagsQueryVariables({
      ...defaultTagPageSearch,
      offset: 10,
      search: 'classic',
      sortBy: TagListSortBy.BookCount,
      sortDirection: SortDirection.Desc,
      filterNameContains: 'classic',
      filterBookId: 'book-1',
    });

    expect(variables).toEqual({
      offset: 10,
      limit: 20,
      after: undefined,
      search: 'classic',
      sort: {
        by: TagListSortBy.BookCount,
        direction: SortDirection.Desc,
      },
      filter: {
        nameContains: 'classic',
        bookId: 'book-1',
      },
    });
  });

  it('converts empty values to undefined in query variables', () => {
    const variables = toTagsQueryVariables(defaultTagPageSearch);
    expect(variables.search).toBeUndefined();
    expect(variables.filter).toEqual({
      nameContains: undefined,
      bookId: undefined,
    });
  });
});
