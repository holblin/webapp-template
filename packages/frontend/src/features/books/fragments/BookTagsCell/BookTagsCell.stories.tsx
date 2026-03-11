import type { NormalizedCacheObject } from '@apollo/client';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { BookTagsCellFragmentFragment } from 'src/__generated__/gql/graphql';
import { BookTagsCell } from 'src/features/books/fragments/BookTagsCell/BookTagsCell';
import { FragmentApolloProvider } from 'src/storybook/fragmentApolloProvider';

const bookId = 'book-1';

type BookTagsCellArgs = Pick<BookTagsCellFragmentFragment, 'tags'>;

const buildCacheData = (args: BookTagsCellArgs): NormalizedCacheObject => {
  const cacheData: NormalizedCacheObject = {
    [`Book:${bookId}`]: {
      __typename: 'Book',
      id: bookId,
      tags: args.tags.map((tag) => ({ __ref: `Tag:${tag.id}` })),
    },
  };

  for (const tag of args.tags) {
    cacheData[`Tag:${tag.id}`] = {
      __typename: 'Tag',
      id: tag.id,
      name: tag.name,
    };
  }

  return cacheData;
};

const meta = {
  title: 'Features/Fragments/Books/Tags Cell',
  args: {
    tags: [
      { id: 'tag-1', name: 'Fantasy' },
      { id: 'tag-2', name: 'Classic' },
    ],
  },
  argTypes: {
    tags: { control: 'object' },
  },
  decorators: [
    (Story, context) => (
      <FragmentApolloProvider cacheData={buildCacheData(context.args)}>
        <Story />
      </FragmentApolloProvider>
    ),
  ],
} satisfies Meta<BookTagsCellArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <BookTagsCell bookId={bookId} />,
};
