import { graphql } from 'src/__generated__/gql';

export const TAG_UPDATE_MUTATION = graphql(`
  mutation TagUpdate($input: TagUpdateInput!) {
    tagUpdate(input: $input) {
      success
      message
    }
  }
`);

export const TAG_DIALOG_FRAGMENT = graphql(`
  fragment TagDialogFragment on Tag {
    id
    name
    books {
      id
      title
    }
  }
`);

export const TAG_BY_ID_QUERY = graphql(`
  query TagByIdForDialogQuery($id: ID!) {
    tagById(id: $id) {
      id
      name
      books {
        id
        title
      }
      ...TagDialogFragment
    }
  }
`);
