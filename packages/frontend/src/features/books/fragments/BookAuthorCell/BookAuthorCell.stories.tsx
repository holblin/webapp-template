import type { NormalizedCacheObject } from '@apollo/client';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { BookAuthorCellFragmentFragment } from 'src/__generated__/gql/graphql';
import { BookAuthorCell } from 'src/features/books/fragments/BookAuthorCell/BookAuthorCell';
import { FragmentApolloProvider } from 'src/storybook/fragmentApolloProvider';

const bookId = 'book-1';

type BookAuthorCellArgs = Pick<BookAuthorCellFragmentFragment, 'author'>;

const buildCacheData = (args: BookAuthorCellArgs): NormalizedCacheObject => ({
  [`Book:${bookId}`]: {
    __typename: 'Book',
    id: bookId,
    author: { __ref: `Author:${args.author.id}` },
  },
  [`Author:${args.author.id}`]: {
    __typename: 'Author',
    id: args.author.id,
    name: args.author.name,
  },
});

const meta = {
  title: 'Features/Fragments/Books/Author Cell',
  args: {
    author: {
      id: 'author-1',
      name: 'Ursula K. Le Guin',
    },
  },
  argTypes: {
    author: { control: 'object' },
  },
  decorators: [
    (Story, context) => (
      <FragmentApolloProvider cacheData={buildCacheData(context.args)}>
        <Story />
      </FragmentApolloProvider>
    ),
  ],
} satisfies Meta<BookAuthorCellArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <BookAuthorCell bookId={bookId} />,
};
