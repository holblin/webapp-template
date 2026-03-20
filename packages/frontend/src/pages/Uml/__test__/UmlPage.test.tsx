/* eslint-disable react/display-name */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('src/providers/Theme', () => ({
  useTheme: () => ({ theme: 'light', setTheme: vi.fn() }),
}));

vi.mock('@react-spectrum/s2', () => {
  const component = (tag: string) => {
    return ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      return React.createElement(tag, props, children);
    };
  };

  return {
    ActionButton: component('button'),
    ActionButtonGroup: component('div'),
    ButtonGroup: component('div'),
    Divider: component('hr'),
    LinkButton: component('a'),
    Tooltip: component('div'),
    TooltipTrigger: component('div'),
  };
});

vi.mock('@xyflow/react', () => {
  const ReactFlow = ({ nodes, edges }: { nodes: Array<{ id: string; data: { title?: string } }>; edges: Array<{ id: string; label?: string }> }) => (
    <div>
      <div>Mocked ReactFlow</div>
      {nodes.map((node) => (
        <div key={node.id}>{node.data.title}</div>
      ))}
      {edges.map((edge) => (
        <div key={edge.id}>{edge.label}</div>
      ))}
    </div>
  );

  return {
    Background: () => null,
    Handle: () => null,
    MarkerType: { ArrowClosed: 'arrowclosed' },
    MiniMap: () => null,
    Panel: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
    Position: { Left: 'left', Right: 'right' },
    ReactFlow,
    useReactFlow: () => ({
      zoomIn: vi.fn(),
      zoomOut: vi.fn(),
      fitView: vi.fn(),
      zoomTo: vi.fn(),
    }),
  };
});

import { UmlPage } from '../UmlPage';

describe('UmlPage', () => {
  it('renders graph entities and relationship labels', () => {
    const html = renderToStaticMarkup(<UmlPage />);

    expect(html).toContain('UML Domain Graph');
    expect(html).toContain('Author');
    expect(html).toContain('Book');
    expect(html).toContain('Tag');
    expect(html).toContain('Author 1 -&gt; 0..* Book');
    expect(html).toContain('Book 0..* &lt;-&gt; 0..* Tag');
  });
});
