import { useMutation } from '@apollo/client/react';
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
import { BOOK_CREATE_MUTATION } from './CreateBookDialog.graphql';
import { getBookDialogRequiredFieldError } from './bookDialogRequiredFields';

type CreateBookDialogProps = {
  onCompleted?: () => void;
  tags?: SelectionOption[];
  authors?: SelectionOption[];
};

export const CreateBookDialog = ({ onCompleted, tags = [], authors = [] }: CreateBookDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState<SelectionOption | null>(null);
  const [authorInputValue, setAuthorInputValue] = useState('');
  const [selectedTags, setSelectedTags] = useState<SelectionOption[]>([]);
  const [bookCreate, { loading }] = useMutation(BOOK_CREATE_MUTATION);
  const availableAuthors = useMemo(() => {
    const query = authorInputValue.trim().toLowerCase();
    if (!query) {
      return authors;
    }

    return authors.filter((author) => author.label.toLowerCase().includes(query));
  }, [authors, authorInputValue]);

  return (
    <Dialog>
      {({ close }) => (
        <>
          <Heading slot="title">Create book</Heading>
          <Content>
            <Form>
              <TextField label="Title" value={title} onChange={setTitle} isRequired />
              <TextArea label="Description" value={description} onChange={setDescription} isRequired />
              <ComboBox
                label="Author"
                placeholder="Search and select an author"
                items={availableAuthors}
                inputValue={authorInputValue}
                onInputChange={(value) => {
                  setAuthorInputValue(value);
                  if (selectedAuthor && value !== selectedAuthor.label) {
                    setSelectedAuthor(null);
                  }
                }}
                onSelectionChange={(key: Key | null) => {
                  if (key == null) {
                    setSelectedAuthor(null);
                    return;
                  }
                  const selectedId = String(key);
                  const author = authors.find((entry) => entry.id === selectedId) ?? null;
                  setSelectedAuthor(author);
                  setAuthorInputValue(author?.label ?? '');
                }}
                isRequired
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
                onChange={(value) => setPublicationDate(value?.toString() ?? '')}
                isRequired
              />
              <BookSelectionField
                options={tags}
                selectedOptions={selectedTags}
                onSelectedOptionsChange={setSelectedTags}
                fieldLabel="Tags"
                selectedLabel="Selected tags"
                placeholder="Search and add a tag"
                emptyStateMessage="No tags selected."
              />
            </Form>
          </Content>
          <ButtonGroup>
            <Button variant="secondary" onPress={close}>
              Cancel
            </Button>
            <Button
              variant="accent"
              isPending={loading}
              onPress={async () => {
                const requiredFieldError = getBookDialogRequiredFieldError({
                  title,
                  description,
                  authorName: selectedAuthor?.label ?? '',
                  publicationDate,
                });

                if (requiredFieldError) {
                  ToastQueue.negative(requiredFieldError);
                  return;
                }

                try {
                  await bookCreate({
                    variables: {
                      input: {
                        title: title.trim(),
                        description: description.trim(),
                        publicationDate: publicationDate.trim(),
                        author: (selectedAuthor?.label ?? '').trim(),
                        tagIds: selectedTags.map((tag) => tag.id),
                      },
                    },
                    refetchQueries: 'active',
                  });
                  ToastQueue.positive('Book created successfully.');
                  onCompleted?.();
                  close();
                } catch (caughtError) {
                  const message = caughtError instanceof Error ? caughtError.message : 'Failed to create book.';
                  ToastQueue.negative(message);
                }
              }}
            >
              Create
            </Button>
          </ButtonGroup>
        </>
      )}
    </Dialog>
  );
};
