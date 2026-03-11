import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Navigation } from 'src/components/Navigation/Navigation';
import { StoryRouterProvider } from 'src/storybook/storyProviders';

const meta = {
  title: 'Components/Navigation',
  component: Navigation,
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
  play: async ({ canvas, userEvent, step }) => {
    await step('Select Authors tab', async () => {
      const authorsTab = canvas.getByRole('tab', { name: /authors/i });
      await userEvent.click(authorsTab);
    });

    await step('Authors tab is selected', async () => {
      const authorsTab = canvas.getByRole('tab', { name: /authors/i });
      await expect(authorsTab).toHaveAttribute('aria-selected', 'true');
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
