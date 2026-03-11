import type { Meta, StoryObj } from '@storybook/react-vite';
import { Header } from 'src/components/Header/Header';
import { StoryThemeProvider } from 'src/storybook/storyProviders';

const meta = {
  title: 'Components/Header',
  component: Header,
  decorators: [
    (Story) => (
      <StoryThemeProvider>
        <Story />
      </StoryThemeProvider>
    ),
  ],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
