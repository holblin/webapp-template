import { graphql } from 'src/__generated__/gql';

export const AUTHOR_BOOKS_COUNT_CELL_FRAGMENT = graphql(`
  fragment AuthorBooksCountCellFragment on Author {
    books {
      id
    }
  }
`);
