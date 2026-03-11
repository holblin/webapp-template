import { graphql } from 'src/__generated__/gql';

export const BOOK_TITLE_CELL_FRAGMENT = graphql(`
  fragment BookTitleCellFragment on Book {
    title
  }
`);
