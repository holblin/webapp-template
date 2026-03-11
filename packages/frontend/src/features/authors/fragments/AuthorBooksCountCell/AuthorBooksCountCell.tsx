import { useFragment } from '@apollo/client/react';
import { AUTHOR_BOOKS_COUNT_CELL_FRAGMENT } from './AuthorBooksCountCell.graphql';

type AuthorBooksCountCellProps = {
  authorId: string;
};

export const AuthorBooksCountCell = ({ authorId }: AuthorBooksCountCellProps) => {
  const { data } = useFragment({
    fragment: AUTHOR_BOOKS_COUNT_CELL_FRAGMENT,
    from: {
      __typename: 'Author',
      id: authorId,
    },
  });

  return <>{data?.books?.length ?? 0}</>;
};
