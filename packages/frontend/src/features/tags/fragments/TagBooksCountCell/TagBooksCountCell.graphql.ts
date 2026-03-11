import { graphql } from 'src/__generated__/gql';

export const TAG_BOOKS_COUNT_CELL_FRAGMENT = graphql(`
  fragment TagBooksCountCellFragment on Tag {
    books {
      id
    }
  }
`);
