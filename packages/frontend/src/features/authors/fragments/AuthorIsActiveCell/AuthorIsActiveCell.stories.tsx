import type { NormalizedCacheObject } from '@apollo/client';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { AuthorIsActiveCellFragmentFragment } from 'src/__generated__/gql/graphql';
import { AuthorIsActiveCell } from 'src/features/authors/fragments/AuthorIsActiveCell/AuthorIsActiveCell';
import { FragmentApolloProvider } from 'src/storybook/fragmentApolloProvider';

const authorId = 'author-1';

type AuthorIsActiveCellArgs = Pick<AuthorIsActiveCellFragmentFragment, 'isActive'>;

const buildCacheData = (args: AuthorIsActiveCellArgs): NormalizedCacheObject => ({
  [`Author:${authorId}`]: {
    __typename: 'Author',
    id: authorId,
    isActive: args.isActive,
  },
});

const meta = {
  title: 'Features/Fragments/Authors/Is Active Cell',
  args: {
    isActive: true,
  },
  argTypes: {
    isActive: { control: 'boolean' },
  },
  decorators: [
    (Story, context) => (
      <FragmentApolloProvider cacheData={buildCacheData(context.args)}>
        <Story />
      </FragmentApolloProvider>
    ),
  ],
} satisfies Meta<AuthorIsActiveCellArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <AuthorIsActiveCell authorId={authorId} />,
};
