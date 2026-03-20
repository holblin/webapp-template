import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Edge, Node } from '@xyflow/react';
import { MarkerType } from '@xyflow/react';
import { expect } from 'storybook/test';
import { UmlGraph } from 'src/components/UmlGraph/UmlGraph';

type StoryUmlNodeData = {
  title: string;
  fields: string[];
  accent: 'indigo' | 'seafoam' | 'orange';
};

const exampleNodes: Node<StoryUmlNodeData>[] = [
  {
    id: 'user',
    type: 'umlEntity',
    position: { x: 60, y: 70 },
    data: {
      title: 'User',
      accent: 'indigo',
      fields: ['id: ID!', 'email: String!', 'name: String!', 'workspaceId: ID!'],
    },
  },
  {
    id: 'workspace',
    type: 'umlEntity',
    position: { x: 460, y: 80 },
    data: {
      title: 'Workspace',
      accent: 'seafoam',
      fields: ['id: ID!', 'name: String!', 'slug: String!', 'plan: PlanTier!'],
    },
  },
  {
    id: 'project',
    type: 'umlEntity',
    position: { x: 460, y: 320 },
    data: {
      title: 'Project',
      accent: 'orange',
      fields: ['id: ID!', 'workspaceId: ID!', 'name: String!', 'status: ProjectStatus!'],
    },
  },
  {
    id: 'task',
    type: 'umlEntity',
    position: { x: 880, y: 190 },
    data: {
      title: 'Task',
      accent: 'indigo',
      fields: ['id: ID!', 'projectId: ID!', 'title: String!', 'assigneeId: ID'],
    },
  },
];

const exampleEdges: Edge[] = [
  {
    id: 'workspace-users',
    source: 'workspace',
    target: 'user',
    type: 'smoothstep',
    label: 'Workspace 1 -> 0..* User',
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'workspace-projects',
    source: 'workspace',
    target: 'project',
    type: 'smoothstep',
    label: 'Workspace 1 -> 0..* Project',
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'project-tasks',
    source: 'project',
    target: 'task',
    type: 'smoothstep',
    label: 'Project 1 -> 0..* Task',
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'user-tasks',
    source: 'user',
    target: 'task',
    type: 'smoothstep',
    label: 'User 0..1 -> 0..* Task',
    markerEnd: { type: MarkerType.ArrowClosed },
  },
];

const meta = {
  title: 'Components/UML Graph',
  component: UmlGraph,
  args: {
    nodes: exampleNodes,
    edges: exampleEdges,
    showToolbar: true,
    showMiniMap: true,
    height: 620,
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 700, width: '100%' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof UmlGraph>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ExampleGraph: Story = {
  play: async ({ canvas, canvasElement, step }) => {
    await step('Toolbar is visible', async () => {
      await expect(canvas.getByRole('button', { name: /zoom in/i })).toBeVisible();
      await expect(canvas.getByRole('button', { name: /zoom out/i })).toBeVisible();
      await expect(canvas.getByRole('button', { name: /fit view/i })).toBeVisible();
      await expect(canvas.getByRole('button', { name: /reset zoom/i })).toBeVisible();
    });

    await step('Minimap is rendered', async () => {
      const miniMap = canvasElement.querySelector('.react-flow__minimap');
      expect(miniMap).not.toBeNull();
    });
  },
};
