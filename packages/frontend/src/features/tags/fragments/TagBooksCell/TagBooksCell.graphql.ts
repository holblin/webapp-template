import { graphql } from 'src/__generated__/gql';

export const TAG_BOOKS_CELL_FRAGMENT = graphql(`
  fragment TagBooksCellFragment on Tag {
    books {
      id
      title
    }
  }
`);
