import { useFragment } from '@apollo/client/react';
import { ActionButton, Tooltip, TooltipTrigger } from '@react-spectrum/s2';
import Delete from '@react-spectrum/s2/icons/Delete';
import Edit from '@react-spectrum/s2/icons/Edit';
import { iconStyle, style } from '@react-spectrum/s2/style' with { type: 'macro' };
import { BOOK_ACTIONS_CELL_FRAGMENT } from './BookActionsCell.graphql';

type BookActionsCellProps = {
  bookId: string;
  onEditPress: (bookId: string) => void;
  onDeletePress: (bookId: string) => void;
};

export const BookActionsCell = ({ bookId, onEditPress, onDeletePress }: BookActionsCellProps) => {
  const { data } = useFragment({
    fragment: BOOK_ACTIONS_CELL_FRAGMENT,
    from: {
      __typename: 'Book',
      id: bookId,
    },
  });

  const resolvedBookId = data?.id ?? bookId;

  return (
    <div className={style({ display: 'flex', gap: 8 })}>
      <TooltipTrigger>
        <ActionButton aria-label="Edit" onPress={() => onEditPress(resolvedBookId)}>
          <Edit styles={iconStyle({ size: 'M' })} />
        </ActionButton>
        <Tooltip>Edit</Tooltip>
      </TooltipTrigger>
      <TooltipTrigger>
        <ActionButton aria-label="Delete" onPress={() => onDeletePress(resolvedBookId)}>
          <Delete styles={iconStyle({ size: 'M' })} />
        </ActionButton>
        <Tooltip>Delete</Tooltip>
      </TooltipTrigger>
    </div>
  );
};
