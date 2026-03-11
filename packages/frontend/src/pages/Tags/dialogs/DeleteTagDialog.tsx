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
  TAG_BY_ID_FOR_DELETE_QUERY,
  TAG_DELETE_DIALOG_FRAGMENT,
  TAG_DELETE_MUTATION,
} from './DeleteTagDialog.graphql';

type DeleteTagDialogProps = {
  tagId: string;
  onCompleted?: () => void;
};

export const DeleteTagDialog = ({ tagId, onCompleted }: DeleteTagDialogProps) => {
  const { data: fragmentData, complete } = useFragment({
    fragment: TAG_DELETE_DIALOG_FRAGMENT,
    from: {
      __typename: 'Tag',
      id: tagId,
    },
  });

  const { data: queryData, loading: isLoadingTag } = useQuery(TAG_BY_ID_FOR_DELETE_QUERY, {
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

  const [tagDelete, { loading: isDeleting }] = useMutation(TAG_DELETE_MUTATION);

  return (
    <Dialog>
      {({ close }) => (
        <>
          <Heading slot="title">Delete {tag?.name ?? 'tag'}</Heading>
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
              isDisabled={isLoadingTag}
              onPress={() => {
                void (async () => {
                  try {
                    await tagDelete({
                      variables: {
                        input: { id: tagId },
                      },
                      refetchQueries: 'active',
                    });
                    ToastQueue.positive('Tag deleted successfully.');
                    onCompleted?.();
                    close();
                  } catch (caughtError) {
                    const message = caughtError instanceof Error ? caughtError.message : 'Failed to delete tag.';
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
