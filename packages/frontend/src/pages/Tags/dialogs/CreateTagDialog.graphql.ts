import { graphql } from 'src/__generated__/gql';

export const TAG_CREATE_MUTATION = graphql(`
  mutation TagCreate($input: TagCreateInput!) {
    tagCreate(input: $input) {
      success
      message
    }
  }
`);
