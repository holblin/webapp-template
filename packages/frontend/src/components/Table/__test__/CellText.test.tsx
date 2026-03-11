import type { ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CellText } from '../CellText';

vi.mock('@react-spectrum/s2', () => ({
  Cell: ({ children }: { children: unknown }) => children,
}));

describe('CellText', () => {
  it('stops row selection propagation on pointer/mouse down', () => {
    const element = CellText({ children: 'Cell content' } as never) as ReactElement<{ children: ReactElement }>;
    const span = element.props.children as ReactElement<{
      onPointerDown: (event: { stopPropagation: () => void }) => void;
      onMouseDown: (event: { stopPropagation: () => void }) => void;
    }>;
    const stopPropagation = vi.fn();

    span.props.onPointerDown({ stopPropagation });
    span.props.onMouseDown({ stopPropagation });

    expect(stopPropagation).toHaveBeenCalledTimes(2);
  });
});
