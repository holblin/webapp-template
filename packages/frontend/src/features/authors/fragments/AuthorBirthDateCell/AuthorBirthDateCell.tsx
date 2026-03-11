import { useFragment } from '@apollo/client/react';
import { AUTHOR_BIRTH_DATE_CELL_FRAGMENT } from './AuthorBirthDateCell.graphql';

type AuthorBirthDateCellProps = {
  authorId: string;
};

export const AuthorBirthDateCell = ({ authorId }: AuthorBirthDateCellProps) => {
  const { data } = useFragment({
    fragment: AUTHOR_BIRTH_DATE_CELL_FRAGMENT,
    from: {
      __typename: 'Author',
      id: authorId,
    },
  });

  return <>{data?.birthDate ?? ''}</>;
};
