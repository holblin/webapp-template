import { useFragment } from '@apollo/client/react';
import { ActionButton } from '@react-spectrum/s2';
import { style } from '@react-spectrum/s2/style' with { type: 'macro' };
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
      <ActionButton onPress={() => onEditPress(resolvedBookId)}>Edit</ActionButton>
      <ActionButton onPress={() => onDeletePress(resolvedBookId)}>Delete</ActionButton>
    </div>
  );
};
