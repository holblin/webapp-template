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
import { toUniqueCsvValues } from 'src/features/inventory/csv';
import {
  TAG_BY_ID_QUERY,
  TAG_DIALOG_FRAGMENT,
  TAG_UPDATE_MUTATION,
} from './UpdateTagDialog.graphql';

type UpdateTagDialogProps = {
  tagId: string;
  onCompleted?: () => void;
};

export const UpdateTagDialog = ({ tagId, onCompleted }: UpdateTagDialogProps) => {
  const [draftName, setDraftName] = useState<string | null>(null);
  const [draftBookIdsRaw, setDraftBookIdsRaw] = useState<string | null>(null);

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
  const bookIdsRaw = draftBookIdsRaw ?? (tag?.books ?? []).map((book) => book.id).join(', ');

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
              <TextField
                label="Book ids (comma-separated)"
                value={bookIdsRaw}
                onChange={setDraftBookIdsRaw}
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

                const bookIds = toUniqueCsvValues(bookIdsRaw);

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
