import { useFragment } from '@apollo/client/react';
import { ActionButton, Tooltip, TooltipTrigger } from '@react-spectrum/s2';
import Delete from '@react-spectrum/s2/icons/Delete';
import Edit from '@react-spectrum/s2/icons/Edit';
import { iconStyle, style } from '@react-spectrum/s2/style' with { type: 'macro' };
import { AUTHOR_ACTIONS_CELL_FRAGMENT } from './AuthorActionsCell.graphql';

type AuthorActionsCellProps = {
  authorId: string;
  onEditPress: (authorId: string) => void;
  onDeletePress: (authorId: string) => void;
};

export const AuthorActionsCell = ({ authorId, onEditPress, onDeletePress }: AuthorActionsCellProps) => {
  const { data } = useFragment({
    fragment: AUTHOR_ACTIONS_CELL_FRAGMENT,
    from: {
      __typename: 'Author',
      id: authorId,
    },
  });
  const resolvedAuthorId = data?.id ?? authorId;

  return (
    <div className={style({ display: 'flex', gap: 8 })}>
      <TooltipTrigger>
        <ActionButton aria-label="Edit" onPress={() => onEditPress(resolvedAuthorId)}>
          <Edit styles={iconStyle({ size: 'M' })} />
        </ActionButton>
        <Tooltip>Edit</Tooltip>
      </TooltipTrigger>
      <TooltipTrigger>
        <ActionButton aria-label="Delete" onPress={() => onDeletePress(resolvedAuthorId)}>
          <Delete styles={iconStyle({ size: 'M' })} />
        </ActionButton>
        <Tooltip>Delete</Tooltip>
      </TooltipTrigger>
    </div>
  );
};
