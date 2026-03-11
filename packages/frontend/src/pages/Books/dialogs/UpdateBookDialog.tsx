import { useFragment, useMutation, useQuery } from '@apollo/client/react';
import {
  Button,
  ButtonGroup,
  Content,
  DatePicker,
  Dialog,
  Form,
  Heading,
  TextArea,
  TextField,
  ToastQueue,
} from '@react-spectrum/s2';
import { useMemo, useState } from 'react';
import { toCalendarDate } from 'src/features/inventory/date';
import {
  BOOK_BY_ID_QUERY,
  BOOK_DIALOG_FRAGMENT,
  BOOK_UPDATE_MUTATION,
} from './UpdateBookDialog.graphql';
import { getBookDialogRequiredFieldError } from './bookDialogRequiredFields';

type UpdateBookDialogProps = {
  bookId: string;
  onCompleted?: () => void;
};

export const UpdateBookDialog = ({ bookId, onCompleted }: UpdateBookDialogProps) => {
  const [draftTitle, setDraftTitle] = useState<string | null>(null);
  const [draftDescription, setDraftDescription] = useState<string | null>(null);
  const [draftAuthorName, setDraftAuthorName] = useState<string | null>(null);
  const [draftPublicationDate, setDraftPublicationDate] = useState<string | null>(null);

  const { data: fragmentData, complete } = useFragment({
    fragment: BOOK_DIALOG_FRAGMENT,
    from: {
      __typename: 'Book',
      id: bookId,
    },
  });

  const { data: queryData, loading: isLoadingBook } = useQuery(BOOK_BY_ID_QUERY, {
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

  const title = draftTitle ?? book?.title ?? '';
  const description = draftDescription ?? book?.description ?? '';
  const authorName = draftAuthorName ?? book?.author.name ?? '';
  const publicationDate = draftPublicationDate ?? book?.publicationDate ?? '';

  const [bookUpdate, { loading: isSaving }] = useMutation(BOOK_UPDATE_MUTATION);

  return (
    <Dialog>
      {({ close }) => (
        <>
          <Heading slot="title">Update book</Heading>
          <Content>
            <Form>
              <TextField
                label="Title"
                value={title}
                onChange={setDraftTitle}
                isRequired
                isDisabled={isLoadingBook || !book}
              />
              <TextArea
                label="Description"
                value={description}
                onChange={setDraftDescription}
                isRequired
                isDisabled={isLoadingBook || !book}
              />
              <TextField
                label="Author"
                value={authorName}
                onChange={setDraftAuthorName}
                isRequired
                isDisabled={isLoadingBook || !book}
              />
              <DatePicker
                label="Publication date"
                value={toCalendarDate(publicationDate)}
                onChange={(value) => setDraftPublicationDate(value?.toString() ?? '')}
                isRequired
                isDisabled={isLoadingBook || !book}
              />
            </Form>
          </Content>
          <ButtonGroup>
            <Button variant="secondary" onPress={close}>
              Cancel
            </Button>
            <Button
              variant="accent"
              isPending={isSaving}
              isDisabled={isLoadingBook || !book}
              onPress={async () => {
                const requiredFieldError = getBookDialogRequiredFieldError({
                  title,
                  description,
                  authorName,
                  publicationDate,
                });

                if (requiredFieldError) {
                  ToastQueue.negative(requiredFieldError);
                  return;
                }

                try {
                  await bookUpdate({
                    variables: {
                      input: {
                        id: bookId,
                        title: title.trim(),
                        description: description.trim(),
                        author: authorName.trim(),
                        publicationDate: publicationDate.trim(),
                      },
                    },
                    refetchQueries: 'active',
                  });
                  ToastQueue.positive('Book updated successfully.');
                  onCompleted?.();
                  close();
                } catch (caughtError) {
                  const message = caughtError instanceof Error ? caughtError.message : 'Failed to update book.';
                  ToastQueue.negative(message);
                }
              }}
            >
              Save
            </Button>
          </ButtonGroup>
        </>
      )}
    </Dialog>
  );
};
