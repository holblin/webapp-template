import { graphql } from 'src/__generated__/gql';

export const BOOK_INVENTORY_ROW_FRAGMENT = graphql(`
  fragment BookInventoryRowFragment on Book {
    ...BookIdCellFragment
    ...BookTitleCellFragment
    ...BookDescriptionCellFragment
    ...BookPublicationDateCellFragment
    ...BookAuthorCellFragment
    ...BookTagsCellFragment
    ...BookActionsCellFragment
  }
`);
