import { graphql } from 'src/__generated__/gql';

export const AUTHOR_BIRTH_DATE_CELL_FRAGMENT = graphql(`
  fragment AuthorBirthDateCellFragment on Author {
    birthDate
  }
`);
