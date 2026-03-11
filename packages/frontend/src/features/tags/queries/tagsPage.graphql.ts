import { graphql } from 'src/__generated__/gql';

export const TAGS_PAGE_QUERY = graphql(`
  query TagsPageQuery(
    $offset: Int
    $limit: Int
    $after: String
    $search: String
    $sort: TagListSortInput
    $filter: TagListWhereInput
  ) {
    tagList(
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
          ...TagInventoryRowFragment
        }
      }
    }
  }
`);

export const TAG_FILTER_OPTIONS_QUERY = graphql(`
  query TagFilterOptionsQuery {
    bookList(limit: 200, sort: { by: TITLE, direction: ASC }) {
      edges {
        node {
          id
          title
        }
      }
    }
  }
`);
