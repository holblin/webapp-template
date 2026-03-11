import { useFragment } from '@apollo/client/react';
import { TAG_ID_CELL_FRAGMENT } from './TagIdCell.graphql';

type TagIdCellProps = {
  tagId: string;
};

export const TagIdCell = ({ tagId }: TagIdCellProps) => {
  const { data } = useFragment({
    fragment: TAG_ID_CELL_FRAGMENT,
    from: {
      __typename: 'Tag',
      id: tagId,
    },
  });

  return <>{data?.id ?? tagId}</>;
};
