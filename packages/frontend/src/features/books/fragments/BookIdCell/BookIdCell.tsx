import { useFragment } from '@apollo/client/react';
import { BOOK_ID_CELL_FRAGMENT } from './BookIdCell.graphql';

type BookIdCellProps = {
  bookId: string;
};

export const BookIdCell = ({ bookId }: BookIdCellProps) => {
  const { data } = useFragment({
    fragment: BOOK_ID_CELL_FRAGMENT,
    from: {
      __typename: 'Book',
      id: bookId,
    },
  });

  return <>{data?.id ?? bookId}</>;
};
