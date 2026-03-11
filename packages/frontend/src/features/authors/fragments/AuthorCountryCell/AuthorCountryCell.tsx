import { useFragment } from '@apollo/client/react';
import { AUTHOR_COUNTRY_CELL_FRAGMENT } from './AuthorCountryCell.graphql';

type AuthorCountryCellProps = {
  authorId: string;
};

export const AuthorCountryCell = ({ authorId }: AuthorCountryCellProps) => {
  const { data } = useFragment({
    fragment: AUTHOR_COUNTRY_CELL_FRAGMENT,
    from: {
      __typename: 'Author',
      id: authorId,
    },
  });

  return <>{data?.country ?? ''}</>;
};
