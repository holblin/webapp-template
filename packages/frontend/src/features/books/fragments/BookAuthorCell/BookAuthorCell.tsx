import { useFragment } from '@apollo/client/react';
import { BOOK_AUTHOR_CELL_FRAGMENT } from './BookAuthorCell.graphql';

type BookAuthorCellProps = {
  bookId: string;
};

export const BookAuthorCell = ({ bookId }: BookAuthorCellProps) => {
  const { data } = useFragment({
    fragment: BOOK_AUTHOR_CELL_FRAGMENT,
    from: {
      __typename: 'Book',
      id: bookId,
    },
  });

  return <>{data?.author?.name ?? ''}</>;
};
