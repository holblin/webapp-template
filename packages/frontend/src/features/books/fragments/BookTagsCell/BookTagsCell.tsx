import { useFragment } from '@apollo/client/react';
import { BOOK_TAGS_CELL_FRAGMENT } from './BookTagsCell.graphql';

type BookTagsCellProps = {
  bookId: string;
};

export const BookTagsCell = ({ bookId }: BookTagsCellProps) => {
  const { data } = useFragment({
    fragment: BOOK_TAGS_CELL_FRAGMENT,
    from: {
      __typename: 'Book',
      id: bookId,
    },
  });

  const names = (data?.tags ?? []).map((tag) => tag.name);
  return <>{names.join(', ')}</>;
};
