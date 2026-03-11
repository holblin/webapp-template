import { graphql } from 'src/__generated__/gql';

export const BOOK_CREATE_MUTATION = graphql(`
  mutation BookCreate($input: BookCreateInput!) {
    bookCreate(input: $input) {
      success
      message
    }
  }
`);
