import type { NormalizedCacheObject } from '@apollo/client';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { BookDescriptionCellFragmentFragment } from 'src/__generated__/gql/graphql';
import { BookDescriptionCell } from 'src/features/books/fragments/BookDescriptionCell/BookDescriptionCell';
import { FragmentApolloProvider } from 'src/storybook/fragmentApolloProvider';

const bookId = 'book-1';

type BookDescriptionCellArgs = Pick<BookDescriptionCellFragmentFragment, 'description'>;

const buildCacheData = (args: BookDescriptionCellArgs): NormalizedCacheObject => ({
  [`Book:${bookId}`]: {
    __typename: 'Book',
    id: bookId,
    description: args.description,
  },
});

const meta = {
  title: 'Features/Fragments/Books/Description Cell',
  args: {
    description: 'A coming-of-age fantasy novel set in Earthsea.',
  },
  argTypes: {
    description: { control: 'text' },
  },
  decorators: [
    (Story, context) => (
      <FragmentApolloProvider cacheData={buildCacheData(context.args)}>
        <Story />
      </FragmentApolloProvider>
    ),
  ],
} satisfies Meta<BookDescriptionCellArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <BookDescriptionCell bookId={bookId} />,
};
