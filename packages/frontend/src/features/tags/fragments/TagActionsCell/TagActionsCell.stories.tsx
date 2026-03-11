import type { NormalizedCacheObject } from '@apollo/client';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import type { TagActionsCellFragmentFragment } from 'src/__generated__/gql/graphql';
import { TagActionsCell } from 'src/features/tags/fragments/TagActionsCell/TagActionsCell';
import { FragmentApolloProvider } from 'src/storybook/fragmentApolloProvider';

type TagActionsCellArgs = Pick<TagActionsCellFragmentFragment, 'id'> & {
  onEditPress: () => void;
  onDeletePress: () => void;
};

const buildCacheData = (args: TagActionsCellArgs): NormalizedCacheObject => ({
  [`Tag:${args.id}`]: {
    __typename: 'Tag',
    id: args.id,
  },
});

const meta = {
  title: 'Features/Fragments/Tags/Actions Cell',
  args: {
    id: 'tag-1',
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
} satisfies Meta<TagActionsCellArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <TagActionsCell
      tagId={args.id}
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
