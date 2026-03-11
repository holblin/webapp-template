import { graphql } from 'src/__generated__/gql';

export const AUTHOR_IS_ACTIVE_CELL_FRAGMENT = graphql(`
  fragment AuthorIsActiveCellFragment on Author {
    isActive
  }
`);
