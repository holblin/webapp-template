import type { NormalizedCacheObject } from '@apollo/client';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import type { AuthorActionsCellFragmentFragment } from 'src/__generated__/gql/graphql';
import { AuthorActionsCell } from 'src/features/authors/fragments/AuthorActionsCell/AuthorActionsCell';
import { FragmentApolloProvider } from 'src/storybook/fragmentApolloProvider';

type AuthorActionsCellArgs = Pick<AuthorActionsCellFragmentFragment, 'id'> & {
  onEditPress: () => void;
  onDeletePress: () => void;
};

const buildCacheData = (args: AuthorActionsCellArgs): NormalizedCacheObject => ({
  [`Author:${args.id}`]: {
    __typename: 'Author',
    id: args.id,
  },
});

const meta = {
  title: 'Features/Fragments/Authors/Actions Cell',
  args: {
    id: 'author-1',
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
} satisfies Meta<AuthorActionsCellArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <AuthorActionsCell
      authorId={args.id}
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
