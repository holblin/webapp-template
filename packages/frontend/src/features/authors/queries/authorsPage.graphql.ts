import { graphql } from 'src/__generated__/gql';

export const AUTHORS_PAGE_QUERY = graphql(`
  query AuthorsPageQuery(
    $offset: Int
    $limit: Int
    $after: String
    $search: String
    $sort: AuthorListSortInput
    $filter: AuthorListWhereInput
  ) {
    authorList(
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
          ...AuthorInventoryRowFragment
        }
      }
    }
  }
`);

export const TAG_OPTIONS_QUERY = graphql(`
  query TagOptionsForAuthorsQuery {
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
