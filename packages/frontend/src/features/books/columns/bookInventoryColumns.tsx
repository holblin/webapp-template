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
    sortField: BookListSortBy.Id,
    renderCell: (row) => <BookIdCell bookId={row.node.id} />,
  },
  {
    id: 'title',
    header: 'Title',
    isRowHeader: true,
    sortField: BookListSortBy.Title,
    renderCell: (row) => <BookTitleCell bookId={row.node.id} />,
  },
  {
    id: 'description',
    header: 'Description',
    renderCell: (row) => <BookDescriptionCell bookId={row.node.id} />,
  },
  {
    id: 'publicationDate',
    header: 'Publication date',
    renderCell: (row) => <BookPublicationDateCell bookId={row.node.id} />,
  },
  {
    id: 'author',
    header: 'Author',
    sortField: BookListSortBy.AuthorName,
    renderCell: (row) => <BookAuthorCell bookId={row.node.id} />,
  },
  {
    id: 'tags',
    header: 'Tags',
    renderCell: (row) => <BookTagsCell bookId={row.node.id} />,
  },
  {
    id: 'actions',
    header: 'Actions',
    renderCell: (row) => (
      <BookActionsCell
        bookId={row.node.id}
        onEditPress={onEditPress}
        onDeletePress={onDeletePress}
      />
    ),
  },
];
