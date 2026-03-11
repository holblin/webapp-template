import { useMutation } from '@apollo/client/react';
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
import { useState } from 'react';
import { toCalendarDate } from 'src/features/inventory/date';
import { BOOK_CREATE_MUTATION } from './CreateBookDialog.graphql';
import { getBookDialogRequiredFieldError } from './bookDialogRequiredFields';

type CreateBookDialogProps = {
  onCompleted?: () => void;
};

export const CreateBookDialog = ({ onCompleted }: CreateBookDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [bookCreate, { loading }] = useMutation(BOOK_CREATE_MUTATION);

  return (
    <Dialog>
      {({ close }) => (
        <>
          <Heading slot="title">Create book</Heading>
          <Content>
            <Form>
              <TextField label="Title" value={title} onChange={setTitle} isRequired />
              <TextArea label="Description" value={description} onChange={setDescription} isRequired />
              <TextField label="Author" value={authorName} onChange={setAuthorName} isRequired />
              <DatePicker
                label="Publication date"
                value={toCalendarDate(publicationDate)}
                onChange={(value) => setPublicationDate(value?.toString() ?? '')}
                isRequired
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
                  authorName,
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
                        author: authorName.trim(),
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
