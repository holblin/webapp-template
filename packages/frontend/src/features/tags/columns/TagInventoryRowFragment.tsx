import { graphql } from 'src/__generated__/gql';

export const TAG_INVENTORY_ROW_FRAGMENT = graphql(`
  fragment TagInventoryRowFragment on Tag {
    ...TagIdCellFragment
    ...TagNameCellFragment
    ...TagBooksCountCellFragment
    ...TagBooksCellFragment
    ...TagActionsCellFragment
  }
`);
