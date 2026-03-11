import { graphql } from 'src/__generated__/gql';

export const BOOK_ID_CELL_FRAGMENT = graphql(`
  fragment BookIdCellFragment on Book {
    id
  }
`);
