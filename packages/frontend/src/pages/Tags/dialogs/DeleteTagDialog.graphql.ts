import { graphql } from 'src/__generated__/gql';

export const TAG_DELETE_DIALOG_FRAGMENT = graphql(`
  fragment TagDeleteDialogFragment on Tag {
    id
    name
  }
`);

export const TAG_BY_ID_FOR_DELETE_QUERY = graphql(`
  query TagByIdForDeleteDialogQuery($id: ID!) {
    tagById(id: $id) {
      id
      name
      ...TagDeleteDialogFragment
    }
  }
`);

export const TAG_DELETE_MUTATION = graphql(`
  mutation TagDelete($input: TagDeleteInput!) {
    tagDelete(input: $input) {
      success
      message
    }
  }
`);
