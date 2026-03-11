import { graphql } from 'src/__generated__/gql';

export const BOOK_AUTHOR_CELL_FRAGMENT = graphql(`
  fragment BookAuthorCellFragment on Book {
    author {
      id
      name
    }
  }
`);
