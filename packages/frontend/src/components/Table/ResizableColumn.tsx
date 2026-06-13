import { Column } from '@react-spectrum/s2';
import type { ComponentProps } from 'react';

type ResizableColumnProps = ComponentProps<typeof Column>;

export const ResizableColumn = ({
  allowsResizing = true,
  ...rest
}: ResizableColumnProps) => (
  <Column allowsResizing={allowsResizing} {...rest} />
);
