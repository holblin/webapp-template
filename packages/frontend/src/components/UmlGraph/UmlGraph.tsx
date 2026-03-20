import { ActionButton, ActionButtonGroup, Tooltip, TooltipTrigger } from '@react-spectrum/s2'
import { style } from '@react-spectrum/s2/style' with { type: 'macro' }
import AlignCenter from '@react-spectrum/s2/icons/AlignCenter';
import Maximize from '@react-spectrum/s2/icons/Maximize';
import ZoomIn from '@react-spectrum/s2/icons/ZoomIn';
import ZoomOut from '@react-spectrum/s2/icons/ZoomOut';
import {
  Background,
  Handle,
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
import { umlAccentPalette } from 'src/components/UmlGraph/UmlGraph.accentPalette';
import type { UmlNodeData } from 'src/components/UmlGraph/UmlGraph.types';
import type { ThemeOptions } from 'src/providers/Theme';

const UmlEntityNode = ({ data }: NodeProps<Node<UmlNodeData>>) => {
  const typedData = data as UmlNodeData;

  return (
    <div
      style={{ width: typedData.width, height: typedData.height }}
      className={`${style({ borderRadius: 'xl', borderWidth: 2, borderStyle: 'solid', padding: 16, boxShadow: 'elevated', color: 'gray-900', display: 'flex', flexDirection: 'column', gap: 8 })} ${umlAccentPalette[typedData.accent].styleClass}`}
    >
      <Handle type="target" position={Position.Left} className={style({ width: 10, height: 10, borderWidth: 2, borderStyle: 'solid', borderColor: 'gray-900', backgroundColor: 'gray-200' })} />
      <Handle type="source" position={Position.Right} className={style({ width: 10, height: 10, borderWidth: 2, borderStyle: 'solid', borderColor: 'gray-900', backgroundColor: 'gray-200' })} />
      <strong className={style({ font: 'heading-sm' })}>{typedData.title}</strong>
      <ul className={style({ marginY: 0, marginX: 0, paddingStart: 16, font: 'body-sm', display: 'flex', flexDirection: 'column', gap: 4 })}>
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

const UmlFlowMiniMap = () => {
  return (
    <MiniMap
      pannable
      zoomable
      position="bottom-right"
      className={style({
        borderRadius: 'lg',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'gray-400',
        zIndex: 2,
        backgroundColor: 'layer-1',
      })}
      nodeBorderRadius={8}
      nodeStrokeWidth={2}
      nodeStrokeColor={(node) => {
        const accent = (node.data as UmlNodeData | undefined)?.accent;
        return accent ? umlAccentPalette[accent].border : 'var(--spectrum-gray-600, gray)';
      }}
      nodeColor={(node) => {
        const accent = (node.data as UmlNodeData | undefined)?.accent;
        return accent ? umlAccentPalette[accent].fill : 'var(--spectrum-gray-300, lightgray)';
      }}
    />
  );
};

type UmlGraphProps = {
  theme?: ThemeOptions;
  nodes: Node<UmlNodeData>[];
  edges: Edge[];
  showMiniMap?: boolean;
  showToolbar?: boolean;
  height?: number;
};

export const UmlGraph = ({
  theme,
  nodes,
  edges,
  showMiniMap = true,
  showToolbar = true,
  height = 560,
}: UmlGraphProps) => {
  const resolvedTheme: ThemeOptions = theme
    ?? (typeof document !== 'undefined' && document.documentElement.dataset.colorScheme === 'light'
      ? 'light'
      : 'dark');

  return (
    <section className={style({ borderWidth: 1, borderStyle: 'solid', borderColor: 'gray-300', borderRadius: 'xl', overflow: 'hidden', width: 'full', position: 'relative', backgroundColor: 'layer-1' })} style={{ height }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        colorMode={resolvedTheme}
        proOptions={{ hideAttribution: true }}
        fitView
        minZoom={0.5}
        maxZoom={1.75}
        fitViewOptions={{ padding: 0.25 }}
      >
        {showMiniMap ? <UmlFlowMiniMap /> : null}
        {showToolbar ? <UmlFlowToolbar /> : null}
        <Background gap={20} color={'var(--spectrum-gray-500, gray)'} />
      </ReactFlow>
    </section>
  );
};
