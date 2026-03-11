import { useFragment } from '@apollo/client/react';
import { TAG_NAME_CELL_FRAGMENT } from './TagNameCell.graphql';

type TagNameCellProps = {
  tagId: string;
};

export const TagNameCell = ({ tagId }: TagNameCellProps) => {
  const { data } = useFragment({
    fragment: TAG_NAME_CELL_FRAGMENT,
    from: {
      __typename: 'Tag',
      id: tagId,
    },
  });

  return <>{data?.name ?? ''}</>;
};
