import type { NormalizedCacheObject } from '@apollo/client';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AuthorCountry, type AuthorCountryCellFragmentFragment } from 'src/__generated__/gql/graphql';
import { AuthorCountryCell } from 'src/features/authors/fragments/AuthorCountryCell/AuthorCountryCell';
import { FragmentApolloProvider } from 'src/storybook/fragmentApolloProvider';

const authorId = 'author-1';

type AuthorCountryCellArgs = Pick<AuthorCountryCellFragmentFragment, 'country'>;

const buildCacheData = (args: AuthorCountryCellArgs): NormalizedCacheObject => ({
  [`Author:${authorId}`]: {
    __typename: 'Author',
    id: authorId,
    country: args.country,
  },
});

const meta = {
  title: 'Features/Fragments/Authors/Country Cell',
  args: {
    country: AuthorCountry.Us,
  },
  argTypes: {
    country: {
      control: 'select',
      options: Object.values(AuthorCountry),
    },
  },
  decorators: [
    (Story, context) => (
      <FragmentApolloProvider cacheData={buildCacheData(context.args)}>
        <Story />
      </FragmentApolloProvider>
    ),
  ],
} satisfies Meta<AuthorCountryCellArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <AuthorCountryCell authorId={authorId} />,
};
