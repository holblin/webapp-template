import { graphql } from 'src/__generated__/gql';

export const AUTHOR_COUNTRY_CELL_FRAGMENT = graphql(`
  fragment AuthorCountryCellFragment on Author {
    country
  }
`);
