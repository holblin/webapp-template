import type { NormalizedCacheObject } from '@apollo/client';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { BookTitleCellFragmentFragment } from 'src/__generated__/gql/graphql';
import { BookTitleCell } from 'src/features/books/fragments/BookTitleCell/BookTitleCell';
import { FragmentApolloProvider } from 'src/storybook/fragmentApolloProvider';

const bookId = 'book-1';

type BookTitleCellArgs = Pick<BookTitleCellFragmentFragment, 'title'>;

const buildCacheData = (args: BookTitleCellArgs): NormalizedCacheObject => ({
  [`Book:${bookId}`]: {
    __typename: 'Book',
    id: bookId,
    title: args.title,
  },
});

const meta = {
  title: 'Features/Fragments/Books/Title Cell',
  args: {
    title: 'A Wizard of Earthsea',
  },
  argTypes: {
    title: { control: 'text' },
  },
  decorators: [
    (Story, context) => (
      <FragmentApolloProvider cacheData={buildCacheData(context.args)}>
        <Story />
      </FragmentApolloProvider>
    ),
  ],
} satisfies Meta<BookTitleCellArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <BookTitleCell bookId={bookId} />,
};
