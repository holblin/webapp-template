import { graphql } from 'src/__generated__/gql';

export const AUTHOR_ID_CELL_FRAGMENT = graphql(`
  fragment AuthorIdCellFragment on Author {
    id
  }
`);
