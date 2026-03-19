import { useMutation } from '@apollo/client/react';
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
import { useCallback, useEffect, useState } from 'react';
import { graphql } from 'src/__generated__/gql';
import { AuthorCountry } from 'src/__generated__/gql/graphql';
import { toCalendarDate } from 'src/features/inventory/date';
import { getRequiredFieldError } from 'src/features/inventory/validation';

const AUTHOR_CREATE_MUTATION = graphql(`
  mutation AuthorCreate($input: AuthorCreateInput!) {
    authorCreate(input: $input) {
      success
      message
    }
  }
`);

type CreateAuthorDialogProps = {
  onCompleted?: () => void;
  openCycle: number;
};

type CreateAuthorFormErrors = {
  name?: string;
  bio?: string;
  birthDate?: string;
};

export const CreateAuthorDialog = ({ onCompleted, openCycle }: CreateAuthorDialogProps) => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [country, setCountry] = useState<AuthorCountry>(AuthorCountry.Us);
  const [isActive, setIsActive] = useState('true');
  const [birthDate, setBirthDate] = useState('');
  const [errors, setErrors] = useState<CreateAuthorFormErrors>({});
  const [authorCreate, { loading }] = useMutation(AUTHOR_CREATE_MUTATION);
  const resetForm = useCallback(() => {
    setName('');
    setBio('');
    setCountry(AuthorCountry.Us);
    setIsActive('true');
    setBirthDate('');
    setErrors({});
  }, []);

  useEffect(() => {
    if (openCycle <= 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      resetForm();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [openCycle, resetForm]);

  return (
    <Dialog>
      {({ close }) => (
        <>
          <Heading slot="title">Create author</Heading>
          <Content>
            <Form>
              <TextField
                label="Name"
                value={name}
                onChange={(value) => {
                  setName(value);
                  if (value.trim() && errors.name) {
                    setErrors((current) => ({ ...current, name: undefined }));
                  }
                }}
                isRequired
                isInvalid={Boolean(errors.name)}
                errorMessage={errors.name}
              />
              <TextArea
                label="Bio"
                value={bio}
                onChange={(value) => {
                  setBio(value);
                  if (value.trim() && errors.bio) {
                    setErrors((current) => ({ ...current, bio: undefined }));
                  }
                }}
                isRequired
                isInvalid={Boolean(errors.bio)}
                errorMessage={errors.bio}
              />
              <Picker label="Country" value={country} onChange={(value) => setCountry(String(value) as AuthorCountry)}>
                <PickerItem id={AuthorCountry.Us}>US</PickerItem>
                <PickerItem id={AuthorCountry.Gb}>GB</PickerItem>
                <PickerItem id={AuthorCountry.Fr}>FR</PickerItem>
                <PickerItem id={AuthorCountry.De}>DE</PickerItem>
                <PickerItem id={AuthorCountry.Jp}>JP</PickerItem>
                <PickerItem id={AuthorCountry.Ca}>CA</PickerItem>
              </Picker>
              <Picker label="Active" value={isActive} onChange={(value) => setIsActive(String(value))}>
                <PickerItem id="true">Yes</PickerItem>
                <PickerItem id="false">No</PickerItem>
              </Picker>
              <DatePicker
                label="Birth date"
                value={toCalendarDate(birthDate)}
                onChange={(value) => {
                  const nextBirthDate = value?.toString() ?? '';
                  setBirthDate(nextBirthDate);
                  if (nextBirthDate.trim() && errors.birthDate) {
                    setErrors((current) => ({ ...current, birthDate: undefined }));
                  }
                }}
                isRequired
                isInvalid={Boolean(errors.birthDate)}
                errorMessage={errors.birthDate}
              />
            </Form>
          </Content>
          <ButtonGroup>
            <Button
              variant="secondary"
              onPress={close}
            >
              Cancel
            </Button>
            <Button
              variant="accent"
              isPending={loading}
              onPress={async () => {
                const formErrors: CreateAuthorFormErrors = {
                  name: name.trim() ? undefined : 'Author name is required.',
                  bio: bio.trim() ? undefined : 'Author bio is required.',
                  birthDate: birthDate.trim() ? undefined : 'Author birth date is required.',
                };
                setErrors(formErrors);

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
                  await authorCreate({
                    variables: {
                      input: {
                        name: name.trim(),
                        bio: bio.trim(),
                        country,
                        isActive: isActive === 'true',
                        birthDate: birthDate.trim(),
                      },
                    },
                    refetchQueries: 'active',
                  });
                  ToastQueue.positive('Author created successfully.');
                  onCompleted?.();
                  close();
                } catch (caughtError) {
                  const message = caughtError instanceof Error ? caughtError.message : 'Failed to create author.';
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
