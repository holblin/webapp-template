import { graphql } from 'src/__generated__/gql';

export const BOOK_PUBLICATION_DATE_CELL_FRAGMENT = graphql(`
  fragment BookPublicationDateCellFragment on Book {
    publicationDate
  }
`);
