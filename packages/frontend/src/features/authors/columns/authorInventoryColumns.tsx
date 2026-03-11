import { AuthorListSortBy, type AuthorInventoryRowFragmentFragment } from 'src/__generated__/gql/graphql';
import type { InventoryLayoutColumn } from 'src/components/Inventory/InventoryLayout';
import { AuthorActionsCell } from 'src/features/authors/fragments/AuthorActionsCell/AuthorActionsCell';
import { AuthorBioCell } from 'src/features/authors/fragments/AuthorBioCell/AuthorBioCell';
import { AuthorBirthDateCell } from 'src/features/authors/fragments/AuthorBirthDateCell/AuthorBirthDateCell';
import { AuthorBooksCountCell } from 'src/features/authors/fragments/AuthorBooksCountCell/AuthorBooksCountCell';
import { AuthorCountryCell } from 'src/features/authors/fragments/AuthorCountryCell/AuthorCountryCell';
import { AuthorIdCell } from 'src/features/authors/fragments/AuthorIdCell/AuthorIdCell';
import { AuthorIsActiveCell } from 'src/features/authors/fragments/AuthorIsActiveCell/AuthorIsActiveCell';
import { AuthorNameCell } from 'src/features/authors/fragments/AuthorNameCell/AuthorNameCell';
export type AuthorInventoryNode = AuthorInventoryRowFragmentFragment;

export type AuthorInventoryRow = {
  cursor: string;
  node: AuthorInventoryNode;
};

type AuthorInventoryColumnHandlers = {
  onEditPress: (authorId: string) => void;
  onDeletePress: (authorId: string) => void;
};

export const createAuthorInventoryColumns = ({
  onEditPress,
  onDeletePress,
}: AuthorInventoryColumnHandlers): InventoryLayoutColumn<AuthorInventoryRow>[] => [
  {
    id: 'id',
    header: 'Id',
    sortField: AuthorListSortBy.Id,
    renderCell: (row) => <AuthorIdCell authorId={row.node.id} />,
  },
  {
    id: 'name',
    header: 'Name',
    isRowHeader: true,
    sortField: AuthorListSortBy.Name,
    renderCell: (row) => <AuthorNameCell authorId={row.node.id} />,
  },
  {
    id: 'bio',
    header: 'Bio',
    renderCell: (row) => <AuthorBioCell authorId={row.node.id} />,
  },
  {
    id: 'country',
    header: 'Country',
    renderCell: (row) => <AuthorCountryCell authorId={row.node.id} />,
  },
  {
    id: 'isActive',
    header: 'Active',
    renderCell: (row) => <AuthorIsActiveCell authorId={row.node.id} />,
  },
  {
    id: 'birthDate',
    header: 'Birth date',
    renderCell: (row) => <AuthorBirthDateCell authorId={row.node.id} />,
  },
  {
    id: 'books',
    header: 'Books',
    renderCell: (row) => <AuthorBooksCountCell authorId={row.node.id} />,
  },
  {
    id: 'actions',
    header: 'Actions',
    renderCell: (row) => (
      <AuthorActionsCell
        authorId={row.node.id}
        onEditPress={onEditPress}
        onDeletePress={onDeletePress}
      />
    ),
  },
];
