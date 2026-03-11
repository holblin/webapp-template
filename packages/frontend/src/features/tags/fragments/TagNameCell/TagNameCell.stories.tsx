import type { NormalizedCacheObject } from '@apollo/client';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { TagNameCellFragmentFragment } from 'src/__generated__/gql/graphql';
import { TagNameCell } from 'src/features/tags/fragments/TagNameCell/TagNameCell';
import { FragmentApolloProvider } from 'src/storybook/fragmentApolloProvider';

const tagId = 'tag-1';

type TagNameCellArgs = Pick<TagNameCellFragmentFragment, 'name'>;

const buildCacheData = (args: TagNameCellArgs): NormalizedCacheObject => ({
  [`Tag:${tagId}`]: {
    __typename: 'Tag',
    id: tagId,
    name: args.name,
  },
});

const meta = {
  title: 'Features/Fragments/Tags/Name Cell',
  args: {
    name: 'Fantasy',
  },
  argTypes: {
    name: { control: 'text' },
  },
  decorators: [
    (Story, context) => (
      <FragmentApolloProvider cacheData={buildCacheData(context.args)}>
        <Story />
      </FragmentApolloProvider>
    ),
  ],
} satisfies Meta<TagNameCellArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <TagNameCell tagId={tagId} />,
};
