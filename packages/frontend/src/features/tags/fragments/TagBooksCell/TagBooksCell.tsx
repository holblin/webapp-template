import { useFragment } from '@apollo/client/react';
import { TAG_BOOKS_CELL_FRAGMENT } from './TagBooksCell.graphql';

type TagBooksCellProps = {
  tagId: string;
};

export const TagBooksCell = ({ tagId }: TagBooksCellProps) => {
  const { data } = useFragment({
    fragment: TAG_BOOKS_CELL_FRAGMENT,
    from: {
      __typename: 'Tag',
      id: tagId,
    },
  });

  const titles = (data?.books ?? []).map((book) => book.title);
  return <>{titles.join(', ')}</>;
};
