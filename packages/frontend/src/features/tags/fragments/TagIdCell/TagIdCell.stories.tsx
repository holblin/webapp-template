import type { NormalizedCacheObject } from '@apollo/client';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { TagIdCellFragmentFragment } from 'src/__generated__/gql/graphql';
import { TagIdCell } from 'src/features/tags/fragments/TagIdCell/TagIdCell';
import { FragmentApolloProvider } from 'src/storybook/fragmentApolloProvider';

type TagIdCellArgs = Pick<TagIdCellFragmentFragment, 'id'>;

const buildCacheData = (args: TagIdCellArgs): NormalizedCacheObject => ({
  [`Tag:${args.id}`]: {
    __typename: 'Tag',
    id: args.id,
  },
});

const meta = {
  title: 'Features/Fragments/Tags/Id Cell',
  args: {
    id: 'tag-1',
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
} satisfies Meta<TagIdCellArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <TagIdCell tagId={args.id} />,
};
