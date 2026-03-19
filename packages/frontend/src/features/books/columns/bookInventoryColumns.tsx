import { BookListSortBy, type BookInventoryRowFragmentFragment } from 'src/__generated__/gql/graphql';
import type { InventoryLayoutColumn } from 'src/components/Inventory/InventoryLayout';
import { BookActionsCell } from 'src/features/books/fragments/BookActionsCell/BookActionsCell';
import { BookAuthorCell } from 'src/features/books/fragments/BookAuthorCell/BookAuthorCell';
import { BookDescriptionCell } from 'src/features/books/fragments/BookDescriptionCell/BookDescriptionCell';
import { BookIdCell } from 'src/features/books/fragments/BookIdCell/BookIdCell';
import { BookPublicationDateCell } from 'src/features/books/fragments/BookPublicationDateCell/BookPublicationDateCell';
import { BookTagsCell } from 'src/features/books/fragments/BookTagsCell/BookTagsCell';
import { BookTitleCell } from 'src/features/books/fragments/BookTitleCell/BookTitleCell';

export type BookInventoryNode = BookInventoryRowFragmentFragment;

export type BookInventoryRow = {
  cursor: string;
  node: BookInventoryNode;
};

type BookInventoryColumnHandlers = {
  onEditPress: (bookId: string) => void;
  onDeletePress: (bookId: string) => void;
};

export const createBookInventoryColumns = ({
  onEditPress,
  onDeletePress,
}: BookInventoryColumnHandlers): InventoryLayoutColumn<BookInventoryRow>[] => [
  {
    id: 'id',
    header: 'Id',
    minWidth: 120,
    sortField: BookListSortBy.Id,
    renderCell: (row) => <BookIdCell bookId={row.node.id} />,
  },
  {
    id: 'title',
    header: 'Title',
    minWidth: 220,
    isRowHeader: true,
    sortField: BookListSortBy.Title,
    renderCell: (row) => <BookTitleCell bookId={row.node.id} />,
  },
  {
    id: 'description',
    header: 'Description',
    minWidth: 320,
    renderCell: (row) => <BookDescriptionCell bookId={row.node.id} />,
  },
  {
    id: 'publicationDate',
    header: 'Publication date',
    minWidth: 180,
    renderCell: (row) => <BookPublicationDateCell bookId={row.node.id} />,
  },
  {
    id: 'author',
    header: 'Author',
    minWidth: 220,
    sortField: BookListSortBy.AuthorName,
    renderCell: (row) => <BookAuthorCell bookId={row.node.id} />,
  },
  {
    id: 'tags',
    header: 'Tags',
    minWidth: 240,
    renderCell: (row) => <BookTagsCell bookId={row.node.id} />,
  },
  {
    id: 'actions',
    header: 'Actions',
    minWidth: 160,
    renderCell: (row) => (
      <BookActionsCell
        bookId={row.node.id}
        onEditPress={onEditPress}
        onDeletePress={onDeletePress}
      />
    ),
  },
];
