import { useFragment } from '@apollo/client/react';
import { BOOK_PUBLICATION_DATE_CELL_FRAGMENT } from './BookPublicationDateCell.graphql';

type BookPublicationDateCellProps = {
  bookId: string;
};

export const BookPublicationDateCell = ({ bookId }: BookPublicationDateCellProps) => {
  const { data } = useFragment({
    fragment: BOOK_PUBLICATION_DATE_CELL_FRAGMENT,
    from: {
      __typename: 'Book',
      id: bookId,
    },
  });

  return <>{data?.publicationDate ?? ''}</>;
};
