import { ActionButton, ActionButtonGroup, ButtonGroup, Divider, LinkButton, Tooltip, TooltipTrigger } from '@react-spectrum/s2'
import { style } from '@react-spectrum/s2/style' with { type: 'macro' }
import AlignCenter from '@react-spectrum/s2/icons/AlignCenter';
import Maximize from '@react-spectrum/s2/icons/Maximize';
import ZoomIn from '@react-spectrum/s2/icons/ZoomIn';
import ZoomOut from '@react-spectrum/s2/icons/ZoomOut';
import {
  Background,
  Handle,
  MarkerType,
  MiniMap,
  Panel,
  Position,
  ReactFlow,
  useReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useTheme } from 'src/providers/Theme';

type UmlNodeData = {
  title: string;
  fields: string[];
  accent: 'indigo' | 'seafoam' | 'orange';
};

const accentPalette: Record<UmlNodeData['accent'], { fill: string; border: string }> = {
  indigo: { fill: '#C8DAFF', border: '#4B5DC8' },
  seafoam: { fill: '#C8F2EA', border: '#0A8F79' },
  orange: { fill: '#FFDDB7', border: '#D96A00' },
};

const entityNodeStyle = {
  width: 260,
  borderRadius: 'xl',
  borderWidth: 2,
  borderStyle: 'solid',
  padding: 16,
  boxShadow: 'elevated',
  color: 'gray-900',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
} as const;

const entityTitleStyle = {
  font: 'heading-sm',
} as const;

const entityFieldListStyle = {
  marginY: 0,
  marginX: 0,
  paddingStart: 16,
  font: 'body-sm',
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
} as const;

const handleStyle = {
  width: 10,
  height: 10,
  borderWidth: 2,
  borderStyle: 'solid',
  borderColor: 'gray-900',
  backgroundColor: 'gray-200',
} as const;

const UmlEntityNode = ({ data }: NodeProps<Node<UmlNodeData>>) => {
  const typedData = data as UmlNodeData;

  return (
    <div className={`${style(entityNodeStyle)} ${
      typedData.accent === 'indigo'
        ? style({ backgroundColor: 'indigo-100', borderColor: 'indigo-800' })
        : typedData.accent === 'seafoam'
          ? style({ backgroundColor: 'seafoam-100', borderColor: 'seafoam-800' })
          : style({ backgroundColor: 'orange-100', borderColor: 'orange-800' })
    }`}>
      <Handle type="target" position={Position.Left} className={style(handleStyle)} />
      <Handle type="source" position={Position.Right} className={style(handleStyle)} />
      <strong className={style(entityTitleStyle)}>{typedData.title}</strong>
      <ul className={style(entityFieldListStyle)}>
        {typedData.fields.map((field) => (
          <li key={field}>{field}</li>
        ))}
      </ul>
    </div>
  );
};

const nodeTypes = {
  umlEntity: UmlEntityNode,
} as const;

const pageStyle = {
  width: 'full',
  flexGrow: 1,
  minHeight: 0,
  overflowY: 'auto',
  padding: 24,
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
} as const;

const introSectionStyle = {
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: 'gray-300',
  borderRadius: 'xl',
  padding: 20,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  backgroundColor: 'gray-50',
} as const;

const pageTitleStyle = { marginY: 0, font: 'heading-lg' } as const;
const introTextStyle = { marginY: 0, font: 'body-sm', color: 'gray-800' } as const;

const graphSectionStyle = {
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: 'gray-300',
  borderRadius: 'xl',
  overflow: 'hidden',
  minHeight: 520,
  backgroundColor: 'layer-1',
} as const;

const nodes: Node<UmlNodeData>[] = [
  {
    id: 'author',
    type: 'umlEntity',
    position: { x: 40, y: 120 },
    width: 280,
    height: 240,
    data: {
      title: 'Author',
      accent: 'indigo',
      fields: ['id: ID!', 'name: String!', 'bio: String!', 'country: String!', 'isActive: Boolean!', 'birthDate: Date!'],
    },
    style: { width: 280, minHeight: 240 },
  },
  {
    id: 'book',
    type: 'umlEntity',
    position: { x: 560, y: 120 },
    width: 280,
    height: 240,
    data: {
      title: 'Book',
      accent: 'seafoam',
      fields: ['id: ID!', 'title: String!', 'description: String!', 'publicationDate: Date!', 'author: Author!', 'tags: [Tag!]!'],
    },
    style: { width: 280, minHeight: 240 },
  },
  {
    id: 'tag',
    type: 'umlEntity',
    position: { x: 1080, y: 150 },
    width: 280,
    height: 180,
    data: {
      title: 'Tag',
      accent: 'orange',
      fields: ['id: ID!', 'name: String!', 'books: [Book!]!'],
    },
    style: { width: 280, minHeight: 180 },
  },
]

