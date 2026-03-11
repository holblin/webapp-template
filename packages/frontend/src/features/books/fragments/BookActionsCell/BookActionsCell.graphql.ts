import { graphql } from 'src/__generated__/gql';

export const BOOK_ACTIONS_CELL_FRAGMENT = graphql(`
  fragment BookActionsCellFragment on Book {
    id
  }
`);
