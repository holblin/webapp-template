import type { NormalizedCacheObject } from '@apollo/client';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { AuthorBioCellFragmentFragment } from 'src/__generated__/gql/graphql';
import { AuthorBioCell } from 'src/features/authors/fragments/AuthorBioCell/AuthorBioCell';
import { FragmentApolloProvider } from 'src/storybook/fragmentApolloProvider';

const authorId = 'author-1';

type AuthorBioCellArgs = Pick<AuthorBioCellFragmentFragment, 'bio'>;

const buildCacheData = (args: AuthorBioCellArgs): NormalizedCacheObject => ({
  [`Author:${authorId}`]: {
    __typename: 'Author',
    id: authorId,
    bio: args.bio,
  },
});

const meta = {
  title: 'Features/Fragments/Authors/Bio Cell',
  args: {
    bio: 'American author known for speculative fiction.',
  },
  argTypes: {
    bio: { control: 'text' },
  },
  decorators: [
    (Story, context) => (
      <FragmentApolloProvider cacheData={buildCacheData(context.args)}>
        <Story />
      </FragmentApolloProvider>
    ),
  ],
} satisfies Meta<AuthorBioCellArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <AuthorBioCell authorId={authorId} />,
};
