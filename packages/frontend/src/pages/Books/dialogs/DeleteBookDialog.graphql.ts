import { graphql } from 'src/__generated__/gql';

export const BOOK_DELETE_DIALOG_FRAGMENT = graphql(`
  fragment BookDeleteDialogFragment on Book {
    id
    title
  }
`);

export const BOOK_BY_ID_FOR_DELETE_QUERY = graphql(`
  query BookByIdForDeleteDialogQuery($id: ID!) {
    bookById(id: $id) {
      id
      title
      ...BookDeleteDialogFragment
    }
  }
`);

export const BOOK_DELETE_MUTATION = graphql(`
  mutation BookDelete($input: BookDeleteInput!) {
    bookDelete(input: $input) {
      success
      message
    }
  }
`);
