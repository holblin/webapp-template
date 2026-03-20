import { graphql } from 'src/__generated__/gql';

export const BOOK_UPDATE_MUTATION = graphql(`
  mutation BookUpdate($input: BookUpdateInput!) {
    bookUpdate(input: $input) {
      success
      message
    }
  }
`);

export const BOOK_DIALOG_FRAGMENT = graphql(`
  fragment BookDialogFragment on Book {
    id
    title
    description
    publicationDate
    author {
      id
      name
    }
    tags {
      id
      name
    }
  }
`);

export const BOOK_BY_ID_QUERY = graphql(`
  query BookByIdForDialogQuery($id: ID!) {
    bookById(id: $id) {
      id
      title
      description
      publicationDate
      author {
        id
        name
      }
      tags {
        id
        name
      }
      ...BookDialogFragment
    }
  }
`);
