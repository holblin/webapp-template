import { Cell } from '@react-spectrum/s2';
import type { ComponentProps, PropsWithChildren } from 'react';

type CellTextProps = PropsWithChildren<ComponentProps<typeof Cell>>;

export const CellText = ({ children, ...cellProps }: CellTextProps) => {
  return (
    <Cell {...cellProps}>
      <span
        style={{ cursor: 'text', WebkitUserSelect: 'text', userSelect: 'text' }}
        onPointerDown={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
        role="none"
      >
        {children}
      </span>
    </Cell>
  );
};
