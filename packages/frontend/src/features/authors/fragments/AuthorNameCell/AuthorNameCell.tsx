import { useFragment } from '@apollo/client/react';
import { AUTHOR_NAME_CELL_FRAGMENT } from './AuthorNameCell.graphql';

type AuthorNameCellProps = {
  authorId: string;
};

export const AuthorNameCell = ({ authorId }: AuthorNameCellProps) => {
  const { data } = useFragment({
    fragment: AUTHOR_NAME_CELL_FRAGMENT,
    from: {
      __typename: 'Author',
      id: authorId,
    },
  });

  return <>{data?.name ?? ''}</>;
};
