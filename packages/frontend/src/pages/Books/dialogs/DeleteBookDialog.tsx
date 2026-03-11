import { useFragment, useMutation, useQuery } from '@apollo/client/react';
import {
  Button,
  ButtonGroup,
  Content,
  Dialog,
  Heading,
  ToastQueue,
} from '@react-spectrum/s2';
import { useMemo } from 'react';
import {
  BOOK_BY_ID_FOR_DELETE_QUERY,
  BOOK_DELETE_DIALOG_FRAGMENT,
  BOOK_DELETE_MUTATION,
} from './DeleteBookDialog.graphql';

type DeleteBookDialogProps = {
  bookId: string;
  onCompleted?: () => void;
};

export const DeleteBookDialog = ({ bookId, onCompleted }: DeleteBookDialogProps) => {
  const { data: fragmentData, complete } = useFragment({
    fragment: BOOK_DELETE_DIALOG_FRAGMENT,
    from: {
      __typename: 'Book',
      id: bookId,
    },
  });

  const { data: queryData, loading: isLoadingBook } = useQuery(BOOK_BY_ID_FOR_DELETE_QUERY, {
    variables: { id: bookId },
    skip: complete,
    fetchPolicy: 'network-only',
  });

  const book = useMemo(() => {
    if (complete && fragmentData) {
      return fragmentData;
    }

    return queryData?.bookById ?? null;
  }, [complete, fragmentData, queryData]);

  const [bookDelete, { loading: isDeleting }] = useMutation(BOOK_DELETE_MUTATION);

  return (
    <Dialog>
      {({ close }) => (
        <>
          <Heading slot="title">Delete {book?.title ?? 'book'}</Heading>
          <Content>
            <p>This action cannot be undone.</p>
          </Content>
          <ButtonGroup>
            <Button variant="secondary" onPress={close}>
              Cancel
            </Button>
            <Button
              variant="negative"
              isPending={isDeleting}
              isDisabled={isLoadingBook}
              onPress={() => {
                void (async () => {
                  try {
                    await bookDelete({
                      variables: {
                        input: { id: bookId },
                      },
                      refetchQueries: 'active',
                    });
                    ToastQueue.positive('Book deleted successfully.');
                    onCompleted?.();
                    close();
                  } catch (caughtError) {
                    const message = caughtError instanceof Error ? caughtError.message : 'Failed to delete book.';
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
