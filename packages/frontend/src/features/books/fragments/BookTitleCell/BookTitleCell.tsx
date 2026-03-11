import { useFragment } from '@apollo/client/react';
import { BOOK_TITLE_CELL_FRAGMENT } from './BookTitleCell.graphql';

type BookTitleCellProps = {
  bookId: string;
};

export const BookTitleCell = ({ bookId }: BookTitleCellProps) => {
  const { data } = useFragment({
    fragment: BOOK_TITLE_CELL_FRAGMENT,
    from: {
      __typename: 'Book',
      id: bookId,
    },
  });

  return <>{data?.title ?? ''}</>;
};
