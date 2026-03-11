import { useFragment } from '@apollo/client/react';
import { ActionButton } from '@react-spectrum/s2';
import { style } from '@react-spectrum/s2/style' with { type: 'macro' };
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
      <ActionButton onPress={() => onEditPress(resolvedAuthorId)}>Edit</ActionButton>
      <ActionButton onPress={() => onDeletePress(resolvedAuthorId)}>Delete</ActionButton>
    </div>
  );
};
