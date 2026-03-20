import { ButtonGroup, Divider, LinkButton } from '@react-spectrum/s2'
import { style } from '@react-spectrum/s2/style' with { type: 'macro' }
import {
  Background,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

type UmlNodeData = {
  title: string;
  fields: string[];
  accent: 'indigo' | 'seafoam' | 'orange';
};

const entityNodeClassName = style({
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
});

const entityNodeAccentClassNames: Record<UmlNodeData['accent'], string> = {
  indigo: style({
    backgroundColor: 'indigo-100',
    borderColor: 'indigo-800',
  }),
  seafoam: style({
    backgroundColor: 'seafoam-100',
    borderColor: 'seafoam-800',
  }),
  orange: style({
    backgroundColor: 'orange-100',
    borderColor: 'orange-800',
  }),
};

const entityTitleClassName = style({
  font: 'heading-sm',
});

const entityFieldListClassName = style({
  marginY: 0,
  marginX: 0,
  paddingStart: 16,
  font: 'body-sm',
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
});

const handleClassName = style({
  width: 10,
  height: 10,
  borderWidth: 2,
  borderStyle: 'solid',
  borderColor: 'gray-900',
  backgroundColor: 'gray-200',
});

const UmlEntityNode = ({ data }: NodeProps<Node<UmlNodeData>>) => {
  const typedData = data as UmlNodeData;

  return (
    <div className={`${entityNodeClassName} ${entityNodeAccentClassNames[typedData.accent]}`}>
      <Handle type="target" position={Position.Left} className={handleClassName} />
      <Handle type="source" position={Position.Right} className={handleClassName} />
      <strong className={entityTitleClassName}>{typedData.title}</strong>
      <ul className={entityFieldListClassName}>
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

const nodes: Node<UmlNodeData>[] = [
  {
    id: 'author',
    type: 'umlEntity',
    position: { x: 40, y: 120 },
    data: {
      title: 'Author',
      accent: 'indigo',
      fields: ['id: ID!', 'name: String!', 'bio: String!', 'country: String!', 'isActive: Boolean!', 'birthDate: Date!'],
    },
  },
  {
    id: 'book',
    type: 'umlEntity',
    position: { x: 440, y: 120 },
    data: {
      title: 'Book',
      accent: 'seafoam',
      fields: ['id: ID!', 'title: String!', 'description: String!', 'publicationDate: Date!', 'author: Author!', 'tags: [Tag!]!'],
    },
  },
  {
    id: 'tag',
    type: 'umlEntity',
    position: { x: 840, y: 120 },
    data: {
      title: 'Tag',
      accent: 'orange',
      fields: ['id: ID!', 'name: String!', 'books: [Book!]!'],
    },
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

export const UmlPage = () => {
  return (
    <main
      className={style({
        width: 'full',
        flexGrow: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      })}
    >
      <section
        className={style({
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: 'gray-300',
          borderRadius: 'xl',
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          backgroundColor: 'gray-50',
        })}
      >
        <h1 className={style({ marginY: 0, font: 'heading-lg' })}>UML Domain Graph</h1>
        <p className={style({ marginY: 0, font: 'body-sm', color: 'gray-800' })}>
          Graph generated from your current GraphQL model: each Book has exactly one Author, and Book/Tag is many-to-many.
        </p>
        <ButtonGroup>
          <LinkButton href="/authors">Authors</LinkButton>
          <LinkButton href="/books">Books</LinkButton>
          <LinkButton href="/tags">Tags</LinkButton>
        </ButtonGroup>
      </section>

      <Divider />

      <section
        className={style({
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: 'gray-300',
          borderRadius: 'xl',
          overflow: 'hidden',
          minHeight: 520,
          backgroundColor: 'gray-100',
        })}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.5}
          maxZoom={1.75}
          fitViewOptions={{ padding: 0.25 }}
        >
          <MiniMap
            pannable
            zoomable
            maskColor="rgba(29, 30, 34, 0.16)"
            nodeColor={(node) => {
              if (node.id === 'author') {
                return '#C8DAFF';
              }
              if (node.id === 'book') {
                return '#C8F2EA';
              }
              return '#FFDDB7';
            }}
          />
          <Controls />
          <Background gap={20} color="#BAC3CF" />
        </ReactFlow>
      </section>
    </main>
  )
}
