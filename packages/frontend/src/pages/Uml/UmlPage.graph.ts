import { MarkerType, type Edge, type Node } from '@xyflow/react';
import type { UmlNodeData } from 'src/components/UmlGraph/UmlGraph.types';

export const defaultUmlNodes: Node<UmlNodeData>[] = [
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
];

export const defaultUmlEdges: Edge[] = [
  {
    id: 'author-books',
    source: 'author',
    target: 'book',
    label: 'Author 1 -> 0..* Book',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: 'var(--spectrum-indigo-800, indigo)', strokeWidth: 2 },
    labelStyle: { fill: 'var(--spectrum-gray-900, currentColor)', fontWeight: 600, fontSize: 12 },
    labelBgStyle: {
      fill: 'var(--spectrum-gray-100, canvas)',
      fillOpacity: 1,
      stroke: 'var(--spectrum-indigo-300, lightsteelblue)',
      strokeWidth: 1,
    },
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
    style: { stroke: 'var(--spectrum-orange-800, darkorange)', strokeWidth: 2 },
    labelStyle: { fill: 'var(--spectrum-gray-900, currentColor)', fontWeight: 600, fontSize: 12 },
    labelBgStyle: {
      fill: 'var(--spectrum-gray-100, canvas)',
      fillOpacity: 1,
      stroke: 'var(--spectrum-orange-300, burlywood)',
      strokeWidth: 1,
    },
    labelBgBorderRadius: 6,
    labelBgPadding: [8, 4],
  },
];
