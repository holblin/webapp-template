import type { NormalizedCacheObject } from '@apollo/client';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { BookPublicationDateCellFragmentFragment } from 'src/__generated__/gql/graphql';
import { BookPublicationDateCell } from 'src/features/books/fragments/BookPublicationDateCell/BookPublicationDateCell';
import { FragmentApolloProvider } from 'src/storybook/fragmentApolloProvider';

const bookId = 'book-1';

type BookPublicationDateCellArgs = Pick<BookPublicationDateCellFragmentFragment, 'publicationDate'>;

const buildCacheData = (args: BookPublicationDateCellArgs): NormalizedCacheObject => ({
  [`Book:${bookId}`]: {
    __typename: 'Book',
    id: bookId,
    publicationDate: args.publicationDate,
  },
});

const meta = {
  title: 'Features/Fragments/Books/Publication Date Cell',
  args: {
    publicationDate: '1968-09-01',
  },
  argTypes: {
    publicationDate: { control: 'text' },
  },
  decorators: [
    (Story, context) => (
      <FragmentApolloProvider cacheData={buildCacheData(context.args)}>
        <Story />
      </FragmentApolloProvider>
    ),
  ],
} satisfies Meta<BookPublicationDateCellArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <BookPublicationDateCell bookId={bookId} />,
};
