import type { NormalizedCacheObject } from '@apollo/client';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { AuthorNameCellFragmentFragment } from 'src/__generated__/gql/graphql';
import { AuthorNameCell } from 'src/features/authors/fragments/AuthorNameCell/AuthorNameCell';
import { FragmentApolloProvider } from 'src/storybook/fragmentApolloProvider';

const authorId = 'author-1';

type AuthorNameCellFragmentData = AuthorNameCellFragmentFragment;
type AuthorNameCellArgs = Pick<AuthorNameCellFragmentData, 'name'>;

const buildAuthorNameCellCacheData = (args: AuthorNameCellArgs): NormalizedCacheObject => ({
  [`Author:${authorId}`]: {
    __typename: 'Author',
    id: authorId,
    name: args.name,
  },
});

const meta = {
  title: 'Features/Fragments/Authors/Name Cell',
  args: {
    name: 'Ursula K. Le Guin',
  },
  argTypes: {
    name: { control: 'text' },
  },
  decorators: [
    (Story, context) => (
      <FragmentApolloProvider cacheData={buildAuthorNameCellCacheData(context.args)}>
        <Story />
      </FragmentApolloProvider>
    ),
  ],
} satisfies Meta<AuthorNameCellArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <AuthorNameCell authorId={authorId} />,
};
