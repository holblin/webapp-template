import { graphql } from 'src/__generated__/gql';

export const BOOKS_PAGE_QUERY = graphql(`
  query BooksPageQuery(
    $offset: Int
    $limit: Int
    $after: String
    $search: String
    $sort: BookListSortInput
    $filter: BookListWhereInput
  ) {
    bookList(
      offset: $offset
      limit: $limit
      after: $after
      search: $search
      sort: $sort
      filter: $filter
    ) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
      }
      edges {
        cursor
        node {
          ...BookInventoryRowFragment
        }
      }
    }
  }
`);

export const BOOK_FILTER_OPTIONS_QUERY = graphql(`
  query BookFilterOptionsQuery {
    authorList(limit: 200, sort: { by: NAME, direction: ASC }) {
      edges {
        node {
          id
          name
        }
      }
    }
    tagList(limit: 200, sort: { by: NAME, direction: ASC }) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`);
