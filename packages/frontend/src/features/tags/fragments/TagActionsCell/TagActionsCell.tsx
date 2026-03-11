import { useFragment } from '@apollo/client/react';
import { ActionButton } from '@react-spectrum/s2';
import { style } from '@react-spectrum/s2/style' with { type: 'macro' };
import { TAG_ACTIONS_CELL_FRAGMENT } from './TagActionsCell.graphql';

type TagActionsCellProps = {
  tagId: string;
  onEditPress: (tagId: string) => void;
  onDeletePress: (tagId: string) => void;
};

export const TagActionsCell = ({ tagId, onEditPress, onDeletePress }: TagActionsCellProps) => {
  const { data } = useFragment({
    fragment: TAG_ACTIONS_CELL_FRAGMENT,
    from: {
      __typename: 'Tag',
      id: tagId,
    },
  });

  const resolvedTagId = data?.id ?? tagId;

  return (
    <div className={style({ display: 'flex', gap: 8 })}>
      <ActionButton onPress={() => onEditPress(resolvedTagId)}>Edit</ActionButton>
      <ActionButton onPress={() => onDeletePress(resolvedTagId)}>Delete</ActionButton>
    </div>
  );
};
