import { graphql } from 'src/__generated__/gql';

export const AUTHOR_INVENTORY_ROW_FRAGMENT = graphql(`
  fragment AuthorInventoryRowFragment on Author {
    ...AuthorIdCellFragment
    ...AuthorNameCellFragment
    ...AuthorBioCellFragment
    ...AuthorCountryCellFragment
    ...AuthorIsActiveCellFragment
    ...AuthorBirthDateCellFragment
    ...AuthorBooksCountCellFragment
    ...AuthorActionsCellFragment
  }
`);
