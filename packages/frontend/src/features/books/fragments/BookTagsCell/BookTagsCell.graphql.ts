import { graphql } from 'src/__generated__/gql';

export const BOOK_TAGS_CELL_FRAGMENT = graphql(`
  fragment BookTagsCellFragment on Book {
    tags {
      id
      name
    }
  }
`);
