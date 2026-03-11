import type { Meta, StoryObj } from '@storybook/react-vite';
import { Layout } from 'src/components/Layout/Layout';
import { StoryRouterProvider, StoryThemeProvider } from 'src/storybook/storyProviders';

const meta = {
  title: 'Components/Layout',
  component: Layout,
  decorators: [
    (Story) => (
      <StoryThemeProvider>
        <StoryRouterProvider>
          <Story />
        </StoryRouterProvider>
      </StoryThemeProvider>
    ),
  ],
  render: () => (
    <Layout>
      <div style={{ padding: 16 }}>
        Page content in the layout body.
      </div>
    </Layout>
  ),
} satisfies Meta<typeof Layout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
