import { TagListSortBy, type TagInventoryRowFragmentFragment } from 'src/__generated__/gql/graphql';
import type { InventoryLayoutColumn } from 'src/components/Inventory/InventoryLayout';
import { TagActionsCell } from 'src/features/tags/fragments/TagActionsCell/TagActionsCell';
import { TagBooksCell } from 'src/features/tags/fragments/TagBooksCell/TagBooksCell';
import { TagBooksCountCell } from 'src/features/tags/fragments/TagBooksCountCell/TagBooksCountCell';
import { TagIdCell } from 'src/features/tags/fragments/TagIdCell/TagIdCell';
import { TagNameCell } from 'src/features/tags/fragments/TagNameCell/TagNameCell';

export type TagInventoryNode = TagInventoryRowFragmentFragment;

export type TagInventoryRow = {
  cursor: string;
  node: TagInventoryNode;
};

type TagInventoryColumnHandlers = {
  onEditPress: (tagId: string) => void;
  onDeletePress: (tagId: string) => void;
};

export const createTagInventoryColumns = ({
  onEditPress,
  onDeletePress,
}: TagInventoryColumnHandlers): InventoryLayoutColumn<TagInventoryRow>[] => [
  {
    id: 'id',
    header: 'Id',
    minWidth: 120,
    sortField: TagListSortBy.Id,
    renderCell: (row) => <TagIdCell tagId={row.node.id} />,
  },
  {
    id: 'name',
    header: 'Name',
    minWidth: 220,
    isRowHeader: true,
    sortField: TagListSortBy.Name,
    renderCell: (row) => <TagNameCell tagId={row.node.id} />,
  },
  {
    id: 'booksCount',
    header: 'Books count',
    minWidth: 160,
    sortField: TagListSortBy.BookCount,
    renderCell: (row) => <TagBooksCountCell tagId={row.node.id} />,
  },
  {
    id: 'books',
    header: 'Books',
    minWidth: 300,
    renderCell: (row) => <TagBooksCell tagId={row.node.id} />,
  },
  {
    id: 'actions',
    header: 'Actions',
    minWidth: 160,
    renderCell: (row) => (
      <TagActionsCell
        tagId={row.node.id}
        onEditPress={onEditPress}
        onDeletePress={onDeletePress}
      />
    ),
  },
];
