import type { NormalizedCacheObject } from '@apollo/client';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { AuthorIdCellFragmentFragment } from 'src/__generated__/gql/graphql';
import { AuthorIdCell } from 'src/features/authors/fragments/AuthorIdCell/AuthorIdCell';
import { FragmentApolloProvider } from 'src/storybook/fragmentApolloProvider';

type AuthorIdCellArgs = Pick<AuthorIdCellFragmentFragment, 'id'>;

const buildCacheData = (args: AuthorIdCellArgs): NormalizedCacheObject => ({
  [`Author:${args.id}`]: {
    __typename: 'Author',
    id: args.id,
  },
});

const meta = {
  title: 'Features/Fragments/Authors/Id Cell',
  args: {
    id: 'author-1',
  },
  argTypes: {
    id: { control: 'text' },
  },
  decorators: [
    (Story, context) => (
      <FragmentApolloProvider cacheData={buildCacheData(context.args)}>
        <Story />
      </FragmentApolloProvider>
    ),
  ],
} satisfies Meta<AuthorIdCellArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <AuthorIdCell authorId={args.id} />,
};
