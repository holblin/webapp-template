import { graphql } from 'src/__generated__/gql';

export const BOOK_DESCRIPTION_CELL_FRAGMENT = graphql(`
  fragment BookDescriptionCellFragment on Book {
    description
  }
`);
