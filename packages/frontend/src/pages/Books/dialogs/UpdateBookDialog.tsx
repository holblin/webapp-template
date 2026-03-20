import { useFragment, useMutation, useQuery } from '@apollo/client/react';
import {
  Button,
  ButtonGroup,
  ComboBox,
  ComboBoxItem,
  Content,
  DatePicker,
  Dialog,
  Form,
  Heading,
  TextArea,
  TextField,
  ToastQueue,
} from '@react-spectrum/s2';
import { type Key, useMemo, useState } from 'react';
import { toCalendarDate } from 'src/features/inventory/date';
import { BookSelectionField } from 'src/features/tags/components/BookSelectionField/BookSelectionField';
import type { SelectionOption } from 'src/features/tags/components/BookSelectionField/BookSelectionField.types';
import {
  BOOK_BY_ID_QUERY,
  BOOK_DIALOG_FRAGMENT,
  BOOK_UPDATE_MUTATION,
} from './UpdateBookDialog.graphql';
import { getBookDialogRequiredFieldError } from './bookDialogRequiredFields';

type UpdateBookDialogProps = {
  bookId: string;
  onCompleted?: () => void;
  tags?: SelectionOption[];
  authors?: SelectionOption[];
};

export const UpdateBookDialog = ({ bookId, onCompleted, tags = [], authors = [] }: UpdateBookDialogProps) => {
  const [draftTitle, setDraftTitle] = useState<string | null>(null);
  const [draftDescription, setDraftDescription] = useState<string | null>(null);
  const [draftAuthor, setDraftAuthor] = useState<SelectionOption | null>(null);
  const [authorInputValue, setAuthorInputValue] = useState<string | null>(null);
  const [draftPublicationDate, setDraftPublicationDate] = useState<string | null>(null);
  const [draftTags, setDraftTags] = useState<SelectionOption[] | null>(null);

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
  const selectedAuthor = draftAuthor ?? (book?.author
    ? { id: book.author.id, label: book.author.name }
    : null);
  const authorName = selectedAuthor?.label ?? '';
  const authorInputText = authorInputValue ?? authorName;
  const availableAuthors = useMemo(() => {
    const byId = new Map<string, SelectionOption>();
    for (const author of authors) {
      byId.set(author.id, author);
    }
    if (selectedAuthor && !byId.has(selectedAuthor.id)) {
      byId.set(selectedAuthor.id, selectedAuthor);
    }

    const allAuthors = Array.from(byId.values());
    const query = authorInputText.trim().toLowerCase();
    if (!query) {
      return allAuthors;
    }

    return allAuthors.filter((author) => author.label.toLowerCase().includes(query));
  }, [authors, selectedAuthor, authorInputText]);
  const publicationDate = draftPublicationDate ?? book?.publicationDate ?? '';
  const selectedTags = draftTags ?? (book?.tags ?? []).map((tag) => ({
    id: tag.id,
    label: tag.name,
  }));

  const availableTags = useMemo(() => {
    const byId = new Map<string, SelectionOption>();

    for (const tag of tags) {
      byId.set(tag.id, tag);
    }

    for (const tag of selectedTags) {
      if (!byId.has(tag.id)) {
        byId.set(tag.id, tag);
      }
    }

    return Array.from(byId.values());
  }, [tags, selectedTags]);

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
              <ComboBox
                label="Author"
                placeholder="Search and select an author"
                items={availableAuthors}
                inputValue={authorInputText}
                onInputChange={(value) => {
                  setAuthorInputValue(value);
                  if (selectedAuthor && value !== selectedAuthor.label) {
                    setDraftAuthor(null);
                  }
                }}
                onSelectionChange={(key: Key | null) => {
                  if (key == null) {
                    setDraftAuthor(null);
                    return;
                  }

                  const selectedId = String(key);
                  const author = availableAuthors.find((entry) => entry.id === selectedId) ?? null;
                  setDraftAuthor(author);
                  setAuthorInputValue(author?.label ?? '');
                }}
                isRequired
                isDisabled={isLoadingBook || !book}
              >
                {(item) => (
                  <ComboBoxItem id={item.id} textValue={item.label}>
                    {item.label}
                  </ComboBoxItem>
                )}
              </ComboBox>
              <DatePicker
                label="Publication date"
                value={toCalendarDate(publicationDate)}
                onChange={(value) => setDraftPublicationDate(value?.toString() ?? '')}
                isRequired
                isDisabled={isLoadingBook || !book}
              />
              <BookSelectionField
                options={availableTags}
                selectedOptions={selectedTags}
                onSelectedOptionsChange={(nextTags) => setDraftTags(nextTags)}
                fieldLabel="Tags"
                selectedLabel="Selected tags"
                placeholder="Search and add a tag"
                emptyStateMessage="No tags selected."
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
                        tagIds: selectedTags.map((tag) => tag.id),
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
