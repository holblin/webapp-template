import { useFragment } from '@apollo/client/react';
import { AUTHOR_ID_CELL_FRAGMENT } from './AuthorIdCell.graphql';

type AuthorIdCellProps = {
  authorId: string;
};

export const AuthorIdCell = ({ authorId }: AuthorIdCellProps) => {
  const { data } = useFragment({
    fragment: AUTHOR_ID_CELL_FRAGMENT,
    from: {
      __typename: 'Author',
      id: authorId,
    },
  });

  return <>{data?.id ?? authorId}</>;
};
