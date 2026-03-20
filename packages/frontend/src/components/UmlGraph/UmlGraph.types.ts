import {
  type Node,
} from '@xyflow/react';

export type UmlAccent =
  | 'gray'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'chartreuse'
  | 'celery'
  | 'green'
  | 'seafoam'
  | 'cyan'
  | 'blue'
  | 'indigo'
  | 'purple'
  | 'fuchsia'
  | 'magenta';

export type UmlNodeData = {
  title: string;
  fields: string[];
  accent: UmlAccent;
} & Pick<Node, 'width' | 'height'>;
