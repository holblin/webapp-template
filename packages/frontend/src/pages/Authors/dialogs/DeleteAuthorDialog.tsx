import { useMutation, useQuery } from '@apollo/client/react';
import { useFragment } from '@apollo/client/react';
import {
  Button,
  ButtonGroup,
  Column,
  Content,
  Dialog,
  Heading,
  Row,
  TableBody,
  TableHeader,
  TableView,
  ToastQueue,
  type SortDescriptor,
} from '@react-spectrum/s2';
import { style } from '@react-spectrum/s2/style' with { type: 'macro' };
import { useMemo, useState } from 'react';
import { BookListSortBy, SortDirection } from 'src/__generated__/gql/graphql';
import { graphql } from 'src/__generated__/gql';
import { CellText } from 'src/components/Table/CellText';

const AUTHOR_DIALOG_FRAGMENT = graphql(`
  fragment AuthorDeleteDialogFragment on Author {
    id
    name
  }
`);

const AUTHOR_BY_ID_QUERY = graphql(`
  query AuthorByIdForDeleteDialogQuery($id: ID!) {
    authorById(id: $id) {
      id
      name
      ...AuthorDeleteDialogFragment
    }
  }
`);

const AUTHOR_REFERENCES_QUERY = graphql(`
  query AuthorReferencesQuery(
    $filter: BookListWhereInput
    $sort: BookListSortInput
    $limit: Int
  ) {
    bookList(filter: $filter, sort: $sort, limit: $limit) {
      totalCount
      edges {
        node {
          id
          title
        }
      }
    }
  }
`);

const AUTHOR_DELETE_MUTATION = graphql(`
  mutation AuthorDelete($input: AuthorDeleteInput!) {
    authorDelete(input: $input) {
      success
      message
    }
  }
`);

type DeleteAuthorDialogProps = {
  authorId: string;
  onCompleted?: () => void;
};

type ReferenceSortDirection = SortDirection.Asc | SortDirection.Desc;

export const DeleteAuthorDialog = ({ authorId, onCompleted }: DeleteAuthorDialogProps) => {
  const [sortDirection, setSortDirection] = useState<ReferenceSortDirection>(SortDirection.Asc);
  const sortDescriptor: SortDescriptor = {
    column: 'title',
    direction: sortDirection === SortDirection.Asc ? 'ascending' : 'descending',
  };

  const { data: fragmentData, complete } = useFragment({
    fragment: AUTHOR_DIALOG_FRAGMENT,
    from: {
      __typename: 'Author',
      id: authorId,
    },
  });

  const { data: authorQueryData, loading: isAuthorLoading } = useQuery(AUTHOR_BY_ID_QUERY, {
    variables: { id: authorId },
    skip: complete,
    fetchPolicy: 'network-only',
  });

  const author = useMemo(() => {
    if (complete && fragmentData) {
      return fragmentData;
    }

    return authorQueryData?.authorById ?? null;
  }, [authorQueryData, complete, fragmentData]);

  const { data, loading, error, refetch } = useQuery(AUTHOR_REFERENCES_QUERY, {
    variables: {
      filter: { authorId },
      sort: { by: BookListSortBy.Title, direction: sortDirection },
      limit: 50,
    },
    fetchPolicy: 'network-only',
  });

  const [authorDelete, { loading: isDeleting }] = useMutation(AUTHOR_DELETE_MUTATION);

  if (loading || isAuthorLoading) {
    return (
      <Dialog>
        <Heading slot="title">Checking references</Heading>
        <Content>
          <p className={style({ marginY: 0 })}>Loading dependencies...</p>
        </Content>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog>
        {({ close }) => (
          <>
            <Heading slot="title">Reference check failed</Heading>
            <Content>
              <p className={style({ marginTop: 0 })}>Could not verify references: {error.message}</p>
            </Content>
            <ButtonGroup>
              <Button variant="secondary" onPress={close}>
                Close
              </Button>
              <Button variant="accent" onPress={() => void refetch()}>
                Retry
              </Button>
            </ButtonGroup>
          </>
        )}
      </Dialog>
    );
  }

  const references = (data?.bookList.edges ?? []).map((edge) => edge.node);
  const hasReferences = (data?.bookList.totalCount ?? 0) > 0;

  if (hasReferences) {
    return (
      <Dialog>
        {({ close }) => (
          <>
            <Heading slot="title">Cannot delete {author?.name ?? 'author'}</Heading>
            <Content>
              <p className={style({ marginTop: 0 })}>
                This author is still referenced by {data?.bookList.totalCount ?? references.length} book(s).
              </p>
              <TableView
                aria-label="Author references"
                styles={style({ width: 'full', maxHeight: 280 })}
                sortDescriptor={sortDescriptor}
                onSortChange={(descriptor) => {
                  if (descriptor.column !== 'title') {
                    return;
                  }
                  setSortDirection(descriptor.direction === 'ascending' ? SortDirection.Asc : SortDirection.Desc);
                }}
              >
                <TableHeader>
                  <Column id="title" isRowHeader allowsSorting allowsResizing>Book title</Column>
                </TableHeader>
                <TableBody items={references}>
                  {(item) => (
                    <Row id={item.id}>
                      <CellText>{item.title}</CellText>
                    </Row>
                  )}
                </TableBody>
              </TableView>
            </Content>
            <ButtonGroup>
              <Button variant="accent" onPress={close}>
                Close
              </Button>
            </ButtonGroup>
          </>
        )}
      </Dialog>
    );
  }

  return (
    <Dialog>
      {({ close }) => (
        <>
          <Heading slot="title">Delete {author?.name ?? 'author'}</Heading>
          <Content>
            <p className={style({ marginY: 0 })}>This action cannot be undone.</p>
          </Content>
          <ButtonGroup>
            <Button variant="secondary" onPress={close}>
              Cancel
            </Button>
            <Button
              variant="negative"
              isPending={isDeleting}
              onPress={() => {
                void (async () => {
                  try {
                    await authorDelete({
                      variables: {
                        input: {
                          id: authorId,
                        },
                      },
                      refetchQueries: 'active',
                    });
                    ToastQueue.positive('Author deleted successfully.');
                    onCompleted?.();
                    close();
                  } catch (caughtError) {
                    const message = caughtError instanceof Error ? caughtError.message : 'Failed to delete author.';
                    ToastQueue.negative(message);
                  }
                })();
              }}
            >
              Delete
            </Button>
          </ButtonGroup>
        </>
      )}
    </Dialog>
  );
};
