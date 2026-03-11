import { graphql } from 'src/__generated__/gql';

export const AUTHOR_NAME_CELL_FRAGMENT = graphql(`
  fragment AuthorNameCellFragment on Author {
    name
  }
`);
