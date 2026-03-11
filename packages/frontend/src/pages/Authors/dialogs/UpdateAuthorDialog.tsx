import { useMutation, useQuery } from '@apollo/client/react';
import { useFragment } from '@apollo/client/react';
import {
  Button,
  ButtonGroup,
  Content,
  DatePicker,
  Dialog,
  Form,
  Heading,
  Picker,
  PickerItem,
  TextArea,
  TextField,
  ToastQueue,
} from '@react-spectrum/s2';
import { useMemo, useState } from 'react';
import { graphql } from 'src/__generated__/gql';
import { AuthorCountry } from 'src/__generated__/gql/graphql';
import { toCalendarDate } from 'src/features/inventory/date';
import { getRequiredFieldError } from 'src/features/inventory/validation';

const AUTHOR_UPDATE_MUTATION = graphql(`
  mutation AuthorUpdate($input: AuthorUpdateInput!) {
    authorUpdate(input: $input) {
      success
      message
    }
  }
`);

const AUTHOR_DIALOG_FRAGMENT = graphql(`
  fragment AuthorDialogFragment on Author {
    id
    name
    bio
    country
    isActive
    birthDate
  }
`);

const AUTHOR_BY_ID_QUERY = graphql(`
  query AuthorByIdForDialogQuery($id: ID!) {
    authorById(id: $id) {
      id
      name
      bio
      country
      isActive
      birthDate
      ...AuthorDialogFragment
    }
  }
`);

type UpdateAuthorDialogProps = {
  authorId: string;
  onCompleted?: () => void;
};

export const UpdateAuthorDialog = ({ authorId, onCompleted }: UpdateAuthorDialogProps) => {
  const [draftName, setDraftName] = useState<string | null>(null);
  const [draftBio, setDraftBio] = useState<string | null>(null);
  const [draftCountry, setDraftCountry] = useState<AuthorCountry | null>(null);
  const [draftIsActive, setDraftIsActive] = useState<string | null>(null);
  const [draftBirthDate, setDraftBirthDate] = useState<string | null>(null);

  const { data: fragmentData, complete } = useFragment({
    fragment: AUTHOR_DIALOG_FRAGMENT,
    from: {
      __typename: 'Author',
      id: authorId,
    },
  });

  const { data: queryData, loading: isLoadingAuthor } = useQuery(AUTHOR_BY_ID_QUERY, {
    variables: { id: authorId },
    skip: complete,
    fetchPolicy: 'network-only',
  });

  const author = useMemo(() => {
    if (complete && fragmentData) {
      return fragmentData;
    }

    return queryData?.authorById ?? null;
  }, [complete, fragmentData, queryData]);
  const name = draftName ?? author?.name ?? '';
  const bio = draftBio ?? author?.bio ?? '';
  const country = draftCountry ?? author?.country ?? AuthorCountry.Us;
  const isActive = draftIsActive ?? String(author?.isActive ?? true);
  const birthDate = draftBirthDate ?? author?.birthDate ?? '';

  const [authorUpdate, { loading: isSaving }] = useMutation(AUTHOR_UPDATE_MUTATION);

  return (
    <Dialog>
      {({ close }) => (
        <>
          <Heading slot="title">Update author</Heading>
          <Content>
            <Form>
              <TextField
                label="Name"
                value={name}
                onChange={setDraftName}
                isRequired
                isDisabled={isLoadingAuthor || !author}
              />
              <TextArea
                label="Bio"
                value={bio}
                onChange={setDraftBio}
                isRequired
                isDisabled={isLoadingAuthor || !author}
              />
              <Picker
                label="Country"
                value={country}
                onChange={(value) => setDraftCountry(String(value) as AuthorCountry)}
                isDisabled={isLoadingAuthor || !author}
              >
                <PickerItem id={AuthorCountry.Us}>US</PickerItem>
                <PickerItem id={AuthorCountry.Gb}>GB</PickerItem>
                <PickerItem id={AuthorCountry.Fr}>FR</PickerItem>
                <PickerItem id={AuthorCountry.De}>DE</PickerItem>
                <PickerItem id={AuthorCountry.Jp}>JP</PickerItem>
                <PickerItem id={AuthorCountry.Ca}>CA</PickerItem>
              </Picker>
              <Picker
                label="Active"
                value={isActive}
                onChange={(value) => setDraftIsActive(String(value))}
                isDisabled={isLoadingAuthor || !author}
              >
                <PickerItem id="true">Yes</PickerItem>
                <PickerItem id="false">No</PickerItem>
              </Picker>
              <DatePicker
                label="Birth date"
                value={toCalendarDate(birthDate)}
                onChange={(value) => setDraftBirthDate(value?.toString() ?? '')}
                isRequired
                isDisabled={isLoadingAuthor || !author}
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
              isDisabled={isLoadingAuthor || !author}
              onPress={async () => {
                const requiredFieldError = getRequiredFieldError([
                  { value: name, message: 'Author name is required.' },
                  { value: bio, message: 'Author bio is required.' },
                  { value: birthDate, message: 'Author birth date is required.' },
                ]);

                if (requiredFieldError) {
                  ToastQueue.negative(requiredFieldError);
                  return;
                }

                try {
                  await authorUpdate({
                    variables: {
                      input: {
                        id: authorId,
                        name: name.trim(),
                        bio: bio.trim(),
                        country,
                        isActive: isActive === 'true',
                        birthDate: birthDate.trim(),
                      },
                    },
                    refetchQueries: 'active',
                  });
                  ToastQueue.positive('Author updated successfully.');
                  onCompleted?.();
                  close();
                } catch (caughtError) {
                  const message = caughtError instanceof Error ? caughtError.message : 'Failed to update author.';
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
