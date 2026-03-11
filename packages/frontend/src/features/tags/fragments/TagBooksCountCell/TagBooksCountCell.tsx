import { useFragment } from '@apollo/client/react';
import { TAG_BOOKS_COUNT_CELL_FRAGMENT } from './TagBooksCountCell.graphql';

type TagBooksCountCellProps = {
  tagId: string;
};

export const TagBooksCountCell = ({ tagId }: TagBooksCountCellProps) => {
  const { data } = useFragment({
    fragment: TAG_BOOKS_COUNT_CELL_FRAGMENT,
    from: {
      __typename: 'Tag',
      id: tagId,
    },
  });

  return <>{data?.books?.length ?? 0}</>;
};
