import { useFragment } from '@apollo/client/react';
import { BOOK_DESCRIPTION_CELL_FRAGMENT } from './BookDescriptionCell.graphql';

type BookDescriptionCellProps = {
  bookId: string;
};

export const BookDescriptionCell = ({ bookId }: BookDescriptionCellProps) => {
  const { data } = useFragment({
    fragment: BOOK_DESCRIPTION_CELL_FRAGMENT,
    from: {
      __typename: 'Book',
      id: bookId,
    },
  });

  return <>{data?.description ?? ''}</>;
};
