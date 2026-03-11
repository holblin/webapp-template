import type { NormalizedCacheObject } from '@apollo/client';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { AuthorBooksCountCellFragmentFragment } from 'src/__generated__/gql/graphql';
import { AuthorBooksCountCell } from 'src/features/authors/fragments/AuthorBooksCountCell/AuthorBooksCountCell';
import { FragmentApolloProvider } from 'src/storybook/fragmentApolloProvider';

const authorId = 'author-1';

type AuthorBooksCountCellArgs = Pick<AuthorBooksCountCellFragmentFragment, 'books'>;

const buildCacheData = (args: AuthorBooksCountCellArgs): NormalizedCacheObject => {
  const cacheData: NormalizedCacheObject = {
    [`Author:${authorId}`]: {
      __typename: 'Author',
      id: authorId,
      books: args.books.map((book) => ({ __ref: `Book:${book.id}` })),
    },
  };

  for (const book of args.books) {
    cacheData[`Book:${book.id}`] = {
      __typename: 'Book',
      id: book.id,
    };
  }

  return cacheData;
};

const meta = {
  title: 'Features/Fragments/Authors/Books Count Cell',
  args: {
    books: [{ id: 'book-1' }, { id: 'book-2' }],
  },
  argTypes: {
    books: { control: 'object' },
  },
  decorators: [
    (Story, context) => (
      <FragmentApolloProvider cacheData={buildCacheData(context.args)}>
        <Story />
      </FragmentApolloProvider>
    ),
  ],
} satisfies Meta<AuthorBooksCountCellArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <AuthorBooksCountCell authorId={authorId} />,
};
