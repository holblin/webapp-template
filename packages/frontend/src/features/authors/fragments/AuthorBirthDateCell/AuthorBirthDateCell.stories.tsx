import type { NormalizedCacheObject } from '@apollo/client';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { AuthorBirthDateCellFragmentFragment } from 'src/__generated__/gql/graphql';
import { AuthorBirthDateCell } from 'src/features/authors/fragments/AuthorBirthDateCell/AuthorBirthDateCell';
import { FragmentApolloProvider } from 'src/storybook/fragmentApolloProvider';

const authorId = 'author-1';

type AuthorBirthDateCellArgs = Pick<AuthorBirthDateCellFragmentFragment, 'birthDate'>;

const buildCacheData = (args: AuthorBirthDateCellArgs): NormalizedCacheObject => ({
  [`Author:${authorId}`]: {
    __typename: 'Author',
    id: authorId,
    birthDate: args.birthDate,
  },
});

const meta = {
  title: 'Features/Fragments/Authors/Birth Date Cell',
  args: {
    birthDate: '1929-10-21',
  },
  argTypes: {
    birthDate: { control: 'text' },
  },
  decorators: [
    (Story, context) => (
      <FragmentApolloProvider cacheData={buildCacheData(context.args)}>
        <Story />
      </FragmentApolloProvider>
    ),
  ],
} satisfies Meta<AuthorBirthDateCellArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <AuthorBirthDateCell authorId={authorId} />,
};
