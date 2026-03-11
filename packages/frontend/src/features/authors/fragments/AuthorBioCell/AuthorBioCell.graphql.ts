import { graphql } from 'src/__generated__/gql';

export const AUTHOR_BIO_CELL_FRAGMENT = graphql(`
  fragment AuthorBioCellFragment on Author {
    bio
  }
`);
