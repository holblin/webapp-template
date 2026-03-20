import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { Navigation } from 'src/components/Navigation/Navigation';
import { StoryRouterProvider } from 'src/storybook/storyProviders';

const meta = {
  title: 'Components/Navigation',
  component: Navigation,
  args: {
    onNavigate: fn(),
  },
  argTypes: {
    onNavigate: {
      action: 'navigate',
      control: false,
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 240, minHeight: 360 }}>
        <StoryRouterProvider>
          <Story />
        </StoryRouterProvider>
      </div>
    ),
  ],
} satisfies Meta<typeof Navigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent, step }) => {
    await step('Select Authors tab', async () => {
      const authorsTab = canvas.getByRole('tab', { name: /authors/i });
      await userEvent.click(authorsTab);
    });

    await step('Authors tab is selected', async () => {
      const authorsTab = canvas.getByRole('tab', { name: /authors/i });
      await expect(authorsTab).toHaveAttribute('aria-selected', 'true');
    });

    await step('Selection change triggers onNavigate', async () => {
      await expect(args.onNavigate).toHaveBeenCalledWith('/authors');
    });
  },
};

export const AuthorsSelected: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 240, minHeight: 360 }}>
        <StoryRouterProvider initialPath="/authors">
          <Story />
        </StoryRouterProvider>
      </div>
    ),
  ],
};
