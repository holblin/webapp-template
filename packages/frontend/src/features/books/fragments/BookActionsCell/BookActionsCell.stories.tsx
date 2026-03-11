import type { NormalizedCacheObject } from '@apollo/client';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import type { BookActionsCellFragmentFragment } from 'src/__generated__/gql/graphql';
import { BookActionsCell } from 'src/features/books/fragments/BookActionsCell/BookActionsCell';
import { FragmentApolloProvider } from 'src/storybook/fragmentApolloProvider';

type BookActionsCellArgs = Pick<BookActionsCellFragmentFragment, 'id'> & {
  onEditPress: () => void;
  onDeletePress: () => void;
};

const buildCacheData = (args: BookActionsCellArgs): NormalizedCacheObject => ({
  [`Book:${args.id}`]: {
    __typename: 'Book',
    id: args.id,
  },
});

const meta = {
  title: 'Features/Fragments/Books/Actions Cell',
  args: {
    id: 'book-1',
    onEditPress: fn(),
    onDeletePress: fn(),
  },
  argTypes: {
    id: { control: 'text' },
    onEditPress: { control: false },
    onDeletePress: { control: false },
  },
  decorators: [
    (Story, context) => (
      <FragmentApolloProvider cacheData={buildCacheData(context.args)}>
        <Story />
      </FragmentApolloProvider>
    ),
  ],
} satisfies Meta<BookActionsCellArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <BookActionsCell
      bookId={args.id}
      onEditPress={args.onEditPress}
      onDeletePress={args.onDeletePress}
    />
  ),
  play: async ({ args, canvas, userEvent, step }) => {
    await step('Click Edit', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /edit/i }));
    });

    await step('Edit callback called with id', async () => {
      await expect(args.onEditPress).toHaveBeenCalledWith(args.id);
      await expect(args.onDeletePress).not.toHaveBeenCalled();
    });
  },
};