const edges: Edge[] = [
  {
    id: 'author-books',
    source: 'author',
    target: 'book',
    label: 'Author 1 -> 0..* Book',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#3655A5', strokeWidth: 2 },
    labelStyle: { fill: '#1D1E22', fontWeight: 600, fontSize: 12 },
    labelBgStyle: { fill: '#F5F9FF', fillOpacity: 1, stroke: '#D2E5FF', strokeWidth: 1 },
    labelBgBorderRadius: 6,
    labelBgPadding: [8, 4],
  },
  {
    id: 'book-tags',
    source: 'book',
    target: 'tag',
    label: 'Book 0..* <-> 0..* Tag',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#B75B00', strokeWidth: 2 },
    labelStyle: { fill: '#1D1E22', fontWeight: 600, fontSize: 12 },
    labelBgStyle: { fill: '#FFF8EE', fillOpacity: 1, stroke: '#FFD6A8', strokeWidth: 1 },
    labelBgBorderRadius: 6,
    labelBgPadding: [8, 4],
  },
]

const UmlFlowToolbar = () => {
  const reactFlow = useReactFlow();

  return (
    <Panel position="top-right">
      <ActionButtonGroup
        aria-label="UML graph controls"
        orientation="horizontal"
        density="compact"
      >
        <TooltipTrigger>
          <ActionButton aria-label="Zoom in" onPress={() => void reactFlow.zoomIn({ duration: 200 })}>
            <ZoomIn />
          </ActionButton>
          <Tooltip>Zoom in</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger>
          <ActionButton aria-label="Zoom out" onPress={() => void reactFlow.zoomOut({ duration: 200 })}>
            <ZoomOut />
          </ActionButton>
          <Tooltip>Zoom out</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger>
          <ActionButton
            aria-label="Fit view"
            onPress={() => void reactFlow.fitView({ padding: 0.25, duration: 260 })}
          >
            <Maximize />
          </ActionButton>
          <Tooltip>Fit view</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger>
          <ActionButton aria-label="Reset zoom" onPress={() => void reactFlow.zoomTo(1, { duration: 220 })}>
            <AlignCenter />
          </ActionButton>
          <Tooltip>Reset zoom</Tooltip>
        </TooltipTrigger>
      </ActionButtonGroup>
    </Panel>
  );
};

export const UmlPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <main className={style(pageStyle)}>
      <section className={style(introSectionStyle)}>
        <h1 className={style(pageTitleStyle)}>UML Domain Graph</h1>
        <p className={style(introTextStyle)}>
          Graph generated from your current GraphQL model: each Book has exactly one Author, and Book/Tag is many-to-many.
        </p>
        <ButtonGroup>
          <LinkButton href="/authors">Authors</LinkButton>
          <LinkButton href="/books">Books</LinkButton>
          <LinkButton href="/tags">Tags</LinkButton>
        </ButtonGroup>
      </section>

      <Divider />

      <section className={style(graphSectionStyle)}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          colorMode={theme}
          proOptions={{ hideAttribution: true }}
          fitView
          minZoom={0.5}
          maxZoom={1.75}
          fitViewOptions={{ padding: 0.25 }}
        >
          <MiniMap
            pannable
            zoomable
            position="bottom-right"
            bgColor={isDark ? '#1D2228' : '#E5E7EB'}
            maskColor={isDark ? 'rgba(248, 248, 248, 0.18)' : 'rgba(29, 30, 34, 0.16)'}
            nodeBorderRadius={8}
            nodeStrokeWidth={2}
            nodeStrokeColor={(node) => {
              const accent = (node.data as UmlNodeData | undefined)?.accent;
              return accent ? accentPalette[accent].border : '#5B6470';
            }}
            nodeColor={(node) => {
              const accent = (node.data as UmlNodeData | undefined)?.accent;
              return accent ? accentPalette[accent].fill : '#CFD6DE';
            }}
          />
          <UmlFlowToolbar />
          <Background gap={20} color={isDark ? '#90A0B6' : '#BAC3CF'} />
        </ReactFlow>
      </section>
    </main>
  )
}
