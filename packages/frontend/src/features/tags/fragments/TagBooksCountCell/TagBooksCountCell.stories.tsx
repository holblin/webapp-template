import type { NormalizedCacheObject } from '@apollo/client';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { TagBooksCountCellFragmentFragment } from 'src/__generated__/gql/graphql';
import { TagBooksCountCell } from 'src/features/tags/fragments/TagBooksCountCell/TagBooksCountCell';
import { FragmentApolloProvider } from 'src/storybook/fragmentApolloProvider';

const tagId = 'tag-1';

type TagBooksCountCellArgs = Pick<TagBooksCountCellFragmentFragment, 'books'>;

const buildCacheData = (args: TagBooksCountCellArgs): NormalizedCacheObject => {
  const cacheData: NormalizedCacheObject = {
    [`Tag:${tagId}`]: {
      __typename: 'Tag',
      id: tagId,
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
  title: 'Features/Fragments/Tags/Books Count Cell',
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
} satisfies Meta<TagBooksCountCellArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <TagBooksCountCell tagId={tagId} />,
};
