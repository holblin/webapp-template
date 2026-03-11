import { useFragment } from '@apollo/client/react';
import { AUTHOR_IS_ACTIVE_CELL_FRAGMENT } from './AuthorIsActiveCell.graphql';

type AuthorIsActiveCellProps = {
  authorId: string;
};

export const AuthorIsActiveCell = ({ authorId }: AuthorIsActiveCellProps) => {
  const { data } = useFragment({
    fragment: AUTHOR_IS_ACTIVE_CELL_FRAGMENT,
    from: {
      __typename: 'Author',
      id: authorId,
    },
  });

  if (data?.isActive === true) {
    return <>Yes</>;
  }

  if (data?.isActive === false) {
    return <>No</>;
  }

  return null;
};
