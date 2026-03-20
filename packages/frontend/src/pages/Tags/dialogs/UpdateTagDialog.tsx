import { useFragment, useMutation, useQuery } from '@apollo/client/react';
import {
  Button,
  ButtonGroup,
  Content,
  Dialog,
  Form,
  Heading,
  TextField,
  ToastQueue,
} from '@react-spectrum/s2';
import { useMemo, useState } from 'react';
import { BookSelectionField } from 'src/features/tags/components/BookSelectionField/BookSelectionField';
import type { SelectionOption } from 'src/features/tags/components/BookSelectionField/BookSelectionField.types';
import {
  TAG_BY_ID_QUERY,
  TAG_DIALOG_FRAGMENT,
  TAG_UPDATE_MUTATION,
} from './UpdateTagDialog.graphql';

type UpdateTagDialogProps = {
  tagId: string;
  onCompleted?: () => void;
  books?: SelectionOption[];
};

export const UpdateTagDialog = ({ tagId, onCompleted, books = [] }: UpdateTagDialogProps) => {
  const [draftName, setDraftName] = useState<string | null>(null);
  const [draftBooks, setDraftBooks] = useState<SelectionOption[] | null>(null);

  const { data: fragmentData, complete } = useFragment({
    fragment: TAG_DIALOG_FRAGMENT,
    from: {
      __typename: 'Tag',
      id: tagId,
    },
  });

  const { data: queryData, loading: isLoadingTag } = useQuery(TAG_BY_ID_QUERY, {
    variables: { id: tagId },
    skip: complete,
    fetchPolicy: 'network-only',
  });

  const tag = useMemo(() => {
    if (complete && fragmentData) {
      return fragmentData;
    }

    return queryData?.tagById ?? null;
  }, [complete, fragmentData, queryData]);

  const name = draftName ?? tag?.name ?? '';
  const selectedBooks = draftBooks ?? (tag?.books ?? []).map((book) => ({
    id: book.id,
    label: book.title,
  }));

  const availableBooks = useMemo(() => {
    const byId = new Map<string, SelectionOption>();

    for (const book of books) {
      byId.set(book.id, book);
    }

    for (const book of selectedBooks) {
      if (!byId.has(book.id)) {
        byId.set(book.id, book);
      }
    }

    return Array.from(byId.values());
  }, [books, selectedBooks]);

  const [tagUpdate, { loading: isSaving }] = useMutation(TAG_UPDATE_MUTATION);

  return (
    <Dialog>
      {({ close }) => (
        <>
          <Heading slot="title">Update tag</Heading>
          <Content>
            <Form>
              <TextField
                label="Name"
                value={name}
                onChange={setDraftName}
                isRequired
                isDisabled={isLoadingTag || !tag}
              />
              <BookSelectionField
                options={availableBooks}
                selectedOptions={selectedBooks}
                onSelectedOptionsChange={(nextBooks) => setDraftBooks(nextBooks)}
                isDisabled={isLoadingTag || !tag}
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
              isDisabled={isLoadingTag || !tag}
              onPress={async () => {
                if (!name.trim()) {
                  ToastQueue.negative('Tag name is required.');
                  return;
                }

                const bookIds = selectedBooks.map((book) => book.id);

                try {
                  await tagUpdate({
                    variables: {
                      input: {
                        id: tagId,
                        name: name.trim(),
                        bookIds,
                      },
                    },
                    refetchQueries: 'active',
                  });
                  ToastQueue.positive('Tag updated successfully.');
                  onCompleted?.();
                  close();
                } catch (caughtError) {
                  const message = caughtError instanceof Error ? caughtError.message : 'Failed to update tag.';
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
