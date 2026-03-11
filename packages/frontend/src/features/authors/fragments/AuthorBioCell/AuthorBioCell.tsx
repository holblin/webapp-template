import { useFragment } from '@apollo/client/react';
import { AUTHOR_BIO_CELL_FRAGMENT } from './AuthorBioCell.graphql';

type AuthorBioCellProps = {
  authorId: string;
};

export const AuthorBioCell = ({ authorId }: AuthorBioCellProps) => {
  const { data } = useFragment({
    fragment: AUTHOR_BIO_CELL_FRAGMENT,
    from: {
      __typename: 'Author',
      id: authorId,
    },
  });

  return <>{data?.bio ?? ''}</>;
};
