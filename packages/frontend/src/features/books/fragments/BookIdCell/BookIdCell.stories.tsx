import type { NormalizedCacheObject } from '@apollo/client';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { BookIdCellFragmentFragment } from 'src/__generated__/gql/graphql';
import { BookIdCell } from 'src/features/books/fragments/BookIdCell/BookIdCell';
import { FragmentApolloProvider } from 'src/storybook/fragmentApolloProvider';

type BookIdCellArgs = Pick<BookIdCellFragmentFragment, 'id'>;

const buildCacheData = (args: BookIdCellArgs): NormalizedCacheObject => ({
  [`Book:${args.id}`]: {
    __typename: 'Book',
    id: args.id,
  },
});

const meta = {
  title: 'Features/Fragments/Books/Id Cell',
  args: {
    id: 'book-1',
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
} satisfies Meta<BookIdCellArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <BookIdCell bookId={args.id} />,
};
