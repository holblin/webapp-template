import { describe, expect, it } from 'vitest';
import { BookListSortBy, SortDirection } from 'src/__generated__/gql/graphql';
import {
  defaultBookPageSearch,
  getBookFilters,
  toBooksQueryVariables,
} from '../bookInventory';

describe('bookInventory', () => {
  it('returns only the book filter fields', () => {
    expect(getBookFilters(defaultBookPageSearch)).toEqual({
      filterTitleContains: '',
      filterAuthorId: '',
      filterTagId: '',
    });
  });

  it('maps page state to books query variables', () => {
    const variables = toBooksQueryVariables({
      ...defaultBookPageSearch,
      offset: 20,
      search: 'dune',
      sortBy: BookListSortBy.Id,
      sortDirection: SortDirection.Desc,
      filterTitleContains: 'title',
      filterAuthorId: 'author-1',
      filterTagId: 'tag-2',
    });

    expect(variables).toEqual({
      offset: 20,
      limit: 20,
      after: undefined,
      search: 'dune',
      sort: {
        by: BookListSortBy.Id,
        direction: SortDirection.Desc,
      },
      filter: {
        titleContains: 'title',
        authorId: 'author-1',
        tagId: 'tag-2',
      },
    });
  });

  it('converts empty values to undefined in query variables', () => {
    const variables = toBooksQueryVariables(defaultBookPageSearch);
    expect(variables.search).toBeUndefined();
    expect(variables.filter).toEqual({
      titleContains: undefined,
      authorId: undefined,
      tagId: undefined,
    });
  });
});
