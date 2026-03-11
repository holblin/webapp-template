import type { NormalizedCacheObject } from '@apollo/client';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { TagBooksCellFragmentFragment } from 'src/__generated__/gql/graphql';
import { TagBooksCell } from 'src/features/tags/fragments/TagBooksCell/TagBooksCell';
import { FragmentApolloProvider } from 'src/storybook/fragmentApolloProvider';

const tagId = 'tag-1';

type TagBooksCellArgs = Pick<TagBooksCellFragmentFragment, 'books'>;

const buildCacheData = (args: TagBooksCellArgs): NormalizedCacheObject => {
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
      title: book.title,
    };
  }

  return cacheData;
};

const meta = {
  title: 'Features/Fragments/Tags/Books Cell',
  args: {
    books: [
      { id: 'book-1', title: 'A Wizard of Earthsea' },
      { id: 'book-2', title: 'The Left Hand of Darkness' },
    ],
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
} satisfies Meta<TagBooksCellArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <TagBooksCell tagId={tagId} />,
};
