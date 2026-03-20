import { useMutation } from '@apollo/client/react';
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
import { useState } from 'react';
import { BookSelectionField } from 'src/features/tags/components/BookSelectionField/BookSelectionField';
import type { SelectionOption } from 'src/features/tags/components/BookSelectionField/BookSelectionField.types';
import { TAG_CREATE_MUTATION } from './CreateTagDialog.graphql';

type CreateTagDialogProps = {
  onCompleted?: () => void;
  books?: SelectionOption[];
};

export const CreateTagDialog = ({ onCompleted, books = [] }: CreateTagDialogProps) => {
  const [name, setName] = useState('');
  const [selectedBooks, setSelectedBooks] = useState<SelectionOption[]>([]);
  const [tagCreate, { loading }] = useMutation(TAG_CREATE_MUTATION);

  return (
    <Dialog>
      {({ close }) => (
        <>
          <Heading slot="title">Create tag</Heading>
          <Content>
            <Form>
              <TextField label="Name" value={name} onChange={setName} isRequired />
              <BookSelectionField
                options={books}
                selectedOptions={selectedBooks}
                onSelectedOptionsChange={setSelectedBooks}
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
                if (!name.trim()) {
                  ToastQueue.negative('Tag name is required.');
                  return;
                }

                const bookIds = selectedBooks.map((book) => book.id);

                try {
                  await tagCreate({
                    variables: {
                      input: {
                        name: name.trim(),
                        bookIds: bookIds.length > 0 ? bookIds : undefined,
                      },
                    },
                    refetchQueries: 'active',
                  });
                  ToastQueue.positive('Tag created successfully.');
                  onCompleted?.();
                  close();
                } catch (caughtError) {
                  const message = caughtError instanceof Error ? caughtError.message : 'Failed to create tag.';
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
