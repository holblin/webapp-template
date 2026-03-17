import { useFragment } from '@apollo/client/react';
import { ActionButton, Tooltip, TooltipTrigger } from '@react-spectrum/s2';
import Delete from '@react-spectrum/s2/icons/Delete';
import Edit from '@react-spectrum/s2/icons/Edit';
import { iconStyle, style } from '@react-spectrum/s2/style' with { type: 'macro' };
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
      <TooltipTrigger>
        <ActionButton aria-label="Edit" onPress={() => onEditPress(resolvedTagId)}>
          <Edit styles={iconStyle({ size: 'M' })} />
        </ActionButton>
        <Tooltip>Edit</Tooltip>
      </TooltipTrigger>
      <TooltipTrigger>
        <ActionButton aria-label="Delete" onPress={() => onDeletePress(resolvedTagId)}>
          <Delete styles={iconStyle({ size: 'M' })} />
        </ActionButton>
        <Tooltip>Delete</Tooltip>
      </TooltipTrigger>
    </div>
  );
};
